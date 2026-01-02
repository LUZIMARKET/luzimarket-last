import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { vendors } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { BusinessHoursEditor } from "@/components/settings/business-hours-editor";
// import { StoreMapPreview } from "@/components/settings/store-map-preview"; // Replaced by Leaflet
import { StoreMapLeaflet } from "@/components/settings/store-map-leaflet"; // New interactive map
import { ArrowLeft, Globe, Phone, Clock, Instagram, Facebook, Twitter, Share2 } from "lucide-react";

async function updateVendorProfileAction(formData: FormData) {
    "use server";
    const session = await auth();
    if (!session || session.user.role !== "vendor") {
        redirect("/login");
    }

    const vendorId = session.user.vendor?.id || session.user.id;

    const payload: any = {
        businessName: formData.get("businessName")?.toString() || null,
        phone: formData.get("phone")?.toString() || null,
        whatsapp: formData.get("whatsapp")?.toString() || null,
        businessPhone: formData.get("businessPhone")?.toString() || null,
        businessHours: formData.get("businessHours")?.toString() || null,
        street: formData.get("street")?.toString() || null,
        city: formData.get("city")?.toString() || null,
        state: formData.get("state")?.toString() || null,
        country: formData.get("country")?.toString() || undefined,
        postalCode: formData.get("postalCode")?.toString() || null,
        websiteUrl: formData.get("websiteUrl")?.toString() || null,
        instagramUrl: formData.get("instagramUrl")?.toString() || null,
        facebookUrl: formData.get("facebookUrl")?.toString() || null,
        tiktokUrl: formData.get("tiktokUrl")?.toString() || null,
        twitterUrl: formData.get("twitterUrl")?.toString() || null,
        description: formData.get("description")?.toString() || null,
    };

    await db.update(vendors).set({ ...payload, updatedAt: new Date() }).where(eq(vendors.id, vendorId));
    revalidatePath("/vendor/settings");
}

