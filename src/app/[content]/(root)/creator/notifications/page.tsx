import { ContentPageEnum } from "@/common/data.types";
import CreatorNotificationsTemplate from "@/components/Modules/Creator/CreatorNotificationsTemplate";

interface ParamsProps {
    params: {
        slugPost: string;
        content: ContentPageEnum;
    };
}
export default async function CreatorNotificationsPage({
    params,
    searchParams,
}: SearchParamProps & ParamsProps) {
    const content =
            (params.content as ContentPageEnum) || ContentPageEnum.comics;
    
    return (
        <CreatorNotificationsTemplate meta={{ content }}/>
    )
}
