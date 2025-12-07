"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import clsx from "clsx";
import { toast } from "sonner";
import { useDebounceValue } from "usehooks-ts";

import convertTime from "@/utils/convertTime";
import { ContentPageEnum, IMetaPage } from "@/common/data.types";
import { NavButtonPagination } from "@/components/Share/NavButtonPagination";
import SkeletonListTable from "@/components/Modules/Skeleton/SkeletonListTable";
import { Env } from "@/config/Env";
import { UserRole } from "@/services/user.services";
import adminService from "@/services/admin.services";
import SelectOptions from "@/components/Share/SelectOptions";
import ShowToast, { NotificationTypeEnum } from "@/utils/ShowToast";

const { NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO } = Env;

interface IUser {
    userId: number;
    name: string;
    username: string;
    email: string;
    role: UserRole;
    avatarUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    banned: number;
}

interface PageOptions {
    q?: string;
    page?: number;
    take?: number;
}

interface CreatorListUsersTemplateProps {
    meta: {
        content: ContentPageEnum;
    };
}

const roleOptions = [
    { id: 0, name: "GUEST", value: "GUEST" },
    { id: 1, name: "CREATOR", value: "CREATOR" },
    { id: 2, name: "EDITOR", value: "EDITOR" },
];

const CreatorListUsersTemplate = ({ meta }: CreatorListUsersTemplateProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const { data: session, status } = useSession();

    const [isLoading, setIsLoading] = useState(true);
    const [metaPage, setMetaPage] = useState<null | IMetaPage>(null);
    const [dataListUsers, setDataListUsers] = useState<null | IUser[]>(null);
    const [changingRole, setChangingRole] = useState<number | null>(null);

    const [valueSearchDebouce, setValueSearchDebouce] = useDebounceValue(
        searchParams.get("q") || "",
        500
    );

    // Event Get Users
    const eventGetUsers = async () => {
        if (status !== "authenticated") {
            return;
        }
        try {
            const params = new URLSearchParams({
                take: "30",
            });
            // page
            const page = searchParams.get("page");
            if (page) {
                params.append("page", page.toString());
            }
            // q
            const q = searchParams.get("q");
            if (q) {
                params.append("q", q.toString().trim());
            }

            // REQUEST
            setIsLoading(true);
            const usersRes = await adminService.getListUserManager({
                query: `?${params.toString()}`,
                token: session?.backendTokens.accessToken,
            });

            if (usersRes?.success) {
                setMetaPage(usersRes?.meta);
                setDataListUsers(usersRes?.result);
            }
        } catch (error) {
            ShowToast.error("Lỗi khi tải danh sách người dùng", {
                duration: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Change
    const handleNextPage = (query: PageOptions) => {
        if (isLoading) return;

        const params = new URLSearchParams({
            take: "30",
        });
        // page
        const page = query?.page || searchParams.get("page");
        if (page) {
            params.append("page", page.toString());
        }
        // q
        const q = query?.q;
        if (q !== undefined) {
            if (q !== "") {
                params.append("q", q.toString().trim());
            }
        } else {
            const q2 = searchParams.get("q");
            if (q2) {
                params.append("q", q2.toString().trim());
            }
        }

        router.replace(`?${params}`);
    };

    const handleChangePage = (page: number) => {
        handleNextPage({ page });
    };

    const handleChangeRole = async (userId: number, newRole: UserRole) => {
        if (status !== "authenticated") {
            return;
        }
        if (!dataListUsers) {
            return;
        }

        try {
            setChangingRole(userId);
            const result = await adminService.changeUserRole({
                userId,
                roleName: newRole,
                token: session?.backendTokens.accessToken,
            });

            if (result?.success) {
                // Update local state
                setDataListUsers((users) => {
                    if (!users) return users;
                    return users.map((user) =>
                        user.userId === userId
                            ? { ...user, role: newRole }
                            : user
                    );
                });
                ShowToast.success("Thay đổi role thành công!", {
                    duration: 3000,
                });
            } else {
                ShowToast.error("Thay đổi role thất bại!", {
                    duration: 3000,
                });
            }
        } catch (error) {
            ShowToast.error("Lỗi khi thay đổi role!", {
                duration: 3000,
            });
        } finally {
            setChangingRole(null);
        }
    };

    useEffect(() => {
        eventGetUsers();
    }, [status, searchParams]);

    useEffect(() => {
        const q = searchParams.get("q");
        if (valueSearchDebouce || (!!q && valueSearchDebouce === "")) {
            handleNextPage({ q: valueSearchDebouce, page: 1 });
        }
    }, [valueSearchDebouce]);

    return (
        <>
            <div>
                <div className="bg-accent px-4 py-4">
                    <h2 className="font-semibold text-lg mb-4 border-l-4 px-3">
                        Quản lý người dùng
                    </h2>

                    <div className="mb-4 relative">
                        <input
                            defaultValue={searchParams.get("q") || ""}
                            onChange={(e) =>
                                setValueSearchDebouce(e.target.value)
                            }
                            placeholder="Tìm kiếm theo tên, email hoặc username..."
                            className="h-10 px-4 rounded-md w-full"
                        />
                    </div>

                    <div className="overflow-x-auto relative border border-gray-300 mb-5">
                        <table className="table-auto min-w-[830px] w-full">
                            <colgroup>
                                <col style={{ minWidth: "5%" }} />
                                <col style={{ minWidth: "15%" }} />
                                <col style={{ minWidth: "20%" }} />
                                <col style={{ minWidth: "25%" }} />
                                <col style={{ minWidth: "15%" }} />
                                <col style={{ minWidth: "20%" }} />
                            </colgroup>
                            <thead className="text-gray-600 bg-gray-100">
                                <tr className="whitespace-nowrap uppercase [&>th]:px-2 [&>th]:py-2 [&>th]:font-semibold">
                                    <th className="">Id</th>
                                    <th className="">Avatar</th>
                                    <th className="">Tên</th>
                                    <th className="">Email</th>
                                    <th className="">Username</th>
                                    <th className="">Role</th>
                                    <th className="">Trạng thái</th>
                                    <th className="">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-sm">
                                {status === "authenticated" && !isLoading ? (
                                    dataListUsers && dataListUsers.length > 0 ? (
                                        dataListUsers.map((user, index) => {
                                            const isChanging =
                                                changingRole === user.userId;
                                            return (
                                                <tr
                                                    key={user?.userId}
                                                    className="[&>td]:px-2 [&>td]:py-2 divide-x"
                                                >
                                                    <td className="text-center">
                                                        {user?.userId}
                                                    </td>
                                                    <td className="text-center">
                                                        <Image
                                                            alt=""
                                                            width={40}
                                                            height={40}
                                                            unoptimized
                                                            loading="lazy"
                                                            className={`w-10 h-10 rounded-full border object-cover mx-auto`}
                                                            src={
                                                                user?.avatarUrl
                                                                    ? `${NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO}/${user.avatarUrl}`
                                                                    : "/static/images/avatar_default.png"
                                                            }
                                                        />
                                                    </td>
                                                    <td className="">
                                                        <Link
                                                            href={`/${meta?.content}/users/${user?.userId}`}
                                                            prefetch={false}
                                                            target="_blank"
                                                            className="hover:underline font-semibold"
                                                        >
                                                            {user?.name}
                                                        </Link>
                                                    </td>
                                                    <td className="">
                                                        {user?.email}
                                                    </td>
                                                    <td className="">
                                                        {user?.username}
                                                    </td>
                                                    <td className="">
                                                        <SelectOptions
                                                            options={roleOptions}
                                                            value={
                                                                roleOptions.find(
                                                                    (r) =>
                                                                        r.value ===
                                                                        user?.role
                                                                ) ||
                                                                roleOptions[0]
                                                            }
                                                            handleOnchange={(
                                                                option
                                                            ) => {
                                                                if (
                                                                    !isChanging
                                                                ) {
                                                                    handleChangeRole(
                                                                        user.userId,
                                                                        option.value as UserRole
                                                                    );
                                                                }
                                                            }}
                                                            // disabled={
                                                            //     isChanging ||
                                                            //     session?.user
                                                            //         ?.role !==
                                                            //         UserRole.ADMIN
                                                            // }
                                                        />
                                                    </td>
                                                    <td className="text-center">
                                                        {user?.banned > 0 ? (
                                                            <span className="bg-red-600 text-white px-2 py-1 text-xs font-semibold rounded-sm">
                                                                BANNED
                                                            </span>
                                                        ) : (
                                                            <span className="bg-green-600 text-white px-2 py-1 text-xs font-semibold rounded-sm">
                                                                ACTIVE
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="">
                                                        <div className="flex flex-col gap-1">
                                                            <Link
                                                                title="Xem chi tiết"
                                                                href={`/${meta?.content}/users/${user?.userId}`}
                                                                prefetch={false}
                                                                target="_blank"
                                                                className={clsx(
                                                                    "px-2 py-1 text-center block rounded-sm bg-slate-600 hover:bg-blue-600 text-xs"
                                                                )}
                                                            >
                                                                Xem chi tiết
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={8}
                                                className="py-4 text-center font-semibold"
                                            >
                                                Không tìm thấy người dùng nào!
                                            </td>
                                        </tr>
                                    )
                                ) : (
                                    <SkeletonListTable count={20} col={8} />
                                )}
                            </tbody>
                        </table>
                    </div>

                    {metaPage && (
                        <NavButtonPagination
                            countPage={metaPage?.pageCount}
                            handleChangePage={handleChangePage}
                            currentPage={metaPage?.currentPage}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default CreatorListUsersTemplate;
