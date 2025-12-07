import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import { GetUserSessionProps } from "@/services/user.services";

declare module "next-auth" {
    interface Session {
        error?: string
        user: GetUserSessionProps;
        backendTokens: {
            accessToken: string;
            refreshToken: string;
            expiresIn: number;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        error?: string
        user: GetUserSessionProps;
        backendTokens: {
            accessToken: string;
            refreshToken: string;
            expiresIn: number;
        };
    }
}
