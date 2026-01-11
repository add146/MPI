import { Hono } from 'hono';
import { z } from 'zod';
import { db, priceLevels } from '@mpi/db';
import { eq, and } from 'drizzle-orm';

export const priceLevelsRoutes = new Hono();

const createPriceLevelSchema = z.object({
    outletId: z.string().uuid(),
    name: z.string().min(1),
    levelOrder: z.number().int().min(1).max(10),
    minPoints: z.number().int().optional(),
    discountPct: z.number().optional(),
    description: z.string().optional(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

// GET /api/price-levels
priceLevelsRoutes.get('/', async (c) => {
    const outletId = c.req.query('outletId');

    if (!outletId) {
        return c.json({ error: 'outletId is required' }, 400);
    }

    const result = await db.query.priceLevels.findMany({
        where: eq(priceLevels.outletId, outletId),
        orderBy: (priceLevels, { asc }) => [asc(priceLevels.levelOrder)],
    });

    return c.json(result);
});

// GET /api/price-levels/:id
priceLevelsRoutes.get('/:id', async (c) => {
    const id = c.req.param('id');

    const level = await db.query.priceLevels.findFirst({
        where: eq(priceLevels.id, id),
    });

    if (!level) {
        return c.json({ error: 'Price level not found' }, 404);
    }

    return c.json(level);
});

// POST /api/price-levels
priceLevelsRoutes.post('/', async (c) => {
    try {
        const body = await c.req.json();
        const data = createPriceLevelSchema.parse(body);

        // Check if level order already exists
        const existing = await db.query.priceLevels.findFirst({
            where: and(
                eq(priceLevels.outletId, data.outletId),
                eq(priceLevels.levelOrder, data.levelOrder)
            ),
        });

        if (existing) {
            return c.json({ error: 'Level order already exists for this outlet' }, 400);
        }

        const [level] = await db.insert(priceLevels).values({
            ...data,
            discountPct: data.discountPct?.toString(),
        }).returning();

        return c.json(level, 201);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return c.json({ error: 'Validation failed', details: error.errors }, 400);
        }
        throw error;
    }
});

// PUT /api/price-levels/:id
priceLevelsRoutes.put('/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();

    const [updated] = await db.update(priceLevels)
        .set({
            ...body,
            discountPct: body.discountPct?.toString(),
        })
        .where(eq(priceLevels.id, id))
        .returning();

    if (!updated) {
        return c.json({ error: 'Price level not found' }, 404);
    }

    return c.json(updated);
});

// DELETE /api/price-levels/:id
priceLevelsRoutes.delete('/:id', async (c) => {
    const id = c.req.param('id');

    const [deleted] = await db.delete(priceLevels)
        .where(eq(priceLevels.id, id))
        .returning();

    if (!deleted) {
        return c.json({ error: 'Price level not found' }, 404);
    }

    return c.json({ success: true });
});
