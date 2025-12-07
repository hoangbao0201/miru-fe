import { Env } from "@/config/Env";
import { CategoryItemEnum } from "./user.services";

const { NEXT_PUBLIC_API_URL } = Env

interface IItem  {
    name: string | null;
    price: number;
    itemId: number;
    imagePreview: string;
    imageOriginalUrl: string;
    category: CategoryItemEnum;
}

export interface IGetUserItems {
    itemId: number;
    userId: number;
    item: IItem;
    createdAt: Date;
    equippedItem: boolean;
}

export interface IGetItems {
    name: string | null;
    price: number;
    itemId: number;
    isOwned: boolean;
    imagePreview: string;
    equippedItem: boolean;
    imageOriginalUrl: string;
    category: CategoryItemEnum;
}

export const getItemsUserService = async ({
    query,
    token,
    cache,
    revalidate,
}: {
    query?: string;
    token: string
    revalidate?: number;
    cache?: RequestCache;
}): Promise<any> => {
    try {
        const itemsRes = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/items/user${query ? query : ""}`,
            {
                method: "GET",
                cache: cache,
                next: {
                    revalidate: revalidate,
                },
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const item = await itemsRes.json();
        return item;
    } catch (error) {
        return {
            error: error,
            success: false,
            message: "Error",
        };
    }

}

export const getItemsShopService = async ({
    query,
    token,
    cache,
    revalidate,
}: {
    query?: string;
    token: string
    revalidate?: number;
    cache?: RequestCache;
}): Promise<any> => {
    try {
        const itemsRes = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/items/shop${query ? query : ""}`,
            {
                method: "GET",
                cache: cache,
                next: {
                    revalidate: revalidate,
                },
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const item = await itemsRes.json();
        return item;
    } catch (error) {
        return {
            error: error,
            success: false,
            message: "Error",
        };
    }
}

export const postBuyItemsService = async ({
    itemId,
    token,
    cache,
    revalidate,
}: {
    itemId: number;
    token: string
    revalidate?: number;
    cache?: RequestCache;
}): Promise<any> => {
    try {
        const itemsRes = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/items/payments`,
            {
                method: "POST",
                cache: cache,
                next: {
                    revalidate: revalidate,
                },
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    itemId: itemId,
                }),
            },
        );
        const item = await itemsRes.json();
        return item;
    } catch (error) {
        return {
            error: error,
            success: false,
            message: "Error",
        };
    }
}

export const postEquilItemsService = async ({
    itemId,
    token,
    cache,
    revalidate,
}: {
    itemId: number;
    token: string
    revalidate?: number;
    cache?: RequestCache;
}): Promise<any> => {
    try {
        const itemsRes = await fetch(
            `${NEXT_PUBLIC_API_URL}/api/items/equip`,
            {
                method: "POST",
                cache: cache,
                next: {
                    revalidate: revalidate,
                },
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    itemId: itemId,
                }),
            },
        );
        const item = await itemsRes.json();
        return item;
    } catch (error) {
        return {
            error: error,
            success: false,
            message: "Error",
        };
    }
}
