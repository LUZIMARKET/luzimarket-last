"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTransition } from "react";

export function ProductStatusFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const currentStatus = searchParams.get("status") || "all";

    const handleStatusChange = (status: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (status === "all") {
            params.delete("status");
        } else {
            params.set("status", status);
        }

        startTransition(() => {
            router.push(`?${params.toString()}`);
            router.refresh();
        });
    };

    return (
        <Tabs
            defaultValue={currentStatus}
            onValueChange={handleStatusChange}
            className="w-full sm:w-auto"
        >
            <TabsList className="grid w-full grid-cols-3 sm:w-[400px]">
                <TabsTrigger value="all" disabled={isPending}>
                    Todos
                </TabsTrigger>
                <TabsTrigger value="active" disabled={isPending}>
                    Activos
                </TabsTrigger>
                <TabsTrigger value="inactive" disabled={isPending}>
                    Inactivos
                </TabsTrigger>
            </TabsList>
        </Tabs>
    );
}
