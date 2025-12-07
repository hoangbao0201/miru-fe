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
            responseType: 'arraybuffer',
            headers: {
                'accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'accept-language': 'vi,vi-VN;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
                'cache-control': 'no-cache',
                'pragma': 'no-cache',
                'priority': 'i',
                'referer': referer,
                'sec-ch-ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'image',
                'sec-fetch-mode': 'no-cors',
                'sec-fetch-site': 'cross-site',
                'sec-fetch-storage-access': 'active',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36'
            }
        });

        const buffer = Buffer.from(response.data);
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': response.headers['content-type'] || 'application/octet-stream'
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error }, { status: 500 });
    }
}
