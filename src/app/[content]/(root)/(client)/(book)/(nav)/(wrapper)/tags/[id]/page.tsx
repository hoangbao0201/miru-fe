import { Metadata, ResolvingMetadata } from "next";

import { BreadcrumbList } from "schema-dts";

import { Env } from "@/config/Env";
import { JsonLd } from "@/utils/JsonLd";
import { ContentPageEnum } from "@/common/data.types";
import { listTagSeo } from "@/constants/data";
import GenreBookTemplate from "@/components/Modules/GenreBookTemplate";
import getDomainConfig from "@/lib/domain";

const { NEXT_PUBLIC_TITLE_SEO } = Env;

interface ParamsProps {
    params: {
        content: ContentPageEnum;
    };
}

export async function generateMetadata(
    { params, searchParams }: SearchParamProps & ParamsProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { appUrl } = await getDomainConfig();

    const id = params?.id as ContentPageEnum;
    const content =
        (params?.content as ContentPageEnum) || ContentPageEnum.comics;

    const tag = id;
    const urlSeo = `${appUrl}/${content}/tags/${id}`;
    const titleSeo = `Top Truyện ${tag} Hay Nhất - Cập Nhật Mỗi Ngày | ${NEXT_PUBLIC_TITLE_SEO}`;
    const descriptionSeo = `📖 Khám phá bộ sưu tập truyện ${tag} hay nhất 🔥. Đọc truyện tranh online chất lượng cao, cập nhật nhanh tại ${NEXT_PUBLIC_TITLE_SEO}! 🚀`;

    return {
        title: titleSeo,
        description: descriptionSeo,
        category: NEXT_PUBLIC_TITLE_SEO,
        keywords: [...listTagSeo[content]],
        publisher: NEXT_PUBLIC_TITLE_SEO,
        openGraph: {
            title: titleSeo,
            siteName: NEXT_PUBLIC_TITLE_SEO,
            url: urlSeo,
            type: "website",
            images: [],
            description: descriptionSeo,
        },
        alternates: {
            canonical: urlSeo,
        },
    };
}
export default async function GenreBookPage({
    params,
    searchParams,
}: SearchParamProps & ParamsProps) {
    const { appUrl } = await getDomainConfig();

    const id = params?.id;
    const page = searchParams.page ? parseInt(searchParams.page as string) : 1;
    const content =
        (params?.content as ContentPageEnum) || ContentPageEnum.comics;

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
                name: "Truyện thể loại " + id,
                item: `${appUrl}/tags/${id}`,
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
                <GenreBookTemplate
                    title={`Truyện thể loại ${id}`}
                    content={content}
                    options={{ id, page }}
                />
            </div>
        </>
    );
}
