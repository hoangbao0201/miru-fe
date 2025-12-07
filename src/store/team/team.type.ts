import { IUserTeam } from "../admin-manager-teams/admin-manager-teams.type";

export enum UserRoleTeam {
    admin = "admin",
    member = "member",
}

// GetBasicListTeam

export interface GetBasicListTeamResType {
    success: boolean;
    data: {
        teamId: number;
        name: string;
        slug: string;
        coverUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            members: number;
        };
    }[]
}

// GetDetailTeam

export interface GetDetailTeamParameterType {
    name: string;
    coverUrl: string | null;
    facebook: string | null;
    description: string | null;
    panoramaUrl: string | null;
}
export interface GetDetailTeamResType {
    success: boolean;
    data: DetailTeamType;
}

// CreateTeam

export interface UpsertTeamParameterType {
    teamId?: number;
    name: string;
    coverUrl: string | null;
    facebook: string | null;
    description: string | null;
    panoramaUrl: string | null;
}
export interface UpsertTeamResType {
    success: boolean;
    data: {
        teamId: number;
    };
}

// AddMember

export interface AddMemberTeamParameterType {
    teamId: number;
    email: string;
    roleTeam?: UserRoleTeam;
}

export interface AddMemberTeamResType {
    success: boolean;
    data: IUserTeam;
}

// Out Member

export interface OutMemberTeamParameterType {
    teamId: number;
    userId: number;
}
export interface OutMemberTeamResType {
    success: boolean;
}

// Remove Member (Admin only)

export interface RemoveMemberTeamParameterType {
    teamId: number;
    userId: number;
}
export interface RemoveMemberTeamResType {
    success: boolean;
}

// --

export interface DataPendingInvitationsTeamType {
    team: {
        slug: string;
        name: string;
        teamId: number;
        covers?: {
            url: string;
            index: number;
            width: number;
            height: number;
            dominantColor: string;
        }[];
        posters?: {
            url: string;
            index: number;
            width: number;
            height: number;
            dominantColor: string;
        }[];
    };
}

export interface GetDataPendingInvitationsTeamResType {
    success: boolean;
    data: DataPendingInvitationsTeamType[];
}

// --

export interface JoinTeamParameterType {
    teamId: number;
}

export interface JoinTeamResType {
    success: boolean;
}

// --

export interface DetailTeamType {
    teamId: number;
    name: string;
    coverUrl: string;
    panoramaUrl: string;
    facebook: string | null;
    description: string | null;
}
