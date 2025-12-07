import { createSlice } from "@reduxjs/toolkit";
import { IItemVideoType } from "./video.types";
import { MetaPagination } from "@/constants/type";
import { getListVideoAction } from "./video.action";

interface IInitialState {
    listVideo: {
        data: IItemVideoType[];
        meta: MetaPagination | null;
        load: boolean;
        error: string;
    };
}

const initialState: IInitialState = {
    listVideo: {
        data: [],
        meta: null,
        load: true,
        error: "",
    },
};

const VideoSlice = createSlice({
    name: "video",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        // getListVideoAction

        // builder.addCase(
        //     getListVideoAction.pending,
        //     (state: IInitialState): IInitialState => {
        //         return {
        //             ...state,
        //             listVideo: {
        //                 ...state.listVideo,
        //                 load: true,
        //             },
        //         };
        //     }
        // );
        // builder.addCase(
        //     getListVideoAction.fulfilled,
        //     (state: IInitialState, action): IInitialState => {
        //         return {
        //             ...state,
        //             listVideo: {
        //                 data: action.payload.data.videos,
        //                 meta: action.payload.meta,
        //                 load: false,
        //                 error: "",
        //             },
        //         };
        //     }
        // );
        // builder.addCase(
        //     getListVideoAction.rejected,
        //     (state: IInitialState): IInitialState => ({
        //         ...state,
        //         listVideo: {
        //             data: [],
        //             meta: null,
        //             load: false,
        //             error: "",
        //         },
        //     })
        // );
    },
});
export const {} = VideoSlice.actions;
export default VideoSlice.reducer;
