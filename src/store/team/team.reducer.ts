import { createSlice } from "@reduxjs/toolkit";

interface IInitialState {
}

const initialState: IInitialState = {
};

const TeamsSlice = createSlice({
    name: "team",
    initialState,
    reducers: {
        resetTeamState: () => initialState
    },

    extraReducers: (builder) => {
    },
});
export const { resetTeamState } = TeamsSlice.actions;
export default TeamsSlice.reducer;
