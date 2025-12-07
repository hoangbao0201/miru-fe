import { Env } from "@/config/Env";
import {
    GetUserDetailProps,
} from "./user.services";

const { NEXT_PUBLIC_API_URL } = Env

export interface GetCommentsProps {
    bookId: number;
    commentId: number;
    commentText: string;
    parentId?: null | number;
    imageIndex?: null | number;
    chapterNumber?: null | number;
    createdAt: string;
    updatedAt: string;
    _count: {
        replyComments: number;
    };
    chapter: {
        num: string;
    } | null;
    book: {
        slug: string;
        title: string;
    };
    sender: Pick<
        GetUserDetailProps,
        | "userId"
        | "role"
        | "name"
        | "username"
        | "rank"
        | "avatarUrl"
        | "equippedItem"
        | "strengthMapping"
    >;
    receiver: Pick<GetUserDetailProps, "userId" | "name" | "username"> | null;
}
export interface GetNotificationsProps {
    commentId: number;
    bookId: number;
    parentId: number;
    isRead: boolean;
    chapterNumber: number;
    book: {
        title: string;
        slug: string;
        category: string;
    };
    sender: {
        name: string;
        avatarUrl: null | string;
    };
    createdAt: Date;
}
class CommentService {
    async addComment({
        data,
        token,
    }: {
        data: {
            bookId: number;
            chapterNumber?: number;
            parentId?: number;
            receiverId?: number;
            commentText: string;
            imageIndex?: number;
        };
        token: string;
    }): Promise<any> {
        const { receiverId, parentId, bookId, chapterNumber, imageIndex, commentText } =
            data;

        try {
            const commentRes = await fetch(`${NEXT_PUBLIC_API_URL}/api/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    bookId,
                    chapterNumber,
                    receiverId,
                    parentId,
                    commentText,
                    imageIndex,
                }),
            });
            const comment = await commentRes.json();
            return comment;
        } catch (error) {
            return {
                success: false,
                message: "error comment successful",
                error: error,
            };
        }
    }

    async findAll({
        query,
        revalidate,
        cache,
    }: {
        query?: string;
        revalidate?: number;
        cache?: RequestCache;
    }): Promise<any> {
        try {
            const commentRes = await fetch(
                `${NEXT_PUBLIC_API_URL}/api/comments${query ? query : ""}`,
                {
                    method: "GET",
                    cache: cache,
                    next: {
                        revalidate: revalidate,
                    },
                }
            );
            const comment = await commentRes.json();
            return comment;
        } catch (error) {
            return {
                success: false,
                message: "error comments successful",
                error: error,
            };
        }
    }

    async findAllNotification({
        query,
        token,
        revalidate,
        cache,
    }: {
        query: string;
        token: string;
        revalidate?: number;
        cache?: RequestCache;
    }): Promise<any> {
        try {
            const commentsRes = await fetch(
                `${NEXT_PUBLIC_API_URL}/api/comments/notification${query || ""}`,
                {
                    method: "GET",
                    cache: cache,
                    next: {
                        revalidate: revalidate,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            const comments = await commentsRes.json();
            return comments;
        } catch (error) {
            return {
                success: false,
                message: "error comments successful",
                error: error,
            };
        }
    }

    async readComment({
        commentId,
        token,
    }: {
        commentId: number;
        token: string;
    }): Promise<any> {
        try {
            const commentRes = await fetch(
                `${NEXT_PUBLIC_API_URL}/api/comments/read/${commentId || ""}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            const comment = await commentRes.json();
            return comment;
        } catch (error) {
            return {
                success: false,
                message: "error comments successful",
                error: error,
            };
        }
    }

    async delete({
        commentId,
        token,
    }: {
        commentId: number;
        token: string;
    }): Promise<any> {
        try {
            const commentRes = await fetch(
                `${NEXT_PUBLIC_API_URL}/api/comments/${commentId || ""}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            const comment = await commentRes.json();
            return comment;
        } catch (error) {
            return {
                success: false,
                message: "error delete comments",
                error: error,
            };
        }
    }
}

const commentService = new CommentService();

export default commentService;
