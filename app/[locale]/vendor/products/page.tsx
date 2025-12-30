import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { VendorProductsClient } from "@/components/vendor/vendor-products-client";
import { ProductCSVImport } from "@/components/vendor/product-csv-import";
import { ProductStatusFilter } from "@/components/vendor/product-status-filter";

interface VendorProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function VendorProductsPage({ searchParams }: VendorProductsPageProps) {
  const session = await auth();
  const t = await getTranslations("Vendor.products");
  const params = await searchParams;
  const status = typeof params.status === 'string' ? params.status : undefined;

  if (!session || session.user.role !== "vendor") {
    redirect("/login");
  }

  // Build where conditions
  const conditions = [eq(products.vendorId, session.user.id)];

  if (status === "active") {
    conditions.push(eq(products.isActive, true));
  } else if (status === "inactive") {
    conditions.push(eq(products.isActive, false));
  }

  const vendorProducts = await db
    .select({
      id: products.id,
      name: products.name,
      price: products.price,
      stock: products.stock,
      isActive: products.isActive,
      images: products.images,
      categoryId: products.categoryId,
      categoryName: categories.name,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(...conditions))
    .orderBy(products.createdAt);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-univers text-gray-900" data-testid="vendor-products-title">{t("title")}</h1>
          <p className="text-sm text-gray-600 font-univers mt-1">
            {t("description")}
          </p>
        </div>
        <Link href="/vendor/products/new">
          <Button className="bg-black text-white hover:bg-gray-800" data-testid="vendor-add-product">
            <Plus className="h-4 w-4 mr-2" />
            {t("addProduct")}
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <ProductStatusFilter />
        {/* CSV Import/Export moved here for better layout */}
        <ProductCSVImport vendorId={session.user.id} />
      </div>

      {/* Products table with bulk operations */}
      <VendorProductsClient products={vendorProducts} vendorId={session.user.id} />
    </div>
  );
}