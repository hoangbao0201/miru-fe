import axios from "axios";
import { Env } from "@/config/Env";

const { NEXT_PUBLIC_API_URL } = Env;

export interface GetTagsProps {
    tagId: number;
    name: string;
    slug: string;
    _count: {
        blogTags: number;
    };
}
class AuthService {
    async getCurrentUser({ token }: { token: string }): Promise<any> {
        try {
            const userRes = await fetch(`${NEXT_PUBLIC_API_URL}/api/auth/me`, {
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

    async login(data: {
        accout: string;
        password: string;
        tokenVerify: string;
    }): Promise<any> {
        try {
            const { accout, password, tokenVerify } = data;
            const tagsRes = await axios.post(
                `${NEXT_PUBLIC_API_URL}/api/auth/login`,
                {
                    accout: accout,
                    password: password,
                    tokenVerify: tokenVerify,
                }
            );
            return tagsRes.data;
        } catch (error) {
            return {
                success: false,
                message: "Error",
                error: error,
            };
        }
    }
    async loginWithToken(token: string): Promise<any> {
        try {
            const loginRes = await fetch(
                `${NEXT_PUBLIC_API_URL}/api/auth/login/token`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    cache: "no-store",
                }
            );
            const login = await loginRes.json();
            return login;
        } catch (error) {
            return {
                success: false,
                message: "Login error",
                error: error,
            };
        }
    }
    async register(data: {
        tokenVerify: string;
        name: string;
        email: string;
        password: string;
    }): Promise<any> {
        try {
            const { name, email, password, tokenVerify } = data;
            const registerRes = await axios.post(
                `${NEXT_PUBLIC_API_URL}/api/auth/register`,
                {
                    name: name,
                    email: email,
                    password: password,
                    tokenVerify: tokenVerify,
                }
            );
            return registerRes.data;
        } catch (error) {
            return {
                success: false,
                message: "Error",
                error: error,
            };
        }
    }
    async refreshToken(token: string): Promise<any> {
        try {
            const loginRes = await fetch(
                NEXT_PUBLIC_API_URL + "/api/auth/refresh",
                {
                    method: "POST",
                    headers: {
                        authorization: `Refresh ${token}`,
                    },
                }
            );

            const login = await loginRes.json();
            return login;
        } catch (error) {
            return {
                success: false,
                message: "Error",
                error: error,
            };
        }
    }
}

const authService = new AuthService();

export default authService;
