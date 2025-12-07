"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState, Fragment, useEffect, useCallback, useMemo } from "react";

import { useSession } from "next-auth/react";
import { useDebounceValue } from "usehooks-ts";

import IconHouse from "../Icons/IconHouse";
import IconHeart from "../Icons/IconHeart";
import IconClose from "../Icons/IconClose";
import IconListUl from "../Icons/IconListUl";
import IconServer from "../Icons/IconServer";
import IconAngleDown from "../Icons/IconAngleDown";
import IconAnglesLeft from "../Icons/IconAnglesLeft";
import { ContentPageEnum } from "@/common/data.types";
import IconAnglesRight from "../Icons/IconAnglesRight";
import { GetChaptersAdvancedProps } from "@/services/chapter.services";
import {
    checkFollowBookService,
    followBookService,
} from "@/services/book.services";
import classNames from "@/utils/classNames";
import IconComment from "../Icons/IconComment";
import { Dialog, Transition } from "@headlessui/react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
    resetComments,
    TypeCommentEnum,
} from "@/store/comment/comment.reducer";
import FormComment from "@/components/Share/FormComment";
import { useGetListChapterAdvancedByBookIdQuery } from "@/store/chapter/chapter.public.api";

const BoxListChapter = dynamic(() => import("./BoxListChapter"), {
    ssr: false,
});

interface NavChapterProps {
    num: string;
    slug: string;
    title: string;
    bookId: number;
    indexServer: number;
    chapterNumber: number;
    content: ContentPageEnum;
    handleServerChange: () => void;
}

