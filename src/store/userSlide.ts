import { IDataUser } from "@/services/user.services";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface RootStateUserSlide {
    userSlide: UserSlideProps;
}

export interface UserSlideProps {
    user: IDataUser | null;
    status: "loading" | "authenticated" | "unauthenticated";
}
const initialState: UserSlideProps = {
    user: null,
    status: "loading"
};
export const userSlide = createSlice({
    name: "userSlide",
    initialState,
    reducers: {
        initialUserData: (state, action: PayloadAction<UserSlideProps>) => {
            state.user = action?.payload?.user;
            state.status = action?.payload?.status;
        },
    },
});

export const { initialUserData } = userSlide.actions;

export default userSlide.reducer;
