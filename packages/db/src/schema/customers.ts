import { mysqlTable, varchar, text, timestamp, int, decimal, boolean } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import { outlets } from './core';
import { priceLevels } from './catalog';

// ===============================
// CUSTOMERS
// ===============================

export const customers = mysqlTable('customers', {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    outletId: varchar('outlet_id', { length: 36 }).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    phone: varchar('phone', { length: 20 }),
    email: varchar('email', { length: 255 }),
    address: text('address'),
    levelId: varchar('level_id', { length: 36 }),
    totalPoints: int('total_points').default(0),
    lifetimeSpent: decimal('lifetime_spent', { precision: 15, scale: 2 }).default('0'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const customersRelations = relations(customers, ({ one, many }) => ({
    outlet: one(outlets, { fields: [customers.outletId], references: [outlets.id] }),
    level: one(priceLevels, { fields: [customers.levelId], references: [priceLevels.id] }),
    pointsHistory: many(pointsHistory),
}));

// ===============================
// POINTS CONFIGURATION
// ===============================

export const pointsConfig = mysqlTable('points_config', {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    outletId: varchar('outlet_id', { length: 36 }).unique().notNull(),
    pointsPerAmount: decimal('points_per_amount', { precision: 10, scale: 2 }).default('10000'),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
});

// ===============================
// POINTS HISTORY
// ===============================

export const pointsHistory = mysqlTable('points_history', {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    customerId: varchar('customer_id', { length: 36 }).notNull(),
    transactionId: varchar('transaction_id', { length: 36 }),
    pointsEarned: int('points_earned').default(0),
    pointsRedeemed: int('points_redeemed').default(0),
    balanceAfter: int('balance_after').default(0),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const pointsHistoryRelations = relations(pointsHistory, ({ one }) => ({
    customer: one(customers, { fields: [pointsHistory.customerId], references: [customers.id] }),
}));
