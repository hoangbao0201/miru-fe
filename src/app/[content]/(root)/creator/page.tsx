import { ContentPageEnum } from "@/common/data.types";
import CreatorHomeTemplate from "@/components/Modules/Creator/CreatorNotificationsTemplate";

interface ParamsProps {
    params: {
        slugPost: string;
        content: ContentPageEnum;
    };
}
export default async function CreatorHomePage({
    params,
    searchParams,
}: SearchParamProps & ParamsProps) {
    const content =
            (params.content as ContentPageEnum) || ContentPageEnum.comics;
    
    return (
        <CreatorHomeTemplate meta={{ content }}/>
    )
}
