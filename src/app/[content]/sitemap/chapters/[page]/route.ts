import { Env } from "@/config/Env";
import { PAGE_SIZE_SEO } from "@/constants/data";
import chapterService, {
    GetChaptersSeoProps,
} from "@/services/chapter.services";
import { ContentPageEnum } from "@/common/data.types";
import getDomainConfig from "@/lib/domain";

const generateSitemapLink = ({
    appUrl,
    content,
    chapter,
}: {
    appUrl: string;
    content: ContentPageEnum;
    chapter: GetChaptersSeoProps;
}) => {
    return `<url>
        <loc>${appUrl}/${content}/books/${chapter?.book.slug}-${chapter?.bookId}/chapter-${chapter?.chapterNumber}</loc>
        <lastmod>${chapter?.updatedAt}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>`;
};

export async function GET(req: Request, res: any) {
    const { appUrl } = await getDomainConfig();

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
    const { chapters }: { chapters: GetChaptersSeoProps[] } =
        await chapterService.findAllSeo({
            query: `?${querys.toString()}`,
            cache: "no-store",
        });

    const sitemapIndexXML = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

        ${chapters
            .map((chapter) => generateSitemapLink({ appUrl, content, chapter }))
            .join("")}
    </urlset>`;

    return new Response(sitemapIndexXML, {
        headers: { "Content-Type": "text/xml" },
    });
}
