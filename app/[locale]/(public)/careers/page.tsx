import { Link } from "@/i18n/navigation";
import { useTranslations } from 'next-intl';

export default function CareersPage() {
    return (
        <div className="min-h-[80vh] flex flex-col bg-white">
            {/* Main content */}
            <div className="flex-1 flex items-center justify-center px-6">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Title with oval highlight */}
                    <div className="relative mb-6">
                        <h2 className="text-7xl md:text-8xl font-times-now leading-tight">
                            <span className="relative inline-block">
                                Work with us
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
                            Join the LUZI team
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
                                <path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                    <p className="text-base md:text-lg font-univers max-w-xl mx-auto mb-12 leading-relaxed text-gray-500 px-4">
                        We are always looking for extraordinary talent to join our mission.
                        <br />
                        Opportunities will be listed here soon.
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
