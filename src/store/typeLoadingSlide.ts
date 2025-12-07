import { createSlice } from "@reduxjs/toolkit";

export interface RootStateTypeLoadingSlide {
    typeLoading: TypeLoadingProps
}
interface TypeLoadingProps {
    nameTypeLoading: string;
}
const initialState: TypeLoadingProps = {
    nameTypeLoading: "",
};

export const typeLoadingSlide = createSlice({
    name: "typeLoadingSlide",
    initialState,
    reducers: {
        setTypeLoading: (state, action) => {
            state.nameTypeLoading = action.payload;
        },
    },
});

export const { setTypeLoading } = typeLoadingSlide.actions;

export default typeLoadingSlide.reducer;
