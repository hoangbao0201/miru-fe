import Link from "next/link";
import Image from "next/image";

import { Env } from "@/config/Env";
import { ContentPageEnum } from "@/common/data.types";
import { GetBookRandomProps } from "@/services/book.services";
import { getBookTitle, getBookSlug, getBookDescription } from "@/utils/getBookTitle";

interface BannerMainProps {
    book: GetBookRandomProps;
    content: ContentPageEnum;
}
const BannerMain = ({ book, content = ContentPageEnum.comics }: BannerMainProps) => {
    const { NEXT_PUBLIC_TITLE_SEO, NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO } = Env
    const bookTitle = getBookTitle(book);
    const bookSlug = getBookSlug(book) || book?.slug;
    const bookDescription = getBookDescription(book);

    return (
        <div className="-mt-[60px] pt-[60px] md:h-[450px] h-[250px] relative overflow-hidden">
            <Image
                unoptimized
                alt=""
                width={500}
                height={500}
                className="absolute left-0 top-0 w-[100%] h-[150%] object-cover object-top select-none"
                src={
                    book?.covers?.[0]?.url ?? "/static/images/image-book-not-found.jpg"
                }
            />
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "linear-gradient(to bottom, rgba(15, 23, 42, 0.6), rgb(15, 23, 42))",
                }}
            ></div>

            <div className="relative flex py-3 px-3 mx-auto xl:max-w-screen-8xl lg:max-w-screen-lg md:max-w-screen-md">
                <Link
                    className="mr-4 block"
                    title={bookTitle}
                    href={`/${content}/books/${bookSlug}-${book?.bookId}`}
                >
                    <Image
                        unoptimized
                        width={500}
                        height={692}
                        alt=""
                        src={
                            book?.covers?.[0]?.url ?? "/static/images/image-book-not-found.jpg"
                        }
                        className="md:w-[240px] md:h-[330px] w-[112px] h-[160px] rounded-sm object-cover flex-shrink-0"
                    />
                </Link>
                <div className="flex flex-col flex-1">
                    <Link
                        title={bookTitle}
                        href={`/${content}/books/${bookSlug}-${book?.bookId}`}
                    >
                        <h2 className="mb-2 line-clamp-2 uppercase lg:leading-snug lg:text-4xl font-bold text-2xl">
                            {bookTitle}
                        </h2>
                    </Link>

                    <div className="flex flex-wrap gap-x-1 gap-y-1 mb-2">
                        {book?.tags &&
                            book?.tags.slice(0, 2).map((tag) => {
                                return (
                                    <div
                                        key={tag?.tag?.tagId}
                                        className="text-sm rounded-sm py-1 px-2 text-white bg-[#c6d4df5a]"
                                    >
                                        {tag?.tag?.name ?? tag?.tag?.tagId}
                                    </div>
                                );
                            })}
                    </div>

                    <p className="mb-2 line-clamp-3 md:block hidden">
                        {bookDescription && bookDescription.length > 0
                            ? bookDescription
                            : `Truyện tranh ${bookTitle} được cập nhật nhanh và đầy đủ nhất tại ${NEXT_PUBLIC_TITLE_SEO}. Bạn đọc đừng quên để lại bình luận và chia sẻ, ủng hộ ${NEXT_PUBLIC_TITLE_SEO} ra các chương mới nhất của truyện ${bookTitle}`}
                    </p>

                    <p className="font-semibold mb-3 md:block hidden">
                        Tới chương{" "}
                        {book?.chapters.length > 0 ? book?.chapters[0].num : 0}
                    </p>

                    <div className="mt-auto">
                        <div className="text-xl">{book?.raw}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BannerMain;
