import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = new Hono();

const JWT_SECRET = process.env.JWT_SECRET || 'mpi-secret-key-demo';

// ===============================
// IN-MEMORY MOCK DATA STORE
// ===============================

interface User {
    id: string;
    email: string;
    passwordHash: string;
    name: string;
    role: string;
}

interface Outlet {
    id: string;
    ownerId: string;
    name: string;
    address?: string;
}

interface PriceLevel {
    id: string;
    outletId: string;
    name: string;
    levelOrder: number;
    minPoints: number;
    color: string;
}

interface Product {
    id: string;
    outletId: string;
    sku: string;
    name: string;
    description?: string;
    categoryId?: string;
    basePrice: string;
    costPrice?: string;
    stockQty: string;
    hasRecipe: boolean;
    imageUrl?: string;
    createdAt: Date;
}

interface RawMaterial {
    id: string;
    outletId: string;
    sku: string;
    name: string;
    unit: string;
    purchasePrice: string;
    stockQty: string;
    minStock: string;
}

interface Customer {
    id: string;
    outletId: string;
    name: string;
    phone?: string;
    email?: string;
    levelId?: string;
    totalPoints: number;
    lifetimeSpent: string;
}

interface Transaction {
    id: string;
    outletId: string;
    orderNumber: string;
    customerId?: string;
    subtotal: string;
    total: string;
    pointsEarned: number;
    createdAt: Date;
    items: any[];
}

// Mock DB
const store = {
    users: [] as User[],
    outlets: [] as Outlet[],
    priceLevels: [] as PriceLevel[],
    products: [] as Product[],
    rawMaterials: [] as RawMaterial[],
    customers: [] as Customer[],
    transactions: [] as Transaction[],
};

// Helper
function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Middleware
app.use('*', logger());
app.use('*', cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
}));

// Health check
app.get('/', (c) => c.json({
    status: 'ok',
    name: 'MPI API (Demo Mode)',
    version: '1.0.0',
    mode: 'in-memory',
    timestamp: new Date().toISOString()
}));

// ===============================
// AUTH ROUTES
// ===============================

app.post('/api/auth/register', async (c) => {
    try {
        const { email, password, name, outletName } = await c.req.json();

        // Check if email exists
        if (store.users.find(u => u.email === email)) {
            return c.json({ error: 'Email already registered' }, 400);
        }

        // Create user
        const passwordHash = await bcrypt.hash(password, 10);
        const userId = uuid();
        const user: User = {
            id: userId,
            email,
            passwordHash,
            name,
            role: 'owner',
        };
        store.users.push(user);

        // Create outlet
        const outletId = uuid();
        const outlet: Outlet = {
            id: outletId,
            ownerId: userId,
            name: outletName,
        };
        store.outlets.push(outlet);

        // Create default price levels
        const defaultLevels = [
            { name: 'Retail', levelOrder: 1, minPoints: 0, color: '#6B7280' },
            { name: 'Reseller', levelOrder: 2, minPoints: 500, color: '#10B981' },
            { name: 'Agen', levelOrder: 3, minPoints: 2000, color: '#F59E0B' },
            { name: 'Distributor', levelOrder: 4, minPoints: 10000, color: '#8B5CF6' },
        ];

        defaultLevels.forEach((level) => {
            store.priceLevels.push({
                id: uuid(),
                outletId,
                ...level,
            });
        });

        // Generate token
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return c.json({
            token,
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
            outlet,
        }, 201);
    } catch (error: any) {
        return c.json({ error: error.message }, 400);
    }
});

app.post('/api/auth/login', async (c) => {
    try {
        const { email, password } = await c.req.json();

        const user = store.users.find(u => u.email === email);
        if (!user) {
            return c.json({ error: 'Invalid credentials' }, 401);
        }

        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) {
            return c.json({ error: 'Invalid credentials' }, 401);
        }

        const outlets = store.outlets.filter(o => o.ownerId === user.id);

        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return c.json({
            token,
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
            outlets,
        });
    } catch (error: any) {
        return c.json({ error: error.message }, 400);
    }
});

app.get('/api/auth/me', async (c) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        const user = store.users.find(u => u.id === decoded.userId);

        if (!user) {
            return c.json({ error: 'User not found' }, 404);
        }

        const outlets = store.outlets.filter(o => o.ownerId === user.id);

        return c.json({
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
            outlets,
        });
    } catch {
        return c.json({ error: 'Invalid token' }, 401);
    }
});

// ===============================
// PRODUCTS ROUTES
// ===============================

app.get('/api/products', (c) => {
    const outletId = c.req.query('outletId');
    const products = store.products.filter(p => p.outletId === outletId);
    return c.json(products);
});

