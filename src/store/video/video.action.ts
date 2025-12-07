import { createAsyncThunk } from "@reduxjs/toolkit";
import { getListVideoApi } from "./video.api";
import { IParamsGetListVideoType } from "./video.types";

export const getListVideoAction = createAsyncThunk(
    "video/getListVideoActiongetListVideoAction",
    async (data: IParamsGetListVideoType, thunkAPI) => {
        try {
            const res = await getListVideoApi(data);
            return res;
            // @typescript-eslint/no-explicit-any
        } catch (error: unknown) {
            if (error instanceof Error) {
                return thunkAPI.rejectWithValue({ error: error.message });
            }
            return thunkAPI.rejectWithValue({ error: String(error) });
        }
    }
);
