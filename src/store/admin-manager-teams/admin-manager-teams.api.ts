import { instanceAxios } from "@/config/axios";
import { ParameterGetListTeamsAdminManager } from "./admin-manager-teams.type";
import { cleanAndSerializeQueryParams } from "@/utils/cleanAndSerializeQueryParams";

export const getListTeamsAdminManagerApi = async (
    params: ParameterGetListTeamsAdminManager
): Promise<ParameterGetListTeamsAdminManager> => {
    const newParams = cleanAndSerializeQueryParams(params);
    const url = "/api/creator/teams?";
    return instanceAxios.get(url + newParams);
};