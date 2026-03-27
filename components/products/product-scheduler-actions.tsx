"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AddToCartWithQuantityWrapper } from "@/components/cart/add-to-cart-with-quantity-wrapper";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import { Heart } from "lucide-react";

interface ProductSchedulerActionsProps {
  product: any;
  images: string[];
}

export function ProductSchedulerActions({ product, images }: ProductSchedulerActionsProps) {
  const [activeTab, setActiveTab] = useState<'hoy' | 'manana' | 'otra'>('hoy');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('8:00am — 12:00pm');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const today = new Date();
  const tomorrow = addDays(today, 1);

  const handleTabClick = (tab: 'hoy' | 'manana' | 'otra') => {
    setActiveTab(tab);
    if (tab === 'hoy') setSelectedDate(today);
    if (tab === 'manana') setSelectedDate(tomorrow);
    if (tab === 'otra') setIsCalendarOpen(true);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setIsCalendarOpen(false);
      setActiveTab('otra');
    }
  };

  const productWithSchedule = {
    ...product,
    deliveryDate: format(selectedDate, 'yyyy-MM-dd'),
    deliveryTimeSlot: selectedTime
  };

  return (
    <div className="border border-gray-300 bg-white flex flex-col shadow-sm">
      <div className="p-4 border-b border-gray-300 text-[11px] font-sans text-gray-700 tracking-wide">
        Selecciona un Horario
      </div>
      
      <div className="grid grid-cols-3 border-b border-gray-300 divide-x divide-gray-300 text-center font-sans">
        <div 
          onClick={() => handleTabClick('hoy')}
          className={cn(
            "flex flex-col items-center justify-center py-4 text-[9px] relative cursor-pointer transition-colors",
            activeTab === 'hoy' ? "bg-gray-200" : "hover:bg-gray-50 bg-white"
          )}
        >
          {activeTab === 'hoy' && <div className="absolute inset-x-0 top-0 h-[2px] bg-black"></div>}
          <span className="font-bold text-gray-900 mb-0.5 tracking-wider">HOY</span>
          <span className={cn("tracking-widest text-[7px]", activeTab === 'hoy' ? "text-gray-500" : "text-gray-400")}>
            {format(today, "d MMMM", { locale: es }).toUpperCase()}
          </span>
        </div>
        
        <div 
          onClick={() => handleTabClick('manana')}
          className={cn(
            "flex flex-col items-center justify-center py-4 text-[9px] relative cursor-pointer transition-colors",
            activeTab === 'manana' ? "bg-gray-200" : "hover:bg-gray-50 bg-white"
          )}
        >
          {activeTab === 'manana' && <div className="absolute inset-x-0 top-0 h-[2px] bg-black"></div>}
          <span className="font-bold text-gray-900 mb-0.5 tracking-wider">MAÑANA</span>
          <span className={cn("tracking-widest text-[7px]", activeTab === 'manana' ? "text-gray-500" : "text-gray-400")}>
            {format(tomorrow, "d MMMM", { locale: es }).toUpperCase()}
          </span>
        </div>

        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <div 
              onClick={() => handleTabClick('otra')}
              className={cn(
                "flex flex-col items-center justify-center py-4 text-[9px] relative cursor-pointer transition-colors outline-none",
                activeTab === 'otra' ? "bg-gray-200" : "hover:bg-gray-50 bg-white"
              )}
            >
              {activeTab === 'otra' && <div className="absolute inset-x-0 top-0 h-[2px] bg-black"></div>}
              <span className="font-bold text-gray-900 tracking-wider mb-0.5">OTRA</span>
              {activeTab === 'otra' ? (
                <span className="tracking-widest text-[7px] text-gray-500">
                  {format(selectedDate, "d MMM", { locale: es }).toUpperCase()}
                </span>
              ) : (
                <span className="font-bold text-gray-900 tracking-wider">FECHA</span>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 z-50 bg-white" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="px-5 pt-3 pb-2 flex flex-col border-b border-gray-300">
        <div 
          onClick={() => setSelectedTime('8:00am — 12:00pm')}
          className={cn(
            "flex items-center justify-between py-3 border-b border-gray-200 text-[11px] font-sans cursor-pointer transition-colors",
            selectedTime === '8:00am — 12:00pm' ? "text-gray-800" : "text-gray-400 hover:text-gray-600"
          )}
        >
          <span>8:00am — 12:00pm</span>
          <div className={cn(
            "h-[14px] w-[14px] rounded-full flex items-center justify-center transition-colors duration-200",
            selectedTime === '8:00am — 12:00pm' ? "bg-green-500 text-white" : "border border-gray-300"
          )}>
            {selectedTime === '8:00am — 12:00pm' && (
              <svg className="h-[10px] w-[10px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
        
        <div 
          onClick={() => setSelectedTime('4:00pm — 8:00pm')}
          className={cn(
            "flex items-center justify-between py-3 text-[11px] font-sans cursor-pointer transition-colors",
            selectedTime === '4:00pm — 8:00pm' ? "text-gray-800" : "text-gray-400 hover:text-gray-600"
          )}
        >
          <span>4:00pm — 8:00pm</span>
          <div className={cn(
            "h-[14px] w-[14px] rounded-full flex items-center justify-center transition-colors duration-200",
            selectedTime === '4:00pm — 8:00pm' ? "bg-green-500 text-white" : "border border-gray-300"
          )}>
             {selectedTime === '4:00pm — 8:00pm' && (
              <svg className="h-[10px] w-[10px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
      </div>

      <div className="flex h-[52px]">
        <div className="flex-1 bg-black flex items-center justify-center cursor-pointer hover:bg-gray-900 transition-colors">
          <span className="text-white font-sans text-[11px] tracking-wide relative z-10 w-full h-full flex items-center justify-center">
            <div className="absolute opacity-0">
              <AddToCartWithQuantityWrapper
                product={{
                  id: productWithSchedule.id,
                  name: productWithSchedule.name,
                  price: Number(productWithSchedule.price),
                  image: images[0] || '',
                  vendorId: productWithSchedule.vendorId,
                  vendorName: productWithSchedule.vendor?.businessName || '',
                  stock: productWithSchedule.stock || 0,
                  deliveryDate: productWithSchedule.deliveryDate,
                  deliveryTimeSlot: productWithSchedule.deliveryTimeSlot
                }}
              />
            </div>
            Agregar a la bolsa
          </span>
        </div>
        <div className="w-[52px] shrink-0 bg-white flex items-center justify-center border-l border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors">
          <WishlistButton
            product={{
              id: product.id,
              name: product.name,
              price: Number(product.price),
              image: images[0] || '',
              vendor: product.vendor?.businessName || '',
            }}
          />
        </div>
      </div>
    </div>
  );
}
