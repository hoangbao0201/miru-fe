"use client";

import dynamic from "next/dynamic";

import LazyLoad from "react-lazyload";

import { ContentPageEnum } from "@/common/data.types";
import IconRankingStar from "@/components/Modules/Icons/IconRankingStar";
import userService, {
    IGetTopRankUsers,
    IGetTopRichestUsers,
} from "@/services/user.services";
import {
    getCommentsApi,
    IGetCommentsResType,
} from "@/store/comment/comment.api";
import {
    GetAllBooksTopViewsProps,
    getAllTopViewBookService,
} from "@/services/book.services";
import { useEffect, useState } from "react";

const SideHistory = dynamic(() => import("./SideHistory"), {
    // ssr: false,
    loading: () => <div className="h-[194px]"></div>,
});
const NewComment = dynamic(() => import("./NewComment"), {
    // ssr: false,
    loading: () => <div className="min-h-[640px]"></div>,
});
const SideTopRankUsers = dynamic(() => import("./SideTopRankUsers"), {
    // ssr: false,
    loading: () => <div className="h-[284px]"></div>,
});
const SideTopRichestUsers = dynamic(() => import("./SideTopRichestUsers"), {
    // ssr: false,
    loading: () => <div className="h-[284px]"></div>,
});
const BookTopViews = dynamic(() => import("./BookTopViews"), {
    // ssr: false,
    loading: () => <div className="h-[416px]"></div>,
});

interface SideHomeProps {
    content: ContentPageEnum;
}
const SideHome = ({ content }: SideHomeProps) => {
    const [dataUsersTopRichest, setDataUsersTopRichest] = useState<
        IGetTopRichestUsers[]
    >([]);
    const [dataUsersTopRank, setDataUsersTopRank] = useState<
        IGetTopRankUsers[]
    >([]);
    const [dataCommentsLastest, setDataCommentsLastest] =
        useState<IGetCommentsResType | null>(null);
    const [dataBooksTopViews, setDataBooksTopViews] = useState<
        GetAllBooksTopViewsProps[]
    >([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [richestRes, rankRes, commentsRes, booksRes] =
                    await Promise.all([
                        userService.getTopRichestUsersService({
                            revalidate: 12 * 60 * 60,
                        }),
                        userService.getTopRankUsersService({
                            revalidate: 12 * 60 * 60,
                        }),
                        getCommentsApi({
                            data: { take: 6, category: content },
                            headers: { revalidate: 1 * 60 * 60 },
                        }),
                        getAllTopViewBookService({
                            query: `?take=6&category=${content}`,
                            revalidate: 12 * 60 * 60,
                        }),
                    ]);

                setDataUsersTopRichest(richestRes?.members ?? []);
                setDataUsersTopRank(rankRes?.members ?? []);
                setDataCommentsLastest(commentsRes);
                setDataBooksTopViews(booksRes?.books ?? []);
            } catch (error) {
                console.error("Failed to fetch side data:", error);
            }
        };

        fetchData();
    }, [content]);

    return (
        <>
            <div className="mb-4">
                <div className="overflow-hidden">
                    <div className="px-4 py-3 bg-gradient-to-r from-primary/10 to-transparent">
                        <h2 className="text-lg font-semibold text-foreground">
                            Lịch sử đọc
                        </h2>
                    </div>
                    <div className="p-4">
                        <SideHistory content={content} />
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <div className="overflow-hidden">
                    <div className="px-4 py-3 bg-gradient-to-r from-amber-500/10 to-transparent">
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                            <IconRankingStar className="size-5 fill-amber-500" />
                            <span>Top truyện tranh</span>
                        </h2>
                    </div>
                    <div className="p-4">
                        <LazyLoad placeholder={<div className="text-sm text-muted-foreground text-center py-4">Đang tải...</div>}>
                            <BookTopViews
                                content={content}
                                books={dataBooksTopViews ?? []}
                            />
                        </LazyLoad>
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <div className="overflow-hidden">
                    <div className="px-4 py-3 bg-gradient-to-r from-sky-500/10 to-transparent">
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                            <IconRankingStar className="size-5 fill-sky-500" />
                            <span>Top Cấp Độ</span>
                        </h2>
                    </div>
                    <div className="p-4">
                        <SideTopRankUsers
                            content={content}
                            members={dataUsersTopRank ?? []}
                        />
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <div className="overflow-hidden">
                    <div className="px-4 py-3 bg-gradient-to-r from-emerald-500/10 to-transparent">
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                            <IconRankingStar className="size-5 fill-emerald-500" />
                            <span>Top tài phú</span>
                        </h2>
                    </div>
                    <div className="p-4">
                        <SideTopRichestUsers
                            content={content}
                            members={dataUsersTopRichest ?? []}
                        />
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <div className="overflow-hidden">
                    <div className="px-4 py-3 bg-gradient-to-r from-primary/10 to-transparent">
                        <h2 className="text-lg font-semibold text-foreground">
                            Bình luận mới
                        </h2>
                    </div>
                    <div className="p-4">
                        <NewComment
                            content={content}
                            comments={dataCommentsLastest?.data ?? []}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default SideHome;
