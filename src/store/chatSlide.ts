import { GetChatMessageProps } from "@/services/chat.services";
import { createSlice } from "@reduxjs/toolkit";

export interface RootStateChatSlide {
    chatSlide: ChatSlideProps;
}

export interface ChatSlideProps {
    chats: GetChatMessageProps[];
    unreadCount: number;
    countMember: number;
    isLoading: boolean;
    isShowChatbox: boolean;
}
const initialState: ChatSlideProps = {
    chats: [],
    countMember: 0,
    unreadCount: 0,
    isShowChatbox: false,
    isLoading: true,
};
export const chatSlide = createSlice({
    name: "chatSlide",
    initialState,
    reducers: {
        setCountMember: (state, action) => {
            state.countMember = action.payload;
        },
        setChats: (state, action: { payload: GetChatMessageProps[] }) => {
            state.isLoading = false;
            state.chats = action.payload;
            state.unreadCount = action.payload.length;
        },
        addChats: (state, action: { payload: Omit<GetChatMessageProps, "chatId"> }) => {
            if (state?.chats) {
                state.chats.push({
                    chatId: state.chats[state.chats.length - 1].chatId + 1,
                    ...action?.payload,
                });
            }

            if (!state?.isShowChatbox) {
                state.unreadCount++;
            }
        },
        setSuccessChat: (
            state,
            action: {
                payload: {
                    chatId: number;
                    createdAt: Date | null;
                };
            }
        ) => {
            const findIndex = state.chats.findIndex(
                (dt) =>
                    dt.chatId === action.payload.chatId &&
                    dt.createdAt === null
            );

            if (findIndex !== -1) {
                state.chats[findIndex].createdAt = action.payload.createdAt;
            }
        },
        setUnreadCount: (state, action) => {
            state.unreadCount = action.payload;
        },
        setIsShowChatbox: (state, action) => {
            state.isShowChatbox = action.payload;
        },
    },
});

export const {
    setChats,
    addChats,
    setCountMember,
    setUnreadCount,
    setSuccessChat,
    setIsShowChatbox,
} = chatSlide.actions;

export default chatSlide.reducer;
