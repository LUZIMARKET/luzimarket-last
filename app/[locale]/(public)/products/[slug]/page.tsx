import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { db } from "@/db";
import { products, vendors, categories, reviews } from "@/db/schema";
import { eq, and, ne, sql } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Package, Shield, Gift } from "lucide-react";
import { ProductReviews } from "@/components/products/product-reviews";
import { ProductsGrid } from "@/components/products/products-grid";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { ProductSchedulerActions } from "@/components/products/product-scheduler-actions";
import { ProductPriceDisplay } from "@/components/products/product-price-display";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
interface ProductPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const productData = await getProduct(slug);

  if (!productData) {
    return {
      title: 'Product Not Found',
    };
  }

  const { product } = productData;
  const images = product.images as string[] || [];
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://luzimarket.shop';

  return {
    title: `${product.name} | Luzimarket`,
    description: product.description || `Compra ${product.name} en Luzimarket. ${product.vendor?.businessName}`,
    keywords: [
      product.name,
      product.category?.name || '',
      product.vendor?.businessName || '',
      'regalos México',
      'e-commerce',
      'marketplace',
      ...(product.tags as string[] || []),
    ].filter(Boolean),
    openGraph: {
      title: product.name,
      description: product.description || `Compra ${product.name} en Luzimarket`,
      images: images.length > 0 ? [{ url: images[0], width: 1200, height: 630 }] : [],
      type: 'website',
      url: `${baseUrl}/${locale}/productos/${product.slug}`,
      siteName: 'Luzimarket',
      locale: locale === 'es' ? 'es_MX' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description || '',
      images: images.length > 0 ? [images[0]] : [],
    },
    alternates: {
      canonical: `${baseUrl}/es/productos/${product.slug}`,
      languages: {
        'es': `${baseUrl}/es/productos/${product.slug}`,
        'en': `${baseUrl}/en/products/${product.slug}`,
      },
    },
  };
}

async function getProduct(slug: string) {
  const product = await db.query.products.findFirst({
    where: eq(products.slug, slug),
    with: {
      vendor: true,
      category: true,
    },
  });

  if (!product || !product.isActive) {
    return null;
  }

  // Get related products
  const relatedProducts = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      price: products.price,
      images: products.images,
      stock: products.stock,
      vendor: {
        id: vendors.id,
        businessName: vendors.businessName,
      },
      category: {
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      },
    })
    .from(products)
    .leftJoin(vendors, eq(products.vendorId, vendors.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        eq(products.categoryId, product.categoryId),
        eq(products.isActive, true),
        ne(products.id, product.id)
      )
    )
    .limit(4);

  return { product, relatedProducts };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Products');
  const productData = await getProduct(slug);

  if (!productData) {
    notFound();
  }

  const { product, relatedProducts } = productData;
  const images = product.images as string[] || [];

  // Get review stats for structured data
  const reviewStats = await db
    .select({
      avgRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
      reviewCount: sql<number>`COUNT(*)`,
    })
    .from(reviews)
    .where(eq(reviews.productId, product.id));

  const avgRating = Number(reviewStats[0]?.avgRating) || 0;
  const reviewCount = Number(reviewStats[0]?.reviewCount) || 0;

  // JSON-LD structured data for Google
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": images,
    "brand": {
      "@type": "Brand",
      "name": product.vendor?.businessName || "Luzimarket"
    },
    "offers": {
      "@type": "Offer",
      "url": `${process.env.NEXT_PUBLIC_APP_URL}/es/productos/${product.slug}`,
      "priceCurrency": "MXN",
      "price": product.price,
      "availability": product.stock && product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": product.vendor?.businessName || "Luzimarket"
      }
    },
    ...(reviewCount > 0 && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": avgRating.toFixed(1),
        "reviewCount": reviewCount,
        "bestRating": 5,
        "worstRating": 1
      }
    })
  };

  return (
    <main className="min-h-screen">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm font-univers mb-8">
          <ol className="flex items-center gap-2 text-gray-600">
            <li>
              <Link href="/" className="hover:text-black">{t('home')}</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/categories" className="hover:text-black">{t('categories')}</Link>
            </li>
            <li>/</li>
            <li>
              {product.category?.slug ? (
                <Link href={{ pathname: '/category/[slug]', params: { slug: product.category.slug } }} className="hover:text-black">
                  {product.category?.name}
                </Link>
              ) : (
                <span>{product.category?.name}</span>
              )}
            </li>
            <li>/</li>
            <li className="text-black">{product.name}</li>
          </ol>
        </nav>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-16 items-start">
          
          {/* Left Column (Info) */}
          <div className="lg:col-span-3 border border-gray-300 bg-white flex flex-col">
            <div className="p-6 pb-8">
              <h1 className="text-2xl font-normal font-sans text-gray-800 mb-1 leading-tight">{product.name}</h1>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-8 font-sans">
                &rarr; {product.vendor?.businessName || (locale === 'es' ? 'VENDEDOR' : 'VENDOR')}
              </p>
              
              <div className="mb-8">
                <ProductPriceDisplay price={Number(product.price)} />
              </div>

              <div className="font-sans text-gray-600 text-[12px] leading-[1.8] text-justify">
                <p>{product.description}</p>
              </div>
            </div>

            {/* Accordions */}
            <div className="mt-auto">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="characteristics" className="border-t border-b-0 border-gray-300 px-5">
                  <AccordionTrigger className="hover:no-underline py-4 text-[11px] font-sans font-normal text-gray-700">
                    Características
                  </AccordionTrigger>
                  <AccordionContent className="text-xs font-sans text-gray-500 pb-4 leading-relaxed">
                    {t('specificationContent')}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="shipping" className="border-t border-b-0 border-gray-300 px-5">
                  <AccordionTrigger className="hover:no-underline py-4 text-[11px] font-sans font-normal text-gray-700">
                    Envíos y Devoluciones
                  </AccordionTrigger>
                  <AccordionContent className="text-xs font-sans text-gray-500 pb-4 leading-relaxed">
                    {t('shippingContent')}<br /><br />{t('returnsContent')}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Center Column (Images) */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            {images.length > 0 ? (
              images.map((image, index) => (
                <div key={index} className="relative aspect-square w-full border border-gray-300 bg-white">
                  <Image
                    src={image}
                    alt={`${product.name} - Img ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="relative aspect-square w-full border border-gray-300 bg-white flex items-center justify-center">
                <Package className="h-24 w-24 text-gray-400" />
              </div>
            )}
          </div>

          {/* Right Column (Schedule & Actions) */}
          <div className="lg:col-span-3 flex flex-col">
            <ProductSchedulerActions product={product} images={images} />

            <div className="mt-5 text-[11px] text-gray-400 font-sans leading-[1.8] text-justify">
              Cras justo odio, dapibus ac facilisis in, egestas eget quam. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh.
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ProductReviews
          productId={product.id}
          reviews={[]}
          averageRating={0}
          totalReviews={0}
          ratingDistribution={[]}
          canReview={false}
        />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-times-now mb-8">{t('relatedProducts')}</h2>
            <ProductsGrid products={relatedProducts} />
          </section>
        )}
      </div>
    </main>
  );
}