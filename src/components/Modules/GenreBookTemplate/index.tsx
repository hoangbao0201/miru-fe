import { Fragment, Suspense } from "react";

import CardBook from "@/components/Share/CardBook";
import { ContentPageEnum } from "@/common/data.types";
import BoxHeading from "@/components/Share/BoxHeading";
import Breadcrumbs from "@/components/Share/BreadCrumbs";
import SkeletonCardBook from "../Skeleton/SkeletonCardBook";
import { NavPagination } from "@/components/Share/NavPagination";
import { getAllBookService, GetBooksProps } from "@/services/book.services";
import BookGrid from "@/components/Layouts/BookGrid";

interface GenreBookTemplateProps {
    title: string;
    content: ContentPageEnum;
    options: {
        id: string;
        page: number;
    };
}
const GenreBookTemplate = ({
    title,
    options,
    content = ContentPageEnum.comics,
}: GenreBookTemplateProps) => {
    const { id } = options;

    return (
        <>
            <div className="py-5">
                <BoxHeading heading="1" title={title} />

                <Suspense
                    fallback={
                        <BookGrid>
                            <SkeletonCardBook count={24} />
                        </BookGrid>
                    }
                >
                    <BooksView content={content} options={options} />
                </Suspense>
            </div>
        </>
    );
};

export default GenreBookTemplate;

async function BooksView({
    content,
    options,
}: {
    content: ContentPageEnum;
    options: GenreBookTemplateProps["options"];
}) {
    const currentDate = new Date();
    const querys = new URLSearchParams({
        take: "24",
        genres: String(options.id),
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
                    queryParams={new URLSearchParams({ page: String(options.page) })}
                />
            </div>
        </>
    );
}
