import { ContentPageEnum } from "@/common/data.types";
import ListTeamsTemplate from "@/components/Modules/Creator/Team/ListTeamTemplate";

interface ParamsProps {
    params: {
        slugPost: string;
        content: ContentPageEnum;
    };
}
export default async function AdminManagerTeamsPage({
    params,
    searchParams,
}: SearchParamProps & ParamsProps) {
    const content =
        (params.content as ContentPageEnum) || ContentPageEnum.comics;

    return (
        <ListTeamsTemplate
            meta={{
                content,
                isSearch: true,
            }}
        />
    )
}   
