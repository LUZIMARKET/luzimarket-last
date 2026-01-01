
import { db } from "./db";
import { orders, users } from "./db/schema";
import { sql, eq } from "drizzle-orm";

async function main() {
    console.log("Checking orders data...");

    // 1. Count total orders
    const orderCount = await db.select({ count: sql<number>`cast(count(*) as int)` }).from(orders);
    console.log(`Total Orders in DB: ${orderCount[0].count}`);

    if (orderCount[0].count > 0) {
        // 2. Get first 5 orders and their userIds
        const sampleOrders = await db.select({
            id: orders.id,
            userId: orders.userId,
            total: orders.total
        }).from(orders).limit(5);

        console.log("Sample Orders:", sampleOrders);

        // 3. Check if these userIds exist in users table
        for (const order of sampleOrders) {
            if (order.userId) {
                const user = await db.select({ id: users.id, email: users.email }).from(users).where(eq(users.id, order.userId)).limit(1);
                console.log(`Order ${order.id} belongs to User ${order.userId}: ${user.length > 0 ? "FOUND (" + user[0].email + ")" : "NOT FOUND IN USERS TABLE"}`);
            } else {
                console.log(`Order ${order.id} has NO userId (Guest order?)`);
            }
        }
    } else {
        console.log("No orders found in the database. 0 is the correct number.");
    }
    process.exit(0);
}

main();
