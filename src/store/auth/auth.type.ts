import { AxiosResponse } from "axios";
import { IGetUserMe } from "@/services/user.services";

enum StrengthMappingEnum {
    TUTIEN = "TUTIEN",
    CAP = "CAP",
}

enum CategoryItemEnum {
    ACCESSORY = "ACCESSORY",
    AVATAR_OUTLINE = "AVATAR_OUTLINE",
}

interface IItemDetail {
    name: string;
    itemId: number;
    imageSmall: string;
    imagePreview: string;
    imageOriginalUrl: string;
    category: CategoryItemEnum;
}

enum UserRole {
    admin = "admin",
    guest = "guest",
    editor = "editor",
    creator = "creator",
}

interface IUserDetail {
    name: string;
    email: string;
    role: UserRole;
    userId: number;
    username: string;
    rank: number;
    banned: number;
    balance: number;
    avatarUrl?: string;
    description?: string;
    strengthMapping: StrengthMappingEnum;
    equippedItem: {
        accessory: IItemDetail;
        avatarOutline: IItemDetail;
    };
    ownedItems: IItemDetail[];
    createdAt: Date;
    updatedAt: Date;
}

interface IUserSession {
    userId: number;
    name: string;
    rank: number;
    banned: number;
    username: string;
    avatarUrl: string | null;
    role: UserRole;
    strengthMapping: StrengthMappingEnum;
    equippedItem: {
        accessory: IItemDetail;
        avatarOutline: IItemDetail;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthState {
    loading: boolean;
    error?: string;
    user?: IGetUserMe;
}

export type ParamLogin = {
    accout: string;
    password: string;
    // token: string;
    secret: string;
};

export type GetCurrentUserResponse = {
    success: boolean;
    user: IGetUserMe;
    error?: string;
};
