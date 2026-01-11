import { pgTable, uuid, varchar, text, timestamp, boolean, decimal, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { outlets, categories, brands, suppliers } from './core';

// ===============================
// RAW MATERIALS (Bahan Baku)
// ===============================

export const rawMaterials = pgTable('raw_materials', {
    id: uuid('id').primaryKey().defaultRandom(),
    outletId: uuid('outlet_id').references(() => outlets.id).notNull(),
    sku: varchar('sku', { length: 50 }),
    name: varchar('name', { length: 100 }).notNull(),
    unit: varchar('unit', { length: 20 }).notNull(), // kg, liter, pcs
    purchasePrice: decimal('purchase_price', { precision: 15, scale: 2 }).notNull(),
    stockQty: decimal('stock_qty', { precision: 15, scale: 3 }).default('0'),
    minStock: decimal('min_stock', { precision: 15, scale: 3 }).default('0'),
    supplierId: uuid('supplier_id').references(() => suppliers.id),
    imageUrl: varchar('image_url', { length: 500 }),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const rawMaterialsRelations = relations(rawMaterials, ({ one, many }) => ({
    outlet: one(outlets, { fields: [rawMaterials.outletId], references: [outlets.id] }),
    supplier: one(suppliers, { fields: [rawMaterials.supplierId], references: [suppliers.id] }),
    recipes: many(recipes),
}));

// ===============================
// PRODUCTS (Produk Jadi)
// ===============================

export const products = pgTable('products', {
    id: uuid('id').primaryKey().defaultRandom(),
    outletId: uuid('outlet_id').references(() => outlets.id).notNull(),
    sku: varchar('sku', { length: 50 }),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    categoryId: uuid('category_id').references(() => categories.id),
    brandId: uuid('brand_id').references(() => brands.id),
    basePrice: decimal('base_price', { precision: 15, scale: 2 }).notNull(), // Harga retail
    costPrice: decimal('cost_price', { precision: 15, scale: 2 }), // HPP (auto-calculated)
    stockQty: decimal('stock_qty', { precision: 15, scale: 3 }).default('0'),
    trackInventory: boolean('track_inventory').default(true),
    hasRecipe: boolean('has_recipe').default(false),
    imageUrl: varchar('image_url', { length: 500 }),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const productsRelations = relations(products, ({ one, many }) => ({
    outlet: one(outlets, { fields: [products.outletId], references: [outlets.id] }),
    category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
    brand: one(brands, { fields: [products.brandId], references: [brands.id] }),
    recipes: many(recipes),
    prices: many(productPrices),
    bundleItems: many(bundleItems),
}));

// ===============================
// RECIPES (Resep Produksi / BOM)
// ===============================

export const recipes = pgTable('recipes', {
    id: uuid('id').primaryKey().defaultRandom(),
    productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
    rawMaterialId: uuid('raw_material_id').references(() => rawMaterials.id).notNull(),
    quantity: decimal('quantity', { precision: 15, scale: 4 }).notNull(), // Qty bahan per 1 produk
    unit: varchar('unit', { length: 20 }),
    notes: text('notes'),
});

export const recipesRelations = relations(recipes, ({ one }) => ({
    product: one(products, { fields: [recipes.productId], references: [products.id] }),
    rawMaterial: one(rawMaterials, { fields: [recipes.rawMaterialId], references: [rawMaterials.id] }),
}));

// ===============================
// BUNDLES (Paket Promo)
// ===============================

export const bundles = pgTable('bundles', {
    id: uuid('id').primaryKey().defaultRandom(),
    outletId: uuid('outlet_id').references(() => outlets.id).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    bundlePrice: decimal('bundle_price', { precision: 15, scale: 2 }).notNull(),
    originalPrice: decimal('original_price', { precision: 15, scale: 2 }), // Total harga normal
    savings: decimal('savings', { precision: 15, scale: 2 }), // Hemat berapa
    startDate: timestamp('start_date'),
    endDate: timestamp('end_date'),
    isActive: boolean('is_active').default(true),
    imageUrl: varchar('image_url', { length: 500 }),
    createdAt: timestamp('created_at').defaultNow(),
});

export const bundlesRelations = relations(bundles, ({ one, many }) => ({
    outlet: one(outlets, { fields: [bundles.outletId], references: [outlets.id] }),
    items: many(bundleItems),
}));

export const bundleItems = pgTable('bundle_items', {
    id: uuid('id').primaryKey().defaultRandom(),
    bundleId: uuid('bundle_id').references(() => bundles.id, { onDelete: 'cascade' }).notNull(),
    productId: uuid('product_id').references(() => products.id).notNull(),
    quantity: integer('quantity').notNull().default(1),
});

export const bundleItemsRelations = relations(bundleItems, ({ one }) => ({
    bundle: one(bundles, { fields: [bundleItems.bundleId], references: [bundles.id] }),
    product: one(products, { fields: [bundleItems.productId], references: [products.id] }),
}));

// ===============================
// PRICE LEVELS (Multi-Level Pricing)
// ===============================

export const priceLevels = pgTable('price_levels', {
    id: uuid('id').primaryKey().defaultRandom(),
    outletId: uuid('outlet_id').references(() => outlets.id).notNull(),
    name: varchar('name', { length: 50 }).notNull(), // Retail, Reseller, Agen, Distributor
    levelOrder: integer('level_order').notNull(), // 1, 2, 3, 4
    minPoints: integer('min_points').default(0), // Minimum poin untuk level ini
    discountPct: decimal('discount_pct', { precision: 5, scale: 2 }).default('0'),
    description: text('description'),
    color: varchar('color', { length: 7 }), // Hex color for UI
    createdAt: timestamp('created_at').defaultNow(),
});

export const priceLevelsRelations = relations(priceLevels, ({ one, many }) => ({
    outlet: one(outlets, { fields: [priceLevels.outletId], references: [outlets.id] }),
    productPrices: many(productPrices),
}));

// ===============================
// PRODUCT PRICES PER LEVEL
// ===============================

export const productPrices = pgTable('product_prices', {
    id: uuid('id').primaryKey().defaultRandom(),
    productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
    levelId: uuid('level_id').references(() => priceLevels.id).notNull(),
    price: decimal('price', { precision: 15, scale: 2 }).notNull(),
});

export const productPricesRelations = relations(productPrices, ({ one }) => ({
    product: one(products, { fields: [productPrices.productId], references: [products.id] }),
    level: one(priceLevels, { fields: [productPrices.levelId], references: [priceLevels.id] }),
}));

