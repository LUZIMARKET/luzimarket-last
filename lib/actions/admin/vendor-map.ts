import { db } from "@/db";
import { vendors } from "@/db/schema";
import { sql, and } from "drizzle-orm";

export interface VendorLocationData {
    city: string;
    state: string;
    count: number;
}

export async function getVendorLocations(): Promise<VendorLocationData[]> {
    const locations = await db
        .select({
            city: vendors.city,
            state: vendors.state,
            count: sql<number>`count(*)`
        })
        .from(vendors)
        .where(and(
            sql`${vendors.isActive} = true`,
            sql`${vendors.city} IS NOT NULL`
        ))
        .groupBy(vendors.city, vendors.state);

    return locations.map(loc => ({
        city: loc.city || 'Unknown',
        state: loc.state || 'Unknown',
        count: Number(loc.count)
    })).filter(loc => loc.city !== 'Unknown');
}
