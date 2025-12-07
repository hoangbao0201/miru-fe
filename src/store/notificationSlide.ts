import { GetNotificationsProps } from "@/services/comment.services";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface RootStateNotificationSlide {
    notificationSlide: NotificationSlideProps
}

export interface NotificationSlideProps {
    notifications: GetNotificationsProps[],
    isLoading: boolean
}
const initialState: NotificationSlideProps = {
    notifications: [],
    isLoading: true,
};
export const notificationSlide = createSlice({
    name: "notificationSlide",
    initialState,
    reducers: {
        setNotifications: (state, action: PayloadAction<GetNotificationsProps[]>) => {
            state.notifications = action.payload;
            state.isLoading = false;
        },
        addNotifications: (state, action: PayloadAction<GetNotificationsProps>) => {
            state.notifications.unshift(action.payload)
        },
        setReadNotification: (state, action: PayloadAction<{ commentId: number }>) => {
            const indexNotification = state.notifications.findIndex(comment => comment?.commentId === action.payload.commentId);
            if(indexNotification !== -1) {
                state.notifications[indexNotification].isRead = true;
            }
        },
    },
});

export const {
    setNotifications,
    addNotifications,
    setReadNotification,
} = notificationSlide.actions;

export default notificationSlide.reducer;