import { Metadata, ResolvingMetadata } from "next";

import { BreadcrumbList } from "schema-dts";

import { Env } from "@/config/Env";
import { JsonLd } from "@/utils/JsonLd";
import getDomainConfig from "@/lib/domain";
import { listTagSeo } from "@/constants/data";
import { ContentPageEnum } from "@/common/data.types";
import SearchBookTemplate from "@/components/Modules/SearchBookTemplate";

const { NEXT_PUBLIC_TITLE_SEO } = Env;

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
    const content =
        (params?.content as ContentPageEnum) || ContentPageEnum.comics;

    const { page: page = "", q: q = "" } = searchParams;

    const title = "Tìm kiếm từ khóa: " + q.toString().trim();
    const previousImages = (await parent).openGraph?.images || [];

    const urlSeo = `${appUrl}/${content}/search-advanced?q=${q}`;
    const titleSeo = `Tìm Truyện với tên: ${title}`;
    const descriptionSeo = `📚 Khám phá kho truyện tranh đầy đủ thể loại và cảm xúc! Đọc truyện hay, bản đẹp, cập nhật nhanh tại ${NEXT_PUBLIC_TITLE_SEO}.`;

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
            url: urlSeo,
            type: "article",
            description: descriptionSeo,
            images: [...previousImages],
            tags: [...listTagSeo[content]],
            authors: NEXT_PUBLIC_TITLE_SEO,
        },
        alternates: {
            canonical: urlSeo,
        },
    };
}

export default async function JoinBookPage({
    params,
    searchParams,
}: SearchParamProps & ParamsProps) {
    const { appUrl } = await getDomainConfig();

    const q = searchParams.q ? (searchParams.q as string) : "";
    const page = searchParams.page ? parseInt(searchParams.page as string) : 1;
    const content =
        (params?.content as ContentPageEnum) || ContentPageEnum.comics;

    const titleSeo = "Tìm kiếm từ khóa: " + q.toString().trim();

    const urlSeo = `${appUrl}/${content}/search-advanced?q=${q}`;
    const descriptionSeo = `📚 Khám phá kho truyện tranh đầy đủ thể loại và cảm xúc! Đọc truyện hay, bản đẹp, cập nhật nhanh tại ${NEXT_PUBLIC_TITLE_SEO}.`;

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
                name: "Tìm truyện",
                item: `${appUrl}/search-advanced`,
            },
            {
                "@type": "ListItem",
                position: 3,
                name: titleSeo,
                item: `${appUrl}/${content}/search-advanced?q=${q}`,
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
            <div className="px-3 mb-5">
                <SearchBookTemplate
                    content={content}
                    meta={{
                        urlSeo,
                        titleSeo,
                        descriptionSeo,
                    }}
                    options={{
                        q,
                        page,
                    }}
                />
            </div>
        </>
    );
}
