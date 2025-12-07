import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getCurrentUserAction } from "./auth.action";
import { AuthState, GetCurrentUserResponse } from "./auth.type";

const initialState: AuthState = {
    error: "",
    loading: false,
    user: undefined,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUserAuth: (
            state: AuthState,
            action: PayloadAction<AuthState['user']>
        ) => ({
            ...state,
            user: action.payload,
        }),
        setErrorAuth: (state: AuthState, action: any) => ({
            ...state,
            error: action.payload,
        }),
        clearAuth: (state: AuthState) => {
            state.user = undefined;
            state.error = "";
            state.loading = false;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(getCurrentUserAction.pending, (state: AuthState) => ({
                ...state,
                error: "",
                loading: true,
            }))
            .addCase(getCurrentUserAction.fulfilled, (state: AuthState, action: { payload: GetCurrentUserResponse }) => {
                return {
                    ...state,
                    user: action.payload.user,
                    error: "",
                    loading: false,
                };
            })
            .addCase(getCurrentUserAction.rejected, (state: AuthState, action: any) => {
                const { error } = action.payload || { error: "error" };
                return {
                    ...state,
                    user: undefined,
                    error,
                    loading: false,
                };
            });
    },
});

export const { setUserAuth, setErrorAuth, clearAuth } = authSlice.actions;

export default authSlice.reducer;