app.post('/api/products', async (c) => {
    const body = await c.req.json();
    const product: Product = {
        id: uuid(),
        outletId: body.outletId,
        sku: body.sku || `SKU-${Date.now()}`,
        name: body.name,
        description: body.description,
        categoryId: body.categoryId,
        basePrice: body.basePrice.toString(),
        costPrice: body.costPrice?.toString(),
        stockQty: (body.stockQty || 0).toString(),
        hasRecipe: false,
        imageUrl: body.imageUrl,
        createdAt: new Date(),
    };
    store.products.push(product);
    return c.json(product, 201);
});

app.get('/api/products/:id', (c) => {
    const id = c.req.param('id');
    const product = store.products.find(p => p.id === id);
    if (!product) return c.json({ error: 'Not found' }, 404);
    return c.json(product);
});

app.put('/api/products/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const index = store.products.findIndex(p => p.id === id);
    if (index === -1) return c.json({ error: 'Not found' }, 404);
    store.products[index] = { ...store.products[index], ...body };
    return c.json(store.products[index]);
});

app.delete('/api/products/:id', (c) => {
    const id = c.req.param('id');
    const index = store.products.findIndex(p => p.id === id);
    if (index === -1) return c.json({ error: 'Not found' }, 404);
    store.products.splice(index, 1);
    return c.json({ success: true });
});

app.get('/api/products/:id/hpp', (c) => {
    const id = c.req.param('id');
    const product = store.products.find(p => p.id === id);
    if (!product) return c.json({ error: 'Not found' }, 404);
    return c.json({
        productId: id,
        hpp: parseFloat(product.costPrice || '0'),
        breakdown: [],
    });
});

// ===============================
// RAW MATERIALS ROUTES
// ===============================

app.get('/api/raw-materials', (c) => {
    const outletId = c.req.query('outletId');
    const materials = store.rawMaterials.filter(m => m.outletId === outletId);
    return c.json(materials);
});

app.post('/api/raw-materials', async (c) => {
    const body = await c.req.json();
    const material: RawMaterial = {
        id: uuid(),
        outletId: body.outletId,
        sku: body.sku || `RM-${Date.now()}`,
        name: body.name,
        unit: body.unit,
        purchasePrice: body.purchasePrice.toString(),
        stockQty: (body.stockQty || 0).toString(),
        minStock: (body.minStock || 0).toString(),
    };
    store.rawMaterials.push(material);
    return c.json(material, 201);
});

app.get('/api/raw-materials/alerts/low-stock', (c) => {
    const outletId = c.req.query('outletId');
    const materials = store.rawMaterials.filter(m =>
        m.outletId === outletId &&
        parseFloat(m.stockQty) < parseFloat(m.minStock)
    );
    return c.json(materials);
});

// ===============================
// CUSTOMERS ROUTES
// ===============================

app.get('/api/customers', (c) => {
    const outletId = c.req.query('outletId');
    const customers = store.customers.filter(cu => cu.outletId === outletId);
    // Add level info
    return c.json(customers.map(cu => {
        const level = store.priceLevels.find(l => l.id === cu.levelId);
        return { ...cu, level };
    }));
});

app.post('/api/customers', async (c) => {
    const body = await c.req.json();
    const retailLevel = store.priceLevels.find(l =>
        l.outletId === body.outletId && l.levelOrder === 1
    );
    const customer: Customer = {
        id: uuid(),
        outletId: body.outletId,
        name: body.name,
        phone: body.phone,
        email: body.email,
        levelId: body.levelId || retailLevel?.id,
        totalPoints: 0,
        lifetimeSpent: '0',
    };
    store.customers.push(customer);
    return c.json(customer, 201);
});

app.get('/api/customers/:id', (c) => {
    const id = c.req.param('id');
    const customer = store.customers.find(cu => cu.id === id);
    if (!customer) return c.json({ error: 'Not found' }, 404);
    const level = store.priceLevels.find(l => l.id === customer.levelId);
    return c.json({ ...customer, level });
});

// ===============================
// PRICE LEVELS ROUTES
// ===============================

app.get('/api/price-levels', (c) => {
    const outletId = c.req.query('outletId');
    const levels = store.priceLevels.filter(l => l.outletId === outletId);
    return c.json(levels.sort((a, b) => a.levelOrder - b.levelOrder));
});

// ===============================
// BUNDLES ROUTES
// ===============================

app.get('/api/bundles', (c) => {
    const outletId = c.req.query('outletId');
    return c.json([]); // Empty for now
});

// ===============================
// TRANSACTIONS ROUTES
// ===============================

