"use client";

import { useState } from "react";
import { useShippingLocation } from "@/contexts/shipping-location-context";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for States
const FEATURED_STATES = ["CDMX", "Nuevo León", "Jalisco", "Estado de México"];
const ALL_STATES = [
    "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", 
    "Chiapas", "Chihuahua", "Coahuila", "Colima", "Durango", "Guanajuato", 
    "Guerrero", "Hidalgo", "Michoacán", "Morelos", "Nayarit", "Oaxaca", 
    "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa", 
    "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"
];

const MOCK_CITIES: Record<string, string[]> = {
  "Nuevo León": ["Monterrey", "San Pedro Garza García", "San Nicolás de los Garza", "Guadalupe", "Apodaca"],
  "Jalisco": ["Guadalajara", "Zapopan", "Tlaquepaque", "Tonalá", "Puerto Vallarta"],
  "CDMX": ["Álvaro Obregón", "Azcapotzalco", "Benito Juárez", "Coyoacán", "Cuauhtémoc", "Miguel Hidalgo", "Tlalpan"],
  "Estado de México": ["Toluca", "Naucalpan", "Tlalnepantla", "Huixquilucan", "Metepec", "Ecatepec"],
  "Querétaro": ["Querétaro", "Corregidora", "El Marqués", "San Juan del Río"]
};

