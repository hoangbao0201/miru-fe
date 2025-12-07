import { ParameterGet } from "@/constants/type";

export interface ParameterGetListTeamsAdminManager extends ParameterGet {}

export interface ITeam {
    name: string;
    slug: string;
    isAds: boolean;
    teamId: number;
    description: string;
    members: IUserTeam[];
    facebook: string | null;
    coverUrl: string | null;
    panoramaUrl: string | null;
    createdAt: Date;
    updatedAt: Date;

    load?: boolean;
}

export interface IUserTeam {
    role: string;
    joinedAt: Date;
    confirmed: boolean;
    user: IMemberTeam;
}

export interface IUserBookContributor {
    role: string;
    joinedAt: Date;
    confirmed: boolean;
    user: IMemberTeam;
}

export interface IMemberTeam {
    name: string;
    roleId: number;
    userId: number;
    username: string;
    avatarUrl: string | null;
}
