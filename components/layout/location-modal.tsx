"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, Check } from "lucide-react";
import { useShippingLocation } from "@/contexts/shipping-location-context";
import { cn } from "@/lib/utils";

// Group states for the UI
const FEATURED_STATES = ["CDMX", "Nuevo León", "Jalisco", "Estado de México"];

export function LocationModal() {
    const { availableLocations, setLocation, confirmLocation, isLocationModalOpen, setIsLocationModalOpen, hasUserSelected } = useShippingLocation();
    const [step, setStep] = useState<"state" | "city">("state");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedState, setSelectedState] = useState<string | null>(null);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);

    // Extract unique states from available locations
    const allStates = Array.from(new Set(availableLocations.map(l => l.state))).sort();

    // Filter states based on search
    const filteredStates = allStates.filter(state =>
        state.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleStateSelect = (state: string) => {
        setSelectedState(state);
        setStep("city");
    };

    const handleConfirm = () => {
        if (selectedState && selectedCity) {
            const location = availableLocations.find(
                l => normalizeString(l.state) === normalizeString(selectedState) && l.displayName === selectedCity
            );

            if (location) {
                setLocation(location);
                confirmLocation();
                setIsLocationModalOpen(false);
            }
        }
    };

    const [isStateOpen, setIsStateOpen] = useState(false);

    // If user hasn't selected a location yet, the modal is mandatory (blocking)
    const canClose = hasUserSelected;

    // Helper for robust string comparison
    const normalizeString = (str: string) => {
        return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    };

    console.log('[LocationModal] Logic check:', {
        selectedState,
        normalizedSelected: selectedState ? normalizeString(selectedState) : 'null',
        availableStates: availableLocations.map(l => l.state)
    });

    return (
        <Dialog open={isLocationModalOpen} onOpenChange={setIsLocationModalOpen}>
            <DialogContent
                className="sm:max-w-md p-0 gap-0 bg-white rounded-none border-0 z-[9999]"
                showCloseButton={canClose}
                onPointerDownOutside={(e) => !canClose && e.preventDefault()}
            >
                <DialogHeader className="p-6 pb-2 text-center">
                    <DialogTitle className="text-sm font-univers tracking-widest font-normal uppercase text-gray-800">
                        SELECCIONA UBICACIÓN DE ENTREGA
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6 pt-2 space-y-4">

                    {/* State Selector - Refactored to Standard Select for Robustness */}
                    <div className="relative">
                        <Select
                            value={selectedState || ""}
                            onValueChange={handleStateSelect}
                        >
                            <SelectTrigger className="w-full border-0 border-b border-black rounded-none px-0 py-3 shadow-none focus:ring-0 h-auto">
                                <SelectValue placeholder={<span className="text-gray-500 text-xs font-univers tracking-wide uppercase">ESTADO</span>} />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px] z-[99999]">
                                {/* Featured States */}
                                <div className="p-2 pb-0">
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 px-2">Destacados</p>
                                    {FEATURED_STATES.map(state => (
                                        <SelectItem key={`featured-${state}`} value={state} className="text-xs">
                                            {state}
                                        </SelectItem>
                                    ))}
                                </div>
                                <div className="my-1 border-b border-gray-100" />

                                {/* All States */}
                                <div className="p-2 pt-0">
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 px-2">A - Z</p>
                                    {allStates.map(state => (
                                        <SelectItem key={state} value={state} className="text-xs">
                                            {state}
                                        </SelectItem>
                                    ))}
                                </div>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* City Selector */}
                    <div className="relative">
                        <Select
                            disabled={!selectedState}
                            value={selectedCity || ""}
                            onValueChange={setSelectedCity}
                        >
                            <SelectTrigger className="w-full border-0 border-b border-black rounded-none px-0 py-3 shadow-none focus:ring-0 h-auto">
                                <SelectValue placeholder={<span className="text-gray-500 text-xs font-univers tracking-wide uppercase">CIUDAD</span>} />
                            </SelectTrigger>
                            <SelectContent className="z-[99999]">
                                {availableLocations
                                    .filter(l => normalizeString(l.state) === (selectedState ? normalizeString(selectedState) : ''))
                                    .map(loc => (
                                        <SelectItem key={loc.displayName} value={loc.displayName} className="text-xs">
                                            {loc.city}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        className="w-full bg-black text-white hover:bg-gray-800 rounded-none h-12 text-xs font-univers tracking-widest uppercase mt-6"
                        onClick={handleConfirm}
                        disabled={!selectedState || !selectedCity}
                    >
                        ACEPTAR
                    </Button>

                </div>
            </DialogContent>
        </Dialog>
    );
}
