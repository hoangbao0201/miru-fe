"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useParams, usePathname, useSearchParams } from "next/navigation";

import { Env } from "@/config/Env";
import classNames from "@/utils/classNames";
import { UserRole } from "@/services/user.services";
import { ContentPageEnum } from "@/common/data.types";
import IconHot from "@/components/Modules/Icons/IconHot";
import { getListTagsBookApi } from "@/store/book/book.api";
import { GetListTagsBookResType } from "@/store/book/book.type";
import IconCawbell from "@/components/Modules/Icons/IconCawbell";
import IconSlideUp from "@/components/Modules/Icons/IconSlideUp";
import IconVietNam from "@/components/Modules/Icons/IconVietNam";
import IconSparkles from "@/components/Modules/Icons/IconSparkles";
import IconBarsSort from "@/components/Modules/Icons/IconBarsSort";
import IconRightLeftLarge from "@/components/Modules/Icons/IconRightLeftLarge";
import IconRectangleHistory from "@/components/Modules/Icons/IconRectangleHistory";
import ButtonDarkMode from "./ButtonDarkMode";

const { NEXT_PUBLIC_TITLE_SEO } = Env;

interface NavbarProps {}
const Navbar = ({}: NavbarProps) => {
    const { data: session, status } = useSession();

    const params = useParams();
    const content =
        (params?.content as ContentPageEnum) || ContentPageEnum.comics;

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const returnurl = searchParams.get("returnurl");

    const [isSide, setIsSide] = useState(false);
    const [dataListCategory, setDataListCategory] =
        useState<GetListTagsBookResType["data"]>();

    const getDataDefault = async () => {
        const categoryRes = await getListTagsBookApi({
            options: {
                take: 60,
                category: content,
            },
            revalidate: 24 * 60 * 60,
        });
        if (categoryRes?.success) {
            setDataListCategory(categoryRes?.data);
        }
    };

    useEffect(() => {
        getDataDefault();
    }, []);

    useEffect(() => {
        setIsSide(false);
    }, [pathname]);

    return (
        <>
            <button
                title="Menu"
                onClick={() => setIsSide((state) => !state)}
                className="flex-shrink-0"
            >
                <IconBarsSort size={40} className="fill-foreground p-2" />
            </button>

            {isSide && (
                <div
                    onClick={() => setIsSide(false)}
                    className="transition-all fixed z-[19] top-0 left-0 right-0 bottom-0 bg-background/80 backdrop-blur-sm h-screen"
                ></div>
            )}
            <div
                className={`max-w-72 w-full h-screen z-[20] bg-accent fixed transition-all ease-out duration-300 overflow-y-auto left-0 ${
                    isSide ? "translate-x-0" : "-translate-x-72"
                } top-0 bottom-0`}
            >
                <div className="px-2">
                    <div className="px-2 mb-5">
                        <Link
                            href={`/${content || ""}`}
                            prefetch={false}
                            title={NEXT_PUBLIC_TITLE_SEO}
                            className="flex items-center leading-[56px] font-extrabold text-2xl"
                        >
                            MIRUDEX
                        </Link>
                    </div>
                    <div className="">
                        <>
                            <div className="flex flex-col gap-1 text-sm font-bold">
                                {/* <Link
                                        prefetch={false}
                                        href={`/${ContentPageEnum.manga}`}
                                    >
                                        <div
                                            className={classNames(
                                                "px-2 py-2 flex items-center gap-2 rounded-lg transition-colors",
                                                content ===
                                                    ContentPageEnum.manga
                                                    ? "text-white fill-white bg-primary"
                                                    : "hover:bg-accent-10 text-foreground fill-foreground"
                                            )}
                                        >
                                            <IconRightLeftLarge
                                                size={18}
                                                className="p-[1px] fill-current"
                                            />{" "}
                                            <span className={`leading-6`}>
                                                ĐỌC MANGA
                                            </span>
                                        </div>
                                    </Link> */}
                                <Link
                                    prefetch={false}
                                    href={`/${ContentPageEnum.comics}`}
                                >
                                    <div
                                        className={classNames(
                                            "px-2 py-2 flex items-center gap-2 rounded-lg transition-colors",
                                            content === ContentPageEnum.comics
                                                ? "text-white fill-white bg-primary"
                                                : "hover:bg-accent-10 text-foreground fill-foreground"
                                        )}
                                    >
                                        <IconRightLeftLarge
                                            size={18}
                                            className="p-[1px] fill-current"
                                        />{" "}
                                        <span
                                            className={`leading-6 line-clamp-1`}
                                        >
                                            ĐỌC COMICS
                                        </span>
                                    </div>
                                </Link>
                            </div>
                            <div className="w-full h-0 border-b border-accent-20 my-4"></div>
                        </>

                        <ButtonDarkMode />

                        <div className="mb-3 uppercase flex flex-col text-foreground">
                            {status === "unauthenticated" && (
                                <>
                                    <Link
                                        prefetch={false}
                                        href={`/auth/login?returnurl=${
                                            pathname === "/auth/login" ||
                                            pathname === "/auth/register"
                                                ? returnurl || "/"
                                                : pathname
                                        }`}
                                    >
                                        <div className="px-2 py-2 rounded-lg hover:bg-accent-10 transition-colors">
                                            Đăng nhập
                                        </div>
                                    </Link>
                                    <Link
                                        prefetch={false}
                                        href={`/auth/register?returnurl=${
                                            pathname === "/auth/login" ||
                                            pathname === "/auth/register"
                                                ? returnurl || "/"
                                                : pathname
                                        }`}
                                    >
                                        <div className="px-2 py-2 rounded-lg hover:bg-accent-10 transition-colors">
                                            Đăng kí
                                        </div>
                                    </Link>
                                </>
                            )}

                            {status === "authenticated" && (
                                <>
                                    {session?.user.role === UserRole.ADMIN && (
                                        <Link
                                            prefetch={false}
                                            href={`/admin`}
                                            target="_blank"
                                        >
                                            <div className="px-2 py-2 rounded-lg hover:bg-accent-10 transition-colors">
                                                Admin
                                            </div>
                                        </Link>
                                    )}
                                    {[
                                        UserRole.ADMIN,
                                        UserRole.EDITOR,
                                        UserRole.CREATOR,
                                    ].includes(session?.user.role) && (
                                        <Link
                                            prefetch={false}
                                            href={`/${content}/creator`}
                                            target="_blank"
                                        >
                                            <div className="px-2 py-2 rounded-lg hover:bg-accent-10 transition-colors">
                                                Nhà sáng tạo
                                            </div>
                                        </Link>
                                    )}
                                    <Link
                                        prefetch={false}
                                        href={`/${content}/theo-doi`}
                                    >
                                        <div className="px-2 py-2 rounded-lg hover:bg-accent-10 transition-colors">
                                            Theo dõi
                                        </div>
                                    </Link>
                                    <Link
                                        prefetch={false}
                                        href={`/${
                                            content || ""
                                        }/secure/dashboard`}
                                    >
                                        <div className="px-2 py-2 rounded-lg hover:bg-accent-10 transition-colors">
                                            Trang cá nhân
                                        </div>
                                    </Link>
                                    <div
                                        onClick={() =>
                                            signOut({ redirect: false })
                                        }
                                        className="px-2 py-2 cursor-pointer rounded-lg hover:bg-accent-10 transition-colors"
                                    >
                                        Đăng xuất
                                    </div>
                                </>
                            )}
                            <div className="w-full h-0 border-b border-accent-20 my-2"></div>
                            <Link
                                prefetch={false}
                                href={`/${content || ""}/truyen-moi`}
                            >
                                <div className="px-2 py-2 flex items-center gap-2 rounded-lg hover:bg-accent-10 transition-colors text-foreground">
                                    <IconSparkles
                                        size={18}
                                        className="fill-foreground"
                                    />{" "}
                                    Truyện mới
                                </div>
                            </Link>
                            {status === "authenticated" && (
                                <Link
                                    prefetch={false}
                                    href={`/${
                                        content || ""
                                    }/secure/user-history`}
                                >
                                    <div className="px-2 py-2 flex items-center gap-2 rounded-lg hover:bg-accent-10 transition-colors text-foreground">
                                        <IconRectangleHistory
                                            size={16}
                                            className="fill-foreground"
                                        />{" "}
                                        Lịch sử đọc
                                    </div>
                                </Link>
                            )}

                            <Link
                                prefetch={false}
                                href={`/${content || ""}/hot`}
                            >
                                <div className="px-2 py-2 flex items-center gap-2 rounded-lg hover:bg-accent-10 transition-colors text-foreground">
                                    <IconHot
                                        size={18}
                                        className="fill-foreground"
                                    />{" "}
                                    Truyện nổi bật
                                </div>
                            </Link>
                            <Link
                                prefetch={false}
                                href={`/${content || ""}/top-theo-doi`}
                            >
                                <div className="px-2 py-2 flex items-center gap-2 rounded-lg hover:bg-accent-10 transition-colors text-foreground">
                                    <IconCawbell
                                        size={18}
                                        className="fill-foreground"
                                    />{" "}
                                    Top theo dõi
                                </div>
                            </Link>
                            <Link
                                prefetch={false}
                                href={`/${content || ""}/search-advanced`}
                            >
                                <div className="px-2 py-2 flex items-center gap-2 rounded-lg hover:bg-accent-10 transition-colors text-foreground">
                                    <IconSlideUp
                                        size={18}
                                        className="fill-foreground"
                                    />{" "}
                                    Tìm truyện nâng cao
                                </div>
                            </Link>
                        </div>

                        <div className="w-full h-0 border-b border-accent-20 my-4"></div>

                        <h4 className="px-2 mb-2 font-semibold text-foreground">
                            Thể loại
                        </h4>
                        <ul className="grid grid-cols-2 pb-5">
                            {dataListCategory &&
                                dataListCategory.map((tag, index) => {
                                    return (
                                        <li key={tag?.slug}>
                                            <Link
                                                prefetch={false}
                                                href={`/${content}/tags/${tag?.slug}`}
                                            >
                                                <div
                                                    className={classNames(
                                                        "px-2 py-2 flex items-center gap-2 rounded-lg hover:bg-accent-10 transition-colors text-foreground"
                                                    )}
                                                >
                                                    {tag?.name}
                                                </div>
                                            </Link>
                                        </li>
                                    );
                                })}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