export function ShippingSelectorBar() {
    const { location: shippingLocation, setLocation } = useShippingLocation();
    
    // Local state for the dropdown form
    const [selectedState, setSelectedState] = useState<string>(shippingLocation?.state || "");
    const [selectedCity, setSelectedCity] = useState<string>(shippingLocation?.city || "");
    
    const [isStateOpen, setIsStateOpen] = useState(false);
    const [isCityOpen, setIsCityOpen] = useState(false);
    
    const [stateSearch, setStateSearch] = useState("");
    const [citySearch, setCitySearch] = useState("");

    const handleAccept = () => {
        if (selectedState && selectedCity) {
            // Assume setLocation accepts state and city
            setLocation({ state: selectedState, city: selectedCity, country: 'Mexico' });
        }
    };

    // If city data isn't in mock, fallback to basic list
    const citiesForState = selectedState ? (MOCK_CITIES[selectedState] || ["Capital", "Centro", "Norte", "Sur"]) : [];

    // Filter logic
    const filteredFeatured = FEATURED_STATES.filter(s => s.toLowerCase().includes(stateSearch.toLowerCase()));
    const filteredAll = ALL_STATES.filter(s => s.toLowerCase().includes(stateSearch.toLowerCase()) && !FEATURED_STATES.includes(s));
    
    const filteredCities = citiesForState.filter(c => c.toLowerCase().includes(citySearch.toLowerCase()));

    return (
        <div className="flex items-center h-full text-[10px] tracking-widest font-sans border-x border-gray-200">
            <div className="px-6 py-2 font-medium text-black uppercase flex items-center h-full">
                SELECCIONA UBICACIÓN DE ENTREGA
            </div>
            
            <div className="h-full w-[1px] bg-gray-200" />
            
            {/* ESTADO Dropdown */}
            <Popover open={isStateOpen} onOpenChange={setIsStateOpen}>
                <PopoverTrigger asChild>
                    <div className="px-6 py-2 h-full flex items-center gap-6 cursor-pointer hover:bg-gray-50 min-w-[140px] uppercase transition-colors">
                        <span className={selectedState ? "text-black font-semibold" : "text-gray-400"}>
                            {selectedState || "ESTADO"}
                        </span>
                        <ChevronDown className="h-3 w-3 ml-auto text-gray-400 shrink-0" />
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0 rounded-none shadow-xl border border-gray-200 font-sans" align="start" sideOffset={8}>
                    <div className="flex items-center border-b border-gray-100 px-3 py-3 relative">
                        <Search className="h-3 w-3 text-gray-400 absolute left-4" />
                        <input 
                            type="text" 
                            className="w-full outline-none text-[11px] font-sans pl-6 placeholder:text-gray-300" 
                            placeholder="" 
                            value={stateSearch}
                            onChange={(e) => setStateSearch(e.target.value)}
                        />
                    </div>
                    <div className="max-h-[350px] overflow-y-auto px-4 py-5 scrollbar-thin">
                        {filteredFeatured.length > 0 && (
                            <div className="mb-6">
                                <div className="text-[9px] text-gray-400 mb-3 tracking-widest uppercase">DESTACADOS</div>
                                <div className="space-y-3">
                                    {filteredFeatured.map(s => (
                                        <div 
                                            key={s} 
                                            className="text-[12px] text-gray-700 hover:text-black hover:font-medium cursor-pointer transition-colors"
                                            onClick={() => { setSelectedState(s); setSelectedCity(''); setIsStateOpen(false); }}
                                        >
                                            {s}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {filteredAll.length > 0 && (
                            <div>
                                <div className="text-[9px] text-gray-400 mb-3 tracking-widest uppercase">A — Z</div>
                                <div className="space-y-3">
                                    {filteredAll.map(s => (
                                        <div 
                                            key={s} 
                                            className="text-[12px] text-gray-700 hover:text-black hover:font-medium cursor-pointer transition-colors"
                                            onClick={() => { setSelectedState(s); setSelectedCity(''); setIsStateOpen(false); }}
                                        >
                                            {s}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </PopoverContent>
            </Popover>

            <div className="h-full w-[1px] bg-gray-200" />
            
            {/* CIUDAD Dropdown */}
            <Popover open={isCityOpen} onOpenChange={setIsCityOpen}>
                <PopoverTrigger asChild>
                    <div className="px-6 py-2 h-full flex items-center gap-6 cursor-pointer hover:bg-gray-50 min-w-[140px] uppercase transition-colors">
                        <span className={selectedCity ? "text-black font-semibold" : "text-gray-400"}>
                            {selectedCity ? (selectedCity.length > 15 ? selectedCity.substring(0, 15) + '...' : selectedCity) : "CIUDAD"}
                        </span>
                        <ChevronDown className="h-3 w-3 ml-auto text-gray-400 shrink-0" />
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0 rounded-none shadow-xl border border-gray-200 font-sans" align="start" sideOffset={8}>
                    <div className="flex items-center border-b border-gray-100 px-3 py-3 relative">
                        <Search className="h-3 w-3 text-gray-400 absolute left-4" />
                        <input 
                            type="text" 
                            className="w-full outline-none text-[11px] font-sans pl-6 placeholder:text-gray-300" 
                            placeholder="" 
                            value={citySearch}
                            onChange={(e) => setCitySearch(e.target.value)}
                        />
                    </div>
                    <div className="max-h-[350px] overflow-y-auto px-4 py-5 scrollbar-thin">
                        {selectedState ? (
                            <>
                                <div className="text-[9px] text-gray-400 mb-3 tracking-widest uppercase">DESTACADOS</div>
                                <div className="space-y-3">
                                    {filteredCities.map(c => (
                                        <div 
                                            key={c} 
                                            className="text-[12px] text-gray-700 hover:text-black hover:font-medium cursor-pointer transition-colors"
                                            onClick={() => { setSelectedCity(c); setIsCityOpen(false); }}
                                        >
                                            {c}
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="text-[11px] text-gray-400 py-4 text-center">
                                Primero selecciona un estado.
                            </div>
                        )}
                    </div>
                </PopoverContent>
            </Popover>

            <div className="h-full w-[1px] bg-gray-200" />

            {/* ACEPTAR Button */}
            <div 
                className={cn(
                  "bg-black text-white h-full px-8 flex items-center justify-center font-medium uppercase transition-colors",
                  selectedState && selectedCity ? "cursor-pointer hover:bg-gray-800" : "opacity-50 cursor-not-allowed"
                )}
                onClick={handleAccept}
            >
                ACEPTAR
            </div>
        </div>
    );
}
