"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import historyService, {
    GetHistoryChapterProps,
} from "@/services/history.services";
import convertTime from "@/utils/convertTime";
import { Env } from "@/config/Env";
import { ContentPageEnum } from "@/common/data.types";
import SkeletonListTable from "../../Skeleton/SkeletonListTable";
import { NavButtonPagination } from "@/components/Share/NavButtonPagination";
import LoadingChangePage from "@/components/Share/Loading/LoadingChangePage";

const { NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO } = Env

interface UserHistoryTemplateProps {
    content: ContentPageEnum;
}
const UserHistoryTemplate = ({ content = ContentPageEnum.comics }: UserHistoryTemplateProps) => {
    const { data: session, status } = useSession();

    const [dataHistoryUser, setDataHistoryUser] = useState<{
        history: GetHistoryChapterProps[];
        total_page: number;
    } | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const handleGetDataUserHistory = async (page?: number) => {
        if (status !== "authenticated") {
            return;
        }
        try {
            const querys = new URLSearchParams({
                take: "24",
                page: String(Number(page) || 1),
                ...(content && {
                    category: content,
                }),
            });
            const {
                history,
                total_page,
            }: { history: GetHistoryChapterProps[]; total_page: number } =
                await historyService.getHistoryUser({
                    cache: "no-store",
                    query: `?${querys.toString()}`,
                    token: session?.backendTokens.accessToken,
                });
            if (history?.length > 0) {
                setDataHistoryUser({
                    history: history,
                    total_page: total_page,
                });
            } else {
                setDataHistoryUser({ history: [], total_page: 1 });
            }
            setIsLoadingPage(false);
            window.scrollTo({ top: 0 });
        } catch (error) {
            setIsLoadingPage(false);
            window.scrollTo({ top: 0 });
        }
    };

    const handleChangePage = (page: number) => {
        setIsLoadingPage(true);
        setPageNumber(page);
        handleGetDataUserHistory(page);
    };

    useEffect(() => {
        handleGetDataUserHistory();
    }, [status]);

    return (
        <div>
            <h1 title="LỊCH SỬ ĐỌC TRUYỆN" className="postname">
                LỊCH SỬ ĐỌC TRUYỆN
            </h1>
            <div className="mb-1">
                <div className="px-3 py-2 mb-2 bg-[#dff0d8] border border-[#d6e9c6] text-[#3c763d]">
                    Truyện mới đọc gần đây sẽ hiển thị ở đầu danh sách.
                </div>
                <div className="min-h-[500px]">
                    {status === "authenticated" ? (
                        <div className="">
                            <div className="overflow-x-auto border border-accent-10 mb-4">
                                <table className="min-w-[550px] table-auto">
                                    <thead className="bg-accent-10">
                                        <tr className="uppercase">
                                            <th className="whitespace-nowrap px-2 py-2 w-full text-center">
                                                Truyện
                                            </th>
                                            <th className="whitespace-nowrap px-2 py-2 w-full text-left">
                                                Xem gần nhất
                                            </th>
                                            <th className="whitespace-nowrap px-2 py-2 w-full text-left">
                                                Chap mới nhất
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y border-accent-10">
                                        {dataHistoryUser ? (
                                            dataHistoryUser?.history?.length >
                                            0 ? (
                                                dataHistoryUser?.history?.map(
                                                    (str, index) => (
                                                        <tr
                                                            key={`${str?.book?.bookId}`}
                                                            className=""
                                                        >
                                                            <td className="px-2 py-2 flex">
                                                                <Image
                                                                    unoptimized
                                                                    alt=""
                                                                    width={60}
                                                                    height={60}
                                                                    className="w-[50px] h-[70px]"
                                                                    src={
                                                                        str?.book?.covers?.[0]?.url ?? "/static/images/image-book-not-found.jpg"
                                                                    }
                                                                />
                                                                <div className="pl-3">
                                                                    <Link
                                                                        prefetch={
                                                                            false
                                                                        }
                                                                        title={
                                                                            str
                                                                                ?.book
                                                                                .title
                                                                        }
                                                                        href={`/books/${str?.book.slug}-${str?.book.bookId}`}
                                                                        className="font-semibold hover:underline line-clamp-3"
                                                                    >
                                                                        {
                                                                            str
                                                                                ?.book
                                                                                ?.title
                                                                        }
                                                                    </Link>
                                                                </div>
                                                            </td>
                                                            <td className="px-2 py-2 italic text-sm align-top">
                                                                <Link
                                                                    prefetch={
                                                                        false
                                                                    }
                                                                    href={`/books/${str?.book.slug}-${str?.book.bookId}/chapter-${str?.chapterRead?.num}-${str?.chapterRead?.chapterNumber}`}
                                                                    title=""
                                                                    className="hover:underline text-blue-600 py-1"
                                                                >
                                                                    Chapter{" "}
                                                                    {
                                                                        str
                                                                            ?.chapterRead
                                                                            ?.num
                                                                    }
                                                                </Link>
                                                                <p className="mt-2">
                                                                    {convertTime(
                                                                        str
                                                                            ?.chapterRead
                                                                            ?.updatedAt
                                                                    )}
                                                                </p>
                                                            </td>
                                                            <td className="px-2 py-2 italic text-sm align-top">
                                                                <Link
                                                                    prefetch={
                                                                        false
                                                                    }
                                                                    href={`/books/${str?.book.slug}-${str?.book.bookId}/chapter-${str?.chapterLatest?.num}-${str?.chapterLatest?.chapterNumber}`}
                                                                    title=""
                                                                    className="hover:underline text-blue-600 py-1"
                                                                >
                                                                    Chapter{" "}
                                                                    {
                                                                        str
                                                                            ?.chapterLatest
                                                                            ?.num
                                                                    }
                                                                </Link>
                                                                <p className="mt-2">
                                                                    {convertTime(
                                                                        str
                                                                            ?.chapterLatest
                                                                            ?.createdAt
                                                                    )}
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    )
                                                )
                                            ) : (
                                                <tr>
                                                    <td colSpan={3} className="px-3 py-3 text-center col-span-full">
                                                        Bạn chưa đọc truyện nào!
                                                    </td>
                                                </tr>
                                            )
                                        ) : (
                                            <SkeletonListTable
                                                col={3}
                                                count={10}
                                            />
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {dataHistoryUser && (
                                <div>
                                    <NavButtonPagination
                                        currentPage={pageNumber}
                                        handleChangePage={handleChangePage}
                                        countPage={
                                            dataHistoryUser?.total_page
                                        }
                                    />
                                    {isLoadingPage && <LoadingChangePage />}
                                </div>
                            )}
                        </div>
                    ) : status === "unauthenticated" ? (
                        <p className="-2">
                            Bạn chưa{" "}
                            <Link
                                prefetch={false}
                                title="Đăng nhập"
                                href={`/auth/login`}
                                className="text-[#1d9bf0] font-semibold"
                            >
                                đăng nhập
                            </Link>
                        </p>
                    ) : (
                        <div>Loading...</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserHistoryTemplate;
