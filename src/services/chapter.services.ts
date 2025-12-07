import axios from "axios";
import { Env } from "@/config/Env";

const { NEXT_PUBLIC_API_URL, NEXT_PUBLIC_API_UPLOAD_URL } = Env

export enum IChapterStorage {
    WAITING = "WAITING",
    ERROR = "ERROR",
    MAIN = "MAIN",
}

export type ImageProtectedType = {
    width: number;
    height: number;
    imageUrl: string;
    drm_data?: string;
};

export interface GetChapterDetailProps {
    num: string;
    title: string;
    bookId: number;
    isPrivate: boolean;
    isProtected: boolean;
    chapterNumber: number;
    createdAt: Date;
    updatedAt: Date;
    servers: {
        cloud: "my" | "tiktok" | "naver";
        content: ImageProtectedType[];
    }[];
    book: {
        title: string;
        slug: string;
        thumbnail: string;
        previewImage: string;
        altTitles: string;
        author: { name: string } | null;
        postedBy: {
            name: string;
            username: string;
        };
    };
}
export interface GetChaptersBasicProps {
    num: string;
    chapterNumber: number;
}
export interface GetChaptersAdvancedProps {
    num: string;
    title: string;
    viewsCount: number;
    chapterNumber: number;
    thumbnail: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface GetChaptersSeoProps {
    bookId: number;
    chapterNumber: number;
    book: {
        slug: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
export interface IProtectedImages {
    width: number;
    height: number;
    imageUrl: string;
}
export interface IGetListChaptersCreator {
    num: string;
    bookId: number;
    createdAt: string;
    updatedAt: string;
    title: string | null;
    chapterNumber: number;
    storage: IChapterStorage;
    thumbnail: string | null;
    // book: {
    //     slug: string;
    //     title: string;
    // };
    data: string[];
}

class ChapterService {
    async getDataChapterByHtmlService({
        data,
        token,
    }: {
        token: string;
        data: FormData;
    }): Promise<any> {
        const dataRes = await axios.post(
            `${NEXT_PUBLIC_API_URL}/api/crawl/data/chapter/by-html`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        return dataRes.data;
    };

    // ADMIN
    async fixChapterByUrl({
        bookId,
        chapterNumber,
        token,
    }: {
        bookId: number;
        chapterNumber: number;
        token: string;
    }): Promise<any> {
        try {
            const chaptersRes = await fetch(
                `${NEXT_PUBLIC_API_URL}/api/chapters/fix/by-url`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        bookId: bookId,
                        chapterNumber: chapterNumber,
                    }),
                }
            );
            const chapters = await chaptersRes.json();
            return chapters;
        } catch (error) {
            return {
                success: false,
                message: "error chapters successful",
                error: error,
            };
        }
    }

    async fixChapterBeebook({
        bookId,
        chapterNumber,
        token,
    }: {
        bookId: number;
        chapterNumber: number;
        token: string;
    }): Promise<any> {
        try {
            const chaptersRes = await fetch(
                `${NEXT_PUBLIC_API_URL}/api/chapters/fix/beebook`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        bookId: bookId,
                        chapterNumber: chapterNumber,
                    }),
                }
            );
            const chapters = await chaptersRes.json();
            return chapters;
        } catch (error) {
            return {
                success: false,
                message: "error chapters successful",
                error: error,
            };
        }
    }

    async findAllChaptersAdmin({
        query,
        token,
    }: {
        query?: string;
        token: string;
    }): Promise<any> {
        try {
            const chaptersRes = await fetch(
                `${NEXT_PUBLIC_API_URL}/api/chapters/admin${query ? query : ""}`,
                {
                    method: "GET",
                    cache: "no-store",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            const chapters = await chaptersRes.json();
            return chapters;
        } catch (error) {
            return {
                success: false,
                error: error,
            };
        }
    }

    async restoreChapterAdmin({
        bookId,
        chapterNumber,
        token,
    }: {
        bookId: number;
        chapterNumber: number;
        token: string;
    }): Promise<any> {
        try {
            const res = await fetch(
                `${NEXT_PUBLIC_API_URL}/api/chapters/admin/restore`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        bookId,
                        chapterNumber,
                    }),
                }
            );
            const data = await res.json();
            return data;
        } catch (error) {
            return {
                success: false,
                error: error,
            };
        }
    }

    async hardDeleteChapterAdmin({
        bookId,
        chapterNumber,
        token,
    }: {
        bookId: number;
        chapterNumber: number;
        token: string;
    }): Promise<any> {
        try {
            const res = await fetch(
                `${NEXT_PUBLIC_API_URL}/api/chapters/admin/hard-delete`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        bookId,
                        chapterNumber,
                    }),
                }
            );
            const data = await res.json();
            return data;
        } catch (error) {
            return {
                success: false,
                error: error,
            };
        }
    }

    async createChapterByUrls({
        data,
        token,
    }: {
        data: {
            urls: string[];
            num: string;
            bookId: number;

            my: boolean;
            tiktok: boolean;
            naver: boolean;
        };
        token: string;
    }): Promise<any> {
        try {
            const { num, bookId, urls, my, naver, tiktok } = data;
            const chapterRes = await fetch(
                `${NEXT_PUBLIC_API_URL}/api/chapters/create/urls`,
                {
                    method: "POST",
                    cache: "no-store",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        num,
                        bookId,
                        urls,
                        my,
                        naver,
                        tiktok,
                    }),
                }
            );
            const chapter = await chapterRes.json();
            return chapter;
        } catch (error) {
            return {
                success: false,
                error: error,
            };
        }
    }

    async uploadImageCloudCacheV1Service({
        file,
        token,
        onProgress,
        bookId,
        chapterNumber,
        cacheId,
    }: {
        token: string;
        file: FormData;
        onProgress?: (percent: number) => void;
        bookId: number;
        chapterNumber: number;
        cacheId: string;
    }): Promise<any> {
        try {
            let lastReportedPercent = -1;
            const url = new URL(
                `${NEXT_PUBLIC_API_UPLOAD_URL}/api/chapters/upload/images/cloud-cache`
            );
            url.searchParams.append("bookId", String(bookId));
            url.searchParams.append("chapterNumber", String(chapterNumber));
            url.searchParams.append("cacheId", cacheId);
            const response = await axios.post(
                url.toString(),
                file,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    onUploadProgress: (progressEvent) => {
                    if (onProgress && progressEvent.total) {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);

                        if (percent % 10 === 0 && percent !== lastReportedPercent) {
                            lastReportedPercent = percent;
                            onProgress(percent);
                        }
                    }
                }

                },
            );
            return response.data;
        } catch (error: any) {
            console.error("Upload failed:", error?.response?.data || error.message);
            throw new Error("Không thể upload ảnh. Vui lòng thử lại.");
        }
    }

    async uploadImageCloudCacheV2Service({
        file,
        token,
        onProgress,
        bookId,
        chapterNumber,
        cacheId,
    }: {
        token: string;
        file: FormData;
        onProgress?: (percent: number) => void;
        bookId: number;
        chapterNumber: number;
        cacheId: string;
    }): Promise<any> {
        try {
            let lastReportedPercent = -1;
            const response = await axios.post(
                `${NEXT_PUBLIC_API_URL}/api/chapters/upload/images/cloud-cache/${bookId}/${chapterNumber}?cacheId=${cacheId}`,
                file,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    onUploadProgress: (progressEvent) => {
                    if (onProgress && progressEvent.total) {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);

                        if (percent % 10 === 0 && percent !== lastReportedPercent) {
                            lastReportedPercent = percent;
                            onProgress(percent);
                        }
                    }
                }

                },
            );
            return response.data;
        } catch (error: any) {
            console.error("Upload failed:", error?.response?.data || error.message);
            throw new Error("Không thể upload ảnh. Vui lòng thử lại.");
        }
    }

    // USER
    async findOne({
        chapterNumber,
        bookId,
        revalidate,
        cache,
    }: {
        chapterNumber: number;
        bookId: number;
        revalidate?: number;
        cache?: RequestCache;
    }): Promise<any> {
        try {
            const chapterRes = await fetch(
                `${NEXT_PUBLIC_API_URL}/api/chapters/${chapterNumber}/${bookId}`,
                {
                    method: "GET",
                    cache: cache,
                    next: {
                        revalidate: revalidate,
                    },
                }
            );
            const chapter = await chapterRes.json();
            return chapter;
        } catch (error) {
            return {
                success: false,
                message: "Error",
                error: error,
            };
        }
    }

    async findAllChaptersByBookId({
        bookId,
        query,
        revalidate,
        cache,
    }: {
        bookId: number;
        query: string;
        revalidate?: number;
        cache?: RequestCache;
    }): Promise<any> {
        try {
            const chaptersRes = await fetch(
                `${NEXT_PUBLIC_API_URL}/api/chapters/${bookId}${query ? query : ""}`,
                {
                    method: "GET",
                    cache: cache,
                    next: {
                        revalidate: revalidate,
                    },
                }
            );
            const chapters = await chaptersRes.json();
            return chapters;
        } catch (error) {
            return {
                success: false,
                message: "error chapters successful",
                error: error,
            };
        }
    }

    // SEO
    async findAllSeo({
        revalidate,
        cache,
        query,
    }: {
        query?: string;
        revalidate?: number;
        cache?: RequestCache;
    }): Promise<any> {
        try {
            const chaptersRes = await axios.get(
                `${NEXT_PUBLIC_API_URL}/api/chapters/seo${query ? query : ""}`
                // {
                //     method: "GET",
                //     cache: cache,
                //     next: {
                //         revalidate: revalidate,
                //     },
                // }
            );
            // const chapters = await chaptersRes.json();
            return chaptersRes?.data;
        } catch (error) {
            return {
                success: false,
                message: "error get books",
                error: error,
            };
        }
    }

    async findAllSeoCount(): Promise<any> {
        try {
            const booksRes = await axios.get(
                `${NEXT_PUBLIC_API_URL}/api/chapters/seo/count`
            );

            return booksRes?.data;
        } catch (error) {
            return {
                success: false,
                message: "error get books",
                error: error,
            };
        }
    }
}

const chapterService = new ChapterService();

export default chapterService;
