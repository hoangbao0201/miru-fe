"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Fragment, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "sonner";

import classNames from "@/utils/classNames";
import convertTime from "@/utils/convertTime";
import IconTrash from "@/components/Modules/Icons/IconTrash";
import { IMetaPage } from "@/common/data.types";
import { NavButtonPagination } from "@/components/Share/NavButtonPagination";
import chapterService from "@/services/chapter.services";

interface PageOptions {
    q?: string;
    page?: number;
    take?: number;
    isDelete?: boolean;
    bookId?: number;
}

interface IChapterAdmin {
    bookId: number;
    title: string | null;
    num: string;
    thumbnail: string | null;
    viewsCount: number;
    chapterNumber: number;
    createdAt: Date;
    updatedAt: Date;
    isDelete: boolean;
    book: {
        bookId: number;
        title: string;
        slug: string;
        category: string;
    };
}

const AdminChaptersTemplate = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const { data: session, status } = useSession();

    const [isLoading, setIsLoading] = useState(true);
    const [metaPage, setMetaPage] = useState<null | IMetaPage>(null);
    const [dataChapters, setDataChapters] = useState<
        IChapterAdmin[] | null
    >(null);
    const [filterIsDelete, setFilterIsDelete] = useState<boolean | undefined>(
        searchParams.get("isDelete") === "true"
            ? true
            : searchParams.get("isDelete") === "false"
            ? false
            : undefined
    );

    const eventGetDataChapters = async () => {
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
            // isDelete
            if (filterIsDelete !== undefined) {
                params.append("isDelete", filterIsDelete.toString());
            }
            // bookId
            const bookId = searchParams.get("bookId");
            if (bookId) {
                params.append("bookId", bookId.toString());
            }

            // REQUEST
            setIsLoading(true);
            const dataChaptersRes = await chapterService.findAllChaptersAdmin({
                query: `?${params.toString()}`,
                token: session?.backendTokens.accessToken,
            });

            if (dataChaptersRes?.success) {
                setMetaPage(dataChaptersRes?.meta);
                setDataChapters(dataChaptersRes?.result);
            }
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    };

    const handleRestoreChapter = async (
        bookId: number,
        chapterNumber: number
    ) => {
        if (status !== "authenticated" || !session?.backendTokens.accessToken) {
            return;
        }

        if (!confirm("Bạn có chắc chắn muốn khôi phục chương này?")) {
            return;
        }

        try {
            setIsLoading(true);
            const restoreRes = await chapterService.restoreChapterAdmin({
                token: session.backendTokens.accessToken,
                bookId,
                chapterNumber,
            });

            if (restoreRes?.success) {
                toast("Khôi phục chương thành công!", {
                    duration: 2000,
                    position: "bottom-center",
                });
                await eventGetDataChapters();
            } else {
                toast("Khôi phục chương thất bại!", {
                    duration: 2000,
                    position: "bottom-center",
                });
            }
        } catch (error) {
            toast("Có lỗi xảy ra khi khôi phục chương!", {
                duration: 2000,
                position: "bottom-center",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleHardDeleteChapter = async (
        bookId: number,
        chapterNumber: number
    ) => {
        if (status !== "authenticated" || !session?.backendTokens.accessToken) {
            return;
        }

        if (
            !confirm(
                "Bạn có chắc chắn muốn xóa vĩnh viễn chương này? Hành động này không thể hoàn tác!"
            )
        ) {
            return;
        }

        try {
            setIsLoading(true);
            const deleteRes = await chapterService.hardDeleteChapterAdmin({
                token: session.backendTokens.accessToken,
                bookId,
                chapterNumber,
            });

            if (deleteRes?.success) {
                toast("Xóa chương thành công!", {
                    duration: 2000,
                    position: "bottom-center",
                });
                await eventGetDataChapters();
            } else {
                toast("Xóa chương thất bại!", {
                    duration: 2000,
                    position: "bottom-center",
                });
            }
        } catch (error) {
            toast("Có lỗi xảy ra khi xóa chương!", {
                duration: 2000,
                position: "bottom-center",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Change Page
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
            if (q === "") {
                params.append("q", q.toString().trim());
            } else {
                params.append("q", q.toString().trim());
            }
        } else {
            const q2 = searchParams.get("q");
            if (q2) {
                params.append("q", q2.toString().trim());
            }
        }
        // isDelete
        if (filterIsDelete !== undefined) {
            params.append("isDelete", filterIsDelete.toString());
        }
        // bookId
        const bookId = query?.bookId || searchParams.get("bookId");
        if (bookId) {
            params.append("bookId", bookId.toString());
        }

        router.replace(`?${params}`);
    };

    const handleChangePage = (page: number) => {
        handleNextPage({ page });
    };

    const handleFilterChange = (isDelete: boolean | undefined) => {
        setFilterIsDelete(isDelete);
        const params = new URLSearchParams({
            take: "30",
        });
        if (isDelete !== undefined) {
            params.append("isDelete", isDelete.toString());
        }
        const page = searchParams.get("page");
        if (page) {
            params.append("page", page.toString());
        }
        const q = searchParams.get("q");
        if (q) {
            params.append("q", q.toString().trim());
        }
        const bookId = searchParams.get("bookId");
        if (bookId) {
            params.append("bookId", bookId.toString());
        }
        router.replace(`?${params}`);
    };

    useEffect(() => {
        eventGetDataChapters();
    }, [status, searchParams, filterIsDelete]);

    return (
        <div>
            <div className="bg-accent px-3 py-4">
                <div className="">
                    <div className="mb-4">
                        <h1 className="text-lg font-semibold uppercase mb-4">
                            Quản lý chương truyện
                        </h1>
                    </div>

                    {/* Filter */}
                    <div className="mb-4 pb-5 border-b border-slate-700">
                        <div className="flex gap-2 items-center">
                            <span className="text-sm font-medium">Lọc:</span>
                            <button
                                onClick={() => handleFilterChange(undefined)}
                                className={classNames(
                                    "px-3 py-1 rounded-md text-sm",
                                    filterIsDelete === undefined
                                        ? "bg-blue-500 text-white"
                                        : "bg-slate-600 hover:bg-slate-500"
                                )}
                            >
                                Tất cả
                            </button>
                            <button
                                onClick={() => handleFilterChange(false)}
                                className={classNames(
                                    "px-3 py-1 rounded-md text-sm",
                                    filterIsDelete === false
                                        ? "bg-blue-500 text-white"
                                        : "bg-slate-600 hover:bg-slate-500"
                                )}
                            >
                                Chưa xóa
                            </button>
                            <button
                                onClick={() => handleFilterChange(true)}
                                className={classNames(
                                    "px-3 py-1 rounded-md text-sm",
                                    filterIsDelete === true
                                        ? "bg-blue-500 text-white"
                                        : "bg-slate-600 hover:bg-slate-500"
                                )}
                            >
                                Đã xóa
                            </button>
                        </div>
                    </div>

                    <div className="">
                        {status === "authenticated" ? (
                            <>
                                {!isLoading && dataChapters ? (
                                    <>
                                        <div className="space-y-1 mb-1">
                                            {dataChapters?.map((chapter) => {
                                                return (
                                                    <Fragment
                                                        key={
                                                            chapter?.bookId +
                                                            "-" +
                                                            chapter?.chapterNumber
                                                        }
                                                    >
                                                        <div
                                                            className={classNames(
                                                                "px-3 py-2 mt-1 rounded-md",
                                                                chapter?.isDelete
                                                                    ? "bg-red-900/30 border border-red-700"
                                                                    : "bg-slate-700"
                                                            )}
                                                        >
                                                            <div className="flex items-center space-x-2 mb-2">
                                                                <Link
                                                                    title=""
                                                                    target="_blank"
                                                                    prefetch={false}
                                                                    className="uppercase font-semibold hover:underline"
                                                                    href={`/${chapter?.book?.category}/books/${chapter?.bookId}/chapter-${chapter?.num}-${chapter?.chapterNumber}`}
                                                                >
                                                                    CHAP: {chapter?.num}
                                                                </Link>
                                                                {chapter?.isDelete && (
                                                                    <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded">
                                                                        Đã xóa
                                                                    </span>
                                                                )}
                                                                <div className="px-1 uppercase leading-6 text-xs">
                                                                    {convertTime(
                                                                        new Date(
                                                                            chapter?.updatedAt
                                                                        )
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="mb-2">
                                                                <div className="text-sm text-gray-300">
                                                                    <span className="font-medium">
                                                                        Truyện:
                                                                    </span>{" "}
                                                                    {chapter?.book?.title}
                                                                </div>
                                                                {chapter?.title && (
                                                                    <div className="text-sm text-gray-300">
                                                                        <span className="font-medium">
                                                                            Tiêu đề:
                                                                        </span>{" "}
                                                                        {chapter?.title}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="flex space-x-2">
                                                                {chapter?.isDelete ? (
                                                                    <>
                                                                        <button
                                                                            title=""
                                                                            className="px-2 h-9 flex-1 leading-9 flex item-center space-x-2 bg-green-600 hover:bg-green-500/50 rounded-lg border border-green-500 border-dashed"
                                                                            onClick={() =>
                                                                                handleRestoreChapter(
                                                                                    chapter?.bookId,
                                                                                    chapter?.chapterNumber
                                                                                )
                                                                            }
                                                                            disabled={isLoading}
                                                                        >
                                                                            <span className="">
                                                                                Khôi phục
                                                                            </span>
                                                                        </button>
                                                                        <button
                                                                            title=""
                                                                            className="px-2 h-9 flex-1 leading-9 flex item-center space-x-2 bg-red-600 hover:bg-red-500/50 rounded-lg border border-red-500 border-dashed"
                                                                            onClick={() =>
                                                                                handleHardDeleteChapter(
                                                                                    chapter?.bookId,
                                                                                    chapter?.chapterNumber
                                                                                )
                                                                            }
                                                                            disabled={isLoading}
                                                                        >
                                                                            <IconTrash className="w-9 h-9 fill-white py-2" />
                                                                            <span className="">
                                                                                Xóa vĩnh viễn
                                                                            </span>
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <div className="text-sm text-gray-400">
                                                                        Chương chưa bị xóa
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Fragment>
                                                );
                                            })}
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-1">
                                        {Array.from({ length: 10 }).map(
                                            (_, i) => {
                                                return (
                                                    <div
                                                        key={i}
                                                        className="animate-pulse h-[100px] mt-1 bg-slate-700 rounded-md"
                                                    ></div>
                                                );
                                            }
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>

                    <div className="bg-slate-700/20 px-3 py-2 rounded-md mt-3">
                        {metaPage && (
                            <NavButtonPagination
                                countPage={metaPage?.pageCount}
                                handleChangePage={handleChangePage}
                                currentPage={metaPage?.currentPage}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminChaptersTemplate;

