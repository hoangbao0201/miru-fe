"use client";

import Image from "next/image";
import { ChangeEvent, Fragment, SetStateAction, useEffect, useState } from "react";

import axios from "axios";
import { useSession } from "next-auth/react";
import convertTime from "@/utils/convertTime";
import IconXmark from "../../Icons/IconXmark";
import { useDebounceValue } from "usehooks-ts";
import { textToSlug } from "@/utils/textToSlug";
import ItemBookBeebook from "./ItemBookBeebook";
import { createBookService } from "@/services/book.services";
import SkeletonCrawlLatestBooks from "../../Skeleton/CrawlLatestBooksSkeleton";
import { ContentPageEnum } from "@/common/data.types";
import { BookStorageStatusEnum, crawlBookCreatorService, StorageBookEnum } from "@/services/creator.services";

interface AlbumInfoType {
    avatar: string;
    name: string;
    tag: string;
    album_tag: string;
    detail: string;
    admin: string;
    last_chapter: string;
    user_target: string;
    warning: number;
    id: string;
    url: string;
    status: string;
    other_name: string[];
    other_url: string[];
    type: string;
}

interface AlbumStaticsType {
    follow: number;
    view: number;
    unlock: number;
    chapter: string;
    gift: number;
}

interface TeamInfoType {
    avatar: string;
    cover: string;
    name: string;
    detail: string;
    admin: string;
    follow: number;
    type: string;
    id: number;
    ads: string;
}

export interface AlbumType {
    id_album: number;
    info: AlbumInfoType;
    statics: AlbumStaticsType;
    last_update: string;
    team_info: TeamInfoType;
    team_id: number;
}

