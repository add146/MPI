import { Hono } from 'hono';
import { z } from 'zod';
import { db, customers, priceLevels, pointsHistory } from '@mpi/db';
import { eq, and } from 'drizzle-orm';

export const customersRoutes = new Hono();

const createCustomerSchema = z.object({
    outletId: z.string().uuid(),
    name: z.string().min(1),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    address: z.string().optional(),
    levelId: z.string().uuid().optional(),
});

// GET /api/customers
customersRoutes.get('/', async (c) => {
    const outletId = c.req.query('outletId');

    if (!outletId) {
        return c.json({ error: 'outletId is required' }, 400);
    }

    const result = await db.query.customers.findMany({
        where: eq(customers.outletId, outletId),
        with: {
            level: true,
        },
        orderBy: (customers, { desc }) => [desc(customers.createdAt)],
    });

    return c.json(result);
});

// GET /api/customers/:id
customersRoutes.get('/:id', async (c) => {
    const id = c.req.param('id');

    const customer = await db.query.customers.findFirst({
        where: eq(customers.id, id),
        with: {
            level: true,
        },
    });

    if (!customer) {
        return c.json({ error: 'Customer not found' }, 404);
    }

    // Get next level info
    let nextLevel = null;
    let pointsToNextLevel = 0;

    if (customer.level) {
        const levels = await db.query.priceLevels.findMany({
            where: eq(priceLevels.outletId, customer.outletId),
            orderBy: (priceLevels, { asc }) => [asc(priceLevels.levelOrder)],
        });

        const currentIndex = levels.findIndex((l) => l.id === customer.level?.id);
        if (currentIndex < levels.length - 1) {
            nextLevel = levels[currentIndex + 1];
            pointsToNextLevel = (nextLevel.minPoints || 0) - (customer.totalPoints || 0);
        }
    }

    return c.json({
        ...customer,
        nextLevel,
        pointsToNextLevel: Math.max(0, pointsToNextLevel),
    });
});

// POST /api/customers
customersRoutes.post('/', async (c) => {
    try {
        const body = await c.req.json();
        const data = createCustomerSchema.parse(body);

        // If no levelId provided, get the first level (Retail)
        let levelId = data.levelId;
        if (!levelId) {
            const retailLevel = await db.query.priceLevels.findFirst({
                where: and(
                    eq(priceLevels.outletId, data.outletId),
                    eq(priceLevels.levelOrder, 1)
                ),
            });
            levelId = retailLevel?.id;
        }

        const customerId = crypto.randomUUID();

        await db.insert(customers).values({
            id: customerId,
            ...data,
            levelId,
        });

        const customer = await db.query.customers.findFirst({
            where: eq(customers.id, customerId),
            with: { level: true },
        });

        return c.json(customer, 201);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return c.json({ error: 'Validation failed', details: error.errors }, 400);
        }
        throw error;
    }
});

// PUT /api/customers/:id
customersRoutes.put('/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();

    const existing = await db.query.customers.findFirst({
        where: eq(customers.id, id),
    });

    if (!existing) {
        return c.json({ error: 'Customer not found' }, 404);
    }

    await db.update(customers)
        .set({
            ...body,
            updatedAt: new Date(),
        })
        .where(eq(customers.id, id));

    const updated = await db.query.customers.findFirst({
        where: eq(customers.id, id),
        with: { level: true },
    });

    return c.json(updated);
});

// DELETE /api/customers/:id
customersRoutes.delete('/:id', async (c) => {
    const id = c.req.param('id');

    const existing = await db.query.customers.findFirst({
        where: eq(customers.id, id),
    });

    if (!existing) {
        return c.json({ error: 'Customer not found' }, 404);
    }

    await db.delete(customers).where(eq(customers.id, id));

    return c.json({ success: true });
});

// GET /api/customers/:id/points-history
customersRoutes.get('/:id/points-history', async (c) => {
    const id = c.req.param('id');

    const history = await db.query.pointsHistory.findMany({
        where: eq(pointsHistory.customerId, id),
        orderBy: (pointsHistory, { desc }) => [desc(pointsHistory.createdAt)],
        limit: 50,
    });

    return c.json(history);
});

// POST /api/customers/:id/add-points - Manual point addition
customersRoutes.post('/:id/add-points', async (c) => {
    const id = c.req.param('id');
    const { points, description } = await c.req.json();

    const customer = await db.query.customers.findFirst({
        where: eq(customers.id, id),
    });

    if (!customer) {
        return c.json({ error: 'Customer not found' }, 404);
    }

    const newBalance = (customer.totalPoints || 0) + points;

    // Update customer points
    await db.update(customers)
        .set({ totalPoints: newBalance })
        .where(eq(customers.id, id));

    // Add to history
    await db.insert(pointsHistory).values({
        id: crypto.randomUUID(),
        customerId: id,
        pointsEarned: points,
        balanceAfter: newBalance,
        description: description || 'Manual points addition',
    });

    // Check for level upgrade
    const levels = await db.query.priceLevels.findMany({
        where: eq(priceLevels.outletId, customer.outletId),
        orderBy: (priceLevels, { desc }) => [desc(priceLevels.minPoints)],
    });

    for (const level of levels) {
        if (newBalance >= (level.minPoints || 0)) {
            if (customer.levelId !== level.id) {
                await db.update(customers)
                    .set({ levelId: level.id })
                    .where(eq(customers.id, id));
            }
            break;
        }
    }

    return c.json({
        success: true,
        newBalance,
        pointsAdded: points,
    });
});
