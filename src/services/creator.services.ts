import axios from "axios";
import { Env } from "@/config/Env";
import { UserRoleType } from "./user.services";
import { ContentPageEnum } from "@/common/data.types";
import { UserBookContributorRole } from "@/store/book/book.type";
import { cleanAndSerializeQueryParams } from "@/utils/cleanAndSerializeQueryParams";
import { removeNullOrEmptyValues } from "@/utils/removeNullOrEmptyValues";

const { NEXT_PUBLIC_API_URL } = Env;

export enum BookStorageStatusEnum {
    "ALL" = "ALL",
    "MAIN" = "MAIN",
    "ERROR" = "ERROR",
    "BACKUP" = "BACKUP",
    "WAITING" = "WAITING",
}

export interface IGetAllBooksCreatorService {
    slug: string;
    title: string;
    views: number;
    status: number;
    bookId: number;
    thumbnail: string;
    isFeatured: boolean;
    isAutoUpdate: boolean;
    storage: BookStorageStatusEnum;
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
        chapterNumber: number;
    }[];
    contributors: {
        confirmed: boolean;
        role: UserBookContributorRole;
        user: {
            name: string;
            userId: number;
            avatarUrl: string;
            username: string;
        };
    }[];
}

export interface IGetDetailChapterCreatorService {
    num: string;
    title: string;
    bookId: number;
    thumbnail: string;
    chapterNumber: number;
    source: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateChapterManualServer {
    cloud: string;
    protectedImages: {
        order: number;
        width: number;
        height: number;
        imageUrl: string;
        drmData?: string;
        keySecure?: number;
        secureImageUrl?: string | null;
    }[];
}

export enum StorageBookEnum {
    "ALL" = "ALL",
    "MAIN" = "MAIN",
    "ERROR" = "ERROR",
    "BACKUP" = "BACKUP",
    "WAITING" = "WAITING",
}

// Book

export const createBookManualCreatorService = async ({
    data,
    token,
}: {
    token: string;
    data: {
        title: string;
        tags: string[];
        isAdult: boolean;
        category: string;
        raw: string | null;
        altTitles: string;
        description: string;
    };
}): Promise<any> => {
    try {
        const {
            raw,
            title,
            tags,
            isAdult,
            category,
            altTitles,
            description,
        } = data;

        const dtRes = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/creator/books/create/by-data`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    raw,
                    title,
                    tags,
                    isAdult,
                    category,
                    altTitles,
                    description,
                }),
                cache: "no-store",
            }
        );
        const dt = await dtRes.json();
        return dt;
    } catch (error) {
        return {
            success: false,
            message: "error get books",
            error: error,
        };
    }
};

export const updateBookCreatorService = async ({
    data,
    token,
}: {
    token: string;
    data: {
        bookId: number;
        title: string;
        tags: string[];
        isAdult: boolean;
        raw: string | null;
        altTitles: string;
        description: string;
    };
}): Promise<any> => {
    try {
        const { raw, title, bookId, tags, isAdult, altTitles, description } =
            data;

        const dtRes = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/creator/books/info`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    bookId,
                    raw,
                    title,
                    tags,
                    isAdult,
                    altTitles,
                    description,
                }),
                cache: "no-store",
            }
        );
        const dt = await dtRes.json();
        return dt;
    } catch (error) {
        return {
            success: false,
            message: "error get books",
            error: error,
        };
    }
};

export const toggleAutoUpdateBookCreatorService = async ({
    data,
    token,
}: {
    token: string;
    data: {
        bookId: number;
        isAutoUpdate: boolean;
    };
}): Promise<any> => {
    try {
        const { bookId, isAutoUpdate } = data;

        const dataRes = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/books/toggle/auto-update`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    bookId,
                    isAutoUpdate,
                }),
                cache: "no-store",
            }
        );
        return await dataRes.json();
    } catch (error) {
        return {
            success: false,
            message: "error toggle",
            error: error,
        };
    }
};

export const toggleFeaturedBookCreatorService = async ({
    data,
    token,
}: {
    token: string;
    data: {
        bookId: number;
        isFeatured: boolean;
    };
}): Promise<any> => {
    try {
        const { bookId, isFeatured } = data;

        const dataRes = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/books/toggle/featured`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    bookId,
                    isFeatured,
                }),
                cache: "no-store",
            }
        );
        return await dataRes.json();
    } catch (error) {
        return {
            success: false,
            message: "error toggle",
            error: error,
        };
    }
};

