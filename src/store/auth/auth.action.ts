import { createAsyncThunk } from "@reduxjs/toolkit";
import auth from "./auth.api";

const getCurrentUserAction = createAsyncThunk(
    "auth/getCurrentUserAction",
    async (_, thunkAPI) => {
        try {
            const res = await auth.getCurrentUser();
            return res;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({
                error: error.response.data.message,
            });
        }
    }
);

export {
    getCurrentUserAction
}