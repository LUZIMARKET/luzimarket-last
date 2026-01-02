"use client";

import { MapPin } from "lucide-react";

interface StoreMapPreviewProps {
    street?: string | null;
    city?: string | null;
    country?: string | null;
    className?: string;
}

export function StoreMapPreview({ street, city, country, className }: StoreMapPreviewProps) {
    const handleFocusAddress = () => {
        const input = document.getElementById("street");
        if (input) {
            input.focus();
        }
    };

    return (
        <div
            className={`rounded-xl overflow-hidden border border-gray-100 shadow-sm aspect-video bg-gray-50 relative group cursor-pointer hover:ring-2 hover:ring-black/5 transition-all ${className || ""}`}
            onClick={handleFocusAddress}
        >
            {/* Abstract Map Background Pattern */}
            <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                    <div className="h-3 w-3 bg-black rounded-full absolute -bottom-1 left-1/2 -translate-x-1/2 opacity-20 blur-[2px]"></div>
                    <MapPin className="h-8 w-8 text-black drop-shadow-lg relative -translate-y-1 transition-transform group-hover:-translate-y-2 duration-300 fill-black/10" />
                </div>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="bg-black text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-sm transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    Editar Dirección
                </span>
            </div>

            <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/50 shadow-sm group-hover:opacity-0 transition-opacity">
                <p className="text-[10px] text-gray-500 font-medium truncate">
                    {street || city || "Ubicación de la tienda"}
                    {city && country ? `, ${country}` : ""}
                </p>
            </div>
        </div>
    );
}
