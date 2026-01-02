"use client";

import { useShippingLocation } from "@/contexts/shipping-location-context";

export function ShippingSelectorBar() {
    const { location: shippingLocation, setIsLocationModalOpen } = useShippingLocation();

    return (
        <div className="flex items-center h-full text-[10px] tracking-widest font-univers">
            {/* Static Display - Clickable to open modal */}
            <div
                className="px-4 py-1 font-medium text-black uppercase cursor-pointer hover:text-gray-600 transition-colors"
                onClick={() => setIsLocationModalOpen(true)}
            >
                ENVIAR A <span className="mx-2 text-gray-400">→</span> {shippingLocation?.city}, {shippingLocation?.state}
            </div>
        </div>
    );
}
