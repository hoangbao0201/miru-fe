import omit from "lodash/omit";

import { instanceAxios } from "@/config/axios";
import { removeNullOrEmptyValues } from "@/utils/removeNullOrEmptyValues";
import {
    AddMemberTeamParameterType,
    AddMemberTeamResType,
    GetBasicListTeamResType,
    GetDataPendingInvitationsTeamResType,
    GetDetailTeamResType,
    JoinTeamParameterType,
    JoinTeamResType,
    OutMemberTeamParameterType,
    OutMemberTeamResType,
    RemoveMemberTeamParameterType,
    RemoveMemberTeamResType,
    UpsertTeamParameterType,
    UpsertTeamResType,
} from "./team.type";
import axios from "axios";
import { getSession } from "next-auth/react";
import { Env } from "@/config/Env";

const pathnameTeam = "/api/creator/teams";

export interface IUploadCoverImageType {
    data: {
        success: boolean;
    }
}
export const uploadCoverImageApi = async ({
    data,
    onProgress,
}: {
    data: {
        teamId: number;
        file: FormData;
    };
    onProgress?: (percent: number) => void;
}): Promise<IUploadCoverImageType> => {
    const session = await getSession();

    let lastReportedPercent = -1;
    return await axios.put(
        `${Env.NEXT_PUBLIC_API_URL}${pathnameTeam}/${data.teamId}/cover`,
        data.file,
        {
            headers: {
                Authorization: `Bearer ${session?.backendTokens.accessToken}`,
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const percent = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );

                    if (percent % 10 === 0 && percent !== lastReportedPercent) {
                        lastReportedPercent = percent;
                        onProgress(percent);
                    }
                }
            },
        }
    );
};

export const getDetailTeamApi = (
    teamId: number
): Promise<GetDetailTeamResType> => {
    return instanceAxios.get(`${pathnameTeam}/${teamId}`);
};

export const getBasicListTeamApi = (): Promise<GetBasicListTeamResType> => {
    return instanceAxios.get(`${pathnameTeam}/basic`);
};

export const upsertTeamApi = (
    params: UpsertTeamParameterType
): Promise<UpsertTeamResType> => {
    const newParams = removeNullOrEmptyValues(params);
    return instanceAxios.post(`${pathnameTeam}/upsert`, newParams);
};

export const addMemberTeamApi = (
    params: AddMemberTeamParameterType
): Promise<AddMemberTeamResType> => {
    return instanceAxios.post(`${pathnameTeam}/add-member`, params);
};

export const outMemberTeamApi = (
    params: OutMemberTeamParameterType
): Promise<OutMemberTeamResType> => {
    return instanceAxios.post(
        `${pathnameTeam}/out-member`,
        omit(params, ["userId"])
    );
};

export const getPendingInvitationsTeamApi =
    (): Promise<GetDataPendingInvitationsTeamResType> => {
        return instanceAxios.get(`${pathnameTeam}/invitations`);
    };

export const confirmJoinTeamApi = (
    params: JoinTeamParameterType
): Promise<JoinTeamResType> => {
    return instanceAxios.post(`${pathnameTeam}/confirm-join-member`, params);
};

export const rejectJoinTeamApi = (
    params: JoinTeamParameterType
): Promise<JoinTeamResType> => {
    return instanceAxios.post(`${pathnameTeam}/reject-join-member`, params);
};

export const removeMemberTeamApi = (
    params: RemoveMemberTeamParameterType
): Promise<RemoveMemberTeamResType> => {
    return instanceAxios.post(`${pathnameTeam}/remove-member`, params);
};
