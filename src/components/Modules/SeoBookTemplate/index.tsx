"use client";

import { Fragment } from "react";
import { useRouter } from "next/navigation";

import CardBook from "@/components/Share/CardBook";
import { ContentPageEnum } from "@/common/data.types";
import BoxHeading from "@/components/Share/BoxHeading";
import { GetBooksProps } from "@/services/book.services";
import Breadcrumbs from "@/components/Share/BreadCrumbs";
import { NavButtonPagination } from "@/components/Share/NavButtonPagination";
import BookGrid from "@/components/Layouts/BookGrid";

interface SeoBookTemplateProps {
    title: string;
    countPage: number;
    currentPage: number;
    books: GetBooksProps[];
    content: ContentPageEnum;
    meta: {
        urlSeo: string;
        titleSeo: string;
        descriptionSeo: string;
    }
}
const SeoBookTemplate = ({
    meta,
    books,
    countPage,
    currentPage,
    content = ContentPageEnum.comics,
}: SeoBookTemplateProps) => {
    const router = useRouter();

    const handleChangePage = (page: number) => {
        router.push(`?page=${page}`);
    };

    const currentDate = new Date();
    return (
        <>
            <div className="py-2">
                <div className="xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md mx-auto py-3">
                    <Breadcrumbs
                        listBreadcrumbs={[
                            {
                                title: meta?.titleSeo,
                                slug: meta?.urlSeo,
                            },
                        ]}
                        className="mx-3 mb-3 pb-3"
                    />
                    <div className="px-3">
                        <article>
                            <BoxHeading heading="1" title={meta?.titleSeo} />
                            <p className="mb-4 text-[15px]">
                                {meta?.descriptionSeo}
                            </p>
                        </article>
                        <BookGrid className="pb-3">
                            {books &&
                                books.map((book, index) => {
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
                        <div className="py-4">
                            {books && (
                                <NavButtonPagination
                                    countPage={countPage}
                                    currentPage={currentPage}
                                    handleChangePage={handleChangePage}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SeoBookTemplate;
