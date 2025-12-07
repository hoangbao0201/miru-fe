"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
    ChangeEvent,
    forwardRef,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import { VirtuosoGrid, VirtuosoHandle } from "react-virtuoso";

import IconEye from "../Icons/IconEye";
import convertTime from "@/utils/convertTime";
import historyService from "@/services/history.services";
import {
    GetChaptersAdvancedProps,
} from "@/services/chapter.services";
import { useGetListChapterAdvancedByBookIdQuery } from "@/store/chapter/chapter.public.api";
import { ContentPageEnum } from "@/common/data.types";

interface ListChapterProps {
    slug: string;
    bookId: number;
    content: ContentPageEnum;
}

const ListChapter = ({ slug, bookId, content }: ListChapterProps) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const virtuosoRef = useRef<VirtuosoHandle>(null);

    const [chapterRead, setChapterRead] = useState<null | {
        num: string;
        chapterNumber: number;
    }>(null);
    const [chapterSearch, setChapterSearch] = useState<string>("");
    const { data: chapterData, isLoading, isError } = useGetListChapterAdvancedByBookIdQuery({ bookId, query: { order: 'desc', take: 5000 } });
    const chapters: GetChaptersAdvancedProps[] = useMemo(() => chapterData?.data?.chapters || chapterData?.chapters || [], [chapterData]);
    
    useEffect(() => {
        if (status === "authenticated") {
            historyService
                .getChapterRead({
                    bookId,
                    token: session?.backendTokens.accessToken,
                })
                .then((response) => {
                    setChapterRead(
                        response?.chapterRead?.chapter || {
                            num: "1",
                            chapterNumber: 1,
                        }
                    );
                })
                .catch((error) =>
                    console.error("Error fetching chapter read:", error)
                );
        }
    }, [status])

    const filteredChapters = useMemo(() => {
        if (!chapterSearch.trim()) return chapters || [];
        return chapters?.filter((chapter) =>
            chapter.num === chapterSearch.trim()
        );
    }, [chapterSearch, chapters]);

    return (
        <nav className="">
            <div className="border-b border-accent-20 mb-2">
                <div className="h-10 mb-2">
                    {
                        chapterRead && (
                            <Link
                                title="Đọc tiếp"
                                prefetch={false}
                                className="relative w-full block"
                                href={`/${content}/books/${slug}-${bookId}/chapter-${chapterRead?.num}-${chapterRead?.chapterNumber}`}
                            >
                                <div className="px-3 h-10 leading-10 text-sm font-bold uppercase rounded-md flex items-center justify-center hover:bg-blue-700 bg-blue-600">
                                    Đọc tiếp
                                </div>
                            </Link>
                        )
                    }
                </div>
                <input
                    value={chapterSearch}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setChapterSearch(e.target.value)
                    }
                    placeholder="Nhập số chap"
                    className="w-full rounded-md px-3 h-11 leading-11 mb-2"
                />
            </div>

            <div className="" style={{ position: "relative", maxHeight: "450px", }}>
                {isLoading && (
                    <div className="flex items-center justify-center h-full">Đang tải chương...</div>
                )}
                {isError && (
                    <div className="text-red-400 p-2">Lỗi khi tải danh sách chương.</div>
                )}
                {chapters && chapters.length > 0 && (
                    <VirtuosoGrid
                        data={filteredChapters}
                        ref={virtuosoRef}
                        style={{
                            minHeight: "100px",
                            maxHeight: "450px",
                        }}
                        components={{
                            List: VirtuosoList,
                            Item: VirtuosoItem,
                        }}
                        itemContent={(_, chapter) => (
                            <ChapterCard
                                slug={slug}
                                bookId={bookId}
                                chapter={chapter}
                                content={content}
                                chapterRead={chapterRead}
                            />
                        )}
                    />
                )}
            </div>
        </nav>
    );
};

export default ListChapter;

const VirtuosoList = forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ style, children, ...props }, ref) => (
    <div
        ref={ref}
        {...props}
        style={{ ...style }}
        className="grid md:grid-cols-2 grid-cols-1 gap-1"
    >
        {children}
    </div>
));
VirtuosoList.displayName = "VirtuosoList";

const VirtuosoItem = ({
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...props} className="">
        {children}
    </div>
);

const ChapterCard = ({
    slug,
    bookId,
    chapter,
    content,
    chapterRead,
}: {
    slug: string;
    bookId: number;
    content: ContentPageEnum;
    chapter: GetChaptersAdvancedProps;
    chapterRead: { num: string; chapterNumber: number } | null;
}) => (
    <Link
        title=""
        prefetch={false}
        href={`/${content}/books/${slug}-${bookId}/chapter-${chapter.num}-${chapter.chapterNumber}`}
        className={`cursor-pointer rounded relative bg-accent hover:bg-accent-hover px-1 py-[5px] flex`}
    >
        <div className="w-[80px] h-[55px] rounded overflow-hidden flex items-center justify-center bg-blue-600/20">
            {chapter?.thumbnail ? (
                <Image
                    alt=""
                    width={90}
                    height={68}
                    unoptimized
                    loading="lazy"
                    src={`https://phinf.pstatic.net/memo${chapter.thumbnail}`}
                    className="w-[80px] h-[55px] object-cover"
                />
            ) : (
                <IconEye className="fill-blue-500" />
            )}
        </div>
        <div className="flex-1 pl-2 pr-2">
            <div className="line-clamp-1 mb-2">
                <span
                    className={`font-semibold ${
                        chapterRead?.chapterNumber === chapter.chapterNumber &&
                        "text-white px-2 bg-blue-600"
                    }`}
                >
                    #{chapter.num}
                </span>{" "}
                <span className="text-[15px]">
                    {chapter?.title ? ` - ${chapter?.title}` : ""}
                </span>
            </div>
            <div className="flex items-center justify-between whitespace-nowrap text-sm">
                <span>Lượt xem: {chapter.viewsCount || 0}</span>
                <time className="text-sm italic">
                    {convertTime(chapter.createdAt)}
                </time>
            </div>
        </div>
    </Link>
);
