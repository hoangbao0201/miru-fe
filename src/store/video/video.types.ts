import { ContentPageEnum } from "@/common/data.types";
import {
    MetaPagination,
    OptionsFetch,
    ParameterGet,
    VideoContentTypeEnum,
    VideoTypeTypeEnum,
} from "@/constants/type";

export interface IItemVideoType {
    videoId: number;
    likes: number;
    views: number;
    duration: number;
    createdAt: string;
    updatedAt: string;
    user: {
        userId: number;
    };
    localizedContent: {
        slug: string;
        title: string;
        language: string;
        description: string;
    }[];
    covers: {
        url: string;
        width: number;
        height: number;
    }[];
    genres: {
        name: string;
        slug: string;
        covers: {
            url?: string;
            width?: number;
            height?: number;
        }[];
    }[];
}

export interface IGetDetailServerVideoType {
    success: boolean;
    data: {
        drm: string;
        content: string;
        type: VideoContentTypeEnum;
        domain: {
            name: string;
            region: string;
        } | null;
    };
}

export interface IGetDetailInfoVideoType {
    success: boolean;
    data: IVideoDetailType;
}

export interface IGetListEpisodeVideoType {
    success: boolean;
    data: {
        episodes: IEpisodeType[];
        meta: MetaPagination;
    };
}

// ----------

export interface ExtendedParameterGetListVideoType extends ParameterGet {
    category?: ContentPageEnum;
    notVideoId?: number;
    tags?: string;
    genres?: string;
    relatedTags?: string;
    relatedGenres?: string;
    includesTags?: string;
    includesGenres?: string;
}
export interface IParamsGetListVideoType extends OptionsFetch {
    data: {
        query: ExtendedParameterGetListVideoType;
    };
}
export interface IVideoListType {
    videoId: number;
    views: number;
    isAdult: boolean;
    type: VideoTypeTypeEnum;
    duration: number;
    createdAt: string;
    updatedAt: string;
    user: {
        userId: number;
    };
    localizedContent: {
        slug: string;
        title: string;
        language: string;
        description: string;
    }[];
    covers: {
        url: string;
        width: number;
        height: number;
        dominantColor: string;
    }[];
    posters: {
        url: string;
        width: number;
        height: number;
        dominantColor: string;
    }[];
    previews: {
        url: string;
        width: number;
        height: number;
        dominantColor: string;
    }[];
    tags: {
        tagId: number;
        name: string;
        slug: string;
    }[];
    genres: {
        genresId: number;
        name: string;
        slug: string;
    }[];
    episodes: {
        views: number;
        episodeId: number;
        episodeNumber: string;
        createdAt: string;
    }[];
}
export interface IGetListVideoType {
    success: boolean;
    data: {
        videos: IVideoListType[];
        includes?: {
            tag?: {
                tagId: number;
                name: string;
                slug: string;
                covers: {
                    url?: string;
                    width?: number;
                    height?: number;
                }[];
            };
            genres?: {
                genresId: number;
                name: string;
                slug: string;
                covers: {
                    url?: string;
                    width?: number;
                    height?: number;
                }[];
            };
        };
    };
    meta: MetaPagination;
}

// -----------

export interface IParamsGetListTagVideoType extends OptionsFetch {
    data: {
        query: ParameterGet;
    };
}

export interface IGetListTagVideoType {
    success: boolean;
    data: {
        tagId: number;
        name: string;
        slug: string;
        taggingCount: number;
    }[];
}

// -----------

export interface IParamsGetListGenresVideoType extends OptionsFetch {
    data: {
        query: ParameterGet;
    };
}

export interface IGetListGenresVideoType {
    success: boolean;
    data: {
        genresId: number;
        name: string;
        slug: string;
        taggingCount: number;
    }[];
}

// -----------

export interface IParamsGetListGenresVideoType extends OptionsFetch {
    data: {
        query: ParameterGet;
    };
}
// -----------
export interface IParamsGetCountVideosType extends OptionsFetch {}
export interface IGetCountVideosType {
    success: boolean;
    data: number;
}

// -----------
// -----------
// -----------
// -----------
// -----------
// -----------
// -----------
// -----------
// -----------
// -----------
// -----------
// -----------
// -----------

export interface IVideoDetailType {
    videoId: number;
    likes: number;
    views: number;
    type: string;
    isAdult: boolean;
    status: string | null;
    quality: string | null;
    schedule: string | null;
    duration: number;
    createdAt: string;
    updatedAt: string;
    user: {
        userId: number;
    };
    localizedContent: IVideoLocaleType[];
    episode: IEpisodeType;
    covers: IMediaType[];
    posters: IMediaType[];
    tags: ITagType[];
    genres: ITagType[];

    authors: MetaItem[];
    seasons: MetaItem[];
    studios: MetaItem[];
    countrys: MetaItem[];
    releaseDate: MetaItem[];
}

export interface IEpisodeType {
    index: number;
    title: string | null;
    likes: number;
    views: number;
    duration: number;
    episodeId: number;
    description: null;
    episodeNumber: string;
    createdAt: string;
    updatedAt: string;
    servers: IServerType[];
}

export interface MetaItem {
    name: string;
    slug: string;
    type: string;
    metaId: number;
}

export interface IVideoLocaleType {
    slug: string;
    title: string;
    language: string;
    description: string;
}

export interface IServerType {
    episodeServerId: number;
}

export interface IMediaType {
    url: string;
    width: number;
    height: number;
}

export interface ITagType {
    name: string;
    slug: string;
    covers: IMediaType[];
}
