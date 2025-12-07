"use client";

import Link from "next/link";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

import { Env } from "@/config/Env";
import ShowToast, { NotificationTypeEnum } from "@/utils/ShowToast";
import classNames from "@/utils/classNames";
import { ContentPageEnum } from "@/common/data.types";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { NavButtonPagination } from "@/components/Share/NavButtonPagination";
import { cleanAndSerializeQueryParams } from "@/utils/cleanAndSerializeQueryParams";
import {
    addMemberTeamsAdminManagerAction,
    getListTeamsAdminManagerAction,
    outMemberTeamsAdminManagerAction,
    removeMemberTeamsAdminManagerAction,
} from "@/store/admin-manager-teams/admin-manager-teams.action";
import { UserRoleTeam } from "@/store/team/team.type";
import SkeletonListTable from "@/components/Modules/Skeleton/SkeletonListTable";
import IconArrowRightFromBracket from "@/components/Modules/Icons/IconArrowRightFromBracket";
import IconPlus from "@/components/Modules/Icons/IconPlus";
import { useDebounceValue } from "usehooks-ts";
import { UserRole } from "@/services/user.services";

interface IParamsNextPage {
    order?: string;
    take?: number;
    page?: number;
    q?: string;
}
interface ListTeamsTemplateProps {
    meta: {
        isSearch: boolean;
        content: ContentPageEnum;
    };
}
const ListTeamsTemplate = ({ meta }: ListTeamsTemplateProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const { data: session, status } = useSession();

    const dispatch = useAppDispatch();
    const { listTeams } = useAppSelector((state) => state.adminManagerTeams);

    const [dataAddMember, setDataAddMember] = useState<{
        teamId: number | null;
        email: string;
        role: UserRoleTeam;
    }>({
        email: "",
        teamId: null,
        role: UserRoleTeam.member,
    });
    const [params, setParams] = useState<IParamsNextPage>({});

    const [valueSearchDebouce, setValueSearchDebouce] = useDebounceValue(
        searchParams.get("q") || "",
        500
    );

    const handleNextPage = (query: IParamsNextPage) => {
        const newParams = cleanAndSerializeQueryParams({
            ...params,
            ...query,
        });

        router.replace(`?${newParams}`);
    };

    const eventGetDataDefault = () => {
        const newParams = {
            order: searchParams.get("order") || undefined,
            page: Number(searchParams.get("page")) || 1,
            take: Number(searchParams.get("take")) || 24,
            q: searchParams.get("q") || undefined,
        };
        setParams(newParams);
        dispatch(getListTeamsAdminManagerAction(newParams));
    };

    const handleRefreshPage = () => {
        eventGetDataDefault();
    };

    const handleChangeEmailAddMember = (e: ChangeEvent<HTMLInputElement>) => {
        setDataAddMember((state) => ({ ...state, email: e.target.value }));
    };
    const handleChangeRoleAddMember = (role: UserRoleTeam) => {
        setDataAddMember((state) => ({ ...state, role }));
    };

    const addMemberTeam = async ({ teamId }: { teamId: number }) => {
        try {
            const email = dataAddMember?.email || "";

            await dispatch(
                addMemberTeamsAdminManagerAction({
                    email,
                    teamId,
                    roleTeam: dataAddMember?.role,
                })
            ).unwrap();

            ShowToast?.[NotificationTypeEnum.success](`Thông báo`, {
                duration: 3000,
                description: "Thêm người dùng thành công",
            });
            setDataAddMember((state) => ({ ...state, email: "" }));
        } catch (error) {
            const err = error as { error: string };
            ShowToast?.[NotificationTypeEnum.error](`Thông báo`, {
                duration: 3000,
                description: err?.error || "Thêm người dùng thất bại",
            });
        } finally {
        }
    };

    const outMemberTeam = async ({ teamId }: { teamId: number }) => {
        if (status !== "authenticated") return;
        try {
            await dispatch(
                outMemberTeamsAdminManagerAction({
                    teamId,
                    userId: session?.user?.userId,
                })
            ).unwrap();

            ShowToast?.[NotificationTypeEnum.success](`Thông báo`, {
                duration: 3000,
                description: `Thoát nhóm thành công`,
            });
        } catch (error) {
            const err = error as { error: string };
            ShowToast?.[NotificationTypeEnum.error]("Thông báo", {
                duration: 3000,
                description: err?.error || `Thoát nhóm thất bại`,
            });
        } finally {
        }
    };

    const removeMemberTeam = async ({ teamId, userId }: { teamId: number; userId: number }) => {
        if (status !== "authenticated") return;
        try {
            await dispatch(
                removeMemberTeamsAdminManagerAction({
                    teamId,
                    userId,
                })
            ).unwrap();

            ShowToast?.[NotificationTypeEnum.success](`Thông báo`, {
                duration: 3000,
                description: `Đuổi thành viên thành công`,
            });
        } catch (error) {
            const err = error as { error: string };
            ShowToast?.[NotificationTypeEnum.error]("Thông báo", {
                duration: 3000,
                description: err?.error || `Đuổi thành viên thất bại`,
            });
        } finally {
        }
    };

    // Helper function to check if current user is admin of a team
    const isCurrentUserAdmin = (team: any): boolean => {
        if (!session?.user?.userId || !team?.members) return false;
        const currentUserMember = team.members.find(
            (member: any) => member?.user?.userId === session?.user?.userId
        );
        return currentUserMember?.role === UserRoleTeam.admin && currentUserMember?.confirmed === true;
    };

    // Helper function to check if member is current user
    const isCurrentUser = (memberUserId: number): boolean => {
        return session?.user?.userId === memberUserId;
    };

    useEffect(() => {
        eventGetDataDefault();
    }, [searchParams]);

    useEffect(() => {
        const q = searchParams.get("q");
        if (valueSearchDebouce || (!!q && valueSearchDebouce === "")) {
            handleNextPage({ q: valueSearchDebouce, page: 1 });
        }
    }, [valueSearchDebouce]);

    return (
        <div>
            <div className="bg-accent px-4 py-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-lg border-l-4 px-3">
                        Danh sách nhóm
                    </h2>
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/${meta?.content}/creator/teams/create`}
                            className="text-sm h-8 px-3 py-1 whitespace-nowrap border border-transparent rounded-md bg-blue-600 hover:bg-blue-700 cursor-pointer flex items-center justify-center space-x-1"
                        >
                            <IconPlus className="w-4 h-4 fill-white" />
                            <span>Tạo nhóm mới</span>
                        </Link>
                        <div
                            onClick={handleRefreshPage}
                            className="text-sm h-8 px-2 py-1 whitespace-nowrap border border-transparent rounded-md bg-slate-600 hover:bg-slate-700 cursor-pointer flex items-center justify-center space-x-1"
                        >
                            Tải lại trang
                        </div>
                    </div>
                </div>

                {meta?.isSearch && (
                    <div className="mb-4 relative">
                        <input
                            defaultValue={searchParams.get("q") || ""}
                            onChange={(e) =>
                                setValueSearchDebouce(e.target.value)
                            }
                            className="h-10 px-4 rounded-md w-full"
                        />
                    </div>
                )}

                <div className="overflow-x-auto relative mb-5">
                    <table className="table-fixed min-w-[830px] w-full border-x border-b border-gray-700">
                        <colgroup>
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "20%" }} />
                            <col style={{ width: "55%" }} />
                            <col style={{ width: "15%" }} />
                        </colgroup>
                        <thead className="text-gray-600 bg-gray-100">
                            <tr className="whitespace-nowrap uppercase [&>th]:px-2 [&>th]:py-2 [&>th]:font-semibold">
                                <th className="">Id</th>
                                <th className="text-sm text-center font-semibold px-2 py-1 text-blue-200 bg-blue-600">
                                    Nhóm
                                </th>
                                <th className="text-sm text-center font-semibold px-2 py-1 text-green-200 bg-green-600">
                                    Thành viên
                                </th>
                                <th className="">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {listTeams?.load ? (
                                <SkeletonListTable count={24} col={4} />
                            ) : listTeams?.data?.length > 0 ? (
                                listTeams?.data?.map((team, index) => {
                                    const isShowFormAddMember =
                                        dataAddMember?.teamId === team?.teamId;
                                    const isAdmin = isCurrentUserAdmin(team);
                                    return (
                                        <tr
                                            key={team?.teamId}
                                            className={classNames(
                                                "[&>td]:px-2 [&>td]:py-2 divide-x divide-gray-700",
                                                index % 2 === 0 &&
                                                    "bg-slate-900/50"
                                            )}
                                        >
                                            <td className="text-center">
                                                {team?.teamId}
                                            </td>
                                            <td className="">
                                                <div className="px-3 py-2 flex items-center bg-slate-800">
                                                    <Link
                                                        target="_blank"
                                                        prefetch={false}
                                                        href={`/${meta?.content}/teams/${team?.teamId}/books`}
                                                        className="w-full"
                                                    >
                                                        <Image
                                                            alt=""
                                                            width={35}
                                                            height={35}
                                                            unoptimized
                                                            loading="lazy"
                                                            className={`w-[35px] h-[35px] mx-auto mb-2 rounded-full border object-cover`}
                                                            src={
                                                                team?.coverUrl
                                                                    ? team?.coverUrl
                                                                    : "/static/images/image-book-not-found.jpg"
                                                            }
                                                        />
                                                        <p className="w-full text-center font-semibold uppercase">
                                                            {team?.name}
                                                        </p>
                                                    </Link>
                                                </div>
                                            </td>
                                            <td className="">
                                                <div
                                                    className={classNames(
                                                        "p-2 bg-slate-800",
                                                        listTeams?.loadTeam &&
                                                            "opacity-70 select-none pointer-events-none"
                                                    )}
                                                >
                                                    <div className="space-y-1">
                                                        {team?.members?.length >
                                                        0 ? (
                                                            team?.members?.map(
                                                                (member) => {
                                                                    const isMemberCurrentUser = isCurrentUser(member?.user?.userId);
                                                                    const canOut = !isAdmin && isMemberCurrentUser;
                                                                    const canRemove = isAdmin && !isMemberCurrentUser;
                                                                    return (
                                                                        <div
                                                                            key={
                                                                                member
                                                                                    ?.user
                                                                                    ?.userId
                                                                            }
                                                                            className="flex items-center px-1 py-1 bg-slate-700"
                                                                        >
                                                                            <Link
                                                                                href={`/${meta?.content}/users/${member?.user?.userId}`}
                                                                                prefetch={
                                                                                    false
                                                                                }
                                                                                target="_blank"
                                                                                className="px-2 py-1 rounded-md block hover:bg-slate-600/80"
                                                                            >
                                                                                <div className="flex items-center space-x-2">
                                                                                    <Image
                                                                                        alt=""
                                                                                        width={
                                                                                            30
                                                                                        }
                                                                                        height={
                                                                                            30
                                                                                        }
                                                                                        unoptimized
                                                                                        loading="lazy"
                                                                                        className={`w-[30px] h-[30px] rounded-full border object-cover`}
                                                                                        src={
                                                                                            member
                                                                                                ?.user
                                                                                                ?.avatarUrl
                                                                                                ? Env.NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO +
                                                                                                  "/" +
                                                                                                  member
                                                                                                      ?.user
                                                                                                      ?.avatarUrl
                                                                                                : "/static/images/image-book-not-found.jpg"
                                                                                        }
                                                                                    />
                                                                                    <div className="text-xs font-semibold uppercase">
                                                                                        {
                                                                                            member
                                                                                                ?.user
                                                                                                ?.name
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </Link>
                                                                            <div
                                                                                className={`mx-1 h-6 leading-6 px-2 uppercase font-semibold text-xs text-white rounded-sm ${
                                                                                    !member?.confirmed
                                                                                        ? "bg-blue-600 boder border-blue-400"
                                                                                        : "bg-green-600 boder border-green-400"
                                                                                }`}
                                                                            >
                                                                                {!member?.confirmed
                                                                                    ? "CHỜ XÁC NHẬN"
                                                                                    : member?.role}
                                                                            </div>
                                                                            <div className="flex items-center ml-auto">
                                                                                {canOut && (
                                                                                    <button
                                                                                        onClick={() =>
                                                                                            outMemberTeam(
                                                                                                {
                                                                                                    teamId: team?.teamId,
                                                                                                }
                                                                                            )
                                                                                        }
                                                                                        title="Rời nhóm"
                                                                                    >
                                                                                        <IconArrowRightFromBracket className="w-8 h-8 p-2 fill-white bg-red-600 hover:bg-red-700" />
                                                                                    </button>
                                                                                )}
                                                                                {canRemove && (
                                                                                    <button
                                                                                        onClick={() =>
                                                                                            removeMemberTeam(
                                                                                                {
                                                                                                    teamId: team?.teamId,
                                                                                                    userId: member?.user?.userId,
                                                                                                }
                                                                                            )
                                                                                        }
                                                                                        title="Đuổi thành viên"
                                                                                    >
                                                                                        <IconArrowRightFromBracket className="w-8 h-8 p-2 fill-white bg-orange-600 hover:bg-orange-700" />
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                }
                                                            )
                                                        ) : (
                                                            <div className="text-center px-2 py-1 bg-slate-700">
                                                                Không có thành
                                                                viên!
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="mt-2 space-y-2">
                                                        {isAdmin && isShowFormAddMember && (
                                                            <>
                                                                <input
                                                                    value={
                                                                        dataAddMember?.email
                                                                    }
                                                                    onChange={
                                                                        handleChangeEmailAddMember
                                                                    }
                                                                    type="email"
                                                                    name={`team-${team?.teamId}`}
                                                                    autoComplete="nope"
                                                                    placeholder="Nhập email thành viên"
                                                                    className={classNames(
                                                                        "w-full h-8 px-3 py-1 rounded-md"
                                                                    )}
                                                                />
                                                                <div className="flex space-x-2">
                                                                    {session
                                                                        ?.user
                                                                        .role ===
                                                                        UserRole.ADMIN && (
                                                                        <button
                                                                            onClick={() =>
                                                                                handleChangeRoleAddMember(
                                                                                    UserRoleTeam.admin
                                                                                )
                                                                            }
                                                                            className={classNames(
                                                                                "text-sm px-2 rounded-md w-full text-center font-semibold leading-8 h-8",
                                                                                dataAddMember?.role ===
                                                                                    UserRoleTeam.admin
                                                                                    ? "bg-emerald-600"
                                                                                    : "bg-slate-700"
                                                                            )}
                                                                        >
                                                                            ADMIN
                                                                        </button>
                                                                    )}
                                                                    <button
                                                                        onClick={() =>
                                                                            handleChangeRoleAddMember(
                                                                                UserRoleTeam.member
                                                                            )
                                                                        }
                                                                        className={classNames(
                                                                            "text-sm px-2 rounded-md w-full text-center font-semibold leading-8 h-8",
                                                                            dataAddMember?.role ===
                                                                                UserRoleTeam.member
                                                                                ? "bg-emerald-600"
                                                                                : "bg-slate-700"
                                                                        )}
                                                                    >
                                                                        MEMBER
                                                                    </button>
                                                                </div>
                                                            </>
                                                        )}

                                                        {isAdmin && (
                                                            <div
                                                                onClick={() => {
                                                                    if (
                                                                        isShowFormAddMember
                                                                    ) {
                                                                        addMemberTeam(
                                                                            {
                                                                                teamId: team?.teamId,
                                                                            }
                                                                        );
                                                                    } else {
                                                                        setDataAddMember(
                                                                            (
                                                                                state
                                                                            ) => ({
                                                                                ...state,
                                                                                teamId: team?.teamId,
                                                                            })
                                                                        );
                                                                    }
                                                                }}
                                                                className={classNames(
                                                                    "h-8 px-2 py-1 whitespace-nowrap border border-transparent rounded-md bg-indigo-600 hover:bg-indigo-700 cursor-pointer flex items-center justify-center space-x-1",
                                                                    isShowFormAddMember
                                                                        ? ""
                                                                        : "w-full flex-1"
                                                                )}
                                                            >
                                                                {isShowFormAddMember && (
                                                                    <IconPlus className="w-5 h-5 p-1 fill-white" />
                                                                )}
                                                                <p>
                                                                    Thêm thành viên
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="">
                                                <div className="flex flex-col">
                                                    <Link
                                                        title="Chỉnh sửa nhóm"
                                                        href={`/${meta?.content}/creator/teams/${team?.teamId}`}
                                                        className="px-2 py-1 text-center block rounded-sm bg-slate-700 hover:bg-blue-600"
                                                    >
                                                        Chỉnh sửa
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <td
                                    colSpan={4}
                                    className="py-2 px-3 text-center font-semibold"
                                >
                                    Hiện tại bạn không tham gia nhóm nào!
                                </td>
                            )}
                        </tbody>
                    </table>
                </div>

                <NavButtonPagination
                    countPage={listTeams?.meta?.pageCount || 1}
                    currentPage={listTeams?.meta?.currentPage || 1}
                    handleChangePage={(page) => handleNextPage({ page })}
                />
            </div>
        </div>
    );
};

export default ListTeamsTemplate;
