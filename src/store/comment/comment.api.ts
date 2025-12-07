import { Env } from "@/config/Env";
import { getSession } from "next-auth/react";
import { removeNullOrEmptyValues } from "@/utils/removeNullOrEmptyValues";
import { GetUserDetailProps } from "@/services/user.services";
import { omit } from "lodash";
import {
    FetchHeadersType,
    MetaPagination,
    ParameterGet,
} from "@/constants/type";
import { ContentPageEnum } from "@/common/data.types";
import { GetCommentsProps } from "@/services/comment.services";
import { cleanAndSerializeQueryParams } from "@/utils/cleanAndSerializeQueryParams";
import { TypeCommentEnum } from "./comment.reducer";

// CREATE COMMENT
export interface ICreateCommentParamsType {
    bookId: number;
    receiverId?: number;
    commentText: string;
    parentId?: number | null;
    imageIndex?: number | null;
    chapterNumber?: number | null;

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
export interface ICreateCommentResType {
    success: boolean;
    commentId: number;
}
export const createCommentApi = async ({
    data,
    headers,
}: {
    data: ICreateCommentParamsType;
    headers: FetchHeadersType;
}): Promise<ICreateCommentResType> => {
    const session = await getSession();
    const newData = removeNullOrEmptyValues(omit(data, ["sender", "receiver"]));

    const commentRes = await fetch(`${Env.NEXT_PUBLIC_API_URL}/api/comments`, {
        method: "POST",
        cache: headers.cache,
        next: {
            revalidate: headers.revalidate,
        },
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.backendTokens.accessToken}`,
        },
        body: JSON.stringify(newData),
    });
    const comment = await commentRes.json();
    return comment;
};

// GET COMMENTS
export interface IGetCommentsParamsType extends ParameterGet {
    bookId?: number | null;
    otherId?: number | null;
    parentId?: number | null;
    category: ContentPageEnum;
    imageIndex?: number | null;
    chapterNumber?: number | null;
}
export interface IGetCommentsResType {
    success: boolean;
    data: GetCommentsProps[];
    meta: MetaPagination;
}
export const getCommentsApi = async ({
    data,
    headers,
}: {
    data: IGetCommentsParamsType;
    headers: FetchHeadersType;
}): Promise<IGetCommentsResType> => {
    const newParams = cleanAndSerializeQueryParams(data);
    const commentRes = await fetch(
        `${Env.NEXT_PUBLIC_API_URL}/api/comments?${newParams}`,
        {
            method: "GET",
            cache: headers.cache,
            next: {
                revalidate: headers.revalidate,
            },
        }
    );
    const comment = await commentRes.json();
    return comment;
};

// DELETE COMMENT

export interface IDeleteCommentParamsType {
    type: TypeCommentEnum;
    commentId: number;
    parentId?: number | null;
}
export const deleteCommentApi = async ({
    data,
    headers,
}: {
    data: IDeleteCommentParamsType;
    headers: FetchHeadersType;
}): Promise<ICreateCommentResType> => {
    const session = await getSession();

    const commentRes = await fetch(
        `${Env.NEXT_PUBLIC_API_URL}/api/comments/${data.commentId || ""}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.backendTokens.accessToken}`,
            },
            next: {
                revalidate: headers.revalidate,
            },
        }
    );
    const comment = await commentRes.json();
    return comment;
};
