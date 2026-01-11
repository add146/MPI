import { pgTable, uuid, varchar, text, timestamp, integer, decimal } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { outlets } from './core';
import { priceLevels } from './catalog';

// ===============================
// CUSTOMERS
// ===============================

export const customers = pgTable('customers', {
    id: uuid('id').primaryKey().defaultRandom(),
    outletId: uuid('outlet_id').references(() => outlets.id).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    phone: varchar('phone', { length: 20 }),
    email: varchar('email', { length: 255 }),
    address: text('address'),
    levelId: uuid('level_id').references(() => priceLevels.id),
    totalPoints: integer('total_points').default(0),
    lifetimeSpent: decimal('lifetime_spent', { precision: 15, scale: 2 }).default('0'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const customersRelations = relations(customers, ({ one, many }) => ({
    outlet: one(outlets, { fields: [customers.outletId], references: [outlets.id] }),
    level: one(priceLevels, { fields: [customers.levelId], references: [priceLevels.id] }),
    transactions: many(transactions),
    pointsHistory: many(pointsHistory),
}));

// ===============================
// POINTS CONFIGURATION
// ===============================

export const pointsConfig = pgTable('points_config', {
    id: uuid('id').primaryKey().defaultRandom(),
    outletId: uuid('outlet_id').references(() => outlets.id).unique().notNull(),
    pointsPerAmount: decimal('points_per_amount', { precision: 10, scale: 2 }).default('10000'), // 1 poin per Rp 10.000
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
});

import { boolean } from 'drizzle-orm/pg-core';

// ===============================
// POINTS HISTORY
// ===============================

export const pointsHistory = pgTable('points_history', {
    id: uuid('id').primaryKey().defaultRandom(),
    customerId: uuid('customer_id').references(() => customers.id).notNull(),
    transactionId: uuid('transaction_id').references(() => transactions.id),
    pointsEarned: integer('points_earned').default(0),
    pointsRedeemed: integer('points_redeemed').default(0),
    balanceAfter: integer('balance_after').default(0),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const pointsHistoryRelations = relations(pointsHistory, ({ one }) => ({
    customer: one(customers, { fields: [pointsHistory.customerId], references: [customers.id] }),
    transaction: one(transactions, { fields: [pointsHistory.transactionId], references: [transactions.id] }),
}));

// Forward reference - transactions defined in transactions.ts
import { transactions } from './transactions';
