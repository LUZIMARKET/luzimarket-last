
import { db } from "./db";
import { users, vendors, adminUsers } from "./db/schema";
import { sql } from "drizzle-orm";

async function main() {
    console.log("Checking user counts by role...");

    const customerCount = await db.select({ count: sql<number>`cast(count(*) as int)` }).from(users);
    const vendorCount = await db.select({ count: sql<number>`cast(count(*) as int)` }).from(vendors);
    const adminCount = await db.select({ count: sql<number>`cast(count(*) as int)` }).from(adminUsers);

    console.log(`Customers: ${customerCount[0].count}`);
    console.log(`Vendors: ${vendorCount[0].count}`);
    console.log(`Admins: ${adminCount[0].count}`);

    if (adminCount[0].count > 0) {
        const admins = await db.select().from(adminUsers).limit(5);
        console.log("Admin Users:", admins.map(a => ({ email: a.email, name: a.name })));
    } else {
        console.log("NO ADMIN USERS FOUND. This explains why an admin might not see anything if they are logged in as customer!");
    }
    process.exit(0);
}

main();
