import Image from "next/image";
import React, {
    forwardRef,
    HTMLAttributes,
    CSSProperties,
    Dispatch,
    ChangeEvent,
} from "react";

import { DraggableAttributes, UniqueIdentifier } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

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
    ISettings,
} from "@/store/chapter/chapter.reducer";
import LazyLoad from "react-lazyload";
import classNames from "@/utils/classNames";
import { useAppDispatch } from "@/store/store";

export type ItemImageProps = Omit<HTMLAttributes<HTMLDivElement>, "id"> & {
    isOverlay: boolean;
    item: IImageItem;
    settings: ISettings;
    isDragging?: boolean;
    dragAttributes?: DraggableAttributes;
    dragListeners?: SyntheticListenerMap | undefined;
    handleTranslate: Dispatch<string>;
    handleRemoveItem: Dispatch<string>;
    handleImportInputPrev: (
        e: ChangeEvent<HTMLInputElement>,
        indexImportPrev: string
    ) => void;
};

const ItemImage = forwardRef<HTMLDivElement, ItemImageProps>(
    (
        {
            item,
            settings,
            style,
            isOverlay,
            isDragging,
            dragListeners,
            dragAttributes,
            handleTranslate,
            handleRemoveItem,
            handleImportInputPrev,
        },
        ref
    ) => {
        const dispatch = useAppDispatch();
        const inlineStyles: CSSProperties = {
            ...style,
        };

        return (
            <>
                <div
                    ref={ref}
                    style={inlineStyles}
                    className="pt-8 pb-1 group select-none"
                >
                    <div
                        className={classNames(
                            "relative w-[130px] group border border-dashed rounded-lg",
                            isOverlay ? "bg-white/5 animate-wiggle" : "",
                            settings?.isShowImages ? "h-[170px]" : "h-[100px]"
                        )}
                    >
                        {!isOverlay && (
                            <>
                                {item?.previewUrl && (
                                    <>
                                        <LazyLoad
                                            once={true}
                                            placeholder={
                                                <div
                                                    className={classNames(
                                                        "w-[128px]",
                                                        settings?.isShowImages
                                                            ? "h-[168px]"
                                                            : "h-[98px]"
                                                    )}
                                                ></div>
                                            }
                                        >
                                            {settings?.isShowImages ? (
                                                <>
                                                    <Image
                                                        alt=""
                                                        title=""
                                                        unoptimized
                                                        width={100}
                                                        height={100}
                                                        loading="lazy"
                                                        src={item?.previewUrl}
                                                        className={classNames(
                                                            "w-[128px] h-[168px] object-contain mx-auto items-center",
                                                        )}
                                                    />
                                                </>
                                            ) : (
                                                <div className="w-full h-[98px] flex items-center justify-center">
                                                    <div className="w-full h-5 bg-slate-700"></div>
                                                </div>
                                            )}
                                            <div className="pl-2 h-7 leading-7 line-clamp-1 text-sm text-left rounded-bl-lg absolute bottom-0 left-0 right-0 bg-gradient-to-r from-black to-transparent text-white">
                                                {item.name}
                                            </div>
                                        </LazyLoad>

                                        <LazyLoad
                                            // unmountIfInvisible={true}
                                        >
                                            {!isDragging && (
                                                <>
                                                    {[
                                                        ChapterStepEnum.UPLOADING,
                                                    ].includes(
                                                        item.currentStep
                                                    ) &&
                                                        [
                                                            StepStatusEnum.PROCESSING,
                                                        ].includes(
                                                            item?.stepStatus
                                                        ) && (
                                                            <div className="w-full h-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute text-[12px] bg-slate-600">
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
                                                                        ? item?.uploadProgress +
                                                                          "%"
                                                                        : item?.currentStep}
                                                                </span>
                                                            </div>
                                                        )}

                                                    {[
                                                        ChapterStepEnum.IDLE,
                                                    ].includes(
                                                        item?.currentStep
                                                    ) &&
                                                        ![
                                                            StepStatusEnum.PROCESSING,
                                                        ].includes(
                                                            item?.stepStatus
                                                        ) && (
                                                            <div className="z-1 absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg group-hover:opacity-100 md:opacity-0">
                                                                <div className="z-10 flex items-center justify-between h-7 absolute top-0 -translate-y-1/2 left-0 right-0">
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

                                                                    {/* BUTTON VIEW DETAIL */}
                                                                    <button
                                                                        onClick={() =>
                                                                            dispatch(
                                                                                activeItem(
                                                                                    {
                                                                                        id: item?.id,
                                                                                        previewUrl:
                                                                                            item?.previewUrl,
                                                                                    }
                                                                                )
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

                                                                {/* DRAG HANDLE */}
                                                                <button
                                                                    {...dragListeners}
                                                                    {...dragAttributes}
                                                                    className="drag-handle w-10 h-10 drop-shadow-md outline-none cursor-grab active:cursor-grabbing"
                                                                >
                                                                    <IconMove className="w-10 h-10 p-2 fill-gray-600 rounded-md border border-white/5 bg-white/80" />
                                                                </button>
                                                            </div>
                                                        )}

                                                    {![
                                                        ChapterStepEnum.UPLOADING,
                                                    ].includes(
                                                        item.currentStep
                                                    ) &&
                                                        [
                                                            StepStatusEnum.PROCESSING,
                                                        ].includes(
                                                            item?.stepStatus
                                                        ) && (
                                                            <div className="w-8 h-8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute drop-shadow-md">
                                                                <IconSpinner className="w-8 h-8 p-2 animate-spin fill-gray-600 rounded-full bg-white/80" />
                                                            </div>
                                                        )}

                                                    {[
                                                        StepStatusEnum.FAILED,
                                                    ].includes(
                                                        item?.stepStatus
                                                    ) && (
                                                        <button className="w-10 h-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute drop-shadow-md outline-none group-hover:hidden">
                                                            <IconExclamation className="w-10 h-10 p-2 fill-white rounded-full bg-red-600" />
                                                        </button>
                                                    )}

                                                    {[
                                                        ChapterStepEnum.UPLOADING,
                                                    ].includes(
                                                        item.currentStep
                                                    ) &&
                                                        [
                                                            StepStatusEnum.DONE,
                                                        ].includes(
                                                            item?.stepStatus
                                                        ) && (
                                                            <button className="w-8 h-8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute drop-shadow-md outline-none group-hover:hidden">
                                                                <IconCircleCheck className="w-8 h-8 p-2 fill-white rounded-full bg-blue-600" />
                                                            </button>
                                                        )}
                                                </>
                                            )}
                                        </LazyLoad>

                                        {isDragging && (
                                            <div className="z-1 absolute inset-0 flex items-center justify-center bg-black/20 group-hover:opacity-100 md:opacity-0">
                                                <button
                                                    {...dragListeners}
                                                    {...dragAttributes}
                                                    className="drag-handle w-10 h-10 drop-shadow-md outline-none cursor-grab active:cursor-grabbing"
                                                >
                                                    <IconMove className="w-10 h-10 p-2 fill-gray-600 rounded-md border border-white/5 bg-white/80" />
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </>
        );
    }
);

ItemImage.displayName = "ItemImage";
export default ItemImage;
