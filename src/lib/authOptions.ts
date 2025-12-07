import { JWT } from "next-auth/jwt";
import { NextAuthOptions } from "next-auth";

import { Env } from "@/config/Env";
import authService from "@/services/auth.services";
import CredentialsProvider from "next-auth/providers/credentials";
import { GetUserSessionProps } from "@/services/user.services";

const { NEXT_PUBLIC_API_URL, NEXTAUTH_SECRET } = Env

async function refreshToken(token: JWT): Promise<JWT> {
    try {
        const res = await fetch(NEXT_PUBLIC_API_URL + "/api/auth/refresh-token", {
            method: "POST",
            headers: {
                authorization: `Bearer ${token.backendTokens.refreshToken}`,
            },
        });

        if (!res.ok) {
            const response = await res.json();
            if (response?.message === "UNAUTHORIZED") {
                throw new Error("UNAUTHORIZED");
            }
            if (response?.message === "ACCOUNT_BANNED") {
                throw new Error("ACCOUNT_BANNED");
            }
            throw new Error("Network error or unexpected response");
        }

        const response = await res.json();
        if (!response || !response?.success) {
            throw new Error("Server error");
        }

        return response?.data;
    } catch (error) {
        throw error;
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "login-basic",
            name: "Username And Password And TokenVerify",
            credentials: {
                accout: {
                    label: "Accout",
                    type: "text",
                    placeholder: "",
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "",
                },
                tokenVerify: {
                    label: "Token Verify",
                    type: "tokenVerify",
                    placeholder: "",
                },
            },
            async authorize(credentials, req) {
                if (
                    !credentials?.accout ||
                    !credentials?.password ||
                    !credentials?.tokenVerify
                )
                    return null;
                const { accout, password, tokenVerify } = credentials;

                const loginRes = await authService.login({
                    accout,
                    password,
                    tokenVerify,
                });
                if (!loginRes.success) {
                    throw new Error(loginRes?.message || "Server xảy ra lỗi!");
                }

                const fullUser = loginRes.data;
                return fullUser;
            },
        }),
        CredentialsProvider({
            id: "login-token",
            name: "Token",
            credentials: {
                token: {
                    label: "Token",
                    type: "text",
                    placeholder: "",
                },
            },
            async authorize(credentials, req) {
                if (!credentials?.token) return null;
                const { token } = credentials;
                const loginRes = await authService.loginWithToken(token);

                if (!loginRes.success) {
                    throw new Error(loginRes?.message || "Server xảy ra lỗi!");
                }

                const fullUser = loginRes.data;
                return fullUser;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }): Promise<JWT> {
            // Khi session được cập nhật từ phía client (ví dụ: update)
            if (trigger === "update") {
                try {
                    const refreshedToken = await refreshToken(token);
                    return refreshedToken;
                } catch (error) {
                    console.error("Failed to update user session:", error);
                }

                return token;
            }

            // Khi user vừa đăng nhập
            if (user && trigger === "signIn") {
                return {
                    ...token,
                    ...user,
                };
            }

            // Kiểm tra token có hết hạn không
            const isTokenExpired =
                token?.backendTokens?.expiresIn &&
                Date.now() >= token.backendTokens.expiresIn;

            if (isTokenExpired) {
                try {
                    const refreshedToken = await refreshToken(token);
                    return refreshedToken;
                } catch (error: unknown) {
                    const err = error as Error;

                    if (err.message === "UNAUTHORIZED") {
                        console.warn(
                            "❗Token expired and unauthorized during refresh."
                        );
                        return {
                            ...token,
                            error: "RefreshAccessTokenError",
                        };
                    }

                    if (err.message === "ACCOUNT_BANNED") {
                        console.warn("🚫 Account is banned.");
                        return {
                            ...token,
                            error: "RefreshAccessTokenError",
                        };
                    }

                    console.error(
                        "Unexpected error during token refresh:",
                        error
                    );
                    return token;
                }
            }

            // Token vẫn còn hạn, không cần làm gì
            return token;
        },
        async session({ token, session }) {
            session.error = token?.error;
            session.backendTokens = token.backendTokens;

            session.user = {
                ...token.user,
            };

            return session;
        },
    },
    secret: NEXTAUTH_SECRET,
};
