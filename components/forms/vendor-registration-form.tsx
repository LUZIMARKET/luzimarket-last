"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vendorRegistrationSchema, type VendorRegistration } from "@/lib/schemas/vendor";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { InputWithValidation } from "@/components/ui/input-with-validation";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Circle, XCircle } from "lucide-react";
import Image from "next/image";
import { registerVendor } from "@/lib/actions/vendor";
import { toast } from "sonner";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";

// Extended schema type to include new fields if they aren't in the imported type yet
// (Typescript might complain if we don't cast or if the schema file wasn't reloaded by IDE)
interface ExtendedVendorRegistration extends VendorRegistration {
  exteriorNumber: string;
  interiorNumber?: string;
  neighborhood: string;
}

export default function VendorRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations("VendorRegistration");
  const router = useRouter();
  const locale = useLocale();

  const form = useForm<ExtendedVendorRegistration>({
    resolver: zodResolver(vendorRegistrationSchema),
    defaultValues: {
      hasDelivery: false,
      country: "México",
      businessName: "",
      contactName: "",
      email: "",
      password: "",
      businessPhone: "",
      whatsapp: "",
      businessHours: "",
      street: "",
      exteriorNumber: "",
      interiorNumber: "",
      neighborhood: "",
      city: "",
      state: "",
      description: "",
      websiteUrl: "",
      deliveryService: "own",
    },
    mode: "all", // Validate on change/blur for immediate feedback
  });

  async function onSubmit(data: ExtendedVendorRegistration) {
    setIsSubmitting(true);
    try {
      const result = await registerVendor(data);

      if (result.success) {
        router.push(`/${locale}/vendor-register/success`);
      } else {
        const errorMessage = result.error ? t(result.error) : t("error");
        toast.error(errorMessage);
        if (result.error === "emailExists") {
          form.setError("email", { type: "manual", message: t("emailExists") });
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(t("error"));
    } finally {
      setIsSubmitting(false);
    }
  }



  // Helper to determine validation state
  const isValid = (fieldName: keyof ExtendedVendorRegistration) =>
    form.formState.dirtyFields[fieldName] && !form.formState.errors[fieldName];

  const isInvalid = (fieldName: keyof ExtendedVendorRegistration) =>
    !!form.formState.errors[fieldName];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">

        <div className="max-w-6xl mx-auto space-y-12">

          {/* Account Info (Kept separate/top for clarity) */}
          <div className="space-y-6">
            <h3 className="text-lg font-times-now italic mb-4">→ Cuenta</h3>
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithValidation
                        data-testid="vendor-email"
                        placeholder={t("email")}
                        {...field}
                        isValid={isValid("email")}
                        isInvalid={isInvalid("email")}
                        showValidation={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithValidation
                        data-testid="vendor-password"
                        type="password"
                        placeholder={t("passwordPlaceholder")}
                        {...field}
                        isValid={isValid("password")}
                        isInvalid={isInvalid("password")}
                        showValidation={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Brand Information Section */}
          <div>
            <h3 className="text-lg font-times-now italic mb-6">→ {t("businessInfoSection")}</h3>

            <div className="grid lg:grid-cols-2 gap-x-12 lg:gap-x-16 xl:gap-x-24 gap-y-12">

              {/* LEFT COLUMN CONTAINER */}
              <div className="space-y-12">

                {/* Brand Info Inputs */}
                <div className="space-y-4">
                  {/* Brand Name */}
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <InputWithValidation
                            className="rounded-full border-gray-400"
                            placeholder={t("businessNamePlaceholder")}
                            {...field}
                            isValid={isValid("businessName")}
                            isInvalid={isInvalid("businessName")}
                            showValidation={true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Contact Name */}
                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <InputWithValidation
                            className="rounded-full border-gray-400"
                            placeholder={t("contactNamePlaceholder")}
                            {...field}
                            isValid={isValid("contactName")}
                            isInvalid={isInvalid("contactName")}
                            showValidation={true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Mobile/Whatsapp */}
                  <FormField
                    control={form.control}
                    name="whatsapp"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <InputWithValidation
                            className="rounded-full border-gray-400"
                            placeholder={t("phonePlaceholder")}
                            {...field}
                            isValid={isValid("whatsapp")}
                            isInvalid={isInvalid("whatsapp")}
                            showValidation={true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Business Phone */}
                  <FormField
                    control={form.control}
                    name="businessPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <InputWithValidation
                            className="rounded-full border-gray-400"
                            placeholder={t("businessPhonePlaceholder")}
                            {...field}
                            isValid={isValid("businessPhone")}
                            isInvalid={isInvalid("businessPhone")}
                            showValidation={true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Business Hours */}
                  <FormField
                    control={form.control}
                    name="businessHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <InputWithValidation
                            className="rounded-full border-gray-400"
                            placeholder={t("businessHoursPlaceholder")}
                            {...field}
                            isValid={isValid("businessHours")}
                            isInvalid={isInvalid("businessHours")}
                            showValidation={true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Street */}
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <InputWithValidation
                            className="rounded-full border-gray-400"
                            placeholder={t("streetPlaceholder")}
                            {...field}
                            isValid={isValid("street")}
                            isInvalid={isInvalid("street")}
                            showValidation={true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Delivery Service Section (Moved to Left Column) */}
                <div>
                  <h3 className="text-lg font-times-now italic mb-6">→ {t("deliverySection")}</h3>

                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                      <span className="font-univers text-gray-800 text-sm">{t("hasDelivery")}</span>

                      <FormField
                        control={form.control}
                        name="hasDelivery"
                        render={({ field }) => (
                          <div className="flex gap-4">
                            {/* Yes Button */}
                            <button
                              type="button"
                              onClick={() => field.onChange(true)}
                              className={`flex items-center gap-2 px-6 py-2 rounded-full border transition-all ${field.value === true ? 'border-gray-900 bg-gray-50' : 'border-gray-300'}`}
                            >
                              <span className="font-univers text-sm mr-1">{t("yes")}</span>
                              {field.value === true && <CheckCircle2 className="h-5 w-5 text-green-500 fill-white" />}
                              {field.value !== true && <Circle className="h-5 w-5 text-gray-300" />}
                            </button>

                            {/* No Button */}
                            <button
                              type="button"
                              onClick={() => field.onChange(false)}
                              className={`flex items-center gap-2 px-6 py-2 rounded-full border transition-all ${field.value === false ? 'border-gray-900 bg-gray-50' : 'border-gray-300'}`}
                            >
                              <span className="font-univers text-sm mr-1">{t("no")}</span>
                              {field.value === false ? (
                                <XCircle className="h-5 w-5 text-red-500 fill-white" />
                              ) : (
                                <Circle className="h-5 w-5 text-gray-300" />
                              )}
                            </button>
                          </div>
                        )}
                      />
                    </div>

                    {form.watch("hasDelivery") && (
                      <div className="animate-in fade-in slide-in-from-top-4 duration-300 space-y-6">
                        <FormField
                          control={form.control}
                          name="deliveryService"
                          render={({ field }) => (
                            <div className="flex flex-wrap gap-4">
                              {/* Propio */}
                              <label className="flex-1 min-w-[140px] cursor-pointer group">
                                <div className={`relative h-12 w-full rounded-full border flex items-center justify-center transition-colors ${field.value === 'own' ? 'border-gray-900' : 'border-gray-300'}`}>
                                  <span className="font-univers text-sm">{t("own")}</span>
                                  <input
                                    type="radio"
                                    {...field}
                                    value="own"
                                    checked={field.value === 'own'}
                                    className="sr-only"
                                    onChange={() => field.onChange('own')}
                                  />
                                  {field.value === 'own' && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    </div>
                                  )}
                                </div>
                              </label>

                              {/* Externo */}
                              <label className="flex-1 min-w-[140px] cursor-pointer group">
                                <div className={`relative h-12 w-full rounded-full border flex items-center justify-center transition-colors ${field.value === 'external' ? 'border-gray-900' : 'border-gray-300'}`}>
                                  <span className="font-univers text-sm">{t("external")}</span>
                                  <input
                                    type="radio"
                                    {...field}
                                    value="external"
                                    checked={field.value === 'external'}
                                    className="sr-only"
                                    onChange={() => field.onChange('external')}
                                  />
                                  {field.value === 'external' && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    </div>
                                  )}
                                </div>
                              </label>
                            </div>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="deliveryService" // Using same field for update logic only
                          render={({ field }) => (
                            <InputWithValidation
                              className="rounded-full border-gray-400 w-full"
                              placeholder="¿Qué servicio usas?"
                              onChange={() => { }}
                            />
                          )}
                        />
                      </div>
                    )}
                  </div>
                </div>

              </div>



              {/* RIGHT COLUMN CONTAINER */}
              <div className="space-y-12">

                {/* Address Details Inputs */}
                <div className="space-y-4">

                  {/* Row 1: Ext/Int */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="exteriorNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <InputWithValidation
                              className="rounded-full border-gray-400"
                              placeholder={t("exteriorNumberPlaceholder") || "Número exterior"}
                              {...field}
                              isValid={isValid("exteriorNumber")}
                              isInvalid={isInvalid("exteriorNumber")}
                              showValidation={true}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="interiorNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <InputWithValidation
                              className="rounded-full border-gray-400"
                              placeholder={t("interiorNumberPlaceholder") || "Número interior"}
                              {...field}
                              isValid={!!field.value}
                              showValidation={!!field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Row 2: Neighborhood / City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="neighborhood"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <InputWithValidation
                              className="rounded-full border-gray-400"
                              placeholder={t("neighborhoodLabel") || "Colonia"}
                              {...field}
                              isValid={isValid("neighborhood")}
                              isInvalid={isInvalid("neighborhood")}
                              showValidation={true}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <InputWithValidation
                              className="rounded-full border-gray-400"
                              placeholder={t("cityPlaceholder")}
                              {...field}
                              isValid={isValid("city")}
                              isInvalid={isInvalid("city")}
                              showValidation={true}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Row 3: State / Country */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <InputWithValidation
                              className="rounded-full border-gray-400"
                              placeholder={t("statePlaceholder")}
                              {...field}
                              isValid={isValid("state")}
                              isInvalid={isInvalid("state")}
                              showValidation={true}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <InputWithValidation
                              className="rounded-full border-gray-400"
                              placeholder={t("countryPlaceholder")}
                              {...field}
                              isValid={isValid("country")}
                              isInvalid={isInvalid("country")}
                              showValidation={true}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Website */}
                  <FormField
                    control={form.control}
                    name="websiteUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <InputWithValidation
                            className="rounded-full border-gray-400"
                            placeholder={t("websitePlaceholder")}
                            {...field}
                            isValid={isValid("websiteUrl") && field.value !== ""}
                            isInvalid={isInvalid("websiteUrl")}
                            showValidation={field.value !== ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="h-full">
                        <FormControl>
                          <Textarea
                            className="min-h-[160px] rounded-[24px] border-gray-400 px-6 py-4 font-univers text-sm placeholder:text-gray-400 focus-visible:ring-gray-950 resize-none"
                            placeholder={t("descriptionPlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Social Media Section (Moved to Right Column) */}
                <div>
                  <h3 className="text-lg font-times-now italic mb-6">→ {t("socialMediaSection")}</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="instagramUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <InputWithValidation
                              className="rounded-full border-gray-400"
                              placeholder={t("instagram")}
                              {...field}
                              isValid={!!field.value}
                              showValidation={!!field.value}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="facebookUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <InputWithValidation
                              className="rounded-full border-gray-400"
                              placeholder={t("facebook")}
                              {...field}
                              isValid={!!field.value}
                              showValidation={!!field.value}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tiktokUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <InputWithValidation
                              className="rounded-full border-gray-400"
                              placeholder={t("tiktok")}
                              {...field}
                              isValid={!!field.value}
                              showValidation={!!field.value}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="twitterUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <InputWithValidation
                              className="rounded-full border-gray-400"
                              placeholder={t("twitter")}
                              {...field}
                              isValid={!!field.value}
                              showValidation={!!field.value}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-12 pb-8">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-black text-white px-20 py-7 font-univers text-base tracking-widest hover:bg-gray-800 rounded-none transition-all"
              data-testid="vendor-submit"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  Enviando...
                </span>
              ) : (
                t("ready") || "¡Listo!"
              )}
            </Button>
          </div>

        </div>
      </form>
    </Form>
  );
}