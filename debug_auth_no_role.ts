
import { authenticateUser } from "./lib/services/auth-service";

async function main() {
    console.log("Attempting to authenticate client@luzimarket.shop WITHOUT role...");
    try {
        // Pass undefined for userType to trigger auto-detection loop (Admin -> Vendor -> Customer)
        const result = await authenticateUser("client@luzimarket.shop", "password123");
        console.log("Result:", result);
    } catch (err) {
        console.error("Caught ERROR in main:", err);
    }
    process.exit(0);
}

main();
