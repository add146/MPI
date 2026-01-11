import { Hono } from 'hono';
import { z } from 'zod';
import { db, rawMaterials } from '@mpi/db';
import { eq } from 'drizzle-orm';

export const rawMaterialsRoutes = new Hono();

const createRawMaterialSchema = z.object({
    outletId: z.string().uuid(),
    sku: z.string().optional(),
    name: z.string().min(1),
    unit: z.string().min(1),
    purchasePrice: z.number().positive(),
    stockQty: z.number().optional(),
    minStock: z.number().optional(),
    supplierId: z.string().uuid().optional(),
    imageUrl: z.string().url().optional(),
});

// GET /api/raw-materials
rawMaterialsRoutes.get('/', async (c) => {
    const outletId = c.req.query('outletId');

    if (!outletId) {
        return c.json({ error: 'outletId is required' }, 400);
    }

    const result = await db.query.rawMaterials.findMany({
        where: eq(rawMaterials.outletId, outletId),
        with: {
            supplier: true,
        },
        orderBy: (rawMaterials, { desc }) => [desc(rawMaterials.createdAt)],
    });

    return c.json(result);
});

// GET /api/raw-materials/:id
rawMaterialsRoutes.get('/:id', async (c) => {
    const id = c.req.param('id');

    const material = await db.query.rawMaterials.findFirst({
        where: eq(rawMaterials.id, id),
        with: {
            supplier: true,
            recipes: {
                with: {
                    product: true,
                },
            },
        },
    });

    if (!material) {
        return c.json({ error: 'Raw material not found' }, 404);
    }

    return c.json(material);
});

// POST /api/raw-materials
rawMaterialsRoutes.post('/', async (c) => {
    try {
        const body = await c.req.json();
        const data = createRawMaterialSchema.parse(body);

        const [material] = await db.insert(rawMaterials).values({
            ...data,
            purchasePrice: data.purchasePrice.toString(),
            stockQty: data.stockQty?.toString() || '0',
            minStock: data.minStock?.toString() || '0',
        }).returning();

        return c.json(material, 201);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return c.json({ error: 'Validation failed', details: error.errors }, 400);
        }
        throw error;
    }
});

// PUT /api/raw-materials/:id
rawMaterialsRoutes.put('/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();

    const [updated] = await db.update(rawMaterials)
        .set({
            ...body,
            purchasePrice: body.purchasePrice?.toString(),
            stockQty: body.stockQty?.toString(),
            minStock: body.minStock?.toString(),
            updatedAt: new Date(),
        })
        .where(eq(rawMaterials.id, id))
        .returning();

    if (!updated) {
        return c.json({ error: 'Raw material not found' }, 404);
    }

    return c.json(updated);
});

// DELETE /api/raw-materials/:id
rawMaterialsRoutes.delete('/:id', async (c) => {
    const id = c.req.param('id');

    const [deleted] = await db.delete(rawMaterials)
        .where(eq(rawMaterials.id, id))
        .returning();

    if (!deleted) {
        return c.json({ error: 'Raw material not found' }, 404);
    }

    return c.json({ success: true });
});

// GET /api/raw-materials/low-stock
rawMaterialsRoutes.get('/alerts/low-stock', async (c) => {
    const outletId = c.req.query('outletId');

    if (!outletId) {
        return c.json({ error: 'outletId is required' }, 400);
    }

    const materials = await db.query.rawMaterials.findMany({
        where: eq(rawMaterials.outletId, outletId),
    });

    // Filter materials where stockQty < minStock
    const lowStock = materials.filter((m) => {
        const stock = parseFloat(m.stockQty || '0');
        const min = parseFloat(m.minStock || '0');
        return stock < min;
    });

    return c.json(lowStock);
});
