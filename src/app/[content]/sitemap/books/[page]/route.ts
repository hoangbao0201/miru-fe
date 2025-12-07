import { Env } from "@/config/Env";
import { PAGE_SIZE_SEO } from "@/constants/data";
import { ContentPageEnum } from "@/common/data.types";
import { GetBooksSeoProps, getSeoBookService } from "@/services/book.services";
import getDomainConfig from "@/lib/domain";

const generateSitemapLink = ({
    book,  
    appUrl,
    content,
}: {
    appUrl: string;
    content: ContentPageEnum;
    book: GetBooksSeoProps;
}) => {
    return `<url>
        <loc>${appUrl}/${content}/books/${book?.slug}-${book?.bookId}</loc>
        <lastmod>${book?.newChapterAt}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>`;
};

export async function GET(req: Request, res: any) {
    const { appUrl } = await getDomainConfig();

    const page = Number(res.params?.page || 1);
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
        ${books.map((book) => generateSitemapLink({ appUrl, content, book })).join("")}
    </urlset>`;

    return new Response(sitemapIndexXML, {
        headers: { "Content-Type": "text/xml" },
    });
}
