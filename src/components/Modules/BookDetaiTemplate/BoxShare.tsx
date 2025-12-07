"use client";

import Link from "next/link";
import { Env } from "@/config/Env";
import IconCopy from "../Icons/IconCopy";
import IconPinterest from "../Icons/IconPinterest";
import IconWhatsapp from "../Icons/IconWhatsapp";
import IconTwitter from "../Icons/IconTwitter";
import IconFacebook from "../Icons/IconFacebook";
import { useCopyToClipboard } from "usehooks-ts";
import { toast } from "sonner";

interface BoxShareProps {
    url: string;
    content: string;
}
const BoxShare = ({ url, content }: BoxShareProps) => {
    const [_, copy] = useCopyToClipboard();

    const handleCopy = (text: string) => {
        copy(text)
            .then(() => {
                toast("Sao chép thành công!", {
                    duration: 1000,
                    position: "bottom-center",
                });
                console.log("Copied!", { text });
            })
            .catch((error) => {
                console.error("Failed to copy!", error);
            });
    };

    return (
        <>
            <div className="p-3 bg-accent">
                <h2 className="text-sm font-bold mb-4 uppercase">
                    Chia sẽ
                </h2>
                <div className="py-1 px-2 space-x-2 select-all flex items-center justify-between rounded-md bg-accent-10">
                    <p className="break-all whitespace-normal overflow-hidden">{url}</p>
                    <button
                        onClick={() =>
                            handleCopy(url)
                        }
                        className="bg-accent-30 hover:bg-accent-30-hover rounded-md"
                    >
                        <IconCopy className="w-8 h-8 fill-white p-[6px]" />
                    </button>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                    <Link
                        prefetch={false}
                        title="Chi sẽ truyện lên Facebook"
                        target="_blank"
                        href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
                    >
                        <div className="rounded-md bg-blue-600">
                            <IconFacebook className="fill-white w-10 h-10 px-2" />
                        </div>
                    </Link>
                    <Link
                        prefetch={false}
                        title="Chi sẽ truyện lên Twitter"
                        target="_blank"
                        href={`https://twitter.com/intent/tweet?url=${url}`}
                    >
                        <div className="rounded-md bg-blue-500">
                            <IconTwitter className="fill-white w-10 h-10 px-2" />
                        </div>
                    </Link>
                    <Link
                        prefetch={false}
                        title="Chi sẽ truyện lên Pinterest"
                        target="_blank"
                        href={`https://www.pinterest.com/pin/create/button?url=${url}`}
                    >
                        <div className="rounded-md bg-red-600">
                            <IconPinterest className="fill-white w-10 h-10 px-2" />
                        </div>
                    </Link>
                    <Link
                        prefetch={false}
                        target="_blank"
                        title="Chi sẽ truyện lên Whatsapp"
                        href={`whatsapp://send?text=${url}`}
                    >
                        <div className="rounded-md bg-green-500">
                            <IconWhatsapp className="fill-white w-10 h-10 px-2" />
                        </div>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default BoxShare;