export default async function VendorStoreSettingsPage() {
    const session = await auth();
    const t = await getTranslations("Vendor.store");

    if (!session || session.user.role !== "vendor") {
        redirect("/login");
    }

    const vendorId = session.user.vendor?.id || session.user.id;
    const [vendor] = await db.select().from(vendors).where(eq(vendors.id, vendorId)).limit(1);

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 border-b pb-6">
                <Link href="/vendor/settings">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-univers text-gray-900">{t("title", { default: "Tienda" })}</h1>
                    <p className="text-sm text-gray-600 font-univers mt-1">
                        {t("description", { default: "Actualiza la información de tu tienda" })}
                    </p>
                </div>
            </div>

            <form action={updateVendorProfileAction} className="space-y-12">

                {/* Profile Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4">
                        <h3 className="text-lg font-medium text-gray-900 font-univers">{t("profile.title", { default: "Perfil" })}</h3>
                        <p className="text-sm text-gray-500 mt-2 font-univers leading-relaxed">
                            {t("profile.description", { default: "Esta información será pública en tu perfil de vendedor." })}
                        </p>
                    </div>
                    <div className="lg:col-span-8">
                        <Card className="border-gray-200 shadow-sm">
                            <CardContent className="space-y-6 pt-6">
                                <div className="space-y-2">
                                    <Label htmlFor="businessName">{t("fields.businessName")}</Label>
                                    <Input
                                        id="businessName"
                                        name="businessName"
                                        defaultValue={vendor?.businessName || ""}
                                        placeholder="Mi Tienda"
                                        className="max-w-md"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">{t("fields.description")}</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        rows={4}
                                        defaultValue={vendor?.description || ""}
                                        className="resize-none"
                                        placeholder="Cuéntanos sobre tu negocio..."
                                    />
                                    <p className="text-xs text-gray-400 text-right">Máximo 500 caracteres</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="websiteUrl">Sitio Web</Label>
                                    <div className="relative max-w-md">
                                        <Globe className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="websiteUrl"
                                            name="websiteUrl"
                                            className="pl-9"
                                            placeholder="https://tutienda.com"
                                            defaultValue={vendor?.websiteUrl || ""}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Contact & Location Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4">
                        <h3 className="text-lg font-medium text-gray-900 font-univers">Contacto y Ubicación</h3>
                        <p className="text-sm text-gray-500 mt-2 font-univers leading-relaxed">
                            Información para que tus clientes puedan encontrarte y contactarte.
                        </p>

                        {/* Interactive Leaflet Map */}
                        <StoreMapLeaflet
                            className="mt-8"
                            street={vendor?.street}
                            city={vendor?.city}
                            country={vendor?.country}
                        />
                    </div>
                    <div className="lg:col-span-8">
                        <Card className="border-gray-200 shadow-sm">
                            <CardContent className="space-y-6 pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">{t("fields.phone")}</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                            <Input id="phone" name="phone" className="pl-9" defaultValue={vendor?.phone || ""} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="whatsapp">WhatsApp</Label>
                                        <div className="relative">
                                            <svg
                                                viewBox="0 0 24 24"
                                                className="absolute left-3 top-2.5 h-4 w-4 text-green-600 fill-current"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                            </svg>
                                            <Input id="whatsapp" name="whatsapp" className="pl-9" defaultValue={vendor?.whatsapp || ""} />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="businessHours">{t("fields.businessHours")}</Label>
                                    <BusinessHoursEditor
                                        name="businessHours"
                                        defaultValue={vendor?.businessHours || ""}
                                    />
                                </div>

                                <div className="pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="street">{t("fields.street")}</Label>
                                        <Input id="street" name="street" defaultValue={vendor?.street || ""} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="city">{t("fields.city")}</Label>
                                        <Input id="city" name="city" defaultValue={vendor?.city || ""} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="state">{t("fields.state")}</Label>
                                        <Input id="state" name="state" defaultValue={vendor?.state || ""} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="postalCode">{t("fields.postalCode")}</Label>
                                        <Input id="postalCode" name="postalCode" defaultValue={vendor?.postalCode || ""} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="country">{t("fields.country")}</Label>
                                        <Input id="country" name="country" defaultValue={vendor?.country || "México"} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Social Media Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4">
                        <h3 className="text-lg font-medium text-gray-900 font-univers">Redes Sociales</h3>
                        <p className="text-sm text-gray-500 mt-2 font-univers leading-relaxed">
                            Conecta tus perfiles sociales para aumentar tu visibilidad.
                        </p>
                    </div>
                    <div className="lg:col-span-8">
                        <Card className="border-gray-200 shadow-sm">
                            <CardContent className="space-y-6 pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="instagramUrl">Instagram</Label>
                                        <div className="relative">
                                            <Instagram className="absolute left-3 top-2.5 h-4 w-4 text-pink-600" />
                                            <Input id="instagramUrl" name="instagramUrl" className="pl-9" placeholder="@usuario" defaultValue={vendor?.instagramUrl || ""} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="facebookUrl">Facebook</Label>
                                        <div className="relative">
                                            <Facebook className="absolute left-3 top-2.5 h-4 w-4 text-blue-600" />
                                            <Input id="facebookUrl" name="facebookUrl" className="pl-9" placeholder="usuario" defaultValue={vendor?.facebookUrl || ""} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="tiktokUrl">TikTok</Label>
                                        <div className="relative">
                                            <Share2 className="absolute left-3 top-2.5 h-4 w-4 text-black" />
                                            <Input id="tiktokUrl" name="tiktokUrl" className="pl-9" placeholder="@usuario" defaultValue={vendor?.tiktokUrl || ""} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="twitterUrl">Twitter / X</Label>
                                        <div className="relative">
                                            <Twitter className="absolute left-3 top-2.5 h-4 w-4 text-sky-500" />
                                            <Input id="twitterUrl" name="twitterUrl" className="pl-9" placeholder="@usuario" defaultValue={vendor?.twitterUrl || ""} />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="sticky bottom-4 flex justify-end">
                    <Button type="submit" size="lg" className="shadow-lg min-w-[150px]">
                        {t("save", { default: "Guardar Cambios" })}
                    </Button>
                </div>

            </form>
        </div>
    );
}