const CrawlBeebookTemplate = () => {
    const { data: session, status } = useSession();

    const [isAction, setIsAction] = useState("");
    const [listBooks, setListBooks] = useState<
        null | (AlbumType & { isExist: boolean; isSelect: boolean })[]
    >(null);
    const [listBooksSearch, setListBooksSearch] = useState<
        null | (AlbumType & { isExist: boolean; isSelect: boolean })[]
    >(null);
    const [listBookSelect, setListBookSelect] = useState<
        (AlbumType & { isExist: boolean; isSelect: boolean })[]
    >([]);
    const [valueSearch, setValueSearch] = useState("");

    const [valueSearchDebouce] = useDebounceValue(valueSearch.trim(), 500);

    // Event Onchange Value Search
    const eventOnchangeValueSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setValueSearch(e.target.value);
    };

    const handleSearchBooks = async () => {
        if (status !== "authenticated") {
            return;
        }
        try {
            const booksRes = await axios.get(
                `https://bbbokkk.com/api/api_search?type=album&name=${textToSlug(
                    valueSearch
                )}&page=1&limit=10`
            );

            if (booksRes?.data.status === 1) {
                const books = booksRes.data.data;
                const booksConvert: (AlbumType & { isExist: boolean; isSelect: boolean })[] =
                    Object.keys(books)
                        .filter((key: string) => !isNaN(Number(key)))
                        .map((key) => {
                            const book = books[key];
                            return {
                                ...book,
                                isExist: false,
                                isSelect: false,
                                info: JSON.parse(book.info),
                                statics: JSON.parse(book.statics),
                                team_info: JSON.parse(book.team_info),
                            };
                        });
                setListBooksSearch(booksConvert);
            }
        } catch (error) {}
    };

    useEffect(() => {
        if (valueSearchDebouce.length > 0) {
            handleSearchBooks();
        } else {
            setListBooksSearch(null);
        }
    }, [valueSearchDebouce]);

    // Handle Get Books Lastest
    const handleGetBooksLastest = async () => {
        try {
            const booksRes: any = await axios.get(
                "https://bbbokkk.com/api/api_album_explore?page=1&limit=30&num_chapter=0&status=all&sort=new"
            );

            const books = booksRes.data.data;
            const booksConvert: (AlbumType & { isExist: boolean; isSelect: boolean })[] =
                Object.keys(books)
                    .filter((key: string) => !isNaN(Number(key)))
                    .map((key) => {
                        const book = books[key];
                        return {
                            ...book,
                            isExist: false,
                            isSelect: false,
                            info: JSON.parse(book.info),
                            statics: JSON.parse(book.statics),
                            team_info: JSON.parse(book.team_info),
                        };
                    });

            setListBooks(booksConvert);
        } catch (error) {}
    };

    useEffect(() => {
        handleGetBooksLastest();
    }, []);

    // Handle Add Book Select
    const handleAddListBooksSelect = async (indexBook: number) => {
        if (!listBooks) {
            return;
        }
        const booksShow = (listBooksSearch || listBooks);

        const findIndexExist = listBookSelect.findIndex(
            (book) => book?.id_album === booksShow[indexBook].id_album
        );
        if (findIndexExist !== -1) {
            alert("Truyện đã tồn tại");
            return;
        }
        
        const filteredBooks = booksShow.filter(
            (book, index) => book.id_album !== booksShow[indexBook].id_album
        );
        setListBooks([
            {
                ...booksShow[indexBook],
                isSelect: true,
            },
            ...filteredBooks,
        ]);

        const dataSelect: SetStateAction<AlbumType & { isExist: boolean; isSelect: boolean }> = {
            ...booksShow[indexBook],
        };
        setListBookSelect([...listBookSelect, dataSelect]);
    };

    // Handle Remove Book In List Books
    const handleRemoveBookInListBooks = (id_album: number) => {
        if (!listBooks) {
            return;
        }
        const indexBook = listBooks.findIndex((book) => {
            return book?.id_album === id_album;
        });
        if (indexBook !== -1) {
            const filteredBooks = listBooks.filter((book, index) => index !== indexBook);
            setListBooks([...filteredBooks]);
        }
    };

    // Handle Remove Book In List Books Select
    const handleRemoveBooksInListBooksSelect = (indexBook: number) => {
        if (listBooks) {
            const filteredBooks = listBooks.filter(
                (book, index) => book.id_album !== listBookSelect[indexBook].id_album
            );

            setListBooks([{ ...listBooks[indexBook], isSelect: false }, ...filteredBooks]);
        }
        const newListUrl = listBookSelect.filter(
            (urlBook) => urlBook?.id_album !== listBookSelect[indexBook].id_album
        );
        setListBookSelect(newListUrl);
    };

    const handleCreateBooksMultiple = async () => {
        if(status !== "authenticated") {
            return;
        }
        if(listBookSelect?.length === 0) {
            alert("Bạn chưa chọn truyện nào!")
            return;
        }
        setIsAction("loading_create_book");

        try {
            for(let i = 0; i < listBookSelect.length; i++) {
                await crawlBookCreatorService({
                    data: {
                        isAutoUpdate: true,
                        updateLastest: false,
                        category: ContentPageEnum.comics,
                        storage: BookStorageStatusEnum.BACKUP,
                        url: "https://bbbokkk.com/api/api_chapter_detail_new?id=" + listBookSelect[i]?.id_album,
                    },
                    token: session?.backendTokens.accessToken,
                });

                setListBookSelect(state => state.filter(b => b?.id_album !== state[i]?.id_album));
            }

            setIsAction("");
        } catch (error) {
            setIsAction("");
        }
    }

    return (
        <div>
            <div className="bg-slate-800 px-3 py-4 rounded-md shadow-sm mb-3">
                <h3 className="font-semibold text-lg mb-2">Trang web</h3>

                <h3 className="font-semibold text-base mb-2">Danh sách truyện thêm</h3>
                <div
                    className={`mb-4 ${
                        (isAction === "loading_create_book") &&
                        "pointer-events-none cursor-none opacity-70 [&>input]:bg-gray-200"
                    }`}
                >
                    <div className="overflow-y-auto relative border rounded-md mb-5 min-h-[100px]">
                        <table className="table-auto w-full">
                            <colgroup>
                                <col style={{ width: "10%" }} />
                                <col style={{ width: "70%" }} />
                                <col style={{ width: "10%" }} />
                                <col style={{ width: "10%" }} />
                            </colgroup>
                            <thead className="text-gray-600 bg-gray-100">
                                <tr className="whitespace-nowrap [&>th]:px-2 [&>th]:py-2 [&>th]:font-semibold">
                                    <th className="rounded-tl-md">Id</th>
                                    <th>Truyện</th>
                                    <th>Bắt đầu</th>
                                    <th className="rounded-tr-md">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-sm">
                                {listBookSelect?.length > 0 ? (
                                    listBookSelect?.map((book, index) => {
                                        return (
                                            <tr
                                                key={book?.id_album}
                                                className="[&>td]:px-2 [&>td]:py-2 divide-x"
                                            >
                                                <td className="text-center">{book?.id_album}</td>
                                                <td className="">
                                                    <div className="flex mb-4">
                                                        <div className="w-20 h-28 flex-shrink-0 rounded-md border overflow-hidden mr-2">
                                                            <Image
                                                                unoptimized
                                                                loading="lazy"
                                                                width={100}
                                                                height={200}
                                                                alt=""
                                                                className={`w-20 h-28 object-cover`}
                                                                src={
                                                                    "https://bbbokkk.com/assets/tmp/album/" +
                                                                    book?.info.avatar
                                                                }
                                                            />
                                                        </div>
                                                        <div>
                                                            <div className="mb-2 hover:underline line-clamp-2">
                                                                <strong className="text-base">
                                                                    {book?.info.name}
                                                                </strong>
                                                            </div>
                                                            <div className="mt-2">
                                                                <span className="mr-3">
                                                                    Chapter:{" "}
                                                                    {book?.info.last_chapter}
                                                                </span>
                                                                <span>
                                                                    Thời gian:{" "}
                                                                    {convertTime(
                                                                        new Date(book?.last_update)
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-center text-lg font-semibold">
                                                    0
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() =>
                                                            handleRemoveBooksInListBooksSelect(
                                                                index
                                                            )
                                                        }
                                                        className="bg-red-500 whitespace-nowrap h-10 px-5 rounded-md min-w-20 flex items-center justify-center mx-auto"
                                                    >
                                                        <IconXmark className="fill-white" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td className="text-center py-5" colSpan={4}>
                                            Không có truyện nào được chọn!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mb-4">
                        <button
                            onClick={handleCreateBooksMultiple}
                            className="w-full h-10 px-5 text-white bg-blue-600 rounded-md flex items-center justify-center"
                        >
                            Tạo truyện ngay
                        </button>
                    </div>
                    <div className="mb-4">
                    <h3 className="font-semibold text-base mb-2">Tìm kiếm truyện</h3>
                        <input
                            value={valueSearch}
                            onChange={eventOnchangeValueSearch}
                            className="h-10 px-4 rounded-md w-full"
                        />
                    </div>
                </div>

                <div className="overflow-y-auto relative border rounded-md mb-5">
                    <table className="table-auto w-full">
                        <colgroup>
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "75%" }} />
                            <col style={{ width: "15%" }} />
                        </colgroup>
                        <thead className="text-gray-600 bg-gray-100">
                            <tr className="whitespace-nowrap [&>th]:px-2 [&>th]:py-2 [&>th]:font-semibold">
                                <th className="rounded-tl-md">Id</th>
                                <th>Truyện</th>
                                <th className="rounded-tr-md">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-sm">
                            {status === "authenticated" ? (
                                listBooksSearch ? (
                                    listBooksSearch.length > 0 ? (
                                        listBooksSearch?.map((book, index) => {
                                            return (
                                                <Fragment key={book?.id_album}>
                                                    <ItemBookBeebook
                                                        index={index}
                                                        book={book}
                                                        isAction={isAction}
                                                        handleAddListBooksSelect={handleAddListBooksSelect}
                                                        handleRemoveBookInListBooks={
                                                            handleRemoveBookInListBooks
                                                        }
                                                    />
                                                </Fragment>
                                            );
                                        })
                                    ) : (
                                        <tr><td colSpan={4} className="py-5 whitespace-nowrap text-center">Không tìm thấy truyện!</td></tr>
                                    )
                                    
                                ) : (
                                    listBooks?.map((book, index) => {
                                        if (book?.isSelect) {
                                            return null;
                                        }

                                        return (
                                            <Fragment key={book?.id_album}>
                                                <ItemBookBeebook
                                                    index={index}
                                                    book={book}
                                                    isAction={isAction}
                                                    handleAddListBooksSelect={handleAddListBooksSelect}
                                                    handleRemoveBookInListBooks={
                                                        handleRemoveBookInListBooks
                                                    }
                                                />
                                            </Fragment>
                                        );
                                    })
                                )
                            ) : (
                                <SkeletonCrawlLatestBooks count={20} />
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CrawlBeebookTemplate;
