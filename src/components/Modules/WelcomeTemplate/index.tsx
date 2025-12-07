"use client";
import Link from "next/link";
import Image from "next/image";

import getDomainConfig from "@/lib/domain";
import IconVietNam from "@/components/Modules/Icons/IconVietNam";
import IconTwitter from "@/components/Modules/Icons/IconTwitter";
import IconFacebook from "@/components/Modules/Icons/IconFacebook";
import IconWhatsapp from "@/components/Modules/Icons/IconWhatsapp";
import IconPinterest from "@/components/Modules/Icons/IconPinterest";
import { Env } from "@/config/Env";
import { ContentPageEnum } from "@/common/data.types";

const WelcomeTemplate = ({ appUrl }: { appUrl: string }) => {
    return (
        <>
            {/* Hero Section */}
            <div className="relative min-h-screen bg-slate-900 flex items-center justify-center px-4">
                <div className="text-center max-w-6xl mx-auto">
                    {/* Logo Section */}
                    <div className="mb-12">
                        <Link
                            href="/"
                            prefetch={false}
                            title={Env.NEXT_PUBLIC_TITLE_SEO}
                            className="leading-[56px] font-extrabold text-2xl"
                        >
                            MIRUDEX
                        </Link>
                    </div>

                    {/* Hero Title */}
                    <div className="mb-16">
                        <h1 className="text-2xl font-bold text-white mb-6">
                            TRUYỆN TRANH
                        </h1>
                        <p className="text-xl text-gray-400 mb-12">
                            Kho truyện khổng lồ - Đọc miễn phí không giới hạn
                        </p>
                    </div>

                    {/* Main Navigation Buttons */}
                    <div className="grid md:grid-cols-1 gap-2 uppercase max-w-4xl mx-auto">
                        <a
                            title="Trang chủ truyện comics"
                            href={`/${ContentPageEnum.comics}`}
                            className="bg-indigo-600 hover:bg-indigo-700 h-12 leading-[48px] rounded-lg text-white font-semibold px-8 transition-colors"
                        >
                            <div className="flex items-center justify-center gap-4">
                                <span>COMICS</span>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default WelcomeTemplate;
