import { Env } from "@/config/Env";
import { IDataUser } from "./user.services";

const { NEXT_PUBLIC_API_URL } = Env

export enum FormatChatEnum {
    TEXT = "TEXT",
    IMAGE = "IMAGE",
    LINK_SELF = "LINK_SELF",
    LINK_BLANK = "LINK_BLANK",
}  

export interface GetChatMessageProps {
    chatId: number;
    format: FormatChatEnum;
    chatText: string;
    socketId: string;
    createdAt: Date | null;
    sender: Omit<IDataUser, "banned" | "createdAt">;
}

class ChatService {
    async findAllMessage(): Promise<any> {
        try {
            const messagesRes = await fetch(
                `${NEXT_PUBLIC_API_URL}/api/chat/messages`,
                {
                    method: "GET",
                    cache: "no-store",
                }
            );
            const messages = await messagesRes.json();
            return messages;
        } catch (error) {
            return {
                success: false,
                message: "Error",
                error: error,
            };
        }
    }
}

const chatService = new ChatService();

export default chatService;
