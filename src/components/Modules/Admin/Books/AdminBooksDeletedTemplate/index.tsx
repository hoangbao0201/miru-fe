"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { toast } from "sonner";

import adminService, {
    AdminBookItem,
    AdminBooksResponse,
} from "@/services/admin.services";
import { IMetaPage } from "@/common/data.types";
import { NavButtonPagination } from "@/components/Share/NavButtonPagination";
import classNames from "@/utils/classNames";
import convertTime from "@/utils/convertTime";
import IconTrash from "@/components/Modules/Icons/IconTrash";

interface PageOptions {
    page?: number;
    q?: string;
    take?: number;
    isDelete?: boolean;
}

const AdminBooksDeletedTemplate = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session, status } = useSession();

    const [isLoading, setIsLoading] = useState(true);
    const [metaPage, setMetaPage] = useState<IMetaPage | null>(null);
    const [dataBooks, setDataBooks] = useState<AdminBookItem[] | null>(null);
    const [filterIsDelete, setFilterIsDelete] = useState<boolean | undefined>(
        searchParams.get("isDelete") === "true"
            ? true
            : searchParams.get("isDelete") === "false"
            ? false
            : true
    );

    const buildQuery = (opts: PageOptions) => {
        const params = new URLSearchParams({
            take: "30",
        });
        const page = opts.page || searchParams.get("page");
        if (page) {
            params.append("page", page.toString());
        }
        const q = opts.q;
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
        const isDeleteValue =
            typeof opts.isDelete === "boolean"
                ? opts.isDelete
                : filterIsDelete ?? true;
        if (typeof isDeleteValue === "boolean") {
            params.append("isDelete", isDeleteValue.toString());
        }
        return params;
    };

    const eventGetDataBooks = async () => {
        if (status !== "authenticated") {
            return;
        }
        try {
            const params = buildQuery({});

            setIsLoading(true);
            const booksRes: AdminBooksResponse =
                await adminService.getListBooksAdmin({
                    query: `?${params.toString()}`,
                    token: session?.backendTokens.accessToken,
                });

            if (booksRes?.success) {
                setMetaPage(booksRes.meta);
                setDataBooks(booksRes.result);
            }
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    };

    const handleRestoreBook = async (bookId: number) => {
        if (
            status !== "authenticated" ||
            !session?.backendTokens.accessToken
        ) {
            return;
        }

        if (!confirm("Bạn có chắc chắn muốn khôi phục truyện này?")) {
            return;
        }

        try {
            setIsLoading(true);
            const res = await adminService.restoreBookAdmin({
                bookId,
                token: session.backendTokens.accessToken,
            });

            if (res?.success) {
                toast("Khôi phục truyện thành công!", {
                    duration: 2000,
                    position: "bottom-center",
                });
                await eventGetDataBooks();
            } else {
                toast("Khôi phục truyện thất bại!", {
                    duration: 2000,
                    position: "bottom-center",
                });
            }
        } catch (error) {
            toast("Có lỗi xảy ra khi khôi phục truyện!", {
                duration: 2000,
                position: "bottom-center",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleHardDeleteBook = async (bookId: number) => {
        if (
            status !== "authenticated" ||
            !session?.backendTokens.accessToken
        ) {
            return;
        }

        if (
            !confirm(
                "Bạn có chắc chắn muốn xóa vĩnh viễn truyện này? Hành động này không thể hoàn tác!"
            )
        ) {
            return;
        }

        try {
            setIsLoading(true);
            const res = await adminService.hardDeleteBookAdmin({
                bookId,
                token: session.backendTokens.accessToken,
            });

            if (res?.success) {
                toast("Xóa truyện thành công!", {
                    duration: 2000,
                    position: "bottom-center",
                });
                await eventGetDataBooks();
            } else {
                toast("Xóa truyện thất bại!", {
                    duration: 2000,
                    position: "bottom-center",
                });
            }
        } catch (error) {
            toast("Có lỗi xảy ra khi xóa truyện!", {
                duration: 2000,
                position: "bottom-center",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleNextPage = (query: PageOptions) => {
        if (isLoading) return;
        const params = buildQuery(query);
        router.replace(`?${params}`);
    };

    const handleChangePage = (page: number) => {
        handleNextPage({ page });
    };

    const handleFilterChange = (isDelete: boolean | undefined) => {
        setFilterIsDelete(isDelete);
        const params = buildQuery({ isDelete });
        router.replace(`?${params}`);
    };

    useEffect(() => {
        eventGetDataBooks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, searchParams, filterIsDelete]);

    return (
        <div>
            <div className="bg-accent px-3 py-4">
                <div className="mb-4">
                    <h1 className="text-lg font-semibold uppercase mb-4">
                        Danh sách truyện (soft delete)
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
                            {!isLoading && dataBooks ? (
                                <div className="space-y-1 mb-1">
                                    {dataBooks.map((book) => (
                                        <Fragment key={book.bookId}>
                                            <div
                                                className={classNames(
                                                    "px-3 py-2 mt-1 rounded-md flex gap-3",
                                                    book.isDelete
                                                        ? "bg-red-900/30 border border-red-700"
                                                        : "bg-slate-700"
                                                )}
                                            >
                                                <div className="w-[60px] h-[80px] flex-shrink-0">
                                                    <Image
                                                        alt=""
                                                        width={60}
                                                        height={80}
                                                        unoptimized
                                                        loading="lazy"
                                                        className="w-[60px] h-[80px] border object-cover"
                                                        src={
                                                            book.covers?.[0]
                                                                ?.url ??
                                                            "/static/images/image-book-not-found.jpg"
                                                        }
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <span className="uppercase font-semibold">
                                                            {book.title}
                                                        </span>
                                                        {book.isDelete && (
                                                            <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded">
                                                                Đã xóa
                                                            </span>
                                                        )}
                                                        <div className="px-1 uppercase leading-6 text-xs">
                                                            {convertTime(
                                                                new Date(
                                                                    book.updatedAt
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="mb-2 text-sm text-gray-300">
                                                        <span className="font-medium">
                                                            Thể loại:
                                                        </span>{" "}
                                                        {book.category}
                                                    </div>

                                                    <div className="flex space-x-2">
                                                        {book.isDelete ? (
                                                            <>
                                                                <button
                                                                    title=""
                                                                    className="px-2 h-9 flex-1 leading-9 flex item-center space-x-2 bg-green-600 hover:bg-green-500/50 rounded-lg border border-green-500 border-dashed"
                                                                    onClick={() =>
                                                                        handleRestoreBook(
                                                                            book.bookId
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        isLoading
                                                                    }
                                                                >
                                                                    <span>
                                                                        Khôi
                                                                        phục
                                                                    </span>
                                                                </button>
                                                                <button
                                                                    title=""
                                                                    className="px-2 h-9 flex-1 leading-9 flex item-center space-x-2 bg-red-600 hover:bg-red-500/50 rounded-lg border border-red-500 border-dashed"
                                                                    onClick={() =>
                                                                        handleHardDeleteBook(
                                                                            book.bookId
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        isLoading
                                                                    }
                                                                >
                                                                    <IconTrash className="w-9 h-9 fill-white py-2" />
                                                                    <span>
                                                                        Xóa
                                                                        vĩnh
                                                                        viễn
                                                                    </span>
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <div className="text-sm text-gray-400">
                                                                Truyện chưa bị
                                                                xóa
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Fragment>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {Array.from({ length: 10 }).map(
                                        (_, i) => (
                                            <div
                                                key={i}
                                                className="animate-pulse h-[100px] mt-1 bg-slate-700 rounded-md"
                                            ></div>
                                        )
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
                            countPage={metaPage.pageCount}
                            handleChangePage={handleChangePage}
                            currentPage={metaPage.currentPage}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminBooksDeletedTemplate;


