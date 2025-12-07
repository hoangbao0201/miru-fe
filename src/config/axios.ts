import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { Env } from "@/config/Env";
import { getSession, signOut } from "next-auth/react";

export const baseURL = Env.NEXT_PUBLIC_API_URL;
export const instanceAxios: AxiosInstance = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    // withCredentials: true,
});

// ENHANCED: Add request interceptor to automatically add token
instanceAxios.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        try {
            const session = await getSession();
            
            if (session?.backendTokens?.accessToken) {
                if (!config.headers) {
                    config.headers = {} as any;
                }
                config.headers.Authorization = `Bearer ${session.backendTokens.accessToken}`;
            }
        } catch (error) {
            console.error("Error adding auth token:", error);
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ENHANCED: Add response interceptor for token refresh
instanceAxios.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const session = await getSession();
                
                if (session?.backendTokens?.refreshToken) {
                    // Try to refresh token via NextAuth
                    const refreshResponse = await axios.post(`${baseURL}/auth/refresh`, {
                        refreshToken: session.backendTokens.refreshToken,
                    });
                    
                    if (refreshResponse.data.accessToken) {
                        // Update the request with new token
                        originalRequest.headers.Authorization = 
                            `Bearer ${refreshResponse.data.accessToken}`;
                        
                        // Retry the original request
                        return instanceAxios(originalRequest);
                    }
                }
            } catch (refreshError) {
                // Refresh failed, sign out user
                console.error("Token refresh failed:", refreshError);
                await signOut({ redirect: true });
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);