"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import clsx from "clsx";
import axios from "axios";
import { toast } from "sonner";
import { useDebounceValue, useCopyToClipboard } from "usehooks-ts";

import convertTime from "@/utils/convertTime";
import { ContentPageEnum, IMetaPage } from "@/common/data.types";
import { NavButtonPagination } from "@/components/Share/NavButtonPagination";
import SkeletonListTable from "@/components/Modules/Skeleton/SkeletonListTable";
import {
    StorageBookEnum,
    BookStorageStatusEnum,
    getAllBooksCreatorService,
    IGetAllBooksCreatorService,
    toggleFeaturedBookCreatorService,
    toggleAutoUpdateBookCreatorService,
} from "@/services/creator.services";
import { Env } from "@/config/Env";
import { UserRole } from "@/services/user.services";
import ToggleCheck from "@/components/Share/ToggleCheck";
import IconBook from "@/components/Modules/Icons/IconBook";
import SelectOptions from "@/components/Share/SelectOptions";
import IconListUl from "@/components/Modules/Icons/IconListUl";
import IconHourglassStart from "@/components/Modules/Icons/IconHourglassStart";
import { UserBookContributorRole } from "@/store/book/book.type";
import classNames from "@/utils/classNames";
import IconFilePen from "@/components/Modules/Icons/IconFilePen";
import IconTrash from "@/components/Modules/Icons/IconTrash";
import adminService from "@/services/admin.services";
import ConfirmDeleteModal from "@/components/Share/ConfirmDeleteModal";

const { NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO } = Env;

const dataOptionsStorageBook: Record<BookStorageStatusEnum, string> = {
    [BookStorageStatusEnum.BACKUP]: "Bản lưu nháp",
    [BookStorageStatusEnum.WAITING]: "Đang chờ xử lý",
    [BookStorageStatusEnum.ERROR]: "Truyện lỗi",
    [BookStorageStatusEnum.MAIN]: "Truyện công khai",
    [BookStorageStatusEnum.ALL]: "TẤT CẢ",
};

// STORAGE
interface IDataOptionsStorageBook {
    id: number;
    name: StorageBookEnum;
    description: string;
}

const optionsStorageData = Object.values(BookStorageStatusEnum).map(
    (value, index) => ({
        id: index,
        name: value,
    })
);

const optionsStorageIndexData = Object.values(BookStorageStatusEnum).reduce(
    (acc, value, index) => {
        acc[value] = index;
        return acc;
    },
    {} as Record<string, number>
);

interface IListBooks extends IGetAllBooksCreatorService {
    chapterNew?: {
        num: string;
        href: string;
        source: string;
        chapterNumber: number;
    }[];
}

