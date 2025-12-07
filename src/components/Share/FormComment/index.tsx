"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Fragment, useEffect, useRef, useState } from "react";

import ReactQuill from "react-quill";

import { ContentPageEnum } from "@/common/data.types";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { GetCommentsProps } from "@/services/comment.services";
import { TypeCommentEnum } from "@/store/comment/comment.reducer";
import CardComment from "@/components/Share/FormComment/CardComment";
import LoadingChangePage from "@/components/Share/Loading/LoadingChangePage";
import { NavButtonPagination } from "@/components/Share/NavButtonPagination";
import FormEditorComment from "@/components/Share/FormComment/FormEditorComment";
import {
    createCommentAction,
    createReplyCommentAction,
    getCommentsAction,
} from "@/store/comment/comment.action";
import { MetaPagination } from "@/constants/type";

interface IFormComment {
    bookId: number;
    num?: string | null;
    type: TypeCommentEnum;
    readId?: number | null;
    chapterNumber?: number | null;
}
const FormComment = ({
    num,
    type,
    bookId,
    readId,
    chapterNumber,
}: IFormComment) => {
    const params = useParams();
    const content =
        (params?.content as ContentPageEnum) || ContentPageEnum.comics;

    const { data: session, status } = useSession();

    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.authSlice);
    const commentSlide = useAppSelector((state) => state.commentSlide);

    const editorRef = useRef<ReactQuill>(null);
    const commentRef = useRef<HTMLDivElement>(null);
    const commentImageRef = useRef<HTMLDivElement>(null);

    const [isDisabledComment, setIsDisabledComment] = useState(false);
    const [editorState, setEditorState] = useState<string>("");

    // Event Send Comment
    const eventSendComment = async ({
        receiver,
        parentId,
        commentText,
    }: {
        receiver?: GetCommentsProps["receiver"];
        parentId?: number;
        commentText: string;
    }) => {
        if (!session || !user) {
            return;
        }
        let commentContent = JSON.stringify(commentText.trim());

        try {
            if (receiver) {
                await dispatch(
                    createReplyCommentAction({
                        data: {
                            bookId,
                            parentId,
                            commentText: commentContent,
                            chapterNumber: chapterNumber,
                            receiverId: receiver?.userId,
                            imageIndex:
                                commentSlide?.commentsImage?.image?.index,

                            sender: {
                                name: user?.name,
                                rank: user?.rank,
                                role: user?.role,
                                userId: user?.userId,
                                username: user?.username,
                                avatarUrl: user?.avatarUrl,

                                equippedItem: user?.equippedItem,
                                strengthMapping: user?.strengthMapping,
                            },
                            receiver: {
                                name: receiver?.name,
                                userId: receiver?.userId,
                                username: receiver?.username,
                            },
                        },
                        headers: {
                            cache: "no-cache",
                        },
                    })
                );
            } else {
                await dispatch(
                    createCommentAction({
                        data: {
                            bookId,
                            parentId,
                            commentText: commentContent,
                            chapterNumber: chapterNumber,
                            imageIndex:
                                commentSlide?.commentsImage?.image?.index,

                            sender: {
                                name: user?.name,
                                rank: user?.rank,
                                role: user?.role,
                                userId: user?.userId,
                                username: user?.username,
                                avatarUrl: user?.avatarUrl,

                                equippedItem: user?.equippedItem,
                                strengthMapping: user?.strengthMapping,
                            },
                            receiver: null,
                        },
                        headers: {
                            cache: "no-cache",
                        },
                    })
                );
            }
        } catch (error) {}
    };

    // Call Handle Send Comment
    const handleCallSendComment = async ({
        content,
        parentId,
        receiver,
    }: {
        content: string;
        parentId?: number;
        receiver: GetCommentsProps["receiver"];
    }) => {
        if (isDisabledComment) {
            alert(
                "Bạn bình luận quá nhanh. Vui lòng đợi 10 giây nữa để bình luận tiếp."
            );
            throw new Error();
        }
        const imgTags = content.match(/<img\s[^>]*src="[^"]*"[^>]*>/g);
        const imgCount = imgTags ? imgTags.length : 0;
        if (imgCount > 2) {
            alert("Chỉ được tối đa 2 icon");
            throw new Error();
        } else if (imgCount === 0) {
            const textLength = content.replace(/<[^>]*>/g, "").length;
            if (textLength < 3 || textLength > 1000) {
                alert("Nhập trên 3 và nhỏ hơn 1000 kí tự");
                throw new Error();
            }
        }

        setIsDisabledComment(true);
        setTimeout(() => {
            setIsDisabledComment(false);
        }, 10000);

        try {
            editorRef.current?.focus();
            setEditorState("");

            await eventSendComment({
                parentId,
                receiver,
                commentText: content.replace(/<p><br><\/p>/g, ""),
            });
        } catch (error) {}
    };

    const handleChangePage = async (page: number, isOnTop: boolean = true) => {
        try {
            await dispatch(
                getCommentsAction({
                    data: {
                        take: 8,
                        page: page,
                        order: "desc",
                        bookId: bookId,
                        otherId: readId,
                        category: content,
                        chapterNumber: chapterNumber,
                        imageIndex: type === TypeCommentEnum.IMAGE_CHAPTER ? commentSlide?.commentsImage.image?.index : null,
                    },
                    headers: {
                        cache: "no-cache",
                    },
                })
            );
            if (isOnTop) {
                if (
                    commentImageRef?.current &&
                    type === TypeCommentEnum.IMAGE_CHAPTER
                ) {
                    commentImageRef?.current.scrollIntoView({
                        behavior: "instant",
                        block: "start",
                    });
                } else if (commentRef?.current) {
                    commentRef?.current.scrollIntoView({
                        behavior: "instant",
                        block: "start",
                    });
                }
            }
        } catch (error) {}
    };

    useEffect(() => {
        handleChangePage(1, false);
    }, []);

    return (
        <div className="">
            <div ref={type === TypeCommentEnum.IMAGE_CHAPTER ? commentImageRef : commentRef}></div>

            {/* FORM EDITOR COMMENT */}
            {status !== "loading" &&
                (status === "authenticated" ? (
                    <Link
                        href={`/${content || ""}/secure/user-profile`}
                        prefetch={false}
                        className="mt-2 text-sm text-blue-600 underline"
                    >
                        Đổi tên ngay
                    </Link>
                ) : (
                    <>
                        Hãy{" "}
                        <Link
                            aria-label={`đăng nhập`}
                            className="font-semibold text-primary hover:underline"
                            href={`/auth/login`}
                        >
                            đăng nhập
                        </Link>{" "}
                        để bắt đầu bình luận
                    </>
                ))}
            <div className="mb-4 block">
                <FormEditorComment
                    isReply={false}
                    sender={user}
                    receiver={user}
                    editorRef={editorRef}
                    isEditorComment={false}
                    dataComment={editorState}
                    setDataComment={setEditorState}
                    handleSendComment={() =>
                        handleCallSendComment({
                            content: editorState,
                            receiver: null,
                        })
                    }
                />
            </div>
            {/* CONTENT COMMENTS */}
            <div
                className={`-mx-2 ${
                    readId ? "readItemChild" : ""
                }`}
            >
                {(type === TypeCommentEnum.IMAGE_CHAPTER
                    ? commentSlide.commentsImage.comments || []
                    : commentSlide.commentsBook.comments || []
                ).map((comment: any, index: number) => {
                    if (Object.keys(comment).length > 0) {
                        return (
                            <Fragment key={`${comment?.commentId}-${index}`}>
                                <CardComment
                                    type={type}
                                    user={user}
                                    bookId={bookId}
                                    comment={comment}
                                    content={content}
                                    handleSendComment={handleCallSendComment}
                                />
                            </Fragment>
                        );
                    } else {
                        <Fragment key={`${new Date().toISOString()}`}>
                            Rỗng
                        </Fragment>;
                    }
                })}
            </div>
            {/* PAGINATION */}
            <PaginationComments
                meta={
                    type === TypeCommentEnum.IMAGE_CHAPTER
                        ? commentSlide?.commentsImage?.meta
                        : commentSlide?.commentsBook?.meta
                }
                handleChangePage={handleChangePage}
            />
            {(type === TypeCommentEnum.IMAGE_CHAPTER
                ? commentSlide?.commentsImage?.meta && commentSlide?.commentsImage?.meta?.currentPage !== 1 && commentSlide?.commentsImage?.isLoading
                : commentSlide?.commentsBook?.meta && commentSlide?.commentsBook?.meta?.currentPage !== 1 && commentSlide?.commentsBook?.isLoading) && (
                <LoadingChangePage />
            )}
        </div>
    );
};

export default FormComment;

const PaginationComments = ({
    meta,
    handleChangePage,
}: {
    meta: MetaPagination | null;
    handleChangePage: (page: number, isOnTop?: boolean) => Promise<void>;
}) => {
    if (!meta) {
        return null;
    }
    return (
        <NavButtonPagination
            countPage={meta?.pageCount}
            currentPage={meta?.currentPage || 1}
            handleChangePage={handleChangePage}
        />
    );
};
