"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { useWishlist } from "@/contexts/wishlist-context";
import { useCurrency } from "@/contexts/currency-context";
import { toast } from "sonner";
import { useTranslations } from 'next-intl';
import { useSession } from "next-auth/react";
import { useRouter } from "@/i18n/navigation";
// Removed useLocale in favor of i18n-aware router

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: string;
    images: string[];
    vendor?: {
      id: string;
      businessName: string;
      state?: string | null;
    } | null;
  };
  className?: string;
  onQuickView?: (product: any) => void;
}

export function ProductCard({ product, className, onQuickView }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const isWishlisted = isInWishlist(product.id);
  const t = useTranslations('Products');

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is authenticated
    if (!session?.user) {
      router.push('/login');
      return;
    }

    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.success(t('removedFromWishlist'));
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: product.images[0] || "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8Z2lmdCUyMGJveHxlbnwwfHx8fDE3NjcwNTM2ODV8MA&ixlib=rb-4.1.0&q=85",
        vendorId: product.vendor?.id || "",
        vendorName: product.vendor?.businessName || t('vendor'),
      });
      toast.success(t('addedToWishlist'));
    }
  };

  return (
    <Link
      href={{ pathname: '/products/[slug]', params: { slug: product.slug } }}
      className={cn("group flex flex-col border border-gray-300 bg-white", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid="product-card"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50 border-b border-gray-300">
        <Image
          src={product.images[0] || "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=800&q=80"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=800&q=80";
          }}
        />

        {/* Overlay on hover */}
        <div className={cn(
          "absolute inset-0 bg-black/0 transition-all duration-300",
          isHovered && "bg-black/10"
        )} />

        {/* Quick actions on hover */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 p-3 transition-all duration-300 pointer-events-none",
          "opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0"
        )}>
          <div className="flex gap-2 pointer-events-auto">
            {onQuickView && (
              <Button
                variant="secondary"
                size="sm"
                className="flex-1 bg-white/95 hover:bg-white backdrop-blur-sm"
                onClick={(e) => {
                  e.preventDefault();
                  onQuickView(product);
                }}
                aria-label={t('quickView')}
                data-testid={`quick-view-${product.slug}`}
              >
                <Eye className="h-4 w-4 mr-1" />
                <span>{t('quickView')}</span>
              </Button>
            )}
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                image: product.images[0] || "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8Z2lmdCUyMGJveHxlbnwwfHx8fDE3NjcwNTM2ODV8MA&ixlib=rb-4.1.0&q=85",
                vendorId: product.vendor?.id || "",
                vendorName: product.vendor?.businessName || t('vendor'),
                vendorState: product.vendor?.state,
              }}
              className={cn(
                "h-10 text-sm",
                onQuickView ? "flex-1" : "w-full"
              )}
              showIcon={false}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col p-4 flex-grow justify-between text-gray-600">
        <div>
          <h3 className="font-univers text-[13px] text-gray-800" data-testid="product-name">
            {product.name}
          </h3>
          {product.vendor?.businessName && (
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-[2px] mb-2" data-testid="vendor-name">
              &rarr; {product.vendor.businessName}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-1">
          <p className="font-univers text-[13px] text-gray-800" data-testid="product-price">
            {formatPrice(parseFloat(product.price))}
          </p>

          <button
            onClick={handleWishlistToggle}
            aria-label={isWishlisted ? t('removeFromWishlist') : t('addToWishlist')}
            data-testid={`wishlist-button-${product.slug}`}
            className="text-gray-500 hover:text-red-500 transition-colors z-10"
          >
            <Heart
              strokeWidth={1.5}
              className={cn(
                "h-[18px] w-[18px] transition-colors",
                isWishlisted ? "fill-red-500 text-red-500" : "text-current"
              )}
            />
          </button>
        </div>
      </div>
    </Link>
  );
}