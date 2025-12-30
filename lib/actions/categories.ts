"use server";

import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function getAllCategories() {
    try {
        const allCategories = await db
            .select({
                id: categories.id,
                name: categories.name,
            })
            .from(categories)
            .where(eq(categories.isActive, true))
            .orderBy(asc(categories.name));

        return allCategories;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}
