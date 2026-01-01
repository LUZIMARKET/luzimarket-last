"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useParams } from 'next/navigation';
import { useCurrency } from "@/contexts/currency-context";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export function LocaleCurrencyToggle() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const { currency, setCurrency } = useCurrency(); // Ensure currency is destructured if available, otherwise just use logic

    const params = useParams();

    const switchTo = (newLocale: 'es' | 'en') => {
        if (locale === newLocale) return;
        // Optionally switch currency implies logic matches, but user might want separate control. 
        // Keeping separate for now unless requested otherwise.
        // @ts-ignore
        router.replace({ pathname, params: params as any }, { locale: newLocale });
    };

    return (
        <div className="flex items-center gap-2 font-univers uppercase">
            {/* Language Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        className="flex items-center border border-gray-300 rounded-full px-3 py-0.5 text-[10px] hover:border-gray-500 transition-colors focus:outline-none"
                        aria-label="Select Language"
                    >
                        {locale === 'es' ? 'ESP' : 'ENG'}
                        <ChevronDown className="ml-1 h-2.5 w-2.5 opacity-50" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[4rem]">
                    <DropdownMenuItem onClick={() => switchTo('es')} className="text-xs">Español</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => switchTo('en')} className="text-xs">English</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Currency Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        className="flex items-center border border-gray-300 rounded-full px-3 py-0.5 text-[10px] hover:border-gray-500 transition-colors focus:outline-none"
                        aria-label="Select Currency"
                    >
                        {currency || (locale === 'es' ? 'MXN' : 'USD')}
                        <ChevronDown className="ml-1 h-2.5 w-2.5 opacity-50" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[4rem]">
                    <DropdownMenuItem onClick={() => setCurrency('MXN')} className="text-xs">MXN</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCurrency('USD')} className="text-xs">USD</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
