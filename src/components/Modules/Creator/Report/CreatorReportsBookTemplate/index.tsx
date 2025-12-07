"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { useCopyToClipboard, useDebounceValue } from "usehooks-ts";

import {
    RootStateTypeLoadingSlide,
    setTypeLoading,
} from "@/store/typeLoadingSlide";
import Modal from "@/components/Share/Modal";
import {
    deleteReportChapterService,
    getAllReportsChapterService,
    IListReports,
} from "@/services/report.services";
import { Env } from "@/config/Env";
import IconTrash from "@/components/Modules/Icons/IconTrash";
import IconListUl from "@/components/Modules/Icons/IconListUl";
import IconImages from "@/components/Modules/Icons/IconImages";
import { ContentPageEnum, IMetaPage } from "@/common/data.types";
import IconLoadingSpin from "@/components/Modules/Icons/IconLoadingSpin";
import { NavButtonPagination } from "@/components/Share/NavButtonPagination";
import SkeletonListTable from "@/components/Modules/Skeleton/SkeletonListTable";

const { NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO } = Env;

interface CreatorReportsBookTemplateProps {
    content: ContentPageEnum;
}
const CreatorReportsBookTemplate = ({
    content,
}: CreatorReportsBookTemplateProps) => {
    const { data: session, status } = useSession();
    const dispatch = useDispatch();
    const { nameTypeLoading } = useSelector(
        (state: RootStateTypeLoadingSlide) => state.typeLoading
    );

    const [metaPage, setMetaPage] = useState<null | IMetaPage>(null);
    const [dataListReportsDefault, setDataListReportsDefault] = useState<
        null | IListReports[]
    >(null);
    const [optionsQuery, setOptionsQuery] = useState<{
        page: number;
        q: string;
    }>({
        page: 1,
        q: "",
    });
    const [isFormDeleteBook, setIsFormDeleteBook] = useState<Pick<
        IListReports,
        "bookId" | "chapterNumber"
    > | null>(null);
    const [isShowModalListImagesChapter, setIsShowModalListImagesChapter] =
        useState<null | { images: string[]; num: string; title: string }>(null);

    const [_, copy] = useCopyToClipboard();

    const [queryDataDebouce] = useDebounceValue(optionsQuery, 500);

    // Event Get Books
    const eventGetReports = async () => {
        if (status !== "authenticated") {
            return;
        }
        setDataListReportsDefault(null);
        window.scrollTo({ top: 0 });
        try {
            const params = new URLSearchParams({
                take: "40",
                category: content,
                page: queryDataDebouce.page.toString(),
            });
            if (queryDataDebouce.q) {
                params.append("q", queryDataDebouce.q);
            }

            const reportsRes = await getAllReportsChapterService({
                query: `?${params.toString()}`,
                token: session?.backendTokens.accessToken,
            });

            if (reportsRes?.success) {
                setMetaPage(reportsRes?.meta);
                setDataListReportsDefault(reportsRes?.result);
            }
        } catch (error) {}
    };

    // Handle Change Page
    const handleChangePage = (page: number) => {
        setOptionsQuery((state) => ({
            ...state,
            page: page,
        }));
    };

    const handleShowModalShowImagesChapter = async ({
        num,
        title,
        images,
    }: {
        num: string;
        title: string;
        images: string[];
    }) => {
        setIsShowModalListImagesChapter({
            num: num,
            images: images,
            title: title,
        });
    };

    const handleDeleteReport = async () => {
        if (
            !session ||
            status !== "authenticated" ||
            !isFormDeleteBook ||
            !dataListReportsDefault
        ) {
            return;
        }

        const { bookId, chapterNumber } = isFormDeleteBook;
        const { accessToken } = session.backendTokens;

        dispatch(setTypeLoading("button_delete_book"));

        try {
            const deleteReportRes = await deleteReportChapterService({
                bookId,
                chapterNumber,
                token: accessToken,
            });

            if (deleteReportRes.success) {
                const dataReportsFilter = dataListReportsDefault.filter(
                    (report) =>
                        report.bookId !== bookId ||
                        report.chapterNumber !== chapterNumber
                );

                setDataListReportsDefault(dataReportsFilter);
            }
            setIsFormDeleteBook(null);
        } catch (error) {
            console.error("Error deleting report:", error);
        } finally {
            dispatch(setTypeLoading(""));
        }
    };

    // Handle Copy
    const handleCopy = (text: string) => {
        copy(text)
            .then(() => {
                toast("Sao chép thành công!", {
                    duration: 700,
                    position: "top-center",
                });
                console.log("Copied!", { text });
            })
            .catch((error) => {
                console.error("Failed to copy!", error);
            });
    };

    useEffect(() => {
        eventGetReports();
    }, [status]);

    useEffect(() => {
        eventGetReports();
    }, [queryDataDebouce]);

    return (
        <>
            <div>
                <div className="bg-slate-800 px-3 py-4 rounded-md shadow-sm">
                    <div className="overflow-x-auto relative border border-gray-300 mb-5">
                        <table className="table-auto min-w-[680px] w-full">
                            <colgroup>
                                <col style={{ minWidth: "10%" }} />
                                <col style={{ minWidth: "10%" }} />
                                <col style={{ minWidth: "15%" }} />
                                <col style={{ minWidth: "15%" }} />
                            </colgroup>
                            <thead className="text-gray-600 bg-gray-100">
                                <tr className="whitespace-nowrap uppercase [&>th]:px-2 [&>th]:py-2 [&>th]:font-semibold">
                                    <th className="">Id</th>
                                    <th>Truyện</th>
                                    <th>Số lần</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-sm">
                                {status === "authenticated" &&
                                    (dataListReportsDefault ? (
                                        dataListReportsDefault?.map(
                                            (report, index) => {
                                                return (
                                                    <tr
                                                        key={
                                                            report?.bookId +
                                                            report?.chapterNumber
                                                        }
                                                        className="[&>td]:px-2 [&>td]:py-2 divide-x"
                                                    >
                                                        <td className="text-center">
                                                            {report?.bookId}
                                                        </td>
                                                        <td className="">
                                                            <div className="flex">
                                                                <div className="w-20 h-28 flex-shrink-0 mr-2">
                                                                    <Image
                                                                        alt=""
                                                                        width={
                                                                            56
                                                                        }
                                                                        height={
                                                                            80
                                                                        }
                                                                        unoptimized
                                                                        loading="lazy"
                                                                        className={`w-20 h-28 border object-cover`}
                                                                        src={
                                                                            report
                                                                                ?.book
                                                                                ?.covers?.[0]
                                                                                ?.url ??
                                                                            "/static/images/image-book-not-found.jpg"
                                                                        }
                                                                    />
                                                                </div>
                                                                <div className="flex-1 flex flex-col">
                                                                    <div className="mb-3 space-x-2 flex items-center relative">
                                                                        <strong className="uppercase">
                                                                            <Link
                                                                                href={`/${content}/books/${report?.book?.bookId}`}
                                                                                prefetch={
                                                                                    false
                                                                                }
                                                                                target="_blank"
                                                                                className="hover:underline line-clamp-1"
                                                                            >
                                                                                {
                                                                                    report
                                                                                        ?.book
                                                                                        ?.title
                                                                                }
                                                                            </Link>
                                                                        </strong>
                                                                        <button
                                                                            className="hover:underline py-[1px] px-[2px]"
                                                                            onClick={() =>
                                                                                handleCopy(
                                                                                    report?.book?.title.trim()
                                                                                )
                                                                            }
                                                                        >
                                                                            copy
                                                                        </button>
                                                                    </div>
                                                                    <div className="mb-2 flex items-center space-x-2">
                                                                        <div className="font-semibold">
                                                                            Lỗi
                                                                            chương:
                                                                        </div>{" "}
                                                                        <Link
                                                                            title=""
                                                                            target="_blank"
                                                                            prefetch={
                                                                                false
                                                                            }
                                                                            className="text-blue-500 hover:underline"
                                                                            href={`/${content}/books/${report?.book?.slug}-${report?.book?.bookId}/chapter-${report?.chapter?.num}-${report?.chapter?.chapterNumber}`}
                                                                        >
                                                                            Chapter:{" "}
                                                                            {
                                                                                report
                                                                                    ?.chapter
                                                                                    ?.num
                                                                            }
                                                                        </Link>
                                                                    </div>

                                                                    <div className="mt-auto">
                                                                        <button
                                                                            title=""
                                                                            className="px-3 py-2 rounded-sm text-white bg-blue-500"
                                                                            onClick={() =>
                                                                                handleShowModalShowImagesChapter(
                                                                                    {
                                                                                        num: report
                                                                                            .chapter
                                                                                            .num,
                                                                                        title: report
                                                                                            .book
                                                                                            .title,
                                                                                        images: report
                                                                                            .chapter
                                                                                            .data,
                                                                                    }
                                                                                )
                                                                            }
                                                                        >
                                                                            Xem
                                                                            sơ
                                                                            lượt
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="text-center">
                                                            {report?.count}
                                                        </td>
                                                        <td className="">
                                                            <div className="select-none mx-auto w-[86px] grid grid-cols-2 gap-2">
                                                                <Link
                                                                    prefetch={
                                                                        false
                                                                    }
                                                                    title="Chi tiết chương"
                                                                    className="block w-10 h-10 bg-slate-600 hover:bg-slate-700"
                                                                    href={`/${content}/creator/books/${report?.bookId}/chapters/${report?.chapterNumber}/update`}
                                                                >
                                                                    <IconImages
                                                                        size={
                                                                            40
                                                                        }
                                                                        className="p-2 fill-white"
                                                                    />
                                                                </Link>
                                                                <Link
                                                                    prefetch={
                                                                        false
                                                                    }
                                                                    title="Danh sách chương"
                                                                    className="block w-10 h-10 bg-slate-600 hover:bg-slate-700"
                                                                    href={`/${content}/creator/books/${report?.bookId}/chapters`}
                                                                >
                                                                    <IconListUl
                                                                        size={
                                                                            40
                                                                        }
                                                                        className="p-2 fill-white"
                                                                    />
                                                                </Link>

                                                                <div>
                                                                    <button
                                                                        title="Kiểm tra chương mới"
                                                                        className={
                                                                            "block w-10 h-10 bg-slate-600 opacity-100"
                                                                        }
                                                                        onClick={() =>
                                                                            setIsFormDeleteBook(
                                                                                {
                                                                                    bookId: report?.bookId,
                                                                                    chapterNumber:
                                                                                        report?.chapterNumber,
                                                                                }
                                                                            )
                                                                        }
                                                                    >
                                                                        <IconTrash
                                                                            size={
                                                                                40
                                                                            }
                                                                            className={`p-2 fill-white`}
                                                                        />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )
                                    ) : (
                                        <SkeletonListTable count={20} col={4} />
                                    ))}
                            </tbody>
                        </table>
                    </div>

                    {metaPage && (
                        <NavButtonPagination
                            countPage={metaPage?.pageCount}
                            currentPage={metaPage.currentPage}
                            handleChangePage={handleChangePage}
                        />
                    )}
                </div>
            </div>
            {isShowModalListImagesChapter && (
                <Modal
                    size="small"
                    isOpen={!!isShowModalListImagesChapter}
                    setIsOpen={() => setIsShowModalListImagesChapter(null)}
                    title={
                        "Xem sơ lượt chương " +
                        isShowModalListImagesChapter?.num
                    }
                >
                    <div className="px-4 text-center font-semibold text-lg mb-3">
                        {isShowModalListImagesChapter?.title.toUpperCase()}
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        {isShowModalListImagesChapter?.images?.length > 0 ? (
                            isShowModalListImagesChapter?.images.map(
                                (image) => {
                                    return (
                                        <div key={image} className="bg-red-950">
                                            <Image
                                                alt=""
                                                title=""
                                                width={200}
                                                height={200}
                                                unoptimized
                                                loading="lazy"
                                                className="mx-auto"
                                                src={image}
                                                style={{
                                                    background:
                                                        "URL('/static/images/chapter_load.gif') top center no-repeat",
                                                }}
                                            />
                                        </div>
                                    );
                                }
                            )
                        ) : (
                            <div className="text-center py-3">
                                Không có ảnh nào!
                            </div>
                        )}
                    </div>
                </Modal>
            )}

            {isFormDeleteBook && (
                <Modal
                    size="medium"
                    title="Xóa báo cáo này?"
                    isOpen={!!isFormDeleteBook}
                    setIsOpen={(type) => setIsFormDeleteBook(null)}
                >
                    <div className="">
                        Bạn không thể khôi phục báo cáo này nếu xóa đi.
                    </div>

                    <div className="text-right mt-4 flex justify-end">
                        <button
                            title="Nút hủy phương thức"
                            onClick={() => setIsFormDeleteBook(null)}
                            className="py-2 px-3 rounded-md border text-black bg-white hover:bg-gray-200 min-w-20"
                        >
                            Hủy
                        </button>
                        <button
                            title="Nút xóa báo cáo"
                            onClick={handleDeleteReport}
                            className="py-2 px-3 flex items-center justify-center space-x-2 rounded-md border text-white bg-indigo-600 hover:bg-indigo-700 min-w-20 ml-2"
                        >
                            <span>Xóa</span>
                            {nameTypeLoading === "button_delete_book" && (
                                <IconLoadingSpin size={14} />
                            )}
                        </button>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default CreatorReportsBookTemplate;
