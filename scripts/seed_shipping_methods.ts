
import { db } from "@/db";
import { shippingMethods } from "@/db/schema";
import { eq } from "drizzle-orm";

const NEW_METHODS = [
    {
        carrier: "vendor-shipping",
        serviceType: "standard",
        name: "Vendor Shipping (Direct)",
        code: "VENDOR_DIRECT",
        description: "Delivery handled directly by the vendor (Own fleet/Personal delivery)",
        minDeliveryDays: 1,
        maxDeliveryDays: 5,
        trackingUrlPattern: "https://wa.me/?text=Hola,%20quisiera%20saber%20el%20estatus%20de%20mi%20pedido%20{trackingNumber}",
    },
    {
        carrier: "uber",
        serviceType: "express",
        name: "Uber Flash",
        code: "UBER_FLASH",
        description: "Instant delivery via Uber Flash",
        minDeliveryDays: 0,
        maxDeliveryDays: 1,
        trackingUrlPattern: "https://www.uber.com/mx/es/",
    },
    {
        carrier: "rappi",
        serviceType: "express",
        name: "Rappi Favor",
        code: "RAPPI_FAVOR",
        description: "Instant delivery via Rappi Favor",
        minDeliveryDays: 0,
        maxDeliveryDays: 1,
        trackingUrlPattern: "https://www.rappi.com.mx/",
    },
];

async function main() {
    console.log("Seeding adding new shipping methods...");

    for (const method of NEW_METHODS) {
        const existing = await db.query.shippingMethods.findFirst({
            where: eq(shippingMethods.code, method.code),
        });

        if (existing) {
            console.log(`Method ${method.name} already exists. Skipping.`);
            continue;
        }

        await db.insert(shippingMethods).values({
            ...method,
            isActive: true,
            createdAt: new Date(),
        });

        console.log(`Created shipping method: ${method.name}`);
    }

    console.log("Done!");
    process.exit(0);
}

main();
