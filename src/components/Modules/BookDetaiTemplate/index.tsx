"use client";

import Link from "next/link";
import Image from "next/image";
import { Fragment } from "react";
import dynamic from "next/dynamic";

import { Env } from "@/config/Env";
import SumaryBook from "./SumaryBook";
import IconPlay from "../Icons/IconPlay";
import ButtonFollow from "./ButtonFollow";
import { listTagSeo } from "@/constants/data";
import IconBookOpen from "../Icons/IconBookOpen";
import CardBook from "@/components/Share/CardBook";
import { ContentPageEnum } from "@/common/data.types";
import BoxHeading from "@/components/Share/BoxHeading";
import Breadcrumbs from "@/components/Share/BreadCrumbs";
import SkeletonFormComment from "../Skeleton/SkeletonFormComment";
import {
    GetBookProps,
    GetBooksProps,
    IAltTitleBookType,
} from "@/services/book.services";
import BoxShare from "./BoxShare";
import IconEye from "../Icons/IconEye";
import { Tab } from "@headlessui/react";
import ListImageBook from "./ListImageBook";
import classNames from "@/utils/classNames";
import { flagLink } from "@/constants/flag";
import IconBookMark from "../Icons/IconBookMark";
import IconUserCrow from "../Icons/IconUserCrow";
import TopAds from "@/components/Share/FormAds/TopAds";
import { TypeCommentEnum } from "@/store/comment/comment.reducer";
import InfoContact from "./InfoContact";
import { getBookTitle, getBookSlug, getBookDescription } from "@/utils/getBookTitle";

const { NEXT_PUBLIC_TITLE_SEO } = Env;

const ListChapter = dynamic(() => import("./ListChapter"), {
    ssr: false,
    loading: () => (
        <div className="rounded-md bg-slate-700 h-[566px] animate-pulse"></div>
    ),
});
const FormComment = dynamic(() => import("@/components/Share/FormComment"), {
    ssr: false,
    loading: () => <SkeletonFormComment />,
});

