"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
    useRef,
    useState,
    useEffect,
    ChangeEvent,
    useMemo,
    useCallback,
} from "react";

import axios from "axios";
import { toast } from "sonner";

import { nanoid } from "@reduxjs/toolkit";
import IconLoadingSpin from "@/components/Modules/Icons/IconLoadingSpin";
import {
    ICreateChapterManualServer,
    getDetailChapterCreatorService,
    createChapterByDataCreatorService,
    updateChapterByDataCreatorService,
} from "@/services/creator.services";
import { ContentPageEnum } from "@/common/data.types";
import ChapterProgressBar from "./ChapterProgressBar";
import chapterService from "@/services/chapter.services";
import { concurrentUpload } from "@/utils/concurrentUpload";
import {
    addItems,
    clearItems,
    removeItem,
    updateItem,
    IImageItem,
    StepStatusEnum,
    ChapterStepEnum,
    optionsLanguageData,
    RootStateChapterSlide,
    updateStepItem,
    removeItemList,
    resetChapter,
    updateStepChapter,
    sortItemsByName,
    setItems,
    updateSetting,
} from "@/store/chapter/chapter.reducer";
import classNames from "@/utils/classNames";
import ModalShowImages from "./ModalShowImages";
import ModalTranslate from "./ModalTranslate";
import IconSpinner from "@/components/Modules/Icons/IconSpinner";
import { fetchWithConcurrency } from "@/utils/fetchWithConcurrency";

import init, {
    encrypt_data,
    scramble_image_with_max_parts,
} from "@/../public/wasm/drm_tool/pkg/drm_tool.js";
import { Switch } from "@headlessui/react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { CloudImageEnum } from "@/components/Share/CloudImage";
import ShowToast, { NotificationTypeEnum } from "@/utils/ShowToast";
import { updateChapterInfoByData } from "@/store/chapter/chapter.service";
import { UserRole } from "@/services/user.services";
import translateService from "@/services/translate.services";

const ListItemFull = dynamic(() => import("./ListItemFull"), {
    ssr: false,
});

interface ICreatorFormChapterV1Template {
    bookId: number;
    chapterNumber: number;
    content: ContentPageEnum;
    method: "CREATE" | "UPDATE";
}

