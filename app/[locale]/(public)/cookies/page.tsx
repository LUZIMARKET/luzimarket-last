import { getTranslations } from "next-intl/server";

export default async function CookiesPage() {
    const t = await getTranslations("CookiesPage");

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-times-now mb-2">{t("title")}</h1>
            <p className="text-gray-500 mb-12">{t("lastUpdated")}</p>

            <div className="prose prose-gray max-w-none space-y-12">
                <section>
                    <p className="text-lg leading-relaxed">{t("intro")}</p>
                </section>

                <section>
                    <h2 className="text-2xl font-times-now mb-4">{t("whatAreCookies.title")}</h2>
                    <p className="text-gray-700 leading-relaxed">{t("whatAreCookies.description")}</p>
                </section>

                <section>
                    <h2 className="text-2xl font-times-now mb-4">{t("howWeUse.title")}</h2>
                    <p className="text-gray-700 leading-relaxed">{t("howWeUse.description")}</p>
                </section>

                <section>
                    <h2 className="text-2xl font-times-now mb-6">{t("types.title")}</h2>
                    <div className="grid gap-6">
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-xl font-medium mb-2">{t("types.essential.title")}</h3>
                            <p className="text-gray-600 text-sm">{t("types.essential.description")}</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-xl font-medium mb-2">{t("types.performance.title")}</h3>
                            <p className="text-gray-600 text-sm">{t("types.performance.description")}</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-xl font-medium mb-2">{t("types.functional.title")}</h3>
                            <p className="text-gray-600 text-sm">{t("types.functional.description")}</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-xl font-medium mb-2">{t("types.marketing.title")}</h3>
                            <p className="text-gray-600 text-sm">{t("types.marketing.description")}</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-times-now mb-4">{t("managing.title")}</h2>
                    <p className="text-gray-700 leading-relaxed">{t("managing.description")}</p>
                </section>
            </div>
        </div>
    );
}
