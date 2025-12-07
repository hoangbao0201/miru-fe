"use client";

import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
    ChangeEvent,
    Dispatch,
    Fragment,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from "react";

import { useDebounceValue } from "usehooks-ts";

import { Env } from "@/config/Env";
import Modal from "@/components/Share/Modal";
import { ContentPageEnum } from "@/common/data.types";
import { getListVideoApi } from "@/store/video/video.api";
import { IVideoListType } from "@/store/video/video.types";
import IconClose from "@/components/Modules/Icons/IconClose";
import IconSearch from "@/components/Modules/Icons/IconSearch";
import IconChevronRight from "@/components/Modules/Icons/IconChevronRight";
import { getAllBookService, GetBooksProps } from "@/services/book.services";

const { NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO } = Env;

interface SearchMainProps {
    isModalSearch: boolean;
    setIsModalSearch: Dispatch<SetStateAction<boolean>>;
}
const SearchMain = ({ isModalSearch, setIsModalSearch }: SearchMainProps) => {
    const params = useParams();
    const content =
        (params?.content as ContentPageEnum) || ContentPageEnum.comics;
    const inputRef = useRef<HTMLInputElement>(null);

    const [valueSearch, setValueSearch] = useState("");
    const [valueSearchDebounce] = useDebounceValue(valueSearch, 500);
    const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(false);
    const [resultSearch, setResultSearch] = useState<
        GetBooksProps[] | IVideoListType[]
    >([]);

    const eventOnchangeValueSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setValueSearch(e.target.value);
    };

    const eventSearch = async (text: string) => {
        try {
            const querys = new URLSearchParams({
                take: "10",
                q: text.trim().toString(),
                page: String(Number(1) || 1),
                ...(content && {
                    category: content,
                }),
            });

            let dataRes = await getAllBookService({
                query: `?${querys.toString()}`,
            });
            if (dataRes?.success) {
                setResultSearch(dataRes?.books);
            }

            setIsLoadingSearch(false);
        } catch (error) {
            setIsLoadingSearch(false);
        }
    };

    useEffect(() => {
        if (valueSearchDebounce === "") {
            setResultSearch([]);
        } else if (valueSearchDebounce) {
            setIsLoadingSearch(true);
            eventSearch(valueSearchDebounce);
        }
    }, [valueSearchDebounce]);

    return (
        <>
            <div
                onClick={() => {
                    setIsModalSearch(true);
                }}
                className="hidden cursor-text lg:block px-4 py-2 rounded-xl bg-accent-10 backdrop-blur-md select-none w-full max-w-sm transition-colors"
            >
                Tìm kiếm...
            </div>

            <Modal
                title="Tìm kiếm"
                isOpen={isModalSearch}
                setIsOpen={setIsModalSearch}
                size="large"
                refFocus={inputRef}
            >
                <div className="">
                    <div className="flex items-center">
                        <i>
                            <IconSearch className="fill-muted-foreground" />
                        </i>
                        <input
                            ref={inputRef}
                            value={valueSearch}
                            onChange={eventOnchangeValueSearch}
                            className="w-full py-2 px-4 ml-3 bg-transparent border-none rounded-full"
                            placeholder="Tìm truyện, tác giả..."
                        />

                        {valueSearchDebounce !== "" &&
                            (isLoadingSearch ? (
                                <span className="loading-search"></span>
                            ) : (
                                <div
                                    onClick={() => {
                                        setValueSearch("");
                                        setResultSearch([]);
                                    }}
                                    className="p-1 hover:bg-accent-20 rounded-full cursor-pointer transition-colors"
                                >
                                    <IconClose className="w-5 h-5 block fill-muted-foreground hover:fill-foreground" />
                                </div>
                            ))}
                    </div>
                    <div
                        style={{ height: "2px" }}
                        className={clsx("loading-bar", {
                            "before:content-none": !isLoadingSearch,
                        })}
                    ></div>
                </div>
                <ul className="flex-auto overflow-y-auto md:px-2">
                    {valueSearchDebounce !== "" && (
                        <div className="my-2">
                            <Link
                                title=""
                                onClick={() => setIsModalSearch(false)}
                                href={`/${content}/search?q=${valueSearchDebounce.trim()}`}
                                className="px-2 py-2 line-clamp-1 block whitespace-nowrap text-foreground bg-accent-10 hover:text-white hover:bg-primary transition-colors rounded-md"
                            >
                                Tìm kiếm: {valueSearchDebounce}
                            </Link>
                        </div>
                    )}
                    <ListBook
                        content={content}
                        setIsModalSearch={setIsModalSearch}
                        data={resultSearch as GetBooksProps[]}
                    />
                </ul>
            </Modal>
        </>
    );
};

