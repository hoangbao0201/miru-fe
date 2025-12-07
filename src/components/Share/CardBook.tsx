"use client";

import Link from "next/link";
import Image from "next/image";

import convertTime from "@/utils/convertTime";
import { Env } from "@/config/Env";
import { ContentPageEnum } from "@/common/data.types";
import { GetBooksProps } from "@/services/book.services";
import { getBookTitle, getBookSlug } from "@/utils/getBookTitle";

const { NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO } = Env

interface CardBookProps {
    currentDate: Date;
    book: GetBooksProps;
    content: ContentPageEnum;
}
const CardBook = ({
    book,
    currentDate,
    content = ContentPageEnum.comics,
}: CardBookProps) => {
    const createdAtDate = new Date(book.createdAt);
    const diffInDays =
        (currentDate.getTime() - createdAtDate.getTime()) /
        (1000 * 60 * 60 * 24);
    
    const bookTitle = getBookTitle(book);
    const bookSlug = getBookSlug(book) || book?.slug;

    return (
        <figure>
            <div className="">
                <div className="relative text-center overflow-hidden mb-2">
                    <div className="absolute flex top-1 left-1 right-0 space-x-1 leading-loose">
                        {book?.isFeatured && (
                            <span className="px-1 rounded-sm bg-red-600 text-white text-sm font-bold shadow">
                                HOT
                            </span>
                        )}
                        {diffInDays <= 3 && (
                            <span className="px-1 rounded-sm bg-blue-600 text-white text-sm font-bold shadow">
                                NEW
                            </span>
                        )}
                    </div>
                    <Link
                        prefetch={false}
                        href={`/${content}/books/${bookSlug}-${book?.bookId}`}
                        title={`Truyện tranh ${bookTitle}`}
                        className="align-middle"
                    >
                        <Image
                            key={`${book?.bookId}`}
                            unoptimized
                            loading="lazy"
                            src={
                                book?.covers?.[0]?.url ?? "/static/images/image-book-not-found.jpg"
                            }
                            width={175}
                            height={238}
                            alt={`Truyện tranh ${bookTitle}`}
                            className="pt-0 w-full aspect-[125/173] rounded-md object-cover bg-accent align-middle"
                        />
                    </Link>
                </div>
                <div className="">
                    <Link
                        prefetch={false}
                        href={`/${content}/books/${bookSlug}-${book?.bookId}`}
                        title={bookTitle}
                    >
                        <h3 className="text-[17px] line-clamp-2 font-semibold text-foreground">
                            {bookTitle}
                        </h3>
                    </Link>
                    <div className="mt-2">
                        {book?.chapters.map((chapter, index) => {
                            return (
                                <div
                                    key={index}
                                >
                                    <Link
                                        prefetch={false}
                                        title={`Chương ${chapter?.num}`}
                                        className="py-1 text-xs mb-2 flex items-center justify-between whitespace-nowrap space-x-1 overflow-hidden"
                                        href={`/${content}/books/${bookSlug}-${book?.bookId}/chapter-${chapter?.num}-${chapter?.chapterNumber}`}
                                    >
                                        <span className="uppercase text-foreground font-bold">{chapter?.num?.includes('oneshot') ? chapter?.num : "Chap " + chapter?.num}</span>

                                        <span className="uppercase text-muted-foreground">{`${convertTime(
                                            chapter?.createdAt
                                        )}`}</span>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </figure>
    );
};

export default CardBook;
