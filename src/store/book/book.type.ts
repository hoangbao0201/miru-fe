import { ContentPageEnum } from "@/common/data.types";
import { MetaPagination, OptionsFetch, ParameterGet } from "@/constants/type";
import { UserRoleTeam } from "../team/team.type";
import { IUserBookContributor } from "../admin-manager-teams/admin-manager-teams.type";

export enum UserBookContributorRole {
    admin = "admin",
    member = "member",
}

interface BookType {
    raw: string;
    title: string;
    description: string;
    altTitles: string;
}

// ----------

export interface ExtendedParameterGetListBookType extends ParameterGet {
    category?: ContentPageEnum;
    notBookId?: number;
    tags?: string;
    genres?: string;
    relatedTags?: string;
    relatedGenres?: string;
    includesTags?: string;
    includesGenres?: string;
}
export interface IParamsGetListBookType extends OptionsFetch {
    data: {
        query: ExtendedParameterGetListBookType;
    };
}
export interface IBookListType {
    bookId: number;
    title: string;
    slug: string;
    type?: string;
    createdAt: Date;
    nameImage: string;
    isFeatured: boolean;
    thumbnail: string | null;
    // ---
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
    chapters: { num: string; chapterNumber: number; createdAt: Date }[];
}
export interface IGetListBookType {
    success: boolean;
    data: {
        books: IBookListType[];
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

// Create Book =================================================================

export interface IAltTitleBookType {
    languageCode: string;
    title: string;
}

export interface CreateBookParameterType {
    title: string;
    tags: string[];
    isAdult: boolean;
    category: string;
    raw: string | null;
    altTitles: IAltTitleBookType[];
    description: string;
}
export interface CreateBookResType {
    success: boolean;
    data: {
        bookId: number;
    };
}

// Create Book =================================================================

export interface UpdateBookParameterType {
    bookId: number;
    title: string;
    tags: string[];
    isAdult: boolean;
    raw: string | null;
    altTitles: IAltTitleBookType[];
    description: string;
}

export interface UpdateBookResType {
    success: boolean;
    data: {
        bookId: number;
    };
}

export interface GetListTagsBookParameterType extends ParameterGet {
    category: ContentPageEnum;
}

export interface GetListTagsBookResType {
    success: boolean;
    data: {
        name: string;
        slug: string;
        metaId: string;
        tagging_count: number;
    }[];
}

// GetDetailBookCreator

export interface GetDetailBookCreatorParameterType {
    bookId: number;
}
export interface GetDetailBookCreatorResType {
    success: boolean;
    data: {
        title: string;
        storage: string;
        category: string;
        raw: string | null;
        thumbnail: string | null;
        description: string | null;
        altTitles: string | null;
        // ---
        covers: {
            imageId: number;
            url: string;
            index: number;
            width: number;
            height: number;
        }[];
        posters: {
            imageId: number;
            url: string;
            index: number;
            width: number;
            height: number;
        }[];
        previews: {
            imageId: number;
            url: string;
            index: number;
            width: number;
            height: number;
        }[];
        // ---
        tags: {
            name: string;
            slug: string;
            type: string;
            metaId: number;
        }[];

        contributors: IUserBookContributor[];
    };
}

// Contributor =================================================================

export interface AddMemberBookContributorBookParameterType {
    bookId: number;
    email: string;
    roleTeam?: UserRoleTeam;
}
export interface OutMemberBookContributorBookParameterType {
    userId: number;
    bookId: number;
}

export interface AddMemberBookContributorBookResType {
    success: boolean;
    data: IUserBookContributor;
}
export interface OutMemberBookContributorBookResType {
    success: boolean;
}

export interface JoinBookContributorParameterType {
    bookId: number;
}

export interface JoinBookContributorResType {
    success: boolean;
}

export interface DataPendingInvitationsBookContributorType {
    book: {
        bookId: number;
        slug: string;
        title: string;
        thumbnail: string | null;
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

        contributors: {
            user: {
                name: string;
                userId: string;
                username: string;
                avatarUrl: string | null;
            };
        }[];
    };
}

export interface GetDataPendingInvitationsBookContriutorResType {
    success: boolean;
    data: DataPendingInvitationsBookContributorType[];
}

// GET COVER POSTER BOOK
export interface ICoverPosterBookType {
    url: string;
    index: number;
    width: number;
    height: number;
    imageId: number;
}
export interface IGetListCoverPosterBookType {
    success: boolean;
    data: {
        images: {
            covers: ICoverPosterBookType[];
            posters: ICoverPosterBookType[];
        }
        meta: MetaPagination;
    };
}