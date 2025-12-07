"use client";

import { ContentPageEnum } from "@/common/data.types";
import HeaderWithBackButton from "@/components/Share/Header/HeaderWithBackButton";
import CreatorFormChapterV1Template from "@/components/Modules/Creator/Chapter/CreatorFormChapterTemplate";

type Props = {
    params: {
        method: string;
        bookId: string;
        chapterNumber: string;
        content: ContentPageEnum;
    };
};

export default function CreatorFormChapterPage({
    params,
    searchParams,
}: SearchParamProps & Props) {
    const { v: v = "1" } = searchParams;
    const { method, bookId, chapterNumber } = params;
    const content =
        (params.content as ContentPageEnum) || ContentPageEnum.comics;

    return (
        <>
            <HeaderWithBackButton
                // callbackUrl={`/creator/books/${bookId}/chapters`}
                title={
                    String(method).toUpperCase() === "UPDATE"
                        ? "CẬP NHẬT CHƯƠNG TRUYỆN"
                        : "TẠO CHƯƠNG TRUYỆN"
                }
            />
            <CreatorFormChapterV1Template
                content={content}
                bookId={Number(bookId)}
                chapterNumber={Number(chapterNumber)}
                method={
                    String(method).toUpperCase() === "UPDATE"
                        ? "UPDATE"
                        : "CREATE"
                }
            />
        </>
    );
}
