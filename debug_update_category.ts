import { db } from './db/index';
import { products, categories } from './db/schema';
import { eq } from 'drizzle-orm';

async function debugUpdate() {
    try {
        // 1. Get a product
        const product = await db.query.products.findFirst();
        if (!product) {
            console.log('No products found');
            return;
        }
        console.log(`Checking Product: ${product.name} (ID: ${product.id})`);
        console.log(`Current Category ID: ${product.categoryId}`);

        // 2. Get a different category
        const allCategories = await db.select().from(categories).limit(5);
        const newCategory = allCategories.find(c => c.id !== product.categoryId) || allCategories[0];

        if (!newCategory) {
            console.log('No categories found');
            return;
        }

        console.log(`Attempting to update to Category: ${newCategory.name} (ID: ${newCategory.id})`);

        // 3. Update
        const [updated] = await db
            .update(products)
            .set({
                categoryId: newCategory.id,
                updatedAt: new Date()
            })
            .where(eq(products.id, product.id))
            .returning();

        console.log(`Update Result Category ID: ${updated.categoryId}`);

        // 4. Verify persist
        const refreshed = await db.query.products.findFirst({
            where: eq(products.id, product.id)
        });
        console.log(`Refreshed Database Category ID: ${refreshed?.categoryId}`);

        if (updated.categoryId === newCategory.id && refreshed?.categoryId === newCategory.id) {
            console.log("SUCCESS: Database update works correctly.");
        } else {
            console.log("FAILURE: Database update failed to persist.");
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

debugUpdate();
