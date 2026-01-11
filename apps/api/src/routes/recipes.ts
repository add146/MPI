import { Hono } from 'hono';
import { z } from 'zod';
import { db, recipes, products, rawMaterials } from '@mpi/db';
import { eq, and, sql } from 'drizzle-orm';

export const recipesRoutes = new Hono();

const recipeItemSchema = z.object({
    rawMaterialId: z.string().uuid(),
    quantity: z.number().positive(),
    unit: z.string().optional(),
    notes: z.string().optional(),
});

const updateRecipeSchema = z.object({
    items: z.array(recipeItemSchema),
});

// GET /api/recipes/product/:productId
recipesRoutes.get('/product/:productId', async (c) => {
    const productId = c.req.param('productId');

    const result = await db.query.recipes.findMany({
        where: eq(recipes.productId, productId),
        with: {
            rawMaterial: true,
        },
    });

    // Calculate HPP
    let hpp = 0;
    for (const recipe of result) {
        const qty = parseFloat(recipe.quantity);
        const price = parseFloat(recipe.rawMaterial.purchasePrice);
        hpp += qty * price;
    }

    return c.json({
        productId,
        hpp,
        items: result,
    });
});

// PUT /api/recipes/product/:productId - Replace entire recipe
recipesRoutes.put('/product/:productId', async (c) => {
    try {
        const productId = c.req.param('productId');
        const body = await c.req.json();
        const { items } = updateRecipeSchema.parse(body);

        // Delete existing recipes
        await db.delete(recipes).where(eq(recipes.productId, productId));

        // Insert new recipes
        if (items.length > 0) {
            await db.insert(recipes).values(
                items.map((item) => ({
                    productId,
                    rawMaterialId: item.rawMaterialId,
                    quantity: item.quantity.toString(),
                    unit: item.unit,
                    notes: item.notes,
                }))
            );

            // Update product hasRecipe flag
            await db.update(products)
                .set({ hasRecipe: true })
                .where(eq(products.id, productId));
        } else {
            await db.update(products)
                .set({ hasRecipe: false })
                .where(eq(products.id, productId));
        }

        // Calculate and update HPP
        let hpp = 0;
        for (const item of items) {
            const material = await db.query.rawMaterials.findFirst({
                where: eq(rawMaterials.id, item.rawMaterialId),
            });
            if (material) {
                hpp += item.quantity * parseFloat(material.purchasePrice);
            }
        }

        await db.update(products)
            .set({ costPrice: hpp.toString() })
            .where(eq(products.id, productId));

        // Return updated recipe
        const updatedRecipe = await db.query.recipes.findMany({
            where: eq(recipes.productId, productId),
            with: {
                rawMaterial: true,
            },
        });

        return c.json({
            productId,
            hpp,
            items: updatedRecipe,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return c.json({ error: 'Validation failed', details: error.errors }, 400);
        }
        throw error;
    }
});

// POST /api/recipes/product/:productId/item - Add single item
recipesRoutes.post('/product/:productId/item', async (c) => {
    try {
        const productId = c.req.param('productId');
        const body = await c.req.json();
        const item = recipeItemSchema.parse(body);

        const [newRecipe] = await db.insert(recipes).values({
            productId,
            rawMaterialId: item.rawMaterialId,
            quantity: item.quantity.toString(),
            unit: item.unit,
            notes: item.notes,
        }).returning();

        // Update hasRecipe
        await db.update(products)
            .set({ hasRecipe: true })
            .where(eq(products.id, productId));

        // Recalculate HPP
        const allRecipes = await db.query.recipes.findMany({
            where: eq(recipes.productId, productId),
            with: { rawMaterial: true },
        });

        let hpp = 0;
        for (const recipe of allRecipes) {
            hpp += parseFloat(recipe.quantity) * parseFloat(recipe.rawMaterial.purchasePrice);
        }

        await db.update(products)
            .set({ costPrice: hpp.toString() })
            .where(eq(products.id, productId));

        return c.json(newRecipe, 201);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return c.json({ error: 'Validation failed', details: error.errors }, 400);
        }
        throw error;
    }
});

// DELETE /api/recipes/:id
recipesRoutes.delete('/:id', async (c) => {
    const id = c.req.param('id');

    const recipe = await db.query.recipes.findFirst({
        where: eq(recipes.id, id),
    });

    if (!recipe) {
        return c.json({ error: 'Recipe item not found' }, 404);
    }

    await db.delete(recipes).where(eq(recipes.id, id));

    // Check if product still has recipes
    const remaining = await db.query.recipes.findMany({
        where: eq(recipes.productId, recipe.productId),
    });

    if (remaining.length === 0) {
        await db.update(products)
            .set({ hasRecipe: false, costPrice: '0' })
            .where(eq(products.id, recipe.productId));
    } else {
        // Recalculate HPP
        let hpp = 0;
        for (const r of remaining) {
            const material = await db.query.rawMaterials.findFirst({
                where: eq(rawMaterials.id, r.rawMaterialId),
            });
            if (material) {
                hpp += parseFloat(r.quantity) * parseFloat(material.purchasePrice);
            }
        }

        await db.update(products)
            .set({ costPrice: hpp.toString() })
            .where(eq(products.id, recipe.productId));
    }

    return c.json({ success: true });
});
