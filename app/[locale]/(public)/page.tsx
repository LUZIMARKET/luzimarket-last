import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ProductCard } from "@/components/products/product-card";

import { HeroSplit } from "@/components/home/hero-split";
import { CategoryHeroGrid } from "@/components/home/category-hero-grid";
import { BloomHero } from "@/components/home/bloom-hero";
import { PromoBanner } from "@/components/home/promo-banner";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}



export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('HomePage');

  // Fetch 4 active handpicked products
  let handpickedProducts: any[] = [];
  try {
    handpickedProducts = await db.query.products.findMany({
      where: eq(products.isActive, true),
      orderBy: [desc(products.createdAt)],
      limit: 4,
      with: {
        vendor: true,
      }
    });
  } catch (error) {
    console.error("Error fetching handpicked products:", error);
    // Silent fail for now to let page render
  }

  return (
    <main className="min-h-screen">
      {/* 1. Hero Split Banner */}
      <HeroSplit />
      
      {/* 2. Promotional Banner */}
      <PromoBanner />

      {/* 3. Category Grid */}
      <CategoryHeroGrid />

      {/* 4. Handpicked Section */}
      <section className="w-full py-20 px-4 md:px-8 bg-white">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-12 border-b border-gray-100 pb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl md:text-4xl font-sans font-light text-gray-900 tracking-wide">
                {t('handpickedTitle')}
              </h2>
              <Image
                src="/images/icons/handpicked-doodle.png"
                alt="Handpicked Signature"
                width={36}
                height={36}
                className="w-10 h-10 opacity-70"
              />
            </div>
            <Link href="/handpicked">
              <Button className="bg-black text-white rounded-none px-8 py-3 text-[10px] font-sans tracking-widest uppercase hover:bg-gray-800 transition-colors shadow-none">
                Ver todos
              </Button>
            </Link>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {handpickedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}