import getDomainConfig from "@/lib/domain";
import { PAGE_SIZE_SEO } from "@/constants/data";
import { ContentPageEnum } from "@/common/data.types";
import { GetBooksSeoProps, getSeoBookService } from "@/services/book.services";


const generateSitemapLink = (item: { link: string; lastmod: Date }) => { 
    return `<url>
        <loc>${item?.link}</loc>
        <lastmod>${item?.lastmod}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>`;
};

export async function GET(req: Request, res: any) {
    const { appUrl } = await getDomainConfig();

    const tag = String(res.params.tag) || "";
    const page = Number(res.params.page) || 1;
    const content = (res.params?.content as ContentPageEnum) || undefined;

    const querys = new URLSearchParams({
        take: PAGE_SIZE_SEO.toString(),
        page: page.toString(),
        ...(content && {
            category:
                ContentPageEnum?.[content] || ContentPageEnum.comics,
        }),
    });
    const { books }: { books: GetBooksSeoProps[] } = await getSeoBookService({
        query: `?${querys.toString()}`,
        cache: "no-store",
    });

    const sitemapIndexXML = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${books
            .map((book) =>
                generateSitemapLink({
                    link: `${appUrl}/${content}/seo/${book?.slug}-${tag}`,
                    lastmod: book?.newChapterAt,
                })
            )
            .join("")}
    </urlset>`;

    return new Response(sitemapIndexXML, {
        headers: { "Content-Type": "text/xml" },
    });
}
