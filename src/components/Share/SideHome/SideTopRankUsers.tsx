"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

import { Env } from "@/config/Env";
import { ContentPageEnum } from "@/common/data.types";
import { IGetTopRankUsers } from "@/services/user.services";
import AvatarWithOutline from "../AvatarWithOutline";

const { NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO } = Env;

const TextLevel = dynamic(() => import("@/components/Share/TextLevel"), {
    ssr: false,
    loading: () => (
        <div className="w-[110px] h-[20px] my-[2px] rounded-sm bg-muted animate-pulse"></div>
    ),
});

interface SideTopRankUsersProps {
    content: ContentPageEnum;
    members: IGetTopRankUsers[];
}
const SideTopRankUsers = ({
    members,
    content = ContentPageEnum.comics,
}: SideTopRankUsersProps) => {
    return (
        <>
            <ul className="space-y-3">
                {members &&
                    members?.map((member, index) => {
                        const avatar =
                            member?.avatarUrl
                                ? NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO +
                                  "/" +
                                  member?.avatarUrl
                                : "/static/images/avatar_default.png";

                        return (
                            <li
                                key={member?.userId}
                                className="group"
                            >
                                <Link
                                    prefetch={false}
                                    aria-label={`${member?.userId}`}
                                    href={`/${content}/user/${member?.username}`}
                                    className="flex gap-3 py-2"
                                >
                                    <span className="h-6 w-6 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-xs font-bold text-white shadow-md">
                                        {index + 1}
                                    </span>
                                    <div className="relative flex-shrink-0">
                                        <AvatarWithOutline
                                            avatarUrl={avatar}
                                            outlineUrl={
                                                member?.equippedItem
                                                    ?.avatarOutline
                                                    ?.imageOriginalUrl || ""
                                            }
                                        />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <TextLevel user={member} />
                                            <span className="text-[11px] uppercase tracking-wide rounded-full bg-primary/10 px-2 py-0.5 text-primary">
                                                Level
                                            </span>
                                        </div>

                                        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                                            <span className="font-semibold text-foreground">
                                                {member?.name ||
                                                    member?.username}
                                            </span>
                                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] text-amber-500">
                                                <span>MINOCOIN</span>
                                                <span className="font-semibold">
                                                    {member?.balance}
                                                </span>
                                                <Image
                                                    width={200}
                                                    height={200}
                                                    alt="minocoin"
                                                    title="minocoin"
                                                    className="h-4 w-4"
                                                    src={
                                                        "/static/images/minocoin.png"
                                                    }
                                                />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
            </ul>
        </>
    );
};

export default SideTopRankUsers;
