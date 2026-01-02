import { Link } from "@/i18n/navigation";
import { useTranslations } from 'next-intl';

export default function NewsletterPage() {
    const tCommon = useTranslations('Common');

    return (
        <div className="min-h-[80vh] flex flex-col bg-white">
            {/* Main content */}
            <div className="flex-1 flex items-center justify-center px-6">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Title with oval highlight */}
                    <div className="relative mb-6">
                        <h2 className="text-7xl md:text-8xl font-times-now leading-tight">
                            <span className="relative inline-block">
                                Newsletter
                                <svg
                                    className="absolute inset-0 w-full h-full -z-10 scale-125"
                                    viewBox="0 0 400 120"
                                    preserveAspectRatio="none"
                                >
                                    <ellipse
                                        cx="200"
                                        cy="60"
                                        rx="190"
                                        ry="55"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        className="text-gray-800"
                                    />
                                </svg>
                            </span>
                        </h2>
                        <h2 className="text-4xl md:text-5xl font-times-now mt-4 text-gray-600">
                            Subscribe to our stories
                        </h2>
                    </div>

                    {/* Decorative element */}
                    <div className="my-12">
                        <div className="relative w-16 h-16 mx-auto opacity-50">
                            <svg
                                viewBox="0 0 24 24"
                                className="w-full h-full"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1"
                            >
                                <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                            </svg>
                        </div>
                    </div>

                    <p className="text-base md:text-lg font-univers max-w-xl mx-auto mb-12 leading-relaxed text-gray-500 px-4">
                        We are crafting a beautiful newsletter experience. Stay tuned for curated updates.
                    </p>

                    <Link
                        href="/"
                        className="inline-block bg-black text-white px-10 py-4 font-univers text-sm tracking-wider hover:bg-gray-900 transition-colors"
                    >
                        RETURN HOME
                    </Link>
                </div>
            </div>
        </div>
    );
}