export const crawlBookCreatorService = async ({
    data,
    token,
}: {
    token: string;
    data: {
        url: string;
        isAutoUpdate: boolean;
        updateLastest: boolean;
        category: ContentPageEnum;
        storage: BookStorageStatusEnum;
    };
}): Promise<any> => {
    try {
        const { url, category, isAutoUpdate, updateLastest, storage } = data;

        const dataRes = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/creator/books/create/by-url`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    url,
                    storage,
                    category,
                    isAutoUpdate,
                    updateLastest,
                }),
                cache: "no-store",
            }
        );
        return await dataRes.json();
    } catch (error) {
        return {
            success: false,
            message: "error get books",
            error: error,
        };
    }
};

export const updateStorageBookCreatorService = async ({
    token,
    bookId,
    storage,
}: {
    token: string;
    bookId: number;
    storage: StorageBookEnum;
}): Promise<any> => {
    try {
        const dataRes = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/creator/books/storage`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    bookId,
                    storage,
                }),
                cache: "no-store",
            }
        );
        const data = await dataRes.json();
        return data;
    } catch (error) {
        return {
            success: false,
            message: "error get books",
            error: error,
        };
    }
};

export const updateCategoryBookCreatorService = async ({
    token,
    bookId,
    category,
}: {
    token: string;
    bookId: number;
    category: ContentPageEnum;
}): Promise<any> => {
    try {
        const dataRes = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/creator/books/category`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    bookId,
                    category,
                }),
                cache: "no-store",
            }
        );
        const data = await dataRes.json();
        return data;
    } catch (error) {
        return {
            success: false,
            message: "error get books",
            error: error,
        };
    }
};

// UPLOAD

export const deleteCoverBookCreatorService = async ({
    token,
    bookId,
    imageId,
}: {
    token: string;
    bookId: number;
    imageId: number;
}): Promise<any> => {
    const dataRes = await axios.delete(
        `${NEXT_PUBLIC_API_URL}/api/creator/books/${bookId}/cover/image/${imageId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return dataRes?.data;
};

export const deletePosterBookCreatorService = async ({
    token,
    bookId,
    imageId,
}: {
    token: string;
    bookId: number;
    imageId: number;
}): Promise<any> => {
    const dataRes = await axios.delete(
        `${NEXT_PUBLIC_API_URL}/api/creator/books/${bookId}/poster/image/${imageId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return dataRes?.data;
};

export const createCoverBookByUrlCreatorService = async ({
    token,
    bookId,
    thumbnailUrl,
}: {
    token: string;
    bookId: number;
    thumbnailUrl: string;
}): Promise<any> => {
    const dataRes = await axios.post(
        `${NEXT_PUBLIC_API_URL}/api/creator/books/${bookId}/cover/by-url`,
        {
            thumbnailUrl,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return dataRes?.data;
};

export const createPosterBookByUrlCreatorService = async ({
    token,
    bookId,
    thumbnailUrl,
}: {
    token: string;
    bookId: number;
    thumbnailUrl: string;
}): Promise<any> => {
    const dataRes = await axios.post(
        `${NEXT_PUBLIC_API_URL}/api/creator/books/${bookId}/poster/by-url`,
        {
            thumbnailUrl,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return dataRes.data;
};

export const createCoverBookByFileCreatorService = async ({
    file,
    token,
    bookId,
}: {
    token: string;
    file: FormData;
    bookId: number;
}): Promise<any> => {
    const dataRes = await axios.post(
        `${NEXT_PUBLIC_API_URL}/api/creator/books/${bookId}/cover/by-file`,
        file,
        {
            headers: {
                "Content-Type": "image/jpeg",
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return dataRes.data;
};

export const createPosterBookByFileCreatorService = async ({
    file,
    token,
    bookId,
}: {
    token: string;
    file: FormData;
    bookId: number;
}): Promise<any> => {
    const dataRes = await axios.post(
        `${NEXT_PUBLIC_API_URL}/api/creator/books/${bookId}/poster/by-file`,
        file,
        {
            headers: {
                "Content-Type": "image/jpeg",
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return dataRes.data;
};

export const updateCoverOrderBookCreatorService = async ({
    token,
    bookId,
    orders,
}: {
    token: string;
    bookId: number;
    orders: { imageId: number; index: number }[];
}): Promise<any> => {
    const dataRes = await axios.post(
        `${NEXT_PUBLIC_API_URL}/api/creator/books/${bookId}/covers/orders`,
        {
            orders,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return dataRes.data;
};

export const updatePosterOrderBookCreatorService = async ({
    token,
    bookId,
    orders,
}: {
    token: string;
    bookId: number;
    orders: { imageId: number; index: number }[];
}): Promise<any> => {
    const dataRes = await axios.post(
        `${NEXT_PUBLIC_API_URL}/api/creator/books/${bookId}/posters/orders`,
        {
            orders,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return dataRes.data;
};

// ===

export const getDetailBooksCreatorService = async ({
    token,
    bookId,
}: {
    bookId: number;
    token: string;
}): Promise<any> => {
    try {
        const dataRes = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/creator/books/${bookId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                cache: "no-store",
            }
        );
        const data = await dataRes.json();
        return data;
    } catch (error) {
        return {
            success: false,
            message: "error get books",
            error: error,
        };
    }
};

export const getAllBooksCreatorService = async ({
    query,
    token,
}: {
    query?: string;
    token: string;
}): Promise<any> => {
    try {
        const dataRes = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/creator/books${query ? query : ""}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                cache: "no-store",
            }
        );
        const data = await dataRes.json();
        return data;
    } catch (error) {
        return {
            success: false,
            message: "error get books",
            error: error,
        };
    }
};

// Chapter

export const getDetailChapterCreatorService = async ({
    token,
    bookId,
    chapterNumber,
}: {
    token: string;
    bookId: number;
    chapterNumber: number;
}): Promise<any> => {
    try {
        const dataRes = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/creator/chapters/${chapterNumber}/${bookId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                cache: "no-store",
            }
        );
        const data = await dataRes.json();
        return data;
    } catch (error) {
        return {
            success: false,
            message: "error get books",
            error: error,
        };
    }
};

export const getAllChaptersByBookIdCreatorService = async ({
    query,
    token,
}: {
    query?: string;
    token: string;
}): Promise<any> => {
    try {
        const dataRes = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/creator/chapters${query ? query : ""}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                cache: "no-store",
            }
        );
        const data = await dataRes.json();
        return data;
    } catch (error) {
        return {
            success: false,
            message: "error get books",
            error: error,
        };
    }
};

// CREATE CHAPTER

export const createChapterCreatorServiceV1 = async ({
    data,
    token,
}: {
    data: {
        num: string;
        title?: string;
        urls: string[];
        bookId: number;
        originalLink: string;
        chapterNumber: number;
    };
    token: string;
}): Promise<any> => {
    try {
        const { bookId, num, title, originalLink, urls, chapterNumber } = data;
        const dataRes = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/creator/chapters/create/data/v1`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(
                    removeNullOrEmptyValues({
                        num,
                        urls,
                        title,
                        bookId,
                        originalLink,
                        chapterNumberBefore: chapterNumber,
                    })
                ),
            }
        );
        const dt = await dataRes.json();
        return dt;
    } catch (error) {
        return {
            success: false,
            message: "error get books",
            error: error,
        };
    }
};

