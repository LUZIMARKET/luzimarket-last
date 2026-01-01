
import { db } from "./db";
import { orders, products, vendors, users, adminUsers } from "./db/schema";
import { sql, and, gt } from "drizzle-orm";

async function getStats() {
    console.log("Starting getStats simulation...");
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    console.log("Time window:", { now, thirtyDaysAgo, sixtyDaysAgo });

    try {
        // Run a simplified version of the queries to check for timeouts
        const [totalRevenue] = await Promise.all([
            db.select({
                total: sql<number>`COALESCE(SUM(${orders.total}::numeric), 0)`
            }).from(orders).where(sql`${orders.paymentStatus} = 'succeeded'`)
        ]);
        console.log("Revenue query completed:", totalRevenue);
    } catch (err) {
        console.error("Query failed:", err);
    }
}

getStats().then(() => {
    console.log("Done");
    process.exit(0);
});
