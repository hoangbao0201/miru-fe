"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

import { Env } from "@/config/Env";
import ShowToast from "@/utils/ShowToast";
import { ContentPageEnum } from "@/common/data.types";
import {
    confirmJoinContributorBookApi,
    confirmRejectContributorBookApi,
    getPendingInvitationsBookContributorApi,
} from "@/store/book/book.api";
import { DataPendingInvitationsBookContributorType } from "@/store/book/book.type";
import {
    confirmJoinTeamApi,
    getPendingInvitationsTeamApi,
    rejectJoinTeamApi,
} from "@/store/team/team.api";
import { DataPendingInvitationsTeamType } from "@/store/team/team.type";

interface CreatorNotificationsTemplateProps {
    meta: {
        content: ContentPageEnum;
    };
}
const CreatorNotificationsTemplate = ({
    meta,
}: CreatorNotificationsTemplateProps) => {
    const [dataPendingInvitations, setDataPendingInvitations] =
        useState<DataPendingInvitationsBookContributorType[]>();
    const [dataPendingTeamInvitations, setDataPendingTeamInvitations] =
        useState<DataPendingInvitationsTeamType[]>();

    const handleActionJoinBook = async (
        bookId: number,
        action: "confirm" | "reject"
    ) => {
        try {
            if (action === "confirm") {
                const actionRes = await confirmJoinContributorBookApi({
                    bookId,
                });
                if (actionRes?.success) {
                    ShowToast.success(`Xác nhận thành công`, {
                        duration: 3000,
                    });
                    setDataPendingInvitations((state) =>
                        state
                            ? state?.filter(
                                  (invite) => invite?.book?.bookId !== bookId
                              )
                            : state
                    );
                }
            } else if (action === "reject") {
                const actionRes = await confirmRejectContributorBookApi({
                    bookId,
                });
                if (actionRes?.success) {
                    ShowToast.success(`Từ chối thành công`, {
                        duration: 3000,
                    });
                    setDataPendingInvitations((state) =>
                        state
                            ? state?.filter(
                                  (invite) => invite?.book?.bookId !== bookId
                              )
                            : state
                    );
                }
            }
        } catch (error) {
            ShowToast.error(
                `${action === "confirm" ? "Xác nhận" : "Từ chối"} thất bại`,
                {
                    duration: 3000,
                }
            );
        } finally {
        }
    };

    const handleActionJoinTeam = async (
        teamId: number,
        action: "confirm" | "reject"
    ) => {
        try {
            if (action === "confirm") {
                const actionRes = await confirmJoinTeamApi({
                    teamId,
                });
                if (actionRes?.success) {
                    ShowToast.success(`Xác nhận tham gia nhóm thành công`, {
                        duration: 3000,
                    });
                    setDataPendingTeamInvitations((state) =>
                        state
                            ? state?.filter(
                                  (invite) => invite?.team?.teamId !== teamId
                              )
                            : state
                    );
                }
            } else if (action === "reject") {
                const actionRes = await rejectJoinTeamApi({
                    teamId,
                });
                if (actionRes?.success) {
                    ShowToast.success(`Từ chối tham gia nhóm thành công`, {
                        duration: 3000,
                    });
                    setDataPendingTeamInvitations((state) =>
                        state
                            ? state?.filter(
                                  (invite) => invite?.team?.teamId !== teamId
                              )
                            : state
                    );
                }
            }
        } catch (error) {
            ShowToast.error(
                `${action === "confirm" ? "Xác nhận" : "Từ chối"} tham gia nhóm thất bại`,
                {
                    duration: 3000,
                }
            );
        } finally {
        }
    };

    const getDataPendingInvitations = async () => {
        try {
            const getPendingInvitations =
                await getPendingInvitationsBookContributorApi();
            if (getPendingInvitations?.success) {
                setDataPendingInvitations(getPendingInvitations?.data);
            }
        } catch (error) {}
    };

    const getDataPendingTeamInvitations = async () => {
        try {
            const getPendingTeamInvitations =
                await getPendingInvitationsTeamApi();
            if (getPendingTeamInvitations?.success) {
                setDataPendingTeamInvitations(getPendingTeamInvitations?.data);
            }
        } catch (error) {}
    };

    useEffect(() => {
        getDataPendingInvitations();
        getDataPendingTeamInvitations();
    }, []);

    const hasBookInvitations = dataPendingInvitations && dataPendingInvitations.length > 0;
    const hasTeamInvitations = dataPendingTeamInvitations && dataPendingTeamInvitations.length > 0;
    const hasAnyInvitations = hasBookInvitations || hasTeamInvitations;

    return (
        <div className="bg-accent p-3">
            <div className="text-sm text-center font-semibold px-2 py-1 mb-2 text-blue-200 bg-blue-600">
                LỜI MỜI
            </div>
            <div className="divide-y-[1px] divide-gray-700 bg-slate-800">
                {/* Team Invitations */}
                {hasTeamInvitations && (
                    <div className="mb-5">
                        <div className="overflow-x-auto relative border border-gray-300">
                            <table className="table-fixed min-w-[1000px] w-full">
                                <colgroup>
                                    <col style={{ width: "40%" }} />
                                    <col style={{ width: "40%" }} />
                                    <col style={{ width: "20%" }} />
                                </colgroup>
                                <thead className="text-gray-600 bg-gray-100">
                                    <tr className="whitespace-nowrap uppercase [&>th]:px-2 [&>th]:py-2 [&>th]:font-semibold">
                                        <th className="min-w-[560px]">Nhóm</th>
                                        <th>Thông tin</th>
                                        <th className="">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-sm">
                                    {dataPendingTeamInvitations?.map((invitation) => {
                                        const coverUrl = invitation?.team?.covers?.[0]?.url;
                                        return (
                                            <tr
                                                key={invitation?.team.teamId}
                                                className="[&>td]:px-2 [&>td]:py-2 divide-x"
                                            >
                                                <td>
                                                    <div className="flex">
                                                        <div className="w-[60px] h-[60px] flex-shrink-0 mr-2">
                                                            <Image
                                                                alt=""
                                                                width={60}
                                                                height={60}
                                                                unoptimized
                                                                loading="lazy"
                                                                className={`w-[60px] h-[60px] rounded-full border object-cover`}
                                                                src={
                                                                    coverUrl
                                                                        ? coverUrl
                                                                        : "/static/images/image-book-not-found.jpg"
                                                                }
                                                            />
                                                        </div>
                                                        <div className="">
                                                            <div className="mb-3 space-x-2 flex items-center relative">
                                                                <strong className="uppercase">
                                                                    <Link
                                                                        href={`/${meta?.content}/teams/${invitation?.team?.teamId}/books`}
                                                                        prefetch={false}
                                                                        target="_blank"
                                                                        className="hover:underline line-clamp-1"
                                                                    >
                                                                        {invitation?.team?.name}
                                                                    </Link>
                                                                </strong>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="">
                                                    <div className="text-sm">
                                                        <div className="text-gray-400">
                                                            Bạn đã được mời tham gia nhóm này
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="flex flex-col items-center space-y-2">
                                                    <button
                                                        onClick={() =>
                                                            handleActionJoinTeam(
                                                                invitation?.team?.teamId,
                                                                "confirm"
                                                            )
                                                        }
                                                        className="text-sm h-8 px-2 py-1 w-full max-w-[120px] whitespace-nowrap border border-transparent rounded-md bg-indigo-600 hover:bg-indigo-700 cursor-pointer flex items-center justify-center space-x-1"
                                                    >
                                                        Xác nhận
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleActionJoinTeam(
                                                                invitation?.team?.teamId,
                                                                "reject"
                                                            )
                                                        }
                                                        className="text-sm h-8 px-2 py-1 w-full max-w-[120px] whitespace-nowrap border border-transparent rounded-md bg-red-600 hover:bg-red-700 cursor-pointer flex items-center justify-center space-x-1"
                                                    >
                                                        Từ chối
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Book Invitations */}
                {hasBookInvitations && (
                    <div>
                        <div className="text-sm font-semibold px-2 py-1 mb-2 text-purple-200 bg-purple-600">
                            LỜI MỜI THAM GIA TRUYỆN
                        </div>
                        <div className="overflow-x-auto relative border border-gray-300 mb-5">
                            <table className="table-fixed min-w-[1000px] w-full">
                                <colgroup>
                                    <col style={{ width: "40%" }} />
                                    <col style={{ width: "40%" }} />
                                    <col style={{ width: "20%" }} />
                                </colgroup>
                                <thead className="text-gray-600 bg-gray-100">
                                    <tr className="whitespace-nowrap uppercase [&>th]:px-2 [&>th]:py-2 [&>th]:font-semibold">
                                        <th className="min-w-[560px]">Truyện</th>
                                        <th>Người mời</th>
                                        <th className="">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-sm">
                                    {dataPendingInvitations.map((invitation) => {
                                        return (
                                            <tr
                                                key={invitation?.book.bookId}
                                                className="[&>td]:px-2 [&>td]:py-2 divide-x"
                                            >
                                                <td>
                                                    <div className="flex">
                                                        <div className="w-[60px] h-[80px] flex-shrink-0 mr-2">
                                                            <Image
                                                                alt=""
                                                                width={60}
                                                                height={80}
                                                                unoptimized
                                                                loading="lazy"
                                                                className={`w-[60px] h-[80px] border object-cover`}
                                                                src={
                                                                    invitation
                                                                        ?.book
                                                                        ?.covers?.[0]
                                                                        ?.url ??
                                                                    "/static/images/image-book-not-found.jpg"
                                                                }
                                                            />
                                                        </div>
                                                        <div className="">
                                                            <div className="mb-3 space-x-2 flex items-center relative">
                                                                <strong className="uppercase">
                                                                    <Link
                                                                        href={`/${meta?.content}/books/${invitation?.book?.bookId}`}
                                                                        prefetch={false}
                                                                        target="_blank"
                                                                        className="hover:underline line-clamp-1"
                                                                    >
                                                                        {
                                                                            invitation
                                                                                ?.book
                                                                                ?.title
                                                                        }
                                                                    </Link>
                                                                </strong>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="">
                                                    <Link
                                                        target="_blank"
                                                        prefetch={false}
                                                        href={`/${meta?.content}/teams/${invitation?.book.slug}`}
                                                        className="flex items-center space-x-2"
                                                    >
                                                        <Image
                                                            alt=""
                                                            width={35}
                                                            height={35}
                                                            unoptimized
                                                            loading="lazy"
                                                            className={`w-[35px] h-[35px] rounded-full border object-cover`}
                                                            src={
                                                                invitation?.book
                                                                    ?.contributors?.[0]
                                                                    ?.user
                                                                    ?.avatarUrl
                                                                    ? Env.NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO +
                                                                      "/" +
                                                                      invitation
                                                                          ?.book
                                                                          ?.contributors?.[0]
                                                                          ?.user
                                                                          ?.avatarUrl
                                                                    : "/static/images/image-book-not-found.jpg"
                                                            }
                                                        />
                                                        <strong className="uppercase text-sm line-clamp-1">
                                                            {
                                                                invitation?.book
                                                                    ?.contributors?.[0]
                                                                    ?.user?.name
                                                            }
                                                        </strong>
                                                    </Link>
                                                </td>
                                                <td className="flex flex-col items-center space-y-2">
                                                    <button
                                                        onClick={() =>
                                                            handleActionJoinBook(
                                                                invitation?.book
                                                                    ?.bookId,
                                                                "confirm"
                                                            )
                                                        }
                                                        className="text-sm h-8 px-2 py-1 w-full max-w-[120px] whitespace-nowrap border border-transparent rounded-md bg-indigo-600 hover:bg-indigo-700 cursor-pointer flex items-center justify-center space-x-1"
                                                    >
                                                        Xác nhận
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleActionJoinBook(
                                                                invitation?.book
                                                                    ?.bookId,
                                                                "reject"
                                                            )
                                                        }
                                                        className="text-sm h-8 px-2 py-1 w-full max-w-[120px] whitespace-nowrap border border-transparent rounded-md bg-red-600 hover:bg-red-700 cursor-pointer flex items-center justify-center space-x-1"
                                                    >
                                                        Từ chối
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* No Invitations */}
                {!hasAnyInvitations && (
                    <div className="text-center py-4 px-3">
                        <div className="text-gray-400">
                            Không có lời mời nào!
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreatorNotificationsTemplate;
