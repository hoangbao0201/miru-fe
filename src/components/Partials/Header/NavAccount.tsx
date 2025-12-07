"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";

import { useOnClickOutside } from "usehooks-ts";

import { useAppSelector } from "@/store/store";
import { Env } from "@/config/Env";
import { UserRole } from "@/services/user.services";

const { NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO } = Env

const NavAccount = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const returnurl = searchParams.get("returnurl");

    const dropdownNavAccountRef = useRef(null);

    const { data: session, status } = useSession();
    const { user, loading } = useAppSelector((state) => state.authSlice);

    const [isNavAccount, setIsNavAccount] = useState(false);

    const handleLogoutUser = () => {
        signOut({ redirect: false });
    };

    useEffect(() => {
        setIsNavAccount(false);
    }, [searchParams]);

    useOnClickOutside(dropdownNavAccountRef, () => setIsNavAccount(false));

    return (
        <div className="z-20">
            {status !== "loading" &&
                (status === "authenticated" ? (
                    <div
                        ref={dropdownNavAccountRef}
                        className="relative h-10 flex items-center justify-center"
                    >
                        <div
                            onClick={() => setIsNavAccount(state => !state)}
                            className="relative transition-all duration-75 cursor-pointer active:scale-105 w-10 h-10 rounded-full overflow-hidden"
                        >
                            <Image
                                unoptimized
                                loading="lazy"
                                alt="Ảnh người dùng"
                                width={50}
                                height={50}
                                src={`${
                                    user?.avatarUrl ? NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO + "/" + user?.avatarUrl :
                                    "/static/images/avatar_default.png"
                                }`}
                                className="absolute left-0 right-0"
                            />
                        </div>
                        {isNavAccount && (
                            <div className="absolute w-60 top-10 right-0 mt-1 z-[15] px-1 border border-gray-600 rounded-sm bg-slate-800 shadow-sm py-1">
                                {session?.user.role === UserRole.ADMIN && (
                                    <Link
                                        prefetch={false}
                                        title="Trang admin"
                                        href={`/admin-mino`}
                                        target="_blank"
                                    >
                                        <div className="px-3 py-2 cursor-pointer hover:bg-gray-100 hover:dark:bg-gray-500">
                                            Admin
                                        </div>
                                    </Link>
                                )}
                                {(session?.user.role === UserRole.ADMIN || session?.user.role === UserRole.EDITOR) && (
                                    <Link
                                        prefetch={false}
                                        title="Trang nhà sáng tạo"
                                        href={`/creator`}
                                        target="_blank"
                                    >
                                        <div className="px-3 py-2 cursor-pointer hover:bg-gray-100 hover:dark:bg-gray-500">
                                            Nhà sáng tạo
                                        </div>
                                    </Link>
                                )}
                                <Link
                                    prefetch={false}
                                    href={`/secure/dashboard`}
                                    title="Trang điều khiển"
                                >
                                    <div className="px-3 py-2 cursor-pointer hover:bg-gray-100 hover:dark:bg-gray-500">
                                        Trang cá nhân
                                    </div>
                                </Link>
                                <div
                                    onClick={handleLogoutUser}
                                    className="px-3 py-2 cursor-pointer hover:bg-gray-100 hover:dark:bg-gray-500"
                                >
                                    Đăng xuất
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center divide-x">
                        <Link
                            prefetch={false}
                            href={`/auth/login?returnurl=${
                                pathname === "/auth/login" ||
                                pathname === "/auth/register"
                                    ? returnurl || "/"
                                    : pathname
                            }`}
                            title="Trang đăng nhập"
                        >
                            <span className="px-2 py-1">Đăng nhập</span>
                        </Link>
                        <Link
                            prefetch={false}
                            href={`/auth/register?returnurl=${
                                pathname === "/auth/login" ||
                                pathname === "/auth/register"
                                    ? returnurl || "/"
                                    : pathname
                            }`}
                            title="Trang đăng kí"
                        >
                            <span className="px-2 py-1">Đăng kí</span>
                        </Link>
                    </div>
                ))}
        </div>
    );
};

export default NavAccount;
