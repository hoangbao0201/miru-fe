import { ContentPageEnum } from "@/common/data.types";
import CreatorListChaptersTemplate from "@/components/Modules/Creator/Chapter/CreatorListChaptersTemplate";

interface ParamsProps {
    params: {
        bookId: string;
        content: ContentPageEnum;
    };
}

export default async function AdminListChaptersPage({
    params,
    searchParams,
}: SearchParamProps & ParamsProps) {
    const { bookId } = params;
    const content =
            (params.content as ContentPageEnum) || ContentPageEnum.comics;

    return (
        <>
            <CreatorListChaptersTemplate
                bookId={Number(bookId)}
                content={content}
            />
        </>
    );
}
