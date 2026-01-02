
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

const TARGET_ORDERS = [
    // Order ID -> Config
    { id: "ORD-00000001", carrier: "rappi", tracking: "RAPPI-ENTREGA-456", label: "Rappi Favor" },
    { id: "ORD-00000010", carrier: "uber", tracking: "UBER-FLASH-123", label: "Uber Flash" },
    { id: "ORD-00000014", carrier: "vendor-shipping", tracking: "ENTREGA-LOCAL-001", label: "Entrega Directa" },
    { id: "ORD-00000004", carrier: "estafeta", tracking: "0123456789012345678901", label: "Estafeta Terrestre" },
    { id: "ORD-00000012", carrier: "99minutos", tracking: "99MIN-12345", label: "99Minutos" },
    { id: "ORD-00000009", carrier: "fedex", tracking: "123456789012", label: "FedEx Standard" },
    { id: "ORD-00000003", carrier: "ups", tracking: "1Z9999999999999999", label: "UPS Ground" },
    { id: "ORD-00000008", carrier: "dhl", tracking: "0000000000", label: "DHL Express" },
    { id: "ORD-00000007", carrier: "correos-de-mexico", tracking: "RM000000000MX", label: "Correos de México" },
];

async function main() {
    console.log("Seeding demo shipping data for specific user orders...");

    const targetIds = TARGET_ORDERS.map(o => o.id);

    const existingOrders = await db.query.orders.findMany({
        where: inArray(orders.orderNumber, targetIds),
        with: {
            vendor: true,
        }
    });

    console.log(`Found ${existingOrders.length} matching orders belonging to the user.`);

    for (const order of existingOrders) {
        const config = TARGET_ORDERS.find(o => o.id === order.orderNumber);
        if (!config) continue;

        await db.update(orders)
            .set({
                status: "shipped",
                carrier: config.carrier,
                trackingNumber: config.tracking,
                shippedAt: new Date(),
                updatedAt: new Date(),
            })
            .where(eq(orders.id, order.id));

        console.log(`Updated Order ${order.orderNumber}:`);
        console.log(`  - Carrier: ${config.carrier}`);
        console.log(`  - Tracking: ${config.tracking}`);
        console.log("-----------------------------------");
    }

    console.log("Done!");
    process.exit(0);
}

main();
