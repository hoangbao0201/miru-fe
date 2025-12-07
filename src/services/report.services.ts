import { Env } from "@/config/Env";
import { BookStorageStatusEnum } from "./creator.services";

const { NEXT_PUBLIC_API_URL } = Env;

export interface IListReports {
    count: number;
    bookId: number;
    chapterNumber: number;
    updatedAt: Date;
    createdAt: Date;
    chapter: {
        num: string;
        data: string[];
        chapterNumber: number;
    };
    book: {
        slug: string;
        type: string;
        title: string;
        bookId: number;
        thumbnail: string;
        storage: BookStorageStatusEnum;
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
}

export const getAllReportsChapterService = async ({
    token,
    cache,
    query,
    revalidate,
}: {
    token: string;
    query?: string;
    revalidate?: number;
    cache?: RequestCache;
}): Promise<any> => {
    try {
        const historyRes = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/reports${query ? query : ""}`,
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
};

export const reportChapterService = async ({
    token,
    bookId,
    chapterNumber,
}: Pick<IListReports, "bookId" | "chapterNumber"> & {
    token: string;
}): Promise<any> => {
    try {
        const reportsRes = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/reports/chapter`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    bookId: bookId,
                    chapterNumber: chapterNumber,
                }),
            }
        );
        const report = await reportsRes.json();
        return report;
    } catch (error) {
        return {
            success: false,
            message: "error update report",
            error: error,
        };
    }
};

export const deleteReportChapterService = async ({
    token,
    bookId,
    chapterNumber,
}: Pick<IListReports, "bookId" | "chapterNumber"> & {
    token: string;
}): Promise<any> => {
    try {
        const reportsRes = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/reports/chapter`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    bookId: bookId,
                    chapterNumber: chapterNumber,
                }),
            }
        );
        const report = await reportsRes.json();
        return report;
    } catch (error) {
        return {
            success: false,
            message: "error update report",
            error: error,
        };
    }
};
