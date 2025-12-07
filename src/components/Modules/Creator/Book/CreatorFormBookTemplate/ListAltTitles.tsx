import IconClose from "@/components/Modules/Icons/IconClose";
import { flagLink } from "@/constants/flag";
import Image from "next/image";
import { IAltTitleBookType } from "@/store/book/book.type";

const ListAltTitles = ({
    data,
    handleAltTitlesAction,
}: {
    data: IAltTitleBookType[];
    handleAltTitlesAction: ({
        action,
        payload,
    }: {
        action: "create" | "delete";
        payload: { index: number };
    }) => void;
}) => {
    return (
        <>
            <div className="divide-y">
                {data.map((item, index) => {
                    const languageCode = item.languageCode;
                    const title = item.title;
                    const flagUrl = flagLink(languageCode);

                    return (
                        <div
                            key={index}
                            className="flex items-center py-2 space-x-1 font-semibold"
                        >
                            <Image
                                unoptimized
                                width={150}
                                height={100}
                                alt={`${languageCode} flag`}
                                className="w-11 h-8"
                                src={flagUrl}
                            />
                            <div className="px-2 h-8 leading-8 w-full bg-accent-10">
                                {title}
                            </div>
                            <button
                                onClick={() => {
                                    handleAltTitlesAction({
                                        action: "delete",
                                        payload: {
                                            index,
                                        },
                                    });
                                }}
                                className="bg-red-600"
                            >
                                <IconClose className="fill-white p-1 w-[32px] h-[32px]" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default ListAltTitles;