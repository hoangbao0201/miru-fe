import {
    getSeoCountBookService,
} from "@/services/book.services";
import getDomainConfig from "@/lib/domain";
import { PAGE_SIZE_SEO } from "@/constants/data";
import { ContentPageEnum } from "@/common/data.types";

const generateSitemapLink = (url: string) =>
    `<sitemap>
        <loc>${url}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
    </sitemap>`;

export async function GET(req: Request, res: any) {
    const { appUrl } = await getDomainConfig();

    const content = (res.params?.content as ContentPageEnum) || undefined;

    const querys = new URLSearchParams({
        ...(content && {
            category:
                ContentPageEnum?.[content] || ContentPageEnum.comics,
        }),
    });
    const countBooks: { total_books: number } =
        await getSeoCountBookService({
            query: `?${querys}`,
            cache: "no-store",
        });

    const pageCountBooks = Math.ceil(
        countBooks?.total_books / PAGE_SIZE_SEO
    );

    const sitemapIndexXML = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

        ${generateSitemapLink(`${appUrl}/${content}/sitemap/main`)}

        ${Array.from({ length: pageCountBooks }, (_, i) => i + 1)
            .map((index) =>
                generateSitemapLink(
                    `${appUrl}/${content}/sitemap/books/${index}`
                )
            )
            .join("")}

        ${generateSitemapLink(
            `${appUrl}/${content}/sitemap/genres`
        )}

    </sitemapindex>`;

    return new Response(sitemapIndexXML, {
        headers: { "Content-Type": "text/xml" },
    });
}
