"use client";

import Link from "next/link";
import { useState } from "react";

import IconAnglesLeft from "../Modules/Icons/IconAnglesLeft";
import IconAnglesRight from "../Modules/Icons/IconAnglesRight";

interface NavPaginationProps {
    countPage: number;
    currentPage: number;
    queryParams: URLSearchParams;
}

export const NavPagination = ({
    countPage,
    currentPage,
    queryParams,
}: NavPaginationProps) => {
    const [pageNext, setPageNext] = useState<string>(currentPage.toString());

    const generateHref = (page: number) => {
        const params = new URLSearchParams(queryParams);
        params.set("page", String(page));
        return `?${params.toString()}`;
    };

    return (
        <div className="">
            <div className="flex flex-wrap justify-center select-none mb-2 gap-1 [&>li]:m-[1px]">
                {currentPage >= 2 ? (
                    <Link
                        prefetch={false}
                        href={generateHref(currentPage - 1)}
                        className="md-btn accent w-10 h-10 rounded-md block flex-shrink-0"
                    >
                        <IconAnglesLeft className="w-10 h-10 py-3 mx-auto fill-foreground" />
                    </Link>
                ) : (
                    <button
                        disabled={true}
                        className="md-btn accent w-10 h-10 rounded-md flex-shrink-0 opacity-50"
                    >
                        <IconAnglesLeft className="w-10 h-10 py-3 mx-auto fill-foreground/70" />
                    </button>
                )}
                {[1, 2, 3].map((number) => {
                    if (number >= 1 && number <= countPage) {
                        return (
                            <Link
                                key={number}
                                prefetch={false}
                                href={generateHref(number)}
                                className={`md-btn w-10 h-10 rounded-md text-center leading-10 flex-shrink-0 ${
                                    currentPage === number ? "primary" : "accent"
                                }`}
                            >
                                {number}
                            </Link>
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
                            <Link
                                key={number}
                                prefetch={false}
                                href={generateHref(number)}
                                className={`md-btn w-10 h-10 rounded-md text-center leading-10 flex-shrink-0 ${
                                    currentPage === number ? "primary" : "accent"
                                }`}
                            >
                                {number}
                            </Link>
                        );
                    }
                })}
                {[countPage - 2, countPage - 1, countPage].map((number) => {
                    if (number >= 4 && number <= countPage) {
                        return (
                            <Link
                                key={number}
                                prefetch={false}
                                href={generateHref(number)}
                                className={`md-btn w-10 h-10 rounded-md text-center leading-10 flex-shrink-0 ${
                                    currentPage === number ? "primary" : "accent"
                                }`}
                            >
                                {number}
                            </Link>
                        );
                    }
                })}
                {currentPage <= countPage - 1 ? (
                    <Link
                        prefetch={false}
                        href={generateHref(currentPage + 1)}
                        className="md-btn accent w-10 h-10 rounded-md flex-shrink-0"
                    >
                        <IconAnglesRight className="w-10 h-10 py-3 mx-auto fill-foreground" />
                    </Link>
                ) : (
                    <button
                        disabled={true}
                        className="md-btn accent w-10 h-10 rounded-md flex-shrink-0 opacity-50"
                    >
                        <IconAnglesRight className="w-10 h-10 py-3 mx-auto fill-foreground/70" />
                    </button>
                )}
            </div>

            <div className="flex justify-center space-x-1">
                <Link
                    prefetch={false}
                    href={generateHref(parseInt(pageNext) || 1)}
                    className="min-w-32 h-10 rounded-md leading-10 text-center md-btn text-white bg-primary hover:bg-primary/90"
                >
                    Đến trang
                </Link>
                <input
                    type="number"
                    value={pageNext}
                    onChange={(e) => setPageNext(e.target.value)}
                    className="w-32 h-10 rounded-md text-center appearance-none"
                />
            </div>
        </div>
    );
};
