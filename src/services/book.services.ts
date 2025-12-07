import axios from "axios";
import { Env } from "@/config/Env";
import { LanguageCode } from "@/lib/types";
import { ContentPageEnum } from "@/common/data.types";

const { NEXT_PUBLIC_API_URL } = Env;

export type IAltTitleBookType = {
    title: string;
    languageCode: LanguageCode;
}
export type GetBooksProps = {
    bookId: number;
    createdAt: Date;
    isFeatured: boolean;
    // ---
    slug: string;
    title: string;
    description: string;
    languageCode: LanguageCode;
    altTitles: IAltTitleBookType[];
    covers: {
        url: string,
        width: number,
        height: number,
    }[]
    posters: {
        url: string,
        width: number,
        height: number,
    }[]
    chapters: { num: string; chapterNumber: number; createdAt: Date }[];
};

export interface UserBookContributorsType {
    name: string;
    userId: number;
    username: string;
    avatarUrl: string | null;
    webUrl: string | null;
    facebookUrl: string | null;
    team: null | {
        joinedAt: Date;
        team: {
            teamId: number;
            name: string;
            slug: string;
            facebook: string | null;
            coverUrl: string | null;
        };
    };
}

export type GetBookProps = {
    bookId: number;
    status: number;
    category: string;
    isFeatured: boolean;
    isAutoUpdate: boolean;
    tags: { metaId: number; name: string; slug: string; type: string }[];
    // ---
    title: string;
    slug: string;
    description: string;
    languageCode: LanguageCode;
    altTitles: IAltTitleBookType[];
    covers: {
        url: string,
        width: number,
        height: number,
    }[]
    posters: {
        url: string,
        width: number,
        height: number,
    }[]
    // ---
    author: {
        name: string;
        authorId: number;
    };
    postedBy: {
        avatarUrl: null;
        role: string;
        name: string;
        username: string;
    };
    team?: {
        name: string;
        slug: string;
        facebook?: string;
        coverUrl?: string;
    };
    createdAt: Date;
    updatedAt: Date;
    _count: {
        chapters: number;
        usersFollow: number;
    };
    totalViews: number;
    chapterFirst: {
        num: number;
        viewsCount: number;
        chapterNumber: number;
    };
    chapterLatest: {
        num: number;
        viewsCount: number;
        chapterNumber: number;
    };
    contributors: {
        user: UserBookContributorsType;
    }[];
};

export interface GetBookRandomProps {
    bookId: number;
    title: string;
    slug: string;
    raw: string;
    altTitles: string;
    description: string;
    status: number;
    thumbnail: string;
    // ---
    covers: {
        url: string,
        width: number,
        height: number,
    }[]
    posters: {
        url: string,
        width: number,
        height: number,
    }[]
    previews: {
        url: string,
        width: number,
        height: number,
    }[]
    // ---
    tags: {
        tag: {
            name: string;
            tagId: string;
        };
    }[];
    author: string | null;
    postedBy: {
        avatarUrl: string;
        role: string;
        name: string;
        username: string;
    };
    chapters: {
        num: string;
        chapterNumber: number;
    }[];
    createdAt: string;
    updatedAt: string;
    _count: {
        chapters: number;
        usersFollow: number;
    };
}

export interface GetAllBooksTopViewsProps {
    _count: {
        chapters: number;
    };
    title: string;
    thumbnail: string;
    createdAt: Date;
    updatedAt: Date;
    bookId: number;
    slug: string;
    category: ContentPageEnum;
    status: number;
    // ---
    covers: {
        url: string,
        width: number,
        height: number,
    }[]
    posters: {
        url: string,
        width: number,
        height: number,
    }[]
    previews: {
        url: string,
        width: number,
        height: number,
    }[]
    chapters: {
        num: string;
        chapterNumber: number;
    }[];
    views: number;
}

export interface GetBooksSeoProps {
    bookId: string;
    slug: string;
    title: string;
    newChapterAt: Date;
}

