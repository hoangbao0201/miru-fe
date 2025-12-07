import { Metadata } from "next";

import { Env } from "@/config/Env";
import { listTagSeo } from "@/constants/data";
import { ContentPageEnum } from "@/common/data.types";
import LoginTemplate from "@/components/Modules/Auth/LoginTemplate";
import getDomainConfig from "@/lib/domain";

export async function generateMetadata(): Promise<Metadata> {
    const { appUrl } = await getDomainConfig();

    const { NEXT_PUBLIC_TITLE_SEO } = Env

    return {
        title: `Đăng nhập - ${NEXT_PUBLIC_TITLE_SEO}`,
        description: `${NEXT_PUBLIC_TITLE_SEO} Trang đăng nhập`,
        category: NEXT_PUBLIC_TITLE_SEO,
        keywords: [...listTagSeo[ContentPageEnum.comics]],
        publisher: NEXT_PUBLIC_TITLE_SEO,
        openGraph: {
            title: `Đăng nhập - ${NEXT_PUBLIC_TITLE_SEO}`,
            siteName: NEXT_PUBLIC_TITLE_SEO,
            url: `${appUrl}/auth/login`,
            type: "website",
            images: [],
            description: `${NEXT_PUBLIC_TITLE_SEO} Trang đăng nhập`,
        },
        alternates: {
            canonical: `${appUrl}/auth/login`,
        },
    };
}
const LoginPage = async ({ searchParams }: SearchParamProps) => {
    const { token, returnurl, isRegister = false }: any = searchParams;

    return (
        <>
            <LoginTemplate token={token} returnurl={returnurl} />
        </>
    )
}

export default LoginPage;