
import { authenticateUser } from "./lib/services/auth-service";

async function main() {
    console.log("Attempting to authenticate client@luzimarket.shop...");
    try {
        const result = await authenticateUser("client@luzimarket.shop", "password123", "customer");
        console.log("Result:", result);
    } catch (err) {
        console.error("Caught ERROR in main:", err);
    }
    process.exit(0);
}

main();
