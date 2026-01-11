import { Hono } from 'hono';
import { db, transactions, transactionItems, products, rawMaterials, accounts, journalEntries, journalLines, reportSnapshots } from '@mpi/db';
import { eq, and, gte, lte, sql } from 'drizzle-orm';
import ExcelJS from 'exceljs';

export const reportsRoutes = new Hono();

// GET /api/reports/sales
reportsRoutes.get('/sales', async (c) => {
    const outletId = c.req.query('outletId');
    const startDate = c.req.query('startDate');
    const endDate = c.req.query('endDate');

    if (!outletId) {
        return c.json({ error: 'outletId is required' }, 400);
    }

    const start = startDate ? new Date(startDate) : new Date(new Date().setDate(1)); // First day of month
    const end = endDate ? new Date(endDate) : new Date();

    const txns = await db.query.transactions.findMany({
        where: and(
            eq(transactions.outletId, outletId),
            gte(transactions.createdAt, start),
            lte(transactions.createdAt, end),
        ),
        with: {
            items: {
                with: {
                    product: true,
                },
            },
        },
    });

    // Aggregate data
    const totalSales = txns.reduce((sum, t) => sum + parseFloat(t.total || '0'), 0);
    const totalTransactions = txns.length;
    const totalDiscount = txns.reduce((sum, t) => sum + parseFloat(t.discountAmount || '0'), 0);
    const totalTax = txns.reduce((sum, t) => sum + parseFloat(t.taxAmount || '0'), 0);

    // Sales by product
    const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};

    for (const txn of txns) {
        for (const item of txn.items) {
            if (item.product) {
                const key = item.product.id;
                if (!productSales[key]) {
                    productSales[key] = { name: item.product.name, quantity: 0, revenue: 0 };
                }
                productSales[key].quantity += parseFloat(item.quantity);
                productSales[key].revenue += parseFloat(item.subtotal || '0');
            }
        }
    }

    // Sort by revenue
    const topProducts = Object.entries(productSales)
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

    return c.json({
        period: { start: start.toISOString(), end: end.toISOString() },
        summary: {
            totalSales,
            totalTransactions,
            totalDiscount,
            totalTax,
            averageTransaction: totalTransactions > 0 ? totalSales / totalTransactions : 0,
        },
        topProducts,
    });
});

// GET /api/reports/profit-loss
reportsRoutes.get('/profit-loss', async (c) => {
    const outletId = c.req.query('outletId');
    const startDate = c.req.query('startDate');
    const endDate = c.req.query('endDate');

    if (!outletId) {
        return c.json({ error: 'outletId is required' }, 400);
    }

    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1); // Jan 1
    const end = endDate ? new Date(endDate) : new Date();

    // Get all transactions in period
    const txns = await db.query.transactions.findMany({
        where: and(
            eq(transactions.outletId, outletId),
            gte(transactions.createdAt, start),
            lte(transactions.createdAt, end),
        ),
        with: {
            items: true,
        },
    });

    // Calculate revenue
    const grossRevenue = txns.reduce((sum, t) => sum + parseFloat(t.subtotal || '0'), 0);
    const discounts = txns.reduce((sum, t) => sum + parseFloat(t.discountAmount || '0'), 0);
    const netRevenue = grossRevenue - discounts;

    // Calculate COGS (Cost of Goods Sold)
    let cogs = 0;
    for (const txn of txns) {
        for (const item of txn.items) {
            if (item.costPrice) {
                cogs += parseFloat(item.costPrice) * parseFloat(item.quantity);
            }
        }
    }

    // Gross Profit
    const grossProfit = netRevenue - cogs;
    const grossMargin = netRevenue > 0 ? (grossProfit / netRevenue) * 100 : 0;

    // For simplicity, we'll assume no operating expenses in this basic version
    // In production, you'd pull from journal entries
    const operatingExpenses = 0;
    const netProfit = grossProfit - operatingExpenses;

    return c.json({
        period: { start: start.toISOString(), end: end.toISOString() },
        revenue: {
            grossRevenue,
            discounts,
            netRevenue,
        },
        costOfGoodsSold: cogs,
        grossProfit,
        grossMarginPercent: grossMargin.toFixed(2),
        operatingExpenses,
        netProfit,
    });
});

