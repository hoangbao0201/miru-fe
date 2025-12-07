import { ContentPageEnum } from "@/common/data.types";
import CreatorListUsersTemplate from "@/components/Modules/Admin/ManagerUser";

interface ParamsProps {
    params: {
        slugPost: string;
        content: ContentPageEnum;
    };
}
export default async function AdminManagerUsersPage({
    params,
    searchParams,
}: SearchParamProps & ParamsProps) {
    const content =
        (params.content as ContentPageEnum) || ContentPageEnum.comics;

    return (
        <CreatorListUsersTemplate
            meta={{
                content: content,
            }}
        />
    )
}   
