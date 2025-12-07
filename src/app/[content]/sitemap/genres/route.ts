import getDomainConfig from "@/lib/domain";
import { ContentPageEnum } from "@/common/data.types";
import { getListTagsBookApi } from "@/store/book/book.api";

const generateSitemapLink = (item: { link: string; lastmod: string }) => {
    return `<url>
        <loc>${item?.link}</loc>
        <lastmod>${item?.lastmod}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>`;
};

export async function GET(req: Request, res: any) {
    const { appUrl } = await getDomainConfig();

    const content = (res.params?.content as ContentPageEnum) || undefined;

    const categoryRes = await getListTagsBookApi({
        options: {
            take: 60,
            category: content,
        },
        revalidate: 24 * 60 * 60,
    });

    const sitemapIndexXML = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${categoryRes && categoryRes.data.map((item) =>
                generateSitemapLink({
                    link: `${appUrl}/${content}/tags/${item?.metaId}`,
                    lastmod: new Date().toISOString(),
                })
            )
            .join("")}
    </urlset>`;

    return new Response(sitemapIndexXML, {
        headers: { "Content-Type": "text/xml" },
    });
}
