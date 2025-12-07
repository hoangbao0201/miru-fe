import { ContentPageEnum } from "@/common/data.types";
import CreateFormTeamTemplate from "@/components/Modules/Creator/Team/CreateFormTeamTemplate";

interface ParamsProps {
    params: {
        slugPost: string;
        content: ContentPageEnum;
    };
}
export default async function CreateTeamPage({
    params,
    searchParams,
}: SearchParamProps & ParamsProps) {
    const content =
        (params.content as ContentPageEnum) || ContentPageEnum.comics;

    return (
        <CreateFormTeamTemplate
            meta={{ content }}
        />
    )
}
