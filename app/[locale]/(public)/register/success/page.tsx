import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function RegisterSuccessPage() {
    const t = await getTranslations("RegisterSuccess");

    return (
        <div className="min-h-screen py-16 px-4 flex flex-col items-center justify-center text-center bg-white animate-fade-in">
            {/* Logo Family */}
            <div className="mb-12">
                <Image
                    src="/images/logos/logo-family.png"
                    alt="Luzimarket Family"
                    width={180}
                    height={50}
                    className="h-12 w-auto"
                    priority
                />
            </div>

            {/* Title */}
            <h1 className="text-6xl font-times-now mb-8">{t("title")}</h1>

            {/* Message */}
            <p className="text-lg font-univers text-gray-800 max-w-2xl mb-16 leading-relaxed">
                {t("message")}
            </p>

            {/* Flower Icon */}
            <div className="mb-24">
                <Image
                    src="/images/logos/flower-icon-1.png"
                    alt="Flower"
                    width={120}
                    height={120}
                    className="w-32 h-32 ml-4 object-contain"
                />
            </div>

            {/* Footer */}
            <p className="text-xs font-univers text-gray-400 uppercase tracking-wide mt-auto">
                MOMENTO ESPECIAL SAPI DE CV © 2022 / TODOS LOS DERECHOS RESERVADOS
            </p>
        </div>
    );
}
