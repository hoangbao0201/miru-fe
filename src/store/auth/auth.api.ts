import { getSession } from "next-auth/react";

import { instanceAxios } from "@/config/axios";
import { GetCurrentUserResponse } from "./auth.type";

const auth = {
    async getCurrentUser(): Promise<GetCurrentUserResponse> {
        const url = "/api/auth/me";
        const session = await getSession();
        
        if (session?.backendTokens?.accessToken) {
            instanceAxios.defaults.headers.common['Authorization'] = 
                `Bearer ${session.backendTokens.accessToken}`;
        }
        return instanceAxios.get(url);
    },
};

export default auth;
