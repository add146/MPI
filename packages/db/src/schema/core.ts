import { pgTable, uuid, varchar, text, timestamp, boolean, decimal, integer, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ===============================
// ENUMS
// ===============================

export const userRoleEnum = pgEnum('user_role', ['owner', 'admin', 'staff']);
export const accountTypeEnum = pgEnum('account_type', ['asset', 'liability', 'equity', 'revenue', 'expense']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'paid', 'refunded']);
export const reportTypeEnum = pgEnum('report_type', ['balance_sheet', 'profit_loss']);

// ===============================
// USERS & AUTHENTICATION
// ===============================

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    phone: varchar('phone', { length: 20 }),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    name: varchar('name', { length: 100 }),
    role: userRoleEnum('role').default('owner'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
    outlets: many(outlets),
}));

// ===============================
// OUTLETS (Multi-Outlet Support)
// ===============================

export const outlets = pgTable('outlets', {
    id: uuid('id').primaryKey().defaultRandom(),
    ownerId: uuid('owner_id').references(() => users.id).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    address: text('address'),
    phone: varchar('phone', { length: 20 }),
    settings: jsonb('settings').default({}),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const outletsRelations = relations(outlets, ({ one, many }) => ({
    owner: one(users, { fields: [outlets.ownerId], references: [users.id] }),
    employees: many(employees),
    categories: many(categories),
    brands: many(brands),
}));

// ===============================
// EMPLOYEES
// ===============================

export const employees = pgTable('employees', {
    id: uuid('id').primaryKey().defaultRandom(),
    outletId: uuid('outlet_id').references(() => outlets.id).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    email: varchar('email', { length: 255 }),
    pinCode: varchar('pin_code', { length: 6 }),
    role: varchar('role', { length: 50 }),
    commissionPct: decimal('commission_pct', { precision: 5, scale: 2 }).default('0'),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
});

export const employeesRelations = relations(employees, ({ one }) => ({
    outlet: one(outlets, { fields: [employees.outletId], references: [outlets.id] }),
}));

// ===============================
// CATEGORIES & BRANDS
// ===============================

export const categories = pgTable('categories', {
    id: uuid('id').primaryKey().defaultRandom(),
    outletId: uuid('outlet_id').references(() => outlets.id).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    parentId: uuid('parent_id'),
    sortOrder: integer('sort_order').default(0),
    createdAt: timestamp('created_at').defaultNow(),
});

export const brands = pgTable('brands', {
    id: uuid('id').primaryKey().defaultRandom(),
    outletId: uuid('outlet_id').references(() => outlets.id).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    logoUrl: varchar('logo_url', { length: 500 }),
    createdAt: timestamp('created_at').defaultNow(),
});

// ===============================
// SUPPLIERS
// ===============================

export const suppliers = pgTable('suppliers', {
    id: uuid('id').primaryKey().defaultRandom(),
    outletId: uuid('outlet_id').references(() => outlets.id).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    contact: varchar('contact', { length: 100 }),
    phone: varchar('phone', { length: 20 }),
    email: varchar('email', { length: 255 }),
    address: text('address'),
    createdAt: timestamp('created_at').defaultNow(),
});