interface PageOptions {
    q?: string;
    page?: number;
    take?: number;
    storage?: BookStorageStatusEnum;
}
interface CreatorListBooksTemplateProps {
    meta: {
        content: ContentPageEnum;
    };
}
const CreatorListBooksTemplate = ({ meta }: CreatorListBooksTemplateProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const { data: session, status } = useSession();

    const [isLoading, setIsLoading] = useState(true);
    const [selectedOptionStorage, setSelectedOptionStorage] =
        useState<IDataOptionsStorageBook | null>(null);
    const [optionStorageIndex, setOptionStorageIndex] = useState(
        optionsStorageIndexData?.[
            searchParams.get("storage") as BookStorageStatusEnum
        ] || optionsStorageIndexData[BookStorageStatusEnum.ALL]
    );
    const [metaPage, setMetaPage] = useState<null | IMetaPage>(null);
    const [isLoadChapterNew, setLoadChapterNew] = useState<null | number>(null);
    const [dataListBooksDefault, setDataListBooksDefault] = useState<
        null | IListBooks[]
    >(null);
    const [isShowConfirmDeleteModal, setIsShowConfirmDeleteModal] =
        useState(false);
    const [bookToDelete, setBookToDelete] = useState<{
        bookId: number;
        title: string;
    } | null>(null);

    const [_, copy] = useCopyToClipboard();
    const [valueSearchDebouce, setValueSearchDebouce] = useDebounceValue(
        searchParams.get("q") || "",
        500
    );

    // Handle Load Latest Chapter
    const handleCheckChapterLatest = async ({
        id,
        title,
    }: {
        id: number;
        title: string;
    }) => {
        if (!dataListBooksDefault) return;
        setLoadChapterNew(id);
        const booksMap = new Map(
            dataListBooksDefault.map((b) => [b.bookId, b])
        );
        axios
            .get(`/api/chapter/new?q=${title}`)
            .then((loadChapterNew) => {
                if (loadChapterNew?.data?.success) {
                    const bookToUpdate = booksMap.get(id);
                    if (bookToUpdate) {
                        bookToUpdate.chapterNew = loadChapterNew.data.result;
                        setDataListBooksDefault(Array.from(booksMap.values()));
                    }
                }
            })
            .catch((error) => {
                console.error("Error fetching chapter:", error);
            })
            .finally(() => {
                setLoadChapterNew(null);
            });
    };

    // Handle Copy
    const handleCopy = (text: string) => {
        copy(text)
            .then(() => {
                toast("Sao chép thành công!", {
                    duration: 700,
                    position: "top-center",
                });
                console.log("Copied!", { text });
            })
            .catch((error) => {
                console.error("Failed to copy!", error);
            });
    };

    const handleToggleBook = async ({
        index,
        bookId,
        action,
        enabled,
    }: {
        index: number;
        bookId: number;
        enabled: boolean;
        action: "auto_update" | "featured";
    }) => {
        if (status !== "authenticated") {
            return;
        }
        if (!dataListBooksDefault) {
            return;
        }
        try {
            setDataListBooksDefault((books) => {
                if (!books) return books;

                const updated = [...books];
                if (updated[index] && updated[index].bookId === bookId) {
                    if (action === "auto_update") {
                        updated[index] = {
                            ...updated[index],
                            isAutoUpdate: enabled,
                        };
                    }
                    if (action === "featured") {
                        updated[index] = {
                            ...updated[index],
                            isFeatured: enabled,
                        };
                    }
                }
                return updated;
            });

            const token = session?.backendTokens.accessToken;
            if (action === "auto_update") {
                await toggleAutoUpdateBookCreatorService({
                    data: { bookId, isAutoUpdate: enabled },
                    token,
                });
            }
            if (action === "featured") {
                await toggleFeaturedBookCreatorService({
                    data: { bookId, isFeatured: enabled },
                    token,
                });
            }
        } catch (error) {}
    };

    const handleOpenDeleteModal = (bookId: number, bookTitle: string) => {
        setBookToDelete({ bookId, title: bookTitle });
        setIsShowConfirmDeleteModal(true);
    };

    const handleSoftDeleteBook = async () => {
        if (status !== "authenticated" || !session?.backendTokens.accessToken || !bookToDelete) {
            return;
        }

        try {
            setIsLoading(true);
            const deleteRes = await adminService.deleteBook({
                bookId: bookToDelete.bookId,
                token: session.backendTokens.accessToken,
            });

            if (deleteRes?.success) {
                toast("Xóa truyện thành công!", {
                    duration: 2000,
                    position: "bottom-center",
                });
                setIsShowConfirmDeleteModal(false);
                setBookToDelete(null);
                await eventGetBooks();
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

    // Event Get Books
    const eventGetBooks = async () => {
        if (status !== "authenticated") {
            return;
        }
        try {
            const params = new URLSearchParams({
                take: "30",
                category: meta.content,
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
            // storage
            const storage = searchParams.get("storage");
            if (storage && storage !== BookStorageStatusEnum.ALL) {
                params.append("storage", storage.toString());
            }

            // REQUEST
            setIsLoading(true);
            const booksRes = await getAllBooksCreatorService({
                query: `?${params.toString()}`,
                token: session?.backendTokens.accessToken,
            });

            if (booksRes?.success) {
                setOptionStorageIndex(
                    optionsStorageIndexData?.[
                        searchParams.get("storage") as BookStorageStatusEnum
                    ] || optionsStorageIndexData[BookStorageStatusEnum.ALL]
                );
                setMetaPage(booksRes?.meta);
                setDataListBooksDefault(booksRes?.result);
            }
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Change
    const handleNextPage = (query: PageOptions) => {
        if (isLoading) return;

        const params = new URLSearchParams({
            take: "30",
            category: meta.content,
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

        // storage
        const storage = query?.storage || searchParams.get("storage");
        if (storage && storage !== BookStorageStatusEnum.ALL) {
            params.append("storage", storage.toString());
        }

        router.replace(`?${params}`);
    };

    const handleChangePage = (page: number) => {
        handleNextPage({ page });
    };

    const handleChangeStorage = (index: number) => {
        handleNextPage({
            storage: optionsStorageData[index].name as BookStorageStatusEnum,
            page: 1,
        });
    };

    useEffect(() => {
        eventGetBooks();
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
                    {/* MÔ TẢ */}
                    <div className="mb-5">
                        <h4 className="mb-3 text-lg font-semibold">
                            Chú thích các trạng thái thư mục lưu trữ truyện:
                        </h4>
                        <div className="overflow-x-auto">
                            <table className="min-w-[830px] w-full border border-gray-300 text-sm">
                                <thead>
                                    <tr className="text-black bg-gray-100 text-left">
                                        <th className="p-2 border-b border-gray-300">
                                            Trạng thái
                                        </th>
                                        <th className="p-2 border-b border-gray-300">
                                            Mô tả
                                        </th>
                                        <th className="p-2 border-b border-gray-300 text-center">
                                            Độc giả có thể đọc
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="p-2 border-b">
                                            <span className="bg-green-600 text-white px-2 py-1 text-xs font-semibold rounded-sm">
                                                MAIN
                                            </span>
                                        </td>
                                        <td className="p-2 border-b">
                                            Truyện công khai
                                        </td>
                                        <td className="p-2 border-b text-center text-green-600 font-bold">
                                            ✔
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="p-2 border-b">
                                            <span className="bg-red-600 text-white px-2 py-1 text-xs font-semibold rounded-sm">
                                                ERROR
                                            </span>
                                        </td>
                                        <td className="p-2 border-b">
                                            Truyện lỗi
                                        </td>
                                        <td className="p-2 border-b text-center text-red-600 font-bold">
                                            ✘
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="p-2 border-b">
                                            <span className="bg-yellow-600 text-white px-2 py-1 text-xs font-semibold rounded-sm">
                                                BACKUP
                                            </span>
                                        </td>
                                        <td className="p-2 border-b">
                                            Bản lưu nháp
                                        </td>
                                        <td className="p-2 border-b text-center text-red-600 font-bold">
                                            ✘
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="p-2">
                                            <span className="bg-blue-600 text-white px-2 py-1 text-xs font-semibold rounded-sm">
                                                WAITING
                                            </span>
                                        </td>
                                        <td className="p-2">Đang chờ xử lý</td>
                                        <td className="p-2 text-center text-red-600 font-bold">
                                            ✘
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* DANH SÁCH TRUYỆN */}
                    <h2 className="font-semibold text-lg mb-4 border-l-4 px-3">
                        Danh sách truyện
                    </h2>
                    <div className="mb-4 relative">
                        <input
                            defaultValue={searchParams.get("q") || ""}
                            onChange={(e) =>
                                setValueSearchDebouce(e.target.value)
                            }
                            placeholder="Tìm kiếm..."
                            className="h-10 px-4 rounded-md w-full"
                        />
                    </div>

                    <div className="mb-4">
                        <SelectOptions
                            options={optionsStorageData}
                            value={optionsStorageData[optionStorageIndex]}
                            handleOnchange={(dt) => handleChangeStorage(dt.id)}
                        />
                    </div>

                    <div className="overflow-x-auto relative border border-gray-300 mb-5">
                        <table className="table-fixed min-w-[1000px] w-full">
                            <colgroup>
                                <col style={{ width: "5%" }} />
                                <col style={{ width: "35%" }} />
                                <col style={{ width: "35%" }} />
                                <col style={{ width: "25%" }} />
                            </colgroup>
                            <thead className="text-gray-600 bg-gray-100">
                                <tr className="whitespace-nowrap uppercase [&>th]:px-2 [&>th]:py-2 [&>th]:font-semibold">
                                    <th className="">Id</th>
                                    <th className="min-w-[560px]">Truyện</th>
                                    <th>Thành viên</th>
                                    <th className="">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-sm">
                                {status === "authenticated" && !isLoading ? (
                                    dataListBooksDefault?.map((book, index) => {
                                        return (
                                            <tr
                                                key={book?.bookId}
                                                className="[&>td]:px-2 [&>td]:py-2 divide-x align-top"
                                            >
                                                {/* ID */}
                                                <td className="text-center align-middle">
                                                    {book?.bookId}
                                                </td>

                                                {/* INFO BOOK */}
                                                <td className="">
                                                    <div className="mb-3">
                                                        {book?.chapters[0]
                                                            ?.source && (
                                                            <div className="mb-3 text-xs text-center text-white bg-slate-700 uppercase font-semibold rounded-sm px-2 py-1">
                                                                {
                                                                    book
                                                                        ?.chapters[0]
                                                                        ?.source
                                                                }
                                                            </div>
                                                        )}
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
                                                                        book?.covers?.[0]?.url ?? "/static/images/image-book-not-found.jpg"
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="">
                                                                <div className="mb-2 space-x-2 flex items-center relative">
                                                                    <strong className="uppercase">
                                                                        <Link
                                                                            href={`/${meta?.content}/books/${book?.bookId}`}
                                                                            prefetch={
                                                                                false
                                                                            }
                                                                            target="_blank"
                                                                            className="hover:underline line-clamp-2"
                                                                        >
                                                                            {
                                                                                book?.title
                                                                            }
                                                                        </Link>
                                                                    </strong>
                                                                    <button
                                                                        className="hover:underline py-[1px] px-[2px]"
                                                                        onClick={() =>
                                                                            handleCopy(
                                                                                book?.title.trim()
                                                                            )
                                                                        }
                                                                    >
                                                                        copy
                                                                    </button>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <div className="font-semibold">
                                                                        {book
                                                                            ?.chapters
                                                                            ?.length >
                                                                        0
                                                                            ? `Chương mới nhất: ${
                                                                                  book
                                                                                      ?.chapters[0]
                                                                                      ?.num ||
                                                                                  0
                                                                              }`
                                                                            : "Chưa có chương nào!"}
                                                                    </div>

                                                                    <div className="">
                                                                        Cập
                                                                        nhật:{" "}
                                                                        {convertTime(
                                                                            book?.newChapterAt
                                                                        ) || 0}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        {book?.chapterNew && (
                                                            <div className="px-4 py-3 mt-3 bg-slate-700">
                                                                {book
                                                                    ?.chapterNew
                                                                    ?.length >
                                                                0 ? (
                                                                    <table className="min-w-full table-auto border">
                                                                        <thead className="text-gray-600 bg-gray-100">
                                                                            <tr
                                                                                text-gray-600
                                                                                bg-gray-100
                                                                            >
                                                                                <th className="px-4 py-2 text-left">
                                                                                    Nguồn
                                                                                </th>
                                                                                <th className="px-4 py-2 text-left">
                                                                                    Chương
                                                                                </th>
                                                                                <th className="px-4 py-2 text-left">
                                                                                    Liên
                                                                                    kết
                                                                                </th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {book?.chapterNew?.map(
                                                                                (
                                                                                    c
                                                                                ) => {
                                                                                    return (
                                                                                        <tr
                                                                                            key={
                                                                                                c?.source
                                                                                            }
                                                                                            className="border-b"
                                                                                        >
                                                                                            <td className="px-4 py-3">
                                                                                                {
                                                                                                    c?.source
                                                                                                }
                                                                                            </td>
                                                                                            <td className="px-4 py-3">
                                                                                                {
                                                                                                    c?.num
                                                                                                }
                                                                                            </td>
                                                                                            <td className="px-4 py-3">
                                                                                                <Link
                                                                                                    href={`${c?.href}`}
                                                                                                    target="_blank"
                                                                                                    prefetch={
                                                                                                        false
                                                                                                    }
                                                                                                    className="hover:underline text-blue-500"
                                                                                                >
                                                                                                    Link
                                                                                                </Link>
                                                                                            </td>
                                                                                        </tr>
                                                                                    );
                                                                                }
                                                                            )}
                                                                        </tbody>
                                                                    </table>
                                                                ) : (
                                                                    <div>
                                                                        Không
                                                                        tìm thấy
                                                                        dữ liệu!
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* MEMBER */}
                                                <td className="">
                                                    <div className="">
                                                        <div
                                                            className={clsx(
                                                                "mb-3 font-semibold whitespace-nowrap text-white text-center px-2 py-1 rounded-sm text-xs uppercase mx-auto",
                                                                {
                                                                    "bg-green-600":
                                                                        book?.storage ===
                                                                        BookStorageStatusEnum.MAIN,
                                                                    "bg-red-600":
                                                                        book?.storage ===
                                                                        BookStorageStatusEnum.ERROR,
                                                                    "bg-yellow-600":
                                                                        book?.storage ===
                                                                        BookStorageStatusEnum.BACKUP,
                                                                    "bg-blue-600":
                                                                        book?.storage ===
                                                                        BookStorageStatusEnum.WAITING,
                                                                }
                                                            )}
                                                        >
                                                            {
                                                                dataOptionsStorageBook[
                                                                    book?.storage as BookStorageStatusEnum
                                                                ]
                                                            }
                                                        </div>
                                                        <div className="flex flex-col space-y-1">
                                                            {book?.contributors
                                                                ?.length > 0 ? (
                                                                book?.contributors?.map(
                                                                    (
                                                                        member
                                                                    ) => {
                                                                        return (
                                                                            <div
                                                                                key={
                                                                                    member
                                                                                        ?.user
                                                                                        ?.userId
                                                                                }
                                                                                className={classNames(
                                                                                    "w-full flex items-center justify-between px-1 py-1 bg-slate-700",
                                                                                    member
                                                                                        ?.user
                                                                                        ?.userId ===
                                                                                        session
                                                                                            .user
                                                                                            .userId &&
                                                                                        "border-l-4 border-blue-600"
                                                                                )}
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
                                                                                        <div className="text-xs font-semibold uppercase line-clamp-1">
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
                                                                                        member?.role ===
                                                                                        UserBookContributorRole.admin
                                                                                            ? "bg-green-600 boder border-green-400"
                                                                                            : member?.confirmed
                                                                                            ? "bg-teal-600 boder border-teal-400"
                                                                                            : "bg-yellow-600 boder border-yellow-400"
                                                                                    }`}
                                                                                >
                                                                                    {!member?.confirmed
                                                                                        ? "CHỜ XÁC NHẬN"
                                                                                        : member?.role}
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    }
                                                                )
                                                            ) : (
                                                                <div className="text-center w-full px-2 py-1 bg-slate-700">
                                                                    Không có
                                                                    thành viên!
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* ACTION */}
                                                <td className="">
                                                    <div className="select-none">
                                                        <div className="mb-1">
                                                            <Link
                                                                prefetch={false}
                                                                // target="_blank"
                                                                title="Danh sách chương"
                                                                className="px-2 py-1 w-full space-x-2 flex items-center text-sm leading-8 bg-blue-600 hover:bg-blue-700 opacity-100"
                                                                href={`/${
                                                                    meta?.content
                                                                }/creator/books/${
                                                                    book?.bookId
                                                                }/chapters/${
                                                                    book
                                                                        ?.chapters[0]
                                                                        ?.chapterNumber ||
                                                                    0
                                                                }/create?v=1`}
                                                            >
                                                                <IconFilePen className="h-8 p-1 fill-white" />
                                                                <span>
                                                                    Thêm chương
                                                                    mới ngay
                                                                </span>
                                                            </Link>
                                                        </div>
                                                        <div>
                                                            <Link
                                                                title="Chỉnh sửa truyện"
                                                                // target="_blank"
                                                                href={`/${meta?.content}/creator/books/${book?.bookId}`}
                                                                prefetch={false}
                                                                className={clsx(
                                                                    "px-2 py-1 w-full space-x-2 flex items-center text-sm leading-8 bg-slate-600 hover:bg-slate-700 opacity-100",
                                                                    {
                                                                        "opacity-60 pointer-events-none":
                                                                            ![
                                                                                UserRole.ADMIN,
                                                                                UserRole.EDITOR,
                                                                            ].includes(
                                                                                session
                                                                                    ?.user
                                                                                    .role
                                                                            ) &&
                                                                            book
                                                                                ?.contributors?.[0]
                                                                                ?.user
                                                                                .userId !==
                                                                                session
                                                                                    .user
                                                                                    .userId,
                                                                    }
                                                                )}
                                                            >
                                                                <IconBook className="h-8 p-1 fill-white" />
                                                                <span>
                                                                    Chỉnh sửa
                                                                    truyện
                                                                </span>
                                                            </Link>
                                                        </div>

                                                        <div>
                                                            <Link
                                                                prefetch={false}
                                                                // target="_blank"
                                                                title="Danh sách chương"
                                                                className="px-2 py-1 w-full space-x-2 flex items-center text-sm leading-8 bg-slate-600 hover:bg-slate-700 opacity-100"
                                                                href={`/${meta?.content}/creator/books/${book?.bookId}/chapters`}
                                                            >
                                                                <IconListUl className="h-8 p-1 fill-white" />
                                                                <span>
                                                                    Danh sách
                                                                    chương
                                                                </span>
                                                            </Link>
                                                        </div>

                                                        {[
                                                            UserRole.ADMIN,
                                                            UserRole.EDITOR,
                                                        ].includes(
                                                            session?.user?.role
                                                        ) && (
                                                            <div className="mt-1">
                                                                <div
                                                                    className={clsx(
                                                                        "px-2 py-1 leading-8 text-sm flex items-center bg-slate-600",
                                                                        {
                                                                            "opacity-60 pointer-events-none":
                                                                                ![
                                                                                    UserRole.ADMIN,
                                                                                    UserRole.EDITOR,
                                                                                ].includes(
                                                                                    session
                                                                                        ?.user
                                                                                        .role
                                                                                ),
                                                                        }
                                                                    )}
                                                                >
                                                                    <span>
                                                                        Truyện
                                                                        hay
                                                                    </span>
                                                                    <div className="px-2 flex justify-center">
                                                                        <ToggleCheck
                                                                            checked={
                                                                                book?.isFeatured
                                                                            }
                                                                            handleChecked={() =>
                                                                                handleToggleBook(
                                                                                    {
                                                                                        index: index,
                                                                                        bookId: book?.bookId,
                                                                                        action: "featured",
                                                                                        enabled:
                                                                                            !book?.isFeatured,
                                                                                    }
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {[
                                                            UserRole.ADMIN,
                                                            UserRole.EDITOR,
                                                        ].includes(
                                                            session?.user?.role
                                                        ) && (
                                                            <div className="mt-1">
                                                                <button
                                                                    title="Xóa truyện (soft delete)"
                                                                    onClick={() =>
                                                                        handleOpenDeleteModal(
                                                                            book?.bookId,
                                                                            book?.title
                                                                        )
                                                                    }
                                                                    disabled={isLoading}
                                                                    className="px-2 py-1 w-full space-x-2 flex items-center text-sm leading-8 bg-red-600 hover:bg-red-700 opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                    <IconTrash className="h-8 p-1 fill-white" />
                                                                    <span>
                                                                        Xóa truyện
                                                                    </span>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <SkeletonListTable count={20} col={6} />
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

            <ConfirmDeleteModal
                isOpen={isShowConfirmDeleteModal}
                setIsOpen={setIsShowConfirmDeleteModal}
                title="Xóa truyện?"
                message={
                    bookToDelete ? (
                        <>
                            Bạn có chắc chắn muốn xóa truyện{" "}
                            <strong className="text-red-500">
                                &ldquo;{bookToDelete.title}&ldquo;
                            </strong>
                            ? Truyện sẽ được đánh dấu là đã xóa (soft delete) và có thể khôi phục sau.
                        </>
                    ) : (
                        "Bạn có chắc chắn muốn xóa truyện này? Truyện sẽ được đánh dấu là đã xóa (soft delete) và có thể khôi phục sau."
                    )
                }
                confirmText="Xóa"
                cancelText="Hủy"
                onConfirm={handleSoftDeleteBook}
                isLoading={isLoading}
                loadingText="Đang xóa..."
                variant="danger"
            />
        </>
    );
};

export default CreatorListBooksTemplate;
