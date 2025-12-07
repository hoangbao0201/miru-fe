"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useState, useCallback, useEffect, useRef } from "react";

import {
    GetChapterDetailProps,
    GetChaptersAdvancedProps,
    GetChaptersBasicProps,
} from "@/services/chapter.services";
import { Env } from "@/config/Env";
import ImageDataChapter from "./ImageDataChapter";
import { ContentPageEnum } from "@/common/data.types";
import AdsLayout from "@/components/Layouts/AdsLayout";
import formatFullDateTime from "@/utils/formatFullDateTime";
import BoxShare from "../BookDetaiTemplate/BoxShare";
import { init } from "@/utils/devtool-detect";
import { getBookTitle, getBookSlug } from "@/utils/getBookTitle";

const NavChapter = dynamic(() => import("./NavChapter"), {
    ssr: false,
    loading: () => (
        <div className="h-11 bg-slate-800 z-10 md:rounded-b-md"></div>
    ),
});
const ButtonReport = dynamic(() => import("./ButtonReport"), { ssr: false });

interface ContentChapterProps {
    servers: string[];
    content: ContentPageEnum;
    chapter: GetChapterDetailProps;
}

const ContentChapter = ({ servers, content, chapter }: ContentChapterProps) => {
    const [indexServer, setIndexServer] = useState(0);

    const handleServerChange = useCallback(() => {
        if (servers.length > 1) {
            setIndexServer((indexServer + 1) % servers.length);
        }
    }, [indexServer]);

    const openApp = () => {
        const isAndroid = /android/i.test(navigator.userAgent);
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isAndroid) {
            window.open(
                "https://play.google.com/store/apps/details?id=com.lehuuphu.ledscrolling",
                "_blank"
            );
        } else if (isIOS) {
            window.open(
                "https://apps.apple.com/us/app/led-scrolling/id6737022644",
                "_blank"
            );
        } else {
            window.open(
                "https://play.google.com/store/apps/details?id=com.lehuuphu.ledscrolling",
                "_blank"
            );
        }
    };

    const devtoolInitialized = useRef(false);
    const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const lastDetectionTimeRef = useRef<number>(0);

    useEffect(() => {
        // Chỉ khởi tạo devtool detection trên client-side và production
        if (
            typeof window !== "undefined" &&
            Env.NODE_ENV === "production" &&
            !devtoolInitialized.current
        ) {
            try {
                // Phương pháp 1: Sử dụng library hiện có
                init({
                    debug: false,
                    allowSeo: true,
                    redirect: Env.NEXT_PUBLIC_FACEBOOK_URL_SEO,
                });
                devtoolInitialized.current = true;

                // Phương pháp 2: Continuous detection với multiple techniques
                const detectDevTools = () => {
                    const now = Date.now();
                    // Throttle: chỉ check mỗi 500ms để tối ưu performance
                    if (now - lastDetectionTimeRef.current < 500) {
                        return;
                    }
                    lastDetectionTimeRef.current = now;

                    let devtoolsOpen = false;

                    // Technique 1: Check window size difference
                    const threshold = 160;
                    if (
                        window.outerHeight - window.innerHeight > threshold ||
                        window.outerWidth - window.innerWidth > threshold
                    ) {
                        devtoolsOpen = true;
                    }

                    // Technique 2: Timing attack với toString
                    const start = performance.now();
                    /./.test.toString.toString();
                    const end = performance.now();
                    if (end - start > 100) {
                        devtoolsOpen = true;
                    }

                    // Technique 3: Check console methods (chỉ khi devtools mở mới hoạt động đúng)
                    try {
                        let detected = false;
                        const element = new Image();
                        Object.defineProperty(element, "id", {
                            get: () => {
                                detected = true;
                            },
                        });
                        // eslint-disable-next-line no-console
                        console.log(element);
                        if (detected) {
                            devtoolsOpen = true;
                        }
                    } catch {
                        // Ignore errors
                    }

                    // Nếu phát hiện devtools đang mở, redirect
                    if (devtoolsOpen) {
                        const redirectUrl = Env.NEXT_PUBLIC_FACEBOOK_URL_SEO;
                        if (redirectUrl && window.location.href !== redirectUrl) {
                            window.location.href = redirectUrl;
                        }
                    }
                };

                // Chạy detection ngay lập tức
                detectDevTools();

                // Setup interval để check liên tục (mỗi 1 giây)
                detectionIntervalRef.current = setInterval(detectDevTools, 1000);

                // Thêm event listeners để detect khi devtools được mở/đóng
                const handleVisibilityChange = () => {
                    if (!document.hidden) {
                        detectDevTools();
                    }
                };
                document.addEventListener("visibilitychange", handleVisibilityChange);

                // Cleanup function
                return () => {
                    if (detectionIntervalRef.current) {
                        clearInterval(detectionIntervalRef.current);
                        detectionIntervalRef.current = null;
                    }
                    document.removeEventListener(
                        "visibilitychange",
                        handleVisibilityChange
                    );
                };
            } catch (error) {
                // Silent fail để không ảnh hưởng đến UX
                if (process.env.NODE_ENV === "development") {
                    console.error("Failed to initialize devtool detection:", error);
                }
            }
        }

        // Cleanup khi component unmount
        return () => {
            if (detectionIntervalRef.current) {
                clearInterval(detectionIntervalRef.current);
                detectionIntervalRef.current = null;
            }
        };
    }, []);

    const bookTitle = getBookTitle(chapter?.book);
    const bookSlug = getBookSlug(chapter?.book) || chapter?.book?.slug;

    return (
        <>
            {/* Server Selector */}
            <div className="mx-auto max-w-screen-8xl space-y-2">
                <div className="bg-accent w-full px-4 py-5">
                    <article className="mb-5">
                        <header className="mb-3">
                            <h1
                                title={bookTitle}
                                className="md:text-2xl text-md font-bold uppercase mb-2"
                            >
                                <Link
                                    prefetch={false}
                                    href={`/${content}/books/${bookSlug}-${chapter?.bookId}`}
                                >
                                    {bookTitle}
                                </Link>
                                <span> - Chapter {chapter?.num}</span>
                            </h1>
                            <time className="text-sm">
                                [Cập nhật lúc:{" "}
                                {formatFullDateTime(chapter?.createdAt)}]
                            </time>
                        </header>
                    </article>
                    <div className="mt-7">
                        <p className="pb-5 text-center text-sm font-bold uppercase">
                            Nếu không xem được truyện vui lòng đổi SERVER HÌNH bên
                            dưới
                        </p>
                        <div className="flex justify-center items-center flex-wrap gap-2 pb-2">
                            {servers?.map((onServer, index) => (
                                <div
                                    key={index}
                                    title={`Server ${index + 1}`}
                                    className={`${
                                        onServer === servers[indexServer]
                                            ? "bg-green-600"
                                            : "bg-gray-500 hover:bg-gray-600"
                                    } select-none cursor-pointer uppercase text-sm font-bold px-2 min-w-[150px] text-center h-10 leading-10 rounded-lg text-white`}
                                    onClick={handleServerChange}
                                >
                                    Server {index === 0 ? "Vip" : index + 1}
                                </div>
                            ))}
                            <ButtonReport
                                bookId={chapter?.bookId}
                                chapterNumber={chapter?.chapterNumber}
                            />
                        </div>
                    </div>
                </div>

                <BoxShare
                    url={`${Env.NEXT_PUBLIC_APP_URL}/r/${content}/books/${chapter?.bookId}/${chapter?.chapterNumber}`}
                    content={content}
                />
            </div>

                {/* CHAPTER CONTENT */}
            <div className="mx-auto w-full max-w-[800px] py-5 min-h-[300px] relative">
                <div className="relative flex flex-col gap-1 mb-3">
                    <div className="text-center px-4 py-5 flex items-center justify-center bg-accent">
                        <p>
                            Nhấn 2 lần vào ảnh để có thể bình luận
                            chi tiết!
                        </p>
                    </div>

                    <span className="absolute -top-1 left-1/2 right-1/2">
                        <span className="relative flex size-3">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                            <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
                        </span>
                    </span>
                </div>
                <ImageDataChapter
                    content={content}
                    bookId={chapter?.bookId}
                    indexServer={indexServer}
                    title={bookTitle}
                    isPrivate={chapter?.isPrivate}
                    servers={String(chapter?.servers)}
                    chapterNumber={chapter?.chapterNumber}
                />
            </div>

            {/* Navigation and Ads */}
            <NavChapter
                content={content}
                num={chapter.num}
                bookId={chapter?.bookId}
                slug={bookSlug}
                indexServer={indexServer}
                title={bookTitle}
                chapterNumber={chapter?.chapterNumber}
                handleServerChange={handleServerChange}
            />
        </>
    );
};

export default ContentChapter;
