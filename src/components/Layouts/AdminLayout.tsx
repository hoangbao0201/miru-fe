"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ReactNode, useCallback, useEffect, useState } from "react";

import { useMediaQuery } from "usehooks-ts";

import { Env } from "@/config/Env";
import ClientOnly from "./ClientOnly";
import IconBars from "../Modules/Icons/IconBars";
import IconBook from "../Modules/Icons/IconBook";
import NavAccount from "../Partials/Header/NavAccount";
import IconUserNinja from "../Modules/Icons/IconUserNinja";
import IconChartUser from "../Modules/Icons/IconChartUser";
import IconBarsSort from "../Modules/Icons/IconBarsSort";
import clsx from "clsx";

const { NEXT_PUBLIC_TITLE_SEO } = Env;

const contentNav = [
    {
        title: "",
        children: [
            {
                title: "Quản lí chung",
                link: "dashboard",
                icon: <IconChartUser className="w-6 h-6 p-[2px]" />,
            },
            {
                title: "Quản lí người dùng",
                link: "manager/users",
                icon: <IconChartUser className="w-6 h-6 p-[2px]" />,
            },
            {
                title: "Quản lí nhóm",
                link: "manager/teams",
                icon: <IconChartUser className="w-6 h-6 p-[2px]" />,
            },
            {
                title: "Quản lý truyện",
                link: "books/deleted",
                icon: <IconBook className="w-6 h-6 p-[2px]" />,
            },
            {
                title: "Quản lý chương",
                link: "chapters",
                icon: <IconBook className="w-6 h-6 p-[2px]" />,
            },
        ],
    },
];

interface AdminLayoutProps {
    children: ReactNode;
}
const AdminLayout = ({ children }: AdminLayoutProps) => {
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
                        "bg-[#0000004f] backdrop-blur-xl border-sky-700 fixed z-10 top-0 right-0 left-0 transition-all border-b":
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

                        <div className="ml-auto flex items-center">
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
                            <div className="px-2 mb-5">
                                <Link
                                    title={Env.NEXT_PUBLIC_TITLE_SEO}
                                    href={`/`}
                                    className="flex items-center justify-center w-full leading-[56px] font-extrabold text-2xl"
                                >
                                    {isSide ? "M" : "MIRUDEX"}
                                </Link>
                            </div>
                            <div>
                                {contentNav.map((nav, index) => {
                                    return (
                                        <div key={index}>
                                            {nav?.title && (
                                                <div className="flex items-center whitespace-nowrap h-[36px]">
                                                    {!isSide ||
                                                    matchesMobile ? (
                                                        <h4 className="text-sm ml-3 pl-2 leading-[36px] text-gray-300 font-semibold">
                                                            {nav?.title}
                                                        </h4>
                                                    ) : (
                                                        <div className="w-full h-[1px] border-t border-t-gray-500 mx-4"></div>
                                                    )}
                                                </div>
                                            )}
                                            {nav.children.map((item, index) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        className="mb-1"
                                                    >
                                                        <Link
                                                            href={`/admin/${item?.link}`}
                                                        >
                                                            <div
                                                                className={`mx-3 px-2 py-2 fill-white flex items-center space-x-2 rounded-md whitespace-nowrap overflow-hidden ${
                                                                    pathName.endsWith(
                                                                        item?.link
                                                                    )
                                                                        ? "text-white fill-white bg-blue-500"
                                                                        : "hover:bg-gray-500"
                                                                }`}
                                                            >
                                                                <span className="w-6 h-6 flex-shrink-0">
                                                                    {item?.icon}
                                                                </span>
                                                                <span
                                                                    className={`leading-6 ${
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
                                            })}
                                        </div>
                                    );
                                })}
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

export default AdminLayout;
