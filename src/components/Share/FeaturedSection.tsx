"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

import BoxHeading from "./BoxHeading";
import classNames from "@/utils/classNames";
import { ContentPageEnum } from "@/common/data.types";
import { IBookListType } from "@/store/book/book.type";
import { IVideoListType } from "@/store/video/video.types";
import { getListBookFeaturedApi } from "@/store/book/book.api";
import { getListVideoFeaturedApi } from "@/store/video/video.api";

type FeaturedSectionProps = {
    type: "book" | "video";
    content: ContentPageEnum;
    options: { page: number };
};

export default function FeaturedSection({
    type,
    content,
    options,
}: FeaturedSectionProps) {
    const [dataItems, setDataItems] = useState<
        (IBookListType | IVideoListType)[]
    >([]);
    const [activeItem, setActiveItem] = useState<
        IBookListType | IVideoListType
    >();

    const fetchData = async () => {
        try {
            if (type === "book") {
                const { data } = await getListBookFeaturedApi({
                    options: {
                        revalidate: 2 * 60 * 60,
                        cache: 'no-store'
                    },
                    data: {
                        query: {
                            category: content,
                            take: 10,
                        },
                    },
                });
                setDataItems(data?.books ?? []);
            } else {
                const { data } = await getListVideoFeaturedApi({
                    options: {
                        revalidate: 2 * 60 * 60
                        // cache: 'no-store'
                    },
                    data: {
                        query: {
                            category: content,
                            take: 10,
                        },
                    },
                });
                setDataItems(data?.videos ?? []);
            }
        } catch (err) {
            console.error("Error fetching featured data:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [type, content, options.page]);

    return (
        <div className="relative w-full pb-5">
            <div className="-mt-[60px] pt-[60px] overflow-hidden relative flex flex-col">
                {/* Background ảnh lớn */}
                <Image
                    unoptimized
                    alt=""
                    width={500}
                    height={500}
                    className="absolute left-0 top-0 w-[100%] blur-sm object-cover object-top select-none"
                    src={
                        activeItem?.covers?.[0]?.url ??
                        activeItem?.posters?.[0]?.url ??
                        "/static/images/image-book-not-found.jpg"
                    }
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(to bottom,rgb(var(--background)/.6),rgb(var(--background)))",
                    }}
                ></div>

                {/* Swiper */}
                <div className="mt-auto mb-5">
                    {dataItems && dataItems.length > 0 ? (
                        <Swiper
                            loop={true}
                            spaceBetween={15}
                            centeredSlides={true}
                            pagination={{ clickable: true }}
                            modules={[Autoplay]}
                            onSlideChange={(swiper) => {
                                setActiveItem(dataItems?.[swiper.realIndex]);
                            }}
                            slidesPerView={1.2}
                            // autoplay={{
                            //     delay: 4000,
                            //     disableOnInteraction: false,
                            // }}
                            // breakpoints={{
                            //     320: { slidesPerView: 1.2 },
                            //     640: { slidesPerView: 1.2 },
                            //     1024: { slidesPerView: 1.2 },
                            //     1280: { slidesPerView: 1.2 },
                            // }}
                            className="w-full mx-auto"
                        >
                            {dataItems.map((item) => {
                                const id =
                                    (item as any).videoId ??
                                    (item as any).bookId;
                                const title =
                                    (item as any).localizedContent?.[0]
                                        ?.title ??
                                    (item as any).title ??
                                    "Không tiêu đề";
                                const slug =
                                    (item as any).localizedContent?.[0]?.slug ??
                                    (item as any).slug ??
                                    "";

                                return (
                                    <SwiperSlide key={id} className="flex-none w-full rounded-lg relative z-10 snap-center snap-always transition">
                                        <div className="relative group rounded-lg overflow-hidden">
                                            <Link
                                                href={
                                                    type === "video"
                                                        ? `/${content}/t/videos/${slug}-${id}`
                                                        : `/${content}/books/${slug}-${id}`
                                                }
                                            >
                                                <Image
                                                    unoptimized
                                                    alt={title}
                                                    width={1000}
                                                    height={1000}
                                                    src={
                                                        item.posters?.[0]
                                                            ?.url ??
                                                        item.covers?.[0]?.url
                                                    }
                                                    className={classNames(
                                                        "w-full md:aspect-[12/5] aspect-[12/7] overflow-hidden object-cover",
                                                        item.posters?.[0]?.url
                                                            ? "object-center"
                                                            : "object-top"
                                                    )}
                                                />

                                                <div
                                                    className="absolute bottom-0 left-0 w-full p-4"
                                                    style={{
                                                        backgroundImage: `linear-gradient(to top, ${
                                                            item?.covers?.[0]
                                                                ?.dominantColor ||
                                                            "rgba(0,0,0,0.8)"
                                                        }, transparent)`,
                                                    }}
                                                >
                                                    <h3 className="text-white drop-shadow-md text-sm uppercase font-bold line-clamp-2 mb-2">
                                                        {title}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-1 w-full h-6">
                                                        {item?.tags
                                                            ?.slice(0, 2)
                                                            ?.map((tag) => (
                                                                <div
                                                                    key={
                                                                        tag?.tagId
                                                                    }
                                                                    className="text-xs leading-6 h-6 px-2 bg-accent rounded-full"
                                                                >
                                                                    {tag?.name}
                                                                </div>
                                                            ))}
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    ) : (
                        <div className="text-gray-400 text-center py-10">
                            Đang tải dữ liệu...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
