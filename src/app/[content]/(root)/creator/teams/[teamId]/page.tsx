import { ContentPageEnum } from "@/common/data.types";
import CreateFormTeamTemplate from "@/components/Modules/Creator/Team/CreateFormTeamTemplate";

interface IParams {
    params: {
        teamId: number;
        content: ContentPageEnum;
    }
}
export default async function UpdateTeamPage({
    params,
    searchParams,
}: SearchParamProps & IParams) {
    const teamId = Number(params.teamId);
    const content =
        (params.content as ContentPageEnum) || ContentPageEnum.comics;

    return (
        <CreateFormTeamTemplate teamId={Number(teamId)} meta={{ content }}/>
    )
}
