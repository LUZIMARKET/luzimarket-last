import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { Link } from "@/i18n/navigation";
import Image from "next/image";

interface OccasionsPageProps {
  params: Promise<{ locale: string }>;
}

const occasions = [
  { id: 'cumpleanos', image: 'https://images.unsplash.com/photo-1596073419667-9d77d59f033f?w=800&q=80' },
  { id: 'aniversario', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80' },
  { id: 'boda', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80' },
  { id: 'baby-shower', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80' },
  { id: 'graduacion', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80' },
  { id: 'navidad', image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80' },
  { id: 'dia-madres', image: 'https://images.unsplash.com/photo-1522335789203-abd6523f4364?w=800&q=80' },
  { id: 'dia-padres', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80' },
  { id: 'san-valentin', image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&q=80' },
  { id: 'agradecimiento', image: 'https://images.unsplash.com/photo-1596073419667-9d77d59f033f?w=800&q=80' },
  { id: 'nuevo-hogar', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80' },
  { id: 'recuperacion', image: 'https://images.unsplash.com/photo-1595166668735-64585c490a19?w=800&q=80' },
];

export default async function OccasionsPage({ params }: OccasionsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Occasions');

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16">
        <div className="text-center px-8">
          <h1 className="text-4xl md:text-5xl font-times-now mb-4">
            {t('title')}
          </h1>
          <p className="text-base md:text-lg font-univers text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Occasions Grid */}
      <section className="py-16 px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {occasions.map((occasion) => (
            <Link
              key={occasion.id}
              href={{ pathname: "/occasions/[id]", params: { id: occasion.id } }}
              className="group"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                {occasion.image ? (
                  <Image
                    src={occasion.image}
                    alt={t(`categories.${occasion.id}`)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-times-now text-gray-300">
                      {t(`categories.${occasion.id}`).charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <h3 className="text-xl font-univers text-center px-4">{t(`categories.${occasion.id}`)}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}