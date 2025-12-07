import { ContentPageEnum } from "@/common/data.types";
import CreatorFormBookTemplate from "@/components/Modules/Creator/Book/CreatorFormBookTemplate";

interface IParams {
    params: {
        bookId: number;
        content: ContentPageEnum;
    }
}
export default async function CreatorUpdateBookPage({
    params,
    searchParams,
}: SearchParamProps & IParams) {
    const bookId = Number(params.bookId);
    const content =
        (params.content as ContentPageEnum) || ContentPageEnum.comics;

    return (
        <CreatorFormBookTemplate bookId={Number(bookId)} content={content}/>
    )
}
