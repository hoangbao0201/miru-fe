/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useRef, useState } from "react";
import { useSession } from "next-auth/react";

import JSZip from "jszip";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { saveAs } from "file-saver";

import classNames from "@/utils/classNames";
import IconEye from "@/components/Modules/Icons/IconEye";
import IconMove from "@/components/Modules/Icons/IconMove";
import IconClose from "@/components/Modules/Icons/IconClose";
import IconSpinner from "@/components/Modules/Icons/IconSpinner";
import IconCircleCheck from "@/components/Modules/Icons/IconCircleCheck";
import IconExclamation from "@/components/Modules/Icons/IconExclamation";
import ModalShowImages from "../../Chapter/CreatorFormChapterTemplate/ModalShowImages";
import {
    StepStatusEnum,
    ChapterStepEnum,
} from "@/store/chapter/chapter.reducer";

interface IItem {
    id: string;
    name: string;
    previewUrl: string;
    stepStatus: StepStatusEnum;
    currentStep: ChapterStepEnum;
}

const DownLoadImagesTemplate = () => {
    const localFilesRef = useRef<Record<string, File>>({});

    const [isLoading, setIsLoading] = useState("");
    const [dataContent, setDataContent] = useState("");
    const [originalLink, setOriginalLink] = useState("");
    const [dataItems, setDataItems] = useState<IItem[]>([]);
    const [activeItem, setActiveItem] = useState<IItem | null>(null);
    const [optionSelect, setOptionSelect] = useState<string | null>(null);
    const [listOptionsImages, setListOptionsImages] = useState<
        Record<string, string[]>
    >({});

    const handlePasteOriginal = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setOriginalLink(text.trim());
        } catch (error) {
            alert("Nội dung xảy ra lỗi!");
        }
    };

    const handlePasteDataContent = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setDataContent(text.trim());
        } catch (error) {
            alert("Nội dung xảy ra lỗi!");
        }
    };

    const handleApplyImages = () => {
        if (!optionSelect) {
            alert("Nhập thất bại!");
            return;
        }

        const urls = listOptionsImages[optionSelect];
        if (!urls) {
            alert("Nhập thất bại!");
            return;
        }
        let originUrl = "";
        try {
            const url = new URL(originalLink, window.location.origin);
            originUrl = url.origin;
        } catch (e) {
            console.warn("Invalid originalLink:", originalLink);
        }

        const initialDataImgs: IItem[] = urls.map((url) => ({
            id: nanoid(),
            previewUrl: `/api/image/load?referer=${originUrl}&url=${url}`,
            name: url.slice(-10),
            currentStep: ChapterStepEnum.IDLE,
            stepStatus: StepStatusEnum.DONE,
        }));

        setDataItems(initialDataImgs);
    };

    const handleConvertDataImages = () => {
        try {
            const imgLinks = new Set();
            const regex = originalLink.includes("bbbokkk")
                ? /"(https?:\/\/[^"]+)"/g
                : /<img[^>]+(?:src|data-src)="([^"]+)"/g;
            let match;

            while ((match = regex.exec(dataContent)) !== null) {
                const url = match[1];
                if (url.startsWith("http://") || url.startsWith("https://")) {
                    imgLinks.add(url);
                }
            }
            const urls = [...imgLinks];
            if (!urls || !Array.isArray(urls)) {
                alert("Nhập thất bại!");
                return;
            }

            const urlObj: Record<string, string[]> = {};
            urls.forEach((url) => {
                if (typeof url === "string") {
                    const domain = new URL(url).origin;
                    if (urlObj[domain]) {
                        urlObj[domain].push(url);
                    } else {
                        urlObj[domain] = [url];
                    }
                }
            });
            setListOptionsImages(urlObj);
            if (urlObj && Object.entries(urlObj).length > 0) {
                setOptionSelect(Object.keys(urlObj)[0]);
            }
        } catch (error) {
            toast.error("Chuyển đổi thất bại!", { duration: 3000 });
        } finally {
            setIsLoading("");
        }
    };

    const handleRemoveItem = (id: string) => {
        const item = dataItems.find((i) => i.id === id);
        if (!item) return;

        if (item.previewUrl) {
            URL.revokeObjectURL(item.previewUrl);
        }
        delete localFilesRef.current[id];

        setDataItems((prev) => prev.filter((i) => i.id !== id));
    };

    const handleRemoveItemList = (ids: string[]) => {
        if (!ids?.length) return;

        for (const item of dataItems) {
            if (ids.includes(item.id)) {
                if (item.previewUrl) {
                    URL.revokeObjectURL(item.previewUrl);
                }
                delete localFilesRef.current[item.id];
            }
        }

        setDataItems((prev) => prev.filter((item) => !ids.includes(item.id)));
    };

    const addBannerToImage = async (
        image: {
            id: string;
            bitmap: ImageBitmap;
            width: number;
            height: number;
        },
        banner: ImageBitmap,
        position: "top" | "bottom"
    ) => {
        const scale = image.width / banner.width;
        const bannerHeight = banner.height * scale;

        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height =
            position === "top"
                ? bannerHeight + image.height
                : image.height + bannerHeight;

        const ctx = canvas.getContext("2d")!;
        if (position === "top") {
            ctx.drawImage(banner, 0, 0, image.width, bannerHeight);
            ctx.drawImage(image.bitmap, 0, bannerHeight);
        } else {
            ctx.drawImage(image.bitmap, 0, 0);
            ctx.drawImage(banner, 0, image.height, image.width, bannerHeight);
        }

        return {
            id: image.id,
            width: canvas.width,
            height: canvas.height,
            bitmap: await createImageBitmap(canvas),
        };
    };

    const handleUpdateItem = (updated: Partial<IItem> & { id: string }) => {
        setDataItems((prev) =>
            prev.map((item) =>
                item.id === updated.id ? { ...item, ...updated } : item
            )
        );
    };

    const handleMergeImages = async (
        items: IItem[]
    ): Promise<null | IItem[]> => {
        if (status !== "authenticated") return null;
        try {
            const images: {
                bitmap: ImageBitmap;
                height: number;
                width: number;
                id: string;
            }[] = [];
            const MAX_MB = 8;

            for (const item of items) {
                try {
                    const blob = localFilesRef.current[item.id];
                    if (!blob) continue;

                    const bitmap = await createImageBitmap(blob);
                    const { width, height } = bitmap;

                    const bytesPerPixel = 4;
                    // const totalSize = width * height * bytesPerPixel;

                    images.push({
                        bitmap,
                        height,
                        width,
                        id: item.id,
                    });

                    // if (totalSize <= MAX_BYTES) {
                    //     images.push({
                    //         bitmap,
                    //         height,
                    //         width,
                    //         id: item.id,
                    //     });
                    // } else {
                    //     dispatch(
                    //         updateItem({
                    //             id: item?.id,
                    //             currentStep: ChapterStepEnum.MERGING_FILES,
                    //             stepStatus: StepStatusEnum.FAILED,
                    //         })
                    //     );
                    //     return null;
                    // }
                } catch (error) {
                    handleUpdateItem({
                        id: item?.id,
                        currentStep: ChapterStepEnum.MERGING_FILES,
                        stepStatus: StepStatusEnum.FAILED,
                    });
                    return null;
                }
            }
            if (images?.length == 0) return null;

            const maxHeight = 8000;
            let mergedItems: IItem[] = [];

            // Load banner image
            const bannerUrl =
                "/static/images/creator/./miru-fe/src-chapter-banner.jpg";
            const bannerBitmap = await createImageBitmap(
                await (await fetch(bannerUrl)).blob()
            );

            const watermarkUrl =
                "/static/images/creator/./miru-fe/src-watermark.png";
            const watermarkBitmap = await createImageBitmap(
                await (await fetch(watermarkUrl)).blob()
            );

            // Add banner to first and last image
            images[0] = await addBannerToImage(images[0], bannerBitmap, "top");
            images[images.length - 1] = await addBannerToImage(
                images[images.length - 1],
                bannerBitmap,
                "bottom"
            );

            let currentImages: typeof images = [];
            let currentHeight = 0;
            let currentWidth = 0;
            let canvasIndex = 0;
            let startIndex = 0;

            const flushAndUpdateRedux = async (isAddWatermark: boolean) => {
                if (currentImages.length === 0) return;

                const canvas = document.createElement("canvas");
                canvas.width = currentWidth;
                canvas.height = currentHeight;
                const ctx = canvas.getContext("2d")!;
                let y = 0;

                for (const { bitmap } of currentImages) {
                    ctx.drawImage(bitmap, 0, y);
                    y += bitmap.height;
                }

                // Add watermark if allowed
                if (isAddWatermark) {
                    const watermarkMaxWidth = canvas.width / 3;
                    const ratio =
                        watermarkBitmap.width > 0
                            ? watermarkMaxWidth / watermarkBitmap.width
                            : 1;
                    const watermarkWidth = watermarkBitmap.width * ratio;
                    const watermarkHeight = watermarkBitmap.height * ratio;

                    ctx.globalAlpha = 0.6;
                    ctx.drawImage(
                        watermarkBitmap,
                        canvas.width - watermarkWidth - 10,
                        canvas.height - watermarkHeight - 10,
                        watermarkWidth,
                        watermarkHeight
                    );
                    ctx.globalAlpha = 1.0;
                }

                const blob = await new Promise<Blob>((resolve) =>
                    canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.92)
                );

                const id = nanoid();
                const file = new File([blob], `${id}.jpg`, {
                    type: "image/jpeg",
                });
                const previewUrl = URL.createObjectURL(blob);
                localFilesRef.current[id] = file;

                const newItem: IItem = {
                    id,
                    previewUrl,
                    name: startIndex.toString() + ".jpg",
                    currentStep: ChapterStepEnum.MERGING_FILES,
                    stepStatus: StepStatusEnum.PROCESSING,
                };

                // Cập nhật Redux
                const removedIds = currentImages.map((img) => img.id);
                handleRemoveItemList(removedIds);
                mergedItems.push(newItem);

                // Reset batch
                currentImages = [];
                currentHeight = 0;
                currentWidth = 0;
                canvasIndex++;
            };

            // Merge tuần tự
            for (let i = 0; i < images.length; i++) {
                const img = images[i];

                if (currentImages.length === 0) {
                    currentImages.push(img);
                    currentHeight = img.height;
                    currentWidth = img.width;
                    startIndex = i;
                    continue;
                }

                const exceedsHeight = currentHeight + img.height > maxHeight;
                const widthMismatch = img.width !== currentWidth;

                if (widthMismatch || exceedsHeight) {
                    const isFirstBatch = startIndex === 0;
                    const isLastBatch = i === images.length - 1;
                    const isAddWatermark = !(isFirstBatch || isLastBatch);

                    await flushAndUpdateRedux(isAddWatermark);

                    currentImages.push(img);
                    currentHeight = img.height;
                    currentWidth = img.width;
                    startIndex = i;
                } else {
                    currentImages.push(img);
                    currentHeight += img.height;
                }
            }

            // Flush phần còn lại
            if (currentImages.length) {
                const isFirstBatch = startIndex === 0;
                const isLastBatch = true;
                const isAddWatermark = !(isFirstBatch || isLastBatch);

                await flushAndUpdateRedux(isAddWatermark);
            }

            // ENCRYPT LAST IMAGE ##########################
            return mergedItems;
        } catch (error) {
            console.log("error: ", error);
            return null;
        }
    };

    const handleDownloadZip = async () => {
        const CHUNK_SIZE = 10;

        if (dataItems.length === 0) {
            toast.warning("Không có ảnh nào để tải.");
            return;
        }

        setIsLoading("downloading_zip");

        try {
            // 1. Tải từng ảnh chunk để cập nhật localFilesRef.current
            const updatedItems = [...dataItems];
            const chunkArray = (arr: typeof dataItems, size: number) => {
                const chunks = [];
                for (let i = 0; i < arr.length; i += size) {
                    chunks.push(arr.slice(i, i + size));
                }
                return chunks;
            };
            const chunks = chunkArray(updatedItems, CHUNK_SIZE);

            for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
                const chunk = chunks[chunkIndex];
                await Promise.all(
                    chunk.map(async (item) => {
                        const index = updatedItems.findIndex(
                            (i) => i.id === item.id
                        );
                        updatedItems[index] = {
                            ...item,
                            currentStep: ChapterStepEnum.LOAD_IMAGE,
                            stepStatus: StepStatusEnum.PROCESSING,
                        };
                        setDataItems([...updatedItems]);
                        try {
                            const response = await fetch(item.previewUrl);
                            if (!response.ok) throw new Error("Lỗi response");
                            const blob = await response.blob();

                            // Cập nhật localFilesRef
                            const file = new File([blob], item.name, {
                                type: blob.type,
                            });
                            localFilesRef.current[item.id] = file;

                            updatedItems[index] = {
                                ...item,
                                currentStep: ChapterStepEnum.LOAD_IMAGE,
                                stepStatus: StepStatusEnum.DONE,
                            };
                        } catch (err) {
                            updatedItems[index] = {
                                ...item,
                                currentStep: ChapterStepEnum.LOAD_IMAGE,
                                stepStatus: StepStatusEnum.FAILED,
                            };
                        }
                        setDataItems([...updatedItems]);
                    })
                );
            }

            // 2. Gọi merge ảnh
            const mergedItems = await handleMergeImages(updatedItems);

            if (!mergedItems || mergedItems.length === 0) {
                toast.error("Merge ảnh thất bại hoặc không có ảnh để tải.");
                setIsLoading("");
                return;
            }

            // 3. Tạo zip và thêm file merged vào
            const zip = new JSZip();
            const folder = zip.folder("images");
            for (const item of mergedItems) {
                const file = localFilesRef.current[item.id];
                if (file) {
                    folder?.file(item.name, file);
                }
            }

            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, "images_merged.zip");
            toast.success("Tải ZIP ảnh đã merge thành công!");
        } catch (error) {
            console.error(error);
            toast.error("Tải ZIP thất bại!");
        } finally {
            setIsLoading("");
        }
    };

    return (
        <div className="bg-accent px-3 py-4">
            <h1 className="font-semibold uppercase mb-4">
                Tải ảnh từ nguồn truyện
            </h1>

            {/* Input original link */}
            <div className="mb-4">
                <label
                    htmlFor="input-originalUrl"
                    className="block mb-1 font-semibold"
                >
                    Đường dẫn chương truyện (không bắt buộc)
                </label>
                <p className="italic mb-2 text-sm text-slate-400">
                    Nếu chương này bạn lấy từ nguồn nào đó ví dụ như: truyenqq,
                    nettruyenviet,.. thì mới cần điền
                </p>
                <div className="flex">
                    <input
                        id="input-originalUrl"
                        name="originalLink"
                        value={originalLink}
                        onChange={(e) => setOriginalLink(e.target.value)}
                        className="h-10 px-4 rounded-md w-full"
                    />
                    <button
                        onClick={handlePasteOriginal}
                        className="text-white bg-blue-600 rounded-lg ml-2 h-10 px-4 text-sm font-medium"
                    >
                        Dán
                    </button>
                </div>
            </div>

            {/* Input HTML source */}
            {originalLink && (
                <div className="mb-4">
                    <label
                        htmlFor="textarea-html"
                        className="block mb-2 font-semibold"
                    >
                        Mã nguồn chương (Mã HTML)
                    </label>

                    <textarea
                        disabled
                        value={dataContent}
                        onChange={(e) => setDataContent(e.target.value)}
                        className="w-full text-sm p-3 text-[12px] resize-none opacity-70 bg-slate-800 h-[100px] outline-none border border-slate-700"
                    />
                    <div className="text-sm flex gap-2 mt-2">
                        <button
                            onClick={handlePasteDataContent}
                            className="w-full text-white bg-blue-600 rounded-lg py-2.5 text-sm font-medium"
                        >
                            Dán
                        </button>
                        <button
                            onClick={() => setDataContent("")}
                            className="w-full text-white bg-red-600 rounded-lg py-2.5 text-sm font-medium"
                        >
                            Xóa
                        </button>
                    </div>

                    <button
                        onClick={handleConvertDataImages}
                        disabled={
                            isLoading === "loading_convert_data_image" ||
                            !dataContent
                        }
                        className={classNames(
                            "w-full text-white bg-green-600 rounded-lg py-2.5 text-sm font-medium mt-2",
                            (isLoading === "loading_convert_data_image" ||
                                !dataContent) &&
                                "opacity-70 pointer-events-none"
                        )}
                    >
                        {isLoading === "loading_convert_data_image" ? (
                            <IconSpinner className="w-5 h-5 mx-auto animate-spin fill-white" />
                        ) : (
                            "Chuyển đổi"
                        )}
                    </button>

                    <div className="flex flex-wrap gap-2 py-3">
                        {Object.keys(listOptionsImages)?.map((domain) => {
                            return (
                                <div
                                    key={domain}
                                    onClick={() => setOptionSelect(domain)}
                                    className={`cursor-pointer flex items-center px-2 py-1 rounded-lg ${
                                        domain === optionSelect
                                            ? "bg-blue-600"
                                            : "bg-slate-700"
                                    }`}
                                >
                                    <span className="mr-2">{domain}</span>
                                </div>
                            );
                        })}
                    </div>

                    <button
                        onClick={handleApplyImages}
                        className={classNames(
                            "w-full text-white bg-sky-600 rounded-lg py-2.5 text-sm font-medium mt-2"
                        )}
                    >
                        Nhập
                    </button>
                </div>
            )}

            {/* Render images */}
            {dataItems?.length > 0 && (
                <>
                    <div className="grid 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2">
                        {dataItems.map((item) => (
                            <div key={item.id} className="p-4 mx-auto group">
                                <div className="relative w-32 h-24 bg-slate-900 group select-none border border-dashed rounded-lg flex items-center justify-center shadow-md">
                                    <div className="relative w-full h-4 bg-slate-600 m-1"></div>
                                    <div className="pl-2 h-7 rounded-bl-lg leading-7 line-clamp-1 text-sm text-left absolute bottom-0 left-0 right-2 bg-gradient-to-r from-black to-transparent text-white">
                                        {item.name}
                                    </div>
                                    {item.stepStatus ===
                                    StepStatusEnum.PROCESSING ? (
                                        <IconSpinner className="w-12 h-12 p-2 absolute animate-spin fill-gray-600 rounded-full bg-white/80" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:opacity-100 opacity-0 transition">
                                            <div className="flex items-center justify-between absolute top-0 left-0 right-0 -translate-y-1/2 px-2">
                                                <button
                                                    onClick={() =>
                                                        handleRemoveItem(
                                                            item.id
                                                        )
                                                    }
                                                    className="rounded-full bg-red-600"
                                                >
                                                    <IconClose className="w-7 h-7 p-1 fill-white" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setActiveItem(item)
                                                    }
                                                    className="rounded-full bg-slate-800"
                                                >
                                                    <IconEye className="w-7 h-7 p-[6px] fill-white" />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {item.stepStatus ===
                                        StepStatusEnum.FAILED && (
                                        <IconExclamation className="w-10 h-10 p-2 absolute fill-white rounded-full bg-red-600" />
                                    )}
                                    {item.currentStep ===
                                        ChapterStepEnum.LOAD_IMAGE &&
                                        item.stepStatus ===
                                            StepStatusEnum.DONE && (
                                            <IconCircleCheck className="w-10 h-10 p-2 absolute fill-white rounded-full bg-blue-600" />
                                        )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleDownloadZip}
                        disabled={isLoading === "downloading_zip"}
                        className={classNames(
                            "w-full text-white bg-blue-700 rounded-lg py-2.5 text-sm font-medium mt-4",
                            isLoading === "downloading_zip" &&
                                "opacity-70 pointer-events-none"
                        )}
                    >
                        {isLoading === "downloading_zip" ? (
                            <IconSpinner className="w-5 h-5 mx-auto animate-spin fill-white" />
                        ) : (
                            "Tải ZIP toàn bộ ảnh"
                        )}
                    </button>
                </>
            )}

            {/* {activeItem && (
                <ModalShowImages
                    images={[activeItem.previewUrl]}
                    setOff={() => setActiveItem(null)}
                />
            )} */}
        </div>
    );
};

export default DownLoadImagesTemplate;
