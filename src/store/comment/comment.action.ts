import { createAsyncThunk } from "@reduxjs/toolkit";
import { ICreateCommentParamsType, IDeleteCommentParamsType, IGetCommentsParamsType, createCommentApi, deleteCommentApi, getCommentsApi } from "./comment.api";
import { FetchHeadersType } from "@/constants/type";


export const createCommentAction = createAsyncThunk(
    "comment/createCommentAction",
    async ({ data, headers }: { data: ICreateCommentParamsType, headers: FetchHeadersType }, thunkAPI) => {
        try {
            const res = await createCommentApi({ data, headers });
            return res;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.response.data.message });
        }
    }
);
export const createReplyCommentAction = createAsyncThunk(
    "comment/createReplyCommentAction",
    async ({ data, headers }: { data: ICreateCommentParamsType, headers: FetchHeadersType }, thunkAPI) => {
        try {
            const res = await createCommentApi({ data, headers });
            return res;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.response.data.message });
        }
    }
);

export const getCommentsAction = createAsyncThunk(
    "comment/getCommentsAction",
    async ({ data, headers }: { data: IGetCommentsParamsType, headers: FetchHeadersType }, thunkAPI) => {
        try {
            const res = await getCommentsApi({ data, headers });
            return res;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.response.data.message });
        }
    }
);

export const getReplyCommentsAction = createAsyncThunk(
    "comment/getReplyCommentsAction",
    async ({ data, headers }: { data: IGetCommentsParamsType, headers: FetchHeadersType }, thunkAPI) => {
        try {
            const res = await getCommentsApi({ data, headers });
            return res;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.response.data.message });
        }
    }
);

export const deleteCommentAction = createAsyncThunk(
    "comment/deleteCommentAction",
    async ({ data, headers }: { data: IDeleteCommentParamsType, headers: FetchHeadersType }, thunkAPI) => {
        try {
            const res = await deleteCommentApi({ data, headers });
            return res;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.response.data.message });
        }
    }
);