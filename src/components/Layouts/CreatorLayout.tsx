"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";

import clsx from "clsx";
import { useMediaQuery } from "usehooks-ts";

import ClientOnly from "./ClientOnly";
import IconBook from "../Modules/Icons/IconBook";
import { ContentPageEnum } from "@/common/data.types";
import NavAccount from "../Partials/Header/NavAccount";
import IconBarsSort from "../Modules/Icons/IconBarsSort";
import IconRightLeftLarge from "../Modules/Icons/IconRightLeftLarge";
import { Env } from "@/config/Env";
import classNames from "@/utils/classNames";
import IconVietNam from "../Modules/Icons/IconVietNam";

const contentNav = [
    {
        // title: "Truyện tranh",
        children: [
            {
                title: "Thông báo",
                link: "creator",
                icon: <IconBook className="w-6 h-6 p-[2px]" />,
            },
        ],
    },
    {
        title: "Nhóm",
        children: [
            {
                title: "Tạo nhóm",
                link: "creator/teams/create",
                icon: <IconBook className="w-6 h-6 p-[2px]" />,
            },
            {
                title: "Danh sách nhóm",
                link: "creator/teams",
                icon: <IconBook className="w-6 h-6 p-[2px]" />,
            },
        ],
    },
    {
        title: "Truyện tranh",
        children: [
            {
                title: "Tạo truyện",
                link: "creator/books/create",
                icon: <IconBook className="w-6 h-6 p-[2px]" />,
            },
            {
                title: "Danh sách truyện",
                link: "creator/books",
                icon: <IconBook className="w-6 h-6 p-[2px]" />,
            },
        ],
    },
    {
        title: "Tool",
        children: [
            {
                title: "Tải ảnh",
                link: "creator/tool/download",
                icon: <IconBook className="w-6 h-6 p-[2px]" />,
            },
        ],
    },
    {
        title: "Báo cáo",
        children: [
            {
                title: "Danh sách báo cáo",
                link: "creator/reports",
                icon: <IconBook className="w-6 h-6 p-[2px]" />,
            },
        ],
    },
];

