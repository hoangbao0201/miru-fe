import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const host = req.headers.get("host")?.replace(/^www\./, "") || "";

    const appUrl = `${protocol}://${host}`;
    const apiUrl = `${protocol}://api.${host}`;

    console.log('test: ', {
        appUrl, apiUrl
    })

    // clone lại headers
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-app-url", appUrl);
    requestHeaders.set("x-api-url", apiUrl);

    // vừa forward vào request, vừa gắn response header
    const res = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
    res.headers.set("x-app-url", appUrl);
    res.headers.set("x-api-url", apiUrl);

    return res;
}
