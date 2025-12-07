"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import { ContentPageEnum } from "@/common/data.types";
import IconMagnifyingGlass from "@/components/Modules/Icons/IconMagnifyingGlass";

const SearchMain = dynamic(() => import("./SearchMain"), { ssr: false });
const Notification = dynamic(() => import("./Notification"), {
    ssr: false,
    loading: () => (
        <span className="w-[38px] h-[38px] rounded-full bg-gray-100 dark:bg-gray-500"></span>
    ),
});

interface NavHeaderProps {
    content: ContentPageEnum;
}
const NavHeader = ({ content }: NavHeaderProps) => {
    const [isModalSearch, setIsModalSearch] = useState<boolean>(false);
    
    return (
        <>
            <SearchMain
                isModalSearch={isModalSearch}
                setIsModalSearch={setIsModalSearch}
            />
            <div className="max-w-1/2 w-full flex items-center justify-end space-x-2">
                <button
                    title="Tìm kiếm"
                    onClick={() => setIsModalSearch((state) => !state)}
                    className="lg:hidden relative select-none transition-all duration-75 cursor-pointer active:scale-105 rounded-full outline-blue-600 outline-2 hover:outline-dashed"
                >
                    <IconMagnifyingGlass
                        className="w-10 h-10 px-2 fill-white"
                        size={22}
                    />
                </button>
                <Notification content={content} />
            </div>
        </>
    );
};

export default NavHeader;
