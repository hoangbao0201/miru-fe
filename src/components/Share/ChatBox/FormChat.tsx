import clsx from "clsx";
import Image from "next/image";
import { socket } from "@/lib/socket";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import { Env } from "@/config/Env";
import TextLevel from "../TextLevel";
import { useAppSelector } from "@/store/store";
import imageService from "@/services/image.services";
import getTimeMessage from "@/utils/getTimeMessage";
import AvatarWithOutline from "../AvatarWithOutline";
import IconSend from "@/components/Modules/Icons/IconSend";
import IconMennu from "@/components/Modules/Icons/IconMenu";
import IconClose from "@/components/Modules/Icons/IconClose";
import { RootStateChatSlide, addChats } from "@/store/chatSlide";
import { FormatChatEnum, GetChatMessageProps } from "@/services/chat.services";
import IconImages from "@/components/Modules/Icons/IconImages";

const { NEXT_PUBLIC_TITLE_SEO, NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO } = Env;

interface FormChatProps {}
const FormChat = ({}: FormChatProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const messagesListRef = useRef<HTMLInputElement>(null);

    const dispatch = useDispatch();
    const chatSlide = useSelector(
        (state: RootStateChatSlide) => state.chatSlide
    );
    const { data: session, status } = useSession();
    const { user, loading } = useAppSelector((state) => state.authSlice);

    const [contentMessage, setContentMessage] = useState<string>("");
    const [dataImage, setDataImage] = useState<{
        fileImage: null | File;
        urlImage: string;
    }>({
        fileImage: null,
        urlImage: "",
    });
    const [messageType, setMessageType] = useState<FormatChatEnum>(
        FormatChatEnum.TEXT
    );

    // Handle Send Message
    const handleSendMessage = async () => {
        if (!user || !socket?.id || status !== "authenticated") {
            return;
        }

        try {
            let message = "";
            switch (messageType) {
                case "IMAGE":
                    if (
                        !dataImage?.fileImage
                    ) {
                        return;
                    }
                    const formData = new FormData();
                    formData.append("Filedata", dataImage?.fileImage);
                    const imageUpload = await imageService?.uploadArtworksFile({
                        file: formData,
                        token: session?.backendTokens.accessToken,
                    });
                    if (!imageUpload?.success) {
                        alert("Upload ảnh thất bại");
                        return;
                    }
                    message = imageUpload?.data?.url;
                    setDataImage({ fileImage: null, urlImage: "" });
                    break;
                case "TEXT":
                    if (contentMessage.trim().length === 0) {
                        return;
                    }
                    message = contentMessage;
                    break;
            }

            const dataUser: GetChatMessageProps["sender"] = {
                name: user?.name,
                role: user?.role,
                rank: user?.rank,
                userId: user?.userId,
                username: user?.username,
                avatarUrl: user?.avatarUrl,
                equippedItem: user?.equippedItem,
                strengthMapping: user?.strengthMapping,
            };

            // Send Message Socket
            socket.emit("message-./miru-fe/src", {
                message: message,
                format: messageType,
                token: session?.backendTokens?.accessToken,
            });
            dispatch(
                addChats({
                    createdAt: null,
                    sender: dataUser,
                    chatText: message,
                    format: messageType,
                    socketId: socket?.id,
                })
            );

            setMessageType(FormatChatEnum.TEXT);
            setContentMessage("");
            inputRef?.current?.focus();
        } catch (error) {}
    };

    // Event Onchange Value Send Message
    const eventOnchangeValueSendMessage = (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const value = e.target.value;
        if (value.length > 200) {
            alert("Nội dung không quá 200 kí tự");
            return;
        }
        setContentMessage(value);
    };

    const handleSetImage = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files == null) {
            return;
        }
        const dataImg = e.target.files[0];

        setDataImage({
            fileImage: dataImg,
            urlImage: URL.createObjectURL(dataImg),
        });
        setMessageType(FormatChatEnum.IMAGE);
    };

    const checkScrollPosition = () => {
        const container = messagesListRef.current;
        if (!container) return false;

        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

        return distanceFromBottom <= 20;
    };

    useEffect(() => {
        const currentRef = messagesListRef.current;

        if (currentRef && chatSlide.chats.length) {
            currentRef.scroll({
                top: currentRef.scrollHeight,
                behavior: "auto",
            });

            const observer = new MutationObserver(() => {
                const scrollTop = currentRef.scrollTop;
                const scrollHeight = currentRef.scrollHeight;
                const clientHeight = currentRef.clientHeight;
                const bottom = scrollHeight - scrollTop - clientHeight;

                if (bottom < 500) {
                    currentRef.scroll({
                        top: scrollHeight,
                        behavior: "auto",
                    });
                }
            });

            observer.observe(currentRef, { childList: true });

            return () => {
                observer.disconnect();
            };
        }
    }, [chatSlide.isLoading]);

    return (
        <>
            {/* <div className="chatbox-header"> */}
            <div className="flex-shrink-0 h-[60px] flex items-center px-3 rounded-t-lg border border-accent-10">
                <div className="leading-[56px] font-extrabold text-2xl">MIRUDEX</div>
                <div className="ml-auto pr-3">
                    <div className="text-[15px] font-semibold text-right text-foreground">
                        {user ? user.name : "Ẩn danh"}
                    </div>
                    {/* <div className="flex items-center justify-end">
                        <span className="relative flex h-[10px] w-[10px] mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-[10px] w-[10px] bg-green-400"></span>
                        </span>
                        <div className="text-xs">
                            {chatSlide?.countMember} Thành viên online
                        </div>
                    </div> */}
                </div>
                {user && (
                    <AvatarProfile
                        sender={user}
                        isSender={false}
                        isLastContinual={true}
                    />
                )}
            </div>

            <div
                ref={messagesListRef}
                className="relative h-full overflow-x-hidden overflow-y-auto custom-scroll py-2"
            >
                {/* <div className="z-10 text-sm sticky -top-2 left-0 right-0 bg-slate-900 px-3 py-2">
                    Ghim: Link donate Admin:{" "}
                    <a
                        href={"/donate/admin"}
                        className="font-semibold text-primary underline"
                    >
                        Donate
                    </a>
                </div> */}
                {chatSlide?.chats && status !== "loading" ? (
                    chatSlide?.chats?.map((message, index) => {
                        const isSender = message?.sender
                            ? message?.sender.userId === session?.user.userId
                            : message?.socketId === socket?.id;
                        const isContinual =
                            index >= 1
                                ? chatSlide?.chats[index].socketId ===
                                  chatSlide?.chats[index - 1].socketId
                                : false;
                        const isLastContinual =
                            chatSlide?.chats.length - 2 >= index
                                ? chatSlide?.chats[index].socketId !==
                                      chatSlide?.chats[index + 1].socketId ||
                                  chatSlide?.chats[index].sender?.userId !==
                                      chatSlide?.chats[index + 1].sender?.userId
                                : chatSlide?.chats.length - 1 === index;
                        return (
                            <div
                                key={`${message?.createdAt}`}
                                className={`px-3 ${
                                    isContinual ? "mt-[2px]" : "mt-[12px]"
                                }`}
                            >
                                {!isContinual && (
                                    <h4
                                        className={clsx(
                                            "text-[12px] ml-12 mb-[2px]",
                                            {
                                                "flex justify-end": isSender,
                                            }
                                        )}
                                    >
                                        {message?.sender ? (
                                            <TextLevel
                                                user={message?.sender}
                                                alignment={
                                                    isSender ? "right" : "left"
                                                }
                                            />
                                        ) : (
                                            <span className="text-muted-foreground">
                                                Thành viên ẩn danh
                                            </span>
                                        )}
                                    </h4>
                                )}
                                <div
                                    className={clsx("flex items-stretch", {
                                        "justify-start flex-row-reverse":
                                            isSender,
                                    })}
                                >
                                    <div className="mt-auto">
                                        <AvatarProfile
                                            isSender={isSender}
                                            sender={message?.sender}
                                            isLastContinual={isLastContinual}
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        {message?.format === "IMAGE" ? (
                                            <div
                                                className={`my-1 ${
                                                    isSender ? "max-w-full" : ""
                                                }`}
                                            >
                                                <Image
                                                    unoptimized
                                                    alt="Ảnh"
                                                    width={0}
                                                    height={0}
                                                    sizes="100vw"
                                                    style={{
                                                        width: "100%",
                                                        height: "auto",
                                                    }}
                                                    src={message?.chatText}
                                                    className="object-cover rounded-lg"
                                                />
                                            </div>
                                        ) : (
                                            <div
                                                className={clsx(
                                                    "break-words whitespace-pre-wrap rounded-3xl py-2 px-3",
                                                    {
                                                        "bg-sky-600 text-white":
                                                            isSender,
                                                        "bg-sky-700 text-white":
                                                            !isSender,
                                                    }
                                                )}
                                            >
                                                {message?.chatText}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center flex-shrink-0">
                                        <div
                                            className={`flex ${
                                                isSender
                                                    ? "justify-end"
                                                    : "justify-start"
                                            }`}
                                        >
                                            <span className="text-xs mx-2 text-muted-foreground">
                                                {message?.createdAt
                                                    ? getTimeMessage(
                                                          new Date(
                                                              message?.createdAt
                                                          )
                                                      )
                                                    : "Đang gửi"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-4 text-muted-foreground">
                        Loading...
                    </div>
                )}
            </div>
            {!socket?.id && (
                <div className="absolute select-none right-4 left-4 top-1/2 bottom-1/2 text-center h-10 leading-10 px-2 border border-border bg-accent rounded-lg text-foreground">
                    Vui lòng đợi trong giây lát...
                    <div className="loading-bar !h-[3px] !bg-transparent mt-1"></div>
                </div>
            )}
            <div className="flex py-2 px-1 relative">
                {status === "authenticated" ? (
                    <>
                        {dataImage.fileImage && (
                            <div className="absolute bottom-full">
                                <div className="relative flex items-center">
                                    <div
                                        className="absolute -top-2 -right-2 cursor-pointer"
                                        onClick={() => {
                                            setMessageType(FormatChatEnum.TEXT);
                                            setDataImage({
                                                fileImage: null,
                                                urlImage: "",
                                            });
                                        }}
                                    >
                                        <IconClose className="w-5 h-5 bg-accent-20 hover:bg-red-500 rounded-full p-1" />
                                    </div>
                                    <Image
                                        unoptimized
                                        width={500}
                                        height={500}
                                        alt="Ảnh"
                                        src={dataImage?.urlImage}
                                        className="max-w-52 max-w-1/2 object-cover rounded-lg"
                                    />
                                </div>
                            </div>
                        )}
                        <div className="mx-1">
                            <div>
                                <label
                                    htmlFor="uploadImage"
                                    className="w-full hover:bg-accent-hover block cursor-pointer rounded-full text-foreground"
                                >
                                    <IconImages className="w-10 h-10 p-2" />
                                </label>
                                <input
                                    id="uploadImage"
                                    onChange={handleSetImage}
                                    className="hidden"
                                    type="file"
                                />
                            </div>
                        </div>
                        <input
                            ref={inputRef}
                            value={contentMessage}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    handleSendMessage();
                                }
                            }}
                            onChange={eventOnchangeValueSendMessage}
                            className="resize-none px-3 h-10 leading-10 rounded-full w-full"
                        />
                        <button
                            onClick={handleSendMessage}
                            className={`ml-1 w-10 h-10 rounded-full ${
                                !socket?.id
                                    ? "select-none cursor-default opacity-60"
                                    : "hover:bg-accent-hover active:bg-accent-active"
                            }`}
                        >
                            <IconSend className="w-10 h-10 p-2 fill-primary" />
                        </button>
                    </>
                ) : (
                    <div className="leading-10 select-none px-3 mx-2 rounded-xl bg-muted text-foreground w-full">
                        Bạn chưa đăng nhập!
                    </div>
                )}
                {/* <div className="leading-10 px-3 mx-2 rounded-xl text-white bg-red-600 w-full">Đang sửa chữa!!!</div> */}
            </div>
        </>
    );
};

export default FormChat;

interface AvatarProfileProps {
    isSender: boolean;
    isLastContinual: boolean;
    sender: GetChatMessageProps["sender"];
}
const AvatarProfile = ({
    sender,
    isSender,
    isLastContinual,
}: AvatarProfileProps) => {
    return (
        <>
            {!isSender &&
                (isLastContinual ? (
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
                            sender?.equippedItem?.avatarOutline
                                ?.imageOriginalUrl
                        }
                        className="mr-3 flex-shrink-0"
                    />
                ) : (
                    <div className="w-8 h-8 mr-3 flex-shrink-0"></div>
                ))}
        </>
    );
};
