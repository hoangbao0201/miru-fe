import { Metadata, ResolvingMetadata } from "next";

import { BreadcrumbList } from "schema-dts";

import { Env } from "@/config/Env";
import { JsonLd } from "@/utils/JsonLd";
import getDomainConfig from "@/lib/domain";
import { listTagSeo } from "@/constants/data";
import { ContentPageEnum } from "@/common/data.types";
import SeoBookTemplate from "@/components/Modules/SeoBookTemplate";
import { getAllBookService, GetBooksProps } from "@/services/book.services";

const { NEXT_PUBLIC_TITLE_SEO, NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO } = Env

type ParamsProps = {
    params: {
        content: ContentPageEnum;
    };
};

export async function generateMetadata(
    { params, searchParams }: SearchParamProps & ParamsProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { appUrl } = await getDomainConfig();

    const { id } = params;
    const content =
        (params?.content as ContentPageEnum) || ContentPageEnum.comics;

    const lastHyphenIndex = id.lastIndexOf("-");
    const slug = id.substring(0, lastHyphenIndex);
    const tag = id.substring(lastHyphenIndex + 1);

    const { page: page = "" } = searchParams;
    const currentPage = Number(page) || 1;
    const { books }: { books: GetBooksProps[] } =
        await getAllBookService({
            query: `?slug=${slug}&take=24&page=${currentPage}`,
            cache: "no-cache",
        });

    const isOnlyBook = books.length === 1;
    const title =
        books?.length === 1
            ? books[0].slug === slug
                ? books[0].title + " " + tag
                : listTagSeo[content]?.includes(tag)
                ? slug.replaceAll("-", " ") + " " + tag
                : books[0].title
            : slug.replaceAll("-", " ") + " " + tag;

    const previousImages = (await parent).openGraph?.images || [];
    const thumbnail = isOnlyBook ? books[0].covers?.[0]?.url : "";
    
    const urlSeo = `${appUrl}/${content}/seo/${id}`;
    const titleSeo = `${title} - Cập Nhật Nhanh Nhất | ${NEXT_PUBLIC_TITLE_SEO}`;
    const descriptionSeo = `🔥 Thưởng thức truyện tranh ${title} được cập nhật nhanh nhất tại ${NEXT_PUBLIC_TITLE_SEO}. ${
        isOnlyBook
            ? "[Tới chap " +
              (books[0].chapters.length > 0 ? books[0].chapters[0].num : 0) +
              "] - "
            : ""
    }Bản dịch chuẩn, hình ảnh sắc nét, truyện hay từ nguồn ${tag}. Đọc ngay!`;

    return {
        title: titleSeo,
        description: descriptionSeo,
        authors: { name: NEXT_PUBLIC_TITLE_SEO, url: appUrl },
        category: NEXT_PUBLIC_TITLE_SEO,
        keywords: [...listTagSeo[content]],
        publisher: NEXT_PUBLIC_TITLE_SEO,
        openGraph: {
            title: titleSeo,
            siteName: NEXT_PUBLIC_TITLE_SEO,
            type: "article",
            url: urlSeo,
            description: descriptionSeo,
            images: [
                `${thumbnail ? NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO + thumbnail : ""}`,
                ...previousImages,
            ],
            authors: NEXT_PUBLIC_TITLE_SEO,
            tags: [...listTagSeo[content]],
        },
        alternates: {
            canonical: urlSeo,
        },
    };
}

export default async function JoinBookPage({
    params,
    searchParams,
}: SearchParamProps & { params: { content: ContentPageEnum } }) {
    const { appUrl } = await getDomainConfig();

    const { id } = params;
    const content =
        (params?.content as ContentPageEnum) || ContentPageEnum.comics;

    const lastHyphenIndex = id.lastIndexOf("-");
    const slug = id.substring(0, lastHyphenIndex);
    const tag = id.substring(lastHyphenIndex + 1);

    const { page: page = "" } = searchParams;

    const querys = new URLSearchParams({
        take: "24",
        page: String(Number(page) || 1),
        ...(slug && { slug: slug.toString() }),
        ...(content && {
            category: content,
        }),
    });
    const { countBook, books }: { countBook: number; books: GetBooksProps[] } =
        await getAllBookService({
            query: `?${querys.toString()}`,
            cache: "no-cache",
        });

    const title =
        books?.length === 1
            ? books[0].slug === slug
                ? books[0].title + " " + tag
                : listTagSeo[content]?.includes(tag)
                ? slug.replaceAll("-", " ") + " " + tag
                : books[0].title
            : slug.replaceAll("-", " ") + " " + tag;
    
    const isOnlyBook = books.length === 1;
    const urlSeo = `${appUrl}/${content}/seo/${id}`;
    const titleSeo = `${title} - Cập Nhật Nhanh Nhất | ${NEXT_PUBLIC_TITLE_SEO}`;
    const descriptionSeo = `🔥 Thưởng thức truyện tranh ${title} được cập nhật nhanh nhất tại ${NEXT_PUBLIC_TITLE_SEO}. ${
        isOnlyBook
            ? "[Tới chap " +
                (books[0].chapters.length > 0 ? books[0].chapters[0].num : 0) +
                "] - "
            : ""
    }Bản dịch chuẩn, hình ảnh sắc nét, truyện hay từ nguồn ${tag}. Đọc ngay!`;

    // JSON‑LD cho BreadcrumbList giúp trình bày cấu trúc trang trong kết quả tìm kiếm
    const breadcrumbJsonLd = JsonLd<BreadcrumbList>({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Trang chủ",
                item: appUrl,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "SEO Truyện: " + title,
                item: `${appUrl}/seo/${id}`,
            },
        ],
    });

    return (
        <>
            {/* JSON‑LD cho BreadcrumbList */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }}
            />
            <SeoBookTemplate
                title={title}
                books={books}
                content={content}
                currentPage={Number(page) || 1}
                countPage={Math.ceil((Number(countBook) || 1) / 24) || 1}
                meta={{
                    urlSeo,
                    titleSeo,
                    descriptionSeo
                }}
            />
        </>
    );
}
