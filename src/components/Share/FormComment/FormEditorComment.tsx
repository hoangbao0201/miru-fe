"use client"

import Link from "next/link";
import dynamic from "next/dynamic";
import { Dispatch, RefObject, SetStateAction, useState } from "react";

import ReactQuill from "react-quill";

import { Env } from "@/config/Env";
import AvatarWithOutline from "../AvatarWithOutline";
import { IGetUserMe } from "@/services/user.services";

const { NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO } = Env

const EditorComment = dynamic(() => import("./CardComment/EditorComment"), {
    ssr: false,
});

interface FormEditorCommentProps {
    receiver: any
    isReply: boolean
    sender?: IGetUserMe;
    dataComment: string;
    isEditorComment: boolean;
    handleSendComment: () => void;
    editorRef: RefObject<ReactQuill>;
    setDataComment: Dispatch<SetStateAction<string>>
}
const FormEditorComment = ({
    editorRef,
    sender,
    isReply,
    dataComment,
    setDataComment,
    isEditorComment,
    handleSendComment,
}: FormEditorCommentProps) => {
    const [isFormEditor, setIsFormEditor] = useState(isEditorComment);

    const handleShowFormEditor = () => {
        if(!sender) {
            alert("Bạn chưa đăng nhập tài khoản");
            return;
        }
        setIsFormEditor(true);
    }

    return (
        <div className="flex py-2 px-2 -mx-2 rounded-md">
            <div className="flex-shrink-0">
                <Link aria-label={`${sender?.name}`} href={`/`}>
                    <AvatarWithOutline
                        avatarUrl={`${
                            sender
                                ? sender.avatarUrl
                                    ? NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO +
                                        "/" +
                                        sender.avatarUrl
                                    : "/static/images/avatar_default.png"
                                : "/static/images/avatar_default.png"
                        }`}
                        outlineUrl={
                            sender?.equippedItem.avatarOutline
                                ?.imageOriginalUrl || ""
                        }
                        size={!isReply ? 32 : 28}
                    />
                </Link>
            </div>
            <div className="w-full flex-1 flex-shrink-0 ml-2">
                <div
                    className="rounded-md bg-accent-20 mb-2 min-h-[44px] transition-all"
                    onClick={handleShowFormEditor}
                >
                    {isFormEditor ? (
                        <>
                            <div className="">
                                <EditorComment
                                    editorRef={editorRef}
                                    editorState={dataComment}
                                    setEditorState={setDataComment}
                                    placeholder="Viết bình luận..."
                                />
                            </div>
                        </>
                    ) : (
                        <div className="leading-[44px] px-3 cursor-text">Viết bình luận...</div>
                    )}
                </div>
                <div className="flex space-x-2">
                    <input
                        className="w-full bg-accent-10 px-3 py-2 h-[42px] rounded-md"
                        disabled={true}
                        value={sender?.name || " "}
                    />
                    <button
                        title="Nút gởi tin nhắn"
                        onClick={() => handleSendComment()}
                        className={`${!sender && "pointer-events-none"} select-none rounded-md ml-auto h-[42px] leading-[42px] min-w-[80px]`}
                    >
                        Gửi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FormEditorComment;
