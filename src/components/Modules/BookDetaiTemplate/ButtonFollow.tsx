"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { useDebounceValue } from "usehooks-ts";

import {
    checkFollowBookService,
    followBookService,
} from "@/services/book.services";
import IconBookMark from "../Icons/IconBookMark";

interface FollowProps {
    bookId: number;
}

const ButtonFollow = ({ bookId }: FollowProps) => {
    const { data: session, status } = useSession();
    const [isLoad, setIsLoad] = useState<boolean>(true);
    const [isFollow, setIsFollow] = useState<boolean>(false);

    const [debouncedIsFollow] = useDebounceValue(isFollow, 200);

    const handleClickFollowBook = async () => {
        if (status !== "authenticated") {
            alert("Bạn chưa đăng nhập tài khoản!");
            return;
        }
        setIsFollow((state) => !state);
    };

    const handleActionFollowBook = async () => {
        if (status !== "authenticated") {
            return;
        }
        try {
            await followBookService({
                bookId: bookId,
                token: session?.backendTokens.accessToken,
                type: debouncedIsFollow ? "follow" : "unfollow",
            });
        } catch (error) {}
    };

    const eventCheckFollowBook = async () => {
        if (status !== "authenticated") {
            setIsFollow(false);
            setIsLoad(false);
            return;
        }

        try {
            const followingCheck = await checkFollowBookService({
                bookId: bookId,
                cache: "no-store",
                token: session.backendTokens.accessToken,
            });

            if (followingCheck?.success) {
                setIsFollow(followingCheck?.isFollowed ? true : false);
            }
            setIsLoad(false);
        } catch (error) {
            setIsLoad(false);
        }
    };

    useEffect(() => {
        if (status !== "loading") {
            eventCheckFollowBook();
        }
    }, [status]);

    useEffect(() => {
        if (!isLoad) {
            handleActionFollowBook();
        }
    }, [debouncedIsFollow]);

    if (isLoad) {
        return <div className="lg:max-w-[250px] flex-1 w-full px-1 h-12"></div>;
    }

    return (
        <button
            title="Theo dõi truyện"
            onClick={handleClickFollowBook}
            className={clsx(
                "text-sm text-white font-bold uppercase rounded-lg whitespace-nowrap lg:max-w-[250px] flex-1 px-2 h-12 flex items-center justify-center",
                {
                    "hover:bg-[#22c55e] bg-green-500": !isFollow,
                    "hover:bg-[#b91c1c] bg-[#c92a2a]": isFollow,
                }
            )}
        >
            <IconBookMark className="fill-white" />
            <div className="ml-3 font-semibold">Theo dõi</div>
        </button>
    );
};

export default ButtonFollow;
