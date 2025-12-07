import { MetadataRoute } from "next";

import getDomainConfig from "@/lib/domain";
import { ContentPageEnum } from "@/common/data.types";

const generateSitemapLink = (site: MetadataRoute.Sitemap[0]) => {
    return `<url>
        <loc>${site?.url}</loc>
        <lastmod>${site?.lastModified}</lastmod>
        <changefreq>${site?.changeFrequency}</changefreq>
        <priority>${site?.priority}</priority>
    </url>`;
};

export async function GET(req: Request, res: any) {
    const { appUrl } = await getDomainConfig();

    const mainSitemap: MetadataRoute.Sitemap = [
        {
            url: `${appUrl}`,
            lastModified: new Date().toISOString(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${appUrl}/auth/login`,
            lastModified: new Date().toISOString(),
            changeFrequency: "daily",
            priority: 0.8,
        },
        {
            url: `${appUrl}/auth/register`,
            lastModified: new Date().toISOString(),
            changeFrequency: "daily",
            priority: 0.8,
        },
        {
            url: `${appUrl}/${ContentPageEnum.comics}/chinh-sach-bao-mat`,
            lastModified: new Date().toISOString(),
            changeFrequency: "daily",
            priority: 0.8,
        },
    ];

    const sitemapIndexXML = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${mainSitemap.map((site) => generateSitemapLink(site)).join("")}
    </urlset>`;

    return new Response(sitemapIndexXML, {
        headers: { "Content-Type": "text/xml" },
    });
}