// GET /api/reports/balance-sheet
reportsRoutes.get('/balance-sheet', async (c) => {
    const outletId = c.req.query('outletId');
    const date = c.req.query('date') || new Date().toISOString().slice(0, 10);

    if (!outletId) {
        return c.json({ error: 'outletId is required' }, 400);
    }

    // Get all accounts
    const allAccounts = await db.query.accounts.findMany({
        where: eq(accounts.outletId, outletId),
    });

    // Group by type
    const assets = allAccounts.filter((a) => a.type === 'asset');
    const liabilities = allAccounts.filter((a) => a.type === 'liability');
    const equity = allAccounts.filter((a) => a.type === 'equity');

    const totalAssets = assets.reduce((sum, a) => sum + parseFloat(a.balance || '0'), 0);
    const totalLiabilities = liabilities.reduce((sum, a) => sum + parseFloat(a.balance || '0'), 0);
    const totalEquity = equity.reduce((sum, a) => sum + parseFloat(a.balance || '0'), 0);

    // Calculate inventory value
    const allProducts = await db.query.products.findMany({
        where: eq(products.outletId, outletId),
    });

    const inventoryValue = allProducts.reduce((sum, p) => {
        const qty = parseFloat(p.stockQty || '0');
        const cost = parseFloat(p.costPrice || p.basePrice || '0');
        return sum + (qty * cost);
    }, 0);

    const allMaterials = await db.query.rawMaterials.findMany({
        where: eq(rawMaterials.outletId, outletId),
    });

    const rawMaterialsValue = allMaterials.reduce((sum, m) => {
        const qty = parseFloat(m.stockQty || '0');
        const price = parseFloat(m.purchasePrice || '0');
        return sum + (qty * price);
    }, 0);

    return c.json({
        date,
        assets: {
            items: assets.map((a) => ({ code: a.code, name: a.name, balance: parseFloat(a.balance || '0') })),
            inventory: {
                finishedGoods: inventoryValue,
                rawMaterials: rawMaterialsValue,
                total: inventoryValue + rawMaterialsValue,
            },
            total: totalAssets + inventoryValue + rawMaterialsValue,
        },
        liabilities: {
            items: liabilities.map((a) => ({ code: a.code, name: a.name, balance: parseFloat(a.balance || '0') })),
            total: totalLiabilities,
        },
        equity: {
            items: equity.map((a) => ({ code: a.code, name: a.name, balance: parseFloat(a.balance || '0') })),
            total: totalEquity,
        },
        isBalanced: Math.abs((totalAssets + inventoryValue + rawMaterialsValue) - (totalLiabilities + totalEquity)) < 0.01,
    });
});

