"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Fragment, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";

import { Env } from "@/config/Env";
import classNames from "@/utils/classNames";
import Modal from "@/components/Share/Modal";
import ConfirmDeleteModal from "@/components/Share/ConfirmDeleteModal";
import convertTime from "@/utils/convertTime";
import IconEye from "@/components/Modules/Icons/IconEye";
import IconCopy from "@/components/Modules/Icons/IconCopy";
import IconPlus from "@/components/Modules/Icons/IconPlus";
import IconFilePen from "@/components/Modules/Icons/IconFilePen";
import IconTrash from "@/components/Modules/Icons/IconTrash";
import { ContentPageEnum, IMetaPage } from "@/common/data.types";
import { IGetListChaptersCreator } from "@/services/chapter.services";
import { NavButtonPagination } from "@/components/Share/NavButtonPagination";
import {
    getAllChaptersByBookIdCreatorService,
    StorageBookEnum,
    deleteChapterCreatorService,
} from "@/services/creator.services";

interface PageOptions {
    q?: string;
    page?: number;
    take?: number;
}
interface ICreatorListChaptersTemplate {
    bookId: number;
    content: ContentPageEnum;
}
const CreatorListChaptersTemplate = ({
    bookId,
    content,
}: ICreatorListChaptersTemplate) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentDate = new Date();
    const { data: session, status } = useSession();

    const [isLoading, setIsLoading] = useState(true);
    const [metaPage, setMetaPage] = useState<null | IMetaPage>(null);
    const [dataChapters, setDataChapters] = useState<
        IGetListChaptersCreator[] | null
    >(null);
    const [isShowModalListImagesChapter, setIsShowModalListImagesChapter] =
        useState<null | { title: string; num: string; images: string[] }>(null);
    const [isShowConfirmDeleteModal, setIsShowConfirmDeleteModal] =
        useState(false);
    const [chapterToDelete, setChapterToDelete] = useState<number | null>(null);

    const [_, copy] = useCopyToClipboard();

    const handleCopy = (text: string) => {
        copy(text)
            .then(() => {
                toast("Sao chép thành công!", {
                    duration: 1000,
                    position: "bottom-center",
                });
                console.log("Copied!", { text });
            })
            .catch((error) => {
                console.error("Failed to copy!", error);
            });
    };

    const eventGetDataChapters = async () => {
        if (status !== "authenticated") {
            return;
        }
        try {
            const params = new URLSearchParams({
                take: "30",
                category: content,
                bookId: String(bookId),
            });
            // page
            const page = searchParams.get("page");
            if (page) {
                params.append("page", page.toString());
            }
            // q
            const q = searchParams.get("q");
            if (q) {
                params.append("q", q.toString().trim());
            }

            // REQUEST
            setIsLoading(true);
            const dataChaptersRes = await getAllChaptersByBookIdCreatorService({
                query: `?${params.toString()}`,
                token: session?.backendTokens.accessToken,
            });

            if (dataChaptersRes?.success) {
                setMetaPage(dataChaptersRes?.meta);
                setDataChapters(dataChaptersRes?.result);
            }
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
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
        setIsShowModalListImagesChapter({ num, title, images });
    };

    const handleOpenDeleteModal = (chapterNumber: number) => {
        setChapterToDelete(chapterNumber);
        setIsShowConfirmDeleteModal(true);
    };

    const handleDeleteChapter = async () => {
        if (status !== "authenticated" || !session?.backendTokens.accessToken || !chapterToDelete) {
            return;
        }

        try {
            setIsLoading(true);
            const deleteRes = await deleteChapterCreatorService({
                token: session.backendTokens.accessToken,
                bookId,
                chapterNumber: chapterToDelete,
            });

            if (deleteRes?.success) {
                toast("Xóa chương thành công!", {
                    duration: 2000,
                    position: "bottom-center",
                });
                setIsShowConfirmDeleteModal(false);
                setChapterToDelete(null);
                // Reload data
                await eventGetDataChapters();
            } else {
                toast("Xóa chương thất bại!", {
                    duration: 2000,
                    position: "bottom-center",
                });
            }
        } catch (error) {
            toast("Có lỗi xảy ra khi xóa chương!", {
                duration: 2000,
                position: "bottom-center",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Change Page
    const handleNextPage = (query: PageOptions) => {
        if (isLoading) return;

        const params = new URLSearchParams({
            take: "30",
            category: content,
        });
        // page
        const page = query?.page || searchParams.get("page");
        if (page) {
            params.append("page", page.toString());
        }
        // q
        const q = query?.q;
        if (q !== undefined) {
            if (q === "") {
                params.append("q", q.toString().trim());
            } else {
                params.append("q", q.toString().trim());
            }
        } else {
            const q2 = searchParams.get("q");
            if (q2) {
                params.append("q", q2.toString().trim());
            }
        }

        router.replace(`?${params}`);
    };

    const handleChangePage = (page: number) => {
        handleNextPage({ page });
    };

    useEffect(() => {
        eventGetDataChapters();
    }, [status, searchParams]);

    return (
        <div>
            <div className="bg-accent px-3 py-4">
                <div className="">
                    <div className="mb-4">
                        <h1 className="text-lg font-semibold uppercase mb-4">
                            Danh sách chương truyện
                        </h1>
                    </div>

                    <div className="mb-4 pb-5 border-b border-slate-700">
                        <Link
                            title=""
                            scroll={false}
                            prefetch={false}
                            // target="_blank"
                            href={`/${content}/creator/books/${bookId}`}
                            className="px-2 h-9 flex-1 leading-9 flex item-center hover:underline"
                        >
                            <IconFilePen className="w-9 h-9 py-2 fill-white" />
                            <span className="">Chỉnh sửa truyện</span>
                        </Link>
                    </div>

                    <div className="">
                        {status === "authenticated" ? (
                            <>
                                {!isLoading && dataChapters ? (
                                    <>
                                        <div className="space-y-1 mb-1">
                                            {dataChapters?.map(
                                                (chapter, index) => {

                                                    return (
                                                        <Fragment
                                                            key={
                                                                chapter?.chapterNumber
                                                            }
                                                        >
                                                            <div>
                                                                <Link
                                                                    prefetch={
                                                                        false
                                                                    }
                                                                    // target="_blank"
                                                                    href={`/${content}/creator/books/${bookId}/chapters/${chapter?.chapterNumber}/create?v=1`}
                                                                    className={classNames(
                                                                        "w-full flex item-center justify-center cursor-pointer bg-accent-10 hover:bg-blue-500 rounded-md"
                                                                    )}
                                                                >
                                                                    <IconPlus
                                                                        size={
                                                                            24
                                                                        }
                                                                        className="p-1 fill-white"
                                                                    />
                                                                </Link>
                                                            </div>
                                                            <div
                                                                key={
                                                                    chapter?.bookId +
                                                                    "-" +
                                                                    chapter?.chapterNumber
                                                                }
                                                                className="px-3 py-2 mt-1 bg-accent-10 rounded-md"
                                                            >
                                                                <div className="flex items-center space-x-2 mb-2">
                                                                    <Link
                                                                        title=""
                                                                        target="_blank"
                                                                        prefetch={
                                                                            false
                                                                        }
                                                                        className="uppercase font-semibold hover:underline"
                                                                        href={`/${content}/books/${bookId}/chapter-${chapter?.num}-${chapter?.chapterNumber}`}
                                                                    >
                                                                        CHAP:{" "}
                                                                        {
                                                                            chapter?.num
                                                                        }
                                                                    </Link>
                                                                    <button
                                                                        onClick={() =>
                                                                            handleCopy(
                                                                                `${Env.NEXT_PUBLIC_APP_RIDIRECT_URL}/r/${content}/books/${bookId}/${chapter?.chapterNumber}`
                                                                            )
                                                                        }
                                                                        className="bg-accent-20 hover:bg-accent-20-hover rounded-md"
                                                                    >
                                                                        <IconCopy className="w-8 h-8 fill-white p-[6px]" />
                                                                    </button>

                                                                    <div className="px-1 uppercase leading-6 text-xs">
                                                                        {convertTime(
                                                                            new Date(
                                                                                chapter?.updatedAt
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="flex space-x-2">
                                                                    <button
                                                                        title=""
                                                                        className="px-2 h-9 flex-1 leading-9 flex item-center space-x-2 bg-accent-20 hover:bg-accent-20-hover rounded-lg border border-gray-500 border-dashed"
                                                                        onClick={() =>
                                                                            handleShowModalShowImagesChapter(
                                                                                {
                                                                                    num: chapter?.num,
                                                                                    images: chapter?.data,
                                                                                    title: '',
                                                                                }
                                                                            )
                                                                        }
                                                                    >
                                                                        <IconEye className="w-8 h-8 py-2 fill-white" />
                                                                        <span className="">
                                                                            Xem
                                                                            trước
                                                                        </span>
                                                                    </button>
                                                                    <Link
                                                                        title=""
                                                                        prefetch={
                                                                            false
                                                                        }
                                                                        // target="_blank"
                                                                        href={`/${content}/creator/books/${bookId}/chapters/${chapter?.chapterNumber}/update?v=1`}
                                                                        className="px-2 h-9 flex-1 leading-9 flex item-center space-x-2 bg-accent-20 hover:bg-accent-20-hover rounded-lg border border-gray-500 border-dashed"
                                                                    >
                                                                        <IconFilePen className="w-8 h-8 py-2 fill-white" />
                                                                        <span className="">
                                                                            Chỉnh
                                                                            sửa
                                                                        </span>
                                                                    </Link>
                                                                    <button
                                                                        title=""
                                                                        className="w-9 h-9 leading-9 flex item-center space-x-2 bg-red-600 hover:bg-red-500/50 rounded-lg border border-red-500 border-dashed"
                                                                        onClick={() =>
                                                                            handleOpenDeleteModal(
                                                                                chapter?.chapterNumber
                                                                            )
                                                                        }
                                                                        disabled={isLoading}
                                                                    >
                                                                        <IconTrash className="w-9 h-9 py-2 fill-white" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </Fragment>
                                                    );
                                                }
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <Link
                                                prefetch={false}
                                                // target="_blank"
                                                href={`/${content}/creator/books/${bookId}/chapters/${0}/create?v=1`}
                                                className={classNames(
                                                    "w-full flex item-center justify-center h-6 cursor-pointer bg-accent-10 hover:bg-blue-500 rounded-md"
                                                )}
                                            >
                                                <IconPlus
                                                    size={24}
                                                    className="p-1 fill-white"
                                                />
                                            </Link>
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-1">
                                        {Array.from({ length: 30 }).map(
                                            (_, i) => {
                                                return (
                                                    <Fragment key={i}>
                                                        <div className="animate-pulse h-[24px] bg-accent-10 rounded-md"></div>
                                                        <div className="animate-pulse h-[75px] mt-1 bg-slate-700 rounded-md"></div>
                                                    </Fragment>
                                                );
                                            }
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>

                    <div className="bg-slate-700/20 px-3 py-2 rounded-md mt-3">
                        {metaPage && (
                            <NavButtonPagination
                                countPage={metaPage?.pageCount}
                                handleChangePage={handleChangePage}
                                currentPage={metaPage?.currentPage}
                            />
                        )}
                    </div>
                </div>
            </div>

            {isShowModalListImagesChapter && (
                <Modal
                    size="large"
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
                    <div
                        className={classNames(
                            "flex flex-col justify-center items-center",
                            content === ContentPageEnum.manga && "gap-2"
                        )}
                    >
                        {isShowModalListImagesChapter?.images?.length > 0 ? (
                            isShowModalListImagesChapter?.images?.map(
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
                                                className="w-full mx-auto"
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

            <ConfirmDeleteModal
                isOpen={isShowConfirmDeleteModal}
                setIsOpen={setIsShowConfirmDeleteModal}
                title="Xóa chương?"
                message="Bạn có chắc chắn muốn xóa chương này? Hành động này không thể hoàn tác."
                confirmText="Xóa"
                cancelText="Hủy"
                onConfirm={handleDeleteChapter}
                isLoading={isLoading}
                loadingText="Đang xóa..."
                variant="danger"
            />
        </div>
    );
};

export default CreatorListChaptersTemplate;
