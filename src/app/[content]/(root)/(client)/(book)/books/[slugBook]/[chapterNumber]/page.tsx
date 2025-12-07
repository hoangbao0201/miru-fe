import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";

import { BreadcrumbList } from "schema-dts";

import chapterService, {
    GetChapterDetailProps,
    GetChaptersAdvancedProps,
} from "@/services/chapter.services";
import { Env } from "@/config/Env";
import { JsonLd } from "@/utils/JsonLd";
import getDomainConfig from "@/lib/domain";
import { listTagSeo } from "@/constants/data";
import { ContentPageEnum } from "@/common/data.types";
import ChapterDetailTemplate from "@/components/Modules/ChapterDetailTemplate";

const { NEXT_PUBLIC_TITLE_SEO, NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO } = Env

interface ParamsProps {
    params: {
        slugBook: string;
        chapterNumber: string;
        content: ContentPageEnum;
    };
}

export async function generateMetadata(
    { params, searchParams }: SearchParamProps & ParamsProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { appUrl } = await getDomainConfig();

    const { chapterNumber, slugBook } = params;
    const content =
        (params?.content as ContentPageEnum) || ContentPageEnum.comics;

    const cvBookId = slugBook.substring(slugBook.lastIndexOf("-") + 1);
    const cvChapterNumber = chapterNumber.substring(
        chapterNumber.lastIndexOf("-") + 1
    );

    const {
        data: { chapter },
    }: {
        data: {
            chapter: Omit<GetChapterDetailProps, 'servers'>;
        };
    } = await chapterService.findOne({
        cache: "no-cache",
        bookId: +cvBookId,
        chapterNumber: +cvChapterNumber,
    });
    const previousImages = (await parent).openGraph?.images || [];

    return {
        title: `${chapter?.book.title || ""} Chap ${chapter?.num} Next Chap ${
            Number(chapter?.num) + 1
        } - ${NEXT_PUBLIC_TITLE_SEO}`,

        description: `${chapter?.book.title} Chapter ${chapter?.num} cập nhật nhanh và sớm nhất tại ${NEXT_PUBLIC_TITLE_SEO}`,
        category: NEXT_PUBLIC_TITLE_SEO,
        keywords: [...listTagSeo[content]],
        publisher: NEXT_PUBLIC_TITLE_SEO,
        openGraph: {
            title: `${chapter?.book.title || ""} Chap ${
                chapter?.num
            } Next Chap ${Number(chapter?.num) + 1} - ${NEXT_PUBLIC_TITLE_SEO}`,
            siteName: NEXT_PUBLIC_TITLE_SEO,
            url: `${appUrl}/books/${chapter?.book.slug}-${chapter?.bookId}/chapter-${chapter?.num}-${chapter?.chapterNumber}`,
            type: "article",
            description: `${chapter?.book.title} Chapter ${chapter?.num} cập nhật nhanh và sớm nhất tại ${NEXT_PUBLIC_TITLE_SEO}`,
            images: [
                NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO + "/" +
                    (chapter?.book.previewImage || chapter?.book.thumbnail) ||
                    "",
                ...previousImages,
            ],
            tags: [...listTagSeo[content]],
            authors: NEXT_PUBLIC_TITLE_SEO,
        },
        alternates: {
            canonical: `${appUrl}/books/${chapter?.book.slug}-${chapter?.bookId}/chapter-${chapter?.num}-${chapter?.chapterNumber}`,
        },
    };
}
const ChapterDetailPage = async ({
    params,
}: SearchParamProps & ParamsProps) => {
    const { appUrl } = await getDomainConfig();

    const { slugBook, chapterNumber } = params;
    const content =
        (params?.content as ContentPageEnum) || ContentPageEnum.comics;

    const cvBookId = slugBook.substring(slugBook.lastIndexOf("-") + 1);
    const cvChapterNumber = chapterNumber.substring(
        chapterNumber.lastIndexOf("-") + 1
    );

    const {
        data: { chapter, servers },
    }: { data: { chapter: GetChapterDetailProps; servers: string[] } } =
        await chapterService.findOne({
            cache: "no-cache",
            bookId: +cvBookId,
            chapterNumber: +cvChapterNumber,
        });

    if (!chapter) {
        notFound();
    }

    return (
        <>
            <ChapterDetailTemplate
                content={content}
                chapter={chapter}
                servers={servers || []}
            />
        </>
    );
};

export default ChapterDetailPage;
