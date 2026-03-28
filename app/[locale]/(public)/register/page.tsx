"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterGatewayPage() {
    const t = useTranslations("RegisterGateway");

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl w-full space-y-12">

                {/* Header Section */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-times-now text-gray-900">
                        {t("title")}
                    </h1>
                    <p className="text-lg text-gray-600 font-univers max-w-2xl mx-auto">
                        {t("subtitle")}
                    </p>
                </div>

                {/* Customer Card Centered */}
                <div className="flex justify-center">
                    <Card className="border border-black/5 shadow-sm hover:shadow-md transition-all duration-300 w-full max-w-sm bg-white rounded-2xl">
                        <CardHeader className="text-center space-y-5 pt-12">
                            <div className="mx-auto h-16 w-16 bg-[#FAFAFA] border border-gray-100 rounded-full flex items-center justify-center">
                                <User className="h-7 w-7 text-black stroke-[1.5]" />
                            </div>
                            <CardTitle className="font-times-now text-3xl tracking-tight text-gray-900">{t("customer.title")}</CardTitle>
                            <CardDescription className="font-univers text-gray-500 text-[15px] leading-relaxed min-h-[48px] px-2">
                                {t("customer.description")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-full">
                            {/* Spacer */}
                        </CardContent>
                        <CardFooter className="pb-12 justify-center">
                            <Link href="/register/customer" className="w-full text-center group">
                                <Button className="w-full max-w-[220px] bg-black text-white border border-black hover:bg-[#ffe16b] hover:border-[#ffe16b] hover:text-black font-univers rounded-full h-12 transition-all duration-300 ease-in-out">
                                    {t("customer.button")} <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </div>

                {/* Affiliate (Vendor) Section */}
                <div className="flex flex-col items-center justify-center pt-8 border-t border-gray-200 gap-6">
                   
                    <Link href="/vendor-register" className="group flex items-center flex-wrap justify-center gap-3 sm:gap-4 hover:opacity-80 transition-opacity">
                        <div className="flex items-center">
                            <span className="font-times-now text-3xl sm:text-4xl tracking-tighter text-black">LUZI</span>
                            <sup className="text-xs sm:text-sm font-sans mx-[2px] mt-2 sm:mt-0">®</sup>
                        </div>
                        
                        <div className="border border-black rounded-full px-4 sm:px-6 py-1 sm:py-1.5 text-sm sm:text-base font-times-now tracking-widest text-black">
                            FAMILY
                        </div>

                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-black stroke-[1.5] group-hover:translate-x-1 transition-transform" />

                        <span className="text-lg sm:text-xl font-univers font-light text-black">
                            Affiliate
                        </span>
                    </Link>

                </div>

                {/* Login Link */}
                <div className="text-center pt-4">
                    <p className="text-sm text-gray-600 font-univers">
                        {t("alreadyHaveAccount")}{" "}
                        <Link href="/login" className="font-medium text-black hover:underline">
                            {t("login")}
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
}
