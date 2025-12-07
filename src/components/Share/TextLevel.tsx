import { ReactNode } from "react";
import { Potta_One } from "next/font/google";

import clsx from "clsx";
import classNames from "@/utils/classNames";
import calculateRank from "@/utils/calculateRank";
import { IGetUserMe, UserRole } from "@/services/user.services";
import { StrengthMappingData } from "@/constants/data";

const bangers = Potta_One({
    weight: "400",
    subsets: ["vietnamese"],
});

interface TextLevelProps {
    sidebox?: ReactNode;
    alignment?: "left" | "center" | "right";
    user: Pick<
        IGetUserMe,
        "name" | "role" | "rank" | "equippedItem" | "strengthMapping"
    >;
}
const TextLevel = ({ user, sidebox, alignment = "left" }: TextLevelProps) => {
    const { role, rank, equippedItem, strengthMapping } = user;
    const { level, percentage, data: dtLevel } = calculateRank(rank);

    return (
        <div className="">
            <div
                className={clsx("flex items-center flex-wrap gap-2", {
                    "justify-start": alignment === "left",
                    "justify-end": alignment === "right",
                    "justify-center": alignment === "center",
                })}
            >
                <div
                    className={classNames(
                        `flex items-end font-bold text-sm line-clamp-1 bg-clip-text whitespace-nowrap overflow-hidden relative`,
                        bangers.className,
                        dtLevel?.imageUrl
                            ? "text-black/5"
                            : ""
                    )}
                    style={{
                        backgroundImage: dtLevel?.imageUrl
                            ? `url("${dtLevel?.imageUrl}")`
                            : "",
                    }}
                >
                    {user?.name}
                </div>
                {equippedItem?.accessory && (
                    <img
                        alt={equippedItem?.accessory?.name}
                        title={equippedItem?.accessory?.name}
                        className="h-6 mx-1 object-cover flex-shrink-0"
                        src={equippedItem?.accessory?.imageOriginalUrl}
                    />
                )}
                <div className="flex text-xs font-bold uppercase h-6 leading-6">
                    <div className="relative text-[#22f2ff] bg-accent-20 px-1 bg-[url('/static/images/level/bg-rank.gif')]">
                        <span className="">
                            {role !== UserRole.GUEST
                                ? role
                                : StrengthMappingData?.[strengthMapping]?.[
                                      level
                                  ]}{" "}
                        </span>
                        <span
                            style={{ right: `calc(100% - ${percentage}%)` }}
                            className={`absolute top-0 bottom-0 left-0 bg-[#22f2ff]/25`}
                        ></span>
                    </div>
                    <div className="px-1 bg-sky-600">
                        {level}
                    </div>
                </div>
                {sidebox}
            </div>
        </div>
    );
};

export default TextLevel;
