"use client";

import { Dispatch, SetStateAction } from "react";
import IconCircleCheck from "../Modules/Icons/IconCircleCheck";

export enum CloudImageEnum {
    tiktok = 'tiktok',
    naver = 'naver',
    my = 'my',

    // CLOUD NEW
    MY = "MY", // MẶC ĐỊNH
    TT1 = "TT1", // TIKTOK
    NV1 = "NV1", // NAVER MEMO
    NV2 = "NV2", // NAVER KIN
    NV3 = "NV3", // NAVER TALK
    NV4 = "NV4", // NAVER SMARTPLACE
}

export type CloudImageType = keyof typeof CloudImageEnum;

export const listClouds = ["N", "serverTT"];
export type CloudType = (typeof listClouds)[number];


interface CloudImageProps {
    selectClouds: Record<CloudType, boolean>
    setSelectClouds: Dispatch<SetStateAction<Record<CloudType, boolean>>>
}
const CloudImage = ({ selectClouds, setSelectClouds }: CloudImageProps) => {
    
    return (
        <div className="grid lg:grid-cols-2 gap-3">
            {listClouds.map((cloud) => {
                return (
                    <div
                        key={cloud}
                        onClick={() => setSelectClouds(state => ({
                            ...state,
                            [cloud]: !state[cloud]
                        }))}
                        className={`relative flex items-center justify-between px-4 py-2 border-2 rounded-md cursor-pointer select-none font-semibold ${
                            selectClouds[cloud]
                                ? "text-blue-400 border-blue-400 [&>svg]:fill-blue-400 bg-blue-400/20"
                                : ""
                        }`}
                    >
                        {cloud}
                        {selectClouds[cloud] && <IconCircleCheck />}
                    </div>
                );
            })}
        </div>
    );
};

export default CloudImage;