const NavChapter = ({
    num,
    title,
    slug,
    bookId,
    indexServer,
    chapterNumber,
    handleServerChange,
    content = ContentPageEnum.comics,
}: NavChapterProps) => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const dispatch = useAppDispatch();
    const { commentsImage } = useAppSelector((state) => state.commentSlide);

    // State management
    const [lastScrollY, setLastScrollY] = useState(0);
    const [showHeader, setShowHeader] = useState(true);
    const [isLoad, setIsLoad] = useState<boolean>(true);
    const [isFollow, setIsFollow] = useState<boolean>(false);
    const [isListChapter, setIsListChapter] = useState(false);
    const [isFormComment, setIsFormComment] = useState(false);

    const [debouncedIsFollow] = useDebounceValue(isFollow, 500);

    // Data fetching
    const { data: chapterData } = useGetListChapterAdvancedByBookIdQuery(
        { bookId, query: { order: "desc", take: 5000 } },
        { skip: !bookId }
    );

    const chapters: GetChaptersAdvancedProps[] = useMemo(
        () => chapterData?.data?.chapters || chapterData?.chapters || [],
        [chapterData]
    );

    // Computed values
    const { prevChapter, nextChapter } = useMemo(() => {
        if (!chapters.length) return { prevChapter: null, nextChapter: null };

        const currentIndex = chapters.findIndex(
            (ch) => ch.chapterNumber === chapterNumber
        );

        if (currentIndex === -1) return { prevChapter: null, nextChapter: null };

        return {
            prevChapter:
                chapters[currentIndex + 1] ||
                (chapterNumber > chapters[0]?.chapterNumber ? chapters[0] : null),
            nextChapter: chapters[currentIndex - 1] || null,
        };
    }, [chapters, chapterNumber]);

    const isAuthenticated = status === "authenticated";

    // Event handlers
    const handleCloseFormCommentsImage = useCallback(() => {
        setIsFormComment(false);
        dispatch(resetComments(TypeCommentEnum.IMAGE_CHAPTER));
    }, [dispatch]);

    const handleClickFollowBook = useCallback(() => {
        if (!isAuthenticated) {
            alert("Bạn chưa đăng nhập tài khoản!");
            return;
        }
        setIsFollow((prev) => !prev);
    }, [isAuthenticated]);

    const handleActionFollowBook = useCallback(async () => {
        if (!isAuthenticated || !session) return;

        try {
            await followBookService({
                bookId,
                token: session.backendTokens.accessToken,
                type: debouncedIsFollow ? "follow" : "unfollow",
            });
        } catch (error) {
            console.error("Follow action failed:", error);
        }
    }, [isAuthenticated, session, bookId, debouncedIsFollow]);

    const checkFollowBook = useCallback(async () => {
        if (!isAuthenticated || !session) {
            setIsFollow(false);
            setIsLoad(false);
            return;
        }

        try {
            const result = await checkFollowBookService({
                bookId,
                cache: "no-store",
                token: session.backendTokens.accessToken,
            });

            if (result?.success) {
                setIsFollow(!!result.isFollowed);
            }
        } catch (error) {
            console.error("Check follow failed:", error);
        } finally {
            setIsLoad(false);
        }
    }, [isAuthenticated, session, bookId]);

    const handleScroll = useCallback(() => {
        const currentScrollY = window.scrollY;
        const scrollDiff = Math.abs(lastScrollY - currentScrollY);

        if (scrollDiff > 100) {
            setLastScrollY(currentScrollY);
            setShowHeader(currentScrollY <= 5 || currentScrollY < lastScrollY);
        }
    }, [lastScrollY]);

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === "ArrowRight" && nextChapter) {
                router.push(
                    `/${content}/books/${slug}-${bookId}/chapter-${nextChapter.num}-${nextChapter.chapterNumber}`
                );
            } else if (event.key === "ArrowLeft" && prevChapter) {
                router.push(
                    `/${content}/books/${slug}-${bookId}/chapter-${prevChapter.num}-${prevChapter.chapterNumber}`
                );
            }
        },
        [router, slug, bookId, content, nextChapter, prevChapter]
    );

    // Effects
    useEffect(() => {
        if (status !== "loading") {
            checkFollowBook();
        }
    }, [status, checkFollowBook]);

    useEffect(() => {
        if (!isLoad) {
            handleActionFollowBook();
        }
    }, [debouncedIsFollow, isLoad, handleActionFollowBook]);

    useEffect(() => {
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [handleScroll]);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    // Render helpers
    const renderNavigationButtons = () => {
        if (commentsImage?.image) {
            return (
                <>
                    <button
                        onClick={handleCloseFormCommentsImage}
                        className="w-10 h-10 rounded-md bg-red-600 hover:bg-red-700 flex items-center justify-center text-white transition-colors"
                        aria-label="Đóng"
                    >
                        <IconClose className="w-5 h-5 fill-white" />
                    </button>
                    <button
                        onClick={() => setIsFormComment(true)}
                        className="flex-1 h-10 rounded-md bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2 text-white font-semibold text-base transition-colors"
                        aria-label="Bình luận"
                    >
                        <IconComment className="w-5 h-5 fill-white" />
                        <span>Bình luận</span>
                    </button>
                    <div className="w-10 h-10" aria-hidden="true" />
                </>
            );
        }

        return (
            <>
                <Link
                    prefetch={false}
                    href={`/${content}`}
                    title="Trang chủ"
                    className="w-10 h-10 bg-sky-600 hover:bg-sky-700 rounded-md transition-colors flex items-center justify-center"
                >
                    <IconHouse className="fill-white w-5 h-5" />
                </Link>

                <Link
                    href={`/${content}/books/${slug}-${bookId}`}
                    prefetch={false}
                    title={`Truyện ${title}`}
                    className="w-10 h-10 bg-sky-600 hover:bg-sky-700 rounded-md transition-colors flex items-center justify-center"
                >
                    <IconListUl className="fill-white w-5 h-5" />
                </Link>

                <button
                    onClick={() => setIsListChapter(true)}
                    className="flex-1 px-1 h-10 rounded-md bg-gray-400/60 hover:bg-gray-400/90 text-black flex items-center justify-center transition-colors cursor-pointer"
                    aria-label={`Chương ${num}`}
                >
                    <span className="text-sm whitespace-nowrap font-medium">
                        CHAP {num}
                    </span>
                    <IconAngleDown size={12} className="fill-gray-700 ml-1" />
                </button>

                <button
                    title="Đổi server"
                    onClick={handleServerChange}
                    className="hover:bg-gray-400/50 w-10 h-10 rounded-md flex items-center justify-center transition-colors"
                >
                    <IconServer size={17} className="fill-[#428bca] flex-shrink-0" />
                    <span className="text-[17px] w-3 text-center font-semibold text-[#428bca]">
                        {indexServer + 1}
                    </span>
                </button>

                <button
                    title={isFollow ? "Bỏ theo dõi" : "Theo dõi"}
                    onClick={handleClickFollowBook}
                    disabled={isLoad}
                    className="w-10 h-10"
                >
                    {isLoad ? (
                        <div className="w-10 h-10" />
                    ) : isFollow ? (
                        <div className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-md flex items-center justify-center transition-colors">
                            <IconClose size={20} className="fill-white" />
                        </div>
                    ) : (
                        <div className="w-10 h-10 bg-sky-600 hover:bg-sky-700 rounded-md flex items-center justify-center transition-colors">
                            <IconHeart size={20} className="fill-white" />
                        </div>
                    )}
                </button>

                <div className="w-10 h-10" aria-hidden="true" />
            </>
        );
    };

    const shouldShowHeader = showHeader || commentsImage?.image;

    return (
        <>
            <nav
                className={`${
                    shouldShowHeader ? "bottom-0" : "-bottom-[114px]"
                } max-w-[800px] mx-auto transition-all duration-300 bg-slate-800 select-none sticky z-[5] left-0 right-0`}
                aria-label="Chapter navigation"
            >
                <div className="overflow-hidden">
                    <div className="px-3 py-1 flex items-center space-x-1 bg-gray-300">
                        {renderNavigationButtons()}
                    </div>

                    <div className="w-full flex items-center">
                        {prevChapter ? (
                            <Link
                                title={`Chương ${prevChapter.num}`}
                                href={`chapter-${prevChapter.num}-${prevChapter.chapterNumber}`}
                                className="flex-1 h-12 flex items-center justify-center bg-slate-800 hover:bg-slate-900/50 transition-colors"
                            >
                                <IconAnglesLeft className="fill-white" />
                            </Link>
                        ) : (
                            <div className="flex-1 h-12 flex items-center justify-center opacity-20 bg-gray-600">
                                <IconAnglesLeft size={25} className="fill-white" />
                            </div>
                        )}

                        {nextChapter ? (
                            <Link
                                title={`Chương ${nextChapter.num}`}
                                href={`chapter-${nextChapter.num}-${nextChapter.chapterNumber}`}
                                className="flex-1 h-12 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700/70 transition-colors"
                            >
                                <span className="text-white text-lg uppercase font-semibold">
                                    NEXT
                                </span>
                                <IconAnglesRight size={20} className="fill-white" />
                            </Link>
                        ) : (
                            <div className="flex-1 h-12 flex items-center justify-center space-x-2 opacity-30 bg-blue-600">
                                <span className="text-white text-lg uppercase font-semibold">
                                    NEXT
                                </span>
                                <IconAnglesRight size={20} className="fill-white" />
                            </div>
                        )}
                    </div>
                </div>

                {isListChapter && chapters.length > 0 && (
                    <BoxListChapter
                        slug={slug}
                        bookId={bookId}
                        content={content}
                        chapters={chapters}
                        isShow={isListChapter}
                        setIsShow={setIsListChapter}
                        chapterCurrent={{ num, chapterNumber }}
                    />
                )}

                {isFormComment && (
                    <Transition appear show={isFormComment} as={Fragment}>
                        <Dialog
                            as="div"
                            className="relative z-40"
                            onClose={handleCloseFormCommentsImage}
                        >
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
                            </Transition.Child>

                            <div className="fixed inset-0 overflow-y-auto flex flex-col items-center justify-center md:pt-5 md:pb-10 py-5 px-4">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95 translate-y-4"
                                    enterTo="opacity-100 scale-100 translate-y-0"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100 translate-y-0"
                                    leaveTo="opacity-0 scale-95 translate-y-4"
                                >
                                    <Dialog.Panel className="relative max-w-[800px] w-full mx-auto transform transition-all">
                                        <div className="rounded-xl overflow-hidden bg-background border border-border shadow-2xl">
                                            {/* Header with image */}
                                            <div className="bg-accent-10 px-6 py-5 border-b border-border">
                                                <div className="flex items-center justify-center mb-4">
                                                    <div className="relative w-32 h-40 rounded-lg overflow-hidden shadow-lg border-2 border-border">
                                                        <Image
                                                            unoptimized
                                                            width={800}
                                                            height={800}
                                                            loading="lazy"
                                                            alt={title}
                                                            src={commentsImage?.image?.coverUrl || ""}
                                                            className="w-full h-full object-cover select-none pointer-events-none"
                                                        />
                                                    </div>
                                                </div>
                                                <h3 className="text-lg font-semibold text-foreground text-center">
                                                    Bình luận
                                                </h3>
                                            </div>

                                            {/* Content */}
                                            <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                                                <div className="p-6">
                                                    <FormComment
                                                        bookId={bookId}
                                                        chapterNumber={chapterNumber}
                                                        type={TypeCommentEnum.IMAGE_CHAPTER}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Close button */}
                                        <button
                                            onClick={handleCloseFormCommentsImage}
                                            className="w-12 h-12 mx-auto mt-4 flex items-center justify-center group"
                                            aria-label="Đóng"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-background border-2 border-border hover:border-foreground/30 hover:bg-accent-10 flex items-center justify-center">
                                                <IconClose className="w-6 h-6 fill-foreground/70 group-hover:fill-foreground transition-colors" />
                                            </div>
                                        </button>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </Dialog>
                    </Transition>
                )}
            </nav>
        </>
    );
};

export default NavChapter;