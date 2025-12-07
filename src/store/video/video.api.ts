import { Env } from "@/config/Env";
import {
    IGetDetailInfoVideoType,
    IGetDetailServerVideoType,
    IGetListEpisodeVideoType,
    IGetListVideoType,
    IParamsGetListVideoType,
} from "./video.types";
import { cleanAndSerializeQueryParams } from "@/utils/cleanAndSerializeQueryParams";
import { instanceAxios } from "@/config/axios";

export const increaseViewVideoApi = async ({
    isUser,
    videoId,
    episodeId,
}: {
    isUser: boolean;
    videoId: number;
    episodeId: number;
}): Promise<any> => {
    return await instanceAxios.post(`${Env.NEXT_PUBLIC_API_URL}/api/videos/increase/views/${
        isUser ? "is-user" : "not-user"
    }`, { videoId, episodeId })
};

export const saveHistoryVideoApi = async ({
    videoId,
    episodeId,
}: {
    videoId: number;
    episodeId: number;
}): Promise<any> => {
    return await instanceAxios.post(`${Env.NEXT_PUBLIC_API_URL}/api/videos/save/views`, { videoId, episodeId })
};

export const getListVideoApi = async (
    data: IParamsGetListVideoType
): Promise<IGetListVideoType> => {
    const newParams = cleanAndSerializeQueryParams({
        ...data?.data?.query,
    });

    const url = "api/videos";
    const dataRes = await fetch(
        `${Env.NEXT_PUBLIC_API_URL}/${url}?${newParams}`,
        {
            cache: data?.options?.cache,
            next: { revalidate: data?.options.revalidate },
        }
    );

    return await dataRes.json();
};

export const getListVideoFeaturedApi = async (
    data: IParamsGetListVideoType
): Promise<IGetListVideoType> => {
    const newParams = cleanAndSerializeQueryParams({
        ...data?.data?.query,
    });

    const url = "api/videos/top/featured";
    const dataRes = await fetch(
        `${Env.NEXT_PUBLIC_API_URL}/${url}?${newParams}`,
        {
            cache: data?.options?.cache,
            next: { revalidate: data?.options.revalidate },
        }
    );

    return await dataRes.json();
};

export const getDetailVideoApi = async ({
    data,
    options,
}: {
    data: {
        videoId: number;
    };
    options: {
        cache?: RequestCache;
        revalidate?: number;
    };
}): Promise<IGetDetailInfoVideoType> => {
    const { videoId } = data;

    const url = "api/videos";
    const dataRes = await fetch(
        `${Env.NEXT_PUBLIC_API_URL}/${url}/${videoId}`,
        {
            cache: options?.cache,
            next: { revalidate: options.revalidate },
        }
    );

    return await dataRes.json();
};

export const getDetailEpisodeApi = async ({
    data,
    options,
}: {
    data: {
        videoId: number;
        episodeId: number;
    };
    options: {
        cache?: RequestCache;
        revalidate?: number;
    };
}): Promise<IGetDetailInfoVideoType> => {
    const { videoId, episodeId } = data;

    const url = "api/videos";
    const dataRes = await fetch(
        `${Env.NEXT_PUBLIC_API_URL}/${url}/${videoId}/episodes/${episodeId}`,
        {
            cache: options?.cache,
            next: { revalidate: options.revalidate },
        }
    );

    return await dataRes.json();
};

export const getDetailServerApi = async ({
    data,
    options,
}: {
    data: {
        serverId: number;
    };
    options: {
        cache?: RequestCache;
        revalidate?: number;
    };
}): Promise<IGetDetailServerVideoType> => {
    const { serverId } = data;

    const url = "api/videos/servers";
    const dataRes = await fetch(
        `${Env.NEXT_PUBLIC_API_URL}/${url}/${serverId}`,
        {
            cache: options?.cache,
            next: { revalidate: options.revalidate },
        }
    );

    return await dataRes.json();
};

export const getListEpisodeApi = async ({
    data,
    options,
}: {
    data: {
        videoId: number;
    };
    options: {
        cache?: RequestCache;
        revalidate?: number;
    };
}): Promise<IGetListEpisodeVideoType> => {
    const { videoId } = data;

    const url = "api/videos";
    const dataRes = await fetch(
        `${Env.NEXT_PUBLIC_API_URL}/${url}/${videoId}/episodes`,
        {
            cache: options?.cache,
            next: { revalidate: options.revalidate },
        }
    );

    return await dataRes.json();
};
