"use client";

import {
    Dispatch,
    RefObject,
    useEffect,
} from "react";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import FormIcon from "../FormIcon";

interface EditorCommentProps {
    editorRef: RefObject<ReactQuill>;
    placeholder?: string;
    editorState: string;
    setEditorState: Dispatch<React.SetStateAction<string>>;
}
const EditorComment = ({
    editorRef,
    placeholder,
    editorState,
    setEditorState,
}: EditorCommentProps) => {
    const handleInsertIcon = (icon: string) => {
        const content = editorState + "<p>" + icon + "</p>"; 
        setEditorState(content);
    }
    const eventOnchangeValue = (value: string) => {
        setEditorState(value)
    }

    useEffect(() => {
        editorRef?.current?.focus();
    }, []);

    return (
        <>
            <div className="">
                <div className="pt-1 pb-1 px-1 border-b">
                    <FormIcon handleInsertIcon={handleInsertIcon}/>
                </div>
                <div className="px-3 py-3" onDrop={(e) => e.preventDefault()}>
                    <ReactQuill
                        ref={editorRef}
                        theme="bubble"
                        value={editorState}
                        onChange={eventOnchangeValue}
                        modules={{
                            toolbar: false,
                            clipboard: {
                                matchVisual: false,
                            }
                        }}
                        className="text-[17px] break-all"
                    />
                </div>
            </div>
        </>
    );
};

export default EditorComment;
