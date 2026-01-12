import { mysqlTable, varchar, text, timestamp, decimal, int, boolean, mysqlEnum } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import { outlets, employees } from './core';
import { priceLevels, products, bundles } from './catalog';

// ===============================
// PAYMENT METHODS
// ===============================

export const paymentMethods = mysqlTable('payment_methods', {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    outletId: varchar('outlet_id', { length: 36 }).notNull(),
    name: varchar('name', { length: 50 }).notNull(),
    type: varchar('type', { length: 50 }),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
});

// ===============================
// SHIFTS
// ===============================

export const shifts = mysqlTable('shifts', {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    outletId: varchar('outlet_id', { length: 36 }).notNull(),
    employeeId: varchar('employee_id', { length: 36 }).notNull(),
    startTime: timestamp('start_time').notNull(),
    endTime: timestamp('end_time'),
    cashStart: decimal('cash_start', { precision: 15, scale: 2 }).default('0'),
    cashEnd: decimal('cash_end', { precision: 15, scale: 2 }),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow(),
});

// ===============================
// TRANSACTIONS
// ===============================

export const transactions = mysqlTable('transactions', {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    outletId: varchar('outlet_id', { length: 36 }).notNull(),
    employeeId: varchar('employee_id', { length: 36 }),
    customerId: varchar('customer_id', { length: 36 }),
    shiftId: varchar('shift_id', { length: 36 }),

    orderNumber: varchar('order_number', { length: 50 }),

    subtotal: decimal('subtotal', { precision: 15, scale: 2 }).notNull(),
    taxAmount: decimal('tax_amount', { precision: 15, scale: 2 }).default('0'),
    discountAmount: decimal('discount_amount', { precision: 15, scale: 2 }).default('0'),
    total: decimal('total', { precision: 15, scale: 2 }).notNull(),

    appliedLevelId: varchar('applied_level_id', { length: 36 }),
    pointsEarned: int('points_earned').default(0),

    paymentMethodId: varchar('payment_method_id', { length: 36 }),
    paymentStatus: mysqlEnum('payment_status', ['pending', 'paid', 'refunded']).default('pending'),
    paidAmount: decimal('paid_amount', { precision: 15, scale: 2 }),
    changeAmount: decimal('change_amount', { precision: 15, scale: 2 }),

    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const transactionsRelations = relations(transactions, ({ one, many }) => ({
    outlet: one(outlets, { fields: [transactions.outletId], references: [outlets.id] }),
    employee: one(employees, { fields: [transactions.employeeId], references: [employees.id] }),
    appliedLevel: one(priceLevels, { fields: [transactions.appliedLevelId], references: [priceLevels.id] }),
    paymentMethod: one(paymentMethods, { fields: [transactions.paymentMethodId], references: [paymentMethods.id] }),
    items: many(transactionItems),
}));

// ===============================
// TRANSACTION ITEMS
// ===============================

export const transactionItems = mysqlTable('transaction_items', {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    transactionId: varchar('transaction_id', { length: 36 }).notNull(),
    productId: varchar('product_id', { length: 36 }),
    bundleId: varchar('bundle_id', { length: 36 }),
    quantity: decimal('quantity', { precision: 10, scale: 3 }).notNull(),
    unitPrice: decimal('unit_price', { precision: 15, scale: 2 }).notNull(),
    subtotal: decimal('subtotal', { precision: 15, scale: 2 }).notNull(),
    costPrice: decimal('cost_price', { precision: 15, scale: 2 }),
    notes: text('notes'),
});

export const transactionItemsRelations = relations(transactionItems, ({ one }) => ({
    transaction: one(transactions, { fields: [transactionItems.transactionId], references: [transactions.id] }),
    product: one(products, { fields: [transactionItems.productId], references: [products.id] }),
    bundle: one(bundles, { fields: [transactionItems.bundleId], references: [bundles.id] }),
}));
