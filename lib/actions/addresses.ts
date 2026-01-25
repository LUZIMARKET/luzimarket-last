"use server";

import { db } from "@/db";
import { userAddresses } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function getUserAddresses() {
    const session = await auth();
    if (!session?.user?.id) {
        return [];
    }

    const addresses = await db.query.userAddresses.findMany({
        where: eq(userAddresses.userId, session.user.id),
        orderBy: (addresses, { desc }) => [desc(addresses.isDefault), desc(addresses.createdAt)],
    });

    return addresses;
}

export async function createUserAddress(data: {
    name: string;
    street: string;
    exteriorNumber?: string;
    interiorNumber?: string;
    neighborhood?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
    isDefault?: boolean;
}) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    // If this is the first address, make it default automatically
    const existingAddresses = await getUserAddresses();
    const isFirstAddress = existingAddresses.length === 0;
    const shouldBeDefault = data.isDefault || isFirstAddress;

    if (shouldBeDefault && existingAddresses.length > 0) {
        // Unset existing default
        await db
            .update(userAddresses)
            .set({ isDefault: false })
            .where(and(eq(userAddresses.userId, session.user.id), eq(userAddresses.isDefault, true)));
    }

    await db.insert(userAddresses).values({
        userId: session.user.id,
        ...data,
        isDefault: shouldBeDefault,
    });

    revalidatePath("/account");
    return { success: true };
}

export async function updateUserAddress(id: string, data: {
    name: string;
    street: string;
    exteriorNumber?: string;
    interiorNumber?: string;
    neighborhood?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
    isDefault?: boolean;
}) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    if (data.isDefault) {
        // Unset existing default
        await db
            .update(userAddresses)
            .set({ isDefault: false })
            .where(and(eq(userAddresses.userId, session.user.id), eq(userAddresses.isDefault, true)));
    }

    await db
        .update(userAddresses)
        .set({
            ...data,
            updatedAt: new Date(),
        })
        .where(and(eq(userAddresses.id, id), eq(userAddresses.userId, session.user.id)));

    revalidatePath("/account");
    return { success: true };
}

export async function deleteUserAddress(id: string) {
    console.log("Attempting to delete address:", id);
    const session = await auth();
    if (!session?.user?.id) {
        console.error("Unauthorized delete attempt");
        throw new Error("Unauthorized");
    }

    try {
        await db
            .delete(userAddresses)
            .where(and(eq(userAddresses.id, id), eq(userAddresses.userId, session.user.id)));

        console.log("Address deleted successfully in DB:", id);
        revalidatePath("/account");
        return { success: true };
    } catch (error) {
        console.error("Error deleting address:", error);
        throw error;
    }
}

export async function setDefaultAddress(id: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    // Unset existing default
    await db
        .update(userAddresses)
        .set({ isDefault: false })
        .where(and(eq(userAddresses.userId, session.user.id), eq(userAddresses.isDefault, true)));

    // Set new default
    await db
        .update(userAddresses)
        .set({ isDefault: true })
        .where(and(eq(userAddresses.id, id), eq(userAddresses.userId, session.user.id)));

    revalidatePath("/account");
    return { success: true };
}
