import { ContentPageEnum } from "@/common/data.types";
import CreatorListBooksTemplate from "@/components/Modules/Creator/Book/CreatorListBooksTemplate";

interface ParamsProps {
    params: {
        slugPost: string;
        content: ContentPageEnum;
    };
}
export default async function AdminBooksPage({
    params,
    searchParams,
}: SearchParamProps & ParamsProps) {
    const content =
        (params.content as ContentPageEnum) || ContentPageEnum.comics;

    return (
        <CreatorListBooksTemplate
            meta={{
                content: content,
            }}
        />
    )
}   
