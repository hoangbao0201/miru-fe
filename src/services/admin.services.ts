import { Env } from "@/config/Env";
import { GetBookProps } from "./book.services";
import { IMetaPage } from "@/common/data.types";

const { NEXT_PUBLIC_TITLE_SEO, NEXT_PUBLIC_API_URL } = Env;

export interface AdminGetUsersProps {
    userId: number;
    name: string;
    username: string;
    email: string;
    rank: number;
}
export interface AdminGetBooksProps extends GetBookProps {
    type: string;
    chapters: { num: string; chapterNumber: number; createdAt: Date }[];
}

export interface AdminBookItem {
    bookId: number;
    title: string;
    category: string;
    isDelete: boolean;
    covers?: { url: string }[];
    createdAt: Date;
    updatedAt: Date;
}

export interface AdminBooksResponse {
    success: boolean;
    result: AdminBookItem[];
    meta: IMetaPage;
}

class AdminService {
    // User
    async getListUserManager({
        query = "",
        cache,
        revalidate,
        token,
    }: {
        query: string;
        token: string;
        cache?: RequestCache;
        revalidate?: number;
    }): Promise<any> {
        try {
            const userRes = await fetch(
                `${NEXT_PUBLIC_API_URL}/api/admin/users${query}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    cache: cache || "no-store",
                    next: {
                        revalidate: revalidate,
                    },
                }
            );
            const user = await userRes.json();
            return user;
        } catch (error) {
            return {
                success: false,
                message: "Error",
                error: error,
            };
        }
    }

    async changeUserRole({
        userId,
        roleName,
        token,
    }: {
        userId: number;
        roleName: string;
        token: string;
    }): Promise<any> {
        try {
            const res = await fetch(
                `${NEXT_PUBLIC_API_URL}/api/admin/users/role`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ userId, roleName }),
                }
            );
            const data = await res.json();
            return data;
        } catch (error) {
            return {
                success: false,
                message: "Error changing user role",
                error: error,
            };
        }
    }

    // Book
    async updateImageBook({
        bookId,
        url,
        token,
    }: {
        bookId: number;
        url: string;
        token: string;
    }): Promise<any> {
        try {
            const bookRes = await fetch(
                `${NEXT_PUBLIC_API_URL}/api/admin/update/image/book`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ bookId, url }),
                }
            );
            const bookR = await bookRes.json();
            return bookR;
        } catch (error) {
            return {
                success: false,
                message: "error update book",
                error: error,
            };
        }
    }

    async updateBook({
        book,
        token,
    }: {
        book?: {
            bookId: number;
            title?: string;
            altTitles?: string;
            raw?: string;
            isFeatured?: boolean;
        };
        token: string;
    }): Promise<any> {
        try {
            const bookRes = await fetch(`${NEXT_PUBLIC_API_URL}/api/admin/book`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ...book }),
            });
            const bookR = await bookRes.json();
            return bookR;
        } catch (error) {
            return {
                success: false,
                message: "error update book",
                error: error,
            };
        }
    }

    async changeCloudBook({
        bookId,
        email,
        token,
    }: {
        bookId: number;
        email: string;
        token: string;
    }): Promise<any> {
        try {
            const bookRes = await fetch(
                `${NEXT_PUBLIC_API_URL}/api/admin/change/cloud/book`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        bookId: bookId,
                        email: email,
                    }),
                }
            );
            const bookR = await bookRes.json();
            return bookR;
        } catch (error) {
            return {
                success: false,
                message: "error update book",
                error: error,
            };
        }
    }

    async changeCloudChapters({
        take,
        bookId,
        email,
        token,
    }: {
        take: number;
        bookId: number;
        email: string;
        token: string;
    }): Promise<any> {
        try {
            const bookRes = await fetch(
                `${NEXT_PUBLIC_API_URL}/api/admin/change/cloud/chapters`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        bookId: bookId,
                        email: email,
                        take: take,
                    }),
                }
            );
            const bookR = await bookRes.json();
            return bookR;
        } catch (error) {
            return {
                success: false,
                message: "error update book",
                error: error,
            };
        }
    }

    async deleteBook({
        bookId,
        token,
    }: {
        bookId: number;
        token: string;
    }): Promise<any> {
        try {
            const bookRes = await fetch(
                `${NEXT_PUBLIC_API_URL}/api/admin/books/${bookId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const book = await bookRes.json();
            return book;
        } catch (error) {
            return {
                success: false,
                message: "error update book",
                error: error,
            };
        }
    }

    async getListBooksAdmin({
        query = "",
        token,
    }: {
        query: string;
        token: string;
    }): Promise<AdminBooksResponse> {
        try {
            const res = await fetch(
                `${NEXT_PUBLIC_API_URL}/api/admin/books${query}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    cache: "no-store",
                }
            );
            const data = await res.json();
            return data;
        } catch (error) {
            return {
                success: false,
                result: [],
                meta: null as any,
            };
        }
    }

    async restoreBookAdmin({
        bookId,
        token,
    }: {
        bookId: number;
        token: string;
    }): Promise<any> {
        try {
            const res = await fetch(
                `${NEXT_PUBLIC_API_URL}/api/admin/books/restore`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ bookId }),
                }
            );
            const data = await res.json();
            return data;
        } catch (error) {
            return {
                success: false,
                message: "error restore book",
                error: error,
            };
        }
    }

    async hardDeleteBookAdmin({
        bookId,
        token,
    }: {
        bookId: number;
        token: string;
    }): Promise<any> {
        try {
            const res = await fetch(
                `${NEXT_PUBLIC_API_URL}/api/admin/books/hard-delete`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ bookId }),
                }
            );
            const data = await res.json();
            return data;
        } catch (error) {
            return {
                success: false,
                message: "error hard delete book",
                error: error,
            };
        }
    }

    async deleteAccoutCloud({
        name,
        token,
    }: {
        name: string;
        token: string;
    }): Promise<any> {
        try {
            const accoutRes = await fetch(
                `${NEXT_PUBLIC_API_URL}/api/admin/accout/cloud/${NEXT_PUBLIC_TITLE_SEO}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const accout = await accoutRes.json();
            return accout;
        } catch (error) {
            return {
                success: false,
                message: "error update book",
                error: error,
            };
        }
    }

    async getDataDashboard({ token }: { token: string }): Promise<any> {
        try {
            const viewsRes = await fetch(
                `${NEXT_PUBLIC_API_URL}/api/admin/data/dashboard`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const views = await viewsRes.json();
            return views;
        } catch (error) {
            return {
                success: false,
                message: "error update book",
                error: error,
            };
        }
    }

    async findAllAccoutCloud({ token }: { token: string }): Promise<any> {
        try {
            const usersRes = await fetch(
                `${NEXT_PUBLIC_API_URL}/api/admin/accout/cloud`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const users = await usersRes.json();
            return users;
        } catch (error) {
            return {
                success: false,
                message: "error update book",
                error: error,
            };
        }
    }

    async createAccoutCloud({
        accout,
        token,
    }: {
        accout: { email: string; name: string; key: string; secret: string };
        token: string;
    }): Promise<any> {
        try {
            const usersRes = await fetch(
                `${NEXT_PUBLIC_API_URL}/api/admin/accout/cloud`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        ...accout,
                    }),
                }
            );
            const users = await usersRes.json();
            return users;
        } catch (error) {
            return {
                success: false,
                message: "error update book",
                error: error,
            };
        }
    }
}

const adminService = new AdminService();

export default adminService;
