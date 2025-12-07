"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

import { Env } from "@/config/Env";
import convertTime from "@/utils/convertTime";
import { ContentPageEnum } from "@/common/data.types";
import { GetCommentsProps } from "@/services/comment.services";
import AvatarWithOutline from "../AvatarWithOutline";
import { getBookTitle, getBookSlug } from "@/utils/getBookTitle";

const { NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO } = Env;

const TextLevel = dynamic(() => import("@/components/Share/TextLevel"), {
    ssr: false,
    loading: () => (
        <div className="w-[110px] h-[20px] my-[2px] rounded-sm bg-muted animate-pulse"></div>
    ),
});

interface NewCommentProps {
    content: ContentPageEnum;
    comments: GetCommentsProps[];
}
const NewComment = async ({
    content = ContentPageEnum.comics,
    comments,
}: NewCommentProps) => {
    return (
        <>
            <ul className="space-y-3">
                {comments &&
                    comments?.map((comment, index) => {
                        const avatarUrl = comment?.sender.avatarUrl
                            ? NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO +
                              "/" +
                              comment?.sender.avatarUrl
                            : "/static/images/avatar_default.png";
                        const bookTitle = getBookTitle(comment.book);
                        const bookSlug = getBookSlug(comment.book) || comment.book?.slug;

                        return (
                            <li
                                key={comment?.commentId}
                                className="group"
                            >
                                <div className="py-3">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0">
                                            <Link
                                                prefetch={false}
                                                aria-label={`${comment?.sender.name}`}
                                                href={`/${content}/user/${comment?.sender.username}`}
                                            >
                                                <AvatarWithOutline
                                                    avatarUrl={avatarUrl}
                                                    outlineUrl={
                                                        comment?.sender
                                                            ?.equippedItem
                                                            ?.avatarOutline
                                                            ?.imageOriginalUrl || ""
                                                    }
                                                />
                                            </Link>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="mb-2 flex items-center justify-between gap-2">
                                                <TextLevel user={comment?.sender} />
                                                <time className="text-[11px] text-muted-foreground whitespace-nowrap">
                                                    {convertTime(comment.createdAt)}
                                                </time>
                                            </div>

                                            <Link
                                                prefetch={false}
                                                title={bookTitle}
                                                href={`/${content}/books/${bookSlug}-${comment.bookId}`}
                                                className="block mb-2"
                                            >
                                                <h4
                                                    className="font-semibold line-clamp-1 text-sm text-primary hover:underline"
                                                    title={bookTitle}
                                                >
                                                    {bookTitle}
                                                </h4>
                                            </Link>

                                            <div className="mb-2 overflow-hidden">
                                                <div
                                                    className="text-sm text-foreground/90 line-clamp-2"
                                                    dangerouslySetInnerHTML={{
                                                        __html: JSON.parse(
                                                            comment?.commentText
                                                        ),
                                                    }}
                                                ></div>
                                            </div>

                                            <div className="flex items-center flex-wrap gap-2">
                                                {comment?.chapter && (
                                                    <span className="inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-[11px] text-success">
                                                        Ch. {comment?.chapter.num}
                                                    </span>
                                                )}
                                                {comment?.imageIndex !== null &&
                                                    comment?.imageIndex !==
                                                        undefined && (
                                                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary">
                                                            Ảnh {comment?.imageIndex}
                                                        </span>
                                                    )}
                                                <Link
                                                    prefetch={false}
                                                    href={`/${content}/books/${
                                                        bookSlug
                                                    }-${comment?.bookId}${
                                                        comment?.chapterNumber
                                                            ? "/chapter-" +
                                                              comment?.chapter
                                                                  ?.num +
                                                              "-" +
                                                              comment?.chapterNumber
                                                            : ""
                                                    }#comment`}
                                                    className="text-xs text-primary hover:underline"
                                                >
                                                    Xem chi tiết →
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
            </ul>
        </>
    );
};

export default NewComment;
