import { pgTable, uuid, varchar, text, timestamp, decimal, integer, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { paymentStatusEnum, outlets, employees } from './core';
import { priceLevels, products, bundles } from './catalog';

// ===============================
// PAYMENT METHODS
// ===============================

export const paymentMethods = pgTable('payment_methods', {
    id: uuid('id').primaryKey().defaultRandom(),
    outletId: uuid('outlet_id').references(() => outlets.id).notNull(),
    name: varchar('name', { length: 50 }).notNull(),
    type: varchar('type', { length: 50 }),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
});

// ===============================
// SHIFTS
// ===============================

export const shifts = pgTable('shifts', {
    id: uuid('id').primaryKey().defaultRandom(),
    outletId: uuid('outlet_id').references(() => outlets.id).notNull(),
    employeeId: uuid('employee_id').references(() => employees.id).notNull(),
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

export const transactions = pgTable('transactions', {
    id: uuid('id').primaryKey().defaultRandom(),
    outletId: uuid('outlet_id').references(() => outlets.id).notNull(),
    employeeId: uuid('employee_id').references(() => employees.id),
    customerId: uuid('customer_id'), // No FK to avoid circular import
    shiftId: uuid('shift_id').references(() => shifts.id),

    orderNumber: varchar('order_number', { length: 50 }),

    subtotal: decimal('subtotal', { precision: 15, scale: 2 }).notNull(),
    taxAmount: decimal('tax_amount', { precision: 15, scale: 2 }).default('0'),
    discountAmount: decimal('discount_amount', { precision: 15, scale: 2 }).default('0'),
    total: decimal('total', { precision: 15, scale: 2 }).notNull(),

    appliedLevelId: uuid('applied_level_id').references(() => priceLevels.id),
    pointsEarned: integer('points_earned').default(0),

    paymentMethodId: uuid('payment_method_id').references(() => paymentMethods.id),
    paymentStatus: paymentStatusEnum('payment_status').default('pending'),
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

export const transactionItems = pgTable('transaction_items', {
    id: uuid('id').primaryKey().defaultRandom(),
    transactionId: uuid('transaction_id').references(() => transactions.id, { onDelete: 'cascade' }).notNull(),
    productId: uuid('product_id').references(() => products.id),
    bundleId: uuid('bundle_id').references(() => bundles.id),
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
