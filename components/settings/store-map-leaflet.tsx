"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const StoreMapLeafletClient = dynamic(
    () => import("./store-map-leaflet-client"),
    {
        ssr: false,
        loading: () => <Skeleton className="w-full h-full rounded-xl" />
    }
);

interface StoreMapLeafletProps {
    street?: string | null;
    city?: string | null;
    country?: string | null;
    className?: string;
}

export function StoreMapLeaflet(props: StoreMapLeafletProps) {
    return <StoreMapLeafletClient {...props} />;
}
