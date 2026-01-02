"use client";

import * as React from "react";
import { Clock, Plus, Trash2, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface BusinessHoursEditorProps {
    defaultValue?: string;
    name?: string;
}

const DAYS = [
    { key: "Mon", label: "L", short: "Lun" },
    { key: "Tue", label: "M", short: "Mar" },
    { key: "Wed", label: "M", short: "Mié" },
    { key: "Thu", label: "J", short: "Jue" },
    { key: "Fri", label: "V", short: "Vie" },
    { key: "Sat", label: "S", short: "Sáb" },
    { key: "Sun", label: "D", short: "Dom" },
];

const HOURS = Array.from({ length: 24 }).flatMap((_, i) => [
    { value: `${i.toString().padStart(2, '0')}:00`, label: `${i.toString().padStart(2, '0')}:00` },
    { value: `${i.toString().padStart(2, '0')}:30`, label: `${i.toString().padStart(2, '0')}:30` },
]);

// Helper to map Spanish day names back to Keys for parsing
const SPANISH_TO_KEY: Record<string, string> = {
    "Lun": "Mon", "Mar": "Tue", "Mié": "Wed", "Jue": "Thu", "Vie": "Fri", "Sáb": "Sat", "Dom": "Sun",
    "Diario": "All"
};

type ScheduleSlot = {
    id: string;
    days: string[];
    start: string;
    end: string;
};

export function BusinessHoursEditor({ defaultValue = "", name = "businessHours" }: BusinessHoursEditorProps) {
    const [value, setValue] = React.useState(defaultValue);
    const [isOpen, setIsOpen] = React.useState(false);

    const [slots, setSlots] = React.useState<ScheduleSlot[]>([
        { id: "1", days: ["Mon", "Tue", "Wed", "Thu", "Fri"], start: "09:00", end: "18:00" }
    ]);

    // Parse initial value on mount (simple heuristic)
    React.useEffect(() => {
        if (!defaultValue) return;

        // Try to parse string like "Lun-Vie: 09:00 - 18:00, Sáb: 10:00 - 14:00"
        try {
            const parts = defaultValue.split(",").map(p => p.trim());
            const parsedSlots: ScheduleSlot[] = [];

            parts.forEach((part, index) => {
                const [dayPart, timePart] = part.split(":").map(s => s.trim());
                if (!dayPart || !timePart) return;

                const [start, end] = timePart.split("-").map(t => t.trim());

                let days: string[] = [];
                if (dayPart === "Diario") {
                    days = DAYS.map(d => d.key);
                } else if (dayPart.includes("-")) {
                    // Range handling (e.g. Lun-Vie)
                    const [startDay, endDay] = dayPart.split("-").map(d => d.trim());
                    const startIdx = DAYS.findIndex(d => d.short === startDay);
                    const endIdx = DAYS.findIndex(d => d.short === endDay);
                    if (startIdx !== -1 && endIdx !== -1) {
                        for (let i = startIdx; i <= endIdx; i++) {
                            days.push(DAYS[i].key);
                        }
                    }
                } else {
                    // Single or comma separated (though we split by comma above, so nuanced)
                    days = [SPANISH_TO_KEY[dayPart] || ""];
                }

                parsedSlots.push({
                    id: Math.random().toString(),
                    days: days.filter(Boolean),
                    start: start || "09:00",
                    end: end || "18:00"
                });
            });

            if (parsedSlots.length > 0) {
                setSlots(parsedSlots);
            }
        } catch (e) {
            console.error("Failed to parse business hours", e);
        }
    }, []); // Only on mount, we don't want to overwrite edits if defaultValue prop changes weirdly

    const toggleDay = (slotId: string, dayKey: string) => {
        setSlots(prev => prev.map(slot => {
            if (slot.id !== slotId) return slot;
            const hasDay = slot.days.includes(dayKey);
            return {
                ...slot,
                days: hasDay ? slot.days.filter(d => d !== dayKey) : [...slot.days, dayKey]
            };
        }));
    };

    const updateTime = (slotId: string, field: 'start' | 'end', newValue: string) => {
        setSlots(prev => prev.map(slot => slot.id === slotId ? { ...slot, [field]: newValue } : slot));
    };

    const addSlot = () => {
        setSlots(prev => [
            ...prev,
            { id: Math.random().toString(), days: [], start: "09:00", end: "18:00" }
        ]);
    };

    const removeSlot = (id: string) => {
        setSlots(prev => prev.filter(s => s.id !== id));
    };

    const applyChanges = () => {
        const formattedParts = slots.map(slot => {
            if (slot.days.length === 0) return null;

            // Sort days
            const dayIndices = slot.days
                .map(d => DAYS.findIndex(day => day.key === d))
                .sort((a, b) => a - b);

            // Check for continuous range
            let isRange = true;
            for (let i = 0; i < dayIndices.length - 1; i++) {
                if (dayIndices[i + 1] !== dayIndices[i] + 1) {
                    isRange = false;
                    break;
                }
            }

            let dayLabel = "";
            if (slot.days.length === 7) {
                dayLabel = "Diario";
            } else if (isRange && slot.days.length > 2) {
                const start = DAYS[dayIndices[0]].short;
                const end = DAYS[dayIndices[dayIndices.length - 1]].short;
                dayLabel = `${start}-${end}`;
            } else {
                dayLabel = dayIndices.map(i => DAYS[i].short).join(", ");
            }

            return `${dayLabel}: ${slot.start}-${slot.end}`;
        }).filter(Boolean);

        const newValue = formattedParts.join(", ");
        setValue(newValue);
        setIsOpen(false);
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <div className="relative">
                <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                    name={name}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="pl-9 cursor-pointer"
                    placeholder="Lun-Vie: 9:00 - 18:00"

                />
                <PopoverTrigger asChild>
                    <div className="absolute inset-0 cursor-pointer bg-transparent" onClick={() => setIsOpen(true)} />
                </PopoverTrigger>
            </div>

            <PopoverContent className="w-[340px] p-4" align="start">
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                    {slots.map((slot, index) => (
                        <div key={slot.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                            <div className="flex items-center justify-between mb-2">
                                <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Horario {index + 1}
                                </Label>
                                {slots.length > 1 && (
                                    <button onClick={() => removeSlot(slot.id)} className="text-gray-400 hover:text-red-500">
                                        <X className="h-3 w-3" />
                                    </button>
                                )}
                            </div>

                            {/* Day Selector */}
                            <div className="flex justify-between gap-1 mb-3">
                                {DAYS.map((day) => {
                                    const isSelected = slot.days.includes(day.key);
                                    return (
                                        <button
                                            key={day.key}
                                            type="button"
                                            onClick={() => toggleDay(slot.id, day.key)}
                                            className={cn(
                                                "w-8 h-8 rounded-full text-xs font-medium transition-colors flex items-center justify-center border",
                                                isSelected
                                                    ? "bg-black text-white border-black"
                                                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                                            )}
                                        >
                                            {day.label}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Time Selector */}
                            <div className="grid grid-cols-2 gap-3">
                                <select
                                    className="w-full h-9 rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black"
                                    value={slot.start}
                                    onChange={(e) => updateTime(slot.id, 'start', e.target.value)}
                                >
                                    <option disabled>Apertura</option>
                                    {HOURS.map(h => (
                                        <option key={h.value} value={h.value}>{h.label}</option>
                                    ))}
                                </select>
                                <select
                                    className="w-full h-9 rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black"
                                    value={slot.end}
                                    onChange={(e) => updateTime(slot.id, 'end', e.target.value)}
                                >
                                    <option disabled>Cierre</option>
                                    {HOURS.map(h => (
                                        <option key={h.value} value={h.value}>{h.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}

                    <Button type="button" variant="outline" size="sm" onClick={addSlot} className="w-full text-xs border-dashed gap-2">
                        <Plus className="h-3 w-3" /> Agregar otro horario
                    </Button>

                    <Button type="button" onClick={applyChanges} className="w-full">
                        Aplicar Cambios
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
