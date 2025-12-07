import Image from "next/image";

import { AlbumType } from ".";
import convertTime from "@/utils/convertTime";
import IconXmark from "../../Icons/IconXmark";
import IconLoadingSpin from "../../Icons/IconLoadingSpin";

interface ItemBookBeebookProps {
    index: number;
    isAction: null | string;
    book: AlbumType & {
        isExist: boolean;
        isSelect: boolean;
    };
    handleAddListBooksSelect: (indexBook: number) => void;
    handleRemoveBookInListBooks: (id_album: number) => void;
}
const ItemBookBeebook = ({
    index,
    book,
    isAction,
    handleAddListBooksSelect,
    handleRemoveBookInListBooks,
}: ItemBookBeebookProps) => {
    return (
        <tr className="[&>td]:px-2 [&>td]:py-2 divide-x">
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
                            src={"https://bbbokkk.com/assets/tmp/album/" + book?.info.avatar}
                        />
                    </div>
                    <div>
                        <div className="mb-2 hover:underline line-clamp-2">
                            <strong className="text-base">{book?.info.name}</strong>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span>Chapter: {book?.info.last_chapter}</span>
                            <span>Thời gian: {convertTime(new Date(book?.last_update))}</span>
                        </div>
                    </div>
                </div>
            </td>
            <td className="space-y-2">
                <button
                    onClick={() => handleAddListBooksSelect(index)}
                    disabled={book?.isExist}
                    className={`${
                        book?.isExist ? "text-white bg-green-500" : "text-white bg-blue-600"
                    } whitespace-nowrap h-10 rounded-md min-w-20 flex items-center justify-center mx-auto`}
                >
                    {isAction === `loading_crawl_book_${book?.id_album}` ? (
                        <IconLoadingSpin />
                    ) : book?.isExist ? (
                        "Tồn tại"
                    ) : (
                        "Thêm"
                    )}
                </button>

                <button
                    onClick={() => handleRemoveBookInListBooks(book.id_album)}
                    className="bg-red-500 text-white whitespace-nowrap h-10 rounded-md min-w-20 flex items-center justify-center mx-auto"
                >
                    Remove
                </button>
            </td>
        </tr>
    );
};

export default ItemBookBeebook;
