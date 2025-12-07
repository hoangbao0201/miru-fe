"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

import { Env } from "@/config/Env";
import TextLevel from "../../TextLevel";
import ButtonAction from "./ButtonAction";
import convertTime from "@/utils/convertTime";
import AvatarWithOutline from "../../AvatarWithOutline";
import { GetCommentsProps } from "@/services/comment.services";
import { TypeCommentEnum } from "@/store/comment/comment.reducer";

interface ItemCommentProps {
    comment: GetCommentsProps;
    isLast: boolean;
    isReply?: boolean;
    isSended?: boolean;
    childIndex?: number;
    isShowMore?: boolean;
    continueShow?: number;
    type: TypeCommentEnum;
    dataReceiver: GetCommentsProps["receiver"];
    setReceiver: Dispatch<SetStateAction<GetCommentsProps["receiver"]>>;
}

const ItemComment = ({
    type,
    comment,
    isLast,
    isReply,
    isSended,
    setReceiver,
    dataReceiver,
    continueShow,
}: ItemCommentProps) => {
    const { NEXT_PUBLIC_TITLE_SEO, NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO } = Env;

    const params = useParams();
    const { content } = params;

    const addMentionTag = (htmlContent: string, user?: string): string => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, "text/html");

        if (user) {
            const firstP = doc.querySelector("p");
            if (firstP) {
                const mentionSpan = doc.createElement("span");
                mentionSpan.textContent = `@${user} `;
                mentionSpan.style.color = "#007bff";

                firstP.insertBefore(mentionSpan, firstP.firstChild);
            }
        }

        return doc.body.innerHTML;
    };

    return (
        <div className="relative">
            <div className={`flex relative`}>
                <div className="flex-shrink-0">
                    <Link
                        prefetch={false}
                        aria-label={`${comment?.sender.userId}`}
                        href={`/${content}/user/${comment?.sender?.username}`}
                    >
                        <AvatarWithOutline
                            avatarUrl={`${
                                comment?.sender
                                    ? comment?.sender.avatarUrl
                                        ? NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO +
                                            "/" +
                                            comment?.sender.avatarUrl
                                        : "/static/images/avatar_default.png"
                                    : "/static/images/avatar_default.png"
                            }`}
                            outlineUrl={
                                comment?.sender?.equippedItem.avatarOutline
                                    ?.imageOriginalUrl || ""
                            }
                            size={!isReply ? 32 : 28}
                        />
                    </Link>
                    {(!!continueShow ||
                        (!isLast && isReply) ||
                        !!dataReceiver) && (
                        <div className="w-[2px] bg-accent-20 mx-auto h-[calc(100%-36px)]"></div>
                    )}
                </div>
                <div className="ml-2 pb-1 flex-1">
                    <div className="flex items-center w-full">
                        <div className="pb-[8px] px-[12px] mb-1 min-h-[50px]">
                            <div className="mb-2">
                                <TextLevel user={comment?.sender} />
                            </div>
                            <div className="overflow-hidden">
                                <div
                                    className="relative text-[16px]"
                                    dangerouslySetInnerHTML={{
                                        __html: addMentionTag(
                                            JSON.parse(comment?.commentText),
                                            comment?.receiver?.name
                                        ),
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    <div className="px-[12px] pb-1">
                        <div className="flex items-center whitespace-nowrap gap-2 mb-1">
                            {isSended ? (
                                <div className="py-1 text-[12px] leading-[12px]">
                                    Đang viết...
                                </div>
                            ) : (
                                <>
                                    {comment?.chapter && (
                                        <span className="px-2 py-1 text-[12px] leading-[12px] text-success bg-success/20 border-success italic">
                                            Ch. {comment?.chapter.num}
                                        </span>
                                    )}
                                    {comment?.imageIndex !== null &&
                                        comment?.imageIndex !== undefined && (
                                            <button
                                                onClick={() =>
                                                    document
                                                        .getElementById(
                                                            `chap-img-${comment?.imageIndex}`
                                                        )
                                                        ?.scrollIntoView({
                                                            behavior: "smooth",
                                                        })
                                                }
                                                className="px-2 py-1 text-[12px] leading-[12px] text-primary bg-primary/20 hover:bg-primary/50 border-primary italic"
                                            >
                                                Ảnh {comment?.imageIndex}
                                            </button>
                                        )}
                                    <span className="text-xs">
                                        {convertTime(comment?.createdAt)}
                                    </span>

                                    <ButtonAction
                                        type={type}
                                        parentId={comment?.parentId}
                                        commentId={comment?.commentId}
                                        senderId={comment?.sender.userId}
                                    />
                                </>
                            )}
                        </div>
                        <button
                            onClick={() =>
                                setReceiver((state) =>
                                    state
                                        ? null
                                        : {
                                              userId: comment?.sender.userId,
                                              name: comment?.sender.name,
                                              username:
                                                  comment?.sender.username,
                                          }
                                )
                            }
                            className="text-xs text-center bg-accent-20 py-2 w-[106px] text-[12px] leading-[12px] hover:underline cursor-pointer"
                        >
                            Phản hồi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemComment;
