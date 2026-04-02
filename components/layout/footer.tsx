"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from 'next-intl';
import { businessConfig } from '@/lib/config/business';
import { usePathname } from 'next/navigation';

export function Footer() {
  const t = useTranslations('Footer');
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: "Instagram", href: businessConfig.social.instagram, icon: "/images/socials/Instagram.png" },
    { name: "Facebook", href: businessConfig.social.facebook, icon: "/images/socials/Facebook.png" },
    { name: "TikTok", href: businessConfig.social.tiktok, icon: "/images/socials/TikTok.png" },
    { name: "WhatsApp", href: "https://wa.me/521234567890", icon: "/images/socials/Whatsapp.png" },
    { name: "X", href: businessConfig.social.twitter, icon: "/images/socials/X.png" },
    { name: "YouTube", href: "https://youtube.com/@luzimarket", icon: "/images/socials/Youtube.png" },
  ];

  return (
    <footer className="bg-white text-black pt-16 pb-8 border-t border-gray-100">
      <div className="container mx-auto px-8">

        {/* TOP ROW */}
        <div className="flex flex-col xl:flex-row items-center justify-between gap-8 mb-16">

          {/* LEFT: LUZI FAMILY Badge */}
          {/* LEFT: LUZI FAMILY Badge */}
          <Link href="/vendor-register" className="flex items-center gap-3 hover:opacity-70 transition-opacity">
            <Image
              src="/images/logos/luzi-family.png"
              alt="Luzi Family"
              width={120}
              height={32}
              className="h-8 w-auto object-contain"
            />
            <span className="text-black text-lg">→</span>
            <span className="text-sm font-univers text-black">
              {t('affiliate')}
            </span>
          </Link>

          {/* CENTER: Navigation Links */}
          <nav className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2">
            <div className="text-sm font-univers text-black">
              <span>{t('country')}:</span>
              <span className="ml-1 underline decoration-1 underline-offset-2 font-medium">México</span>
            </div>
            <Link href="/newsletter" className="text-sm font-univers text-black hover:text-gray-600 transition-colors">{t('newsletter')}</Link>
            <Link href="/editorial" className="text-sm font-univers text-black hover:text-gray-600 transition-colors">{t('editorialArchive')}</Link>
            <Link href="/careers" className="text-sm font-univers text-black hover:text-gray-600 transition-colors">{t('careers')}</Link>
            <Link href="/sitemap" className="text-sm font-univers text-black hover:text-gray-600 transition-colors">{t('sitemap')}</Link>
          </nav>

          {/* RIGHT: Social Icons */}
          <div className="flex items-center gap-6">
            <a href={businessConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="opacity-100 hover:opacity-70 transition-opacity">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-gray-900 border-[1px] border-gray-900 rounded-[5px] p-0.5">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href={businessConfig.social.facebook} target="_blank" rel="noopener noreferrer" className="opacity-100 hover:opacity-70 transition-opacity">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-gray-900">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href={businessConfig.social.tiktok} target="_blank" rel="noopener noreferrer" className="opacity-100 hover:opacity-70 transition-opacity">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-gray-900">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
              </svg>
            </a>
            <a href="https://wa.me/521234567890" target="_blank" rel="noopener noreferrer" className="opacity-100 hover:opacity-70 transition-opacity">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-gray-900">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </a>
            <a href={businessConfig.social.twitter} target="_blank" rel="noopener noreferrer" className="opacity-100 hover:opacity-70 transition-opacity">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-gray-900">
                <path d="M2 3l10.2 13M22 21L11.8 8M14.5 21L2 3h4.5l10.2 13M22 21h-4.5L7.3 3" />
              </svg>
            </a>
            <a href="https://youtube.com/@luzimarket" target="_blank" rel="noopener noreferrer" className="opacity-100 hover:opacity-70 transition-opacity">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-gray-900">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
              </svg>
            </a>
          </div>
        </div>

        {/* BOTTOM ROW: Copyright & Legal */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 text-[10px] text-gray-400 font-univers uppercase tracking-wide border-t border-transparent">
          <p>© {currentYear} LUZI ® MARKET</p>
          <div className="flex flex-wrap justify-center gap-8">
            <Link href="/terms" className="hover:text-black transition-colors">{t('terms')}</Link>
            <Link href="/privacy" className="hover:text-black transition-colors">{t('privacy')}</Link>
            <Link href="/cookies" className="hover:text-black transition-colors">{t('cookies')}</Link>
            <Link href="/accessibility" className="hover:text-black transition-colors">{t('accessibility')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}