import Image from "next/image";
import { Dispatch, Fragment } from "react";

import classNames from "@/utils/classNames";
import { Dialog } from "@headlessui/react";
import IconClose from "@/components/Modules/Icons/IconClose";
import { useAppDispatch, useAppSelector } from "@/store/store";
import IconArrowUp from "@/components/Modules/Icons/IconArrowUp";
import { activeItem, removeActiveItem } from "@/store/chapter/chapter.reducer";

interface ModalShowImagesProps {
    image: { id: string; previewUrl: string | null };
}
const ModalShowImages = ({ image }: ModalShowImagesProps) => {
    const dispatch = useAppDispatch();
    const chapterSlice = useAppSelector((state) => state.chapterSlice);

    const index = chapterSlice.items.findIndex((item) => item.id === image.id);
    const isPrevDisabled = index <= 0;
    const isNextDisabled = index >= chapterSlice.items.length - 1;

    const actionSwitchImageActive = (action: "NEXT" | "PREV") => {
        if (!chapterSlice?.items?.length) return;

        let newIndex = index;
        if (action === "NEXT" && !isNextDisabled) newIndex++;
        if (action === "PREV" && !isPrevDisabled) newIndex--;

        const nextImage = chapterSlice.items[newIndex];
        if (nextImage) {
            dispatch(
                activeItem({
                    id: nextImage.id,
                    previewUrl: nextImage.previewUrl,
                })
            );
        }
    };

    const handleCloseModal = () => {
        // if (image?.previewUrl?.startsWith("blob:")) {
        //     URL.revokeObjectURL(image.previewUrl);
        // }
        dispatch(removeActiveItem());
    };

    return (
        <Dialog as={Fragment} open={true} onClose={handleCloseModal}>
            <div className="fixed inset-0 z-[150] flex flex-col items-center justify-center p-4">
                <Dialog.Overlay className="fixed inset-0 bg-black/50 z-[151]" />
                <div className="z-[152] overflow-y-auto py-3 px-10 relative bg-slate-800 max-w-[600px] w-full mx-auto shadow-lg">
                    {/* Prev button */}
                    <div
                        className={classNames(
                            "absolute top-0 bottom-0 left-0 w-10 flex items-center justify-center",
                            isPrevDisabled
                                ? "opacity-40 cursor-not-allowed"
                                : "cursor-pointer"
                        )}
                        onClick={() =>
                            !isPrevDisabled && actionSwitchImageActive("PREV")
                        }
                    >
                        <div className="w-full h-full relative bg-slate-800 hover:bg-slate-700 group select-none flex items-center justify-center">
                            <IconArrowUp className="size-10 p-2 fill-white -rotate-90" />
                        </div>
                    </div>

                    {/* Image */}
                    <div className="overflow-y-auto w-full h-full">
                        <div className="text-white text-center  w-full">
                            <h3 className="bg-blue-900 leading-6 text-sm h-6">{chapterSlice?.items?.[index]?.name || ""}</h3>
                            <p className="bg-slate-800 px-3 py-2 text-sm">Ảnh gửi lên là chất lượng cao nhất, bạn yên tâm nhé!</p>
                        </div>
                        <div className="">
                            <Image
                                alt=""
                                unoptimized
                                width={500}
                                height={500}
                                loading="lazy"
                                className="w-full"
                                src={image?.previewUrl || ""}
                            />
                        </div>
                    </div>

                    {/* Next button */}
                    <div
                        className={classNames(
                            "absolute top-0 bottom-0 right-0 w-10 flex items-center justify-center",
                            isNextDisabled
                                ? "opacity-40 cursor-not-allowed"
                                : "cursor-pointer"
                        )}
                        onClick={() =>
                            !isNextDisabled && actionSwitchImageActive("NEXT")
                        }
                    >
                        <div className="w-full h-full relative bg-slate-800 hover:bg-slate-700 group select-none flex items-center justify-center">
                            <IconArrowUp className="size-10 p-2 fill-white rotate-90" />
                        </div>
                    </div>
                </div>

                {/* Close button */}
                <button
                    onClick={handleCloseModal}
                    className="z-[152] my-2 outline-none border rounded-full bg-slate-800/60 hover:bg-slate-800/90"
                >
                    <IconClose className="w-10 h-10 p-2 fill-white" />
                </button>
            </div>
        </Dialog>
    );
};

export default ModalShowImages;
