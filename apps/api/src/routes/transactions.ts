import { Hono } from 'hono';
import { z } from 'zod';
import { db, transactions, transactionItems, customers, pointsHistory, priceLevels, products, rawMaterials, recipes, pointsConfig } from '@mpi/db';
import { eq, and, sql, gte, lte } from 'drizzle-orm';

export const transactionsRoutes = new Hono();

const transactionItemSchema = z.object({
    productId: z.string().uuid().optional(),
    bundleId: z.string().uuid().optional(),
    quantity: z.number().positive(),
    unitPrice: z.number().positive(),
    costPrice: z.number().optional(),
    notes: z.string().optional(),
});

const createTransactionSchema = z.object({
    outletId: z.string().uuid(),
    employeeId: z.string().uuid().optional(),
    customerId: z.string().uuid().optional(),
    shiftId: z.string().uuid().optional(),
    subtotal: z.number().positive(),
    taxAmount: z.number().optional(),
    discountAmount: z.number().optional(),
    total: z.number().positive(),
    paymentMethodId: z.string().uuid().optional(),
    paidAmount: z.number().optional(),
    notes: z.string().optional(),
    items: z.array(transactionItemSchema).min(1),
});

// Generate order number
async function generateOrderNumber(outletId: string): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

    const count = await db.select({ count: sql<number>`count(*)` })
        .from(transactions)
        .where(and(
            eq(transactions.outletId, outletId),
            gte(transactions.createdAt, new Date(today.setHours(0, 0, 0, 0))),
        ));

    const seq = (count[0]?.count || 0) + 1;
    return `MPI-${dateStr}-${seq.toString().padStart(4, '0')}`;
}

// GET /api/transactions
transactionsRoutes.get('/', async (c) => {
    const outletId = c.req.query('outletId');
    const startDate = c.req.query('startDate');
    const endDate = c.req.query('endDate');
    const limit = parseInt(c.req.query('limit') || '50');

    if (!outletId) {
        return c.json({ error: 'outletId is required' }, 400);
    }

    let whereClause = eq(transactions.outletId, outletId);

    const result = await db.query.transactions.findMany({
        where: whereClause,
        with: {
            employee: true,
            appliedLevel: true,
            items: {
                with: {
                    product: true,
                    bundle: true,
                },
            },
        },
        orderBy: (transactions, { desc }) => [desc(transactions.createdAt)],
        limit,
    });

    return c.json(result);
});

// GET /api/transactions/:id
transactionsRoutes.get('/:id', async (c) => {
    const id = c.req.param('id');

    const transaction = await db.query.transactions.findFirst({
        where: eq(transactions.id, id),
        with: {
            employee: true,
            appliedLevel: true,
            paymentMethod: true,
            items: {
                with: {
                    product: true,
                    bundle: true,
                },
            },
        },
    });

    if (!transaction) {
        return c.json({ error: 'Transaction not found' }, 404);
    }

    return c.json(transaction);
});

