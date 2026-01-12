import { mysqlTable, varchar, text, timestamp, boolean, decimal, int } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import { outlets, categories, brands, suppliers } from './core';

// ===============================
// RAW MATERIALS (Bahan Baku)
// ===============================

export const rawMaterials = mysqlTable('raw_materials', {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    outletId: varchar('outlet_id', { length: 36 }).notNull(),
    sku: varchar('sku', { length: 50 }),
    name: varchar('name', { length: 100 }).notNull(),
    unit: varchar('unit', { length: 20 }).notNull(),
    purchasePrice: decimal('purchase_price', { precision: 15, scale: 2 }).notNull(),
    stockQty: decimal('stock_qty', { precision: 15, scale: 3 }).default('0'),
    minStock: decimal('min_stock', { precision: 15, scale: 3 }).default('0'),
    supplierId: varchar('supplier_id', { length: 36 }),
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

export const products = mysqlTable('products', {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    outletId: varchar('outlet_id', { length: 36 }).notNull(),
    sku: varchar('sku', { length: 50 }),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    categoryId: varchar('category_id', { length: 36 }),
    brandId: varchar('brand_id', { length: 36 }),
    basePrice: decimal('base_price', { precision: 15, scale: 2 }).notNull(),
    costPrice: decimal('cost_price', { precision: 15, scale: 2 }),
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

export const recipes = mysqlTable('recipes', {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    productId: varchar('product_id', { length: 36 }).notNull(),
    rawMaterialId: varchar('raw_material_id', { length: 36 }).notNull(),
    quantity: decimal('quantity', { precision: 15, scale: 4 }).notNull(),
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

export const bundles = mysqlTable('bundles', {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    outletId: varchar('outlet_id', { length: 36 }).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    bundlePrice: decimal('bundle_price', { precision: 15, scale: 2 }).notNull(),
    originalPrice: decimal('original_price', { precision: 15, scale: 2 }),
    savings: decimal('savings', { precision: 15, scale: 2 }),
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

export const bundleItems = mysqlTable('bundle_items', {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    bundleId: varchar('bundle_id', { length: 36 }).notNull(),
    productId: varchar('product_id', { length: 36 }).notNull(),
    quantity: int('quantity').notNull().default(1),
});

export const bundleItemsRelations = relations(bundleItems, ({ one }) => ({
    bundle: one(bundles, { fields: [bundleItems.bundleId], references: [bundles.id] }),
    product: one(products, { fields: [bundleItems.productId], references: [products.id] }),
}));

// ===============================
// PRICE LEVELS (Multi-Level Pricing)
// ===============================

export const priceLevels = mysqlTable('price_levels', {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    outletId: varchar('outlet_id', { length: 36 }).notNull(),
    name: varchar('name', { length: 50 }).notNull(),
    levelOrder: int('level_order').notNull(),
    minPoints: int('min_points').default(0),
    discountPct: decimal('discount_pct', { precision: 5, scale: 2 }).default('0'),
    description: text('description'),
    color: varchar('color', { length: 7 }),
    createdAt: timestamp('created_at').defaultNow(),
});

export const priceLevelsRelations = relations(priceLevels, ({ one, many }) => ({
    outlet: one(outlets, { fields: [priceLevels.outletId], references: [outlets.id] }),
    productPrices: many(productPrices),
}));

// ===============================
// PRODUCT PRICES PER LEVEL
// ===============================

export const productPrices = mysqlTable('product_prices', {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    productId: varchar('product_id', { length: 36 }).notNull(),
    levelId: varchar('level_id', { length: 36 }).notNull(),
    price: decimal('price', { precision: 15, scale: 2 }).notNull(),
});

export const productPricesRelations = relations(productPrices, ({ one }) => ({
    product: one(products, { fields: [productPrices.productId], references: [products.id] }),
    level: one(priceLevels, { fields: [productPrices.levelId], references: [priceLevels.id] }),
}));
