"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { User, Store, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterGatewayPage() {
    const t = useTranslations("RegisterGateway");

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full space-y-12">

                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-times-now text-gray-900">
                        {t("title")}
                    </h1>
                    <p className="text-lg text-gray-600 font-univers max-w-2xl mx-auto">
                        {t("subtitle")}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Customer Card */}
                    <Card className="hover:shadow-lg transition-shadow border-gray-200">
                        <CardHeader className="text-center space-y-4 pt-10">
                            <div className="mx-auto h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center">
                                <User className="h-10 w-10 text-blue-600" />
                            </div>
                            <CardTitle className="font-times-now text-2xl">{t("customer.title")}</CardTitle>
                            <CardDescription className="font-univers text-gray-600 text-base min-h-[50px]">
                                {t("customer.description")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-full">
                            {/* Spacer or additional content if needed */}
                        </CardContent>
                        <CardFooter className="pb-10 justify-center">
                            <Link href="/register/customer" className="w-full max-w-[200px]">
                                <Button className="w-full bg-white text-black border border-black hover:bg-[#ffe16b] hover:border-[#ffe16b] font-univers rounded-full h-12 transition-colors duration-300">
                                    {t("customer.button")} <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>

                    {/* Vendor Card */}
                    <Card className="hover:shadow-lg transition-shadow border-gray-200">
                        <CardHeader className="text-center space-y-4 pt-10">
                            <div className="mx-auto h-20 w-20 bg-purple-50 rounded-full flex items-center justify-center">
                                <Store className="h-10 w-10 text-purple-600" />
                            </div>
                            <CardTitle className="font-times-now text-2xl">{t("vendor.title")}</CardTitle>
                            <CardDescription className="font-univers text-gray-600 text-base min-h-[50px]">
                                {t("vendor.description")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-full">
                        </CardContent>
                        <CardFooter className="pb-10 justify-center">
                            <Link href="/vendor-register" className="w-full max-w-[200px]">
                                <Button variant="outline" className="w-full bg-white text-black border border-black hover:bg-[#ffe16b] hover:border-[#ffe16b] font-univers rounded-full h-12 transition-colors duration-300">
                                    {t("vendor.button")} <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </div>

                <div className="text-center mt-12">
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
