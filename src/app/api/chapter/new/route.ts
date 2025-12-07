import axios from "axios";
import { parse } from "node-html-parser";
import { NextResponse } from "next/server";
import { textToSlug } from "@/utils/textToSlug";


export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    try {
        if (!q) {
            return NextResponse.json({ success: false, message: "q is required" }, { status: 400 });
        }
        const [beebook, truyenQQ, netTruyenX, cmanga] = await Promise.all([
            fetchBeebook(q),
            fetchTruyenQQ(q),
            fetchNetTruyenX(q),
            fetchTruyenCmanga(q),
        ]);
        const filteredResult = [beebook, truyenQQ, netTruyenX, cmanga].filter(item => item?.href && item?.num);

        return NextResponse.json({
            success: true,
            result: filteredResult,
        });
    } catch (error) {
        console.error("Error fetching image:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch image" }, { status: 500 });
    }
}

const fetchTruyenCmanga = async (q: string) => {
    try {
        const response = await fetch(`https://cmangag.com/api/search?file=image&child_protect=on&string=${q}`, {
            "headers": {
            "accept": "*/*",
            "accept-language": "vi,vi-VN;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Google Chrome\";v=\"132\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest",
            "cookie": "PHPSESSID=3mstrktqnees3hg3ebsqivcok5; _ga=GA1.1.2021338210.1737100497; _gcl_au=1.1.1598663246.1737100497; user_country={\"status\":\"success\",\"country\":\"Vietnam\",\"countryCode\":\"VN\",\"region\":\"DN\",\"regionName\":\"Da Nang\",\"city\":\"Da Nang\",\"zip\":\"550000\",\"lat\":16.069,\"lon\":108.2255,\"timezone\":\"Asia/Ho_Chi_Minh\",\"isp\":\"Viettel Corporation\",\"org\":\"Viettel Group\",\"as\":\"AS24086 Viettel Corporation\",\"query\":\"116.110.209.28\"}; ads_num=1; _ga_H44CVYGNRK=GS1.1.1737222615.3.0.1737222615.0.0.0; daily_popup_3=yes",
            "Referer": "https://cmangag.com/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": null,
            "method": "GET"
        });
        const data = await response.json();
        const info = JSON.parse(data[0].info);
        if(!info) return null;
    
        const num = info?.chapter?.last ? "Chapter " + info?.chapter?.last : null;
        const href = (info?.url && info?.id) ? ("https://cmangag.com/album/" + info?.url + "-" + info?.id) : null;
        
        return { source: "cmanga", num, href };
    } catch (error) {
        return null;
    }
};

const fetchTruyenQQ = async (q: string) => {
    try {
        const response = await fetch("https://truyenqqto.com/frontend/search/search", {
            "headers": {
              "accept": "*/*",
              "accept-language": "vi,vi-VN;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
              "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
              "priority": "u=1, i",
              "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Google Chrome\";v=\"132\"",
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": "\"Windows\"",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              "x-requested-with": "XMLHttpRequest"
            },
            "referrer": "https://truyenqqto.com/truyen-tranh/tro-thanh-than-chu-cthulhu-12348-chap-163.html",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": `search=${q}&type=0`,
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });
        const html = await response.text();
        const root = parse(html);
        const element = root.querySelector('li');
        if (!element) return null;
        const anchor = element.querySelector('a');
        const href = anchor ? anchor.getAttribute('href') : null;
        const infoParagraphs = element.querySelectorAll('.search_info p');
        const num = infoParagraphs.length > 0 ? infoParagraphs[infoParagraphs.length - 1].text.trim() : null;
        return { source: "truyenqq", num, href };
    } catch (error) {
        return null;
    }
};

const fetchNetTruyenX = async (q: string) => {
    try {
        const response = await fetch(`https://nettruyenx.com/Comic/Services/SuggestSearch.ashx?q=${q}`, {
            headers: { /* headers */ },
            referrerPolicy: "no-referrer",
            method: "GET",
            mode: "cors",
            credentials: "include",
        });
        const html = await response.text();
        const root = parse(html);
        const element = root.querySelector('li');
        if (!element) return null;
        const anchor = element.querySelector('a');
        const href = anchor ? anchor.getAttribute('href') : null;
        const chapterElement = element.querySelector('h4 i');
        const num = chapterElement ? chapterElement.text.trim() : null;
        return { source: "nettruyenx", num, href };
    } catch (error) {
        return null;
    }
};

const fetchBeebook = async (q: string) => {
    try {
        const response = await fetch(`https://bbbokkk.com/api/api_search?type=album&name=${textToSlug(q)}&page=1&limit=10`, {});
        const html = await response.json();
        console.log("html: ", html)
        const info = JSON.parse(html.data[0].info);
        const href = String(html.data[0].id_album);
        const num = String(info.last_chapter);
        return { source: "beebook", num, href };
    } catch (error) {
        return null;
    }
};