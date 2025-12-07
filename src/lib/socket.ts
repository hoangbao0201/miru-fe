"use client";

import { Env } from "@/config/Env";
import { io } from "socket.io-client";

export const socket = io(Env.NEXT_PUBLIC_API_URL, {
    transports: ["websocket"],
});
