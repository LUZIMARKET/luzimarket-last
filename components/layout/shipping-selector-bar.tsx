"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useShippingLocation } from "@/contexts/shipping-location-context";

export function ShippingSelectorBar() {
    const { availableLocations, setLocation } = useShippingLocation();
    const [selectedState, setSelectedState] = useState<string>("");

    // Extract unique states
    const states = Array.from(new Set(availableLocations.map(l => l.state)));

    return (
        <div className="flex items-center h-full border-l border-r border-gray-200 text-[10px] tracking-widest font-univers">
            {/* Label */}
            <div className="px-4 py-1 font-medium text-gray-800 hidden lg:block">
                SELECCIONA UBICACIÓN DE ENTREGA
            </div>

            {/* State Dropdown */}
            <div className="border-l border-gray-200 h-full">
                <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger className="h-full border-0 rounded-none bg-transparent px-4 py-0 focus:ring-0 text-[10px] uppercase w-[120px] text-gray-500">
                        <SelectValue placeholder="ESTADO" />
                    </SelectTrigger>
                    <SelectContent>
                        {states.map(state => (
                            <SelectItem key={state} value={state} className="text-xs">
                                {state}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* City Dropdown */}
            <div className="border-l border-gray-200 h-full">
                <Select onValueChange={(city) => {
                    const loc = availableLocations.find(l => l.displayName === city);
                    if (loc) setLocation(loc);
                }}>
                    <SelectTrigger className="h-full border-0 rounded-none bg-transparent px-4 py-0 focus:ring-0 text-[10px] uppercase w-[120px] text-gray-500">
                        <SelectValue placeholder="CIUDAD" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableLocations
                            .filter(l => !selectedState || l.state === selectedState)
                            .map(loc => (
                                <SelectItem key={loc.displayName} value={loc.displayName} className="text-xs">
                                    {loc.city}
                                </SelectItem>
                            ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Accept Button */}
            <Button className="h-full rounded-none bg-black text-white hover:bg-gray-800 px-6 text-[10px] tracking-widest font-medium uppercase border-l border-gray-200 ml-0">
                ACEPTAR
            </Button>
        </div>
    );
}