const CreatorFormChapterV1Template = ({
    method,
    bookId,
    content,
    chapterNumber,
}: ICreatorFormChapterV1Template) => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const stepLineRef = useRef<HTMLDivElement>(null);
    const contentImagesRef = useRef<HTMLDivElement>(null);
    const chapterSlice = useAppSelector((state) => state.chapterSlice);

    // LIST ITEMS
    const dispatch = useAppDispatch();
    const localFilesRef = useRef<Record<string, File>>({});
    const itemsRef = useRef<IImageItem[]>([]);

    const cacheIdRef = useRef<string>(Date.now().toString());
    const getCurrentCacheId = useCallback(() => {
        if (!cacheIdRef.current) {
            cacheIdRef.current = Date.now().toString();
        }
        return cacheIdRef.current;
    }, []);
    const resetCacheId = useCallback(() => {
        cacheIdRef.current = Date.now().toString();
    }, []);

    const [step, setStep] = useState(0);
    const [dataChapter, setDataChapter] = useState<{
        num: string;
        title: string;
        source: number;
        originalLink: string;
    }>({
        num: "",
        title: "",
        source: 0,
        originalLink: "",
    });
    const [isLoading, setIsLoading] = useState("");
    const [dataContent, setDataContent] = useState<string>("");
    const [dataOriginalLink, setDataOriginalLink] = useState<string>("");
    const [translateModalOpen, setTranslateModalOpen] = useState(false);
    const [translateImageId, setTranslateImageId] = useState<string | null>(null);
    const [optionSelect, setOptionSelect] = useState<string | null>(null);
    const [isBatchTranslating, setIsBatchTranslating] = useState(false);
    const [batchTranslateSourceLang, setBatchTranslateSourceLang] = useState("en");
    const [batchTranslateTargetLang, setBatchTranslateTargetLang] = useState("vi");
    const [listOptionsImages, setListOptionsImages] = useState<
        Record<string, string[]>
    >({});

    const scrollUpContentImages = () => {
        if (contentImagesRef.current) {
            contentImagesRef.current.scrollIntoView({
                behavior: "instant",
                block: "start",
            });
        }
    };

    useEffect(() => {
        itemsRef.current = chapterSlice.items;
    }, [chapterSlice.items]);

    const scrollDownContentImages = () => {
        if (contentImagesRef.current) {
            contentImagesRef.current.scrollIntoView({
                behavior: "instant",
                block: "end",
            });
        }
    };

    const handleSortItems = () => {
        dispatch(sortItemsByName());
    };

    const handleAddItemsByFile = useCallback(async ({
        files,
        position,
        targetId,
    }: {
        files: File[];
        position: "prepend" | "append" | "before" | "after";
        targetId?: string;
    }) => {
        const imageFiles: IImageItem[] = [];

        // .sort((a, b) => a.lastModified - b.lastModified)
        for (const file of files.filter((f) => f.type.startsWith("image/"))) {
            const id = nanoid();
            localFilesRef.current[id] = file;

            const previewUrl = URL.createObjectURL(file);

            imageFiles.push({
                id: id,
                // order: ,
                name: file.name.slice(-10),
                previewUrl,
                currentStep: ChapterStepEnum.IDLE,
                stepStatus: StepStatusEnum.DONE,
            });
        }
        if (imageFiles.length > 0) {
            dispatch(addItems({ items: imageFiles, position, targetId }));
        }
    }, [dispatch]);

    const handleAddItemsByText = async (
        urls: string[],
        originalLink?: string
    ) => {
        if (!urls || urls.length === 0) {
            return alert("Không có ảnh nào để tải!");
        }

        const url = new URL(
            originalLink || dataOriginalLink
        );
        const origin = url.origin;
        const initialDataImgs: IImageItem[] = urls.map((imgUrl) => ({
            id: nanoid(),
            name: imgUrl.slice(-10),
            previewUrl: `/api/image/load?referer=${origin}&url=${imgUrl}`,
            currentStep: ChapterStepEnum.IDLE,
            stepStatus: StepStatusEnum.DONE,
        }));
        handleResetAll();
        dispatch(addItems({ items: initialDataImgs, position: "append" }));
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
        handleAddItemsByText(urls);
    };

    const handleConvertDataImages = () => {
        try {
            const imgLinks = new Set();
            const regex = dataOriginalLink.includes("bbbokkk")
                ? /"(https?:\/\/[^"]+)"/g
                : /<img[^>]+(?:src|data-src)="([^"]+)"/g;
            let match;

            const baseUrl = new URL(dataOriginalLink).origin;
            while ((match = regex.exec(dataContent)) !== null) {
                let url = match[1];
                // Chuyển tương đối => tuyệt đối nếu cần
                if (url.startsWith("/")) {
                    url = baseUrl + url;
                } else if (
                    !url.startsWith("http://") &&
                    !url.startsWith("https://")
                ) {
                    continue; // Bỏ qua nếu không hợp lệ
                }
                imgLinks.add(url);
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
            setDataContent("");
        }
    };

    const handleOnChangeDataChapter = (e: ChangeEvent<HTMLInputElement>) => {
        setDataChapter((state) => ({
            ...state,
            [e.target.name]: e.target.value,
        }));
    };

    const handlePasteDataContent = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setDataContent(text.trim());
        } catch (error) {
            alert("Nội dung xảy ra lỗi!");
        }
    };

    const handleRemoveItem = useCallback(
        (id: string) => {
            const targetItem = itemsRef.current.find((i) => i.id === id);
            if (targetItem?.previewUrl) {
                URL.revokeObjectURL(targetItem?.previewUrl);
                delete localFilesRef.current[id];
            }
            dispatch(removeItem({ id }));
        },
        [dispatch]
    );

    const handleRemoveItemList = useCallback(
        (ids: string[]) => {
            itemsRef.current.forEach((item) => {
                if (ids.includes(item.id) && item?.previewUrl) {
                    URL.revokeObjectURL(item?.previewUrl);
                    delete localFilesRef.current[item.id];
                }
            });
            dispatch(removeItemList(ids));
        },
        [dispatch]
    );

    const handleClearItems = () => {
        dispatch(clearItems());
        localFilesRef.current = {};
    };

    const handleResetAll = () => {
        dispatch(resetChapter());
        localFilesRef.current = {};
        setDataContent("");
        setListOptionsImages({});
        resetCacheId();
    };

    useEffect(() => {
        resetCacheId();
    }, [bookId, chapterNumber, method, resetCacheId]);

    const getImageDimensions = (
        file: File
    ): Promise<{ width: number; height: number }> => {
        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(file);

            const img = new globalThis.Image();
            img.onload = () => {
                resolve({ width: img.width, height: img.height });
                URL.revokeObjectURL(url);
            };
            img.onerror = (err: Event | string) => {
                reject(err);
                URL.revokeObjectURL(url);
            };
            img.src = url;
        });
    };

    const fileToBitmap = async (
        file: File | Blob
    ): Promise<ImageBitmap | HTMLImageElement> => {
        // Nếu browser hỗ trợ createImageBitmap
        if (typeof createImageBitmap === "function") {
            const bitmap = await createImageBitmap(file);
            return bitmap;
        }

        // Fallback cho Safari / iPhone cũ: dùng <img>
        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(file);
            const img = new globalThis.Image();
            img.onload = () => {
                URL.revokeObjectURL(url);
                resolve(img);
            };
            img.onerror = (err) => {
                URL.revokeObjectURL(url);
                reject(err);
            };
            img.src = url;
        });
    };

    const handleUploadImages = async (
        items: IImageItem[]
    ): Promise<null | IImageItem[]> => {
        if (status !== "authenticated") {
            return null;
        }
        if (items?.length === 0) {
            return null;
        }
        try {
            const cacheSessionId = getCurrentCacheId();
            // START UPLOAD ##########################
            const uploadFn = async (img: IImageItem) => {
                const file = localFilesRef.current[img.id];
                if (!file) throw new Error("Không có file để upload");

                dispatch(
                    updateItem({
                        id: img?.id,
                        currentStep: ChapterStepEnum.UPLOADING,
                        stepStatus: StepStatusEnum.PROCESSING,
                    })
                );

                const formData = new FormData();
                formData.append("file", file);

                const maxRetries = 5;
                const delayMs = 3000;

                for (let attempt = 1; attempt <= maxRetries; attempt++) {
                    try {
                        const res =
                            await chapterService.uploadImageCloudCacheV1Service(
                                {
                                    file: formData,
                                    token: session?.backendTokens.accessToken,
                                    bookId,
                                    chapterNumber,
                                    cacheId: cacheSessionId,
                                    onProgress: (percent: number) => {
                                        dispatch(
                                            updateItem({
                                                id: img?.id,
                                                uploadProgress: percent,
                                            })
                                        );
                                    },
                                }
                            );

                        if (!res?.result) {
                            throw new Error("upload fail");
                        }

                        dispatch(
                            updateItem({
                                id: img?.id,
                                dataUpload: res.result,
                                currentStep: ChapterStepEnum.UPLOADING,
                                stepStatus: StepStatusEnum.DONE,
                            })
                        );

                        return {
                            success: true,
                            item: {
                                ...img,
                                dataUpload: res.result,
                                currentStep: ChapterStepEnum.UPLOADING,
                                stepStatus: StepStatusEnum.DONE,
                            },
                        };
                    } catch (error) {
                        console.warn(`Upload attempt ${attempt} failed`, error);

                        if (attempt < maxRetries) {
                            await new Promise((resolve) =>
                                setTimeout(resolve, delayMs)
                            );
                            continue;
                        }

                        try {
                            const res =
                                await chapterService.uploadImageCloudCacheV2Service(
                                    {
                                        file: formData,
                                        token: session?.backendTokens
                                            .accessToken,
                                        bookId,
                                        chapterNumber,
                                        cacheId: cacheSessionId,
                                    }
                                );
                            if (!res?.result) throw new Error("upload fail");

                            dispatch(
                                updateItem({
                                    id: img?.id,
                                    dataUpload: res?.result,
                                    stepStatus: StepStatusEnum.DONE,
                                    currentStep: ChapterStepEnum.UPLOADING,
                                })
                            );
                            return {
                                success: true,
                                item: {
                                    ...img,
                                    dataUpload: res?.result,
                                    currentStep: ChapterStepEnum.UPLOADING,
                                    stepStatus: StepStatusEnum.DONE,
                                },
                            };
                        } catch (error) {
                            dispatch(
                                updateItem({
                                    id: img?.id,
                                    currentStep: ChapterStepEnum.UPLOADING,
                                    stepStatus: StepStatusEnum.FAILED,
                                })
                            );
                        }
                        return { success: false };
                    }
                }

                return { success: false };
            };
            const dataUpload = await concurrentUpload(items, 5, uploadFn);

            const result = dataUpload
                .filter((img) => img?.success)
                .map((img) => img?.item);
            if (result?.length !== dataUpload.length) throw new Error();

            return result;
        } catch (error) {
            // console.error("Lỗi upload tổng thể:", error);
            return null;
        }
    };

    const addBannerToImage = async (
        imageFile: File,
        banner: ImageBitmap,
        position: "top" | "bottom"
    ): Promise<File> => {
        // Create bitmap from file
        const imageBitmap = await fileToBitmap(imageFile);

        // Calculate banner dimensions scaled to image width
        const scale = imageBitmap.width / banner.width;
        const bannerHeight = banner.height * scale;

        // Create canvas with new dimensions
        const canvas = document.createElement("canvas");
        canvas.width = imageBitmap.width;
        canvas.height =
            position === "top"
                ? bannerHeight + imageBitmap.height
                : imageBitmap.height + bannerHeight;

        const ctx = canvas.getContext("2d")!;

        // Draw banner and image based on position
        if (position === "top") {
            // Banner on top, image below
            ctx.drawImage(banner, 0, 0, imageBitmap.width, bannerHeight);
            ctx.drawImage(imageBitmap, 0, bannerHeight);
        } else {
            // Image on top, banner below
            ctx.drawImage(imageBitmap, 0, 0);
            ctx.drawImage(
                banner,
                0,
                imageBitmap.height,
                imageBitmap.width,
                bannerHeight
            );
        }

        // Clean up bitmap
        (imageBitmap as ImageBitmap | null)?.close();

        // Convert canvas to file
        const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((blob) => resolve(blob!), "image/jpeg");
        });

        return new File([blob], imageFile.name, { type: "image/jpeg" });
    };

    const handleMergeImages = async ({
        items,
    }: {
        items: IImageItem[];
    }): Promise<null | IImageItem[]> => {
        if (status !== "authenticated") return null;

        try {
            const { isAddBanner, isAddWatermark, isMerge } =
                chapterSlice?.settings;
            const maxHeight = 7000;
            let mergedItems: IImageItem[] = [];

            // Load banner and watermark once if needed
            let bannerBitmap: ImageBitmap | null = null;
            let watermarkBitmap: ImageBitmap | null = null;

            if (isAddBanner || isAddWatermark) {
                const loadPromises = [];

                if (isAddBanner) {
                    const bannerUrl =
                        "/static/images/creator/./miru-fe/src-chapter-banner.jpg";
                    loadPromises.push(
                        fetch(bannerUrl)
                            .then((res) => res.blob())
                            .then((blob) => fileToBitmap(blob))
                            .then((bitmap) => {
                                bannerBitmap = bitmap as ImageBitmap;
                            })
                    );
                }

                if (isAddWatermark) {
                    const watermarkUrl =
                        "/static/images/creator/./miru-fe/src-watermark.png";
                    loadPromises.push(
                        fetch(watermarkUrl)
                            .then((res) => res.blob())
                            .then((blob) => fileToBitmap(blob))
                            .then((bitmap) => {
                                watermarkBitmap = bitmap as ImageBitmap;
                            })
                    );
                }

                await Promise.all(loadPromises);
            }

            // Helper function to create canvas and apply watermark
            const createFinalCanvas = async (
                images: { file: File; item: IImageItem }[],
                shouldAddWatermark: boolean
            ): Promise<{
                canvas: HTMLCanvasElement;
                totalHeight: number;
                width: number;
            }> => {
                let totalHeight = 0;
                let canvasWidth = 0;
                const bitmaps: ImageBitmap[] = [];

                // Load all bitmaps and calculate dimensions
                for (const { file } of images) {
                    const bitmap = await fileToBitmap(file);
                    bitmaps.push(bitmap as ImageBitmap);
                    totalHeight += bitmap.height;
                    if (canvasWidth === 0) canvasWidth = bitmap.width;
                }

                // Create canvas
                const canvas = document.createElement("canvas");
                canvas.width = canvasWidth;
                canvas.height = totalHeight;
                const ctx = canvas.getContext("2d")!;

                // Draw images
                let y = 0;
                for (const bitmap of bitmaps) {
                    ctx.drawImage(bitmap, 0, y);
                    y += bitmap.height;
                    bitmap.close();
                }

                // Add watermark if needed
                if (shouldAddWatermark && watermarkBitmap) {
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

                return { canvas, totalHeight, width: canvasWidth };
            };

            // Helper function to create new image item
            const createImageItem = async (
                canvas: HTMLCanvasElement,
                name: string,
                order: number
            ): Promise<IImageItem> => {
                const blob = await new Promise<Blob>((resolve) =>
                    canvas.toBlob((b) => resolve(b!), "image/jpeg")
                );

                const id = nanoid();
                const file = new File([blob], `${id}.jpg`, {
                    type: "image/jpeg",
                });
                const previewUrl = URL.createObjectURL(blob);
                localFilesRef.current[id] = file;

                return {
                    id,
                    previewUrl,
                    name,
                    currentStep: ChapterStepEnum.MERGING_FILES,
                    stepStatus: StepStatusEnum.PROCESSING,
                    metadata: {
                        order,
                        width: canvas.width,
                        height: canvas.height,
                    },
                };
            };

            if (isMerge) {
                // MERGE MODE: Combine multiple images into batches
                let currentImages: { file: File; item: IImageItem }[] = [];
                let currentHeight = 0;
                let currentWidth = 0;
                let canvasIndex = 0;
                let startIndex = 0;

                const flushBatch = async (shouldAddWatermark: boolean) => {
                    if (currentImages.length === 0) return;

                    const { canvas } = await createFinalCanvas(
                        currentImages,
                        shouldAddWatermark
                    );
                    const newItem = await createImageItem(
                        canvas,
                        `${startIndex}.jpg`,
                        canvasIndex
                    );

                    // Update Redux
                    const removedIds = currentImages.map(({ item }) => item.id);
                    handleRemoveItemList(removedIds);
                    dispatch(
                        addItems({ items: [newItem], position: "append" })
                    );
                    mergedItems.push(newItem);

                    // Reset batch
                    currentImages = [];
                    currentHeight = 0;
                    currentWidth = 0;
                    canvasIndex++;
                };

                // Process each image
                for (let i = 0; i < items.length; i++) {
                    const img = items[i];
                    let file = localFilesRef.current[img.id];
                    if (!file) continue;

                    // Add banner to first/last image if needed
                    if (isAddBanner) {
                        if (i === 0) {
                            file = await addBannerToImage(
                                file,
                                bannerBitmap!,
                                "top"
                            );
                        } else if (i === items.length - 1) {
                            file = await addBannerToImage(
                                file,
                                bannerBitmap!,
                                "bottom"
                            );
                        }
                    }

                    const { width, height } = await getImageDimensions(file);

                    // First image in batch
                    if (currentImages.length === 0) {
                        currentImages.push({ file, item: img });
                        currentHeight = height;
                        currentWidth = width;
                        startIndex = i;
                        continue;
                    }

                    const exceedsHeight = currentHeight + height > maxHeight;
                    const widthMismatch = width !== currentWidth;

                    if (widthMismatch || exceedsHeight) {
                        // Flush current batch
                        const isFirstBatch = startIndex === 0;
                        const isLastBatch = i === items.length - 1;
                        const shouldAddWatermark =
                            isAddWatermark && !(isFirstBatch || isLastBatch);

                        await flushBatch(shouldAddWatermark);

                        // Start new batch
                        currentImages.push({ file, item: img });
                        currentHeight = height;
                        currentWidth = width;
                        startIndex = i;
                    } else {
                        // Add to current batch
                        currentImages.push({ file, item: img });
                        currentHeight += height;
                    }
                }

                // Flush remaining batch
                if (currentImages.length > 0) {
                    const isFirstBatch = startIndex === 0;
                    const shouldAddWatermark = isAddWatermark && !isFirstBatch;
                    await flushBatch(shouldAddWatermark);
                }
            } else {
                // NO MERGE MODE: Process each image individually
                for (let i = 0; i < items.length; i++) {
                    const img = items[i];
                    let file = localFilesRef.current[img.id];
                    if (!file) continue;

                    // Add banner to first/last image
                    if (isAddBanner) {
                        if (i === 0) {
                            file = await addBannerToImage(
                                file,
                                bannerBitmap!,
                                "top"
                            );
                        } else if (i === items.length - 1) {
                            file = await addBannerToImage(
                                file,
                                bannerBitmap!,
                                "bottom"
                            );
                        }
                    }

                    // Determine if watermark should be added (not first or last image)
                    const isFirstImage = i === 0;
                    const isLastImage = i === items.length - 1;
                    const shouldAddWatermark =
                        isAddWatermark && !(isFirstImage || isLastImage);

                    // Create canvas for single image
                    const { canvas } = await createFinalCanvas(
                        [{ file, item: img }],
                        shouldAddWatermark
                    );
                    const newItem = await createImageItem(canvas, img.name, i);

                    // Update Redux
                    handleRemoveItemList([img.id]);
                    dispatch(
                        addItems({ items: [newItem], position: "append" })
                    );
                    mergedItems.push(newItem);
                }
            }

            // Clean up bitmaps
            (bannerBitmap as ImageBitmap | null)?.close();
            (watermarkBitmap as ImageBitmap | null)?.close();

            console.log("Processed items: ", mergedItems.length);

            // ENCRYPT LAST IMAGE (unchanged logic)
            setStep(2);
            try {
                if (mergedItems.length > 2) {
                    const lastItem = mergedItems[mergedItems.length - 1];
                    const file = localFilesRef.current[lastItem.id];
                    const bitmap = await fileToBitmap(file);

                    const imageEncryptWidth = lastItem.metadata
                        ?.width as number;
                    const imageEncryptHeight = lastItem.metadata
                        ?.height as number;

                    const offscreen = new OffscreenCanvas(
                        imageEncryptWidth,
                        imageEncryptHeight
                    );
                    const ctx = offscreen.getContext(
                        "2d"
                    ) as OffscreenCanvasRenderingContext2D;
                    ctx.drawImage(bitmap, 0, 0);
                    (bitmap as ImageBitmap | null)?.close();

                    const imgData = ctx.getImageData(
                        0,
                        0,
                        imageEncryptWidth,
                        imageEncryptHeight
                    );
                    const rgbaBuffer = new Uint8Array(imgData.data.buffer);

                    const encryptedResult = await scramble_image_with_max_parts(
                        rgbaBuffer,
                        imageEncryptWidth,
                        imageEncryptHeight,
                        12
                    );
                    if (!encryptedResult) return null;

                    const drmString = encrypt_data(encryptedResult.drm);
                    const scrambledRGBA = encryptedResult.data;

                    const tempCanvas = new OffscreenCanvas(
                        imageEncryptWidth,
                        imageEncryptHeight
                    );
                    const tempCtx = tempCanvas.getContext("2d")!;
                    const clamped = new Uint8ClampedArray(scrambledRGBA.buffer);
                    tempCtx.putImageData(
                        new ImageData(
                            clamped,
                            imageEncryptWidth,
                            imageEncryptHeight
                        ),
                        0,
                        0
                    );

                    const blobImage = await tempCanvas.convertToBlob({
                        type: "image/jpeg",
                    });
                    const fileToUpload = new File(
                        [blobImage],
                        `${lastItem.id}.jpeg`,
                        {
                            type: "image/jpeg",
                        }
                    );

                    const cacheSessionId = getCurrentCacheId();
                    const handleUploadImage = async (imgFile: File) => {
                        const formData = new FormData();
                        formData.append("file", imgFile);

                        try {
                                const res =
                                await chapterService.uploadImageCloudCacheV1Service(
                                    {
                                        file: formData,
                                        token: session?.backendTokens
                                            .accessToken,
                                            bookId,
                                            chapterNumber,
                                            cacheId: cacheSessionId,
                                    }
                                );
                            return {
                                success: true,
                                dataEncodedImages: res?.result,
                            };
                        } catch {
                            try {
                                const res =
                                    await chapterService.uploadImageCloudCacheV2Service(
                                        {
                                            file: formData,
                                            token: session?.backendTokens
                                                .accessToken,
                                            bookId,
                                            chapterNumber,
                                            cacheId: cacheSessionId,
                                        }
                                    );
                                if (res?.success) {
                                    return {
                                        success: true,
                                        dataEncodedImages: res?.result,
                                    };
                                }
                            } catch (error) {}
                            return { success: false };
                        }
                    };

                    const uploadRes = await handleUploadImage(fileToUpload);
                    if (!uploadRes?.success) {
                        dispatch(
                            updateItem({
                                id: lastItem?.id,
                                currentStep: ChapterStepEnum.ENCRYPTING,
                                stepStatus: StepStatusEnum.FAILED,
                            })
                        );
                        return null;
                    }

                    mergedItems[mergedItems.length - 1] = {
                        ...lastItem,
                        metadata: {
                            order: lastItem.metadata!.order,
                            width: lastItem.metadata!.width,
                            height: lastItem.metadata!.height,
                            drmData: drmString,
                            secureImageUrl: uploadRes.dataEncodedImages,
                        },
                    };
                }
            } catch (error) {}

            return mergedItems;
        } catch (error) {
            console.error("Error in handleMergeImages:", error);
            return null;
        }
    };

    const handleActionChapter = async () => {
        const numCheck = dataChapter.num.trim();
        if (stepLineRef.current) {
            stepLineRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
        if (status !== "authenticated") {
            toast.warning("Bạn chưa đăng nhập!", { duration: 3000 });
            return;
        }
        if (!numCheck || numCheck.length > 5) {
            toast.warning("Số chương không đúng yêu cầu!", { duration: 3000 });
            return;
        }
        if (dataChapter?.title) {
            if (dataChapter?.title?.trim().length > 80) {
                toast.warning("Tiêu đề không đúng yêu cầu!", {
                    duration: 3000,
                });
                return;
            }
        }
        const items = chapterSlice.items;
        if (!items.length) {
            toast.warning("Bạn chưa thêm ảnh!", { duration: 3000 });
            return;
        }

        setIsLoading("loading_create_chapter");
        const message = method === "CREATE" ? "Tạo" : "Cập nhật";
        try {
            // CHECK
            const findError = items.find(
                (item) => item.stepStatus !== StepStatusEnum.DONE
            );
            if (findError) {
                toast.warning("Đang xãy ra lỗi ở đâu đó!", { duration: 3000 });
                return;
            }

            // START
            setStep(1);
            dispatch(
                updateStepChapter({
                    stepStatus: StepStatusEnum.PROCESSING,
                })
            );

            try {
                await fetchWithConcurrency<IImageItem>(
                    items,
                    5,
                    async (item) => {
                        const update = (
                            step: ChapterStepEnum,
                            status: StepStatusEnum
                        ) =>
                            dispatch(
                                updateItem({
                                    id: item.id,
                                    currentStep: step,
                                    stepStatus: status,
                                })
                            );

                        if (localFilesRef?.current?.[item.id]) {
                            update(
                                ChapterStepEnum.CREATING_CHAPTER,
                                StepStatusEnum.DONE
                            );
                            return;
                        }
                        if (!item?.previewUrl) {
                            update(ChapterStepEnum.IDLE, StepStatusEnum.FAILED);
                        }

                        update(
                            ChapterStepEnum.CREATING_CHAPTER,
                            StepStatusEnum.PROCESSING
                        );

                        let success = false;

                        for (let attempt = 1; attempt <= 5; attempt++) {
                            try {
                                const response = await axios.get(
                                    item.previewUrl?.includes(
                                        "api/image/stream"
                                    )
                                        ? item.previewUrl.replaceAll(
                                              "api/image/stream",
                                              "api/image/load"
                                          )
                                        : item.previewUrl?.includes(
                                              "api/image/load"
                                          )
                                        ? item.previewUrl
                                        : `/api/image/stream?url=${item.previewUrl}`,
                                    {
                                        headers: {
                                            "User-Agent":
                                                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
                                        },
                                        responseType: "blob",
                                    }
                                );

                                const blob = response.data;
                                const file = new File(
                                    [blob],
                                    `${item.id}.jpg`,
                                    {
                                        type: "image/jpeg",
                                    }
                                );
                                localFilesRef.current[item.id] = file;

                                update(
                                    ChapterStepEnum.CREATING_CHAPTER,
                                    StepStatusEnum.DONE
                                );

                                success = true;
                                break;
                            } catch (error) {
                                if (attempt === 5) {
                                    update(
                                        ChapterStepEnum.IDLE,
                                        StepStatusEnum.FAILED
                                    );
                                    throw error;
                                }
                                // console.warn(
                                //     `Fetch failed attempt ${attempt}, retrying...`
                                // );
                            }
                        }
                    }
                );
            } catch (error) {
                toast.error("Tải ảnh thất bại!", { duration: 3000 });
                return;
            }

            // MERGE IMAGES ##########################
            setStep(1);
            const dataMergeImages = await handleMergeImages({
                items: items,
            });

            if (!dataMergeImages) {
                toast.warning("Không thể gộp ảnh. Kiểm tra lại dữ liệu!", {
                    duration: 3000,
                });
                return;
            }

            // UPLOAD IMAGES ##########################
            setStep(3);
            const uploadedImages = await handleUploadImages(dataMergeImages);
            if (!uploadedImages) {
                toast.warning("Không thể upload ảnh. Kiểm tra lại dữ liệu!", {
                    duration: 3000,
                });
                return;
            }

            const finalDataItems = uploadedImages;

            // CONVERT DATA CREATE CHAPTER ##########################
            setStep(4);
            const keysServer = Object.keys(
                finalDataItems[0].dataUpload!
            ) as Array<keyof (typeof finalDataItems)[0]["dataUpload"]>;
            const servers: ICreateChapterManualServer[] = keysServer.map(
                (key) => ({
                    cloud: key as CloudImageEnum,
                    protectedImages: finalDataItems
                        .filter(
                            (item) =>
                                item.dataUpload !== null &&
                                item.metadata !== null
                        )
                        .map((item) => ({
                            imageUrl:
                                item.dataUpload![
                                    key as keyof typeof item.dataUpload
                                ],
                            order: item.metadata!.order,
                            width: item.metadata!.width,
                            height: item.metadata!.height,
                            drmData: item.metadata!.drmData,
                            keySecure: item.metadata?.keySecure,
                            secureImageUrl: item.metadata?.secureImageUrl
                                ? item.metadata?.secureImageUrl![
                                      key as keyof typeof item.metadata.secureImageUrl
                                  ]
                                : null,
                        })) as ICreateChapterManualServer["protectedImages"],
                })
            );
            const data = {
                data: {
                    bookId: bookId,
                    servers: servers,
                    num: dataChapter.num,
                    chapterNumber: chapterNumber,
                    originalLink: dataOriginalLink,
                    title: dataChapter.title ? dataChapter.title : undefined,
                },
                token: session?.backendTokens.accessToken,
            };
            const actionChapterRes = await (method === "CREATE"
                ? createChapterByDataCreatorService(data)
                : updateChapterByDataCreatorService(data));

            // RESPONSE DATA
            if (!actionChapterRes?.success)
                throw new Error("Thất bại khi lưu chương");
            toast.success(message + " chương thành công!", {
                duration: 3000,
            });

            handleResetAll();
            finalDataItems.forEach(
                (item) =>
                    !!item?.previewUrl && URL.revokeObjectURL(item?.previewUrl)
            );
            if (method === "UPDATE") {
                window.location.reload();
            } else {
                router.push(`/${content}/creator/books/${bookId}/chapters`);
            }
        } catch (error) {
            toast.error(message + " chương thất bại!", {
                duration: 3000,
            });
        } finally {
            setStep(5);
            setIsLoading("");
            dispatch(
                updateStepChapter({
                    stepStatus: StepStatusEnum.DONE,
                })
            );
        }
    };

    const handleTranslate = useCallback(async (id: string) => {
        setTranslateImageId(id);
        setTranslateModalOpen(true);
    }, []);

    const handleBatchTranslate = useCallback(async () => {
        const items = chapterSlice.items;
        if (!items || items.length === 0) {
            toast.warning("Không có ảnh nào để dịch!", { duration: 3000 });
            return;
        }

        // Lọc các ảnh có file để dịch
        const itemsToTranslate = items.filter((item) => {
            const file = localFilesRef.current[item.id];
            return file !== undefined && file !== null;
        });

        if (itemsToTranslate.length === 0) {
            toast.warning("Không có ảnh nào có file để dịch!", { duration: 3000 });
            return;
        }

        setIsBatchTranslating(true);
        let successCount = 0;
        let failCount = 0;

        try {
            await fetchWithConcurrency(
                itemsToTranslate,
                2, // concurrent 5
                async (item) => {
                    try {
                        const file = localFilesRef.current[item.id];
                        if (!file) {
                            failCount++;
                            return;
                        }

                        // Dịch ảnh
                        const blob = await translateService.translateImageFull({
                            imageFile: file,
                            source_lng_cd: batchTranslateSourceLang,
                            target_lng_cd: batchTranslateTargetLang,
                        });

                        // Tạo file mới từ blob
                        const newFile = new File(
                            [blob],
                            file.name || `translated-${item.id}.jpg`,
                            {
                                type: "image/jpeg",
                            }
                        );

                        // Tạo preview URL
                        const newPreviewUrl = URL.createObjectURL(blob);

                        // Revoke URL cũ nếu có
                        const oldItem = itemsRef.current.find((i) => i.id === item.id);
                        if (oldItem?.previewUrl && oldItem.previewUrl.startsWith("blob:")) {
                            URL.revokeObjectURL(oldItem.previewUrl);
                        }

                        // Cập nhật file và preview URL
                        localFilesRef.current[item.id] = newFile;
                        dispatch(
                            updateItem({
                                id: item.id,
                                previewUrl: newPreviewUrl,
                            })
                        );

                        successCount++;
                    } catch (error: any) {
                        console.error(`Error translating image ${item.id}:`, error);
                        failCount++;
                        toast.error(`Lỗi khi dịch ảnh ${item.name}`, {
                            duration: 3000,
                        });
                    }
                }
            );

            toast.success(
                `Dịch hoàn tất! Thành công: ${successCount}, Thất bại: ${failCount}`,
                { duration: 5000 }
            );
        } catch (error: any) {
            console.error("Batch translate error:", error);
            toast.error("Lỗi khi dịch hàng loạt!", { duration: 3000 });
        } finally {
            setIsBatchTranslating(false);
        }
    }, [
        chapterSlice.items,
        batchTranslateSourceLang,
        batchTranslateTargetLang,
        dispatch,
    ]);

    const handleUpdateInfoChapter = async () => {
        try {
            setIsLoading("loading_update_chapter");
            if (method === "UPDATE") {
                const dataRes = await updateChapterInfoByData({
                    bookId,
                    chapterNumber,
                    num: dataChapter?.num,
                    title: dataChapter?.title,
                    originalLink: dataChapter?.originalLink,
                });
                ShowToast?.[
                    dataRes?.success
                        ? NotificationTypeEnum.success
                        : NotificationTypeEnum?.error
                ](
                    `Cập nhật ${
                        dataRes?.success ? "thành công" : "thất bại"
                    }!`,
                    {
                        duration: 3000,
                    }
                );
            }
        } catch (error) {
        } finally {
            setIsLoading("");
        }
    };

    const handleLoadDataInitial = async () => {
        if (status !== "authenticated") {
            return;
        }
        const chapterRes = await getDetailChapterCreatorService({
            bookId,
            chapterNumber,
            token: session?.backendTokens.accessToken,
        });
        if (!chapterRes || !chapterRes?.success) {
            return;
        }

        setDataChapter({
            source: 0,
            num: chapterRes?.data.num,
            title: chapterRes?.data.title,
            originalLink: chapterRes?.data.originalLink,
        });
        if (chapterRes?.data?.images) {
            const filesImages: { imageUrl: string }[] =
                chapterRes?.data?.images;

            const imageFiles: IImageItem[] = [];
            for (const file of filesImages) {
                const id = nanoid();
                imageFiles.push({
                    id: id,
                    previewUrl: file?.imageUrl,
                    name: file.imageUrl.slice(-10),
                    stepStatus: StepStatusEnum.DONE,
                    currentStep: ChapterStepEnum.IDLE,
                });
            }
            if (imageFiles.length > 0) {
                dispatch(setItems(imageFiles));
            }

            dispatch(
                updateStepChapter({
                    stepStatus: StepStatusEnum.PENDING,
                })
            );
        }
    };

    useEffect(() => {
        if (method === "UPDATE") {
            clearItems();
            handleLoadDataInitial();
        }
    }, [status]);

    useEffect(() => {
        const loadWasm = async () => {
            await init();
        };
        loadWasm();

        return () => {
            handleResetAll();
        };
    }, []);

    return (
        <div>
            <div
                className={classNames(
                    "",
                    chapterSlice.stepStatus === StepStatusEnum.PROCESSING &&
                        "pointer-events-none"
                )}
            >
                <div
                    className={classNames(
                        "bg-accent px-3 py-4 space-y-4",
                        method === "UPDATE" && "mb-4"
                    )}
                >
                    {/* Số chương */}
                    <div className="relative">
                        <label
                            htmlFor="input-num"
                            className="w-full cursor-pointer block mb-1 font-semibold"
                        >
                            <span className="text-red-600 pr-2">*</span>Số
                            chương
                        </label>
                        <p className="italic mb-2 text-sm text-slate-400">
                            Tối đa 5 kí tự
                        </p>
                        <input
                            id="input-num"
                            name="num"
                            value={dataChapter.num}
                            onChange={handleOnChangeDataChapter}
                            className={`h-10 px-4 rounded-md w-full`}
                        />
                    </div>

                    {/* Tiêu đề chương */}
                    <div className="relative">
                        <label
                            htmlFor="input-title"
                            className="w-full cursor-pointer block mb-1 font-semibold"
                        >
                            Tiêu đề chương (không bắt buộc)
                        </label>
                        <p className="italic mb-2 text-sm text-slate-400">
                            Tối đa 80 kí tự
                        </p>
                        <input
                            id="input-title"
                            name="title"
                            value={dataChapter.title}
                            onChange={handleOnChangeDataChapter}
                            className={`h-10 px-4 rounded-md w-full`}
                        />
                    </div>

                    {method === "UPDATE" && (
                        <>
                            {/* Nguồn chương */}
                            <div className="relative">
                                <label
                                    htmlFor="input-originalLink"
                                    className="w-full cursor-pointer block mb-1 font-semibold"
                                >
                                    Nguồn chương (không bắt buộc)
                                </label>
                                <input
                                    id="input-originalLink"
                                    name="originalLink"
                                    value={dataChapter.originalLink}
                                    onChange={handleOnChangeDataChapter}
                                    className={`h-10 px-4 rounded-md w-full`}
                                />
                            </div>
                            <div className="py-3 px-3 -mx-3 z-10 bg-accent border-t border-slate-700 sticky bottom-0 left-0 right-0">
                                <button
                                    onClick={handleUpdateInfoChapter}
                                    className="h-10 px-5 bg-blue-600 hover:bg-blue-700 rounded-md w-full flex items-center justify-center"
                                >
                                    {isLoading === "loading_update_chapter" ? (
                                        <IconLoadingSpin />
                                    ) : (
                                        "Cập nhật thông tin"
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </div>

                <div className="bg-accent px-3 py-4 mb-4">
                    {/* Mã nguồn ảnh */}
                    {[UserRole.ADMIN, UserRole.EDITOR].includes(
                        session?.user?.role as UserRole
                    ) && (
                        <div>
                            {/* Đường dẫn lấy chương */}
                            <div className="relative mb-2">
                                <label
                                    htmlFor="input-originalUrl"
                                    className="w-full cursor-pointer block mb-1 font-semibold"
                                >
                                    Đường dẫn chương truyện (không bắt buộc)
                                </label>
                                <div className="italic mb-2 text-sm text-slate-400">
                                    <p>
                                        Nếu chương này bạn lấy từ nguồn nào đó
                                        ví dụ như: truyenqq, nettruyenviet,..
                                        thì mới cần điền
                                    </p>
                                </div>
                                <input
                                    id="input-originalUrl"
                                    name="originalLink"
                                    value={dataOriginalLink}
                                    onChange={(e) =>
                                        setDataOriginalLink(e.target.value)
                                    }
                                    className={`h-10 px-4 rounded-md w-full`}
                                />
                            </div>

                            {dataOriginalLink?.length > 0 && (
                                <>
                                    <label
                                        htmlFor="textarea-html"
                                        className="w-full cursor-pointer block mb-2 font-semibold"
                                    >
                                        Mã nguồn chương (Mã HTML)
                                    </label>

                                    <div className="relative mb-2 rounded-lg px-1 py-1 border-slate-700 bg-slate-900 border">
                                        <textarea
                                            disabled
                                            value={dataContent}
                                            onChange={(e) =>
                                                setDataContent(e.target.value)
                                            }
                                            className="w-full text-sm rounded-sm flex-1 p-3 text-[12px] resize-none opacity-70 h-[100px] outline-none bg-transparent"
                                        />
                                        <div className="text-sm flex gap-2">
                                            <button
                                                onClick={handlePasteDataContent}
                                                className="w-full text-white bg-blue-600 rounded-lg py-2.5 outline-none text-sm font-medium leading-5 text-center"
                                            >
                                                Dán
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setDataContent("")
                                                }
                                                className="w-full text-white bg-red-600 rounded-lg py-2.5 outline-none text-sm font-medium leading-5 text-center"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </div>

                                    {dataOriginalLink?.length > 0 && (
                                        <button
                                            onClick={handleConvertDataImages}
                                            className={classNames(
                                                "w-full text-white bg-green-600 rounded-lg py-2.5 outline-none text-sm font-medium leading-5 text-center",
                                                isLoading ===
                                                    "loading_convert_data_image" &&
                                                    "pointer-events-none"
                                            )}
                                        >
                                            {isLoading ===
                                            "loading_convert_data_image" ? (
                                                <IconSpinner className="w-5 h-5 mx-auto animate-spin fill-white" />
                                            ) : (
                                                "Chuyển đổi"
                                            )}
                                        </button>
                                    )}

                                    <div className="pt-2">
                                        {Object.keys(listOptionsImages).length >
                                            0 && (
                                            <div>
                                                <div className="flex flex-wrap gap-2 pb-2">
                                                    {Object.keys(
                                                        listOptionsImages
                                                    )?.map((domain) => {
                                                        return (
                                                            <div
                                                                key={domain}
                                                                onClick={() =>
                                                                    setOptionSelect(
                                                                        domain
                                                                    )
                                                                }
                                                                className={`cursor-pointer flex items-center px-3 py-2 rounded-md ${
                                                                    domain ===
                                                                    optionSelect
                                                                        ? "bg-blue-600"
                                                                        : "bg-slate-800"
                                                                }`}
                                                            >
                                                                <Image
                                                                    alt=""
                                                                    unoptimized
                                                                    width={500}
                                                                    height={500}
                                                                    src={`/api/image/load?referer=${dataChapter?.originalLink}&url=${listOptionsImages[domain][0]}`}
                                                                    className="w-8 h-16 rounded-md bg-slate-700 object-cover object-top"
                                                                />
                                                                <span className="pl-2">
                                                                    {domain.replace(
                                                                        /https?:\/\//g,
                                                                        ""
                                                                    )}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                <button
                                                    onClick={handleApplyImages}
                                                    className={classNames(
                                                        "w-full text-white bg-indigo-700 rounded-lg py-2.5 outline-none text-sm font-medium leading-5 text-center"
                                                    )}
                                                >
                                                    Nhập
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    <div ref={stepLineRef}></div>

                    <div className="border-slate-600 -mx-3 mt-3"></div>

                    {/* IMAGES CHAPTER */}
                    <div
                        className={classNames(
                            "",
                            isLoading === "loading_translate_image" &&
                                "opacity-60 select-none pointer-events-none"
                        )}
                    >
                        <div className="">
                            {chapterSlice && (
                                <>
                                    {/* INFO CHAPTER */}
                                    <div className="">
                                        <div className="mt-3 mb-3">
                                            Số lượng ảnh hiện tại:{" "}
                                            {chapterSlice?.items.length}
                                        </div>
                                    </div>

                                    <div className="px-3 py-4 rounded-lg bg-accent-20 space-y-3">
                                        <FormSettings
                                            id="isAddBanner"
                                            description="Thêm banners ở đầu và cuối ảnh"
                                            isActive={
                                                chapterSlice?.settings
                                                    .isAddBanner
                                            }
                                            setActive={(status) =>
                                                dispatch(
                                                    updateSetting({
                                                        isAddBanner: status,
                                                    })
                                                )
                                            }
                                            title="Thêm banners"
                                        />
                                        <FormSettings
                                            id="isAddWatermark"
                                            description="Thêm watermark vào trong ảnh"
                                            isActive={
                                                chapterSlice?.settings
                                                    .isAddWatermark
                                            }
                                            setActive={(status) =>
                                                dispatch(
                                                    updateSetting({
                                                        isAddWatermark: status,
                                                    })
                                                )
                                            }
                                            title="Thêm watermark"
                                        />
                                        <FormSettings
                                            id="isShowImages"
                                            description=""
                                            isActive={
                                                chapterSlice?.settings
                                                    ?.isShowImages
                                            }
                                            setActive={(status) =>
                                                dispatch(
                                                    updateSetting({
                                                        isShowImages: status,
                                                    })
                                                )
                                            }
                                            title="Hiện ảnh xem trước"
                                        />
                                        <FormSettings
                                            id="isMerge"
                                            description="Nối ảnh cùng kích thích, tăng tốc độ upload ảnh và load ảnh (chú ý: khi nối sẽ sửa lại khó!)"
                                            isActive={
                                                chapterSlice?.settings?.isMerge
                                            }
                                            setActive={(status) =>
                                                dispatch(
                                                    updateSetting({
                                                        isMerge: status,
                                                    })
                                                )
                                            }
                                            title="Nối ảnh"
                                        />
                                    </div>

                                    <div>
                                        {isLoading ===
                                            "loading_create_chapter" && (
                                            <ChapterProgressBar
                                                currentStep={step}
                                            />
                                        )}
                                    </div>
                                    {/* Batch Translate Section */}
                                    <div className="mt-5 px-3 py-4 rounded-lg bg-accent-20 space-y-3 mb-4">
                                        <div className="font-semibold">
                                            Dịch tự động hàng loạt
                                        </div>
                                        <p className="text-sm italic">
                                            Dịch tất cả ảnh cùng lúc (tối đa 5 ảnh một lúc)
                                        </p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Ngôn ngữ nguồn
                                                </label>
                                                <select
                                                    value={batchTranslateSourceLang}
                                                    onChange={(e) =>
                                                        setBatchTranslateSourceLang(
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={isBatchTranslating}
                                                    className="w-full px-3 py-2 bg-accent-40 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {optionsLanguageData.map((lang) => (
                                                        <option
                                                            key={lang.id}
                                                            value={lang.source}
                                                        >
                                                            {lang.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Ngôn ngữ đích
                                                </label>
                                                <select
                                                    value={batchTranslateTargetLang}
                                                    onChange={(e) =>
                                                        setBatchTranslateTargetLang(
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={isBatchTranslating}
                                                    className="w-full px-3 py-2 bg-accent-40 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <option value="vi">Tiếng Việt</option>
                                                    <option value="en">Tiếng Anh</option>
                                                </select>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleBatchTranslate}
                                            disabled={
                                                isBatchTranslating ||
                                                chapterSlice.items.length === 0
                                            }
                                            className={classNames(
                                                "w-full py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2",
                                                isBatchTranslating ||
                                                    chapterSlice.items.length === 0
                                                    ? "bg-slate-600 text-gray-400 cursor-not-allowed"
                                                    : "bg-purple-600 hover:bg-purple-700 text-white"
                                            )}
                                        >
                                            {isBatchTranslating ? (
                                                <>
                                                    <IconSpinner className="w-5 h-5 animate-spin fill-white" />
                                                    Đang dịch...
                                                </>
                                            ) : (
                                                "Dịch tự động hàng loạt"
                                            )}
                                        </button>

                                        <div className="flex md:flex-row flex-col gap-2 py-3">
                                            <button
                                                onClick={handleSortItems}
                                                className="py-2 px-3 text-sm w-full text-white bg-slate-700 hover:bg-slate-700/90 rounded-md"
                                            >
                                                Sắp xếp nhanh (theo tên)
                                            </button>
                                            <button
                                                onClick={handleClearItems}
                                                className="py-2 px-3 text-sm w-full text-white bg-red-600 hover:bg-red-600/90 rounded-md"
                                            >
                                                Xóa ảnh chương
                                            </button>
                                        </div>
                                    </div>

                                    <div className="py-5">
                                        <ListItemFull
                                            handleTranslate={handleTranslate}
                                            handleRemoveItem={handleRemoveItem}
                                            handleAddItems={
                                                handleAddItemsByFile
                                            }
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="py-3 px-3 -mx-3 z-1 bg-accent border-t border-slate-700 sticky bottom-0 left-0 right-0">
                            <button
                                onClick={handleActionChapter}
                                className="h-10 px-5 bg-blue-600 hover:bg-blue-700 rounded-md w-full flex items-center justify-center"
                            >
                                {isLoading === "loading_create_chapter" ? (
                                    <IconLoadingSpin />
                                ) : method === "UPDATE" ? (
                                    "Cập nhật Ảnh"
                                ) : (
                                    "Đăng tải chương"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {chapterSlice?.activeItem?.previewUrl && (
                <ModalShowImages image={chapterSlice?.activeItem} />
            )}

            {translateImageId && (
                <ModalTranslate
                    isOpen={translateModalOpen}
                    onClose={() => {
                        setTranslateModalOpen(false);
                        setTranslateImageId(null);
                    }}
                    imageFile={localFilesRef.current[translateImageId] || null}
                    originalImageUrl={
                        chapterSlice.items.find((item) => item.id === translateImageId)
                            ?.previewUrl || null
                    }
                    onUpdateImage={(newFile, newPreviewUrl) => {
                        if (translateImageId) {
                            dispatch(updateItem({ id: translateImageId, previewUrl: newPreviewUrl }));
                            localFilesRef.current[translateImageId] = newFile;
                        }
                    }}
                />
            )}
        </div>
    );
};

export default CreatorFormChapterV1Template;

const FormSettings = ({
    id,
    title,
    description,
    isActive,
    setActive,
}: {
    id: string;
    title: string;
    description: string;
    isActive: boolean;
    setActive: (checked: boolean) => void;
}) => {
    return (
        <>
            <div>
                <div className="font-semibold">{title}</div>
                <p className="mb-3 text-sm text-gray-400 italic">
                    {description}
                </p>
                <Switch
                    id={id}
                    checked={isActive}
                    onChange={setActive}
                    className={`${
                        isActive ? "bg-blue-600" : "bg-gray-200"
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                    <span
                        className={`${
                            isActive ? "translate-x-6" : "translate-x-1"
                        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                </Switch>
            </div>
        </>
    );
};