export default SearchMain;

const ListBook = ({
    content,
    data,
    setIsModalSearch,
}: {
    content: ContentPageEnum;
    data: GetBooksProps[];
    setIsModalSearch: Dispatch<SetStateAction<boolean>>;
}) => {
    return (
        <>
            {data.map((item) => {
                return (
                    <li
                        key={item?.bookId}
                        className="mb-2 group bg-accent-10 hover:bg-accent-20 rounded-md transition-colors"
                    >
                        <Link
                            title={item?.title}
                            aria-label={`${item?.title}`}
                            onClick={() => setIsModalSearch(false)}
                            href={`/${content}/books/${item?.slug}-${item?.bookId}`}
                        >
                            <div className="flex items-center justify-center px-2 py-2">
                                <Image
                                    unoptimized
                                    loading="lazy"
                                    src={
                                        item?.covers?.[0]?.url ??
                                        `/static/images/image-book-not-found.jpg`
                                    }
                                    width={50}
                                    height={70}
                                    alt={`Ảnh truyện`}
                                    className="w-[50px] h-[70px] object-cover rounded shadow"
                                />
                                <div className="ml-3 h-[70px]">
                                    <p className="font-medium text-lg mb-3 line-clamp-1 text-foreground">
                                        {item?.title}
                                    </p>
                                    <div className="text-muted-foreground">
                                        Số chương:{" "}
                                        {item?.chapters.length > 0
                                            ? item?.chapters[0].num
                                            : 0}
                                    </div>
                                </div>
                                <IconChevronRight
                                    size={15}
                                    className="ml-auto fill-muted-foreground group-hover:fill-foreground transition-colors"
                                />
                            </div>
                        </Link>
                    </li>
                );
            })}
        </>
    );
};
const ListVideo = ({
    content,
    data,
    setIsModalSearch,
}: {
    content: ContentPageEnum;
    data: IVideoListType[];
    setIsModalSearch: Dispatch<SetStateAction<boolean>>;
}) => {
    return (
        <>
            {data.map((item) => {
                return (
                    <li
                        key={item?.videoId}
                        className="mb-2 group bg-accent-10 hover:bg-accent-20 rounded-md transition-colors"
                    >
                        <Link
                            onClick={() => setIsModalSearch(false)}
                            title={item?.localizedContent?.[0]?.title}
                            aria-label={`${item?.localizedContent?.[0]?.title}`}
                            href={`/${content}/t/videos/${item?.localizedContent?.[0]?.slug}-${item?.videoId}`}
                        >
                            <div className="flex items-center justify-center px-2 py-2">
                                <Image
                                    unoptimized
                                    loading="lazy"
                                    src={
                                        item?.covers?.[0]?.url ??
                                        `/static/images/image-book-not-found.jpg`
                                    }
                                    width={50}
                                    height={70}
                                    alt={`Ảnh truyện`}
                                    className="w-[50px] h-[70px] object-cover rounded shadow"
                                />
                                <div className="ml-3 h-[70px]">
                                    <p className="font-medium text-lg mb-3 line-clamp-1 text-foreground">
                                        {item?.localizedContent?.[0]?.title}
                                    </p>
                                    <div className="text-muted-foreground">
                                        Số tập:{" "}
                                        {item?.episodes?.length > 0
                                            ? item?.episodes?.[0].episodeNumber
                                            : 0}
                                    </div>
                                </div>
                                <IconChevronRight
                                    size={15}
                                    className="ml-auto fill-muted-foreground group-hover:fill-foreground transition-colors"
                                />
                            </div>
                        </Link>
                    </li>
                );
            })}
        </>
    );
};
