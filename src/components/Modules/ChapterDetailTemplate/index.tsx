import { memo, useMemo } from "react";

import ContentChapter from "./ContentChapter";
import {
    GetChapterDetailProps,
    GetChaptersAdvancedProps,
} from "@/services/chapter.services";
import { ContentPageEnum } from "@/common/data.types";
import FormComment from "@/components/Share/FormComment";
import { TypeCommentEnum } from "@/store/comment/comment.reducer";

interface ChapterDetailTemplateProps {
    servers: string[];
    content: ContentPageEnum;
    chapter: GetChapterDetailProps;
}

const ChapterDetailTemplate = ({
    chapter,
    servers,
    content,
}: ChapterDetailTemplateProps) => {

    return (
        <>
            <div className="pt-10">
                <div className="">
                    <ContentChapter
                        content={content}
                        chapter={chapter}
                        servers={servers}
                    />

                    <div className="mx-auto max-w-screen-8xl px-3 py-4 my-3 bg-accent rounded-md">
                        <h5
                            id="comment"
                            className="text-lg font-semibold mb-2 scroll-mt-[70px]"
                        >
                            Bình luận truyện
                        </h5>
                        <FormComment
                            num={chapter?.num}
                            bookId={chapter?.bookId}
                            type={TypeCommentEnum.CHAPTER}
                            chapterNumber={chapter?.chapterNumber}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default memo(ChapterDetailTemplate);
