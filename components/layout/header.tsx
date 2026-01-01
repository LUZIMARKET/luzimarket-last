"use client";

import { Link } from '@/i18n/navigation';
import NextLink from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, User, Menu, LogOut, Search } from "lucide-react";
import { SearchBox } from "./search-box";
import LanguageSwitcher from "./language-switcher";
import { ShippingLocationSelector } from "./shipping-location-selector";
import { CurrencySwitch } from "./currency-switch";
import { LocaleCurrencyToggle } from "./locale-currency-toggle";
import { useState } from "react";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { useTranslations } from 'next-intl';
import { useSession, signOut } from "next-auth/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toggleCart, getTotalItems } = useCart();
  const { getTotalItems: getWishlistItems } = useWishlist();
  const t = useTranslations('Common');
  const tNav = useTranslations('Navigation');
  const { data: session, status } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b" data-testid="header">
      {/* Skip navigation link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-black focus:text-white focus:p-2 focus:rounded-br-md"
      >
        Skip to main content
      </a>
      <div>
        {/* Top bar - Desktop only */}
        <div className="hidden md:flex items-center justify-between py-2 text-xs border-b px-8 bg-gray-50 text-gray-500 font-univers">
          <LocaleCurrencyToggle />
          <div className="flex items-center gap-4">
            <ShippingLocationSelector />
          </div>
        </div>

        {/* Main header */}
        <div className="relative flex items-center justify-between py-4 px-4 md:px-8 bg-white">

          {/* LEFT: Signature + Search */}
          <div className="hidden md:flex items-center gap-6 flex-1 justify-start">
            {/* Signature Logo */}
            <Image
              src="/images/logos/signature-decoration.png"
              alt="Luzimarket Signature"
              width={50}
              height={30}
              className="h-8 w-auto object-contain"
            />

            {/* Search Box - Compact Pill */}
            <div className="w-[300px]">
              <SearchBox idSuffix="-desktop" className="rounded-full border-gray-200" placeholder="Buscar" />
            </div>
          </div>


          {/* CENTER: Main Logo (Absolute center) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex-shrink-0">
            <Link href="/" data-testid="logo-link">
              <Image
                src="/images/logos/logo-full.png"
                alt="Luzimarket"
                width={180}
                height={64}
                className="h-10 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Mobile Menu Trigger (Left on Mobile) */}
          <div className="md:hidden flex items-center">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={t('openMenu')} data-testid="mobile-menu-button">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle>
                    <Image
                      src="/images/logos/logo-simple.png"
                      alt="Luzi"
                      width={80}
                      height={30}
                      className="h-6 w-auto"
                    />
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-8 space-y-4">
                  <div className="pb-4 border-b space-y-3">
                    <LanguageSwitcher />
                    <ShippingLocationSelector />
                  </div>
                  {/* ... mobile links ... */}
                  <Link href="/best-sellers" className="block py-2 text-sm font-univers" onClick={() => setIsMobileMenuOpen(false)}>{tNav('bestSellers')}</Link>
                  <Link href="/handpicked" className="block py-2 text-sm font-univers" onClick={() => setIsMobileMenuOpen(false)}>{tNav('handpicked')}</Link>
                  <Link href="/brands" className="block py-2 text-sm font-univers" onClick={() => setIsMobileMenuOpen(false)}>{tNav('brandsAndStores')}</Link>
                  <Link href="/categories" className="block py-2 text-sm font-univers" onClick={() => setIsMobileMenuOpen(false)}>{tNav('categories')}</Link>
                  <Link href="/occasions" className="block py-2 text-sm font-univers" onClick={() => setIsMobileMenuOpen(false)}>{tNav('occasions')}</Link>
                  <Link href="/editorial" className="block py-2 text-sm font-univers" onClick={() => setIsMobileMenuOpen(false)}>{tNav('editorial')}</Link>
                </nav>
              </SheetContent>
            </Sheet>

            {/* Mobile Search Trigger */}
            <Button variant="ghost" size="icon" aria-label={t('search')} onClick={() => { }}>
              <Search className="h-5 w-5" />
            </Button>
          </div>


          {/* RIGHT: Actions */}
          <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
            <Button variant="outline" size="sm" className="font-univers text-xs tracking-wider hidden md:inline-flex rounded-full border-gray-400 px-6">
              FAMILY
            </Button>

            <Link
              href="/wishlist"
              aria-label={getWishlistItems() > 0 ? t('wishlistWithItems', { count: getWishlistItems() }) : t('wishlist')}
            >
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:inline-flex relative"
              >
                <Heart className="h-5 w-5" />
                {getWishlistItems() > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {getWishlistItems()}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {status === "loading" ? (
              <Button variant="ghost" size="icon" disabled><User className="h-5 w-5" /></Button>
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" data-testid="user-menu"><User className="h-5 w-5" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{session.user?.name || t('user')}</p>
                    <p className="text-xs text-gray-500">{session.user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><NextLink href="/account">{t('myAccount')}</NextLink></DropdownMenuItem>
                  <DropdownMenuItem asChild><NextLink href="/orders">{t('myOrders')}</NextLink></DropdownMenuItem>
                  {session.user?.role !== 'customer' && (
                    <DropdownMenuItem asChild><NextLink href={session.user?.role === 'vendor' ? '/vendor/dashboard' : '/admin'}>{t('dashboard')}</NextLink></DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600"><LogOut className="mr-2 h-4 w-4" />{t('logout')}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon"><User className="h-5 w-5" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild><NextLink href="/login">{t('login')}</NextLink></DropdownMenuItem>
                  <DropdownMenuItem asChild><NextLink href="/register">{t('register')}</NextLink></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCart}
              className="relative"
              data-testid="cart-button"
            >
              <ShoppingBag className="h-5 w-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-black text-white text-xs rounded-full flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Search - Mobile */}
        <div className="md:hidden pb-3 px-4">
          <SearchBox idSuffix="-mobile" />
        </div>

        {/* Navigation - Desktop only */}
        <nav className="hidden md:flex items-center justify-center gap-8 py-3 px-8">
          <Link href="/best-sellers" className="text-xs font-univers hover:text-gray-600 tracking-wide">
            {tNav('bestSellers')}
          </Link>
          <Link href="/handpicked" className="text-xs font-univers hover:text-gray-600 tracking-wide">
            {tNav('handpicked')}
          </Link>
          <Link href="/brands" className="text-xs font-univers hover:text-gray-600 tracking-wide">
            {tNav('brandsAndStores')}
          </Link>
          <Link href="/categories" className="text-xs font-univers hover:text-gray-600 tracking-wide">
            {tNav('categories')}
          </Link>
          <Link href="/occasions" className="text-xs font-univers hover:text-gray-600 tracking-wide">
            {tNav('occasions')}
          </Link>
          <Link href="/editorial" className="text-xs font-univers hover:text-gray-600 tracking-wide">
            {tNav('editorial')}
          </Link>
        </nav>
      </div>
    </header>
  );
}