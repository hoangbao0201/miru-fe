"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";

import historyService from "@/services/history.services";

interface ButtonChapterReadProps {
    slug: string;
    bookId: number;
}

const ButtonChapterRead = ({ slug, bookId }: ButtonChapterReadProps) => {
    const { data: session, status } = useSession();
    const [chapterRead, setChapterRead] = useState<{
        num: string;
        chapterNumber: number;
    } | null>(null);

    useEffect(() => {
        const fetchChapterRead = async () => {
            if (status === "authenticated") {
                try {
                    const response = await historyService.getChapterRead({
                        bookId,
                        token: session?.backendTokens.accessToken,
                    });

                    setChapterRead(
                        response?.chapterRead?.chapter || { num: "1", chapterNumber: 1 }
                    );
                } catch (error) {
                    console.error("Error fetching chapter read:", error);
                }
            }
        };

        fetchChapterRead();
    }, [status, bookId, session]);

    const chapterUrl = useMemo(
        () =>
            chapterRead
                ? `/books/${slug}-${bookId}/chapter-${chapterRead.num}-${chapterRead.chapterNumber}`
                : "#",
        [slug, bookId, chapterRead]
    );

    if (!chapterRead) {
        return <div className="w-full h-12 px-1 py-2"></div>;
    }

    return (
        <Link
            prefetch={false}
            title="Đọc tiếp"
            href={chapterUrl}
            className="relative w-full h-12 mb-1 block"
        >
            <div className="border-2 border-slate-900 z-[1] rounded flex items-center justify-center w-full h-full text-lg text-white hover:bg-blue-500 bg-blue-600">
                Đọc tiếp
            </div>
        </Link>
    );
};

export default ButtonChapterRead;
