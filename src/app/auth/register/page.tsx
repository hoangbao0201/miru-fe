import { Metadata } from "next";

import { Env } from "@/config/Env";
import getDomainConfig from "@/lib/domain";
import { listTagSeo } from "@/constants/data";
import { ContentPageEnum } from "@/common/data.types";
import RegisterTemplate from "@/components/Modules/Auth/RegisterTemplate";

export async function generateMetadata(): Promise<Metadata> {
    const { appUrl } = await getDomainConfig();

    const { NEXT_PUBLIC_TITLE_SEO } = Env;

    return {
        title: `Đăng kí - ${NEXT_PUBLIC_TITLE_SEO}`,
        description: `${NEXT_PUBLIC_TITLE_SEO} Trang đăng kí`,
        category: NEXT_PUBLIC_TITLE_SEO,
        keywords: [...listTagSeo[ContentPageEnum.comics]],
        publisher: NEXT_PUBLIC_TITLE_SEO,
        openGraph: {
            title: `Đăng kí - ${NEXT_PUBLIC_TITLE_SEO}`,
            siteName: NEXT_PUBLIC_TITLE_SEO,
            url: `${appUrl}/auth/login`,
            type: "website",
            images: [],
            description: `${NEXT_PUBLIC_TITLE_SEO} Trang đăng kí`,
        },
        alternates: {
            canonical: `${appUrl}/auth/register`,
        },
    };
}
const LoginPage = async ({ searchParams }: SearchParamProps) => {
    const { token, returnurl }: any = searchParams;
    return (
        <>
            <RegisterTemplate token={token} returnurl={returnurl?.toString()} />
        </>
    );
};

export default LoginPage;
