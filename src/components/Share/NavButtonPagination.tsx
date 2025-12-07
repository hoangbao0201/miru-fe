"use client";

import { useState } from "react";
import IconAnglesLeft from "../Modules/Icons/IconAnglesLeft";
import IconAnglesRight from "../Modules/Icons/IconAnglesRight";

interface NavButtonPaginationProps {
    countPage: number;
    currentPage: number;
    handleChangePage: (page: number) => void;
}

export const NavButtonPagination = ({
    countPage,
    currentPage,
    handleChangePage,
}: NavButtonPaginationProps) => {
    const [pageNext, setPageNext] = useState<string>(currentPage.toString());
    const handleNextPage = (page: number) => {
        handleChangePage(page);
    };
    return (
        <div className="">
            <div className="flex flex-wrap justify-center select-none mb-2 gap-1 [&>li]:m-[1px]">
                {currentPage >= 2 ? (
                    <button
                        onClick={() => {
                            handleNextPage(currentPage - 1);
                        }}
                        className="md-btn accent w-10 h-10 rounded-md block flex-shrink-0"
                    >
                        <IconAnglesLeft className="w-10 h-10 py-3 mx-auto fill-white" />
                    </button>
                ) : (
                    <button
                        disabled={true}
                        className="md-btn accent w-10 h-10 rounded-md flex-shrink-0 opacity-50"
                    >
                        <IconAnglesLeft className="w-10 h-10 py-3 mx-auto fill-white" />
                    </button>
                )}
                {[1, 2, 3].map((number) => {
                    if (number >= 1 && number <= countPage) {
                        return (
                            <button
                                key={number}
                                onClick={() => {
                                    handleNextPage(number);
                                }}
                                className={`md-btn w-10 h-10 rounded-md text-center leading-10 flex-shrink-0 ${
                                    currentPage === number
                                        ? "primary"
                                        : "accent"
                                }`}
                            >
                                {number}
                            </button>
                        );
                    }
                })}
                {[
                    currentPage - 2,
                    currentPage - 1,
                    currentPage,
                    currentPage + 1,
                    currentPage + 2,
                ].map((number) => {
                    if (number >= 4 && number <= countPage - 3) {
                        return (
                            <button
                                key={number}
                                onClick={() => {
                                    handleNextPage(number);
                                }}
                                className={`md-btn w-10 h-10 rounded-md text-center leading-10 flex-shrink-0 ${
                                    currentPage === number
                                        ? "primary"
                                        : "accent"
                                }`}
                            >
                                {number}
                            </button>
                        );
                    }
                })}
                {[countPage - 2, countPage - 1, countPage].map((number) => {
                    if (number >= 4 && number <= countPage) {
                        return (
                            <button
                                key={number}
                                onClick={() => {
                                    handleNextPage(number);
                                }}
                                className={`md-btn w-10 h-10 rounded-md text-center leading-10 flex-shrink-0 ${
                                    currentPage === number
                                        ? "primary"
                                        : "accent"
                                }`}
                            >
                                {number}
                            </button>
                        );
                    }
                })}

                {currentPage <= countPage - 1 ? (
                    <button
                        onClick={() => {
                            handleNextPage(currentPage + 1);
                        }}
                        className="md-btn accent w-10 h-10 rounded-md flex-shrink-0"
                    >
                        <IconAnglesRight className="w-10 h-10 py-3 mx-auto fill-white" />
                    </button>
                ) : (
                    <button
                        disabled={true}
                        className="md-btn accent w-10 h-10 rounded-md flex-shrink-0 opacity-50"
                    >
                        <IconAnglesRight className="w-10 h-10 py-3 mx-auto fill-white" />
                    </button>
                )}
            </div>

            <div className="flex justify-center space-x-1">
                <button
                    onClick={() => {
                        handleNextPage(Number(pageNext) || 1);
                    }}
                    className="min-w-32 h-10 rounded-md leading-10 text-center md-btn text-white bg-primary hover:bg-primary/90"
                >
                    Đến trang
                </button>
                <input
                    type="number"
                    value={pageNext}
                    onChange={(e) => setPageNext(e.target.value)}
                    className="w-32 h-10 rounded-md text-center outline-none appearance-none"
                />
            </div>
        </div>
    );
};
