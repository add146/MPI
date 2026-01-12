import { mysqlTable, varchar, text, timestamp, decimal, boolean, date, json, mysqlEnum } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import { outlets, users } from './core';

// ===============================
// CHART OF ACCOUNTS (COA)
// ===============================

export const accounts = mysqlTable('accounts', {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    outletId: varchar('outlet_id', { length: 36 }).notNull(),
    code: varchar('code', { length: 10 }).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    type: mysqlEnum('type', ['asset', 'liability', 'equity', 'revenue', 'expense']).notNull(),
    parentId: varchar('parent_id', { length: 36 }),
    isSystem: boolean('is_system').default(false),
    balance: decimal('balance', { precision: 15, scale: 2 }).default('0'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const accountsRelations = relations(accounts, ({ one }) => ({
    outlet: one(outlets, { fields: [accounts.outletId], references: [outlets.id] }),
}));

// ===============================
// JOURNAL ENTRIES
// ===============================

export const journalEntries = mysqlTable('journal_entries', {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    outletId: varchar('outlet_id', { length: 36 }).notNull(),
    entryDate: date('entry_date').notNull(),
    reference: varchar('reference', { length: 50 }),
    description: text('description'),
    createdBy: varchar('created_by', { length: 36 }),
    createdAt: timestamp('created_at').defaultNow(),
});

export const journalEntriesRelations = relations(journalEntries, ({ one, many }) => ({
    outlet: one(outlets, { fields: [journalEntries.outletId], references: [outlets.id] }),
    createdByUser: one(users, { fields: [journalEntries.createdBy], references: [users.id] }),
    lines: many(journalLines),
}));

// ===============================
// JOURNAL LINES
// ===============================

export const journalLines = mysqlTable('journal_lines', {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    entryId: varchar('entry_id', { length: 36 }).notNull(),
    accountId: varchar('account_id', { length: 36 }).notNull(),
    debit: decimal('debit', { precision: 15, scale: 2 }).default('0'),
    credit: decimal('credit', { precision: 15, scale: 2 }).default('0'),
});

export const journalLinesRelations = relations(journalLines, ({ one }) => ({
    entry: one(journalEntries, { fields: [journalLines.entryId], references: [journalEntries.id] }),
    account: one(accounts, { fields: [journalLines.accountId], references: [accounts.id] }),
}));

// ===============================
// REPORT SNAPSHOTS (for Excel Export)
// ===============================

export const reportSnapshots = mysqlTable('report_snapshots', {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    outletId: varchar('outlet_id', { length: 36 }).notNull(),
    reportType: mysqlEnum('report_type', ['balance_sheet', 'profit_loss']).notNull(),
    periodStart: date('period_start').notNull(),
    periodEnd: date('period_end').notNull(),
    data: json('data').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

export const reportSnapshotsRelations = relations(reportSnapshots, ({ one }) => ({
    outlet: one(outlets, { fields: [reportSnapshots.outletId], references: [outlets.id] }),
}));
