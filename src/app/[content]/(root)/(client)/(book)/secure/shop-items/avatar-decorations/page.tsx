import { Metadata } from "next";

import { Env } from "@/config/Env";
import ShopItemsTemplate from "@/components/Modules/SecureTemplate/ShopItemTemplate/page";
import { CategoryItemEnum } from "@/services/user.services";

const { NEXT_PUBLIC_TITLE_SEO } = Env

type Props = {
    params: {
        slugBook: string;
    };
};
export async function generateMetadata(): Promise<Metadata> {

    return {
        title: `Cửa hàng trang trí avatar - ${NEXT_PUBLIC_TITLE_SEO}`,
    };
}
export default async function ShopItemsPage({ params, searchParams }: Props & { searchParams: any }) {

    return (
        <>
            <ShopItemsTemplate category={CategoryItemEnum.AVATAR_OUTLINE}/>
        </>
    );
}
