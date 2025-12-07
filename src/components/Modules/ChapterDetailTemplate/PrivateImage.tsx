"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Button from "@/components/ui/Button";
import classNames from "@/utils/classNames";
import IconSpinner from "../Icons/IconSpinner";
import { ContentPageEnum } from "@/common/data.types";


interface WasmModule {
    unscramble_image_from_drm: (
        data: Uint8Array,
        w: number,
        h: number,
        drm: string
    ) => any;
}

class WasmManager {
    private static instance: WasmManager;
    private wasm: WasmModule | null = null;
    private init: Promise<void> | null = null;

    static getInstance() {
        return (this.instance ??= new WasmManager());
    }

    async initialize() {
        if (this.wasm || this.init) return this.init;
        this.init = (async () => {
            const wasm = await import(
                "@/../public/wasm/drm_tool/pkg/drm_tool.js"
            );
            if (wasm.default) await wasm.default();
            this.wasm = {
                unscramble_image_from_drm: wasm.unscramble_image_from_drm,
            };
        })();
        return this.init;
    }

    getModule() {
        return this.wasm;
    }
}

interface PrivateImageProps {
    userId?: number;
    image: {
        width: number;
        height: number;
        imageUrl: string;
        drm_data: string;
    };
    content: ContentPageEnum;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export default function PrivateImage({ image, content }: PrivateImageProps) {
    const loadId = useRef(0);
    const mounted = useRef(true);
    const prevUrl = useRef<string>();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
            const c = canvasRef.current;
            if (c) {
                const ctx = c.getContext("2d");
                ctx?.clearRect(0, 0, c.width, c.height);
                c.width = c.height = 1;
            }
        };
    }, []);

    const loadImage = useCallback(
        async (attempt = 1) => {
            if (!image?.imageUrl || !mounted.current) return;
            setLoading(true);
            setError(null);
            const currentId = ++loadId.current;

            try {
                const wasm = WasmManager.getInstance();
                await wasm.initialize();
                const mod = wasm.getModule();
                if (!mod) throw new Error("WASM chưa sẵn sàng");

                const resp = await fetch(
                    `/api/image/stream?url=${encodeURIComponent(
                        image.imageUrl
                    )}`
                );
                if (!resp.ok) throw new Error("Không tải được ảnh");
                const blob = await resp.blob();

                if (!mounted.current || currentId !== loadId.current) return;
                // Feature detection cho iOS cũ (< 14.5)
                const bitmap = typeof createImageBitmap === 'function' 
                    ? await createImageBitmap(blob).catch(() => null)
                    : null;

                const canvas = canvasRef.current!;
                const ctx = canvas.getContext("2d", {
                    willReadFrequently: true,
                })!;
                const w = bitmap?.width || image.width;
                const h = bitmap?.height || image.height;
                canvas.width = w;
                canvas.height = h;

                if (bitmap) {
                    ctx.drawImage(bitmap, 0, 0, w, h);
                    bitmap.close?.();
                } else {
                    const img = new Image();
                    img.src = URL.createObjectURL(blob);
                    await new Promise((res, rej) => {
                        img.onload = () => res(true);
                        img.onerror = () => rej("Lỗi load ảnh");
                    });
                    ctx.drawImage(
                        img,
                        0,
                        0,
                        img.naturalWidth,
                        img.naturalHeight
                    );
                    URL.revokeObjectURL(img.src);
                }

                const { data } = ctx.getImageData(0, 0, w, h);
                const raw = mod.unscramble_image_from_drm(
                    new Uint8Array(data.buffer),
                    w,
                    h,
                    image.drm_data
                );
                const decoded =
                    raw instanceof Uint8ClampedArray
                        ? raw
                        : new Uint8ClampedArray(raw);
                if (decoded.length !== data.length)
                    throw new Error("Dữ liệu giải mã sai");
                ctx.putImageData(new ImageData(decoded, w, h), 0, 0);
            } catch (e: any) {
                if (!mounted.current) return;
                if (attempt < MAX_RETRIES) {
                    await new Promise((r) =>
                        setTimeout(r, RETRY_DELAY * attempt)
                    );
                    return loadImage(attempt + 1);
                }
                setError(e.message || "Không thể tải ảnh");
            } finally {
                setLoading(false);
            }
        },
        [image?.imageUrl, image?.drm_data]
    );

    useEffect(() => {
        if (prevUrl.current === image?.imageUrl) return;
        prevUrl.current = image?.imageUrl;

        loadId.current++;
        setError(null);
        
        if (image?.imageUrl) loadImage(1);
    }, [image?.imageUrl, loadImage]);

    if (loading)
        return (
            <div className="w-full h-80 flex items-center justify-center bg-slate-800">
                <IconSpinner className="fill-blue-600 animate-spin" />
            </div>
        );

    if (error)
        return (
            <div className="w-full h-80 flex flex-col items-center justify-center bg-slate-800 p-2">
                <p className="mb-3">Lỗi khi tải ảnh</p>
                <p className="mb-5 break-words">{error}</p>
                <Button
                    onClick={() => loadImage()}
                    className="max-w-40 mx-4 text-sm font-semibold"
                >
                    Thử lại
                </Button>
            </div>
        );

    return (
        <div
            className={classNames(content === ContentPageEnum.manga && "mb-5")}
            style={{
                background:
                    "url('/static/images/chapter_load.gif') top center no-repeat",
            }}
        >
            <canvas
                ref={canvasRef}
                draggable={false}
                width={image?.width || 1}
                height={image?.height || 1}
                className="mx-auto w-full"
                onContextMenu={(e) => e.preventDefault()}
            />
            <div className="absolute inset-0 z-[1]" />
        </div>
    );
}
