"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowDown, Check, Minus, Plus } from "lucide-react";
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
  const t = useTranslations("Products");

  // Parse current filters from URL
  const currentCategories = searchParams.get("categories")?.split(",").filter(Boolean) || [];
  const currentVendors = searchParams.get("vendors")?.split(",").filter(Boolean) || [];
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentRating = searchParams.get("minRating") || "";
  const currentAvailability = searchParams.get("availability") || "";

  // Local state
  const [minPrice, setMinPrice] = useState(currentMinPrice);
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice);

  // Collapsible states
  const [openSections, setOpenSections] = useState({
    categories: true,
    vendors: false,
    price: false,
    rating: false,
    availability: false,
  });

  // Show More states
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllVendors, setShowAllVendors] = useState(false);

  // Constants
  const INITIAL_ITEMS_TO_SHOW = 6;

  // Update logic
  const updateFilters = (updates: Record<string, string | string[]>) => {
    const params = new URLSearchParams(searchParams);
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
    router.push(`?${params.toString()}` as any);
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
    router.push("/products");
  };

  // --- Render Helpers ---

  // 1. Categories List (Clean Text Style, no visible checkbox box used, just selective bolding/check)
  // mimicking the "Classic, Modern" simple list from image
  const renderCategoryList = () => {
    const visibleItems = showAllCategories ? categories : categories.slice(0, INITIAL_ITEMS_TO_SHOW);
    const hasHiddenItems = categories.length > INITIAL_ITEMS_TO_SHOW;

    return (
      <div className="space-y-2 pl-4">
        {visibleItems.map((category) => {
          const isSelected = currentCategories.includes(category.id);
          return (
            <div
              key={category.id}
              onClick={() => toggleCategory(category.id)}
              className={cn(
                "cursor-pointer text-base transition-colors hover:text-black flex items-center gap-2",
                isSelected ? "font-medium text-black" : "text-gray-500 font-light"
              )}
            >
              <span>{category.name}</span>
              {/* Optional: subtle checkmark if selected, since we removed the box */}
              {isSelected && <Check className="h-3 w-3" />}
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

  // 2. Vendors List (Minimalist Checkboxes)
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

  // 3. Shared Header for Non-Pill sections
  const MinimalHeader = ({ title, isOpen }: { title: string; isOpen: boolean }) => (
    <div className="flex items-center justify-between w-full py-4 border-b border-gray-100 group">
      <span className="text-base text-gray-800 font-normal group-hover:text-black">{title}</span>
      <ArrowDown
        className={cn(
          "h-4 w-4 text-gray-800 transition-transform duration-200",
          isOpen ? "transform rotate-180" : ""
        )}
      />
    </div>
  );

  return (
    <div className="w-full pr-6">
      {/* 1. Categories - PILL STYLE */}
      <Collapsible
        open={openSections.categories}
        onOpenChange={(open) => setOpenSections(prev => ({ ...prev, categories: open }))}
        className="mb-8"
      >
        <CollapsibleTrigger className="w-full">
          {/* The "Pill" Trigger */}
          <div className="
            w-full bg-white rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-gray-100 
            px-6 py-4 flex justify-between items-center 
            hover:shadow-md transition-shadow duration-200
          ">
            <span className="text-lg font-medium text-gray-900">{t("categories")}</span>
            <ArrowDown className={cn(
              "h-5 w-5 text-gray-900 transition-transform duration-200",
              openSections.categories ? "transform rotate-180" : ""
            )} />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-6 px-2">
          {renderCategoryList()}
        </CollapsibleContent>
      </Collapsible>


      {/* 2. Vendors - Minimal Border Bottom */}
      <Collapsible
        open={openSections.vendors}
        onOpenChange={(open) => setOpenSections(prev => ({ ...prev, vendors: open }))}
      >
        <CollapsibleTrigger className="w-full">
          <MinimalHeader title={t("vendors")} isOpen={openSections.vendors} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pb-4">
          {renderVendorList()}
        </CollapsibleContent>
      </Collapsible>

      {/* 3. Price - Minimal Border Bottom */}
      <Collapsible
        open={openSections.price}
        onOpenChange={(open) => setOpenSections(prev => ({ ...prev, price: open }))}
      >
        <CollapsibleTrigger className="w-full">
          <MinimalHeader title={t("priceRange")} isOpen={openSections.price} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pb-4 pt-4">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-sm text-gray-400">$</span>
                <Input
                  type="number"
                  placeholder={`${priceRange.min}`}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="pl-7 h-10 rounded-full border-gray-200 bg-gray-50 text-sm focus:bg-white transition-colors"
                />
              </div>
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-sm text-gray-400">$</span>
                <Input
                  type="number"
                  placeholder={`${priceRange.max}`}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="pl-7 h-10 rounded-full border-gray-200 bg-gray-50 text-sm focus:bg-white transition-colors"
                />
              </div>
            </div>
            <Button
              onClick={applyPriceFilter}
              className="w-full rounded-full h-10 bg-black text-white hover:bg-gray-800 text-sm font-medium"
            >
              {t("applyFilters")}
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* 4. Rating */}
      <Collapsible
        open={openSections.rating}
        onOpenChange={(open) => setOpenSections(prev => ({ ...prev, rating: open }))}
      >
        <CollapsibleTrigger className="w-full">
          <MinimalHeader title={t("minRating")} isOpen={openSections.rating} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pb-4 pt-2">
          {/* Minimal Rating Content */}
          <RadioGroup
            value={currentRating}
            onValueChange={(value) => updateFilters({ minRating: value })}
            className="space-y-2"
          >
            {[4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors -ml-2">
                <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} className="hidden" />
                {/* Hidden radio, making the whole row clickable essentially if I wrapped in label, but here just keeping simple layout */}
                <Label
                  htmlFor={`rating-${rating}`}
                  className="flex items-center gap-2 cursor-pointer w-full font-light text-sm"
                >
                  <span className="w-4 text-center">{rating}+</span>
                  <div className="flex text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-200"}>★</span>
                    ))}
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CollapsibleContent>
      </Collapsible>

      {/* 5. Availability */}
      <Collapsible
        open={openSections.availability}
        onOpenChange={(open) => setOpenSections(prev => ({ ...prev, availability: open }))}
      >
        <CollapsibleTrigger className="w-full">
          <MinimalHeader title={t("availability")} isOpen={openSections.availability} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pb-4 pt-2">
          <RadioGroup
            value={currentAvailability}
            onValueChange={(value) => updateFilters({ availability: value })}
            className="space-y-2"
          >
            {['in-stock', 'out-of-stock'].map((val) => (
              <div key={val} className="flex items-center space-x-2">
                <RadioGroupItem value={val} id={val} className="border-gray-300" />
                <Label htmlFor={val} className="font-light text-sm capitalize">{val.replace(/-/g, ' ')}</Label>
              </div>
            ))}
          </RadioGroup>
        </CollapsibleContent>
      </Collapsible>

    </div>
  );
}