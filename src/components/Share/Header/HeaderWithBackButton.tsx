"use client"

import { useRouter } from "next/navigation";
import IconAnglesLeft from "@/components/Modules/Icons/IconAnglesLeft";

interface IHeaderWithBackButton {
    title: string;
    // callbackUrl: string;
}
const HeaderWithBackButton = ({
    title,
    // callbackUrl,
}: IHeaderWithBackButton) => {
    const router = useRouter();
    return (
        <div className="mb-3 flex items-center bg-accent rounded-lg overflow-hidden">
            <button
                title=""
                className="w-10 h-10 hover:bg-muted outline-none"
                onClick={() => router.back()}
            >
                <IconAnglesLeft size={40} className="p-2 fill-gray-300" />
            </button>
            <div className="flex-1 text-center text-lg font-semibold uppercase">{title}</div>
            <div className="w-10 h-10"></div>
        </div>
    );
};

export default HeaderWithBackButton;
