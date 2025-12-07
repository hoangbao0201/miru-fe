import { Env } from "@/config/Env";
import { headers } from "next/headers";

export default async function getDomainConfig() {
    const headersList = await headers();
    const protocol = headersList.get("x-forwarded-proto") || "https";
    const host = headersList.get("host");

    const appUrl = Env.NODE_ENV === 'production' ? `${protocol}://${host}` : Env.NEXT_PUBLIC_APP_URL;
    const apiUrl = Env.NODE_ENV === 'production' ? `${protocol}://api.${host}` : Env.NEXT_PUBLIC_API_URL;

    return {
        appUrl: appUrl as string,
        apiUrl: apiUrl as string,
    };
}
