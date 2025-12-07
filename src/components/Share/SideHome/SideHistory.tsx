"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import historyService, {
    GetHistoryChapterProps,
} from "@/services/history.services";
import convertTime from "@/utils/convertTime";
import { ContentPageEnum } from "@/common/data.types";

interface SideHistoryProps {
    content: ContentPageEnum;
}
const SideHistory = async ({ content = ContentPageEnum.comics }: SideHistoryProps) => {
    const { data: session, status } = useSession();

    const [history, setHistory] = useState<null | GetHistoryChapterProps[]>(
        null
    );

    const handleGetHistoryChapter = async () => {
        if (status === "authenticated") {
            const querys = new URLSearchParams({
                take: "3",
                page: String(Number(1) || 1),
                ...(content && {
                    category: content,
                }),
            });
            const { history }: { history: GetHistoryChapterProps[] } =
                await historyService.getHistoryUser({
                    cache: "no-store",
                    query: `?${querys.toString()}`,
                    token: session?.backendTokens.accessToken,
                });
            if (history) {
                setHistory(history);
            } else {
                setHistory([]);
            }
        }
    };

    useEffect(() => {
        handleGetHistoryChapter();
    }, [status]);

    return (
        <>
            <ul className="space-y-3 min-h-[194px]">
                {status === "authenticated" ? (
                    history && (
                        history?.length > 0 ? (
                            history?.map((str) => {
                                return (
                                    <li
                                        key={
                                            str?.book +
                                            "-" +
                                            str?.chapterRead?.chapterNumber
                                        }
                                        className="group hover:bg-card/80 transition-colors"
                                    >
                                        <Link
                                            prefetch={false}
                                            title={str?.book.title}
                                            href={`/${str?.book.category}/books/${str?.book.slug}-${str?.book.bookId}/chapter-${str?.chapterRead?.num}-${str?.chapterRead?.chapterNumber}`}
                                            className="block"
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                                                    Chương {str?.chapterRead?.num}
                                                </span>
                                                <time className="text-[11px] text-muted-foreground whitespace-nowrap">
                                                    {convertTime(str?.chapterRead?.updatedAt)}
                                                </time>
                                            </div>
                                            <h4 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                                                {str?.book.title}
                                            </h4>
                                        </Link>
                                    </li>
                                );
                            })
                        ) : (
                            <li className="rounded-lg border bg-card/40 p-4 text-center text-sm text-muted-foreground">
                                Bạn chưa đọc truyện nào!
                            </li>
                        )
                    )
                ) : status === "unauthenticated" ? (
                    <li className="rounded-lg border bg-card/40 p-4 text-center text-sm text-muted-foreground">
                        Bạn chưa{" "}
                        <Link
                            prefetch={false}
                            title="Đăng nhập"
                            href={`/auth/login`}
                            className="text-primary font-semibold hover:underline"
                        >
                            đăng nhập
                        </Link>
                    </li>
                ) : (
                    <li className="rounded-lg border bg-card/40 p-4 text-center text-sm text-muted-foreground">
                        Đang tải...
                    </li>
                )}
            </ul>
        </>
    );
};

export default SideHistory;
