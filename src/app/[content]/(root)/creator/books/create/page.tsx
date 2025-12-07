import { ContentPageEnum } from "@/common/data.types";
import CreatorFormBookTemplate from "@/components/Modules/Creator/Book/CreatorFormBookTemplate";

interface ParamsProps {
    params: {
        content: ContentPageEnum;
    };
}
const CreatorCreateBookPage = ({
    params,
    searchParams,
}: SearchParamProps & ParamsProps) => {
    const content =
            (params.content as ContentPageEnum) || ContentPageEnum.comics;

    return (
        <CreatorFormBookTemplate content={content}/>
    )
}

export default CreatorCreateBookPage;