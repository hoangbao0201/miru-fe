import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";

import { BreadcrumbList, ComicSeries } from "schema-dts";

import {
    getAllBookService,
    GetBookProps,
    getDetailBookService,
} from "@/services/book.services";
import { Env } from "@/config/Env";
import { JsonLd } from "@/utils/JsonLd";
import { ContentPageEnum } from "@/common/data.types";
import BookDetailTemplate from "@/components/Modules/BookDetaiTemplate";
import chapterService, {
    GetChaptersAdvancedProps,
} from "@/services/chapter.services";
import getDomainConfig from "@/lib/domain";

const { NEXT_PUBLIC_TITLE_SEO, NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO } = Env

interface ParamsProps {
    params: {
        slugBook: string;
        content: ContentPageEnum;
    };
};
export async function generateMetadata(
    { params }: ParamsProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { appUrl } = await getDomainConfig();

    const { slugBook } = params;
    const content = params.content as ContentPageEnum || ContentPageEnum.comics;

    const bookId = slugBook.substring(slugBook.lastIndexOf("-") + 1);
    const { book }: { book: GetBookProps } = await getDetailBookService({
        bookId: +bookId,
        revalidate: 5 * 60,
    });
    const previousImages = (await parent).openGraph?.images || [];

    const urlSeo = `${appUrl}/${content}/books/${book?.slug}-${book?.bookId}`
    const title = `${book?.title || ""} - Đọc Online Miễn Phí tại ${NEXT_PUBLIC_TITLE_SEO}`;
    const description = `🔥 Đọc ${book?.title} - Truyện tranh hấp dẫn, Full HD"}. Cập nhật nhanh mỗi ngày tại ${NEXT_PUBLIC_TITLE_SEO}!`;
    const tags = book?.tags.map((tag) => tag?.name ?? tag?.metaId);

    return {
        title: title,
        description: book?.description ?? description,
        category: NEXT_PUBLIC_TITLE_SEO,
        keywords: tags,
        publisher: NEXT_PUBLIC_TITLE_SEO,
        authors: {
            name: NEXT_PUBLIC_TITLE_SEO,
            url: appUrl,
        },
        twitter: {
            card: "summary_large_image",
            title: title,
            description: description,
            images: [
                NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO + "/" + (book?.posters?.[0]?.url || book?.covers?.[0]?.url) || "",
                ...previousImages,
            ],
        },
        openGraph: {
            title: title,
            siteName: NEXT_PUBLIC_TITLE_SEO,
            type: "website",
            url: urlSeo,
            description: book?.description ?? description,
            images: [
                NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO + "/" + (book?.posters?.[0]?.url || book?.covers?.[0]?.url) || "",
                ...previousImages,
            ],
            locale: "vi",
            alternateLocale: ["vi", "en"],
        },
        alternates: {
            canonical: urlSeo,
        },
    };
}

export default async function HomePage({
    params,
    searchParams,
}: SearchParamProps & ParamsProps) {
    const { appUrl } = await getDomainConfig();

    const { readId } = searchParams;
    const { slugBook } = params;
    const content = params.content as ContentPageEnum || ContentPageEnum.comics;

    const bookId = slugBook.substring(slugBook.lastIndexOf("-") + 1);
    const { book }: { book: GetBookProps } = await getDetailBookService({
        bookId: +bookId,
        cache: 'no-store',
    });

    const typeSuggest = book?.author ? "AUTHOR" : "SUGGEST";
    const querySuggest =
        typeSuggest === "AUTHOR"
            ? `?author=${book?.author?.name}&take=4`
            : `?genres=${book.tags.map((tag) => tag?.metaId).join(",")}&take=6`;

    const { books = [] } = await getAllBookService({
        query: querySuggest,
        cache: "no-cache",
    });

    return (
        <>
            <BookDetailTemplate
                book={book}
                books={books}
                content={content}
                type={typeSuggest}
                readId={readId ? String(readId) : undefined}
            />
        </>
    );
}
