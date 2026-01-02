import { Link } from "@/i18n/navigation";
import { useTranslations } from 'next-intl';

export default function SitemapPage() {
    return (
        <div className="min-h-[80vh] flex flex-col bg-white">
            {/* Main content */}
            <div className="flex-1 flex items-center justify-center px-6">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Title with oval highlight */}
                    <div className="relative mb-6">
                        <h2 className="text-7xl md:text-8xl font-times-now leading-tight">
                            <span className="relative inline-block">
                                Site Map
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
                            Navigate LUZIMARKET
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
                                <path d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                    <p className="text-base md:text-lg font-univers max-w-xl mx-auto mb-12 leading-relaxed text-gray-500 px-4">
                        A comprehensive guide to exploring our marketplace is currently being built.
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
