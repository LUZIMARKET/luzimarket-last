import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from 'next-intl';
import { businessConfig } from '@/lib/config/business';
import { ArrowRight } from "lucide-react";

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
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="opacity-100 hover:opacity-70 transition-opacity"
                aria-label={social.name}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={social.icon}
                  alt={social.name}
                  width={22}
                  height={22}
                  className="w-[22px] h-[22px] grayscale hover:grayscale-0 transition-all"
                />
              </a>
            ))}
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