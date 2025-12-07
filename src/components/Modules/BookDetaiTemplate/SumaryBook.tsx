"use client";

import { useState } from "react";

const SumaryBook = ({ sumary }: { sumary: string }) => {
    const [isShow, setIsShow] = useState(false);

    return (
        <div className="bg-accent overflow-hidden p-3 group">
            <h2 title="NỘI DUNG" className="text-sm mb-4 font-bold">
                NỘI DUNG
            </h2>
            <div
                className={`relative w-full overflow-hidden min-h-[80px] ${
                    !isShow && "max-h-[150px]"
                }`}
            >
                <p className="text-base whitespace-pre-line">{sumary}</p>
                {!isShow && (
                    <div
                        onClick={() => setIsShow(true)}
                        className="cursor-pointer absolute top-0 left-0 h-full w-full"
                        style={{
                            background:
                                "linear-gradient(180deg, transparent 0%, transparent 20%, rgb(var(--background) / 0.9) 100%)",
                        }}
                    >
                        <div className="absolute left-0 right-0 bottom-0 py-1 text-sm bg-accent-10 text-center group-hover:bg-accent-10-hover">
                            Xem thêm
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SumaryBook;
