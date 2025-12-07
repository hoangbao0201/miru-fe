import { Fragment, Suspense } from "react";

import CardBook from "@/components/Share/CardBook";
import { ContentPageEnum } from "@/common/data.types";
import BoxHeading from "@/components/Share/BoxHeading";
import Breadcrumbs from "@/components/Share/BreadCrumbs";
import SkeletonCardBook from "../Skeleton/SkeletonCardBook";
import { NavPagination } from "@/components/Share/NavPagination";
import { getAllBookService, GetBooksProps } from "@/services/book.services";
import BookGrid from "@/components/Layouts/BookGrid";

interface SearchBookTemplateProps {
    content: ContentPageEnum;
    meta: {
        urlSeo: string;
        titleSeo: string;
        descriptionSeo: string;
    };
    options: {
        q: string;
        page: number;
    };
}
const SearchBookTemplate = ({
    meta,
    content,
    options,
}: SearchBookTemplateProps) => {
    return (
        <>
            <div className="py-2">
                <Breadcrumbs
                    listBreadcrumbs={[
                        {
                            title: meta?.titleSeo,
                            slug: meta?.urlSeo,
                        },
                    ]}
                    className="mx-3 mb-3 pb-3"
                />

                <BoxHeading heading="1" title={meta?.titleSeo} />

                <p className="mb-4 text-[15px] text-muted-foreground">
                    {meta?.descriptionSeo}
                </p>

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

export default SearchBookTemplate;

async function BooksView({
    content,
    options,
}: {
    content: ContentPageEnum;
    options: SearchBookTemplateProps["options"];
}) {
    const currentDate = new Date();
    const querys = new URLSearchParams({
        take: "24",
        q: String(options.q),
        page: String(options.page),
        ...(content && {
            category: content,
        }),
    });
    const { countBook, books }: { countBook: number; books: GetBooksProps[] } =
        await getAllBookService({
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
                <div className="py-3 text-muted-foreground mx-3">
                    Không tìm thấy truyện nào!
                </div>
            )}

            <div className="mt-4 px-3">
                <NavPagination
                    queryParams={querys}
                    currentPage={options.page}
                    countPage={Math.ceil((Number(countBook) || 1) / 24) || 1}
                />
            </div>
        </>
    );
}
