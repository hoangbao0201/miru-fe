"use client";

import React from "react";
import { useGetListCoverPosterByBookIdQuery } from "@/store/book/book.public.api";
import { ICoverPosterBookType } from "@/store/book/book.type";
import Image from "next/image";

interface ListImageBookProps {
    bookId: number;
}

const ListImageBook = ({ bookId }: ListImageBookProps) => {
    // use RTK Query hook; skip when no valid bookId
    const { data, isLoading, isFetching, error } =
        useGetListCoverPosterByBookIdQuery(bookId, {
            skip: !bookId,
        });

    const covers: ICoverPosterBookType[] = data?.data?.images?.covers ?? [];
    const posters: ICoverPosterBookType[] = data?.data?.images?.posters ?? [];

    return (
        <div className="list-image-book">
            {isLoading || isFetching ? (
                <div className="text-sm text-gray-500">
                    Đang tải hình ảnh...
                </div>
            ) : error ? (
                <div className="text-sm text-red-500">
                    Không thể tải hình ảnh
                </div>
            ) : (
                <>
                    {posters && (
                        <div className="mb-10">
                            <h3 className="text-sm font-bold mb-4">ÁP PHÍCH</h3>
                            <div className="grid lg:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-3 mt-2">
                                {posters?.length > 0 ?posters.map((img) => (
                                    <div
                                        key={img.imageId}
                                        className="image-item"
                                    >
                                        <Image
                                            unoptimized
                                            loading="lazy"
                                            src={img.url}
                                            width={img.width}
                                            height={img.height}
                                            alt={`img-${img.imageId}`}
                                            className="rounded object-cover"
                                        />
                                    </div>
                                )) : (
                                    <div className="text-sm">Không có ảnh nào!</div>
                                )}
                            </div>
                        </div>
                    )}

                    {covers && (
                        <div>
                            <h3 className="text-sm font-bold mb-4">
                                ẢNH ĐẠI DIỆN
                            </h3>
                            <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2 gap-3 mt-2">
                                {covers?.length > 0 ? covers.map((img) => (
                                    <div
                                        key={img.imageId}
                                        className="image-item"
                                    >
                                        <Image
                                            unoptimized
                                            loading="lazy"
                                            src={img.url}
                                            width={img.width}
                                            height={img.height}
                                            alt={`img-${img.imageId}`}
                                            className="rounded object-cover"
                                        />
                                    </div>
                                )) : (
                                    <div className="text-sm">Không có ảnh nào!</div>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ListImageBook;