interface CreatorLayoutProps {
    children: ReactNode;
    content: ContentPageEnum;
}
const CreatorLayout = ({ children, content }: CreatorLayoutProps) => {
    const pathName = usePathname();

    const [isSide, setIsSide] = useState(false);
    const [isShow, setIsShow] = useState(false);

    const matchesMobile = useMediaQuery("(max-width: 1024px)");

    const handleScroll = useCallback(() => {
        setIsShow(window.scrollY > 0);
    }, []);

    useEffect(() => {
        if (matchesMobile) {
            setIsSide(false);
        }
    }, [pathName]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    return (
        <>
            <div className="">
                <header
                    className={clsx("h-[56px]", {
                        "lg:ml-16": isSide,
                        "lg:ml-72": !isSide,
                        "bg-transparent border-transparent": !isShow,
                        "bg-[#0000004f] backdrop-blur-xl border-sky-700 fixed z-20 top-0 right-0 left-0 transition-all border-b":
                            isShow,
                    })}
                >
                    <div className="h-[56px] px-3 relative flex items-center justify-between">
                        <button
                            onClick={() => setIsSide((state) => !state)}
                            title=""
                            className="hover:bg-slate-800 p-2 rounded-full"
                        >
                            <IconBarsSort size={25} className="fill-gray-100" />
                        </button>

                        <h1 className="text-2xl font-extrabold uppercase">
                            {content}
                        </h1>

                        <div className="flex items-center">
                            <NavAccount />
                        </div>
                    </div>
                </header>
                {isShow && <div className="w-full h-[56px]"></div>}

                <div>
                    <aside className="">
                        {isSide && matchesMobile && (
                            <div
                                onClick={() => setIsSide(false)}
                                className="transition-all ease-out fixed z-[120] top-0 left-0 right-0 bottom-0 bg-black/30"
                            ></div>
                        )}
                        <div
                            className={`w-full z-[121] bg-accent fixed transition-all ease-out duration-300 ${
                                matchesMobile
                                    ? isSide
                                        ? "left-0 max-w-72"
                                        : "-left-72 max-w-72"
                                    : isSide
                                    ? "max-w-16"
                                    : "max-w-72"
                            } top-0 bottom-0`}
                        >
                            <div className="px-2">
                                <div className="px-2 mb-5">
                                    <Link
                                        title={Env.NEXT_PUBLIC_TITLE_SEO}
                                        href={`/${content}`}
                                        className="flex items-center justify-center w-full leading-[56px] font-extrabold text-2xl"
                                    >
                                        {
                                            isSide ? "M" : "MIRUDEX"
                                        }
                                    </Link>
                                </div>

                                <div className="flex flex-col gap-1">
                                    {/* <Link
                                        prefetch={false}
                                        href={`/${ContentPageEnum.manga}/creator`}
                                    >
                                        <div
                                            className={classNames(
                                                "px-2 py-2 overflow-hidden whitespace-nowrap flex items-center gap-2 rounded-lg",
                                                !matchesMobile &&
                                                    isSide &&
                                                    "justify-center",
                                                content === ContentPageEnum.manga ? 'text-white fill-white bg-blue-800' : 'hover:bg-white/5'
                                            )}
                                        >
                                            <IconRightLeftLarge
                                                size={18}
                                                className="p-[1px] fill-white"
                                            />{" "}
                                            <span
                                                className={`leading-6 ${
                                                    !matchesMobile &&
                                                    isSide &&
                                                    "hidden"
                                                }`}
                                            >
                                                ĐỌC MANGA
                                            </span>
                                        </div>
                                    </Link> */}
                                    <Link
                                        prefetch={false}
                                        href={`/${ContentPageEnum.comics}/creator`}
                                    >
                                        <div
                                            className={classNames(
                                                "px-2 py-2 overflow-hidden whitespace-nowrap flex items-center gap-2 rounded-lg",
                                                !matchesMobile &&
                                                    isSide &&
                                                    "justify-center",
                                                content === ContentPageEnum.comics ? 'text-white fill-white bg-blue-800' : 'hover:bg-white/5'
                                            )}
                                        >
                                            <IconRightLeftLarge
                                                size={18}
                                                className="p-[1px]"
                                            />{" "}
                                            <span
                                                className={`leading-6 line-clamp-1 ${
                                                    !matchesMobile &&
                                                    isSide &&
                                                    "hidden"
                                                }`}
                                            >
                                                ĐỌC COMICS
                                            </span>
                                        </div>
                                    </Link>
                                </div>
                                <div className="w-full h-0 border-b border-slate-700 my-4"></div>
                                <div>
                                    {contentNav.map((nav, index) => {
                                        return (
                                            <div key={index}>
                                                {nav?.title && (
                                                    <div className="flex items-center whitespace-nowrap h-[36px]">
                                                        {!isSide ||
                                                        matchesMobile ? (
                                                            <h4 className="text-sm px-2 leading-[36px] text-gray-300 font-semibold">
                                                                {nav?.title}
                                                            </h4>
                                                        ) : (
                                                            <div className="w-full h-[1px] border-t border-t-gray-500 mx-4"></div>
                                                        )}
                                                    </div>
                                                )}
                                                {nav.children.map(
                                                    (item, index) => {
                                                        return (
                                                            <div
                                                                key={index}
                                                                className="mb-1"
                                                            >
                                                                <Link
                                                                    title=""
                                                                    prefetch={
                                                                        false
                                                                    }
                                                                    href={`/${content}/${item?.link}`}
                                                                >
                                                                    <div
                                                                        className={classNames(
                                                                            `px-2 py-2 flex items-center gap-2 rounded-lg fill-gray-200`,
                                                                            !matchesMobile &&
                                                                                isSide &&
                                                                                "justify-center",
                                                                            pathName.endsWith(
                                                                                item?.link
                                                                            )
                                                                                ? "text-white fill-white bg-blue-500"
                                                                                : "hover:bg-white/5"
                                                                        )}
                                                                    >
                                                                        <span className="w-6 h-6 flex-shrink-0">
                                                                            {
                                                                                item?.icon
                                                                            }
                                                                        </span>
                                                                        <span
                                                                            className={`leading-6 line-clamp-1 ${
                                                                                !matchesMobile &&
                                                                                isSide &&
                                                                                "hidden"
                                                                            }`}
                                                                        >
                                                                            {
                                                                                item?.title
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </Link>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
                <div
                    className={`h-full min-h-screen transition-all ease-out duration-300 ${
                        isSide ? "lg:ml-16 ml-0" : "lg:ml-72 ml-0"
                    }`}
                >
                    <div className="pt-4 pb-28 md:px-3 w-full">
                        <ClientOnly>{children}</ClientOnly>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreatorLayout;
