import React from "react";
import { toast, type ExternalToast } from "sonner";

// Định nghĩa các loại toast
export enum NotificationTypeEnum {
    "default" = "default",
    "success" = "success",
    "info" = "info",
    "warning" = "warning",
    "error" = "error",
    "loading" = "loading",
    "promise" = "promise",
    "custom" = "custom",
}

export type ToastType = keyof typeof NotificationTypeEnum;

// Interface cho ShowToast options
interface ShowToastOptions extends Omit<ExternalToast, "id"> {
    type?: ToastType;
    id?: string | number;
    // Thêm các options tùy chỉnh
    autoClose?: boolean;
    closeDelay?: number;
}

// Interface cho Promise toast
interface PromiseToastData<T = any> {
    loading?: string | React.ReactNode;
    success?:
        | string
        | React.ReactNode
        | ((data: T) => string | React.ReactNode);
    error?:
        | string
        | React.ReactNode
        | ((error: any) => string | React.ReactNode);
    description?:
        | string
        | React.ReactNode
        | ((data: T) => string | React.ReactNode);
    finally?: () => void | Promise<void>;
}

// Main ShowToast function
export const ShowToast = {
    // Toast thông thường
    show: (message: string | React.ReactNode, options?: ShowToastOptions) => {
        const { type = "default", ...restOptions } = options || {};

        switch (type) {
            case "success":
                return toast.success(message, restOptions);
            case "info":
                return toast.info(message, restOptions);
            case "warning":
                return toast.warning(message, restOptions);
            case "error":
                return toast.error(message, restOptions);
            case "loading":
                return toast.loading(message, restOptions);
            default:
                return toast(message, restOptions);
        }
    },

    // Success toast
    success: (
        message: string | React.ReactNode,
        options?: ShowToastOptions
    ) => {
        return toast.success(message, options);
    },

    // Info toast
    info: (message: string | React.ReactNode, options?: ShowToastOptions) => {
        return toast.info(message, options);
    },

    // Warning toast
    warning: (
        message: string | React.ReactNode,
        options?: ShowToastOptions
    ) => {
        return toast.warning(message, options);
    },

    // Error toast
    error: (message: string | React.ReactNode, options?: ShowToastOptions) => {
        return toast.error(message, options);
    },

    // Loading toast
    loading: (
        message: string | React.ReactNode,
        options?: ShowToastOptions
    ) => {
        return toast.loading(message, options);
    },

    // Promise toast
    promise: <T = any>(
        promise: Promise<T> | (() => Promise<T>),
        messages: PromiseToastData<T>,
        options?: ShowToastOptions
    ) => {
        return toast.promise(promise, messages);
    },

    // Custom toast với JSX
    custom: (
        jsx: (id: string | number) => React.ReactElement,
        options?: ShowToastOptions
    ) => {
        return toast.custom(jsx, options);
    },

    // Message toast (alias cho show)
    message: (
        message: string | React.ReactNode,
        options?: ShowToastOptions
    ) => {
        return toast.message(message, options);
    },

    // Dismiss toast
    dismiss: (id?: string | number) => {
        return toast.dismiss(id);
    },

    // Dismiss all toasts
    dismissAll: () => {
        return toast.dismiss();
    },

    // Get toast history
    getHistory: () => {
        return toast.getHistory();
    },

    // Get current toasts
    // getToasts: () => {
    //     return toast.getToasts();
    // },

    // Utility methods
    utils: {
        // Tạo toast với auto dismiss
        showWithAutoClose: (
            message: string | React.ReactNode,
            type: ToastType = "default",
            delay: number = 3000,
            options?: ShowToastOptions
        ) => {
            const toastId = ShowToast.show(message, {
                ...options,
                type,
                duration: delay,
            });

            // Auto dismiss sau delay
            setTimeout(() => {
                ShowToast.dismiss(toastId);
            }, delay);

            return toastId;
        },

        // Tạo toast confirmation
        confirm: (
            message: string | React.ReactNode,
            onConfirm: () => void,
            onCancel?: () => void,
            options?: ShowToastOptions
        ) => {
            return toast(message, {
                ...options,
                action: {
                    label: "Confirm",
                    onClick: (event) => {
                        event.preventDefault();
                        onConfirm();
                    },
                },
                cancel: onCancel
                    ? {
                          label: "Cancel",
                          onClick: (event) => {
                              event.preventDefault();
                              onCancel();
                          },
                      }
                    : undefined,
            });
        },

        // Tạo toast với action button
        withAction: (
            message: string | React.ReactNode,
            actionLabel: string,
            onAction: () => void,
            options?: ShowToastOptions
        ) => {
            return toast(message, {
                ...options,
                action: {
                    label: actionLabel,
                    onClick: (event) => {
                        event.preventDefault();
                        onAction();
                    },
                },
            });
        },

        // Tạo toast sequence (hiện nhiều toast theo thứ tự)
        sequence: async (
            messages: Array<{
                message: string | React.ReactNode;
                type?: ToastType;
                delay?: number;
                options?: ShowToastOptions;
            }>
        ) => {
            for (const item of messages) {
                ShowToast.show(item.message, {
                    ...item.options,
                    type: item.type,
                });
                if (item.delay) {
                    await new Promise((resolve) =>
                        setTimeout(resolve, item.delay)
                    );
                }
            }
        },
    },
};

export default ShowToast;
