import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

// Import routes
import { authRoutes } from './routes/auth';
import { productsRoutes } from './routes/products';
import { rawMaterialsRoutes } from './routes/raw-materials';
import { customersRoutes } from './routes/customers';
import { priceLevelsRoutes } from './routes/price-levels';
import { bundlesRoutes } from './routes/bundles';
import { recipesRoutes } from './routes/recipes';
import { transactionsRoutes } from './routes/transactions';
import { reportsRoutes } from './routes/reports';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'https://mpi.khibroh.com'],
    credentials: true,
}));

// Health check
app.get('/', (c) => c.json({
    status: 'ok',
    name: 'MPI API',
    version: '1.0.0',
    mode: 'production',
    database: process.env.DATABASE_URL ? 'connected' : 'not configured',
    timestamp: new Date().toISOString()
}));

app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Mount routes
app.route('/api/auth', authRoutes);
app.route('/api/products', productsRoutes);
app.route('/api/raw-materials', rawMaterialsRoutes);
app.route('/api/customers', customersRoutes);
app.route('/api/price-levels', priceLevelsRoutes);
app.route('/api/bundles', bundlesRoutes);
app.route('/api/recipes', recipesRoutes);
app.route('/api/transactions', transactionsRoutes);
app.route('/api/reports', reportsRoutes);

// 404 handler
app.notFound((c) => c.json({ error: 'Not Found' }, 404));

// Error handler
app.onError((err, c) => {
    console.error('Error:', err);
    return c.json({ error: err.message || 'Internal Server Error' }, 500);
});

// Start server
const port = parseInt(process.env.PORT || '3005');

console.log(`🚀 MPI API Server running on http://localhost:${port}`);
console.log(`📦 Database: ${process.env.DATABASE_URL ? 'MySQL Connected' : 'Not configured'}`);

serve({
    fetch: app.fetch,
    port,
});

export default app;
