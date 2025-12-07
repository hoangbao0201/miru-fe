import { Metadata } from "next";

import { Env } from "@/config/Env";
import InventoryTemplate from "@/components/Modules/SecureTemplate/InventoryTemplate/page";

const { NEXT_PUBLIC_TITLE_SEO } = Env

type Props = {
    params: {
        slugBook: string;
    };
};
export async function generateMetadata(): Promise<Metadata> {

    return {
        title: `Kho trang bị - ${NEXT_PUBLIC_TITLE_SEO}`,
    };
}
export default async function ShopItemsPage({ params, searchParams }: Props & { searchParams: any }) {

    return (
        <>
            <InventoryTemplate />
        </>
    );
}
