import { ContentPageEnum } from "@/common/data.types";
import CreatorReportsBookTemplate from "@/components/Modules/Creator/Report/CreatorReportsBookTemplate";
interface ParamsProps {
    params: {
        slugPost: string;
        content: ContentPageEnum;
    };
}
export default async function CreatorReportsBookPage({
    params,
    searchParams,
}: SearchParamProps & ParamsProps) {
    const content =
        (params.content as ContentPageEnum) || ContentPageEnum.comics;
    return (
        <CreatorReportsBookTemplate content={content}/>
    )
}
