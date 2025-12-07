import { Metadata } from "next";

import { Env } from "@/config/Env";
import getDomainConfig from "@/lib/domain";
import { listTagSeo } from "@/constants/data";
import { ContentPageEnum } from "@/common/data.types";
import NewBooksTemplate from "@/components/Modules/NewBooksTemplate";

interface ParamsProps {
    params: {
        content: ContentPageEnum;
    };
}

export async function generateMetadata({
    params,
    searchParams,
}: SearchParamProps & ParamsProps): Promise<Metadata> {
    const { appUrl } = await getDomainConfig();

    const { NEXT_PUBLIC_TITLE_SEO } = Env;
    const content =
        (params?.content as ContentPageEnum) || ContentPageEnum.comics;

    return {
        title: `Đọc Truyện Tranh Online - Website chính thức - ${NEXT_PUBLIC_TITLE_SEO}`,
        description: `Web đọc truyện tranh online lớn nhất được cập nhật liên tục mỗi ngày - Cùng tham gia đọc truyện và thảo luận với hơn 💚100 triệu thành viên tại ${NEXT_PUBLIC_TITLE_SEO}`,
        authors: { name: NEXT_PUBLIC_TITLE_SEO, url: appUrl },
        category: NEXT_PUBLIC_TITLE_SEO,
        keywords: [...listTagSeo[content]],
        publisher: NEXT_PUBLIC_TITLE_SEO,
        openGraph: {
            title: `Đọc Truyện Tranh Online - Website chính thức - ${NEXT_PUBLIC_TITLE_SEO}`,
            siteName: NEXT_PUBLIC_TITLE_SEO,
            url: `${appUrl}/hot`,
            type: "website",
            images: [],
            description: `Web đọc truyện tranh online lớn nhất được cập nhật liên tục mỗi ngày - Cùng tham gia đọc truyện và thảo luận với hơn 💚100 triệu thành viên tại ${NEXT_PUBLIC_TITLE_SEO}`,
        },
        alternates: {
            canonical: `${appUrl}/hot`,
        },
    };
}
export default async function NewBooksPage({
    params,
    searchParams,
}: SearchParamProps & ParamsProps) {
    const page = searchParams.page ? parseInt(searchParams.page as string) : 1
    const content =
        (params?.content as ContentPageEnum) || ContentPageEnum.comics;

    // const jsonLd = books?.map((book, index) => {
    //     return ({
    //         '@type': 'ListItem',
    //         position: index + 1,
    //         url: `${MAIN_BASE_URL}/books/${book?.slug}-${book?.bookId}`,
    //     })
    // })

    return (
        <>
            {/* <Script
                id="Hotpage"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    "@context": "http://schema.org",
                    "@type": "ItemList",
                    itemListElement: jsonLd
                })}}
            /> */}
            <div className="px-3 mb-5">
                <NewBooksTemplate
                    content={content}
                    title={"Truyện tranh mới"}
                    options={{
                        page,
                        sortBy: "CREATED_AT",
                    }}
                />
            </div>
        </>
    );
}
