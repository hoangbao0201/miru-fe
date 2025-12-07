import { Env } from "@/config/Env";

const { NEXT_PUBLIC_API_URL } = Env

export enum UserRole {
    ADMIN = "ADMIN",
    GUEST = "GUEST",
    EDITOR = "EDITOR",
    CREATOR = "CREATOR",
}

export type UserRoleType = keyof typeof UserRole;

export enum CategoryItemEnum {
    ACCESSORY = "ACCESSORY",
    AVATAR_OUTLINE = "AVATAR_OUTLINE",
}

interface IItem {
    name: string;
    itemId: number;
    imageSmall: string;
    imagePreview: string;
    imageOriginalUrl: string;
    category: CategoryItemEnum;
}

export enum StrengthMappingEnum {
    TUTIEN = "TUTIEN",
    CAP = "CAP",
}

export interface GetUserDetailProps {
    name: string;
    rank: number;
    item: number;
    email: string;
    userId: number;
    banned: number;
    role: UserRole;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
    username: string;
    avatarUrl: string | null;
    description: string | null;

    equippedItem: {
        accessory: Omit<IItem, "imageSmall" | "imagePreview"> | null;
        avatarOutline: Omit<IItem, "imageSmall" | "imagePreview"> | null;
    };
    ownedItems?: IItem[];
    strengthMapping: StrengthMappingEnum;
}

export interface IGetTopRichestUsers
    extends Pick<
        GetUserDetailProps,
        | "name"
        | "rank"
        | "role"
        | "userId"
        | "balance"
        | "username"
        | "avatarUrl"
        | "equippedItem"
        | "strengthMapping"
    > {}

export interface IGetTopRankUsers
    extends Pick<
        GetUserDetailProps,
        | "name"
        | "rank"
        | "role"
        | "banned"
        | "userId"
        | "balance"
        | "username"
        | "avatarUrl"
        | "equippedItem"
        | "strengthMapping"
    > {}

export interface GetUserSessionProps
    extends Pick<
        GetUserDetailProps,
        | "role"
        | "banned"
        | "userId"
        | "username"
    > {}

export interface IGetUserMe
    extends Pick<
        GetUserDetailProps,
        | "name"
        | "rank"
        | "role"
        | "userId"
        | "balance"
        | "username"
        | "createdAt"
        | "updatedAt"
        | "avatarUrl"
        | "equippedItem"
        | "strengthMapping"
    > {}

export interface IDataUser
    extends Pick<
        GetUserDetailProps,
        | "userId"
        | "role"
        | "name"
        | "rank"
        | "banned"
        | "username"
        | "avatarUrl"
        | "createdAt"
        | "equippedItem"
        | "strengthMapping"
    > {}

export type AttendanceHistoryType = {
    month: number;
    year: number;
    attendancePerDay: { [key: number]: boolean };
};

class UserServices {
    
    async getUserSession({ token }: { token: string }): Promise<any> {
        try {
            const userRes = await fetch(`${NEXT_PUBLIC_API_URL}/api/users/session`, {
                method: "GET",
                cache: "no-store",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
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

    async getUserDetail({
        username,
        cache,
        revalidate,
    }: {
        username: string;
        cache?: RequestCache;
        revalidate?: number;
    }): Promise<any> {
        try {
            const userRes = await fetch(
                `${NEXT_PUBLIC_API_URL}/api/users/${username}`,
                {
                    method: "GET",
                    cache: cache,
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

    async findOne({
        username,
        cache,
        revalidate,
    }: {
        username: string;
        cache?: RequestCache;
        revalidate?: number;
    }): Promise<any> {
        try {
            const userRes = await fetch(
                `${NEXT_PUBLIC_API_URL}/api/users/${username}`,
                {
                    method: "GET",
                    cache: cache,
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

    async banUser({ token }: { token: string }): Promise<any> {
        try {
            const userRes = await fetch(`${NEXT_PUBLIC_API_URL}/api/users/b`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                cache: "no-store",
            });
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

    async getAttendanceHistory({ token }: { token: string }): Promise<any> {
        try {
            const userRes = await fetch(
                `${NEXT_PUBLIC_API_URL}/api/users/attendance`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    cache: "no-store",
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

    async markAttendance({ token }: { token: string }): Promise<any> {
        try {
            const userRes = await fetch(
                `${NEXT_PUBLIC_API_URL}/api/users/attendance`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    cache: "no-store",
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

    async updateName({
        name,
        token,
    }: {
        name: string;
        token: string;
    }): Promise<any> {
        try {
            const userRes = await fetch(
                `${NEXT_PUBLIC_API_URL}/api/users/update/name`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ name: name }),
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

    async updateAvatar({
        avatar,
        token,
    }: {
        avatar: string;
        token: string;
    }): Promise<any> {
        try {
            const userRes = await fetch(
                `${NEXT_PUBLIC_API_URL}/api/users/update/avatar`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ avatar: avatar }),
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

    async getTopRankUsersService({
        cache,
        revalidate,
    }: {
        cache?: RequestCache;
        revalidate?: number;
    }): Promise<any> {
        try {
            const usersRes = await fetch(`${NEXT_PUBLIC_API_URL}/api/users/top-rank?take=6`, {
                method: "GET",
                cache: cache,
                next: {
                    revalidate: revalidate,
                },
            });
            const users = await usersRes.json();
            return users;
        } catch (error) {
            return {
                success: false,
                message: "Error",
                error: error,
            };
        }
    }

    async getTopRichestUsersService({
        cache,
        revalidate,
    }: {
        cache?: RequestCache;
        revalidate?: number;
    }): Promise<any> {
        try {
            const usersRes = await fetch(`${NEXT_PUBLIC_API_URL}/api/users/top-richest?take=6`, {
                method: "GET",
                cache: cache,
                next: {
                    revalidate: revalidate,
                },
            });
            const users = await usersRes.json();
            return users;
        } catch (error) {
            return {
                success: false,
                message: "Error",
                error: error,
            };
        }
    }
}

const userService = new UserServices();

export default userService;
