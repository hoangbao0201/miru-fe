"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";

import { useAppDispatch } from "@/store/store";
import DropdownButton from "../../DropdownButton";
import { setTypeLoading } from "@/store/typeLoadingSlide";
import IconTrash from "@/components/Modules/Icons/IconTrash";
import { TypeCommentEnum } from "@/store/comment/comment.reducer";
import IconEllipsis from "@/components/Modules/Icons/IconEllipsis";
import { deleteCommentAction } from "@/store/comment/comment.action";

const ConfirmDeleteModal = dynamic(() => import("../../ConfirmDeleteModal"), { ssr: false });

interface ButtonActionProps {
    parentId?: number | null;
    type: TypeCommentEnum;
    commentId: number;
    senderId: number;
}

const ButtonAction = ({ type, parentId, commentId, senderId }: ButtonActionProps) => {
    const dispatch = useAppDispatch();
    
    const { data: session, status } = useSession();
    const [isOptions, setIsOptions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFormDeleteBlog, setIsFormDeleteBlog] = useState(false);

    const handleEditComment = async () => {
        try {
            // TODO: Implement edit comment functionality
        } catch (error) {
            // Error handling
        }
    };

    const handleDeleteComment = async () => {
        if (!session || status !== "authenticated") {
            return;
        }
        
        try {
            setIsLoading(true);

            dispatch(deleteCommentAction({
                data: {
                    type: type,
                    parentId: parentId,
                    commentId: commentId,
                },
                headers: {
                    cache: 'no-cache',
                }
            }));

            dispatch(setTypeLoading(""));
            setIsFormDeleteBlog(false);
        } catch (error) {
            // Error handling
        } finally {
            setIsLoading(false);
        }
    };

    const canDelete = senderId === session?.user.userId || session?.user.role === "ADMIN";

    return (
        <>
            <DropdownButton
                isOptions={isOptions}
                setIsOptions={setIsOptions}
                className="top-full right-0 translate-x-1/2 shadow-lg border border-accent-20 rounded-md bg-accent z-20"
                content={
                    <div className="py-1 min-w-[200px] select-none">
                        {status === "loading" ? (
                            <div className="text-center py-3 text-sm text-muted-foreground">
                                Đang tải...
                            </div>
                        ) : (
                            <>
                                {canDelete && (
                                    <button
                                        onClick={() => {
                                            setIsFormDeleteBlog(true);
                                            setIsOptions(false);
                                        }}
                                        className="w-full px-4 py-2.5 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2 rounded-md mx-1"
                                    >
                                        <IconTrash size="16" className="fill-red-600 dark:fill-red-400" />
                                        <span>Xóa bình luận</span>
                                    </button>
                                )}

                                {/* <button
                                    onClick={handleEditComment}
                                    className="w-full px-4 py-2.5 text-left text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2 rounded-md mx-1"
                                >
                                    <IconPen size="16" />
                                    <span>Chỉnh sửa bình luận</span>
                                </button> */}

                                {/* <button className="w-full px-4 py-2.5 text-left text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2 rounded-md mx-1">
                                    <IconExclamation size="16" />
                                    <span>Báo cáo bình luận</span>
                                </button> */}
                            </>
                        )}
                    </div>
                }
            >
                <span className="cursor-pointer rounded-full hover:bg-muted block transition-colors">
                    <IconEllipsis className="w-5 h-5 p-1 fill-gray-700 dark:fill-gray-100" />
                </span>
            </DropdownButton>

            <ConfirmDeleteModal
                isOpen={isFormDeleteBlog}
                setIsOpen={setIsFormDeleteBlog}
                title="Xóa bình luận?"
                message="Bạn không thể khôi phục bình luận này nếu xóa đi. Bạn có chắc chắn muốn xóa?"
                confirmText="Xóa"
                cancelText="Hủy"
                onConfirm={handleDeleteComment}
                isLoading={isLoading}
                loadingText="Đang xóa..."
                variant="danger"
            />
        </>
    );
};

export default ButtonAction;
