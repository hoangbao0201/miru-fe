"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useOnClickOutside } from "usehooks-ts";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Env } from "@/config/Env";
import convertTime from "@/utils/convertTime";
import IconComment from "@/components/Modules/Icons/IconComment";
import commentService, {
    GetNotificationsProps,
} from "@/services/comment.services";
import { useDispatch, useSelector } from "react-redux";
import {
    RootStateNotificationSlide,
    setNotifications,
    setReadNotification,
} from "@/store/notificationSlide";
import { ContentPageEnum } from "@/common/data.types";

const { NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO } = Env

interface NotificationProps {
    content: ContentPageEnum;
}
const Notification = ({ content = ContentPageEnum.comics }: NotificationProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const dropdownNotificationRef = useRef(null);
    const { data: session, status } = useSession();

    const dispatch = useDispatch();
    const notificationSlide = useSelector(
        (state: RootStateNotificationSlide) => state.notificationSlide
    );

    const [isNotification, setIsNotification] = useState(false);

    useOnClickOutside(dropdownNotificationRef, () => setIsNotification(false));

    const eventGetNotification = async () => {
        if (status !== "authenticated") {
            return;
        }
        try {
            const commentsRes = await commentService.findAllNotification({
                cache: "no-store",
                query: "?page=1&take=5",
                token: session?.backendTokens.accessToken,
            });

            if (commentsRes?.success) {
                dispatch(setNotifications(commentsRes?.comments));
            }
        } catch (error) {}
    };

    const handleChangePage = async (options: GetNotificationsProps) => {
        if (status !== "authenticated") {
            return;
        }
        const {
            commentId,
            parentId,
            isRead,
            bookId,
            book: { slug, category },
        } = options;
        try {
            router.push(`/${category || ""}/books/${slug}-${bookId}?readId=${parentId}#comment`);
            if (!isRead && notificationSlide?.notifications) {
                commentService.readComment({
                    token: session?.backendTokens.accessToken,
                    commentId,
                });
                dispatch(setReadNotification({ commentId: commentId }));
            }
        } catch (error) {}
    };

    useEffect(() => {
        if (status === "authenticated") {
            eventGetNotification();
        }
    }, [status]);

    useEffect(() => {
        setIsNotification(false);
    }, [pathname]);

    const countReadItems = notificationSlide?.notifications
        ? notificationSlide?.notifications.filter((obj) => obj.isRead === false)
              .length
        : 0;

    return (
        <>
            <div className="w-10 h-10" ref={dropdownNotificationRef}>
                <button
                    title="Thông báo"
                    onClick={() => setIsNotification((state) => !state)}
                    className="relative select-none transition-all duration-75 cursor-pointer active:scale-105 rounded-full outline-blue-600 outline-2 hover:outline-dashed"
                >
                    <IconComment
                        className="w-10 h-10 px-2 fill-foreground"
                        size={22}
                    />
                    {countReadItems !== 0 ? (
                        <div>
                            <span className="text-sm font-semibold leading-none bg-red-500 text-white py-[2px] min-w-[15px] text-center rounded-sm absolute bottom-0 right-0">
                                {countReadItems}
                            </span>
                        </div>
                    ) : (
                        <span></span>
                    )}
                </button>
                {status !== "loading" && isNotification && (
                    <div className="absolute top-[60px] right-0 sm:w-[500px] w-full mt-1 z-[15] px-1">
                        <div className="bg-accent shadow-md p-1 rounded-md">
                            <div className="font-semibold text-center my-2">
                                Thông báo
                            </div>
                            {status === "authenticated" ? (
                                <div className="max-h-[372px] overflow-y-auto custom-scroll space-y-1 px-1">
                                    {!notificationSlide?.isLoading && (
                                        notificationSlide?.notifications.length > 0 ? (
                                            notificationSlide?.notifications.map(
                                                (comment) => {
                                                    return (
                                                        <Link
                                                            href={"/"}
                                                            prefetch={false}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleChangePage(
                                                                    comment
                                                                );
                                                            }}
                                                            className={`relative flex px-2 py-2 rounded-md cursor-pointer  ${
                                                                comment?.isRead
                                                                    ? "bg-accent-10 hover:bg-accent-10-hover active:bg-accent-10-active"
                                                                    : "bg-red-50 hover:bg-red-100 active:bg-gray-200 dark:bg-gray-600 hover:dark:bg-gray-500"
                                                            }`}
                                                            key={`${comment?.commentId}`}
                                                        >
                                                            <div className="flex-shrink-0 mr-3">
                                                                <Image
                                                                    unoptimized
                                                                    loading="lazy"
                                                                    width={100}
                                                                    height={200}
                                                                    alt="Avatar"
                                                                    className="w-9 h-9 rounded-full overflow-hidden object-cover"
                                                                    src={
                                                                        comment
                                                                            .sender
                                                                            .avatarUrl
                                                                            ? NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO + "/" +
                                                                              comment
                                                                                  .sender
                                                                                  .avatarUrl
                                                                            : "/static/images/avatar_default.png"
                                                                    }
                                                                />
                                                            </div>
                                                            <div>
                                                                <div className="line-clamp-2">
                                                                    <strong>
                                                                        {
                                                                            comment
                                                                                ?.sender
                                                                                .name
                                                                        }
                                                                    </strong>{" "}
                                                                    đã trả lời bình
                                                                    luận của bạn
                                                                    trong truyện{" "}
                                                                    <strong>
                                                                        {
                                                                            comment
                                                                                ?.book
                                                                                .title
                                                                        }
                                                                        .
                                                                    </strong>
                                                                </div>
                                                                <div className="text-sm">
                                                                    {convertTime(
                                                                        comment?.createdAt
                                                                    )}
                                                                </div>
                                                            </div>
    
                                                            {!comment?.isRead && (
                                                                <span className="w-3 h-3 top-2 right-2 absolute rounded-full bg-blue-500"></span>
                                                            )}
                                                        </Link>
                                                    );
                                                }
                                            )
                                        ) : (
                                            <div className="relative text-center px-2 py-2">
                                                Chưa có thông báo nào!
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <div className="px-2 py-2 text-center">
                                    Bạn chưa đăng nhập!{" "}
                                    <Link
                                        prefetch={false}
                                        href={`/auth/login`}
                                        className="text-blue-500 hover:underline"
                                    >
                                        Đăng nhập ngay
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Notification;
