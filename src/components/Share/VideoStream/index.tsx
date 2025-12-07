"use client";

import { useEffect, useRef, useState, useCallback } from "react";

import formatSeconds from "@/utils/formatSecondsToMSS";
import { VideoContentTypeEnum } from "@/constants/type";
import { IMediaType, IVideoLocaleType } from "@/store/video/video.types";

interface VideoStreamProps {
    videoId: number;
    drm?: string;
    content: string;
    domain: {
        name: string;
        region: string;
    } | null;
    thumbnail?: IMediaType;
    title?: IVideoLocaleType;
    type: VideoContentTypeEnum;
}

const JWPLAYER_SCRIPT_URL =
    "https://ssl.p.jwpcdn.com/player/v/8.22.0/jwplayer.js";

const VideoStream = ({
    videoId,
    drm,
    type,
    title,
    content,
    domain,
    thumbnail,
}: VideoStreamProps) => {
    const playerRef = useRef<HTMLDivElement>(null);
    const isReadyRef = useRef(false);
    const playerInstance = useRef<any>(null);
    const blobUrlRef = useRef<string | null>(null);
    const keydownHandlerRef = useRef<((event: KeyboardEvent) => void) | null>(
        null
    );

    const [resumeTime, setResumeTime] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [showResumeModal, setShowResumeModal] = useState(false);

    const localStorageKey = `video_position_${videoId}`;

    const cleanupPlayer = useCallback(() => {
        if (playerInstance.current) {
            console.log("Destroying JW Player instance...");
            try {
                playerInstance.current.remove();
            } catch (error) {
                console.warn("Error removing player:", error);
            }
            playerInstance.current = null;
            isReadyRef.current = false;
        }

        if (blobUrlRef.current) {
            console.log("Revoking blob URL:", blobUrlRef.current);
            URL.revokeObjectURL(blobUrlRef.current);
            blobUrlRef.current = null;
        }

        document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (!playerInstance.current) return;
        const currentPosition = playerInstance.current.getPosition();
        if (event.key === "ArrowRight") {
            playerInstance.current.seek(currentPosition + 10);
        } else if (event.key === "ArrowLeft") {
            playerInstance.current.seek(Math.max(currentPosition - 10, 0));
        }
    }, []);

    const createVideoSource = useCallback(() => {
        if (blobUrlRef.current) {
            URL.revokeObjectURL(blobUrlRef.current);
            blobUrlRef.current = null;
        }

        switch (type) {
            case VideoContentTypeEnum.MP4_URL:
            case VideoContentTypeEnum.HLS_URL:
                return content;
            case VideoContentTypeEnum.HLS_TEXT:
                let convertedContent = content;
                if (domain && domain.name) {
                    convertedContent = content
                        .split("\n")
                        .map((line) => {
                            if (!line || line.startsWith("#")) {
                                return line;
                            }
                            return `https://${domain.name}/${line}`;
                        })
                        .join("\n");
                }
                const blob = new Blob([convertedContent], {
                    type: "application/vnd.apple.mpegurl",
                });
                const newBlobUrl = URL.createObjectURL(blob);
                blobUrlRef.current = newBlobUrl;
                return newBlobUrl;
            default:
                console.error("Unsupported video content type.");
                return null;
        }
    }, [content, domain, type]);

    const initializePlayer = useCallback(async () => {
        if (isReadyRef.current || !playerRef.current) {
            return;
        }

        const jwplayer = (window as any).jwplayer;
        if (!jwplayer) {
            console.error(
                "JWPlayer not available. Script might not be loaded."
            );
            setIsLoading(false);
            return;
        }

        isReadyRef.current = true;
        setIsLoading(true);

        const videoFile = createVideoSource();
        if (!videoFile) {
            setIsLoading(false);
            return;
        }

        const videoType = type === VideoContentTypeEnum.MP4_URL ? "mp4" : "hls";
        const savedPosition = parseFloat(
            localStorage.getItem(localStorageKey) || "0"
        );
        const isContinue = savedPosition > 10 && savedPosition < 300;

        const player = jwplayer(playerRef.current);
        playerInstance.current = player;

        player.setup({
            type: videoType,
            file: videoFile,
            title: title,
            width: "100%",
            height: "100%",
            primary: "html5",
            autostart: false,
            image: thumbnail?.url,
            key: "ITWMv7t88JGzI0xPwW8I0+LveiXX9SWbfdmt0ArUSyc=",
        });

        player.on("ready", () => {
            console.log("Player ready");

            // Hide rewind button
            const displayControl = document.querySelector(
                ".jw-display"
            ) as HTMLElement;
            if (displayControl) displayControl.style.display = "flex";
            const displayControlRewind = document.querySelector(
                ".jw-display-icon-rewind"
            ) as HTMLElement;
            if (displayControlRewind) displayControlRewind.style.display = "none";
            const displayControlNext = document.querySelector(
                ".jw-display-icon-next"
            ) as HTMLElement;
            if (displayControlNext) displayControlNext.style.display = "none";

            const rewindButton = document.querySelector(
                ".jw-button-container > .jw-icon-rewind"
            ) as HTMLElement;
            if (rewindButton) rewindButton.style.display = "none";

            // Add keyboard controls (only once)
            if (!keydownHandlerRef.current) {
                const handleKeyDown = (event: KeyboardEvent) => {
                    const currentPosition = player.getPosition();
                    if (event.key === "ArrowRight") {
                        player.seek(currentPosition + 5);
                    } else if (event.key === "ArrowLeft") {
                        player.seek(Math.max(currentPosition - 5, 0));
                    }
                };
                keydownHandlerRef.current = handleKeyDown;
                document.addEventListener("keydown", handleKeyDown);
            }

            // Add custom buttons
            player.addButton(
                '<svg xmlns="http://www.w3.org/2000/svg" class="jw-svg-icon" viewBox="0 0 240 240" focusable="false"><path d="m 25.993957,57.778 v 125.3 c 0.03604,2.63589 2.164107,4.76396 4.8,4.8 h 62.7 v -19.3 h -48.2 v -96.4 H 160.99396 v 19.3 c 0,5.3 3.6,7.2 8,4.3 l 41.8,-27.9 c 2.93574,-1.480087 4.13843,-5.04363 2.7,-8 -0.57502,-1.174985 -1.52502,-2.124979 -2.7,-2.7 l -41.8,-27.9 c -4.4,-2.9 -8,-1 -8,4.3 v 19.3 H 30.893957 c -2.689569,0.03972 -4.860275,2.210431 -4.9,4.9 z m 163.422413,73.04577 c -3.72072,-6.30626 -10.38421,-10.29683 -17.7,-10.6 -7.31579,0.30317 -13.97928,4.29374 -17.7,10.6 -8.60009,14.23525 -8.60009,32.06475 0,46.3 3.72072,6.30626 10.38421,10.29683 17.7,10.6 7.31579,-0.30317 13.97928,-4.29374 17.7,-10.6 8.60009,-14.23525 8.60009,-32.06475 0,-46.3 z m -17.7,47.2 c -7.8,0 -14.4,-11 -14.4,-24.1 0,-13.1 6.6,-24.1 14.4,-24.1 7.8,0 14.4,11 14.4,24.1 0,13.1 -6.5,24.1 -14.4,24.1 z m -47.77056,9.72863 v -51 l -4.8,4.8 -6.8,-6.8 13,-12.99999 c 3.02543,-3.03598 8.21053,-0.88605 8.2,3.4 v 62.69999 z"></path></svg>',
                "Next 10s",
                function () {
                    player.seek(player.getPosition() + 10);
                },
                "next_10s"
            );

            player.addButton(
                '<svg xmlns="http://www.w3.org/2000/svg" class="jw-svg-icon" viewBox="0 0 240 240" focusable="false"><path d="M113.2,131.078a21.589,21.589,0,0,0-17.7-10.6,21.589,21.589,0,0,0-17.7,10.6,44.769,44.769,0,0,0,0,46.3,21.589,21.589,0,0,0,17.7,10.6,21.589,21.589,0,0,0,17.7-10.6,44.769,44.769,0,0,0,0-46.3Zm-17.7,47.2c-7.8,0-14.4-11-14.4-24.1s6.6-24.1,14.4-24.1,14.4,11,14.4,24.1S103.4,178.278,95.5,178.278Zm-43.4,9.7v-51l-4.8,4.8-6.8-6.8,13-13a4.8,4.8,0,0,1,8.2,3.4v62.7l-9.6-.1Zm162-130.2v125.3a4.867,4.867,0,0,1-4.8,4.8H146.6v-19.3h48.2v-96.4H79.1v19.3c0,5.3-3.6,7.2-8,4.3l-41.8-27.9a6.013,6.013,0,0,1-2.7-8,5.887,5.887,0,0,1,2.7-2.7l41.8-27.9c4.4-2.9,8-1,8,4.3v19.3H209.2A4.974,4.974,0,0,1,214.1,57.778Z"></path></svg>',
                "Back 10s",
                function () {
                    player.seek(Math.max(player.getPosition() - 10, 0));
                },
                "back_10s"
            );

            // ============================================================

            setIsLoading(false);
            document.addEventListener("keydown", handleKeyDown);

            // Show resume modal
            if (isContinue && !isNaN(savedPosition) && savedPosition > 10) {
                setResumeTime(savedPosition);
                setShowResumeModal(true);
            }
        });

        player.on("time", (event: any) => {
            if (event.position > 0) {
                localStorage.setItem(
                    localStorageKey,
                    event.position.toString()
                );
            }
        });

        player.on("error", (error: any) => {
            console.error("JW Player error:", error);
            setIsLoading(false);
        });

        player.on("complete", () => {
            localStorage.removeItem(localStorageKey);
        });
    }, [
        type,
        title,
        domain,
        videoId,
        content,
        thumbnail,
        handleKeyDown,
        localStorageKey,
        createVideoSource,
    ]);

    useEffect(() => {
        let scriptElement: HTMLScriptElement | null = document.querySelector(
            `script[src="${JWPLAYER_SCRIPT_URL}"]`
        );

        const loadScriptAndInitialize = () => {
            if (!scriptElement) {
                scriptElement = document.createElement("script");
                scriptElement.src = JWPLAYER_SCRIPT_URL;
                scriptElement.async = true;
                document.head.appendChild(scriptElement);

                scriptElement.onload = () => {
                    console.log("JWPlayer script loaded successfully.");
                    initializePlayer();
                };

                scriptElement.onerror = (error) => {
                    console.error("Failed to load JWPlayer script:", error);
                    setIsLoading(false);
                };
            } else {
                initializePlayer();
            }
        };

        loadScriptAndInitialize();

        // Cleanup effect
        return () => {
            console.log("Cleaning up on component unmount...");
            cleanupPlayer();

            // Nếu script được thêm bởi component này, thì hủy bỏ
            if (scriptElement && document.head.contains(scriptElement)) {
                console.log("Removing JWPlayer script...");
                document.head.removeChild(scriptElement);
            }
        };
    }, [initializePlayer, cleanupPlayer]);

    const handleResumeYes = () => {
        setShowResumeModal(false);
        const savedPosition = parseFloat(
            localStorage.getItem(localStorageKey) || "0"
        );
        if (playerInstance.current && savedPosition) {
            playerInstance.current.seek(savedPosition);
            playerInstance.current.play();
        }
    };

    const handleResumeNo = () => {
        setShowResumeModal(false);
        if (playerInstance.current) {
            localStorage.removeItem(localStorageKey);
            playerInstance.current.play();
        }
    };

    return (
        <div className="w-full h-full relative rounded-t-lg overflow-hidden">
            <div ref={playerRef} className="w-full h-full" />
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-opacity-70 text-white uppercase text-xl z-10">
                    ĐANG SUY NGHĨ
                </div>
            )}
            {showResumeModal && (
                <div className="fixed inset-0 bg-black/20 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="rounded-lg w-full bg-accent max-w-[550px] text-foreground border border-border resume-modal">
                        <div className="font-medium text-lg px-3 py-4 border-b border-border">
                            Bạn có muốn tiếp tục xem không?
                        </div>
                        <div className="text-base px-3 py-4 mb-2.5">
                            Bạn đã xem đến {formatSeconds(resumeTime)}.
                        </div>
                        <div className="flex justify-end gap-3 px-3 py-4">
                            <button
                                className="text-foreground cursor-pointer rounded-lg px-3 py-2 bg-muted hover:bg-muted/80"
                                onClick={handleResumeNo}
                            >
                                Xem từ đầu
                            </button>
                            <button
                                className="text-foreground cursor-pointer rounded-lg px-3 py-2 bg-error hover:bg-error/80"
                                onClick={handleResumeYes}
                            >
                                Tiếp tục
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <style jsx>{`
                .resume-modal {
                    animation: fadeInUp 0.3s ease;
                }
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default VideoStream;
