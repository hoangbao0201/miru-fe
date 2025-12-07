"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Fragment, useEffect, useState } from "react";

import CardBook from "@/components/Share/CardBook";
import { ContentPageEnum } from "@/common/data.types";
import SkeletonCardBook from "../Skeleton/SkeletonCardBook";
import { NavButtonPagination } from "@/components/Share/NavButtonPagination";
import LoadingChangePage from "@/components/Share/Loading/LoadingChangePage";
import {
    getAllFollowBookService,
    GetBooksProps,
} from "@/services/book.services";
import BoxHeading from "@/components/Share/BoxHeading";
import BookGrid from "@/components/Layouts/BookGrid";

interface BooksFollowPropsTemplate {
    title: string;
    currentPage: number;
    content: ContentPageEnum;
}
const BooksFollowTemplate = ({
    title,
    content = ContentPageEnum.comics,
    currentPage,
}: BooksFollowPropsTemplate) => {
    const router = useRouter();
    const { data: session, status } = useSession();

    const [loadingPage, setLoadingPage] = useState(false);
    const [dataListBooks, setDataListBooks] = useState<null | {
        books: GetBooksProps[];
        countPage: number;
    }>(null);

    const handleGetBooksFollow = async () => {
        if (status !== "authenticated") {
            return;
        }
        setLoadingPage(true);
        try {
            const querys = new URLSearchParams({
                take: "24",
                page: String(Number(currentPage) || 1),
                ...(content && {
                    category: content,
                }),
            });
            const booksRes: {
                success: boolean;
                countBook: number;
                books: GetBooksProps[];
            } = await getAllFollowBookService({
                cache: "no-store",
                query: `?${querys.toString()}`,
                token: session?.backendTokens.accessToken,
            });

            if (booksRes?.success) {
                setDataListBooks({
                    books: booksRes.books,
                    countPage: Math.ceil(
                        (Number(booksRes.countBook) || 1) / 24
                    ),
                });

                window.scrollTo({
                    top: 0,
                    behavior: "instant",
                });
            }

            setLoadingPage(false);
        } catch (error) {
            setLoadingPage(false);
        }
    };

    useEffect(() => {
        handleGetBooksFollow();
    }, [status, currentPage]);

    const handleChangePage = (page: number) => {
        router.push(`?page=` + page, { scroll: false });
    };

    const currentDate = new Date();

    return (
        <>
            <div className="">
                <BoxHeading heading="1" title={title} />

                {status === "authenticated" ? (
                    dataListBooks ? (
                        dataListBooks.books.length > 0 ? (
                            <>
                                <BookGrid>
                                    {dataListBooks.books &&
                                        dataListBooks.books.map(
                                            (book, index) => {
                                                return (
                                                    <Fragment key={book.bookId}>
                                                        <CardBook
                                                            book={book}
                                                            content={content}
                                                            currentDate={
                                                                currentDate
                                                            }
                                                        />
                                                    </Fragment>
                                                );
                                            }
                                        )}
                                </BookGrid>

                                <div className="mt-4">
                                    <NavButtonPagination
                                        handleChangePage={handleChangePage}
                                        currentPage={currentPage}
                                        countPage={
                                            dataListBooks?.countPage || 1
                                        }
                                    />
                                </div>
                            </>
                        ) : (
                            <div>Bạn chưa theo dõi bộ truyện nào</div>
                        )
                    ) : (
                        <BookGrid className="md:grid-cols-4 lg:grid-cols-4">
                            <SkeletonCardBook count={12} />
                        </BookGrid>
                    )
                ) : status === "loading" ? (
                    <BookGrid className="md:grid-cols-4 lg:grid-cols-4">
                        <SkeletonCardBook count={12} />
                    </BookGrid>
                ) : (
                    <div>Bạn chưa đăng nhập tài khoản!</div>
                )}

                {loadingPage && <LoadingChangePage />}
            </div>
        </>
    );
};

export default BooksFollowTemplate;