interface BookDetailTemplateProps {
    readId?: string;
    book: GetBookProps;
    books: GetBooksProps[];
    content: ContentPageEnum;
    type: "AUTHOR" | "SUGGEST";
}
const BookDetailTemplate = ({
    type,
    book,
    books,
    readId,
    content,
}: BookDetailTemplateProps) => {
    const currentDate = new Date();
    const bookTitle = getBookTitle(book);
    const bookSlug = getBookSlug(book) || book?.slug;
    const bookDescription = getBookDescription(book);

    return (
        <>
            <div className="md:h-[450px] h-[250px] absolute top-0 left-0 right-0 bottom-0 -z-[1]">
                <div className="md:h-[450px] h-[250px] relative overflow-hidden">
                    <Image
                        unoptimized
                        alt=""
                        width={500}
                        height={500}
                        className="absolute left-0 top-0 w-[100%] h-[150%] object-cover object-top"
                        src={
                            book?.posters?.[0]?.url ??
                            book?.covers?.[0]?.url ??
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
                </div>
            </div>
            <div className="py-2">
                <Breadcrumbs
                    listBreadcrumbs={[
                        {
                            title: bookTitle,
                            slug: `/${content}/books/${bookSlug}-${book?.bookId}`,
                        },
                    ]}
                    className="mb-4 px-3"
                />
                <div className="py-4">
                    <article className="px-3">
                        <div className="lg:flex gap-4 -mx-3">
                            <div className="px-3 pb-4 flex-shrink-0">
                                {book ? (
                                    <Image
                                        unoptimized
                                        loading="lazy"
                                        width={350}
                                        height={350}
                                        alt={`Ảnh truyện ${bookTitle}`}
                                        className="object-cover aspect-auto shadow max-w-[250px] mx-auto"
                                        src={
                                            book?.covers?.[0]?.url ??
                                            "/static/images/image-book-not-found.jpg"
                                        }
                                    />
                                ) : (
                                    ""
                                )}
                            </div>
                            <div className="px-3 pb-4 flex-1 flex flex-col">
                                <div className="mb-auto">
                                    <div className="flex-1 lg:text-start text-center mb-5">
                                        <h1
                                            title={bookTitle}
                                            className="uppercase lg:leading-snug lg:text-4xl font-bold text-2xl mb-2"
                                        >
                                            {bookTitle}
                                        </h1>
                                    </div>
                                </div>

                                {/* THEO DÕI */}
                                <div className="mb-2 flex">
                                    <ButtonFollow bookId={book?.bookId} />
                                </div>

                                {/* CHƯƠNG ĐẦU - CHƯƠNG CUỐI */}
                                <div className="flex flex-wrap space-x-2 mb-4">
                                    {book?.chapterFirst && (
                                        <>
                                            <Link
                                                prefetch={false}
                                                href={`/${content}/books/${
                                                    bookSlug
                                                }-${book?.bookId}/chapter-${
                                                    book?.chapterFirst?.num
                                                }-${
                                                    book?.chapterFirst
                                                        ?.chapterNumber || 1
                                                }`}
                                                title={
                                                    "Đọc truyện " +
                                                    bookTitle +
                                                    " - Chương " +
                                                    book?.chapterFirst?.num
                                                }
                                                className="text-sm font-bold uppercase rounded-lg whitespace-nowrap lg:max-w-[250px] flex-1 px-2 h-12 text-white bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
                                            >
                                                <IconPlay
                                                    size={20}
                                                    className="fill-white"
                                                />
                                                <div className="ml-3 font-semibold">
                                                    Đọc từ đầu
                                                </div>
                                            </Link>
                                            <Link
                                                prefetch={false}
                                                title={
                                                    "Đọc truyện " +
                                                    bookTitle +
                                                    " - Chương " +
                                                    book?.chapterLatest.num
                                                }
                                                href={`/${content}/books/${bookSlug}-${book?.bookId}/chapter-${book?.chapterLatest?.num}-${book?.chapterLatest?.chapterNumber}`}
                                                className="text-sm font-bold uppercase rounded-lg whitespace-nowrap lg:max-w-[250px] flex-1 px-2 h-12 bg-accent hover:bg-accent-hover flex items-center justify-center"
                                            >
                                                <IconBookOpen
                                                    size={22}
                                                    className=""
                                                />
                                                <div className="ml-3 font-semibold">
                                                    Đọc mới nhất
                                                </div>
                                            </Link>
                                        </>
                                    )}
                                </div>

                                {/* THỂ LOẠI */}
                                <div className="flex flex-wrap gap-2">
                                    {book?.tags.map((tag) => {
                                        return (
                                            <Link
                                                prefetch={false}
                                                key={tag?.metaId}
                                                title={tag?.name}
                                                href={`/${content}/tags/${tag?.metaId}`}
                                                className="block px-2 h-6 text-xs font-semibold uppercase leading-6 bg-accent hover:bg-accent-hover rounded-lg"
                                            >
                                                {tag?.name ??
                                                    tag?.metaId}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="">
                            <TopAds />

                            <div className="mb-3">
                                <SumaryBook
                                    sumary={
                                        bookDescription &&
                                        bookDescription.trim().length > 0
                                            ? bookDescription
                                            : `${bookTitle} được cập nhật nhanh và đầy đủ nhất tại ${NEXT_PUBLIC_TITLE_SEO}. Bạn đọc đừng quên để lại bình luận và chia sẻ, ủng hộ ${NEXT_PUBLIC_TITLE_SEO} ra các chương mới nhất của truyện`
                                    }
                                />
                            </div>

                            <div className="mb-4 flex max-lg:flex-col gap-4">
                                <div className="lg:w-4/12 flex flex-col gap-2 mb-3">
                                    <BoxShare
                                        content={book?.category}
                                        url={`${Env.NEXT_PUBLIC_APP_URL}/${content}/books/${book?.bookId}`}
                                    />

                                    {book?.contributors?.[0]?.user && (
                                        <InfoContact
                                            user={
                                                book?.contributors?.[0]
                                                    ?.user
                                            }
                                            content={content}
                                        />
                                    )}

                                    <div className="flex gap-2">
                                        <div className="flex items-center bg-accent overflow-hidden rounded lg:max-w-[300px] w-full">
                                            <IconBookMark
                                                className="w-[52px] h-[52px] p-4 rounded-sm rounded-r-none bg-sky-500 fill-white"
                                            />
                                            <div className="px-2">
                                                <div className="text-lg font-bold">
                                                    {book?._count.usersFollow.toLocaleString(
                                                        "de-DE"
                                                    ) || 0}
                                                </div>
                                                <div className="text-sm">
                                                    Theo dõi
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center bg-accent overflow-hidden rounded lg:max-w-[300px] w-full">
                                            <IconEye
                                                className="w-[52px] h-[52px] p-4 rounded-sm rounded-r-none bg-indigo-500 fill-white"
                                            />
                                            <div className="px-2">
                                                <div className="text-lg font-bold">
                                                    {book?.totalViews.toLocaleString(
                                                        "de-DE"
                                                    ) || 0}
                                                </div>
                                                <div className="text-sm">
                                                    Lượt xem
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="">
                                        {book?.author?.name && (
                                            <div>
                                                <IconUserCrow />
                                                <div className="">
                                                    <Link
                                                        prefetch={false}
                                                        className="hover:underline text-blue-500"
                                                        href={`/search-advanced?author=${book?.author?.name}`}
                                                    >
                                                        {book?.author?.name}
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {book?.altTitles && (
                                        <div className="mb-3">
                                            <ListAltTitles
                                                data={book?.altTitles}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="lg:w-8/12">
                                    <Tab.Group>
                                        <Tab.List className="flex space-x-1 mb-4 p-1 bg-accent rounded-lg">
                                            <Tab
                                                className={({ selected }) =>
                                                    classNames(
                                                        "flex-1 w-full text-sm font-bold uppercase rounded-lg px-2 py-2 transition text-foreground",
                                                        selected
                                                            ? "bg-success text-white"
                                                            : "bg-accent-10 hover:bg-accent-20"
                                                    )
                                                }
                                            >
                                                DS.CHƯƠNG
                                            </Tab>
                                            <Tab
                                                className={({ selected }) =>
                                                    classNames(
                                                        "flex-1 w-full text-sm font-bold uppercase rounded-lg px-3 py-2 transition text-foreground",
                                                        selected
                                                            ? "bg-success text-white"
                                                            : "bg-accent-10 hover:bg-accent-20"
                                                    )
                                                }
                                            >
                                                DS.ẢNH
                                            </Tab>
                                        </Tab.List>

                                        <Tab.Panels>
                                            <Tab.Panel>
                                                <h2
                                                    title="Danh sách chương"
                                                    className="text-sm mb-4 font-bold"
                                                >
                                                    DANH SÁCH CHƯƠNG
                                                </h2>
                                                <ListChapter
                                                    slug={bookSlug}
                                                    content={content}
                                                    bookId={book?.bookId}
                                                />
                                            </Tab.Panel>
                                            <Tab.Panel>
                                                <h2
                                                    title="Danh sách chương"
                                                    className="text-sm mb-4 font-bold"
                                                >
                                                    DANH SÁCH ẢNH
                                                </h2>
                                                <ListImageBook
                                                    bookId={book?.bookId}
                                                />
                                            </Tab.Panel>
                                        </Tab.Panels>
                                    </Tab.Group>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>

                <div className="lg:flex relative">
                    <div className="lg:w-4/12 px-3 pb-4">
                        <div className="px-3 py-3 sticky top-16 rounded-md border text-white bg-gradient-to-r from-cyan-800 to-blue-700">
                            <h4 className="font-semibold pb-1 text-lg">
                                Chính sách bình luận
                            </h4>
                            <ul className="[&>li]:pb-2">
                                <li>
                                    1. Cấm spam, chia sẻ liên kết không liên
                                    quan hoặc quảng cáo.
                                </li>
                                <li>
                                    2. Cấm sử dụng ngôn từ tục tĩu, đồi
                                    trụy, từ ngữ thô tục.
                                </li>
                                <li>
                                    3. Cấm sử dụng ngôn ngữ xúc phạm, phân
                                    biệt hoặc gây thù hằn giữa các cá nhân,
                                    nhóm người.
                                </li>
                            </ul>
                            <div className="bg-gray-100 py-1 px-2 text-red-600 pt-2">
                                Mọi hành vi được cho là vi phạm sẽ được xem
                                xét và khóa tài khoản vĩnh viễn!
                            </div>

                            <div className="flex justify-between pt-2 -mx-3 -mb-3">
                                <Image
                                    alt=""
                                    width={50}
                                    height={50}
                                    className=""
                                    src={"/static/images/bg-left.png"}
                                />
                                <Image
                                    alt=""
                                    width={50}
                                    height={50}
                                    className=""
                                    src={"/static/images/bg-right.png"}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="lg:w-8/12 pb-4 px-3">
                        <FormComment
                            bookId={book?.bookId}
                            type={TypeCommentEnum.BOOK}
                            readId={Number(readId) || null}
                        />
                    </div>
                </div>

                <div className="px-3 py-4">
                    <BoxHeading
                        heading="2"
                        title={
                            type === "AUTHOR"
                                ? "TRUYỆN CÙNG TÁC GIẢ"
                                : "TRUYỆN CÙNG THỂ LOẠI"
                        }
                    />

                    <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-3">
                        {books &&
                            books.map((bookSuggest) => {
                                return (
                                    <Fragment key={bookSuggest.bookId}>
                                        <CardBook
                                            content={content}
                                            book={bookSuggest}
                                            currentDate={currentDate}
                                        />
                                    </Fragment>
                                );
                            })}
                    </div>
                </div>

                {/* TỪ KHÓA */}
                <div className="px-3 py-4">
                    <BoxHeading heading="2" title="Từ khóa"/>
                    <div className="flex flex-wrap gap-1">
                        {listTagSeo[content].map((tag) => {
                            return (
                                <Link
                                    key={tag}
                                    prefetch={false}
                                    title={`${bookTitle} ${tag}`}
                                    href={`/${content}/seo/${bookSlug}-${tag}`}
                                >
                                    <div className="block px-2 py-1 text-sm uppercase leading-tight bg-accent text-muted-foreground rounded-lg">
                                        {bookTitle.toLowerCase()}
                                        &nbsp;{tag}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookDetailTemplate;

const ListAltTitles = ({ data }: { data: IAltTitleBookType[] }) => {
    return (
        <>
            <h4 className="mb-2 font-semibold">Tiêu đề thay thế</h4>
            <div className="divide-y divide-white/10">
                {data.map((item, index) => {
                    const key = Object.keys(item)[0];
                    const name = item?.title;
                    const flagUrl = flagLink(key);

                    return (
                        <div
                            key={index}
                            className="flex items-center py-2 space-x-2 font-semibold"
                        >
                            <Image
                                unoptimized
                                width={150}
                                height={100}
                                alt={`${key} flag`}
                                className="w-8 h-5"
                                src={flagUrl}
                            />
                            <span>{name}</span>
                        </div>
                    );
                })}
            </div>
        </>
    );
};
