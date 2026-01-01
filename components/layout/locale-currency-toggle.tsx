"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useParams } from 'next/navigation';
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
        router.replace({ pathname, params: params as any }, { locale: newLocale });
    };

    return (
        <div className="flex items-center gap-2 font-univers uppercase">
            {/* Language Pill */}
            <button
                onClick={() => switchTo(locale === 'es' ? 'en' : 'es')}
                className="border border-gray-300 rounded-full px-3 py-0.5 text-[10px] hover:border-gray-500 transition-colors"
                aria-label="Toggle Language"
            >
                {locale === 'es' ? 'ESP' : 'ENG'}
            </button>

            {/* Currency Pill */}
            <button
                onClick={() => setCurrency(locale === 'es' ? 'USD' : 'MXN')} // Simple toggle for now
                className="border border-gray-300 rounded-full px-3 py-0.5 text-[10px] hover:border-gray-500 transition-colors"
                aria-label="Toggle Currency"
            >
                {locale === 'es' ? 'MXN' : 'USD'}
            </button>
        </div>
    );
}
