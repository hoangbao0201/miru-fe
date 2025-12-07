import Image from "next/image";
import Link from "next/link";

import { Env } from "@/config/Env";
import { ContentPageEnum } from "@/common/data.types";
import { GetBookRandomProps } from "@/services/book.services";
import { getBookTitle, getBookSlug, getBookDescription } from "@/utils/getBookTitle";

const NavBanner = async ({
    book,
    content = ContentPageEnum.comics,
}: {
    content: ContentPageEnum;
    book: GetBookRandomProps;
}) => {
    const { NEXT_PUBLIC_TITLE_SEO, NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO } = Env
    const bookTitle = getBookTitle(book);
    const bookSlug = getBookSlug(book) || book?.slug;
    const bookDescription = getBookDescription(book);

    return (
        <div className="mb-5 md:mx-0 -mx-3">
            <div
                className={`relative overflow-hidden w-full`}
                style={{
                    background:
                        "radial-gradient(382px at 50% 50.2%, rgb(73, 76, 212) 0.1%, rgb(3, 1, 50) 100.2%)",
                }}
            >
                <div className="absolute -inset-2 bg-[rgba(0,0,0,.4)] backdrop-blur-xl"></div>
                <div className="absolute -inset-2 bg-[rgba(0,0,0,.1)] bg-[url('https://phinf.pstatic.net/memo/20240831_150/1725045336254rLqy9_PNG/pattern.png')]"></div>

                <div className="relative flex py-3 md:px-4 px-3 w-full">
                    <div className="mr-[10px] flex flex-col flex-1">
                        <h2 className="mb-2 line-clamp-2 font-bold uppercase">
                            {bookTitle}
                        </h2>

                        <div className="flex flex-wrap gap-x-1 gap-y-1 mb-2">
                            {book?.tags &&
                                book?.tags.slice(0, 2).map((tag) => {
                                    return (
                                        <a
                                            key={tag?.tag?.tagId}
                                            className="text-sm rounded-sm py-[2px] px-[5px] text-white bg-[#c6d4df5a]"
                                            href="/"
                                        >
                                            {tag?.tag?.tagId}
                                        </a>
                                    );
                                })}
                        </div>

                        <p className="md:hidden block text-sm">
                            Tới chương{" "}
                            {book?.chapters.length > 0
                                ? book?.chapters[0].num
                                : 0}
                        </p>
                        <div className="md:block hidden">
                            <p className="mb-2 line-clamp-2 text-sm">
                                {bookDescription && bookDescription.length > 0
                                    ? bookDescription
                                    : `Truyện tranh ${bookTitle} được cập nhật nhanh và đầy đủ nhất tại ${NEXT_PUBLIC_TITLE_SEO}. Bạn đọc đừng quên để lại bình luận và chia sẻ, ủng hộ ${NEXT_PUBLIC_TITLE_SEO} ra các chương mới nhất của truyện ${bookTitle}`}
                            </p>
                        </div>

                        <div className="mt-auto">
                            <Link
                                title=""
                                prefetch={false}
                                href={`/books/${bookSlug}-${book?.bookId}`}
                            >
                                <div className="text-center w-full px-[5px] py-[8px] font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700">
                                    Đọc ngay
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="pr-4 ">
                        <div
                            className="relative"
                            style={{
                                transform: "perspective(70px) rotateY(-4deg)",
                            }}
                        >
                            <Image
                                width={107}
                                height={152}
                                alt=""
                                unoptimized
                                src={
                                    book?.covers?.[0]?.url ?? "/static/images/image-book-not-found.jpg"
                                }
                                className="w-[107px] h-[152px] object-cover flex-shrink-0"
                            />
                            <div
                                className="top-[4px] z-1 -right-[8px] w-[8px] h-[95%] absolute bg-gray-200"
                                style={{
                                    boxShadow: "inset 0 0 5px #333",
                                    transform: "perspective(8px) rotateY(3deg)",
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavBanner;
