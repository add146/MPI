import { mysqlTable, varchar, text, timestamp, boolean, decimal, int, json, mysqlEnum } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// ===============================
// ENUMS
// ===============================

export const userRoleEnum = mysqlEnum('role', ['owner', 'admin', 'staff']);
export const accountTypeEnum = mysqlEnum('account_type', ['asset', 'liability', 'equity', 'revenue', 'expense']);
export const paymentStatusEnum = mysqlEnum('payment_status', ['pending', 'paid', 'refunded']);
export const reportTypeEnum = mysqlEnum('report_type', ['balance_sheet', 'profit_loss']);

// ===============================
// USERS & AUTHENTICATION
// ===============================

export const users = mysqlTable('users', {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    email: varchar('email', { length: 255 }).unique().notNull(),
    phone: varchar('phone', { length: 20 }),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    name: varchar('name', { length: 100 }),
    role: mysqlEnum('role', ['owner', 'admin', 'staff']).default('owner'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
    outlets: many(outlets),
}));

// ===============================
// OUTLETS (Multi-Outlet Support)
// ===============================

export const outlets = mysqlTable('outlets', {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    ownerId: varchar('owner_id', { length: 36 }).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    address: text('address'),
    phone: varchar('phone', { length: 20 }),
    settings: json('settings').default({}),
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

export const employees = mysqlTable('employees', {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    outletId: varchar('outlet_id', { length: 36 }).notNull(),
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

export const categories = mysqlTable('categories', {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    outletId: varchar('outlet_id', { length: 36 }).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    parentId: varchar('parent_id', { length: 36 }),
    sortOrder: int('sort_order').default(0),
    createdAt: timestamp('created_at').defaultNow(),
});

export const brands = mysqlTable('brands', {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    outletId: varchar('outlet_id', { length: 36 }).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    logoUrl: varchar('logo_url', { length: 500 }),
    createdAt: timestamp('created_at').defaultNow(),
});

// ===============================
// SUPPLIERS
// ===============================

export const suppliers = mysqlTable('suppliers', {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    outletId: varchar('outlet_id', { length: 36 }).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    contact: varchar('contact', { length: 100 }),
    phone: varchar('phone', { length: 20 }),
    email: varchar('email', { length: 255 }),
    address: text('address'),
    createdAt: timestamp('created_at').defaultNow(),
});
