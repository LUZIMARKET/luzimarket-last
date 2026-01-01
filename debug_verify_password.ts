
import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function main() {
    console.log("Verifying password for client@luzimarket.shop...");
    const user = await db.query.users.findFirst({
        where: eq(users.email, "client@luzimarket.shop"),
    });

    if (!user) {
        console.log("User not found.");
        process.exit(1);
    }

    const passwordToTest = "password123";
    const isMatch = await bcrypt.compare(passwordToTest, user.passwordHash);

    console.log(`Password '${passwordToTest}' matches hash: ${isMatch}`);
    process.exit(0);
}

main();