export const getAllBookService = async ({
    query,
    revalidate,
    cache,
}: {
    query?: string;
    revalidate?: number;
    cache?: RequestCache;
}): Promise<any> => {
    try {
        const bookRes = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/books${query ? query : ""}`,
            {
                method: "GET",
                cache: cache,
                next: {
                    revalidate: revalidate,
                },
            }
        );
        const books = await bookRes.json();
        return books;
    } catch (error) {
        console.log(error);
        return {
            success: false,
            error: error,
        };
    }
};

export const getTagsListService = async ({
    query,
    revalidate,
    cache,
}: {
    query?: string;
    revalidate?: number;
    cache?: RequestCache;
}): Promise<any> => {
    try {
        const bookRes = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/books/tags/list${query ? query : ""}`,
            {
                method: "GET",
                cache: cache,
                next: {
                    revalidate: revalidate,
                },
            }
        );
        const data = await bookRes.json();
        return data;
    } catch (error) {
        return {
            success: false,
            message: "error get data",
            error: error,
        };
    }
};

export const createBookService = async ({
    url,
    category,
    token,
}: {
    url: string;
    category: ContentPageEnum;
    token: string;
}): Promise<any> => {
    try {
        const bookRes = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/creator/books/create/by-url`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token || ""}`,
                },
                body: JSON.stringify({
                    url: url,
                    category: category,
                }),
            }
        );
        const book = await bookRes.json();
        return book;
    } catch (error) {
        return {
            success: false,
            message: "Error",
            error: error,
        };
    }
};

export const getAllTopViewBookService = async ({
    query,
    cache,
    revalidate,
}: {
    query?: string;
    revalidate?: number;
    cache?: RequestCache;
}): Promise<any> => {
    try {
        const bookRes = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/books/top-views${query ? query : ""}`,
            {
                method: "GET",
                cache: cache,
                next: {
                    revalidate: revalidate,
                },
            }
        );
        const books = await bookRes.json();
        return books;
    } catch (error) {
        return {
            success: false,
            message: "error get books",
            error: error,
        };
    }
};

export const getAllTopFollowBookService = async ({
    query,
    cache,
    revalidate,
}: {
    query?: string;
    revalidate?: number;
    cache?: RequestCache;
}): Promise<any> => {
    try {
        const bookRes = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/books/top-follows${query ? query : ""}`,
            {
                method: "GET",
                cache: cache,
                next: {
                    revalidate: revalidate,
                },
            }
        );
        const books = await bookRes.json();
        return books;
    } catch (error) {
        return {
            success: false,
            message: "error get books",
            error: error,
        };
    }
};

export const getAllFollowBookService = async ({
    query,
    token,
    revalidate,
    cache,
}: {
    token: string;
    query?: string;
    revalidate?: number;
    cache?: RequestCache;
}): Promise<any> => {
    try {
        const bookRes = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/books/follow${query ? query : ""}`,
            {
                method: "GET",
                cache: cache,
                next: {
                    revalidate: revalidate,
                },
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token || ""}`,
                },
            }
        );
        const books = await bookRes.json();
        return books;
    } catch (error) {
        return {
            success: false,
            message: "error get books",
            error: error,
        };
    }
};

export const getDetailBookService = async ({
    bookId,
    revalidate,
    cache,
}: {
    bookId: number;
    revalidate?: number;
    cache?: RequestCache;
}): Promise<any> => {
    try {
        const bookRes = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/books/${bookId}`,
            {
                method: "GET",
                cache: cache,
                next: {
                    revalidate: revalidate,
                },
            }
        );
        const book = await bookRes.json();
        return book;
    } catch (error) {
        return {
            success: false,
            message: "Error",
            error: error,
        };
    }
};

export const getRandomBookService = async ({
    query,
    revalidate,
    cache,
}: {
    query: {
        isFeatured: boolean;
        category: ContentPageEnum;
    };
    revalidate?: number;
    cache?: RequestCache;
}): Promise<any> => {
    try {
        const { category = ContentPageEnum.comics, isFeatured = true } = query;
        const params = new URLSearchParams({
            category: category.toString(),
            isFeatured: isFeatured.toString(),
        });

        const bookRes = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/books/random?${params}`,
            {
                method: "GET",
                cache: cache,
                next: {
                    revalidate: revalidate,
                },
            }
        );
        const book = await bookRes.json();
        return book;
    } catch (error) {
        return {
            success: false,
            message: "Error",
            error: error,
        };
    }
};

