"use client";

import {
    useRef,
    Fragment,
    useState,
} from "react";

import ReactQuill from "react-quill";

import ItemComment from "./ItemComment";
import FormEditorComment from "../FormEditorComment";
import { ContentPageEnum } from "@/common/data.types";
import { IGetUserMe } from "@/services/user.services";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { GetCommentsProps } from "@/services/comment.services";
import { TypeCommentEnum } from "@/store/comment/comment.reducer";
import { getReplyCommentsAction } from "@/store/comment/comment.action";
import IconArrowTurnUp from "@/components/Modules/Icons/IconArrowTurnUp";
import IconLoadingSpin from "@/components/Modules/Icons/IconLoadingSpin";

interface CardCommentProps {
    bookId: number;
    user?: IGetUserMe;
    type: TypeCommentEnum;
    content: ContentPageEnum;
    comment: GetCommentsProps & { replyComments: GetCommentsProps[] };
    handleSendComment: ({
        receiver,
        parentId,
        content,
    }: {
        receiver: GetCommentsProps["receiver"];
        parentId?: number;
        content: string;
    }) => Promise<void>;
}
const CardComment = ({
    user,
    type,
    bookId,
    comment,
    content,
    handleSendComment,
}: CardCommentProps) => {
    const dispatch = useAppDispatch();
    const commentSlide = useAppSelector((state) => state.commentSlide);

    const editorRef = useRef<ReactQuill>(null);

    const [isloading, setIsLoading] = useState<string>("");
    const [editorState, setEditorState] = useState<string>("");
    const [dataReceiver, setDataReceiver] =
        useState<GetCommentsProps["receiver"]>(null);

    // Handle Get Reply Comments
    const handleGetReplyComments = async () => {
        try {
            const nextPage =
                Math.ceil((comment?.replyComments?.length || 0) / 10) + 1;

            setIsLoading(`replycomment_${comment?.commentId}`);
            await dispatch(
                getReplyCommentsAction({
                    data: {
                        take: 8,
                        order: "desc",
                        page: nextPage,
                        category: content,
                        parentId: comment?.commentId,
                        imageIndex: type === TypeCommentEnum.IMAGE_CHAPTER ? commentSlide?.commentsImage.image?.index : null,
                    },
                    headers: {
                        cache: "no-cache",
                    },
                })
            );

            // dispatch(setTypeLoading(""));
        } catch (error) {
            // dispatch(setTypeLoading(""));
        } finally {
            setIsLoading("");
        }
    };

    // Call Handle Get Reply Comments
    const handleCallSendComment = async () => {
        if (!dataReceiver) {
            return;
        }
        try {
            await handleSendComment({
                content: editorState,
                parentId: comment?.commentId,
                receiver: {
                    name: dataReceiver?.name,
                    userId: dataReceiver?.userId,
                    username: dataReceiver?.username,
                },
            });

            setEditorState("");
            editorRef.current?.focus();
        } catch (error) {
            editorRef.current?.focus();
        }
    };

    const continueShow =
        comment?._count.replyComments - (comment?.replyComments?.length || 0);

    return (
        <div className="relative item-comment px-2 py-2">
            <ItemComment
                type={type}
                isLast={false}
                comment={comment}
                continueShow={continueShow}
                dataReceiver={dataReceiver}
                setReceiver={setDataReceiver}
                isSended={comment?.commentId === -1}
                isReply={!!comment?._count.replyComments}
            />

            <div>
                {comment?.replyComments && (
                    <>
                        {comment?.replyComments.map(
                            (replyComment: GetCommentsProps, index: number) => {
                                return (
                                    <Fragment key={replyComment.commentId}>
                                        <ItemComment
                                            type={type}
                                            isReply={true}
                                            comment={replyComment}
                                            dataReceiver={dataReceiver}
                                            setReceiver={setDataReceiver}
                                            isShowMore={
                                                comment._count.replyComments -
                                                    (comment?.replyComments
                                                        ?.length || 0) >
                                                    0 || !!dataReceiver?.userId
                                            }
                                            isLast={
                                                comment?.replyComments
                                                    ?.length ===
                                                index + 1
                                            }
                                            isSended={
                                                replyComment?.commentId === -1
                                            }
                                            continueShow={continueShow}
                                        />
                                    </Fragment>
                                );
                            }
                        )}
                    </>
                )}
            </div>

            <div>
                {(comment?.replyComments
                    ? comment._count.replyComments >
                      comment?.replyComments.length
                    : comment?._count.replyComments > 0) && (
                    <div className="pl-[10px] text-sm relative">
                        <div
                            className={`cursor-pointer whitespace-nowrap flex items-center select-none hover:underline py-[5px]
                            `}
                            onClick={handleGetReplyComments}
                        >
                            <IconArrowTurnUp
                                size={17}
                                className="fill-gray-800 dark:fill-gray-200 rotate-90 mx-2"
                            />
                            <span className="mr-2">
                                Xem tất cả {continueShow} phản hồi
                            </span>

                            {isloading ===
                                `replycomment_${comment?.commentId}` && (
                                <IconLoadingSpin size={13} />
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="relative">
                {dataReceiver?.userId && (
                    <>
                        <FormEditorComment
                            sender={user}
                            isReply={true}
                            editorRef={editorRef}
                            isEditorComment={false}
                            receiver={comment.sender}
                            dataComment={editorState}
                            setDataComment={setEditorState}
                            handleSendComment={handleCallSendComment}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default CardComment;
