"use client";

import { Dispatch, SetStateAction, ReactNode } from "react";
import dynamic from "next/dynamic";
import IconTrash from "@/components/Modules/Icons/IconTrash";
import IconLoadingSpin from "@/components/Modules/Icons/IconLoadingSpin";

const Modal = dynamic(() => import("./Modal"), { ssr: false });

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    title?: string;
    message?: string | ReactNode;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void | Promise<void>;
    isLoading?: boolean;
    loadingText?: string;
    variant?: "danger" | "warning";
    icon?: ReactNode;
}

const ConfirmDeleteModal = ({
    isOpen,
    setIsOpen,
    title = "Xóa?",
    message = "Bạn có chắc chắn muốn xóa? Hành động này không thể hoàn tác.",
    confirmText = "Xóa",
    cancelText = "Hủy",
    onConfirm,
    isLoading = false,
    loadingText,
    variant = "danger",
    icon,
}: ConfirmDeleteModalProps) => {
    const handleConfirm = async () => {
        try {
            await onConfirm();
        } catch (error) {
            // Error handling is done in the parent component
        }
    };

    const handleCancel = () => {
        if (!isLoading) {
            setIsOpen(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            size="small"
            title={title}
        >
            <div className="flex flex-col items-center text-center space-y-4">
                {icon || (
                    <div
                        className={`flex items-center justify-center w-16 h-16 rounded-full ${
                            variant === "danger"
                                ? "bg-red-100 dark:bg-red-900/20"
                                : "bg-yellow-100 dark:bg-yellow-900/20"
                        }`}
                    >
                        <IconTrash
                            size="24"
                            className={
                                variant === "danger"
                                    ? "fill-red-600 dark:fill-red-400"
                                    : "fill-yellow-600 dark:fill-yellow-400"
                            }
                        />
                    </div>
                )}

                <div className="">
                    {typeof message === "string" ? (
                        <p className="text-sm md:text-base leading-relaxed">
                            {message}
                        </p>
                    ) : (
                        message
                    )}
                </div>

                <div className="flex items-center justify-center gap-3 w-full mt-6 pt-4">
                    <button
                        type="button"
                        title={cancelText}
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-md border border-accent-20 text-foreground bg-background hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px]"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        title={confirmText}
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className={`px-4 py-2 rounded-md border border-accent-20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px] flex items-center justify-center gap-2 ${
                            variant === "danger"
                                ? "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                                : "bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600"
                        }`}
                    >
                        {isLoading ? (
                            <>
                                <IconLoadingSpin size={14} />
                                {loadingText || confirmText}
                            </>
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmDeleteModal;

