"use client";

import dynamic from "next/dynamic";
import { type VendorLocationData } from "@/lib/actions/admin/vendor-map";

const MapView = dynamic(() => import("./map-view"), {
    ssr: false,
    loading: () => (
        <div className="h-[400px] w-full rounded-lg bg-gray-100 flex items-center justify-center animate-pulse">
            <span className="text-gray-400 font-univers text-sm">Cargando mapa...</span>
        </div>
    ),
});

export default function VendorMapWrapper({ locations }: { locations: VendorLocationData[] }) {
    return <MapView locations={locations} />;
}
