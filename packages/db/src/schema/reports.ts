import { pgTable, uuid, varchar, text, timestamp, decimal, boolean, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { accountTypeEnum, reportTypeEnum } from './core';
import { outlets, users } from './core';
import { jsonb } from 'drizzle-orm/pg-core';

// ===============================
// CHART OF ACCOUNTS (COA)
// ===============================

export const accounts = pgTable('accounts', {
    id: uuid('id').primaryKey().defaultRandom(),
    outletId: uuid('outlet_id').references(() => outlets.id).notNull(),
    code: varchar('code', { length: 10 }).notNull(), // 1-1000 (Kas)
    name: varchar('name', { length: 100 }).notNull(),
    type: accountTypeEnum('type').notNull(),
    parentId: uuid('parent_id'),
    isSystem: boolean('is_system').default(false), // System-generated, non-editable
    balance: decimal('balance', { precision: 15, scale: 2 }).default('0'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const accountsRelations = relations(accounts, ({ one }) => ({
    outlet: one(outlets, { fields: [accounts.outletId], references: [outlets.id] }),
}));

// ===============================
// JOURNAL ENTRIES
// ===============================

export const journalEntries = pgTable('journal_entries', {
    id: uuid('id').primaryKey().defaultRandom(),
    outletId: uuid('outlet_id').references(() => outlets.id).notNull(),
    entryDate: date('entry_date').notNull(),
    reference: varchar('reference', { length: 50 }), // INV-001, PO-001
    description: text('description'),
    createdBy: uuid('created_by').references(() => users.id),
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

export const journalLines = pgTable('journal_lines', {
    id: uuid('id').primaryKey().defaultRandom(),
    entryId: uuid('entry_id').references(() => journalEntries.id, { onDelete: 'cascade' }).notNull(),
    accountId: uuid('account_id').references(() => accounts.id).notNull(),
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

export const reportSnapshots = pgTable('report_snapshots', {
    id: uuid('id').primaryKey().defaultRandom(),
    outletId: uuid('outlet_id').references(() => outlets.id).notNull(),
    reportType: reportTypeEnum('report_type').notNull(),
    periodStart: date('period_start').notNull(),
    periodEnd: date('period_end').notNull(),
    data: jsonb('data').notNull(), // Full report data
    createdAt: timestamp('created_at').defaultNow(),
});

export const reportSnapshotsRelations = relations(reportSnapshots, ({ one }) => ({
    outlet: one(outlets, { fields: [reportSnapshots.outletId], references: [outlets.id] }),
}));