app.get('/api/transactions', (c) => {
    const outletId = c.req.query('outletId');
    const txns = store.transactions.filter(t => t.outletId === outletId);
    return c.json(txns.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
});

app.post('/api/transactions', async (c) => {
    const body = await c.req.json();
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const txnCount = store.transactions.filter(t => t.outletId === body.outletId).length;

    const txn: Transaction = {
        id: uuid(),
        outletId: body.outletId,
        orderNumber: `MPI-${dateStr}-${(txnCount + 1).toString().padStart(4, '0')}`,
        customerId: body.customerId,
        subtotal: body.subtotal.toString(),
        total: body.total.toString(),
        pointsEarned: Math.floor(body.total / 10000),
        createdAt: new Date(),
        items: body.items || [],
    };
    store.transactions.push(txn);

    // Update customer points
    if (body.customerId) {
        const customer = store.customers.find(cu => cu.id === body.customerId);
        if (customer) {
            customer.totalPoints += txn.pointsEarned;
            customer.lifetimeSpent = (parseFloat(customer.lifetimeSpent) + body.total).toString();
        }
    }

    return c.json(txn, 201);
});

app.get('/api/transactions/summary/daily', (c) => {
    const outletId = c.req.query('outletId');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayTxns = store.transactions.filter(t =>
        t.outletId === outletId && t.createdAt >= today
    );

    const totalSales = dayTxns.reduce((sum, t) => sum + parseFloat(t.total), 0);

    return c.json({
        date: today.toISOString().slice(0, 10),
        totalSales,
        totalTransactions: dayTxns.length,
        averageTransaction: dayTxns.length > 0 ? totalSales / dayTxns.length : 0,
    });
});

// ===============================
// REPORTS ROUTES
// ===============================

app.get('/api/reports/sales', (c) => {
    const outletId = c.req.query('outletId');
    const txns = store.transactions.filter(t => t.outletId === outletId);

    const totalSales = txns.reduce((sum, t) => sum + parseFloat(t.total), 0);

    return c.json({
        period: { start: new Date().toISOString(), end: new Date().toISOString() },
        summary: {
            totalSales,
            totalTransactions: txns.length,
            totalDiscount: 0,
            totalTax: 0,
            averageTransaction: txns.length > 0 ? totalSales / txns.length : 0,
        },
        topProducts: [],
    });
});

app.get('/api/reports/profit-loss', (c) => {
    const outletId = c.req.query('outletId');
    const txns = store.transactions.filter(t => t.outletId === outletId);

    const grossRevenue = txns.reduce((sum, t) => sum + parseFloat(t.total), 0);
    const cogs = grossRevenue * 0.3; // Mock 30% COGS
    const grossProfit = grossRevenue - cogs;

    return c.json({
        period: { start: new Date().toISOString(), end: new Date().toISOString() },
        revenue: { grossRevenue, discounts: 0, netRevenue: grossRevenue },
        costOfGoodsSold: cogs,
        grossProfit,
        grossMarginPercent: grossRevenue > 0 ? ((grossProfit / grossRevenue) * 100).toFixed(2) : '0',
        operatingExpenses: 0,
        netProfit: grossProfit,
    });
});

app.get('/api/reports/balance-sheet', (c) => {
    const outletId = c.req.query('outletId');

    // Calculate inventory value
    const productsValue = store.products
        .filter(p => p.outletId === outletId)
        .reduce((sum, p) => sum + parseFloat(p.stockQty) * parseFloat(p.basePrice), 0);

    const materialsValue = store.rawMaterials
        .filter(m => m.outletId === outletId)
        .reduce((sum, m) => sum + parseFloat(m.stockQty) * parseFloat(m.purchasePrice), 0);

    return c.json({
        date: new Date().toISOString().slice(0, 10),
        assets: {
            items: [],
            inventory: {
                finishedGoods: productsValue,
                rawMaterials: materialsValue,
                total: productsValue + materialsValue,
            },
            total: productsValue + materialsValue,
        },
        liabilities: { items: [], total: 0 },
        equity: { items: [], total: productsValue + materialsValue },
        isBalanced: true,
    });
});

app.get('/api/reports/hpp', (c) => {
    const outletId = c.req.query('outletId');
    const products = store.products.filter(p => p.outletId === outletId && p.hasRecipe);

    return c.json({
        products: products.map(p => ({
            productId: p.id,
            productName: p.name,
            sellingPrice: parseFloat(p.basePrice),
            hpp: parseFloat(p.costPrice || '0'),
            margin: parseFloat(p.basePrice) - parseFloat(p.costPrice || '0'),
            marginPercent: '0',
            ingredients: [],
        })),
        summary: { totalProducts: products.length, averageMargin: '0' },
    });
});

// Recipes (simplified)
app.get('/api/recipes/product/:productId', (c) => {
    return c.json({ productId: c.req.param('productId'), hpp: 0, items: [] });
});

app.put('/api/recipes/product/:productId', async (c) => {
    return c.json({ productId: c.req.param('productId'), hpp: 0, items: [] });
});

// 404 handler
app.notFound((c) => c.json({ error: 'Not Found' }, 404));

// Error handler
app.onError((err, c) => {
    console.error(err);
    return c.json({ error: err.message || 'Internal Server Error' }, 500);
});

// Start server
const port = parseInt(process.env.PORT || '3001');

console.log(`🚀 MPI API Server (Demo Mode) running on http://localhost:${port}`);
console.log(`📦 Using in-memory store - data will reset on restart`);

serve({
    fetch: app.fetch,
    port,
});

export default app;
