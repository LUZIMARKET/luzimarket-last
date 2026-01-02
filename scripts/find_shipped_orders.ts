
import { db } from "@/db";
import { orders } from "@/db/schema";
import { isNotNull, desc } from "drizzle-orm";

async function main() {
    try {
        const shippedOrders = await db.query.orders.findMany({
            where: isNotNull(orders.trackingNumber),
            limit: 5,
            orderBy: desc(orders.createdAt),
            with: {
                vendor: true,
            }
        });

        if (shippedOrders.length === 0) {
            console.log("No orders with tracking numbers found.");
        } else {
            console.log("Found shipped orders:");
            shippedOrders.forEach(order => {
                console.log(`Order: ${order.orderNumber}`);
                console.log(`Status: ${order.status}`);
                console.log(`Tracking: ${order.trackingNumber} (${order.carrier})`);
                console.log(`Vendor: ${order.vendor?.businessName}`);
                console.log("-------------------");
            });
        }
    } catch (error) {
        console.error("Error fetching orders:", error);
    } finally {
        process.exit(0);
    }
}

main();
