"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowDown, Check, Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";


interface FilterOption {
  id: string;
  name: string;
  count: number;
}

interface FilterSidebarProps {
  categories?: FilterOption[];
  vendors?: FilterOption[];
  priceRange?: {
    min: number;
    max: number;
  };
}

export function FilterSidebar({
  categories = [],
  vendors = [],
  priceRange = { min: 0, max: 10000 }
}: FilterSidebarProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const t = useTranslations("Products");

  // Parse current filters from URL
  const currentCategories = searchParams.get("categories")?.split(",").filter(Boolean) || [];
  const currentVendors = searchParams.get("vendors")?.split(",").filter(Boolean) || [];
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentRating = searchParams.get("minRating") || "";
  const currentAvailability = searchParams.get("availability") || "";
  const currentSort = searchParams.get('sort') || 'featured';

  // Local state
  const [minPrice, setMinPrice] = useState(currentMinPrice);
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice);

  // Collapsible states
  const [openSections, setOpenSections] = useState({
    categories: true,
    filters: false, // Grouped filters (Vendors, Price, etc)
    sort: true,
  });

  // Show More states
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllVendors, setShowAllVendors] = useState(false);

  // Constants
  const INITIAL_ITEMS_TO_SHOW = 6;

  // Update logic
  const updateFilters = (updates: Record<string, string | string[]>) => {
    const params = new URLSearchParams(searchParams.toString()); // Start with existing params
    Object.entries(updates).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.length > 0 ? params.set(key, value.join(",")) : params.delete(key);
      } else if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}` as any);
  };

  const toggleCategory = (categoryId: string) => {
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter(id => id !== categoryId)
      : [...currentCategories, categoryId];
    updateFilters({ categories: newCategories });
  };

  const toggleVendor = (vendorId: string) => {
    const newVendors = currentVendors.includes(vendorId)
      ? currentVendors.filter(id => id !== vendorId)
      : [...currentVendors, vendorId];
    updateFilters({ vendors: newVendors });
  };

  const applyPriceFilter = () => {
    updateFilters({ minPrice: minPrice, maxPrice: maxPrice });
  };

  const clearAllFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    router.push(pathname as any);
  };

  const handleSortChange = (value: string) => {
    if (value === 'featured') {
      updateFilters({ sort: '' }); // remove sort param for default
    } else {
      updateFilters({ sort: value });
    }
  };

  // --- Render Helpers ---

  // 1. Categories List
  const renderCategoryList = () => {
    const visibleItems = showAllCategories ? categories : categories.slice(0, INITIAL_ITEMS_TO_SHOW);
    const hasHiddenItems = categories.length > INITIAL_ITEMS_TO_SHOW;

    return (
      <div className="space-y-3 pl-1">
        {visibleItems.map((category) => {
          const isSelected = currentCategories.includes(category.id);
          return (
            <div
              key={category.id}
              onClick={() => toggleCategory(category.id)}
              className={cn(
                "cursor-pointer text-base transition-colors hover:text-black flex items-center justify-between group",
                isSelected ? "font-medium text-black" : "text-gray-600 font-light"
              )}
            >
              <span>{category.name}</span>
            </div>
          );
        })}
        {hasHiddenItems && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllCategories(!showAllCategories)}
            className="h-auto px-0 text-gray-400 hover:text-black text-sm font-light mt-2"
          >
            {showAllCategories ? "Show less" : `Show ${categories.length - INITIAL_ITEMS_TO_SHOW} more`}
          </Button>
        )}
      </div>
    );
  };

  // 2. Vendors List
  const renderVendorList = () => {
    const visibleItems = showAllVendors ? vendors : vendors.slice(0, INITIAL_ITEMS_TO_SHOW);
    const hasHiddenItems = vendors.length > INITIAL_ITEMS_TO_SHOW;

    return (
      <div className="space-y-3 pt-2">
        {visibleItems.map((vendor) => (
          <div key={vendor.id} className="flex items-center space-x-3 group">
            <Checkbox
              id={`vendor-${vendor.id}`}
              checked={currentVendors.includes(vendor.id)}
              onCheckedChange={() => toggleVendor(vendor.id)}
              className="border-gray-300 data-[state=checked]:bg-black data-[state=checked]:border-black"
            />
            <Label
              htmlFor={`vendor-${vendor.id}`}
              className="flex-1 text-sm text-gray-600 group-hover:text-black cursor-pointer flex items-center justify-between font-light"
            >
              <span>{vendor.name}</span>
              <span className="text-xs text-gray-400">({vendor.count})</span>
            </Label>
          </div>
        ))}
        {hasHiddenItems && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllVendors(!showAllVendors)}
            className="h-auto px-0 text-gray-400 hover:text-black text-sm font-light mt-2 flex items-center gap-1"
          >
            {showAllVendors ? (
              <>
                <Minus className="h-3 w-3" /> Show less
              </>
            ) : (
              <>
                <Plus className="h-3 w-3" /> Show {vendors.length - INITIAL_ITEMS_TO_SHOW} more
              </>
            )}
          </Button>
        )}
      </div>
    );
  };

  const SectionHeader = ({ title, isOpen, onClose }: { title: string; isOpen: boolean; onClose?: () => void }) => (
    <div className="flex items-center justify-between w-full py-4 group cursor-pointer">
      <span className="text-base text-gray-900 font-normal">{title}</span>
      {onClose ? (
        <X className="h-4 w-4 text-gray-900" onClick={(e) => { e.stopPropagation(); onClose(); }} />
      ) : (
        <ArrowDown
          className={cn(
            "h-4 w-4 text-gray-900 transition-transform duration-200",
            isOpen ? "transform rotate-180" : ""
          )}
        />
      )}
    </div>
  );

  return (
    <div className="w-full border border-gray-200 bg-white">
      {/* Handpicked Header */}
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-2xl font-normal font-univers text-gray-900">Handpicked</h2>
        <div className="relative w-8 h-8">
          <Image
            src="/images/logos/signature-decoration.png"
            alt="Handpicked"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* 1. Categories Section */}
      <Collapsible
        open={openSections.categories}
        onOpenChange={(open) => setOpenSections(prev => ({ ...prev, categories: open }))}
        className="px-6 border-b border-gray-200"
      >
        <CollapsibleTrigger className="w-full">
          {/* Using a custom header that looks like the design - title + close X if open? Spec implies X but lets use standard collapse for now unless X is strictly reset */}
          <div className="flex items-center justify-between w-full py-4 group cursor-pointer">
            <span className="text-base text-gray-900 font-normal">{t("categories")}</span>
            {openSections.categories ? (
              <X className="h-4 w-4 text-gray-900" onClick={(e) => {
                // If the design intends X to collapse, we do this.
                // If X is meant to "clear selection", that's different.
                // The image shows an X, which usually implies "Collapse" in this context vs chevron.
                e.stopPropagation();
                setOpenSections(prev => ({ ...prev, categories: false }));
              }} />
            ) : (
              <ArrowDown className="h-4 w-4 text-gray-900" />
            )}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pb-6">
          {renderCategoryList()}
        </CollapsibleContent>
      </Collapsible>

      {/* 2. Filtros Section (Grouped) */}
      <Collapsible
        open={openSections.filters}
        onOpenChange={(open) => setOpenSections(prev => ({ ...prev, filters: open }))}
        className="px-6 border-b border-gray-200"
      >
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between w-full py-4 group cursor-pointer">
            <span className="text-base text-gray-900 font-normal">{t("filters")}</span>
            {openSections.filters ? (
              <X className="h-4 w-4 text-gray-900" onClick={(e) => {
                e.stopPropagation();
                setOpenSections(prev => ({ ...prev, filters: false }));
              }} />
            ) : (
              <ArrowDown className="h-4 w-4 text-gray-900" />
            )}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pb-6 space-y-6">
          {/* Vendors */}
          <div>
            <h3 className="font-univers text-sm font-medium mb-3">{t("vendors")}</h3>
            {renderVendorList()}
          </div>

          {/* Price */}
          <div>
            <h3 className="font-univers text-sm font-medium mb-3">{t("priceRange")}</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-xs text-gray-400">$</span>
                  <Input
                    type="number"
                    placeholder={`${priceRange.min}`}
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="pl-6 h-9 rounded-sm border-gray-300 text-sm"
                  />
                </div>
                <span className="text-gray-400">-</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-xs text-gray-400">$</span>
                  <Input
                    type="number"
                    placeholder={`${priceRange.max}`}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="pl-6 h-9 rounded-sm border-gray-300 text-sm"
                  />
                </div>
              </div>
              <Button
                onClick={applyPriceFilter}
                size="sm"
                className="w-full bg-black text-white hover:bg-gray-800 h-8 text-xs uppercase tracking-wide"
              >
                {t("applyFilters")}
              </Button>
            </div>
          </div>

          {/* Stock */}
          <div>
            <h3 className="font-univers text-sm font-medium mb-3">{t("availability")}</h3>
            <RadioGroup
              value={currentAvailability}
              onValueChange={(value) => updateFilters({ availability: value })}
              className="space-y-2"
            >
              {['in-stock', 'out-of-stock'].map((val) => (
                <div key={val} className="flex items-center space-x-2">
                  <RadioGroupItem value={val} id={val} className="border-gray-300 w-4 h-4" />
                  <Label htmlFor={val} className="font-light text-sm capitalize text-gray-600">{val.replace(/-/g, ' ')}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* 3. Sort Order Section */}
      <Collapsible
        open={openSections.sort}
        onOpenChange={(open) => setOpenSections(prev => ({ ...prev, sort: open }))}
        className="px-6"
      >
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between w-full py-4 group cursor-pointer">
            <span className="text-base text-gray-900 font-normal">{t("sortBy")}</span>
            {openSections.sort ? (
              <X className="h-4 w-4 text-gray-900" onClick={(e) => {
                e.stopPropagation();
                setOpenSections(prev => ({ ...prev, sort: false }));
              }} />
            ) : (
              <ArrowDown className="h-4 w-4 text-gray-900" />
            )}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pb-8">
          <div className="space-y-2">
            {[
              { value: 'featured', label: t('ourSelection') },
              { value: 'newest', label: t('newest') },
              { value: 'price-asc', label: t('priceLowToHigh') },
              { value: 'price-desc', label: t('priceHighToLow') },
            ].map((option) => (
              <div
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={cn(
                  "cursor-pointer text-base py-1 transition-colors hover:text-black",
                  currentSort === option.value ? "font-medium text-black" : "text-gray-600 font-light"
                )}
              >
                {option.label}
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

    </div>
  );
}