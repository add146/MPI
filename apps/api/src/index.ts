import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

// Import routes
import { authRoutes } from './routes/auth';
import { productsRoutes } from './routes/products';
import { rawMaterialsRoutes } from './routes/raw-materials';
import { recipesRoutes } from './routes/recipes';
import { customersRoutes } from './routes/customers';
import { priceLevelsRoutes } from './routes/price-levels';
import { bundlesRoutes } from './routes/bundles';
import { transactionsRoutes } from './routes/transactions';
import { reportsRoutes } from './routes/reports';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
}));

// Health check
app.get('/', (c) => c.json({
    status: 'ok',
    name: 'MPI API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
}));

// API Routes
app.route('/api/auth', authRoutes);
app.route('/api/products', productsRoutes);
app.route('/api/raw-materials', rawMaterialsRoutes);
app.route('/api/recipes', recipesRoutes);
app.route('/api/customers', customersRoutes);
app.route('/api/price-levels', priceLevelsRoutes);
app.route('/api/bundles', bundlesRoutes);
app.route('/api/transactions', transactionsRoutes);
app.route('/api/reports', reportsRoutes);

// 404 handler
app.notFound((c) => c.json({ error: 'Not Found' }, 404));

// Error handler
app.onError((err, c) => {
    console.error(err);
    return c.json({ error: err.message || 'Internal Server Error' }, 500);
});

// Start server
const port = parseInt(process.env.PORT || '3001');

console.log(`🚀 MPI API Server running on http://localhost:${port}`);

serve({
    fetch: app.fetch,
    port,
});

export default app;
