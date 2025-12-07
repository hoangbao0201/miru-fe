import { GetCommentsProps } from "@/services/comment.services";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
    createCommentAction,
    createReplyCommentAction,
    deleteCommentAction,
    getCommentsAction,
    getReplyCommentsAction,
} from "./comment.action";
import { IGetCommentsParamsType, IGetCommentsResType } from "./comment.api";
import { MetaPagination } from "@/constants/type";

export enum TypeCommentEnum {
    "BOOK" = "BOOK",
    "CHAPTER" = "CHAPTER",
    "IMAGE_CHAPTER" = "IMAGE_CHAPTER",
}

export interface RootStateCommentSlide {
    commentSlide: CommentSlideProps;
}

interface CommentsProps extends GetCommentsProps {
    replyComments?: GetCommentsProps[];
}
export interface CommentSlideProps {
    commentsBook: {
        isLoading: boolean;
        comments: CommentsProps[];
        meta: MetaPagination | null;
    };
    commentsImage: {
        isLoading: boolean;
        image: {
            index: number;
            coverUrl: string; 
        } | null;
        comments: CommentsProps[];
        meta: MetaPagination | null;
    };
}
const initialState: CommentSlideProps = {
    commentsBook: {
        comments: [],
        isLoading: true,
        meta: null,
    },
    commentsImage: {
        comments: [],
        isLoading: true,
        image: null,
        meta: null,
    },
};
export const commentSlide = createSlice({
    name: "comment",
    initialState,
    reducers: {
        // COMMENTS
        setImageIndex: (state, action: PayloadAction<{ index: number; coverUrl: string; } | null>) => {
            state.commentsImage.image =
                state.commentsImage.image?.index === action.payload?.index
                    ? null
                    : action.payload;
        },
        resetComments: (state, action: PayloadAction<TypeCommentEnum>) => {
            if(action?.payload === TypeCommentEnum.IMAGE_CHAPTER) {
                state.commentsImage = initialState.commentsImage;
            }
            else {
                state.commentsBook = initialState.commentsBook;
            }
        },
    },
    extraReducers: (builder) => {
        // getCommentsAction

        builder
            .addCase(
                getCommentsAction.pending,
                (state: CommentSlideProps, action) => {
                    const imageIndex = action?.meta?.arg?.data?.imageIndex;
                    if (imageIndex) {
                        state.commentsImage.isLoading = true;
                    } else {
                        state.commentsBook.isLoading = true;
                    }
                }
            )
            .addCase(getCommentsAction.fulfilled, (state, action) => {
                const { imageIndex } = action.meta.arg.data;
                const comments = action.payload.data;
                const meta = action.payload.meta;

                if (imageIndex) {
                    state.commentsImage = {
                        ...state.commentsImage,
                        comments,
                        meta,
                        isLoading: false,
                    };
                } else {
                    state.commentsBook = {
                        ...state.commentsBook,
                        comments,
                        meta,
                        isLoading: false,
                    };
                }
            })
            .addCase(
                getCommentsAction.rejected,
                (state: CommentSlideProps, action: any) => {
                    const imageIndex = action?.meta?.arg?.data?.imageIndex;
                    if (imageIndex) {
                        state.commentsImage = {
                            ...state.commentsImage,
                            comments: [],
                            meta: null,
                            isLoading: false,
                        };
                    } else {
                        state.commentsBook = {
                            ...state.commentsBook,
                            comments: [],
                            meta: null,
                            isLoading: false,
                        };
                    }
                }
            );

        // getReplyCommentsAction

        builder
            .addCase(
                getReplyCommentsAction.pending,
                (state: CommentSlideProps, action) => {
                }
            )
            .addCase(getReplyCommentsAction.fulfilled, (state, action) => {
                const { imageIndex, parentId } = action.meta.arg.data;
                const comments = action.payload.data;
                const meta = action.payload.meta;

                const target =
                    imageIndex
                        ? state.commentsImage
                        : state.commentsBook;

                const foundIndex = target.comments.findIndex(
                    (comment: any) => comment.commentId === parentId
                );
                if (foundIndex !== -1) {
                    const foundComment = target.comments[foundIndex];
                    if (foundComment) {
                        foundComment.replyComments =
                            foundComment?.replyComments || [];

                        // Add Comment
                        foundComment.replyComments.push(
                            ...comments
                        );

                        // Increase Count Reply Comment
                        // foundComment._count.replyComments++;
                    }
                }
            })
            .addCase(
                getReplyCommentsAction.rejected,
                (state: CommentSlideProps, action: any) => {
                    const imageIndex = action?.meta?.arg?.data?.imageIndex;
                    if (imageIndex) {
                        state.commentsImage = {
                            ...state.commentsImage,
                            comments: [],
                            meta: null,
                            isLoading: false,
                        };
                    } else {
                        state.commentsBook = {
                            ...state.commentsBook,
                            comments: [],
                            meta: null,
                            isLoading: false,
                        };
                    }
                }
            );

        // createCommentAction

        builder
            .addCase(
                createCommentAction.pending,
                (state: CommentSlideProps, action) => {
                    const {
                        bookId,
                        commentText,
                        sender,
                        receiver,
                        imageIndex,
                        chapterNumber,
                    } = action?.meta?.arg?.data;
                    const comment = {
                        commentText,
                        bookId: bookId,
                        imageIndex,
                        chapterNumber,
                        commentId: -1,
                        chapter: null,
                        parentId: null,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        book: {
                            slug: "",
                            title: "",
                        },
                        sender,
                        receiver,
                        _count: {
                            replyComments: 0,
                        },
                    };
                    if (imageIndex) {
                        state.commentsImage.comments.unshift(comment);
                    } else {
                        state.commentsBook.comments.unshift(comment);
                    }
                }
            )
            .addCase(createCommentAction.fulfilled, (state, action) => {
                const { commentId } = action.payload;
                const { imageIndex } = action?.meta?.arg?.data;

                const targetList = imageIndex
                    ? state.commentsImage.comments
                    : state.commentsBook.comments;

                const tempComment = targetList.find((c) => c.commentId === -1);
                if (tempComment) {
                    tempComment.commentId = commentId;
                }
            })
            .addCase(
                createCommentAction.rejected,
                (state: CommentSlideProps, action) => {
                }
            );

        // createReplyCommentAction

        builder
            .addCase(
                createReplyCommentAction.pending,
                (state: CommentSlideProps, action) => {
                    const {
                        bookId,
                        sender,
                        parentId,
                        receiver,
                        imageIndex,
                        commentText,
                        chapterNumber,
                    } = action?.meta?.arg?.data;
                    const comment = {
                        bookId: bookId,
                        chapterNumber,
                        commentId: -1,
                        commentText,
                        parentId,
                        imageIndex,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        book: {
                            slug: "",
                            title: "",
                        },
                        sender,
                        receiver,

                        chapter: null,
                        _count: {
                            replyComments: 0,
                        },
                    };

                    const target = imageIndex
                        ? state.commentsImage.comments
                        : state.commentsBook.comments;

                    const foundIndex = target.findIndex(
                        (comment) => comment.commentId === parentId
                    );
                    if (foundIndex !== -1) {
                        const foundComment = target[foundIndex];
                        if (foundComment) {
                            foundComment.replyComments =
                                foundComment?.replyComments || [];

                            // Add Comment
                            foundComment.replyComments.push(comment);

                            // Increase Count Reply Comment
                            foundComment._count.replyComments++;
                        }
                    }
                }
            )
            .addCase(createReplyCommentAction.fulfilled, (state, action) => {
                const { commentId } = action.payload;
                const { imageIndex, parentId } = action?.meta?.arg?.data;

                const target = imageIndex
                    ? state.commentsImage.comments
                    : state.commentsBook.comments;

                const tempComment = target.find((c) => c.commentId === parentId);
                if (tempComment) {
                    tempComment.replyComments =
                        tempComment?.replyComments || [];
                    tempComment.replyComments[
                        tempComment.replyComments.length - 1
                    ].commentId = commentId;
                }
            })
            .addCase(
                createReplyCommentAction.rejected,
                (state: CommentSlideProps, action) => {
                }
            );

        // deleteCommentAction

        builder
            .addCase(
                deleteCommentAction.pending,
                (state: CommentSlideProps, action) => {
                    
                }
            )
            .addCase(deleteCommentAction.fulfilled, (state, action) => {
                const { type, commentId, parentId } = action?.meta?.arg?.data;

                const target = type === TypeCommentEnum.IMAGE_CHAPTER
                        ? state.commentsImage.comments
                        : state.commentsBook.comments;

                if (!parentId) {
                    const indexToRemove = target.findIndex(
                        (comment) => comment.commentId === commentId
                    );
                    if (indexToRemove !== -1) {
                        target.splice(indexToRemove, 1);
                    }
                } else {
                    const indexToParentRemove = target.findIndex(
                        (comment) => comment.commentId === parentId
                    );
                    if (indexToParentRemove !== -1) {
                        const foundComment = target[indexToParentRemove];

                        if (foundComment && foundComment?.replyComments) {
                            const indexToReplyCommentRemove =
                                foundComment?.replyComments.findIndex(
                                    (comment) =>
                                        comment.commentId === commentId
                                );
                            if (indexToReplyCommentRemove !== -1) {
                                foundComment._count.replyComments--;
                                target[indexToParentRemove]?.replyComments?.splice(
                                    indexToReplyCommentRemove,
                                    1
                                );
                            }
                        }
                    }
                }
            })
            .addCase(
                deleteCommentAction.rejected,
                (state: CommentSlideProps, action) => {
                }
            );
    },
});

export const { setImageIndex, resetComments } = commentSlide.actions;

export default commentSlide.reducer;
