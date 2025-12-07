import { Metadata, ResolvingMetadata } from "next";

import { BreadcrumbList } from "schema-dts";

import { Env } from "@/config/Env";
import { JsonLd } from "@/utils/JsonLd";
import getDomainConfig from "@/lib/domain";
import { ContentPageEnum } from "@/common/data.types";
import { listTagSeo } from "@/constants/data";
import { getListTagsBookApi } from "@/store/book/book.api";
import SearchAdvancedBookTemplate from "@/components/Modules/SearchAdvancedBookTemplate";

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

    const { genres = "" } = searchParams;
    const content =
        (params?.content as ContentPageEnum) || ContentPageEnum.comics;

    const urlSeo = `${appUrl}/${content}/search-advanced`;
    const titleSeo = `Tìm truyện nâng cao hay nhất - Đọc Online Miễn Phí | ${NEXT_PUBLIC_TITLE_SEO}`;
    const descriptionSeo = `Tìm truyện ❶✔️ Web đọc truyện tranh online lớn nhất - Truyện tranh hay nhất, chất lượng được cập nhật liên tục mỗi ngày`;

    return {
        title: titleSeo,
        description: descriptionSeo,
        category: NEXT_PUBLIC_TITLE_SEO,
        keywords: [...listTagSeo[content]],
        publisher: appUrl,
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
export default async function SearchBookPage({
    params,
    searchParams,
}: SearchParamProps & ParamsProps) {
    const { appUrl } = await getDomainConfig();

    const {
        notgenres: notgenres = "",
        isShow: isShow = "false",
        genres: genres = "",
        page: page = "1",
    } = searchParams;
    const content =
        (params?.content as ContentPageEnum) || ContentPageEnum.comics;

    const categoryRes = await getListTagsBookApi({
        options: {
            take: 60,
            category: content,
        },
        revalidate: 24 * 60 * 60,
    });

    const genresTag =
        typeof genres === "string" && genres !== "" ? genres.split(",") : [];
    const notgenresTag =
        typeof notgenres === "string" && notgenres !== ""
            ? notgenres.split(",")
            : [];
    let statusTags: { [key: string]: "can" | "not" | "have" } = {};
    for (const key in genresTag) {
        statusTags[genresTag[key]] = "have";
    }
    for (const key in notgenresTag) {
        statusTags[notgenresTag[key]] = "not";
    }

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
                <SearchAdvancedBookTemplate
                    content={content}
                    options={{
                        genresTag,
                        notgenresTag,
                        statusTags: statusTags,
                        isShow: isShow === "true" ? true : false,
                        page: page ? parseInt(page as string) : 1,
                    }}
                    category={categoryRes?.data}
                />
            </div>
        </>
    );
}
