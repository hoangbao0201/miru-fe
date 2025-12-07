import { Metadata, ResolvingMetadata } from "next";

import { Env } from "@/config/Env";
import getDomainConfig from "@/lib/domain";
import { listTagSeo } from "@/constants/data";
import { ContentPageEnum } from "@/common/data.types";
import BookHomeTemplate from "@/components/Modules/BookHomeTemplate";

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

    const previousImages = (await parent).openGraph?.images || [];
    const content =
        (params?.content as ContentPageEnum) || ContentPageEnum.comics;

    const urlSeo = `${appUrl}/${content}`;
    const titleSeo = `${NEXT_PUBLIC_TITLE_SEO} ${content.replace(/\b\w/g, (char) =>
        char.toUpperCase()
    )} - Truyện Tranh Hay Nhất Hôm Nay - Truyện Mới, Đọc Miễn Phí!`;
    const descriptionSeo = `📖 Thế giới truyện tranh sống động! Đọc truyện online miễn phí, cập nhật nhanh mỗi ngày cùng cộng đồng ${NEXT_PUBLIC_TITLE_SEO}.`;

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
            type: "website",
            images: [
                `${appUrl}/static/images/bg_page.png`,
                ...previousImages,
            ],
            description: descriptionSeo,
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
    const page = searchParams.page ? parseInt(searchParams.page as string) : 1;
    const content =
        (params?.content as ContentPageEnum) || ContentPageEnum.comics;

    return (
        <>  
            <div className="px-3 mb-5">
                <BookHomeTemplate
                    content={content}
                    options={{ page }}
                    title={"Truyện mới cập nhật"}
                />
            </div>
        </>
    );
}
