
import { db } from "./db";
import { products, categories } from "./db/schema";
import { eq, count } from "drizzle-orm";

async function checkCategoryCounts() {
    const allCategories = await db.select().from(categories);

    console.log("\n--- Category Product Counts ---");
    for (const cat of allCategories) {
        const productCount = await db
            .select({ count: count() })
            .from(products)
            .where(eq(products.categoryId, cat.id));

        if (productCount[0].count > 0) {
            console.log(`[x] ${cat.name}: ${productCount[0].count} products`);
        } else {
            console.log(`[ ] ${cat.name}: 0 products`);
        }
    }
    console.log("-------------------------------\n");
    process.exit(0);
}

checkCategoryCounts();
