import { Metadata, ResolvingMetadata } from "next";

import { Env } from "@/config/Env";
import getDomainConfig from "@/lib/domain";
import { listTagSeo } from "@/constants/data";
import { ContentPageEnum } from "@/common/data.types";
import TopFollowBooksTemplate from "@/components/Modules/TopFollowBooksTemplate";

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

    const { NEXT_PUBLIC_TITLE_SEO } = Env
    
    const previousImages = (await parent).openGraph?.images || [];
    const content =
        (params?.content as ContentPageEnum) || ContentPageEnum.comics;

    return {
        title: `Top theo dõi - Website chính thức - ${NEXT_PUBLIC_TITLE_SEO}`,
        description: `Top theo dõi - Cùng tham gia đọc truyện và thảo luận với hơn 💚50 triệu thành viên tại ${NEXT_PUBLIC_TITLE_SEO}`,
        authors: { name: NEXT_PUBLIC_TITLE_SEO, url: appUrl },
        category: NEXT_PUBLIC_TITLE_SEO,
        keywords: [...listTagSeo[content]],
        publisher: NEXT_PUBLIC_TITLE_SEO,
        openGraph: {
            title: `Top theo dõi - Website chính thức - ${NEXT_PUBLIC_TITLE_SEO}`,
            siteName: NEXT_PUBLIC_TITLE_SEO,
            url: appUrl,
            type: "website",
            images: [
                `${appUrl}/static/images/bg_page.png`,
                ...previousImages,
            ],
            description: `Web Top theo dõi - Cùng tham gia đọc truyện và thảo luận với hơn 💚50 triệu thành viên tại ${NEXT_PUBLIC_TITLE_SEO}`,
        },
        alternates: {
            canonical: appUrl,
        },
    };
}

export default async function TopFollowBooksPage({
    params,
    searchParams,
}: SearchParamProps & { params: { content: ContentPageEnum } }) {
    const page = searchParams.page ? parseInt(searchParams.page as string) : 1;
    const content =
        (params?.content as ContentPageEnum) || ContentPageEnum.comics;

    return (
        <>
            <div className="px-3 mb-5">
                <TopFollowBooksTemplate
                    content={content}
                    title={"Truyện nhiều theo dõi"}
                    options={{
                        page
                    }}
                />
            </div>
        </>
    );
}
