
import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";

async function main() {
    console.log("Checking for user client@luzimarket.shop...");
    const user = await db.query.users.findFirst({
        where: eq(users.email, "client@luzimarket.shop"),
    });

    if (user) {
        console.log("User found:", user);
    } else {
        console.log("User NOT found.");
    }
    process.exit(0);
}

main();
