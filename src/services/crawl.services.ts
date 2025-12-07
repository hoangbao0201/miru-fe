import { BookType } from "@/lib/types";
import { Env } from "@/config/Env";

const { NEXT_PUBLIC_API_URL } = Env

export interface ICrawlBooksLatest {
    id: number;
    link: string;
    title: string;
    domain: string;
    source: BookType;
    thumbnail: string;
    numChapterNew: string;
    linkChapterNew: string;
    createdAtChapterNew: string;
    
    isAdd?: boolean;
    isRemove?: boolean;
    exist?: IGetCrawlBooksCheckExistService[];
}

export interface IGetCrawlBooksCheckExistService {
    slug: string;
    title: string;
    bookId: number;
    thumbnail: string;
    altTitles: string;
    chapters: {
        num: string;
        createdAt: Date;
        source: BookType;
        chapterNumber: number;
    }[];
}

export const crawlBooksLatestService = async ({
    query,
    token,
}: {
    query?: string;
    token: string;
}): Promise<any> => {
    try {
        const response = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/creator/books/crawl/latest${query || ""}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return await response.json();
    } catch (error) {
        return { success: false, message: "Error", error };
    }
};

export const getCrawlBooksCheckExistCreatorService = async ({
    query,
    token,
}: {
    query?: string;
    token: string;
}): Promise<any> => {
    try {
        const dataRes = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/creator/books/crawl/check/exist${
                query ? query : ""
            }`,
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
