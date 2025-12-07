import React, {
    ChangeEvent,
    Dispatch,
} from "react";

import { useDispatch } from "react-redux";

import IconPen from "@/components/Modules/Icons/IconPen";
import IconEye from "@/components/Modules/Icons/IconEye";
import IconMove from "@/components/Modules/Icons/IconMove";
import IconClose from "@/components/Modules/Icons/IconClose";
import IconSpinner from "@/components/Modules/Icons/IconSpinner";
import IconLanguage from "@/components/Modules/Icons/IconLanguage";
import IconCircleCheck from "@/components/Modules/Icons/IconCircleCheck";
import IconExclamation from "@/components/Modules/Icons/IconExclamation";
import {
    activeItem,
    IImageItem,
    ChapterStepEnum,
    StepStatusEnum,
} from "@/store/chapter/chapter.reducer";
import classNames from "@/utils/classNames";
import IconPlus from "@/components/Modules/Icons/IconPlus";

export type ItemImageLiteProps = {
    item: IImageItem;
    handleTranslate: Dispatch<string>;
    handleRemoveItem: Dispatch<string>;
    handleImportInputPrev: (e: ChangeEvent<HTMLInputElement>, indexImportPrev: string) => void;
};

const ItemImageLite = ({
    item,
    handleTranslate,
    handleRemoveItem,
    handleImportInputPrev
}: ItemImageLiteProps) => {
    const dispatch = useDispatch();

    return (
        <>
            <div
                style={{ transformOrigin: "50% 50%" }}
                className="pt-7 pb-1 pl-10 mx-auto group"
            >
                <div
                    style={{
                        boxShadow: "0 4px 16px #0003",
                    }}
                    className={classNames(
                        "relative w-32 h-24 bg-slate-900 group select-none border border-dashed rounded-lg flex items-center justify-center",
                    )}
                >
                    {
                        (item?.currentStep === ChapterStepEnum.IDLE || item?.currentStep === ChapterStepEnum.UPLOADING) && (
                            <div
                                className={classNames(
                                    "relative w-full h-4 bg-slate-600 m-1"
                                )}
                            ></div>
                        )
                    }
                    <div className="pl-2 h-7 rounded-bl-lg leading-7 line-clamp-1 text-sm text-left absolute bottom-0 left-0 right-2 bg-gradient-to-r from-black to-transparent text-white">
                        {item.name}
                    </div>

                    {item?.stepStatus === StepStatusEnum.PROCESSING ? (
                        item.currentStep === ChapterStepEnum.UPLOADING ? (
                            <div className="w-full h-4 absolute text-[12px] px-1">
                                <div
                                    className={classNames(
                                        "h-4 bg-green-600"
                                    )}
                                    style={{
                                        width: `${
                                            item?.uploadProgress ||
                                            0
                                        }%`,
                                    }}
                                ></div>
                                <span className="absolute inset-0 text-center">
                                    {item?.uploadProgress
                                        ? item?.uploadProgress + "%"
                                        : item?.currentStep}
                                </span>
                            </div>
                        ) : (
                            <div
                                className={`w-8 h-8 absolute drop-shadow-md`}
                            >
                                <IconSpinner className="w-8 h-8 p-2 animate-spin fill-gray-600 rounded-full bg-white/80" />
                            </div>
                        )
                    ) : (
                        <div className="z-1 absolute inset-0 flex items-center justify-center bg-black/20 group-hover:opacity-100 opacity-0">
                            {item?.currentStep === ChapterStepEnum.IDLE && (
                                <>
                                    <div className="z-10 flex items-center justify-between h-7 absolute -top-8 -left-9 right-0 p-0.5">
                                        {/* BUTTON REMOVE */}
                                        <button
                                            onClick={() =>
                                                handleRemoveItem(
                                                    item?.id
                                                )
                                            }
                                            className="rounded-md border border-slate-700 bg-red-600 cursor-pointer"
                                        >
                                            <IconClose className="w-7 h-7 p-1 fill-white" />
                                        </button>

                                        {/* BUTOTN VIEW DETAIL */}
                                        <button
                                            onClick={() =>
                                                dispatch(
                                                    activeItem({
                                                        id: item?.id,
                                                        previewUrl:
                                                            item?.previewUrl,
                                                    })
                                                )
                                            }
                                            className="rounded-md border border-slate-700 bg-slate-800 cursor-pointer"
                                        >
                                            <IconEye className="w-7 h-7 p-[6px] fill-white" />
                                        </button>

                                        {/* BUTTON TRANSLATE */}
                                        <button
                                            onClick={() =>
                                                handleTranslate(
                                                    item?.id
                                                )
                                            }
                                            className="rounded-md border border-slate-700 bg-slate-800 cursor-pointer"
                                        >
                                            <IconLanguage className="w-7 h-7 p-[6px] fill-white" />
                                        </button>

                                        {/* BUTTON EDIT */}
                                        <button className="rounded-md border border-slate-700 bg-slate-800 cursor-pointer">
                                            <IconPen className="w-7 h-7 p-[6px] fill-white" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {item?.stepStatus === StepStatusEnum.FAILED && (
                        <button
                            className={`w-10 h-10 absolute drop-shadow-md outline-none group-hover:hidden`}
                        >
                            <IconExclamation className="w-10 h-10 p-2 fill-white rounded-full bg-red-600" />
                        </button>
                    )}

                    {item?.currentStep === ChapterStepEnum.UPLOADING && item?.stepStatus === StepStatusEnum.DONE && (
                            <button
                                className={`w-8 h-8 absolute drop-shadow-md outline-none group-hover:hidden`}
                            >
                                <IconCircleCheck className="w-8 h-8 p-2 fill-white rounded-full bg-blue-600" />
                            </button>
                        )}

                    <div
                        className={classNames(
                            "absolute top-0 bottom-0 -left-9 w-8 z-0",
                            // !items.length && "w-full flex-1 col-span-full"
                        )}
                    >
                        <label
                            htmlFor={`inputFileImageImportPrev_${item?.id}`}
                            className={classNames(
                                "w-full h-full relative bg-slate-900 group select-none border border-dashed rounded-md flex items-center justify-center cursor-pointer overflow-hidden",
                            )}
                        >
                            <div
                                className={`top-0 bottom-0 right-0 left-0 flex items-center justify-center absolute transition-all`}
                            >
                                <IconPlus className="w-7 h-7 block fill-white z-10" />
                            </div>
                        </label>
                        <input
                            multiple
                            type="file"
                            className="hidden"
                            id={`inputFileImageImportPrev_${item?.id}`}
                            onChange={(e) => handleImportInputPrev(e, item?.id)}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ItemImageLite;
