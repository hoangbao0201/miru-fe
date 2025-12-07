import { Metadata } from "next";

import { Env } from "@/config/Env";
import { ContentPageEnum } from "@/common/data.types";
import UserHistoryTemplate from "@/components/Modules/SecureTemplate/UserHistoryTemplate";

const { NEXT_PUBLIC_TITLE_SEO } = Env

export async function generateMetadata(): Promise<Metadata> {

    return {
        title: `Thông tin chung - ${NEXT_PUBLIC_TITLE_SEO}`,
    };
}
export default async function UserProfilePage({ params, searchParams }: SearchParamProps & { params: { content: ContentPageEnum } }) {
    const { content } = params;

    return (
        <>
            <UserHistoryTemplate content={content}/>
        </>
    );
}
