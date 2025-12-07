export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: any;
}

class InstanceFetch {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async makeRequest<T = any>(
        endpoint: string,
        options: RequestInit & { token: string }
    ): Promise<ApiResponse<T>> {
        try {
            const { token, ...fetchOptions } = options;

            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...fetchOptions,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    ...fetchOptions.headers,
                },
            });

            const data = await response.json();
            return data;
        } catch (error) {
            return {
                success: false,
                message: `Request failed for ${endpoint}`,
                error,
            };
        }
    }

    async get<T = any>(
        endpoint: string,
        token: string
    ): Promise<ApiResponse<T>> {
        return this.makeRequest<T>(endpoint, {
            method: "GET",
            token,
        });
    }

    async post<T = any>(
        endpoint: string,
        body: any,
        token: string
    ): Promise<ApiResponse<T>> {
        return this.makeRequest<T>(endpoint, {
            method: "POST",
            body: JSON.stringify(body),
            token,
        });
    }

    async put<T = any>(
        endpoint: string,
        body: any,
        token: string
    ): Promise<ApiResponse<T>> {
        return this.makeRequest<T>(endpoint, {
            method: "PUT",
            body: JSON.stringify(body),
            token,
        });
    }

    async delete<T = any>(
        endpoint: string,
        token: string
    ): Promise<ApiResponse<T>> {
        return this.makeRequest<T>(endpoint, {
            method: "DELETE",
            token,
        });
    }
}

const instanceFetch = new InstanceFetch(process.env.NEXT_PUBLIC_API_URL || "");

export default instanceFetch;