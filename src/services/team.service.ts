import axios from "axios";

import { Env } from "@/config/Env";
import { MetaPagination, ParameterGet } from "@/constants/type";
import { cleanAndSerializeQueryParams } from "@/utils/cleanAndSerializeQueryParams";

// ========================

export interface IGetListBooksByTeamType extends ParameterGet {
    teamId: number;
}
export interface IGetListBooksByTeamRes {
    success: boolean;
    data: {
        raw: null;
        type: string;
        slug: string;
        title: string;
        status: number;
        bookId: number;
        storage: string;
        category: string;
        thumbnail: string | null;
        isFeatured: boolean;
        isAutoUpdate: boolean;
        altTitles: string;
        author: string | null;
        createdAt: Date;
        updatedAt: Date;
        newChapterAt: Date;
        // ---
        covers: {
            url: string;
            width: number;
            height: number;
        }[];
        posters: {
            url: string;
            width: number;
            height: number;
        }[];
        previews: {
            url: string;
            width: number;
            height: number;
        }[];
        // ---
        chapters: {
            num: string;
            source: string;
            createdAt: Date;
            chapterNumber: number;
        }[];
    }[];
    meta: MetaPagination;
}
export const getListBooksByTeamApi = (
    params: IGetListBooksByTeamType
): Promise<{ data: IGetListBooksByTeamRes }> => {
    const newParams = cleanAndSerializeQueryParams(params);
    const url = "api/teams/books?";
    return axios.get(`${Env.NEXT_PUBLIC_API_URL}/${url}` + newParams);
};

// ========================

export interface IGetDetailTeamType {
    success: boolean;
    data: {
        teamId: number;
        name: string;
        slug: string;
        coverUrl: string | null;
        panoramaUrl: string | null;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        facebook: string | null;
        members: {
            user: {
                name: string;
                userId: number;
                webUrl: string | null;
                username: string;
                createdAt: Date;
                description: string | null;
                facebookUrl: string | null;
            };
        }[];
    };
}
export const getDetailTeamApi = async ({
    teamId,
    options,
}: {
    teamId: number;
    options: {
        cache?: RequestCache;
        revalidate?: number;
    };
}): Promise<IGetDetailTeamType> => {
    const url = "api/teams";
    const data = await fetch(`${Env.NEXT_PUBLIC_API_URL}/${url}/${teamId}`, {
        cache: options?.cache,
        next: { revalidate: options.revalidate },
    });

    return await data.json();
};