// POST /api/transactions
transactionsRoutes.post('/', async (c) => {
    try {
        const body = await c.req.json();
        const data = createTransactionSchema.parse(body);

        // Get customer's price level if customer exists
        let appliedLevelId = null;
        let pointsEarned = 0;

        if (data.customerId) {
            const customer = await db.query.customers.findFirst({
                where: eq(customers.id, data.customerId),
            });
            if (customer) {
                appliedLevelId = customer.levelId;

                // Calculate points
                const config = await db.query.pointsConfig.findFirst({
                    where: eq(pointsConfig.outletId, data.outletId),
                });

                if (config && config.isActive) {
                    const pointsPerAmount = parseFloat(config.pointsPerAmount || '10000');
                    pointsEarned = Math.floor(data.total / pointsPerAmount);
                }
            }
        }

        // Generate order number
        const orderNumber = await generateOrderNumber(data.outletId);

        // Calculate change
        const changeAmount = data.paidAmount ? data.paidAmount - data.total : 0;

        // Create transaction
        const [transaction] = await db.insert(transactions).values({
            outletId: data.outletId,
            employeeId: data.employeeId,
            customerId: data.customerId,
            shiftId: data.shiftId,
            orderNumber,
            subtotal: data.subtotal.toString(),
            taxAmount: (data.taxAmount || 0).toString(),
            discountAmount: (data.discountAmount || 0).toString(),
            total: data.total.toString(),
            appliedLevelId,
            pointsEarned,
            paymentMethodId: data.paymentMethodId,
            paymentStatus: 'paid',
            paidAmount: data.paidAmount?.toString(),
            changeAmount: changeAmount.toString(),
            notes: data.notes,
        }).returning();

        // Create transaction items
        await db.insert(transactionItems).values(
            data.items.map((item) => ({
                transactionId: transaction.id,
                productId: item.productId,
                bundleId: item.bundleId,
                quantity: item.quantity.toString(),
                unitPrice: item.unitPrice.toString(),
                subtotal: (item.quantity * item.unitPrice).toString(),
                costPrice: item.costPrice?.toString(),
                notes: item.notes,
            }))
        );

        // Deduct stock for products with recipes
        for (const item of data.items) {
            if (item.productId) {
                const product = await db.query.products.findFirst({
                    where: eq(products.id, item.productId),
                });

                if (product) {
                    // Deduct product stock
                    if (product.trackInventory) {
                        const newStock = parseFloat(product.stockQty || '0') - item.quantity;
                        await db.update(products)
                            .set({ stockQty: newStock.toString() })
                            .where(eq(products.id, item.productId));
                    }

                    // Deduct raw materials based on recipe
                    if (product.hasRecipe) {
                        const productRecipes = await db.query.recipes.findMany({
                            where: eq(recipes.productId, item.productId),
                        });

                        for (const recipe of productRecipes) {
                            const materialQty = parseFloat(recipe.quantity) * item.quantity;

                            const material = await db.query.rawMaterials.findFirst({
                                where: eq(rawMaterials.id, recipe.rawMaterialId),
                            });

                            if (material) {
                                const newMaterialStock = parseFloat(material.stockQty || '0') - materialQty;
                                await db.update(rawMaterials)
                                    .set({ stockQty: newMaterialStock.toString() })
                                    .where(eq(rawMaterials.id, recipe.rawMaterialId));
                            }
                        }
                    }
                }
            }
        }

        // Update customer points if applicable
        if (data.customerId && pointsEarned > 0) {
            const customer = await db.query.customers.findFirst({
                where: eq(customers.id, data.customerId),
            });

            if (customer) {
                const newPoints = (customer.totalPoints || 0) + pointsEarned;
                const newLifetimeSpent = parseFloat(customer.lifetimeSpent || '0') + data.total;

                await db.update(customers)
                    .set({
                        totalPoints: newPoints,
                        lifetimeSpent: newLifetimeSpent.toString(),
                    })
                    .where(eq(customers.id, data.customerId));

                // Add to points history
                await db.insert(pointsHistory).values({
                    customerId: data.customerId,
                    transactionId: transaction.id,
                    pointsEarned,
                    balanceAfter: newPoints,
                    description: `Points from transaction ${orderNumber}`,
                });

                // Check for level upgrade
                const levels = await db.query.priceLevels.findMany({
                    where: eq(priceLevels.outletId, data.outletId),
                    orderBy: (priceLevels, { desc }) => [desc(priceLevels.minPoints)],
                });

                for (const level of levels) {
                    if (newPoints >= (level.minPoints || 0)) {
                        if (customer.levelId !== level.id) {
                            await db.update(customers)
                                .set({ levelId: level.id })
                                .where(eq(customers.id, data.customerId));
                        }
                        break;
                    }
                }
            }
        }

        // Return full transaction
        const result = await db.query.transactions.findFirst({
            where: eq(transactions.id, transaction.id),
            with: {
                items: {
                    with: {
                        product: true,
                    },
                },
            },
        });

        return c.json(result, 201);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return c.json({ error: 'Validation failed', details: error.errors }, 400);
        }
        throw error;
    }
});

// GET /api/transactions/summary - Daily summary
transactionsRoutes.get('/summary/daily', async (c) => {
    const outletId = c.req.query('outletId');
    const date = c.req.query('date') || new Date().toISOString().slice(0, 10);

    if (!outletId) {
        return c.json({ error: 'outletId is required' }, 400);
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const dayTransactions = await db.query.transactions.findMany({
        where: and(
            eq(transactions.outletId, outletId),
            gte(transactions.createdAt, startOfDay),
            lte(transactions.createdAt, endOfDay),
        ),
    });

    const totalSales = dayTransactions.reduce((sum, t) => sum + parseFloat(t.total || '0'), 0);
    const totalTransactions = dayTransactions.length;
    const averageTransaction = totalTransactions > 0 ? totalSales / totalTransactions : 0;

    return c.json({
        date,
        totalSales,
        totalTransactions,
        averageTransaction,
    });
});
