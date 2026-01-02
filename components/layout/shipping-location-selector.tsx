"use client";

import { useShippingLocation } from "@/contexts/shipping-location-context";
import { useTranslations } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";

export function ShippingLocationSelector() {
  const { location, setIsLocationModalOpen } = useShippingLocation();
  const t = useTranslations('Common');

  return (
    <button
      className="flex items-center gap-2 text-black hover:text-gray-600 transition-colors"
      onClick={() => setIsLocationModalOpen(true)}
    >
      <span className="text-[10px] tracking-widest font-bold uppercase">ENVIAR A</span>
      <span className="text-[10px]">→</span>
      <span className="text-[10px] tracking-widest font-bold uppercase">{location.city}, {location.state}</span>
    </button>
  );
}