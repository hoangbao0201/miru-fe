import { Metadata } from "next";

import { Env } from "@/config/Env";
import LuckyWheelTemplate from "@/components/Modules/SecureTemplate/LuckyWheelTemplate";

const { NEXT_PUBLIC_TITLE_SEO } = Env

type Props = {
    params: {
        slugBook: string;
    };
};
export async function generateMetadata(): Promise<Metadata> {

    return {
        title: `Game Vòng Quay May Mắn - ${NEXT_PUBLIC_TITLE_SEO}`,
    };
}
export default async function ShopItemsPage({ params, searchParams }: Props & { searchParams: any }) {

    return (
        <>
            <LuckyWheelTemplate />
        </>
    );
}
