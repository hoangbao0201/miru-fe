"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState, useMemo } from "react";

import clsx from "clsx";

import NavHeader from "./NavHeader";
import { Env } from "@/config/Env";
import { ContentPageEnum } from "@/common/data.types";
import { useParams, usePathname } from "next/navigation";
import ButtonDarkMode from "./ButtonDarkMode";

const Navbar = dynamic(() => import("./Navbar"), {
    ssr: false,
    loading: () => (
        <span className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-500"></span>
    ),
});

const Header = () => {
    const { NEXT_PUBLIC_TITLE_SEO } = Env

    const params = useParams();
    const content =
        (params?.content as ContentPageEnum) || ContentPageEnum.comics;
        
    const pathName = usePathname();
    const isChapterPage = useMemo(
        () => pathName.includes("/chapter"),
        [pathName]
    );

    const [isShow, setIsShow] = useState(false);

    const handleScroll = useCallback(() => {
        setIsShow(window.scrollY > 0);
    }, []);

    useEffect(() => {
        if (isChapterPage) return;
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isChapterPage, handleScroll]);

    const headerClass = useMemo(
        () =>
            clsx("h-[56px]", {
                "bg-transparent border-transparent": !isShow,
                "bg-[#ffffff4f] dark:bg-[#0000004f] backdrop-blur-xl border-sky-500/20": isShow,
                "fixed z-10 top-0 right-0 left-0 transition-all border-b": !isChapterPage,
            }),
        [isShow, isChapterPage]
    );

    return (
        <>
            <header>
                <div className={headerClass}>
                    <div className="mx-auto max-w-screen-8xl h-[55px] px-3 flex items-center relative">
                        <div className="max-w-1/2 w-full flex items-center justify-start">
                            <Navbar />
                            <div className="flex-shrink-0 mx-3 relative">
                                <Link
                                    prefetch={false}
                                    href={`/${content}`}
                                    title={NEXT_PUBLIC_TITLE_SEO}
                                    className="flex items-center font-extrabold text-2xl"
                                >
                                    MIRUDEX
                                </Link>
                                <span className="absolute top-0 left-0 -translate-x-1/2">🎅🏻</span>
                                <span className="absolute top-0 right-0 translate-x-1/2 translate-y-1/2">🎄</span>
                            </div>
                        </div>

                        <NavHeader content={(content as ContentPageEnum) ?? ContentPageEnum?.comics} />
                    </div>
                </div>
            </header>
            {!isChapterPage && <div className="w-full h-[56px]"></div>}
        </>
    );
};

export default Header;
