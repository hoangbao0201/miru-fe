export interface ParameterGet {
    order?: string;
    page?: number;
    take?: number;
    q?: string;
}

export interface MetaPagination {
    nextPage: number;
    pageCount: number;
    totalCount: number;
    isLastPage: boolean;
    isFirstPage: boolean;
    currentPage: number | null;
    previousPage: number | null;
}

export interface FetchHeadersType {
    revalidate?: number;
    cache?: RequestCache;
}

export interface OptionsFetch {
    options: {
        cache?: RequestCache;
        revalidate?: number;
    };
}

export enum VideoContentTypeEnum {
    MP4_URL = "MP4_URL",
    HLS_URL = "HLS_URL",
    HLS_TEXT = "HLS_TEXT",
}

export enum VideoTypeTypeEnum {
    ANIME = "ANIME",
    MOVIE = "MOVIE",
    DRAMA = "DRAMA",
    TV_SHOW = "TV_SHOW",
}

export interface ILevelGroupType {
    id: string;
    title: string;
    description: string;
}

export interface ILevelType {
    id: number;
    type: string;
    name: string;
    imageUrl: string;
    description: string;
    rankRange: [number, number];
}
