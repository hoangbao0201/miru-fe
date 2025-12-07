import { configureStore } from "@reduxjs/toolkit";
import {
    FLUSH,
    PAUSE,
    PERSIST,
    PersistConfig,
    persistReducer,
    PURGE,
    REGISTER,
    REHYDRATE,
} from "redux-persist";

import userSlide from "./userSlide";
import chatSlide from "./chatSlide";
import teamSlide from "./team/team.reducer";
import authSlice from "./auth/auth.reducer";
import { AuthState } from "./auth/auth.type";
import typeLoadingSlide from "./typeLoadingSlide";
import notificationSlide from "./notificationSlide";
import commentSlide from "./comment/comment.reducer";
import chapterSlice from "./chapter/chapter.reducer";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import adminManagerTeams from "./admin-manager-teams/admin-manager-teams.reducer";
import { bookApi } from "./book/book.public.api";
import { chapterApi } from "./chapter/chapter.public.api";

const createNoopStorage = () => ({
    // eslint-disable-next-line no-unused-vars
    getItem(_key: any) {
        return Promise.resolve(null);
    },
    // eslint-disable-next-line no-unused-vars
    setItem(_key: any, value: any) {
        return Promise.resolve(value);
    },
    // eslint-disable-next-line no-unused-vars
    removeItem(_key: any) {
        return Promise.resolve();
    },
});

const storage =
    typeof window !== "undefined"
        ? createWebStorage("local")
        : createNoopStorage();

const authPersistConfig: PersistConfig<AuthState> = {
    key: "user",
    storage,
    whitelist: ["user"],
};

export const store = configureStore({
    reducer: {
        // RTK Query API reducer (required for caching & automatic reducerPath)
        [bookApi.reducerPath]: bookApi.reducer,
        [chapterApi.reducerPath]: chapterApi.reducer,
        authSlice: persistReducer<AuthState>(authPersistConfig, authSlice),
        userSlide: userSlide,
        teamSlide: teamSlide,
        chatSlide: chatSlide,
        chapterSlice: chapterSlice,
        commentSlide: commentSlide,
        typeLoading: typeLoadingSlide,
        adminManagerTeams: adminManagerTeams,
        notificationSlide: notificationSlide,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }).concat(bookApi.middleware).concat(chapterApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
