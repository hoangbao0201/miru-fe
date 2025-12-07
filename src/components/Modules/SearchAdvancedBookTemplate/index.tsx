"use client";

import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

import classNames from "@/utils/classNames";
import CardBook from "@/components/Share/CardBook";
import { ContentPageEnum } from "@/common/data.types";
import Breadcrumbs from "@/components/Share/BreadCrumbs";
import SkeletonCardBook from "../Skeleton/SkeletonCardBook";
import { GetListTagsBookResType } from "@/store/book/book.type";
import { getAllBookService, GetBooksProps } from "@/services/book.services";
import { NavButtonPagination } from "@/components/Share/NavButtonPagination";
import BookGrid from "@/components/Layouts/BookGrid";

export interface SearchAdvancedBookTemplateProps {
    content: ContentPageEnum;
    options: {
        page: number;
        isShow: boolean;
        genresTag: string[];
        notgenresTag: string[];
        statusTags: { [key: string]: "can" | "not" | "have" };
    };
    category: GetListTagsBookResType["data"];
}
const SearchAdvancedBookTemplate = ({
    options,
    category,
    content = ContentPageEnum.comics,
}: SearchAdvancedBookTemplateProps) => {
    const currentDate = new Date();

    const router = useRouter();

    const [dataBooks, setDataBooks] = useState<{
        books: GetBooksProps[];
        countBook: number;
    }>();
    const [isBookFilter, setIsBookFilter] = useState(options.isShow);
    const [tagStatus, setTagStatus] = useState<{
        [key: string]: "can" | "not" | "have";
    }>(options.statusTags || {});

    // Handle Checked
    const handleChecked = (e: any) => {
        const id = e.currentTarget.getAttribute("id");
        setTagStatus((prevStatus) => {
            const currentStatus = prevStatus[id];
            switch (currentStatus) {
                case "can":
                    return { ...prevStatus, [id]: "have" };
                case "not":
                    return { ...prevStatus, [id]: "can" };
                case "have":
                    return { ...prevStatus, [id]: "not" };
                default:
                    return { ...prevStatus, [id]: "have" };
            }
        });
    };

    // Handle Change Page
    const handleChangePage = (page: number) => {
        const haveArray: string[] = [];
        const notArray: string[] = [];

        for (const key in tagStatus) {
            if (tagStatus[key] === "have") {
                haveArray.push(key);
            } else if (tagStatus[key] === "not") {
                notArray.push(key);
            }
        }

        const queryParams = new URLSearchParams();

        queryParams.append("isShow", "false");
        queryParams.append("page", page.toString());
        if (haveArray.length) queryParams.append("genres", haveArray.join(","));
        if (notArray.length)
            queryParams.append("notgenres", notArray.join(","));

        setIsBookFilter(false);
        router.push(`?${queryParams.toString()}`, { scroll: true });
    };

    const handleGetDataBooks = async () => {
        const querys = new URLSearchParams({
            take: "24",
            page: String(options.page),
            ...(options.genresTag.length && {
                genres: options.genresTag.toString(),
            }),
            ...(options.notgenresTag.length && {
                notgenres: options.notgenresTag.toString(),
            }),
            ...(content && {
                category: content,
            }),
        });

        const {
            countBook = 0,
            books = [],
        }: { countBook: number; books: GetBooksProps[] } =
            await getAllBookService({
                query: `?${querys.toString()}`,
                cache: "no-cache",
            });

        if (books?.length) {
            setDataBooks({
                books,
                countBook,
            });
        } else {
            setDataBooks({
                books: [],
                countBook: 0,
            });
        }
    };

    useEffect(() => {
        setDataBooks(undefined);
        handleGetDataBooks();
    }, [options]);

    return (
        <>
            <div className="">
                <Breadcrumbs
                    listBreadcrumbs={[
                        {
                            title: "Tìm truyện",
                            slug: `/${content || ""}/search-advanced`,
                        },
                    ]}
                    className="mb-3 py-3"
                />

                <div className="pb-8">
                    <h1 className="text-center mx-3 pb-4 font-semibold text-2xl">
                        Tìm truyện nâng cao
                    </h1>
                    <div className="text-center mb-4">
                        <button
                            className="py-2 px-3 min-w-44 rounded-lg text-white bg-blue-500"
                            onClick={() => setIsBookFilter(!isBookFilter)}
                        >
                            {isBookFilter
                                ? "Ẩn khung tìm kiếm"
                                : "Hiện khung tìm kiếm"}
                        </button>
                    </div>
                    {isBookFilter && (
                        <div className="">
                            <div>
                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="w-5 h-5 rounded-md border-2 border-green-600 bg-green-600/10"></div>
                                    <p>Tìm trong những thể loại này</p>
                                </div>

                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="w-5 h-5 rounded-md border-2 border-red-600 bg-red-600/10"></div>
                                    <p>Loại trừ những thể loại này</p>
                                </div>

                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="w-5 h-5 rounded-md border-2 border-slate-500 bg-slate-500/10"></div>
                                    <p>Truyện có thể thuộc hoặc không thuộc thể loại này</p>
                                </div>
                            </div>
                            <div className="pb-3 flex items-end justify-between">
                                <h2 className="font-semibold text-lg">
                                    Thể loại
                                </h2>
                                <button
                                    onClick={() => setTagStatus({})}
                                    className="px-3 py-1 rounded-md text-white bg-green-500 hover:bg-green-600"
                                >
                                    Reset
                                </button>
                            </div>
                            <div className="pb-3 grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-2">
                                {category &&
                                    category.map((tag, index) => {
                                        const status =
                                            tagStatus[tag.metaId] || "can";
                                        return (
                                            <div
                                                key={tag.metaId}
                                                id={tag.metaId}
                                                onClick={handleChecked}
                                                className={classNames(
                                                    "relative bg-accent-10 border-2 rounded-lg flex items-center gap-2 px-2 py-2 cursor-pointer select-none",
                                                    false
                                                        ? "font-semibold text-red-500"
                                                        : "",
                                                    status === "have"
                                                        ? "border-green-600"
                                                        : status === "not"
                                                        ? "border-red-600"
                                                        : "border-transparent"
                                                )}
                                            >
                                                <div
                                                    className={classNames(
                                                        "absolute inset-0",
                                                        status === "have"
                                                            ? "bg-green-600/10"
                                                            : status ===
                                                                "not"
                                                            ? "bg-red-600/10"
                                                            : ""
                                                    )}
                                                ></div>
                                                <div className="py-2 flex-1 flex items-center flex-wrap gap-2">
                                                    <div className="text-[14px] leading-[14px]">
                                                        {tag?.name}
                                                    </div>
                                                </div>
                                                <span className="absolute top-0.5 right-0.5 text-xs rounded-[7px] bg-accent-20 px-[6px] h-5 leading-5">
                                                    {tag?.tagging_count}
                                                </span>
                                            </div>
                                        );
                                    })}
                            </div>
                            <div className="pt-3">
                                <button
                                    // href={"/search-advanced"}
                                    onClick={(e) => {
                                        // e.preventDefault();
                                        handleChangePage(1);
                                    }}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
                                >
                                    Tìm truyện
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {dataBooks ? (
                    dataBooks?.books?.length ? (
                        <BookGrid>
                            {dataBooks?.books.map((book) => {
                                return (
                                    <Fragment key={book?.bookId}>
                                        <CardBook
                                            book={book}
                                            content={content}
                                            currentDate={currentDate}
                                        />
                                    </Fragment>
                                );
                            })}
                        </BookGrid>
                    ) : (
                        <div className="py-3">
                            Không tìm thấy truyện nào!
                        </div>
                    )
                ) : (
                    <BookGrid>
                        <SkeletonCardBook count={24} />
                    </BookGrid>
                )}
                <div className="mt-4">
                    <NavButtonPagination
                        currentPage={options.page}
                        countPage={
                            Math.ceil(
                                (Number(dataBooks?.countBook) || 1) / 24
                            ) || 1
                        }
                        handleChangePage={handleChangePage}
                    />
                </div>
            </div>
        </>
    );
};

export default SearchAdvancedBookTemplate;
