import { Hono } from 'hono';
import { z } from 'zod';
import { db, products, recipes, rawMaterials, productPrices, priceLevels } from '@mpi/db';
import { eq, and, sql } from 'drizzle-orm';

export const productsRoutes = new Hono();

// Validation schemas
const createProductSchema = z.object({
    outletId: z.string().uuid(),
    sku: z.string().optional(),
    name: z.string().min(1),
    description: z.string().optional(),
    categoryId: z.string().uuid().optional(),
    brandId: z.string().uuid().optional(),
    basePrice: z.number().positive(),
    stockQty: z.number().optional(),
    trackInventory: z.boolean().optional(),
    imageUrl: z.string().url().optional(),
});

// GET /api/products
productsRoutes.get('/', async (c) => {
    const outletId = c.req.query('outletId');

    if (!outletId) {
        return c.json({ error: 'outletId is required' }, 400);
    }

    const result = await db.query.products.findMany({
        where: eq(products.outletId, outletId),
        with: {
            category: true,
            brand: true,
            prices: {
                with: {
                    level: true,
                },
            },
        },
        orderBy: (products, { desc }) => [desc(products.createdAt)],
    });

    return c.json(result);
});

// GET /api/products/:id
productsRoutes.get('/:id', async (c) => {
    const id = c.req.param('id');

    const product = await db.query.products.findFirst({
        where: eq(products.id, id),
        with: {
            category: true,
            brand: true,
            recipes: {
                with: {
                    rawMaterial: true,
                },
            },
            prices: {
                with: {
                    level: true,
                },
            },
        },
    });

    if (!product) {
        return c.json({ error: 'Product not found' }, 404);
    }

    return c.json(product);
});

// POST /api/products
productsRoutes.post('/', async (c) => {
    try {
        const body = await c.req.json();
        const data = createProductSchema.parse(body);

        const [product] = await db.insert(products).values({
            ...data,
            basePrice: data.basePrice.toString(),
            stockQty: data.stockQty?.toString() || '0',
        }).returning();

        // Create default prices for all levels
        const levels = await db.query.priceLevels.findMany({
            where: eq(priceLevels.outletId, data.outletId),
            orderBy: (priceLevels, { asc }) => [asc(priceLevels.levelOrder)],
        });

        if (levels.length > 0) {
            await db.insert(productPrices).values(
                levels.map((level, index) => ({
                    productId: product.id,
                    levelId: level.id,
                    // Apply decreasing prices for higher levels
                    price: (data.basePrice * (1 - (index * 0.1))).toFixed(2),
                }))
            );
        }

        return c.json(product, 201);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return c.json({ error: 'Validation failed', details: error.errors }, 400);
        }
        throw error;
    }
});

// PUT /api/products/:id
productsRoutes.put('/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();

        const [updated] = await db.update(products)
            .set({
                ...body,
                basePrice: body.basePrice?.toString(),
                stockQty: body.stockQty?.toString(),
                updatedAt: new Date(),
            })
            .where(eq(products.id, id))
            .returning();

        if (!updated) {
            return c.json({ error: 'Product not found' }, 404);
        }

        return c.json(updated);
    } catch (error) {
        throw error;
    }
});

// DELETE /api/products/:id
productsRoutes.delete('/:id', async (c) => {
    const id = c.req.param('id');

    const [deleted] = await db.delete(products)
        .where(eq(products.id, id))
        .returning();

    if (!deleted) {
        return c.json({ error: 'Product not found' }, 404);
    }

    return c.json({ success: true });
});

// GET /api/products/:id/hpp - Calculate HPP (Harga Pokok Produksi)
productsRoutes.get('/:id/hpp', async (c) => {
    const id = c.req.param('id');

    const productRecipes = await db.query.recipes.findMany({
        where: eq(recipes.productId, id),
        with: {
            rawMaterial: true,
        },
    });

    let hpp = 0;
    const breakdown: Array<{
        material: string;
        quantity: string;
        unit: string;
        unitPrice: string;
        subtotal: number;
    }> = [];

    for (const recipe of productRecipes) {
        const qty = parseFloat(recipe.quantity);
        const price = parseFloat(recipe.rawMaterial.purchasePrice);
        const subtotal = qty * price;
        hpp += subtotal;

        breakdown.push({
            material: recipe.rawMaterial.name,
            quantity: recipe.quantity,
            unit: recipe.rawMaterial.unit,
            unitPrice: recipe.rawMaterial.purchasePrice,
            subtotal,
        });
    }

    return c.json({
        productId: id,
        hpp,
        breakdown,
    });
});

// PUT /api/products/:id/prices - Update prices for all levels
productsRoutes.put('/:id/prices', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();

    // body should be: { prices: [{ levelId: 'xxx', price: 10000 }, ...] }
    const { prices } = body;

    for (const p of prices) {
        await db.update(productPrices)
            .set({ price: p.price.toString() })
            .where(and(
                eq(productPrices.productId, id),
                eq(productPrices.levelId, p.levelId)
            ));
    }

    return c.json({ success: true });
});
