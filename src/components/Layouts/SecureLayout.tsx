"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { useParams, usePathname } from "next/navigation";

const contentNav = [
    {
        title: "Thông tin chung",
        link: "secure/dashboard",
        icon: null,
    },
    {
        title: "Điểm danh",
        link: "secure/attendance",
        icon: null,
    },
    {
        title: "Ảnh đại diện",
        link: "secure/avatar",
        icon: null,
    },
    {
        title: "Thông tin tài khoản",
        link: "secure/user-profile",
        icon: null,
    },
    {
        title: "Lịch sử đọc",
        link: "secure/user-history",
        icon: null,
    },
    {
        title: "Trang bị",
        link: "secure/inventory",
        icon: null,
    },
    {
        title: "Cửa hàng phụ kiện",
        link: "secure/shop-items/accessory",
        icon: null,
    },
    {
        title: "Cửa hàng viền đại diện",
        link: "secure/shop-items/avatar-decorations",
        icon: null,
    },
];

interface SecureLayoutLayoutProps {
    children: ReactNode;
}
const SecureLayoutLayout = ({ children }: SecureLayoutLayoutProps) => {
    const params = useParams();
    const { content } = params;
    const pathName = usePathname();

    return (
        <>
            <div className="py-2">
                <div className="xl:max-w-screen-8xl py-4 mx-auto">
                    <div className="lg:grid lg:grid-cols-12 min-h-[500px]">
                        <div className="lg:col-span-3 px-3 mb-4">
                            <nav className="bg-accent px-1 py-1 rounded-md">
                                <ul>
                                    {contentNav.map((item) => {
                                        return (
                                            <li key={item?.link} className="mb-1">
                                                <Link href={`/${content || ""}/${item?.link}`}>
                                                    <div
                                                        className={`px-2 py-2 fill-white flex items-center space-x-2 rounded-md whitespace-nowrap overflow-hidden ${
                                                            pathName === `/${content || ""}/${item?.link}`
                                                                ? "text-white fill-white bg-blue-500"
                                                                : "hover:bg-accent-hover"
                                                        }`}
                                                    >
                                                        {item?.title}
                                                    </div>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </nav>
                        </div>
                        <div className="lg:col-span-9 px-3 py-3 rounded-md bg-accent">{children}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SecureLayoutLayout;
