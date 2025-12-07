import RSS from "rss";

import { Env } from "@/config/Env";
import { ContentPageEnum } from "@/common/data.types";
import { getRssBookService } from "@/services/book.services";
import getDomainConfig from "@/lib/domain";

const { NEXT_PUBLIC_TITLE_SEO } = Env

interface BooksProps {
    slug: string;
    title: string;
    bookId: number;
    isAdult: Boolean;
    newChapterAt: Date;
    description: string;
    chapters: { num: string; chapterNumber: number; createdAt: Date }[];
}
export async function GET(req: Request, res: any) {
    const { appUrl } = await getDomainConfig();

    const content = (res.params?.content as ContentPageEnum) || undefined;
    const querys = new URLSearchParams({
        take: "10",
        page: String(1),
        category: content,
    });
    const { result = [] }: { result: BooksProps[] } = await getRssBookService({
        query: `?${querys.toString()}`,
        cache: "no-store",
    });

    const rss = new RSS({
        title: `Đọc Truyện ${NEXT_PUBLIC_TITLE_SEO}, Xem Truyện Tranh, Manga, Mahua`,
        description:
            "Website đọc truyện tranh, Truyện tiếng việt online hấp dẫn với nhiều thể loại truyện tranh. Doujinshi anime và manga Nhật bản hay nhất VN.",
        site_url: appUrl,
        feed_url: `${appUrl}/rss.xml`,
        copyright: `${new Date().getFullYear()} ${NEXT_PUBLIC_TITLE_SEO}`,
        language: "vi_VN",
        pubDate: new Date(),
    });

    if (result && result?.length > 0) {
        result.forEach((book) => {
            const content = ContentPageEnum.comics;
            rss.item({
                title: `${book?.title || ""}${
                    book?.chapters[0]?.num
                        ? " [Tới Chap " +
                          (Number(book?.chapters[0]?.num) + 1) +
                          "] "
                        : " "
                }Tiếng Việt - ${NEXT_PUBLIC_TITLE_SEO}`,
                date: book.newChapterAt,
                description: book?.description || "",
                url: `${appUrl}/${content}truyen/${book?.slug}-${book?.bookId}`,
                guid: `${appUrl}/${content}/books/${book?.slug}-${book?.bookId}`,
            });
        });
    }

    return new Response(rss.xml({ indent: true }), {
        headers: {
            "Content-Type": "application/atom+xml; charset=utf-8",
        },
    });
}
