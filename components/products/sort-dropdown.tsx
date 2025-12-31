'use client';

import { usePathname } from '@/i18n/navigation';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SortDropdown() {
  const t = useTranslations('Products');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'featured';

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'featured') {
      params.delete('sort');
    } else {
      params.set('sort', value);
    }
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.push(newUrl);
  };

  return (
    <div className="flex items-center gap-4 self-end" data-testid="sort-dropdown">
      <span className="text-sm font-univers text-gray-600 hidden sm:inline-block">Ordenar por</span>
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-auto min-w-[140px] border-none shadow-none focus:ring-0 px-0 h-auto font-medium text-gray-900 bg-transparent gap-1">
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end" className="w-[200px]">
          <SelectItem value="featured">{t('ourSelection')}</SelectItem>
          <SelectItem value="newest">{t('newest')}</SelectItem>
          <SelectItem value="price-asc">{t('priceLowToHigh')}</SelectItem>
          <SelectItem value="price-desc">{t('priceHighToLow')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}