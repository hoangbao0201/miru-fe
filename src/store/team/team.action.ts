import { createAsyncThunk } from "@reduxjs/toolkit";
import { UpsertTeamParameterType } from "./team.type";
import { getDetailTeamApi, upsertTeamApi } from "./team.api";

export const getDetailTeamAction = createAsyncThunk(
    "team/getDetailTeamAction",
    async (teamId: number, thunkAPI) => {
        try {
            const res = await getDetailTeamApi(teamId);
            return res;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.response.data.message });
        }
    }
);

export const upsertTeamAction = createAsyncThunk(
    "team/upsertTeamApi",
    async (params: UpsertTeamParameterType, thunkAPI) => {
        try {
            const res = await upsertTeamApi(params);
            return res;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.response.data.message });
        }
    }
);