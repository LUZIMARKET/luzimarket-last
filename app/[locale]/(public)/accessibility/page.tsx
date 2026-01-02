import { getTranslations } from "next-intl/server";

export default async function AccessibilityPage() {
    const t = await getTranslations("AccessibilityPage");

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="text-4xl font-times-now mb-12 text-center">{t("title")}</h1>

            <div className="space-y-12">
                <section className="bg-white">
                    <h2 className="text-2xl font-times-now mb-4">{t("commitment.title")}</h2>
                    <p className="text-gray-700 leading-relaxed text-lg">{t("commitment.description")}</p>
                </section>

                <section>
                    <h2 className="text-2xl font-times-now mb-4">{t("standards.title")}</h2>
                    <p className="text-gray-700 leading-relaxed">{t("standards.description")}</p>
                </section>

                <section className="bg-gray-50 p-8 rounded-xl">
                    <h2 className="text-2xl font-times-now mb-6">{t("features.title")}</h2>
                    <p className="mb-6 text-gray-700">{t("features.description")}</p>
                    <ul className="grid gap-3">
                        {[
                            t("features.list.text"),
                            t("features.list.keyboard"),
                            t("features.list.contrast"),
                            t("features.list.responsive")
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="text-green-600 mt-1">✓</span>
                                <span className="text-gray-700">{item}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-times-now mb-4">{t("feedback.title")}</h2>
                    <p className="text-gray-700 mb-6">{t("feedback.description")}</p>

                    <div className="border border-gray-200 p-6 rounded-lg text-center">
                        <p className="font-medium text-lg mb-2">{t("feedback.email")}</p>
                        <p className="text-sm text-gray-500">{t("feedback.response")}</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
