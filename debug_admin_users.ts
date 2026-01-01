
import { listUsers } from "./lib/services/user-service";

async function main() {
    console.log("Attempting to list users detailed...");
    try {
        const result = await listUsers({
            userType: 'all',
            status: 'all',
            page: 1,
            limit: 1000
        });
        console.log("Result success:", result.success);
        console.log("Result error:", result.error);
        console.log("Users count:", result.users?.length);
        const targetUser = result.users.find((u: any) => u.email === 'client@luzimarket.shop');
        if (targetUser) {
            console.log("FOUND TARGET USER (client@luzimarket.shop):", targetUser);
        } else {
            console.log("Target user NOT FOUND in top 10 results.");
        }
        if (result.users && result.users.length > 0) {
            console.log("First user:", result.users[0]);
        }
    } catch (err) {
        console.error("Caught ERROR in main:", err);
    }
    process.exit(0);
}

main();
