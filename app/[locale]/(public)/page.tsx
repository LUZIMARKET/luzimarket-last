import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { HandpickedMark } from "@/components/ui/handpicked-mark";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

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
  // Fetch 4 active handpicked products
  let handpickedProducts: any[] = [];
  try {
    handpickedProducts = await db
      .select()
      .from(products)
      .where(eq(products.isActive, true))
      .orderBy(desc(products.createdAt))
      .limit(4);
  } catch (error) {
    console.error("Error fetching handpicked products:", error);
    // Silent fail for now to let page render
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[500px] md:h-[650px] w-full">
        {/* Left Side - Image */}
        <div className="relative h-[400px] md:h-full w-full bg-gray-100">
          <Image
            src="https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?q=80&w=1920&auto=format&fit=crop"
            alt="Luzi Market Lifestyle"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Right Side - Content */}
        <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center bg-white h-full">
          <div className="max-w-lg">
            <h1 className="text-4xl md:text-6xl font-times-now leading-tight mb-6">
              <span className="block mb-1">Regalos</span>
              <span className="block mb-2 relative z-10">
                <HandpickedMark>handpicked</HandpickedMark>
              </span>
              <span className="block">extraordinarios</span>
            </h1>

            <p className="text-base md:text-lg font-univers text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              Experiencias y productos seleccionados a mano para momentos especiales.
            </p>

            <Link href="/handpicked">
              <Button className="bg-black text-white rounded-none px-8 py-3 md:px-10 md:py-6 text-sm md:text-base font-univers tracking-wide hover:bg-gray-800 transition-colors">
                Ver Handpicked
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Subscription Banner */}
      <section className="w-full bg-gradient-to-r from-orange-500 via-yellow-400 to-pink-300 py-4 px-8 flex flex-col md:flex-row items-center justify-between">
        <div className="text-lg font-medium font-univers mb-4 md:mb-0">
          10% off en tu primer compra al suscribirte gratis
        </div>
        <div className="flex w-full md:w-auto gap-0 bg-white p-1 rounded-sm">
          {/* Simple form for visual matching */}
          <input
            type="email"
            placeholder="Correo electrónico"
            className="px-4 py-2 outline-none text-sm w-full md:w-64 font-univers bg-transparent"
          />
          <Button variant="ghost" className="font-medium text-sm px-6 hover:bg-gray-50 font-univers">
            Suscribirse
          </Button>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
          {categories.map((category) => (
            <div
              key={category.slug}
              className={`relative h-[50vh] md:h-[75vh] group overflow-hidden ${category.bgColor}`}
            >
              <Link
                href={{ pathname: "/category/[slug]", params: { slug: category.slug } }}
                className="relative block w-full h-full"
              >
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Category title */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full text-center px-4">
                  <h3 className="bg-white text-black text-sm font-univers tracking-wider py-3 px-8 inline-block rounded-none shadow-none">
                    {category.title}
                  </h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Handpicked Section */}
      <section className="w-full py-16 px-8">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-4">
              <h2 className="text-4xl font-univers text-black">{t('handpickedTitle')}</h2>
              <Image
                src="/images/icons/handpicked-doodle.png"
                alt="Handpicked"
                width={48}
                height={48}
                className="w-12 h-12"
              />
            </div>
            <Link href="/handpicked">
              <Button className="bg-black text-white rounded-none px-8 py-3 text-sm font-univers tracking-wide hover:bg-gray-800 transition-colors">
                {t('viewHandpicked')}
              </Button>
            </Link>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {handpickedProducts.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <Link href={{ pathname: '/products/[slug]', params: { slug: product.slug } }} className="block">
                  <div className="relative aspect-square w-full bg-gray-100 overflow-hidden border border-gray-200">
                    <Image
                      src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.jpg'}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm font-univers text-black">{product.name}</h3>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional sections can be added here */}
    </main>
  );
}