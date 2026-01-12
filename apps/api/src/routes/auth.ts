import { Hono } from 'hono';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db, users, outlets, priceLevels } from '@mpi/db';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'mpi-secret-key-change-in-production';

export const authRoutes = new Hono();

// Validation schemas
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
    phone: z.string().optional(),
    outletName: z.string().min(2),
});

// POST /api/auth/login
authRoutes.post('/login', async (c) => {
    try {
        const body = await c.req.json();
        const { email, password } = loginSchema.parse(body);

        // Find user
        const user = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (!user) {
            return c.json({ error: 'Invalid credentials' }, 401);
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) {
            return c.json({ error: 'Invalid credentials' }, 401);
        }

        // Get user's outlets
        const userOutlets = await db.query.outlets.findMany({
            where: eq(outlets.ownerId, user.id),
        });

        // Generate token
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return c.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            outlets: userOutlets,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return c.json({ error: 'Validation failed', details: error.errors }, 400);
        }
        throw error;
    }
});

// POST /api/auth/register
authRoutes.post('/register', async (c) => {
    try {
        const body = await c.req.json();
        const { email, password, name, phone, outletName } = registerSchema.parse(body);

        // Check if email exists
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (existingUser) {
            return c.json({ error: 'Email already registered' }, 400);
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user ID manually for MySQL
        const userId = crypto.randomUUID();

        // Create user
        await db.insert(users).values({
            id: userId,
            email,
            passwordHash,
            name,
            phone,
            role: 'owner',
        });

        // Fetch the created user
        const newUser = await db.query.users.findFirst({
            where: eq(users.id, userId),
        });

        if (!newUser) {
            throw new Error('Failed to create user');
        }

        // Create default outlet with ID
        const outletId = crypto.randomUUID();

        await db.insert(outlets).values({
            id: outletId,
            ownerId: newUser.id,
            name: outletName,
        });

        // Fetch the created outlet
        const newOutlet = await db.query.outlets.findFirst({
            where: eq(outlets.id, outletId),
        });

        // Create default price levels
        const defaultLevels = [
            { name: 'Retail', levelOrder: 1, minPoints: 0, color: '#6B7280' },
            { name: 'Reseller', levelOrder: 2, minPoints: 500, color: '#10B981' },
            { name: 'Agen', levelOrder: 3, minPoints: 2000, color: '#F59E0B' },
            { name: 'Distributor', levelOrder: 4, minPoints: 10000, color: '#8B5CF6' },
        ];

        await db.insert(priceLevels).values(
            defaultLevels.map((level) => ({
                id: crypto.randomUUID(),
                outletId: outletId,
                ...level,
            }))
        );

        // Generate token
        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email, role: newUser.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return c.json({
            token,
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
            },
            outlet: newOutlet,
        }, 201);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return c.json({ error: 'Validation failed', details: error.errors }, 400);
        }
        throw error;
    }
});

// GET /api/auth/me
authRoutes.get('/me', async (c) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

        const user = await db.query.users.findFirst({
            where: eq(users.id, decoded.userId),
        });

        if (!user) {
            return c.json({ error: 'User not found' }, 404);
        }

        const userOutlets = await db.query.outlets.findMany({
            where: eq(outlets.ownerId, user.id),
        });

        return c.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            outlets: userOutlets,
        });
    } catch {
        return c.json({ error: 'Invalid token' }, 401);
    }
});
