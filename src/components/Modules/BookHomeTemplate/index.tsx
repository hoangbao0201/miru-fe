import { Fragment, Suspense } from "react";

import CardBook from "@/components/Share/CardBook";
import { ContentPageEnum } from "@/common/data.types";
import BoxHeading from "@/components/Share/BoxHeading";
import SkeletonCardBook from "../Skeleton/SkeletonCardBook";
import { NavPagination } from "@/components/Share/NavPagination";
import { getAllBookService, GetBooksProps } from "@/services/book.services";
import BookGrid from "@/components/Layouts/BookGrid";

export interface BookHomeTemplateProps {
    title: string;
    content: ContentPageEnum;
    options: {
        page: number;
    };
}
export default function BookHomeTemplate({
    title,
    content,
    options,
}: BookHomeTemplateProps) {
    return (
        <>
            <BoxHeading heading="2" title={title} />
            <Suspense
                fallback={
                    <BookGrid>
                        <SkeletonCardBook count={24} />
                    </BookGrid>
                }
            >
                <BooksView content={content} options={options} />
            </Suspense>
        </>
    );
}

async function BooksView({
    content,
    options,
}: {
    content: ContentPageEnum;
    options: BookHomeTemplateProps["options"];
}) {
    const currentDate = new Date();
    const querys = new URLSearchParams({
        take: "24",
        page: String(options.page),
        ...(content && {
            category: content,
        }),
    });
    const {
        countBook = 0,
        books = [],
    }: { countBook: number; books: GetBooksProps[] } = await getAllBookService({
        query: `?${querys.toString()}`,
        cache: "no-cache",
    });

    return (
        <>
            {books ? (
                <BookGrid>
                    {books.map((book) => {
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
                <div className="py-3">Không tìm thấy truyện nào!</div>
            )}
            <div className="mt-4">
                <NavPagination
                    currentPage={options.page}
                    countPage={Math.ceil((Number(countBook) || 1) / 24) || 1}
                    queryParams={
                        new URLSearchParams({ page: String(options.page) })
                    }
                />
            </div>
        </>
    );
}
