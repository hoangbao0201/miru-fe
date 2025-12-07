import { Metadata } from "next";

import { Env } from "@/config/Env";
import UserProfileTemplate from "@/components/Modules/SecureTemplate/UserProfileTemplate";

const { NEXT_PUBLIC_TITLE_SEO } = Env

type Props = {
    params: {
        slugBook: string;
    };
};
export async function generateMetadata(): Promise<Metadata> {

    return {
        title: `Thông tin chung - ${NEXT_PUBLIC_TITLE_SEO}`,
    };
}
export default async function UserProfilePage({ params, searchParams }: Props & { searchParams: any }) {

    return (
        <>
            <UserProfileTemplate />
        </>
    );
}
