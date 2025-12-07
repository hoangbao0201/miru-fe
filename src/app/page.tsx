import { Metadata, ResolvingMetadata } from "next";

import { Env } from "@/config/Env";
import getDomainConfig from "@/lib/domain";
import { listTagSeo } from "@/constants/data";
import { ContentPageEnum } from "@/common/data.types";
import WelcomeTemplate from "@/components/Modules/WelcomeTemplate";

const { NEXT_PUBLIC_TITLE_SEO } = Env;

export async function generateMetadata(
    { searchParams }: SearchParamProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { appUrl } = await getDomainConfig();
    const previousImages = (await parent).openGraph?.images || [];

    const urlSeo = `${appUrl}`;
    const titleSeo = `${NEXT_PUBLIC_TITLE_SEO} - Truyện Tranh Hay Nhất Hôm Nay | Đọc Online Miễn Phí`;
    const descriptionSeo = `🌟 Kho truyện tranh khổng lồ - Nơi hội tụ hàng triệu độc giả đam mê truyện tranh tại ${NEXT_PUBLIC_TITLE_SEO}. Cập nhật nhanh, đọc ngay!`;

    return {
        title: titleSeo,
        description: descriptionSeo,
        authors: { name: NEXT_PUBLIC_TITLE_SEO, url: appUrl },
        category: NEXT_PUBLIC_TITLE_SEO,
        keywords: [
            ...listTagSeo[ContentPageEnum.comics],
        ],
        publisher: NEXT_PUBLIC_TITLE_SEO,
        openGraph: {
            title: titleSeo,
            siteName: NEXT_PUBLIC_TITLE_SEO,
            url: urlSeo,
            type: "website",
            images: [`${appUrl}/static/images/bg_page.png`, ...previousImages],
            description: descriptionSeo,
        },
        alternates: {
            canonical: urlSeo,
        },
    };
}

export default async function HomePage() {
    const { appUrl } = await getDomainConfig();
    return <WelcomeTemplate appUrl={appUrl} />;
}
