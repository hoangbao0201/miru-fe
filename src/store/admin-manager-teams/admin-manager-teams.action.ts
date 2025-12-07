import { createAsyncThunk } from "@reduxjs/toolkit";
import { getListTeamsAdminManagerApi } from "./admin-manager-teams.api";
import { ParameterGetListTeamsAdminManager } from "./admin-manager-teams.type";
import { AddMemberTeamParameterType, OutMemberTeamParameterType, RemoveMemberTeamParameterType } from "../team/team.type";
import { addMemberTeamApi, outMemberTeamApi, removeMemberTeamApi } from "../team/team.api";

export const getListTeamsAdminManagerAction = createAsyncThunk(
    "adminManagerTeams/getTeamsAdminManagerAction",
    async (params: ParameterGetListTeamsAdminManager, thunkAPI) => {
        try {
            const res = await getListTeamsAdminManagerApi(params);
            return res;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    }
);

export const addMemberTeamsAdminManagerAction = createAsyncThunk(
    "adminManagerTeams/addMemberTeamsAdminManagerAction",
    async (params: AddMemberTeamParameterType, thunkAPI) => {
        try {
            const res = await addMemberTeamApi(params);
            return res;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.response.data.message });
        }
    }
);

export const outMemberTeamsAdminManagerAction = createAsyncThunk(
    "adminManagerTeams/outMemberTeamsAdminManagerAction",
    async (params: OutMemberTeamParameterType, thunkAPI) => {
        try {
            const res = await outMemberTeamApi(params);
            return res;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    }
);

export const removeMemberTeamsAdminManagerAction = createAsyncThunk(
    "adminManagerTeams/removeMemberTeamsAdminManagerAction",
    async (params: RemoveMemberTeamParameterType, thunkAPI) => {
        try {
            const res = await removeMemberTeamApi(params);
            return res;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.response?.data?.error || error.message });
        }
    }
);
