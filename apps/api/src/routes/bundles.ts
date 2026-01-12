import { Hono } from 'hono';
import { z } from 'zod';
import { db, bundles, bundleItems, products } from '@mpi/db';
import { eq } from 'drizzle-orm';

export const bundlesRoutes = new Hono();

const bundleItemSchema = z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().min(1),
});

const createBundleSchema = z.object({
    outletId: z.string().uuid(),
    name: z.string().min(1),
    description: z.string().optional(),
    bundlePrice: z.number().positive(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    imageUrl: z.string().url().optional(),
    items: z.array(bundleItemSchema).min(1),
});

// GET /api/bundles
bundlesRoutes.get('/', async (c) => {
    const outletId = c.req.query('outletId');

    if (!outletId) {
        return c.json({ error: 'outletId is required' }, 400);
    }

    const result = await db.query.bundles.findMany({
        where: eq(bundles.outletId, outletId),
        with: {
            items: {
                with: {
                    product: true,
                },
            },
        },
        orderBy: (bundles, { desc }) => [desc(bundles.createdAt)],
    });

    return c.json(result);
});

// GET /api/bundles/:id
bundlesRoutes.get('/:id', async (c) => {
    const id = c.req.param('id');

    const bundle = await db.query.bundles.findFirst({
        where: eq(bundles.id, id),
        with: {
            items: {
                with: {
                    product: true,
                },
            },
        },
    });

    if (!bundle) {
        return c.json({ error: 'Bundle not found' }, 404);
    }

    return c.json(bundle);
});

// POST /api/bundles
bundlesRoutes.post('/', async (c) => {
    try {
        const body = await c.req.json();
        const data = createBundleSchema.parse(body);

        // Calculate original price
        let originalPrice = 0;
        for (const item of data.items) {
            const product = await db.query.products.findFirst({
                where: eq(products.id, item.productId),
            });
            if (product) {
                originalPrice += parseFloat(product.basePrice) * item.quantity;
            }
        }

        const savings = originalPrice - data.bundlePrice;
        const bundleId = crypto.randomUUID();

        // Create bundle
        await db.insert(bundles).values({
            id: bundleId,
            outletId: data.outletId,
            name: data.name,
            description: data.description,
            bundlePrice: data.bundlePrice.toString(),
            originalPrice: originalPrice.toString(),
            savings: savings.toString(),
            startDate: data.startDate ? new Date(data.startDate) : null,
            endDate: data.endDate ? new Date(data.endDate) : null,
            imageUrl: data.imageUrl,
        });

        // Create bundle items
        await db.insert(bundleItems).values(
            data.items.map((item) => ({
                id: crypto.randomUUID(),
                bundleId: bundleId,
                productId: item.productId,
                quantity: item.quantity,
            }))
        );

        // Return bundle with items
        const result = await db.query.bundles.findFirst({
            where: eq(bundles.id, bundleId),
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

// PUT /api/bundles/:id
bundlesRoutes.put('/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();

        // Check if exists
        const existing = await db.query.bundles.findFirst({
            where: eq(bundles.id, id),
        });

        if (!existing) {
            return c.json({ error: 'Bundle not found' }, 404);
        }

        // Update bundle
        await db.update(bundles)
            .set({
                name: body.name,
                description: body.description,
                bundlePrice: body.bundlePrice?.toString(),
                startDate: body.startDate ? new Date(body.startDate) : null,
                endDate: body.endDate ? new Date(body.endDate) : null,
                imageUrl: body.imageUrl,
                isActive: body.isActive,
            })
            .where(eq(bundles.id, id));

        // If items are provided, replace them
        if (body.items && Array.isArray(body.items)) {
            await db.delete(bundleItems).where(eq(bundleItems.bundleId, id));

            // Calculate original price
            let originalPrice = 0;
            for (const item of body.items) {
                const product = await db.query.products.findFirst({
                    where: eq(products.id, item.productId),
                });
                if (product) {
                    originalPrice += parseFloat(product.basePrice) * item.quantity;
                }
            }

            const updatedBundle = await db.query.bundles.findFirst({
                where: eq(bundles.id, id),
            });
            const savings = originalPrice - parseFloat(updatedBundle?.bundlePrice || '0');

            await db.update(bundles)
                .set({
                    originalPrice: originalPrice.toString(),
                    savings: savings.toString(),
                })
                .where(eq(bundles.id, id));

            await db.insert(bundleItems).values(
                body.items.map((item: { productId: string; quantity: number }) => ({
                    id: crypto.randomUUID(),
                    bundleId: id,
                    productId: item.productId,
                    quantity: item.quantity,
                }))
            );
        }

        // Return updated bundle
        const result = await db.query.bundles.findFirst({
            where: eq(bundles.id, id),
            with: {
                items: {
                    with: {
                        product: true,
                    },
                },
            },
        });

        return c.json(result);
    } catch (error) {
        throw error;
    }
});

// DELETE /api/bundles/:id
bundlesRoutes.delete('/:id', async (c) => {
    const id = c.req.param('id');

    const existing = await db.query.bundles.findFirst({
        where: eq(bundles.id, id),
    });

    if (!existing) {
        return c.json({ error: 'Bundle not found' }, 404);
    }

    await db.delete(bundles).where(eq(bundles.id, id));

    return c.json({ success: true });
});
