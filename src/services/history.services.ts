import { ContentPageEnum } from "@/common/data.types";
import { Env } from "@/config/Env";

const { NEXT_PUBLIC_API_URL } = Env;

export interface GetHistoryChapterProps {
    book: {
        bookId: number;
        title: string;
        slug: string;
        thumbnail: string;
        category: ContentPageEnum;
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
    };
    chapterLatest: {
        num: string;
        createdAt: Date;
        updatedAt: Date;
        chapterNumber: number;
    };
    chapterRead: {
        num: string;
        updatedAt: Date;
        chapterNumber: number;
    };
}

class HistoryService {
    async getChapterRead({
        bookId,
        token,
    }: {
        bookId: number;
        token: string;
    }): Promise<any> {
        try {
            const historyRes = await fetch(
                `${NEXT_PUBLIC_API_URL}/api/history/chapter/read/${bookId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const history = await historyRes.json();
            return history;
        } catch (error) {
            return {
                success: false,
                message: "error history successful",
                error: error,
            };
        }
    }

    async saveChapterView({
        chapterNumber,
        bookId,
        token,
    }: {
        chapterNumber: number;
        bookId: number;
        token: string;
        revalidate?: number;
        cache?: RequestCache;
    }): Promise<any> {
        try {
            await fetch(
                `${NEXT_PUBLIC_API_URL}/api/history/save/view/${bookId}/${chapterNumber}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } catch (error) {}
    }

    async getHistoryUser({
        token,
        cache,
        query,
        revalidate,
    }: {
        token: string;
        query?: string;
        revalidate?: number;
        cache?: RequestCache;
    }): Promise<any> {
        try {
            const historyRes = await fetch(
                `${NEXT_PUBLIC_API_URL}/api/history/chapter${
                    query ? query : ""
                }`,
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
            const history = await historyRes.json();
            return history;
        } catch (error) {
            return {
                success: false,
                message: "error history successful",
                error: error,
            };
        }
    }
}

const historyService = new HistoryService();

export default historyService;
