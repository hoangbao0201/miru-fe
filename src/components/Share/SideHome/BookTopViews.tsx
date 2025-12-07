import Link from "next/link";
import Image from "next/image";

import { Env } from "@/config/Env";
import { ContentPageEnum } from "@/common/data.types";
import { convertViewsCount } from "@/utils/convertViewsCount";
import { GetAllBooksTopViewsProps } from "@/services/book.services";
import { getBookTitle, getBookSlug } from "@/utils/getBookTitle";

const { NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO } = Env;

interface BookTopViewsProps {
    content: ContentPageEnum;
    books: GetAllBooksTopViewsProps[];
}
const BookTopViews = ({
    books,
    content = ContentPageEnum.comics,
}: BookTopViewsProps) => {
    return (
        <ul className="space-y-3">
            {books &&
                books?.map((book, index) => {
                    const cover =
                        book?.covers?.[0]?.url ||
                        "/static/images/image-book-not-found.jpg";
                    const bookTitle = getBookTitle(book);
                    const bookSlug = getBookSlug(book) || book?.slug;

                    return (
                        <li
                            key={book?.bookId}
                            className="group transition-colors"
                        >
                            <Link
                                prefetch={false}
                                href={`/${book?.category}/books/${bookSlug}-${book?.bookId}`}
                                title={`Truyện tranh ${bookTitle}`}
                                className="flex gap-3 py-2"
                            >
                                <span className="h-6 w-6 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-xs font-bold text-white shadow-md">
                                    {index + 1}
                                </span>
                                <div className="relative flex-shrink-0">
                                    <Image
                                        unoptimized
                                        loading="lazy"
                                        src={cover}
                                        width={64}
                                        height={86}
                                        alt={`Truyện tranh ${bookTitle}`}
                                        className="w-16 h-[86px] rounded-md object-cover bg-muted"
                                    />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h5 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                                        {bookTitle}
                                    </h5>

                                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] uppercase tracking-wide text-primary">
                                            {book?.category || content}
                                        </span>
                                        <span>
                                            Lượt xem{" "}
                                            <span className="font-semibold text-foreground">
                                                {convertViewsCount(
                                                    book?.views || 0
                                                )}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    );
                })}
        </ul>
    );
};

export default BookTopViews;
