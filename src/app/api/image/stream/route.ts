import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    const referer = searchParams.get("referer");

    try {
        if (!url) {
            return NextResponse.json({ success: false, message: "URL is required" }, { status: 400 });
        }

        // Fetch the image with custom headers
        const response = await axios.get(url, {
            responseType: "stream",
            headers: {
                referer: new URL(url).origin,
                "Sec-Ch-Ua":
                    '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
                "Sec-Ch-Ua-Mobile": "?0",
                "Sec-Ch-Ua-Platform": "Windows",
            },
        });

        // Create a new response with the streamed data
        const headers = new Headers();
        headers.set("Content-Type", response.headers["content-type"]);

        return new Response(response.data, {
            headers,
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to fetch image" }, { status: 500 });
    }
}
