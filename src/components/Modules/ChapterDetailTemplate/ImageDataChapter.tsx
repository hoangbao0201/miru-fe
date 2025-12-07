import Image from "next/image";
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    useRef,
    SetStateAction,
    Dispatch,
} from "react";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

import { Env } from "@/config/Env";
import PrivateImage from "./PrivateImage";
import historyService from "@/services/history.services";
import {
    GetChapterDetailProps,
    ImageProtectedType,
} from "@/services/chapter.services";
import classNames from "@/utils/classNames";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { ContentPageEnum } from "@/common/data.types";
import { decryptAESData } from "@/utils/dataEncryptionUtil";
import { increaseViewBookService } from "@/services/book.services";
import { setImageIndex } from "@/store/comment/comment.reducer";

const { NODE_ENV, NEXT_PUBLIC_SECRET_DATA_CHAPTER } = Env;

// Cache để tránh decrypt lại cùng một dữ liệu
const serversDataCache = new Map<string, GetChapterDetailProps["servers"]>();

const ImageDataChapter = ({
    title,
    bookId,
    content,
    servers,
    isPrivate,
    indexServer,
    chapterNumber,
}: {
    title: string;
    bookId: number;
    servers: string;
    isPrivate: boolean;
    indexServer: number;
    chapterNumber: number;
    content: ContentPageEnum;
}) => {
    const { data: session, status } = useSession();

    const dispatch = useAppDispatch();
    const commentSlide = useAppSelector((state) => state.commentSlide);

    const pathname = usePathname();
    const mountedRef = useRef(true);
    const eventListenersAddedRef = useRef(false);
    const viewIncreaseTimerRef = useRef<NodeJS.Timeout | null>(null);

    const [serversData, setServersData] = useState<
        GetChapterDetailProps["servers"] | null
    >(null);

    // Memoize cache key
    const cacheKey = useMemo(
        () => `${bookId}-${chapterNumber}-${servers}`,
        [bookId, chapterNumber, servers]
    );

    const loadServersData = useCallback(async () => {
        if (!mountedRef.current) return;

        try {
            // Kiểm tra cache trước
            if (serversDataCache.has(cacheKey)) {
                const cachedData = serversDataCache.get(cacheKey);
                if (mountedRef.current) {
                    setServersData(cachedData || null);
                }
                return;
            }

            const dataServersRes = await decryptAESData({
                content: String(servers),
                secretKey: NEXT_PUBLIC_SECRET_DATA_CHAPTER,
            });

            if (!dataServersRes || !mountedRef.current) {
                return;
            }

            const parsedData = JSON.parse(dataServersRes || "[]");

            // Cache dữ liệu
            serversDataCache.set(cacheKey, parsedData);

            // Giới hạn cache size để tránh memory leak
            if (serversDataCache.size > 50) {
                const keysToDelete = Array.from(serversDataCache.keys()).slice(
                    0,
                    10
                );
                keysToDelete.forEach((key) => serversDataCache.delete(key));
            }

            if (mountedRef.current) {
                setServersData(parsedData);
            }
        } catch (error) {
            console.error("Failed to decrypt servers data:", error);
            if (mountedRef.current) {
                setServersData(null);
            }
        }
    }, [servers, cacheKey]);

    const saveChapterHistory = useCallback(async () => {
        if (status !== "authenticated" || !session?.backendTokens.accessToken)
            return;

        try {
            const chapterRead = sessionStorage.getItem("chapterRead") || "";
            const chapterReadData = `${bookId}|${chapterNumber}`;

            if (chapterRead !== chapterReadData) {
                sessionStorage.setItem("chapterRead", chapterReadData);

                // Non-blocking history save
                historyService
                    .saveChapterView({
                        bookId,
                        chapterNumber,
                        token: session.backendTokens.accessToken,
                    })
                    .catch((error) => {
                        console.warn("Failed to save chapter history:", error);
                    });
            }
        } catch (error) {
            console.warn("Error in saveChapterHistory:", error);
        }
    }, [status, session, bookId, chapterNumber]);

    const increaseView = useCallback(async () => {
        if (!mountedRef.current) return;

        try {
            await increaseViewBookService({
                bookId: bookId,
                chapterNumber: chapterNumber,
                token:
                    status === "authenticated"
                        ? session?.backendTokens.accessToken
                        : undefined,
            });
        } catch (error) {
            console.warn("Failed to increase view:", error);
        }
    }, [bookId, chapterNumber, status, session]);

    const setupEventListeners = useCallback(() => {
        if (NODE_ENV !== "production" || eventListenersAddedRef.current) return;

        const handleContextMenu = (e: Event) => {
            e.preventDefault();
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                (event.ctrlKey || event.metaKey) &&
                event.shiftKey &&
                event.key === "I"
            ) {
                event.preventDefault();
            }
        };

        document.addEventListener("keydown", handleKeyDown, { passive: false });
        document.addEventListener("contextmenu", handleContextMenu, {
            passive: false,
        });
        eventListenersAddedRef.current = true;

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("contextmenu", handleContextMenu);
            eventListenersAddedRef.current = false;
        };
    }, []);

    const cleanupTimersAndListeners = useCallback(() => {
        if (viewIncreaseTimerRef.current) {
            clearTimeout(viewIncreaseTimerRef.current);
            viewIncreaseTimerRef.current = null;
        }

        if (eventListenersAddedRef.current) {
            const handleContextMenu = (e: Event) => e.preventDefault();
            const handleKeyDown = (event: KeyboardEvent) => {
                if (
                    (event.ctrlKey || event.metaKey) &&
                    event.shiftKey &&
                    event.key === "I"
                ) {
                    event.preventDefault();
                }
            };

            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("contextmenu", handleContextMenu);
            eventListenersAddedRef.current = false;
        }
    }, []);

    // Load servers data
    useEffect(() => {
        loadServersData();
    }, [loadServersData]);

    // Save chapter history
    useEffect(() => {
        saveChapterHistory();
    }, [saveChapterHistory]);

    // Setup production features
    useEffect(() => {
        if (NODE_ENV !== "production") return;

        // Setup event listeners
        const cleanup = setupEventListeners();

        // Setup view increase timer
        viewIncreaseTimerRef.current = setTimeout(() => {
            if (mountedRef.current) {
                increaseView();
            }
        }, 15000);

        return () => {
            cleanupTimersAndListeners();
            if (cleanup) cleanup();
        };
    }, [setupEventListeners, increaseView, cleanupTimersAndListeners]);

    // Cleanup on unmount
    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;
            cleanupTimersAndListeners();
        };
    }, [cleanupTimersAndListeners]);

    const renderImageContent = useCallback(
        (dataImageProtected: ImageProtectedType, index: number) => {
            const isSecureImage = dataImageProtected?.drm_data;

            return (
                <div
                    key={`${bookId}-${chapterNumber}-${index}`}
                    className={classNames("relative select-none")}
                    id={`chap-img-${index + 1}`}
                    onDoubleClick={() => {
                        dispatch(
                            setImageIndex({
                                index: index + 1,
                                coverUrl: dataImageProtected?.imageUrl,
                            })
                        );
                    }}
                >
                    {isSecureImage ? (
                        <PrivateImage
                            userId={session?.user?.userId || -1}
                            image={{
                                width: dataImageProtected?.width,
                                height: dataImageProtected?.height,
                                imageUrl: dataImageProtected?.imageUrl,
                                drm_data:
                                    dataImageProtected?.drm_data as string,
                            }}
                            content={content}
                        />
                    ) : (
                        <>
                            <div
                                style={{
                                    background:
                                        "URL('/static/images/chapter_load.gif') top center no-repeat",
                                }}
                            >
                                <Image
                                    unoptimized
                                    width={800}
                                    height={800}
                                    loading="lazy"
                                    alt={`${title} - Page ${index + 1}`}
                                    className="mx-auto select-none pointer-events-none"
                                    src={`${dataImageProtected?.imageUrl}`}
                                    onError={(e) => {
                                        console.warn(
                                            `Failed to load image: ${dataImageProtected?.imageUrl}`
                                        );
                                        e.currentTarget.style.display = "none";
                                    }}
                                />
                            </div>
                        </>
                    )}
                </div>
            );
        },
        [title, bookId, chapterNumber, content, session?.user?.userId]
    );

    const renderContent = useMemo(() => {
        if (!serversData) {
            return (
                <div className="w-[80px] h-[80px] mx-auto">
                    <div className="loading-chapter"></div>
                </div>
            );
        }

        const serverContent = serversData[indexServer]?.content;
        if (!serverContent?.length) return null;

        return (
            <>
                {serverContent.map((item, index) =>
                    renderImageContent(item, index)
                )}
            </>
        );
    }, [serversData, indexServer, renderImageContent, title, pathname]);

    return renderContent;
};

export default ImageDataChapter;