// GET /api/reports/hpp - HPP Report
reportsRoutes.get('/hpp', async (c) => {
    const outletId = c.req.query('outletId');

    if (!outletId) {
        return c.json({ error: 'outletId is required' }, 400);
    }

    const allProducts = await db.query.products.findMany({
        where: and(
            eq(products.outletId, outletId),
            eq(products.hasRecipe, true),
        ),
        with: {
            recipes: {
                with: {
                    rawMaterial: true,
                },
            },
        },
    });

    const hppReport = allProducts.map((product) => {
        let hpp = 0;
        const ingredients: Array<{ name: string; qty: string; unit: string; price: string; subtotal: number }> = [];

        for (const recipe of product.recipes) {
            const qty = parseFloat(recipe.quantity);
            const price = parseFloat(recipe.rawMaterial.purchasePrice);
            const subtotal = qty * price;
            hpp += subtotal;

            ingredients.push({
                name: recipe.rawMaterial.name,
                qty: recipe.quantity,
                unit: recipe.rawMaterial.unit,
                price: recipe.rawMaterial.purchasePrice,
                subtotal,
            });
        }

        const sellingPrice = parseFloat(product.basePrice);
        const margin = sellingPrice - hpp;
        const marginPercent = sellingPrice > 0 ? (margin / sellingPrice) * 100 : 0;

        return {
            productId: product.id,
            productName: product.name,
            sellingPrice,
            hpp,
            margin,
            marginPercent: marginPercent.toFixed(2),
            ingredients,
        };
    });

    return c.json({
        products: hppReport,
        summary: {
            totalProducts: hppReport.length,
            averageMargin: hppReport.length > 0
                ? (hppReport.reduce((sum, p) => sum + parseFloat(p.marginPercent), 0) / hppReport.length).toFixed(2)
                : '0',
        },
    });
});

// GET /api/reports/export/excel
reportsRoutes.get('/export/excel', async (c) => {
    const outletId = c.req.query('outletId');
    const reportType = c.req.query('type'); // profit-loss, balance-sheet, sales
    const startDate = c.req.query('startDate');
    const endDate = c.req.query('endDate');

    if (!outletId || !reportType) {
        return c.json({ error: 'outletId and type are required' }, 400);
    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'MPI System';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet(reportType.toUpperCase());

    // Style header
    sheet.getRow(1).font = { bold: true, size: 14 };
    sheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF10B981' },
    };

    if (reportType === 'profit-loss') {
        // Fetch P&L data
        const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1);
        const end = endDate ? new Date(endDate) : new Date();

        const txns = await db.query.transactions.findMany({
            where: and(
                eq(transactions.outletId, outletId),
                gte(transactions.createdAt, start),
                lte(transactions.createdAt, end),
            ),
            with: { items: true },
        });

        const grossRevenue = txns.reduce((sum, t) => sum + parseFloat(t.subtotal || '0'), 0);
        const discounts = txns.reduce((sum, t) => sum + parseFloat(t.discountAmount || '0'), 0);
        const netRevenue = grossRevenue - discounts;

        let cogs = 0;
        for (const txn of txns) {
            for (const item of txn.items) {
                if (item.costPrice) {
                    cogs += parseFloat(item.costPrice) * parseFloat(item.quantity);
                }
            }
        }

        const grossProfit = netRevenue - cogs;

        // Add headers
        sheet.columns = [
            { header: 'Keterangan', key: 'description', width: 40 },
            { header: 'Jumlah (Rp)', key: 'amount', width: 20 },
        ];

        // Add data
        sheet.addRow({ description: 'LAPORAN LABA RUGI', amount: '' });
        sheet.addRow({ description: `Periode: ${start.toLocaleDateString()} - ${end.toLocaleDateString()}`, amount: '' });
        sheet.addRow({ description: '', amount: '' });
        sheet.addRow({ description: 'PENDAPATAN', amount: '' });
        sheet.addRow({ description: 'Pendapatan Kotor', amount: grossRevenue });
        sheet.addRow({ description: 'Diskon', amount: -discounts });
        sheet.addRow({ description: 'Pendapatan Bersih', amount: netRevenue });
        sheet.addRow({ description: '', amount: '' });
        sheet.addRow({ description: 'HARGA POKOK PENJUALAN', amount: '' });
        sheet.addRow({ description: 'HPP', amount: cogs });
        sheet.addRow({ description: '', amount: '' });
        sheet.addRow({ description: 'LABA KOTOR', amount: grossProfit });

        // Format numbers
        sheet.getColumn('amount').numFmt = '#,##0';
    }

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Return file
    c.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    c.header('Content-Disposition', `attachment; filename="${reportType}-${new Date().toISOString().slice(0, 10)}.xlsx"`);

    return c.body(buffer as ArrayBuffer);
});
