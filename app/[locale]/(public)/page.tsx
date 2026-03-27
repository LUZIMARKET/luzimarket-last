import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ProductCard } from "@/components/products/product-card";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

const categories = [
  {
    title: "Flowershop",
    image: "https://images.unsplash.com/photo-1572454591674-2739f30d8c40?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8Zmxvd2VyJTIwYm91cXVldHxlbnwwfHx8fDE3NjcwMjI1NTZ8MA&ixlib=rb-4.1.0&q=85",
    slug: "flores-arreglos",
    bgColor: "bg-white"
  },
  {
    title: "Sweet",
    image: "https://images.unsplash.com/photo-1610450949065-1f2841536c88?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8Y2hvY29sYXRlfGVufDB8fHx8MTc2NzAwOTkyMHww&ixlib=rb-4.1.0&q=85",
    slug: "chocolates-dulces",
    bgColor: "bg-luzi-pink-light"
  },
  {
    title: "Beauty + Wellness",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop",
    slug: "belleza-bienestar",
    bgColor: "bg-white"
  },
  {
    title: "Giftshop",
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8Z2lmdCUyMGJveHxlbnwwfHx8fDE3NjcwNTM2ODV8MA&ixlib=rb-4.1.0&q=85",
    slug: "regalos-personalizados",
    bgColor: "bg-luzi-yellow-light"
  }
];

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
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1508610048659-a06b669e3321?q=80&w=1920&auto=format&fit=crop"
          alt="Bloom, baby, bloom"
          fill
          priority
          className="object-cover"
        />
        
        <div className="absolute inset-0 bg-black/5" />
        
        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <h1 className="text-5xl md:text-7xl lg:text-8xl text-white font-serif mb-8 drop-shadow-sm font-times-now">
            Bloom, baby, bloom.
          </h1>
          <Link href={{ pathname: '/category/[slug]', params: { slug: 'flores-arreglos' } }}>
            <Button className="bg-white text-gray-900 border border-white hover:bg-transparent hover:text-white rounded-none px-10 py-6 text-xs font-sans tracking-widest uppercase transition-all duration-300">
              Flowershop
            </Button>
          </Link>
        </div>
      </section>

      {/* Handpicked Section */}
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