"use client";

import { useRouter } from "next/navigation";
import { ContentPageEnum } from "@/common/data.types";
import { Fragment, Suspense, useEffect, useState } from "react";

import Image from "next/image";
import {
    getListBooksByTeamApi,
    IGetListBooksByTeamRes,
} from "@/services/team.service";
import Link from "next/link";
import { Env } from "@/config/Env";
import convertTime from "@/utils/convertTime";
import SkeletonCardBook from "../Skeleton/SkeletonCardBook";
import { NavButtonPagination } from "@/components/Share/NavButtonPagination";

interface TeamDetailTemplateProps {
    title: string;
    teamId: number;
    content: ContentPageEnum;
    options: {
        page: number;
    };
}
export default function TeamDetailTemplate({
    title,
    teamId,
    content,
    options
}: TeamDetailTemplateProps) {
    const router = useRouter();
    const [dataBooks, setDataBooks] = useState<{
        data: IGetListBooksByTeamRes["data"];
        meta: IGetListBooksByTeamRes["meta"];
    }>();

    // Handle Change Page
    const handleChangePage = (page: number) => {
        const queryParams = new URLSearchParams();

        queryParams.append("page", page.toString());

        router.push(`?${queryParams.toString()}`, { scroll: true });
    };

    const eventGetDataListBooksTeam = async () => {
        try {
            const booksRes = await getListBooksByTeamApi({
                teamId,
                page: options.page || 1,
            });
            if (booksRes?.data?.data) {
                setDataBooks({
                    data: booksRes?.data?.data,
                    meta: booksRes?.data?.meta,
                });
            }
        } catch (error) {}
    };

    useEffect(() => {
        setDataBooks(undefined);
        eventGetDataListBooksTeam();
    }, [options]);

    return (
        <>
            <div className="px-3">
                <h2 className="text-lg font-semibold mb-4">
                    Thư viện truyện tranh
                </h2>
                <div>
                    {dataBooks ? (
                        dataBooks?.data?.length ? (
                            <div>
                                <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-x-4 gap-y-3">
                                    {dataBooks?.data?.map((book) => {
                                        return (
                                            <div key={book?.bookId}>
                                                <figure>
                                                    <div className="">
                                                        <div className="relative text-center overflow-hidden mb-2">
                                                            <Link
                                                                prefetch={false}
                                                                href={`/${content}/books/${book?.slug}-${book?.bookId}`}
                                                                title={`Truyện tranh ${book?.title}`}
                                                                className="align-middle"
                                                            >
                                                                <Image
                                                                    key={`${book?.bookId}`}
                                                                    unoptimized
                                                                    loading="lazy"
                                                                    src={
                                                                        book?.covers?.[0]?.url ?? "/static/images/image-book-not-found.jpg"
                                                                    }
                                                                    width={175}
                                                                    height={238}
                                                                    alt={`Truyện tranh ${book?.title}`}
                                                                    className="pt-0 w-full rounded-md object-cover bg-[#151D35] align-middle"
                                                                />
                                                            </Link>
                                                        </div>
                                                        <div className="">
                                                            <Link
                                                                prefetch={false}
                                                                href={`/${content}/books/${book?.slug}-${book?.bookId}`}
                                                                title={
                                                                    book?.title
                                                                }
                                                            >
                                                                <h3 className="text-[17px] line-clamp-2 font-semibold">
                                                                    {
                                                                        book?.title
                                                                    }
                                                                </h3>
                                                            </Link>
                                                            <div className="mt-2">
                                                                {book?.chapters.map(
                                                                    (
                                                                        chapter,
                                                                        index
                                                                    ) => {
                                                                        return (
                                                                            <div
                                                                                key={
                                                                                    index
                                                                                }
                                                                                className="mb-2"
                                                                            >
                                                                                <Link
                                                                                    prefetch={
                                                                                        false
                                                                                    }
                                                                                    title={`Chương ${chapter?.num}`}
                                                                                    className="uppercase flex justify-between items-center whitespace-nowrap space-x-1 visited:text-gray-400"
                                                                                    href={`/${content}/books/${book?.slug}-${book?.bookId}/chapter-${chapter?.num}-${chapter?.chapterNumber}`}
                                                                                >
                                                                                    <div className="text-gray-50 px-[8px] py-[6px] text-[12px] leading-[12px] font-semibold bg-white/5 hover:underline hover:bg-[#02aab0] hover:text-white rounded-md">
                                                                                        {"Chap " +
                                                                                            chapter?.num}
                                                                                    </div>
                                                                                    <span className="text-[10px] leading-[10px] text-gray-400">{`${convertTime(
                                                                                        chapter?.createdAt
                                                                                    )}`}</span>
                                                                                </Link>
                                                                            </div>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </figure>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div>Không có truyện nào!</div>
                        )
                    ) : (
                        <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-x-4 gap-y-3">
                            <SkeletonCardBook count={24} />
                        </div>
                    )}

                    <div className="mt-4">
                        <NavButtonPagination
                            currentPage={dataBooks?.meta?.currentPage || 1}
                            countPage={dataBooks?.meta?.pageCount || 1}
                            handleChangePage={handleChangePage}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

// async function BooksView({
//     content,
//     options,
// }: {
//     content: ContentPageEnum;
//     options: TeamDetailTemplateProps["options"];
// }) {
//     const currentDate = new Date();
//     const querys = new URLSearchParams({
//         take: "24",
//         page: String(options.page),
//         ...(content && {
//             category: content,
//         }),
//     });
//     const {
//         countBook = 0,
//         books = [],
//     }: { countBook: number; books: GetBooksProps[] } = await getAllBookService({
//         query: `?${querys.toString()}`,
//         cache: "no-cache",
//     });

//     return (
//         <>
//             {books ? (
//                 <div className="grid lg:grid-cols-4 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-x-4 gap-y-3">
//                     {books.map((book) => {
//                         return (
//                             <Fragment key={book?.bookId}>
//                                 <CardBook
//                                     book={book}
//                                     content={content}
//                                     currentDate={currentDate}
//                                 />
//                             </Fragment>
//                         );
//                     })}
//                 </div>
//             ) : (
//                 <div className="py-3">Không tìm thấy truyện nào!</div>
//             )}
//             <div className="mt-4">

//                 <NavPagination
//                     currentPage={options.page}
//                     countPage={Math.ceil((Number(countBook) || 1) / 24) || 1}
//                     queryParams={new URLSearchParams({ page: String(options.page) })}
//                 />
//             </div>
//         </>
//     );
// }