export const createChapterByDataCreatorService = async ({
    data,
    token,
}: {
    data: {
        num: string;
        bookId: number;
        title?: string;
        originalLink?: string;
        chapterNumber: number;
        servers: ICreateChapterManualServer[];
    };
    token: string;
}): Promise<any> => {
    try {
        const { bookId, num, title, originalLink, servers, chapterNumber } =
            data;
        const dataRes = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/creator/chapters/create/by-data`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(
                    removeNullOrEmptyValues({
                        num,
                        title,
                        bookId,
                        servers,
                        originalLink,
                        chapterNumberBefore: chapterNumber,
                    })
                ),
            }
        );
        const dt = await dataRes.json();
        return dt;
    } catch (error) {
        return {
            success: false,
            message: "error get books",
            error: error,
        };
    }
};

// UPDATE CHAPTER

export const updateChapterCreatorServiceV1 = async ({
    data,
    token,
}: {
    data: {
        num: string;
        title?: string;
        urls: string[];
        bookId: number;
        originalLink: string;
        chapterNumber: number;
    };
    token: string;
}): Promise<any> => {
    try {
        const { bookId, num, title, originalLink, urls, chapterNumber } = data;
        const dataRes = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/creator/chapters/update/data/v1`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(
                    removeNullOrEmptyValues({
                        num,
                        urls,
                        title,
                        bookId,
                        originalLink,
                        chapterNumber,
                    })
                ),
            }
        );
        const dt = await dataRes.json();
        return dt;
    } catch (error) {
        return {
            success: false,
            message: "error get books",
            error: error,
        };
    }
};

export const updateChapterByDataCreatorService = async ({
    data,
    token,
}: {
    data: {
        num: string;
        bookId: number;
        title?: string;
        originalLink?: string;
        chapterNumber: number;
        servers: ICreateChapterManualServer[];
    };
    token: string;
}): Promise<any> => {
    try {
        const { bookId, num, title, originalLink, servers, chapterNumber } =
            data;
        const dataRes = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/creator/chapters/update/by-data`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(
                    removeNullOrEmptyValues({
                        num,
                        title,
                        bookId,
                        servers,
                        originalLink,
                        chapterNumber,
                    })
                ),
            }
        );
        const dt = await dataRes.json();
        return dt;
    } catch (error) {
        return {
            success: false,
            message: "error get books",
            error: error,
        };
    }
};

// DELETE CHAPTER
export const deleteChapterCreatorService = async ({
    token,
    bookId,
    chapterNumber,
}: {
    token: string;
    bookId: number;
    chapterNumber: number;
}): Promise<any> => {
    try {
        const dataRes = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/creator/chapters`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    bookId,
                    chapterNumber,
                }),
            }
        );
        const data = await dataRes.json();
        return data;
    } catch (error) {
        return {
            success: false,
            message: "error delete chapter",
            error: error,
        };
    }
};
