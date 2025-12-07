"use client";

import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { Transition } from "@headlessui/react";
import { useOnClickOutside } from "usehooks-ts";
import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { socket } from "@/lib/socket";
import IconClose from "@/components/Modules/Icons/IconClose";
import IconComments from "@/components/Modules/Icons/IconComments";
import chatService, { GetChatMessageProps } from "@/services/chat.services";
import {
    RootStateChatSlide,
    addChats,
    setChats,
    setCountMember,
    setIsShowChatbox,
    setSuccessChat,
    setUnreadCount,
} from "@/store/chatSlide";
import classNames from "@/utils/classNames";

const FormChat = dynamic(() => import("./FormChat"), {
    ssr: false,
    loading: () => <div className="text-center py-3">Loading...</div>,
});

const ChatBox = () => {
    const dispatch = useDispatch();
    const { data: session, status } = useSession();
    const formMessageRef = useRef<HTMLDivElement>(null);

    const chatSlide = useSelector(
        (state: RootStateChatSlide) => state.chatSlide
    );

    // Handle Get List Message
    const handleGetListMessage = async () => {
        try {
            const messagesRes = await chatService.findAllMessage();

            if (messagesRes?.success) {
                dispatch(setChats([...messagesRes?.messages]));
            }
        } catch (error) {}
    };

    const onReceiverChatbox = useCallback((chatRes: any) => {
        const chat = chatRes?.message;
        if (chat && chatRes?.success) {
            const {
                chatId,
                socketId,
                format,
                chatText,
                createdAt,
                sender,
            }: GetChatMessageProps = chat;

            if (socket.id === socketId) {
                dispatch(
                    setSuccessChat({
                        chatId,
                        createdAt,
                    })
                );
            } else {
                dispatch(
                    addChats({
                        format,
                        sender,
                        chatText,
                        socketId,
                        createdAt,
                    })
                );
            }
        } else {
            if (chat?.sender?.userId === session?.user.userId) {
                alert(chatRes?.message);
            }
        }
    }, []);

    // const onCountMemberOnline = useCallback((data: any) => {
    //     if (data?.success) {
    //         dispatch(setCountMember(data?.countMember));
    //     }
    // }, []);

    useEffect(() => {
        let isFirstCall = true;

        const handleReconnect = () => {
            if (isFirstCall) {
                console.log("Fetching messages on initial connect...");
                isFirstCall = false;
                handleGetListMessage();
            }
        };

        const handleDisconnect = () => {
            isFirstCall = true;
        };

        if (socket.connected) {
            handleReconnect();
        }

        socket.on("connect", handleReconnect);
        socket.on("disconnect", handleDisconnect);
        // socket.on("count-member", onCountMemberOnline);
        socket.on("message-./miru-fe/src", onReceiverChatbox);

        return () => {
            socket.off("connect", handleReconnect);
            socket.off("disconnect", handleDisconnect);
            // socket.off("count-member", onCountMemberOnline);
            socket.off("message-./miru-fe/src", onReceiverChatbox);
        };
    }, []);

    useOnClickOutside(formMessageRef, () => {
        dispatch(setIsShowChatbox(false));
    });

    const handleToggleMessageForm = () => {
        dispatch(setIsShowChatbox(!chatSlide?.isShowChatbox));
    };

    useEffect(() => {
        if (chatSlide?.isShowChatbox) {
            dispatch(setUnreadCount(0));
        }
    }, [chatSlide?.isShowChatbox]);

    if (status === "loading") {
        return null;
    }

    return (
        <>
            <div
                ref={formMessageRef}
                className="relative w-10 h-10 rounded-md bg-primary border border-accent-10"
            >
                <button
                    title="Chat box"
                    className={`w-10 h-10 select-none cursor-pointer relative button-chatbox ${
                        chatSlide?.isShowChatbox ? "active" : ""
                    }`}
                    onClick={handleToggleMessageForm}
                >
                    <IconClose className="button-hidden-chatbox absolute top-0 fill-white w-10 h-10 p-[10px]" />
                    <IconComments className="button-show-chatbox absolute top-0 fill-white w-10 h-10 p-[10px]" />

                    {chatSlide?.unreadCount !== 0 && (
                        <div className="absolute -top-[4px] -right-[11px]">
                            <span className="relative flex h-[10px] w-[10px] mr-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-[10px] w-[10px] bg-error"></span>
                            </span>
                        </div>
                    )}
                </button>

                <Transition
                    show={chatSlide?.isShowChatbox}
                    enter="transition-all duration-75"
                    enterFrom="opacity-0 scale-90"
                    enterTo="opacity-100 scale-100"
                    leave="transition-all duration-150"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-90"
                    className={classNames(
                        "chatbox bg-accent border border-accent-10 animation-bottom-right rounded-lg overflow-hidden fixed md:top-16 top-3 bottom-[100px] right-3 left-3 md:left-auto md:w-[400px] flex flex-col"
                    )}
                >
                    <FormChat />
                </Transition>
            </div>
        </>
    );
};

export default ChatBox;
