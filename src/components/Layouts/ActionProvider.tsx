"use client"

import { useEffect } from "react";
import { useSession } from "next-auth/react";

import { useAppDispatch } from "@/store/store";
import { clearAuth } from "@/store/auth/auth.reducer";
import { getCurrentUserAction } from "@/store/auth/auth.action";

const ActionProvider = () => {
    const dispatch = useAppDispatch();
    const { status, data: session } = useSession();
    
    const getCurrentUser = async () => {
        await dispatch(getCurrentUserAction()).unwrap();
    }

    useEffect(() => {
        if (status === "authenticated" && session) {
            getCurrentUser();
        } else if (status === "unauthenticated") {
            dispatch(clearAuth());
        }
    }, [status])

    return null;
};

export default ActionProvider;
