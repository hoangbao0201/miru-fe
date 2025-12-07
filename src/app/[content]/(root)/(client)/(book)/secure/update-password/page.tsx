import { Metadata } from "next";

import { Env } from "@/config/Env";
import UpdatePassword from "@/components/Modules/SecureTemplate/UpdatePassword";

const { NEXT_PUBLIC_TITLE_SEO } = Env

type Props = {
    params: {
        slugBook: string;
    };
};
export async function generateMetadata(): Promise<Metadata> {

    return {
        title: `Đăng nhập bằng tài khoản Google - ${NEXT_PUBLIC_TITLE_SEO}`,
    };
}
export default async function SecurePage({ params, searchParams }: Props & { searchParams: any }) {

    return (
        <>
            <UpdatePassword />
        </>
    );
}
