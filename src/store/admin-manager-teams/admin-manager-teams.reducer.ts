import { createSlice } from "@reduxjs/toolkit";
import { MetaPagination } from "@/constants/type";
import { ITeam } from "./admin-manager-teams.type";
import { addMemberTeamsAdminManagerAction, getListTeamsAdminManagerAction, outMemberTeamsAdminManagerAction, removeMemberTeamsAdminManagerAction } from "./admin-manager-teams.action";

interface IInitialState {
    listTeams: {
        data: ITeam[];
        meta: MetaPagination | null;
        load: boolean;
        loadTeam: boolean;
        error: string;
    };
}

const initialState: IInitialState = {
    listTeams: {
        data: [],
        meta: null,
        load: true,
        loadTeam: false,
        error: "",
    },
};

const AdminManagerTeamsSlice = createSlice({
    name: "adminManagerTeams",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        // getListTeamsAdminManagerAction

        builder.addCase(
            getListTeamsAdminManagerAction.pending,
            (state: IInitialState): IInitialState => {
                return {
                    ...state,
                    listTeams: {
                        ...state.listTeams,
                        load: true,
                    },
                };
            }
        );
        builder.addCase(
            getListTeamsAdminManagerAction.fulfilled,
            (state: IInitialState, action: any): IInitialState => {
                return {
                    ...state,
                    listTeams: {
                        data: action.payload.data,
                        meta: action.payload.meta,
                        load: false,
                        loadTeam: false,
                        error: "",
                    },
                };
            }
        );
        builder.addCase(
            getListTeamsAdminManagerAction.rejected,
            (state: IInitialState): IInitialState => ({
                ...state,
                listTeams: {
                    data: [],
                    meta: null,
                    load: false,
                    loadTeam: false,
                    error: "",
                },
            })
        );

        // addMemberTeamsAdminManagerAction
        
        builder.addCase(
            addMemberTeamsAdminManagerAction.pending,
            (state: IInitialState, action: any): IInitialState => {
                return {
                    ...state,
                    listTeams: {
                        ...state.listTeams,
                        loadTeam: true,
                    },
                };
            }
        );
        builder.addCase(
            addMemberTeamsAdminManagerAction.fulfilled,
            (state: IInitialState, action): IInitialState => {
                const teamId = action.meta.arg.teamId;
                const userTeam = action.payload.data;
                const updatedTeams: ITeam[] = state.listTeams.data.map(team => {
                    if (team.teamId === teamId) {
                        return {
                            ...team,
                            members: [...(team.members || []), userTeam]
                        };
                    }
                    return team;
                });

                return {
                    ...state,
                    listTeams: {
                        ...state.listTeams,
                        data: updatedTeams,
                        load: false,
                        loadTeam: false,
                        error: "",
                    },
                };
            }
        );
        builder.addCase(
            addMemberTeamsAdminManagerAction.rejected,
            (state: IInitialState, action: any): IInitialState => {
                return {
                    ...state,
                    listTeams: {
                        ...state.listTeams,
                        load: false,
                        loadTeam: false,
                        error: action.payload?.error || "Add member failed",
                    },

                }
            }
        );

        // outMemberTeamsAdminManagerAction
        
        builder.addCase(
            outMemberTeamsAdminManagerAction.pending,
            (state: IInitialState, action: any): IInitialState => {
                return {
                    ...state,
                    listTeams: {
                        ...state.listTeams,
                        loadTeam: true,
                    },
                };
            }
        );
        builder.addCase(
            outMemberTeamsAdminManagerAction.fulfilled,
            (state: IInitialState, action): IInitialState => {
                const userId = action.meta.arg.userId;
                const teamId = action.meta.arg.teamId;
                const updatedTeams: ITeam[] = state.listTeams.data.map(team => {
                    if (team.teamId === teamId) {
                        return {
                            ...team,
                            members: team.members.filter(member => member.user?.userId !== userId),
                        };
                    }
                    return team;
                });

                return {
                    ...state,
                    listTeams: {
                        ...state.listTeams,
                        data: updatedTeams,
                        load: false,
                        loadTeam: false,
                        error: "",
                    },
                };
            }
        );
        builder.addCase(
            outMemberTeamsAdminManagerAction.rejected,
            (state: IInitialState, action: any): IInitialState => {
                return {
                    ...state,
                    listTeams: {
                        ...state.listTeams,
                        load: false,
                        loadTeam: false,
                        error: action.payload?.error || "Out member failed",
                    },

                }
            }
        );

        // removeMemberTeamsAdminManagerAction
        
        builder.addCase(
            removeMemberTeamsAdminManagerAction.pending,
            (state: IInitialState, action: any): IInitialState => {
                return {
                    ...state,
                    listTeams: {
                        ...state.listTeams,
                        loadTeam: true,
                    },
                };
            }
        );
        builder.addCase(
            removeMemberTeamsAdminManagerAction.fulfilled,
            (state: IInitialState, action): IInitialState => {
                const userId = action.meta.arg.userId;
                const teamId = action.meta.arg.teamId;
                const updatedTeams: ITeam[] = state.listTeams.data.map(team => {
                    if (team.teamId === teamId) {
                        return {
                            ...team,
                            members: team.members.filter(member => member.user?.userId !== userId),
                        };
                    }
                    return team;
                });

                return {
                    ...state,
                    listTeams: {
                        ...state.listTeams,
                        data: updatedTeams,
                        load: false,
                        loadTeam: false,
                        error: "",
                    },
                };
            }
        );
        builder.addCase(
            removeMemberTeamsAdminManagerAction.rejected,
            (state: IInitialState, action: any): IInitialState => {
                return {
                    ...state,
                    listTeams: {
                        ...state.listTeams,
                        load: false,
                        loadTeam: false,
                        error: action.payload?.error || "Remove member failed",
                    },

                }
            }
        );
    },
});
export const {} = AdminManagerTeamsSlice.actions;
export default AdminManagerTeamsSlice.reducer;
