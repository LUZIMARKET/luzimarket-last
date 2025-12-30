import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import Image from "next/image";
import { Link } from "@/i18n/navigation";

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
    title: "Events + Dinners",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8ZmFuY3klMjBkaW5uZXJ8ZW58MHx8fHwxNzY3MDUzODgxfDA&ixlib=rb-4.1.0&q=85",
    slug: "eventos-cenas",
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

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 text-center px-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-times-now mb-6 leading-tight">
          Regalos handpicked extraordinarios
        </h1>
        <p className="text-base md:text-lg font-univers text-gray-600 max-w-2xl mx-auto">
          Experiencias y productos seleccionados a mano para momentos especiales.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </section>

      {/* Categories Grid */}
      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
          {categories.map((category) => (
            <div
              key={category.slug}
              className={`relative aspect-square group overflow-hidden ${category.bgColor}`}
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
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                  <h3 className="text-black text-sm font-univers tracking-wider bg-white px-6 py-2 inline-block">
                    {category.title}
                  </h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Additional sections can be added here */}
    </main>
  );
}