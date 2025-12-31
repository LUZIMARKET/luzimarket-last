"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname, useParams } from '@/i18n/navigation';
import { useCurrency } from "@/contexts/currency-context";

export function LocaleCurrencyToggle() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const { setCurrency } = useCurrency();

    const params = useParams();

    const switchTo = (newLocale: 'es' | 'en') => {
        if (locale === newLocale) return;
        const newCurrency = newLocale === 'es' ? 'MXN' : 'USD';
        setCurrency(newCurrency);
        // @ts-ignore - params is required for dynamic routes but optional for static ones
        router.replace({ pathname, params }, { locale: newLocale });
    };

    return (
        <div className="flex items-center gap-2 text-xs font-univers uppercase bg-transparent">
            <button
                onClick={() => switchTo('es')}
                className={`transition-colors hover:text-gray-600 ${locale === 'es' ? 'text-gray-900 font-medium' : 'text-gray-400'}`}
                aria-label="Switch to Spanish and MXN"
            >
                ESP — MXN
            </button>
            <span className="text-gray-300">/</span>
            <button
                onClick={() => switchTo('en')}
                className={`transition-colors hover:text-gray-600 ${locale === 'en' ? 'text-gray-900 font-medium' : 'text-gray-400'}`}
                aria-label="Switch to English and USD"
            >
                ENG — USD
            </button>
        </div>
    );
}
