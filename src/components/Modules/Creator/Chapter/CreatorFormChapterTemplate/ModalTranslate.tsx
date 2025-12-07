"use client";

import Image from "next/image";
import { Fragment, useState, useRef, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import classNames from "@/utils/classNames";
import IconClose from "@/components/Modules/Icons/IconClose";
import IconSpinner from "@/components/Modules/Icons/IconSpinner";
import translateService, {
    TranslateImageResponse,
    SelectTextResponse,
} from "@/services/translate.services";
import { optionsLanguageData } from "@/store/chapter/chapter.reducer";
import { toast } from "sonner";

interface ModalTranslateProps {
    isOpen: boolean;
    onClose: () => void;
    imageFile: File | null;
    originalImageUrl: string | null;
    onUpdateImage: (newFile: File, newPreviewUrl: string) => void;
}

type TranslateMode = "full" | "basic" | null;
type BasicStep = "select" | "result" | "final" | null;

interface TextBox {
    id: number;
    text_bbox: [number, number, number, number];
}

const ModalTranslate = ({
    isOpen,
    onClose,
    imageFile,
    originalImageUrl,
    onUpdateImage,
}: ModalTranslateProps) => {
    const [sourceLang, setSourceLang] = useState("en");
    const [targetLang, setTargetLang] = useState("vi");
    const [isLoading, setIsLoading] = useState(false);
    const [translateMode, setTranslateMode] = useState<TranslateMode>(null);
    const [basicStep, setBasicStep] = useState<BasicStep>(null);

    // Full translate
    const [translatedImageUrl, setTranslatedImageUrl] = useState<string | null>(
        null
    );

    // Basic translate - step 1
    const [selectTextData, setSelectTextData] =
        useState<SelectTextResponse | null>(null);
    const [selectedBoxes, setSelectedBoxes] = useState<Set<number>>(new Set());
    const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string | null>(
        null
    );
    const imageRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvasDisplayInfo, setCanvasDisplayInfo] = useState<{
        naturalWidth: number;
        naturalHeight: number;
        displayWidth: number;
        displayHeight: number;
    } | null>(null);

    // Basic translate - step 2
    const [detailData, setDetailData] = useState<TranslateImageResponse | null>(
        null
    );
    const [inpaintedImageUrl, setInpaintedImageUrl] = useState<string | null>(
        null
    );
    const [finalImageUrl, setFinalImageUrl] = useState<string | null>(null);
    const canvasResultRef = useRef<HTMLCanvasElement>(null);
    const imageResultRef = useRef<HTMLImageElement>(null);
    const [canvasResultDisplayInfo, setCanvasResultDisplayInfo] = useState<{
        naturalWidth: number;
        naturalHeight: number;
        displayWidth: number;
        displayHeight: number;
    } | null>(null);
    const [blockTranslations, setBlockTranslations] = useState<Record<number, string>>(
        {}
    );

    useEffect(() => {
        if (detailData?.blocks && detailData.blocks.length > 0) {
            const mapping: Record<number, string> = {};
            detailData.blocks.forEach((block, idx) => {
                mapping[idx] = block.translation || "";
            });
            setBlockTranslations(mapping);
        } else {
            setBlockTranslations({});
        }
    }, [detailData]);

    // Khởi tạo: tất cả boxes đều được chọn
    useEffect(() => {
        if (selectTextData?.boxes) {
            setSelectedBoxes(
                new Set(selectTextData.boxes.map((box) => box.id))
            );
        }
    }, [selectTextData]);

    useEffect(() => {
        if (!imageFile) {
            setOriginalPreviewUrl(null);
            return;
        }
        const url = URL.createObjectURL(imageFile);
        setOriginalPreviewUrl(url);
        return () => {
            URL.revokeObjectURL(url);
        };
    }, [imageFile]);

    // Draw boxes on canvas (step 1)
    useEffect(() => {
        if (
            !canvasRef.current ||
            !imageRef.current ||
            !selectTextData ||
            basicStep !== "select"
        ) {
            return;
        }

        const drawCanvas = () => {
            const canvas = canvasRef.current;
            const img = imageRef.current;
            if (!canvas || !img || !img.complete) return;

            const container = canvas.parentElement;
            if (!container) return;

            const containerWidth = container.clientWidth;
            const naturalWidth = img.naturalWidth;
            const naturalHeight = img.naturalHeight;

            if (naturalWidth === 0 || naturalHeight === 0) return;

            const scale = Math.min(containerWidth / naturalWidth, 1);
            const displayWidth = naturalWidth * scale;
            const displayHeight = naturalHeight * scale;

            canvas.width = naturalWidth;
            canvas.height = naturalHeight;
            canvas.style.width = `${displayWidth}px`;
            canvas.style.height = `${displayHeight}px`;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            ctx.clearRect(0, 0, naturalWidth, naturalHeight);
            ctx.drawImage(img, 0, 0);

            selectTextData.boxes.forEach((box) => {
                const [x1, y1, x2, y2] = box.text_bbox;
                const isSelected = selectedBoxes.has(box.id);
                ctx.strokeStyle = isSelected ? "#d40606" : "rgba(148, 163, 184, 0.6)";
                ctx.fillStyle = isSelected ? "rgba(0, 123, 255, 0.25)" : "rgba(0, 123, 255, 0)";
                ctx.fillRect(x1, y1, x2 - x1, y2 - y1);

                ctx.lineWidth = isSelected ? 3 : 1.5;
                ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
            });

            setCanvasDisplayInfo({
                naturalWidth,
                naturalHeight,
                displayWidth,
                displayHeight,
            });
        };

        const timeoutId = setTimeout(() => {
            if (imageRef.current?.complete) {
                drawCanvas();
            } else if (imageRef.current) {
                imageRef.current.onload = drawCanvas;
            }
        }, 100);

        const resizeObserver = new ResizeObserver(() => {
            if (imageRef.current?.complete) {
                drawCanvas();
            }
        });

        const container = canvasRef.current?.parentElement;
        if (container) {
            resizeObserver.observe(container);
        }

        return () => {
            clearTimeout(timeoutId);
            resizeObserver.disconnect();
        };
    }, [selectTextData, selectedBoxes, basicStep, originalPreviewUrl, originalImageUrl]);

    // Vẽ boxes lên canvas (bước 2 - result)
    useEffect(() => {
        if (
            !canvasResultRef.current ||
            !imageResultRef.current ||
            !detailData ||
            basicStep !== "result"
        ) {
            return;
        }

        const drawCanvas = () => {
            const canvas = canvasResultRef.current;
            const img = imageResultRef.current;
            if (!canvas || !img || !img.complete) return;

            // Lấy kích thước container để tính scale
            const container = canvas.parentElement;
            if (!container) return;

            const containerWidth = container.clientWidth;
            const naturalWidth = img.naturalWidth;
            const naturalHeight = img.naturalHeight;

            if (naturalWidth === 0 || naturalHeight === 0) return;

            // Tính scale để fit vào container (giữ tỷ lệ)
            const scale = Math.min(containerWidth / naturalWidth, 1);
            const displayWidth = naturalWidth * scale;
            const displayHeight = naturalHeight * scale;

            // Set canvas internal size = natural size (để vẽ chính xác)
            // Lưu ý: Khi set width/height, canvas sẽ tự động clear và context bị reset
            canvas.width = naturalWidth;
            canvas.height = naturalHeight;

            // Set canvas display size = scaled size (để không bị CSS scale)
            canvas.style.width = `${displayWidth}px`;
            canvas.style.height = `${displayHeight}px`;

            // Lấy lại context sau khi set width/height (vì context bị reset)
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            // Vẽ ảnh đã xóa text (không scale, vẽ với kích thước gốc để tọa độ boxes khớp)
            ctx.drawImage(img, 0, 0);

            // Vẽ boxes
            detailData.blocks.forEach((block, idx) => {
                if (block.text_bbox) {
                    const [x1, y1, x2, y2] = block.text_bbox;
                    ctx.strokeStyle = "#3b82f6"; // blue-500
                    ctx.lineWidth = 2;
                    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
                }
            });

            setCanvasResultDisplayInfo({
                naturalWidth,
                naturalHeight,
                displayWidth,
                displayHeight,
            });
        };

        // Đợi một chút để đảm bảo container đã render
        const timeoutId = setTimeout(() => {
            if (imageResultRef.current?.complete) {
                drawCanvas();
            } else {
                imageResultRef.current!.onload = drawCanvas;
            }
        }, 100);

        // Listen resize để vẽ lại khi container thay đổi
        const resizeObserver = new ResizeObserver(() => {
            if (imageResultRef.current?.complete) {
                drawCanvas();
            }
        });

        const container = canvasResultRef.current?.parentElement;
        if (container) {
            resizeObserver.observe(container);
        }

        return () => {
            clearTimeout(timeoutId);
            resizeObserver.disconnect();
        };
    }, [detailData, basicStep]);

    const handleTranslateFull = async () => {
        if (!imageFile) {
            toast.error("Không có ảnh để dịch");
            return;
        }

        setIsLoading(true);
        setTranslateMode("full");
        try {
            const blob = await translateService.translateImageFull({
                imageFile,
                source_lng_cd: sourceLang,
                target_lng_cd: targetLang,
            });

            const url = URL.createObjectURL(blob);
            setTranslatedImageUrl(url);
            toast.success("Dịch toàn bộ thành công!");
        } catch (error: any) {
            console.error("Translate full error:", error);
            toast.error(error?.response?.data?.error || "Lỗi khi dịch ảnh");
            setTranslateMode(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTranslateBasic = async () => {
        if (!imageFile) {
            toast.error("Không có ảnh để dịch");
            return;
        }

        setIsLoading(true);
        setTranslateMode("basic");
        setBasicStep("select");
        setFinalImageUrl(null);
        try {
            const data = await translateService.selectText({
                imageFile,
                source_lng_cd: sourceLang,
            });

            setSelectTextData(data);
            toast.success("Đã phát hiện các text boxes!");
        } catch (error: any) {
            console.error("Select text error:", error);
            toast.error(
                error?.response?.data?.error || "Lỗi khi phát hiện text"
            );
            setTranslateMode(null);
            setBasicStep(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleContinue = async () => {
        if (!imageFile || !selectTextData) {
            toast.error("Không có dữ liệu để tiếp tục");
            return;
        }

        const selectedBoxList = selectTextData.boxes
            .filter((box) => selectedBoxes.has(box.id))
            .map((box) => box.text_bbox);

        if (selectedBoxList.length === 0) {
            toast.error("Vui lòng chọn ít nhất một box");
            return;
        }

        setIsLoading(true);
        try {
            const data = await translateService.translateImageDetail({
                imageFile,
                source_lng_cd: sourceLang,
                target_lng_cd: targetLang,
                selectedBoxes: selectedBoxList,
            });

            setDetailData(data);
            setFinalImageUrl(null);

            // Convert base64 to blob URL
            if (data.inpainted_image) {
                setInpaintedImageUrl(data.inpainted_image);
            }

            setBasicStep("result");
            toast.success("Dịch cơ bản thành công!");
        } catch (error: any) {
            console.error("Translate detail error:", error);
            toast.error(error?.response?.data?.error || "Lỗi khi dịch ảnh");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangeBlockTranslation = (blockIndex: number, value: string) => {
        setBlockTranslations((prev) => ({
            ...prev,
            [blockIndex]: value,
        }));
    };

    const handleApplyEditedText = async () => {
        if (!detailData || !inpaintedImageUrl) {
            toast.error("Không có dữ liệu để chèn text");
            return;
        }
        if (!imageFile) {
            toast.error("Không tìm thấy file ảnh gốc");
            return;
        }

        const preparedBlocks = detailData.blocks.reduce<
            TranslateImageResponse["blocks"]
        >((acc, block, idx) => {
            if (!block.text_bbox) {
                return acc;
            }
            acc.push({
                ...block,
                text_bbox: block.text_bbox,
                translation:
                    typeof blockTranslations[idx] === "string"
                        ? blockTranslations[idx]
                        : block.translation || "",
            });
            return acc;
        }, []);

        if (preparedBlocks.length === 0) {
            toast.error("Không có block hợp lệ để chèn text");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(inpaintedImageUrl);
            const blob = await response.blob();
            const cleanFile = new File(
                [blob],
                imageFile?.name ? `clean-${imageFile.name}` : "inpainted.jpg",
                {
                    type: blob.type || "image/jpeg",
                }
            );

            const result = await translateService.applyEditedText({
                cleanImageFile: cleanFile,
                blocks: preparedBlocks,
            });

            setFinalImageUrl(result.rendered_image);
            setBasicStep("final");
            toast.success("Đã thêm text vào ảnh!");
        } catch (error: any) {
            console.error("Apply text error:", error);
            toast.error(error?.response?.data?.error || "Lỗi khi chèn text");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateImage = async () => {
        if (translateMode === "full" && translatedImageUrl) {
            // Lấy file từ blob URL
            const response = await fetch(translatedImageUrl);
            const blob = await response.blob();
            const newFile = new File(
                [blob],
                imageFile?.name || "translated.jpg",
                {
                    type: "image/jpeg",
                }
            );
            onUpdateImage(newFile, translatedImageUrl);
            toast.success("Đã cập nhật ảnh!");
            onClose();
        } else if (translateMode === "basic" && inpaintedImageUrl) {
            const targetUrl =
                basicStep === "final" && finalImageUrl
                    ? finalImageUrl
                    : inpaintedImageUrl;
            if (!targetUrl) {
                toast.error("Không có ảnh kết quả để cập nhật");
                return;
            }

            // Convert base64 to blob
            const response = await fetch(targetUrl);
            const blob = await response.blob();
            const newFile = new File(
                [blob],
                imageFile?.name || "translated.jpg",
                {
                    type: "image/jpeg",
                }
            );
            onUpdateImage(newFile, targetUrl);
            toast.success("Đã cập nhật ảnh!");
            onClose();
        }
    };

    const handleToggleBox = (boxId: number) => {
        const newSelected = new Set(selectedBoxes);
        if (newSelected.has(boxId)) {
            newSelected.delete(boxId);
        } else {
            newSelected.add(boxId);
        }
        setSelectedBoxes(newSelected);
    };

    const handleClose = () => {
        // Cleanup
        if (translatedImageUrl) {
            URL.revokeObjectURL(translatedImageUrl);
        }
        if (inpaintedImageUrl && inpaintedImageUrl.startsWith("blob:")) {
            URL.revokeObjectURL(inpaintedImageUrl);
        }
        if (finalImageUrl && finalImageUrl.startsWith("blob:")) {
            URL.revokeObjectURL(finalImageUrl);
        }
        if (originalPreviewUrl) {
            URL.revokeObjectURL(originalPreviewUrl);
        }
        setTranslatedImageUrl(null);
        setInpaintedImageUrl(null);
        setFinalImageUrl(null);
        setSelectTextData(null);
        setDetailData(null);
        setTranslateMode(null);
        setBasicStep(null);
        setSelectedBoxes(new Set());
        setOriginalPreviewUrl(null);
        setCanvasDisplayInfo(null);
        setCanvasResultDisplayInfo(null);
        setBlockTranslations({});
        onClose();
    };

    const displayOriginalUrl = originalPreviewUrl || originalImageUrl;

    return (
        <Dialog as={Fragment} open={isOpen} onClose={handleClose}>
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                <Dialog.Overlay className="fixed inset-0 bg-black/70 z-[151]" />
                <div className="z-[152] relative bg-slate-800 rounded-lg shadow-xl max-w-8xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-white">
                            Dịch ảnh
                        </h2>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-slate-700 rounded-md transition-colors"
                        >
                            <IconClose className="w-6 h-6 fill-white" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Language Selection */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Ngôn ngữ nguồn
                                </label>
                                <select
                                    value={sourceLang}
                                    onChange={(e) =>
                                        setSourceLang(e.target.value)
                                    }
                                    className="w-full px-3 py-2 bg-slate-700 text-white rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={isLoading}
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
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Ngôn ngữ đích
                                </label>
                                <select
                                    value={targetLang}
                                    onChange={(e) =>
                                        setTargetLang(e.target.value)
                                    }
                                    className="w-full px-3 py-2 bg-slate-700 text-white rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={isLoading}
                                >
                                    <option value="vi">Tiếng Việt</option>
                                    <option value="en">Tiếng Anh</option>
                                </select>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {(
                            <div className="flex gap-4">
                                <button
                                    onClick={handleTranslateFull}
                                    disabled={isLoading || !imageFile}
                                    className={classNames(
                                        "flex-1 px-4 py-2 rounded-md font-medium transition-colors",
                                        isLoading || !imageFile
                                            ? "bg-slate-600 text-gray-400 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-700 text-white"
                                    )}
                                >
                                    {isLoading && translateMode === "full" ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <IconSpinner className="w-5 h-5 animate-spin fill-white" />
                                            Đang dịch...
                                        </span>
                                    ) : (
                                        "Dịch toàn bộ"
                                    )}
                                </button>
                                <button
                                    onClick={handleTranslateBasic}
                                    disabled={isLoading || !imageFile}
                                    className={classNames(
                                        "flex-1 px-4 py-2 rounded-md font-medium transition-colors",
                                        isLoading || !imageFile
                                            ? "bg-slate-600 text-gray-400 cursor-not-allowed"
                                            : "bg-green-600 hover:bg-green-700 text-white"
                                    )}
                                >
                                    {isLoading && translateMode === "basic" ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <IconSpinner className="w-5 h-5 animate-spin fill-white" />
                                            Đang dịch...
                                        </span>
                                    ) : (
                                        "Dịch cơ bản"
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Step 1: Select Boxes */}
                        {basicStep === "select" && selectTextData && (
                            <>
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-6 space-y-2">
                                        <h3 className="text-sm font-medium text-gray-300">
                                            Ảnh gốc
                                        </h3>
                                        <div className="relative border border-slate-600 rounded-lg overflow-hidden bg-slate-900">
                                            {displayOriginalUrl && (
                                                <Image
                                                    alt="Original"
                                                    unoptimized
                                                    width={500}
                                                    height={500}
                                                    src={displayOriginalUrl}
                                                    className="w-full h-auto"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* Original Image with boxes */}
                                    <div className="col-span-6 space-y-2">
                                        <h3 className="text-sm font-medium text-gray-300">
                                            Ảnh gốc với boxes
                                        </h3>
                                        <div className="relative border border-slate-600 rounded-lg overflow-hidden bg-slate-900">
                                            {displayOriginalUrl && (
                                                <div className="relative">
                                                    <img
                                                        ref={imageRef}
                                                        src={displayOriginalUrl}
                                                        alt="Original with boxes"
                                                        className="w-full h-auto"
                                                        style={{ display: "none" }}
                                                    />
                                                    <canvas
                                                        ref={canvasRef}
                                                        style={{ maxWidth: "100%" }}
                                                    />
                                                    {canvasDisplayInfo && (
                                                        <div className="absolute inset-0">
                                                            {selectTextData.boxes.map(
                                                                (box) => {
                                                                    const [x1, y1, x2, y2] =
                                                                        box.text_bbox;
                                                                    const left =
                                                                        (x1 /
                                                                            canvasDisplayInfo.naturalWidth) *
                                                                        100;
                                                                    const top =
                                                                        (y1 /
                                                                            canvasDisplayInfo.naturalHeight) *
                                                                        100;
                                                                    const width =
                                                                        ((x2 - x1) /
                                                                            canvasDisplayInfo.naturalWidth) *
                                                                        100;
                                                                    const height =
                                                                        ((y2 - y1) /
                                                                            canvasDisplayInfo.naturalHeight) *
                                                                        100;
                                                                    const isSelected =
                                                                        selectedBoxes.has(box.id);

                                                                    return (
                                                                        <div
                                                                            key={box.id}
                                                                            className={classNames(
                                                                                "absolute border rounded-sm",
                                                                                isSelected
                                                                                    ? "border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.6)]"
                                                                                    : "border-slate-600 border-dashed opacity-80"
                                                                            )}
                                                                            style={{
                                                                                left: `${left}%`,
                                                                                top: `${top}%`,
                                                                                width: `${width}%`,
                                                                                height: `${height}%`,
                                                                            }}
                                                                        >
                                                                            <div className="absolute -top-6 left-0 flex items-center gap-2">
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() =>
                                                                                        handleToggleBox(
                                                                                            box.id
                                                                                        )
                                                                                    }
                                                                                    className={classNames(
                                                                                        "px-2 py-0.5 text-xs uppercase font-bold text-white transition-colors",
                                                                                        isSelected
                                                                                            ? "bg-red-600 hover:bg-red-700"
                                                                                            : "bg-green-600 hover:bg-green-700"
                                                                                    )}
                                                                                >
                                                                                    {isSelected ? "Xóa" : "Chọn"}
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                }
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Continue Button */}
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleContinue}
                                        disabled={
                                            isLoading ||
                                            selectedBoxes.size === 0
                                        }
                                        className={classNames(
                                            "px-6 py-2 rounded-md font-medium transition-colors",
                                            isLoading ||
                                                selectedBoxes.size === 0
                                                ? "bg-slate-600 text-gray-400 cursor-not-allowed"
                                                : "bg-blue-600 hover:bg-blue-700 text-white"
                                        )}
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <IconSpinner className="w-5 h-5 animate-spin fill-white" />
                                                Đang xử lý...
                                            </span>
                                        ) : (
                                            "Tiếp tục"
                                        )}
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Step 2: Result */}
                        {basicStep === "result" &&
                            detailData &&
                            inpaintedImageUrl && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Original Image */}
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-medium text-gray-300">
                                                Ảnh gốc
                                            </h3>
                                            <div className="relative border border-slate-600 rounded-lg overflow-hidden bg-slate-900">
                                                {displayOriginalUrl && (
                                                    <Image
                                                        alt="Original"
                                                        unoptimized
                                                        width={500}
                                                        height={500}
                                                        src={displayOriginalUrl}
                                                        className="w-full h-auto"
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        {/* Inpainted Image with boxes */}
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-medium text-gray-300">
                                                Ảnh đã xóa text
                                            </h3>
                                            <div className="relative border border-slate-600 rounded-lg overflow-hidden bg-slate-900">
                                                <div className="relative">
                                                    <img
                                                        ref={imageResultRef}
                                                        src={inpaintedImageUrl}
                                                        alt="Inpainted"
                                                        className="w-full h-auto"
                                                        style={{
                                                            display: "none",
                                                        }}
                                                    />
                                                    <canvas
                                                        ref={canvasResultRef}
                                                        style={{
                                                            maxWidth: "100%",
                                                        }}
                                                    />
                                                    {canvasResultDisplayInfo && (
                                                        <div className="absolute inset-0 pointer-events-none">
                                                            {detailData.blocks.map(
                                                                (block, idx) => {
                                                                    if (!block.text_bbox) {
                                                                        return null;
                                                                    }
                                                                    const [x1, y1, x2, y2] =
                                                                        block.text_bbox;
                                                                    const left =
                                                                        (x1 /
                                                                            canvasResultDisplayInfo.naturalWidth) *
                                                                        100;
                                                                    const top =
                                                                        (y1 /
                                                                            canvasResultDisplayInfo.naturalHeight) *
                                                                        100;
                                                                    const width =
                                                                        ((x2 - x1) /
                                                                            canvasResultDisplayInfo.naturalWidth) *
                                                                        100;
                                                                    const height =
                                                                        ((y2 - y1) /
                                                                            canvasResultDisplayInfo.naturalHeight) *
                                                                        100;

                                                                    return (
                                                                        <div
                                                                            key={`detail-block-${idx}`}
                                                                            className="absolute border border-blue-400/70 rounded-sm"
                                                                            style={{
                                                                                left: `${left}%`,
                                                                                top: `${top}%`,
                                                                                width: `${width}%`,
                                                                                height: `${height}%`,
                                                                            }}
                                                                        >
                                                                            <div className="absolute top-0 left-0 bg-blue-600/60 text-white text-[10px] leading-snug px-1 py-1 border border-slate-700">
                                                                                {block.translation || "(trống)"}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                }
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Blocks List */}
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium text-gray-300">
                                            Danh sách text blocks đã dịch
                                        </h3>
                                        <div className="max-h-60 overflow-y-auto space-y-2 border border-slate-600 rounded-lg p-4 bg-slate-900">
                                            {detailData.blocks.map(
                                                (block, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="p-3 rounded-md border bg-slate-700 border-blue-500 space-y-2"
                                                    >
                                                        <p className="text-xs text-gray-400">
                                                            Text gốc:{" "}
                                                            {block.text ||
                                                                "(trống)"}
                                                        </p>
                                                        <div className="space-y-1">
                                                            <label className="text-xs font-semibold text-slate-100">
                                                                Chỉnh sửa bản dịch
                                                            </label>
                                                            <textarea
                                                                value={
                                                                    blockTranslations[
                                                                        idx
                                                                    ] || ""
                                                                }
                                                                onChange={(e) =>
                                                                    handleChangeBlockTranslation(
                                                                        idx,
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                rows={3}
                                                                className="w-full rounded-md bg-slate-800 border border-slate-600 text-sm text-white px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                                                                placeholder={
                                                                    block.translation ||
                                                                    "(Nhập bản dịch)"
                                                                }
                                                            />
                                                            <p className="text-[11px] text-slate-400 text-right">
                                                                {(blockTranslations[idx] || "")
                                                                    .length}{" "}
                                                                ký tự
                                                            </p>
                                                        </div>
                                                        <p className="text-xs text-gray-500">
                                                            Loại:{" "}
                                                            {block.text_class}
                                                        </p>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    {/* Next Button */}
                                    <div className="flex justify-end">
                                        <button
                                            onClick={handleApplyEditedText}
                                            disabled={isLoading}
                                            className={classNames(
                                                "px-6 py-2 rounded-md font-medium transition-colors",
                                                isLoading
                                                    ? "bg-slate-600 text-gray-400 cursor-not-allowed"
                                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                                            )}
                                        >
                                            {isLoading ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <IconSpinner className="w-5 h-5 animate-spin fill-white" />
                                                    Đang chèn text...
                                                </span>
                                            ) : (
                                                "Tiếp theo"
                                            )}
                                        </button>
                                    </div>
                                </>
                            )}

                        {/* Step 3: Final result */}
                        {basicStep === "final" && finalImageUrl && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium text-gray-300">
                                            Ảnh gốc
                                        </h3>
                                        <div className="relative border border-slate-600 rounded-lg overflow-hidden bg-slate-900">
                                            {displayOriginalUrl && (
                                                <Image
                                                    alt="Original"
                                                    unoptimized
                                                    width={500}
                                                    height={500}
                                                    src={displayOriginalUrl}
                                                    className="w-full h-auto"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium text-gray-300">
                                            Ảnh đã chèn text
                                        </h3>
                                        <div className="relative border border-slate-600 rounded-lg overflow-hidden bg-slate-900">
                                            <Image
                                                alt="Final translated"
                                                unoptimized
                                                width={500}
                                                height={500}
                                                src={finalImageUrl}
                                                className="w-full h-auto"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={handleUpdateImage}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
                                    >
                                        Cập nhật ảnh
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Full Translate Result */}
                        {translateMode === "full" && translatedImageUrl && (
                            <div className="grid grid-cols-2 gap-4">
                                {/* Original Image */}
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-gray-300">
                                        Ảnh gốc
                                    </h3>
                                    <div className="relative border border-slate-600 rounded-lg overflow-hidden bg-slate-900">
                                        {displayOriginalUrl && (
                                            <Image
                                                alt="Original"
                                                unoptimized
                                                width={500}
                                                height={500}
                                                src={displayOriginalUrl}
                                                className="w-full h-auto"
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Translated Image */}
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-gray-300">
                                        Ảnh đã dịch
                                    </h3>
                                    <div className="relative border border-slate-600 rounded-lg overflow-hidden bg-slate-900">
                                        <Image
                                            alt="Translated"
                                            unoptimized
                                            width={500}
                                            height={500}
                                            src={translatedImageUrl}
                                            className="w-full h-auto"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Update Button for Full Translate */}
                        {translateMode === "full" && translatedImageUrl && (
                            <div className="flex justify-end">
                                <button
                                    onClick={handleUpdateImage}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
                                >
                                    Cập nhật ảnh
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default ModalTranslate;