export const increaseViewBookService = async ({
    token,
    bookId,
    chapterNumber,
}: {
    bookId: number;
    token?: string;
    chapterNumber: number;
}): Promise<any> => {
    fetch(
        `${NEXT_PUBLIC_API_URL}/api/books/increase/views/${
            token ? "is-user" : "not-user"
        }`,
        {
            method: "POST",
            body: JSON.stringify({ bookId, chapterNumber }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token || ""}`,
            },
        }
    );
};

export const updateThumbnailByFileBookService = async ({
    bookId,
    file,
    token,
}: {
    bookId: number;
    file: FormData;
    token: string;
}): Promise<any> => {
    try {
        const imageArtworks = await axios.put(
            `${NEXT_PUBLIC_API_URL}/api/books/thumbnail/${bookId}`,
            file,
            {
                headers: {
                    "Content-Type": "image/jpeg",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const image = imageArtworks.data;
        return image;
    } catch (error) {
        return {
            success: false,
            message: "error update book",
            error: error,
        };
    }
};

// Follow Book
export const followBookService = async ({
    type,
    bookId,
    token,
}: {
    type: "follow" | "unfollow";
    bookId: number;
    token: string;
}): Promise<any> => {
    try {
        const bookRes = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/books/follow/${bookId}?type=${type}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token || ""}`,
                },
            }
        );
        const book = await bookRes.json();
        return book;
    } catch (error) {
        return {
            success: false,
            message: "Error",
            error: error,
        };
    }
};

// Follow Book
export const checkFollowBookService = async ({
    bookId,
    token,
    revalidate,
    cache,
}: {
    bookId: number;
    token: string;
    revalidate?: number;
    cache?: RequestCache;
}): Promise<any> => {
    try {
        const bookRes = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/books/follow/${bookId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token || ""}`,
                },
                cache: cache,
                next: {
                    revalidate: revalidate,
                },
            }
        );
        const book = await bookRes.json();
        return book;
    } catch (error) {
        return {
            success: false,
            message: "Error",
            error: error,
        };
    }
};

// SEO
export const getRssBookService = async ({
    query,
    cache,
    revalidate,
}: {
    query?: string;
    revalidate?: number;
    cache?: RequestCache;
}): Promise<any> => {
    try {
        const dataRes = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/books/rss${query}`,
            {
                method: "GET",
                cache: cache,
                next: {
                    revalidate: revalidate,
                },
            }
        );
        const data = await dataRes.json();
        return data;
    } catch (error) {
        console.log("error: ", error);
        return {
            success: false,
            message: "error get books",
            error: error,
        };
    }
};

export const getSeoBookService = async ({
    query,
    cache,
    revalidate,
}: {
    query?: string;
    revalidate?: number;
    cache?: RequestCache;
}): Promise<any> => {
    try {
        const dataRes = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/books/seo${query}`,
            {
                method: "GET",
                cache: cache,
                next: {
                    revalidate: revalidate,
                },
            }
        );
        const data = await dataRes.json();
        return data;
    } catch (error) {
        console.log("error: ", error);
        return {
            success: false,
            message: "error get books",
            error: error,
        };
    }
};

// SEO
export const getSeoCountBookService = async ({
    cache,
    query,
    revalidate,
}: {
    query?: string;
    revalidate?: number;
    cache?: RequestCache;
}): Promise<any> => {
    try {
        const dataRes = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/books/seo/count${query || ""}`,
            {
                method: "GET",
                cache: cache,
                next: {
                    revalidate: revalidate,
                },
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
