"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
    ChangeEvent,
    Fragment,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

import { Env } from "@/config/Env";
import IconPlus from "@/components/Modules/Icons/IconPlus";
import SelectOptions from "@/components/Share/SelectOptions";
import {
    StorageBookEnum,
    updateStorageBookCreatorService,
    updateCategoryBookCreatorService,
    createCoverBookByUrlCreatorService,
    createCoverBookByFileCreatorService,
    createPosterBookByUrlCreatorService,
    createPosterBookByFileCreatorService,
    updateCoverOrderBookCreatorService,
    updatePosterOrderBookCreatorService,
    deleteCoverBookCreatorService,
    deletePosterBookCreatorService,
} from "@/services/creator.services";
import TagSelector from "./TagSelector";
import { flagLink, flagMapping } from "@/constants/flag";
import {
    GetDetailBookCreatorResType,
    GetListTagsBookResType,
    UserBookContributorRole,
    IAltTitleBookType,
} from "@/store/book/book.type";
import {
    updateBookApi,
    createBookApi,
    getListTagsBookApi,
    getDetailBookCreatorApi,
    addMemberContributorBookApi,
    outMemberContributorBookApi,
} from "@/store/book/book.api";
import classNames from "@/utils/classNames";
import Button from "@/components/ui/Button";
import ListAltTitles from "./ListAltTitles";
import { ContentPageEnum } from "@/common/data.types";
import IconFilePen from "@/components/Modules/Icons/IconFilePen";
import ShowToast, { NotificationTypeEnum } from "@/utils/ShowToast";
import IconArrowRightFromBracket from "@/components/Modules/Icons/IconArrowRightFromBracket";
import ListImageOrder from "./ListImageOrder";

const ConfirmDeleteModal = dynamic(() => import("@/components/Share/ConfirmDeleteModal"), { ssr: false });

// STORAGE
interface IDataOptionsStorageBook {
    id: number;
    name: StorageBookEnum;
    description: string;
}
const dataOptionsStorageBook: IDataOptionsStorageBook[] = [
    { id: 0, name: StorageBookEnum.BACKUP, description: "Bản lưu nháp" },
    { id: 1, name: StorageBookEnum.WAITING, description: "Đang chờ xử lý" },
    { id: 2, name: StorageBookEnum.ERROR, description: "Truyện lỗi" },
    { id: 3, name: StorageBookEnum.MAIN, description: "Truyện công khai	" },
];

// CATEGORY
interface IDataOptionsCategoryBook {
    id: number;
    name: ContentPageEnum;
}

const dataOptionsCategoryBook: IDataOptionsCategoryBook[] = (
    Object.keys({
        manga: "manga",
        comics: "comics",
    }) as (keyof typeof ContentPageEnum)[]
).map((key, index) => ({
    id: index,
    name: ContentPageEnum[key],
}));

// IDataOptionsTeamBook
interface IDataOptionsNation {
    id: number;
    link: string;
    name: string;
}
const dataOptionsNation: IDataOptionsNation[] = Object.entries(flagMapping).map(
    ([key, value], index) => ({
        id: index,
        name: key,
        link: value,
    })
);

interface IDataBookEdit {
    bookId: number | null;
    raw: string | null;
    title: string;
    description: string;
    altTitles: IAltTitleBookType[];
    contributors: GetDetailBookCreatorResType["data"]["contributors"];
}

interface CreatorFormBookTemplateProps {
    bookId?: number;
    content: ContentPageEnum;
}
const CreatorFormBookTemplate = ({
    bookId,
    content,
}: CreatorFormBookTemplateProps) => {
    const router = useRouter();
    const { data: session, status } = useSession();

    const [isAction, setIsAction] = useState("");
    const [deleteCoverImageId, setDeleteCoverImageId] = useState<number | null>(null);
    const [deletePosterImageId, setDeletePosterImageId] = useState<number | null>(null);
    const [dataBook, setDataBook] = useState<Omit<IDataBookEdit, "">>({
        bookId: null,
        raw: "",
        title: "",
        description: "",
        altTitles: [],
        contributors: [],
    });
    const [dataAddName, setDataAddName] = useState({
        name: "",
        nation: dataOptionsNation[0],
    });
    const [dataAddMemberBookContributor, setDataAddMemberBookContributor] =
        useState({
            email: "",
        });

    const [dataImageCover, setDataImageCover] = useState<{
        urlImage: string;
        fileImage: null | File;
        urlImageImport: string;
    }>({
        urlImage: "",
        fileImage: null,
        urlImageImport: "",
    });
    const [dataImagePoster, setDataImagePoster] = useState<{
        urlImage: string;
        fileImage: null | File;
        urlImageImport: string;
    }>({
        urlImage: "",
        fileImage: null,
        urlImageImport: "",
    });

    const [dataImagesCover, setDataImagesCover] = useState<
        {
            imageId: number;
            url: string;
            index: number;
            width: number;
            height: number;
        }[]
    >();
    const [dataImagesPoster, setDataImagesPoster] = useState<
        {
            imageId: number;
            url: string;
            index: number;
            width: number;
            height: number;
        }[]
    >();

    const [selectedOptionStorage, setSelectedOptionStorage] =
        useState<IDataOptionsStorageBook | null>(null);
    const [selectedOptionCategory, setSelectedOptionCategory] =
        useState<IDataOptionsCategoryBook | null>(null);
    const [listTagsSelect, setListTagsSelect] = useState<Set<string>>(
        new Set()
    );
    const [listTags, setListTags] = useState<GetListTagsBookResType["data"]>(
        []
    );

    const handleSetImageCoverFile = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files == null) {
            return;
        }
        const dataImg = e.target.files[0];

        setDataImageCover((state) => ({
            urlImageImport: "",
            fileImage: dataImg,
            urlImage: URL.createObjectURL(dataImg),
        }));
    };
    const handleSetImagePosterFile = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files == null) {
            return;
        }
        const dataImg = e.target.files[0];

        setDataImagePoster((state) => ({
            urlImageImport: "",
            fileImage: dataImg,
            urlImage: URL.createObjectURL(dataImg),
        }));
    };
    const handleSetImageCoverUrl = (e: ChangeEvent<HTMLInputElement>) => {
        const urlImageImport = e.target.value;

        setDataImageCover((state) => ({
            urlImage: "",
            fileImage: null,
            urlImageImport: urlImageImport,
        }));
    };
    const handleSetImagePosterUrl = (e: ChangeEvent<HTMLInputElement>) => {
        const urlImageImport = e.target.value;

        setDataImagePoster((state) => ({
            urlImage: "",
            fileImage: null,
            urlImageImport: urlImageImport,
        }));
    };
    const handleCreateImageCoverBook = async () => {
        if (!bookId) {
            return;
        }
        if (status !== "authenticated") {
            alert("Bạn chưa đăng nhập");
            return;
        }
        if (!dataImageCover.urlImageImport && !dataImageCover.fileImage) {
            alert("Bạn chưa điền đủ thông tin cần cập nhật");
            return;
        }
        setIsAction("loading_update_image_book");

        try {
            let thumbnailUpdateRes: {
                success: boolean;
                data: {
                    imageId: number;
                    url: string;
                    width: number;
                    height: number;
                    index: number;
                };
            } | null = null;
            if (dataImageCover?.fileImage) {
                const formData = new FormData();
                formData.append("Filedata", dataImageCover?.fileImage);

                thumbnailUpdateRes = await createCoverBookByFileCreatorService({
                    file: formData,
                    bookId: bookId,
                    token: session.backendTokens.accessToken,
                });
            } else {
                thumbnailUpdateRes = await createCoverBookByUrlCreatorService({
                    bookId: bookId,
                    token: session?.backendTokens.accessToken,
                    thumbnailUrl: dataImageCover?.urlImageImport.trim(),
                });
            }

            if (thumbnailUpdateRes?.success) {
                setDataImageCover({
                    urlImage: "",
                    fileImage: null,
                    urlImageImport: "",
                });
                setDataImagesCover((state) =>
                    state
                        ? [
                              {
                                  imageId:
                                      thumbnailUpdateRes?.data?.imageId ?? 0,
                                  url: thumbnailUpdateRes?.data?.url ?? "",
                                  index: thumbnailUpdateRes?.data?.index ?? 0,
                                  width: thumbnailUpdateRes?.data?.width ?? 0,
                                  height: thumbnailUpdateRes?.data?.height ?? 0,
                              },
                              ...state,
                          ]
                        : state
                );
            }
            ShowToast?.[
                thumbnailUpdateRes?.success
                    ? NotificationTypeEnum.success
                    : NotificationTypeEnum?.error
            ](
                `Thêm ảnh đại diện ${
                    thumbnailUpdateRes?.success ? "thành công" : "thất bại"
                }!`,
                {
                    duration: 3000,
                }
            );
        } catch (error) {
        } finally {
            setIsAction("");
        }
    };
    const handleCreateImagePosterBook = async () => {
        if (!bookId) {
            return;
        }
        if (status !== "authenticated") {
            alert("Bạn chưa đăng nhập");
            return;
        }
        if (!dataImagePoster.urlImageImport && !dataImagePoster.fileImage) {
            alert("Bạn chưa điền đủ thông tin cần cập nhật");
            return;
        }
        setIsAction("loading_update_image_book");

        try {
            let thumbnailUpdateRes: {
                success: boolean;
                data: {
                    imageId: number;
                    url: string;
                    width: number;
                    height: number;
                    index: number;
                };
            } | null = null;
            if (dataImagePoster?.fileImage) {
                const formData = new FormData();
                formData.append("Filedata", dataImagePoster?.fileImage);

                thumbnailUpdateRes = await createPosterBookByFileCreatorService(
                    {
                        file: formData,
                        bookId: bookId,
                        token: session.backendTokens.accessToken,
                    }
                );
            } else {
                thumbnailUpdateRes = await createPosterBookByUrlCreatorService({
                    bookId: bookId,
                    token: session?.backendTokens.accessToken,
                    thumbnailUrl: dataImagePoster?.urlImageImport.trim(),
                });
            }

            if (thumbnailUpdateRes?.success) {
                setDataImagePoster({
                    urlImage: "",
                    fileImage: null,
                    urlImageImport: "",
                });

                setDataImagesPoster((state) =>
                    state
                        ? [
                              {
                                  imageId:
                                      thumbnailUpdateRes?.data?.imageId ?? 0,
                                  url: thumbnailUpdateRes?.data?.url ?? "",
                                  index: thumbnailUpdateRes?.data?.index ?? 0,
                                  width: thumbnailUpdateRes?.data?.width ?? 0,
                                  height: thumbnailUpdateRes?.data?.height ?? 0,
                              },
                              ...state,
                          ]
                        : state
                );
            }
            ShowToast?.[
                thumbnailUpdateRes?.success
                    ? NotificationTypeEnum.success
                    : NotificationTypeEnum?.error
            ](
                `Thêm ảnh nền ${
                    thumbnailUpdateRes?.success ? "thành công" : "thất bại"
                }!`,
                {
                    duration: 3000,
                }
            );
        } catch (error) {
        } finally {
            setIsAction("");
        }
    };
    const handleDeleteImageCoverBook = async (imageId: number) => {
        if (!bookId) {
            return;
        }
        if (status !== "authenticated") {
            alert("Bạn chưa đăng nhập");
            return;
        }

        setDeleteCoverImageId(imageId);
    };

    const confirmDeleteImageCoverBook = async () => {
        if (!bookId || !deleteCoverImageId) {
            return;
        }
        if (status !== "authenticated") {
            return;
        }

        setIsAction("loading_delete_image_cover_book");

        try {
            let thumbnailUpdateRes: {
                success: boolean;
            } = await deleteCoverBookCreatorService({
                bookId: bookId,
                imageId: deleteCoverImageId,
                token: session?.backendTokens.accessToken,
            });

            if (thumbnailUpdateRes?.success) {
                setDataImageCover({
                    urlImage: "",
                    fileImage: null,
                    urlImageImport: "",
                });

                setDataImagesCover((prev) =>
                    prev ? prev.filter((img) => img.imageId !== deleteCoverImageId) : prev
                );
            }
            ShowToast?.[
                thumbnailUpdateRes?.success
                    ? NotificationTypeEnum.success
                    : NotificationTypeEnum?.error
            ](
                `Xóa ảnh ${
                    thumbnailUpdateRes?.success ? "thành công" : "thất bại"
                }!`,
                {
                    duration: 3000,
                }
            );
        } catch (error) {
        } finally {
            setIsAction("");
            setDeleteCoverImageId(null);
        }
    };
    const handleDeleteImagePosterBook = async (imageId: number) => {
        if (!bookId) {
            return;
        }
        if (status !== "authenticated") {
            alert("Bạn chưa đăng nhập");
            return;
        }

        setDeletePosterImageId(imageId);
    };

    const confirmDeleteImagePosterBook = async () => {
        if (!bookId || !deletePosterImageId) {
            return;
        }
        if (status !== "authenticated") {
            return;
        }

        setIsAction("loading_delete_image_poster_book");

        try {
            let thumbnailUpdateRes: {
                success: boolean;
            } = await deletePosterBookCreatorService({
                bookId: bookId,
                imageId: deletePosterImageId,
                token: session?.backendTokens.accessToken,
            });

            if (thumbnailUpdateRes?.success) {
                setDataImagePoster({
                    urlImage: "",
                    fileImage: null,
                    urlImageImport: "",
                });

                setDataImagesPoster((prev) =>
                    prev ? prev.filter((img) => img.imageId !== deletePosterImageId) : prev
                );
            }
            ShowToast?.[
                thumbnailUpdateRes?.success
                    ? NotificationTypeEnum.success
                    : NotificationTypeEnum?.error
            ](
                `Xóa ảnh ${
                    thumbnailUpdateRes?.success ? "thành công" : "thất bại"
                }!`,
                {
                    duration: 3000,
                }
            );
        } catch (error) {
        } finally {
            setIsAction("");
            setDeletePosterImageId(null);
        }
    };
    const handleOrderImageCoverBook = async () => {
        if (!bookId) {
            return;
        }
        if (status !== "authenticated") {
            alert("Bạn chưa đăng nhập");
            return;
        }
        setIsAction("loading_update_image_book");

        try {
            let updateRes = await updateCoverOrderBookCreatorService({
                bookId,
                token: session?.backendTokens.accessToken,
                orders: dataImagesCover?.length
                    ? dataImagesCover?.map((image) => ({
                          index: image?.index,
                          imageId: image?.imageId,
                      }))
                    : [],
            });

            ShowToast?.[
                updateRes?.success
                    ? NotificationTypeEnum.success
                    : NotificationTypeEnum?.error
            ](
                `Cập nhật vị trí ảnh ${
                    updateRes?.success ? "thành công" : "thất bại"
                }!`,
                {
                    duration: 3000,
                }
            );
        } catch (error) {
        } finally {
            setIsAction("");
        }
    };
    const handleOrderImagePosterBook = async () => {
        if (!bookId) {
            return;
        }
        if (status !== "authenticated") {
            alert("Bạn chưa đăng nhập");
            return;
        }
        setIsAction("loading_update_image_book");

        try {
            let updateRes = await updatePosterOrderBookCreatorService({
                bookId,
                token: session?.backendTokens.accessToken,
                orders: dataImagesPoster?.length
                    ? dataImagesPoster?.map((image) => ({
                          index: image?.index,
                          imageId: image?.imageId,
                      }))
                    : [],
            });

            ShowToast?.[
                updateRes?.success
                    ? NotificationTypeEnum.success
                    : NotificationTypeEnum?.error
            ](
                `Cập nhật vị trí ảnh ${
                    updateRes?.success ? "thành công" : "thất bại"
                }!`,
                {
                    duration: 3000,
                }
            );
        } catch (error) {
        } finally {
            setIsAction("");
        }
    };

    // Contributor

    const handleOnchangeDataAddBookContributor = async (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        setDataAddMemberBookContributor((state) =>
            state
                ? {
                      ...state,
                      [e.target.name]: e.target.value,
                  }
                : state
        );
    };

    const handleAddMemberBookContributor = async () => {
        if (!bookId) return;

        const email = dataAddMemberBookContributor?.email || "";
        if (!email || email?.trim().length === 0) return;

        setIsAction("loading_add_member");
        try {
            const dataRes = await addMemberContributorBookApi({
                email,
                bookId,
            });

            ShowToast?.success(`Thông báo`, {
                duration: 3000,
                description: "Thêm người dùng thành công",
            });
            setDataAddMemberBookContributor((state) => ({
                ...state,
                email: "",
            }));
            setDataBook((state) => ({
                ...state,
                contributors: [
                    ...state.contributors,
                    {
                        confirmed: dataRes.data.confirmed,
                        joinedAt: dataRes.data.joinedAt,
                        role: dataRes.data.role,
                        user: dataRes.data.user,
                    },
                ],
            }));
        } catch (error) {
            const err = error as { error: string };
            ShowToast?.error(`Thông báo`, {
                duration: 3000,
                description: err?.error || "Thêm người dùng thất bại",
            });
        } finally {
            setIsAction("");
        }
    };

    const outMemberBookContributor = async (userId: number) => {
        if (!bookId) return;

        setIsAction("loading_add_member");
        try {
            const dataRes = await outMemberContributorBookApi({
                userId,
                bookId,
            });

            ShowToast?.success(`Thông báo`, {
                duration: 3000,
                description: "Xóa thành viên thành công",
            });
            setDataAddMemberBookContributor((state) => ({
                ...state,
                email: "",
            }));
            setDataBook((state) => ({
                ...state,
                contributors: state.contributors.filter(
                    (ct) => ct.user.userId !== userId
                ),
            }));
        } catch (error) {
            const err = error as { error: string };
            ShowToast?.error(`Thông báo`, {
                duration: 3000,
                description: err?.error || "Xóa thành viên thất bại",
            });
        } finally {
            setIsAction("");
        }
    };

    // Info Book

    const handleOnchangeDataBook = async (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setDataBook((state) =>
            state
                ? {
                      ...state,
                      [e.target.name]: e.target.value,
                  }
                : state
        );
    };

    const handleActionUpsertInfo = async () => {
        if (status !== "authenticated") {
            return;
        }
        if (!listTags) {
            return;
        }
        setIsAction("loading_upsert_info_book");

        try {
            let actionRes;
            if (bookId) {
                actionRes = await updateBookApi({
                    bookId: bookId,
                    raw: dataBook?.raw,
                    title: dataBook?.title,
                    tags: Array.from(listTagsSelect),
                    description: dataBook?.description.trim(),
                    isAdult: false,
                    altTitles: dataBook?.altTitles || [],
                });
            } else {
                actionRes = await createBookApi({
                    category: content,
                    raw: dataBook?.raw,
                    title: dataBook?.title,
                    tags: Array.from(listTagsSelect),
                    description: dataBook?.description.trim(),
                    isAdult: false,
                    altTitles: [
                        { languageCode: "vi", title: dataBook?.title },
                        ...(dataBook?.altTitles || []),
                    ],
                });
            }

            if (actionRes?.success) {
                ShowToast?.success(
                    (bookId ? "Cập nhật" : "Tạo") + " truyện thành công!",
                    {
                        duration: 3000,
                    }
                );
                if (!bookId) {
                    router.push(
                        `/${content}/creator/books/${actionRes?.data?.bookId}`,
                        { scroll: true }
                    );
                } else {
                    // router.push(`/${content}/creator/books/${bookId}`);
                }
            }
        } catch (error: any) {
            ShowToast?.error(
                `${bookId ? "Cập nhật" : "Tạo"} truyện thất bại!"`,
                {
                    duration: 3000,
                    description:
                        error?.response?.data?.message ||
                        "Có lỗi gì đó xãy ra!",
                }
            );
        } finally {
            setIsAction("");
        }
    };

    const handleUpdateStorageBook = async () => {
        if (!bookId) {
            return;
        }
        if (status !== "authenticated") {
            alert("Bạn chưa đăng nhập");
            return;
        }
        if (!dataBook || !selectedOptionStorage) {
            alert("Bạn chưa chọn kho lưu trữ cần cập nhật");
            return;
        }
        setIsAction("loading_update_storage_book");

        try {
            const updateStorageBookRes = await updateStorageBookCreatorService({
                bookId: bookId,
                storage: selectedOptionStorage?.name,
                token: session?.backendTokens.accessToken,
            });

            ShowToast?.[
                updateStorageBookRes?.success
                    ? NotificationTypeEnum.success
                    : NotificationTypeEnum?.error
            ](
                `Cập nhật kho lưu trữ ${
                    updateStorageBookRes?.success ? "thành công" : "thất bại"
                }!`,
                {
                    duration: 3000,
                }
            );
        } catch (error) {
        } finally {
            setIsAction("");
        }
    };

    const handleUpdateCategoryBook = async () => {
        if (!bookId) {
            return;
        }
        if (status !== "authenticated") {
            alert("Bạn chưa đăng nhập");
            return;
        }
        if (!dataBook || !selectedOptionCategory) {
            alert("Bạn chưa chọn kho lưu trữ cần cập nhật");
            return;
        }
        setIsAction("loading_update_category_book");

        try {
            const updateCategoryBookRes =
                await updateCategoryBookCreatorService({
                    bookId: bookId,
                    category: selectedOptionCategory?.name,
                    token: session?.backendTokens.accessToken,
                });

            ShowToast?.[
                updateCategoryBookRes?.success
                    ? NotificationTypeEnum.success
                    : NotificationTypeEnum?.error
            ](
                `Cập nhật nội dung ${
                    updateCategoryBookRes?.success ? "thành công" : "thất bại"
                }!`,
                {
                    duration: 3000,
                }
            );
        } catch (error) {
        } finally {
            setIsAction("");
        }
    };

    const handleAltTitlesAction = ({
        action,
        payload,
    }: {
        action: "create" | "delete";
        payload: { index: number };
    }) => {
        let altTitlesNew = [...dataBook.altTitles];

        switch (action) {
            case "create":
                const name = dataAddName?.name.trim();
                if (!name) return;

                altTitlesNew.push({
                    languageCode: dataAddName?.nation.name,
                    title: name,
                });
                setDataAddName({
                    nation: dataOptionsNation[0],
                    name: "",
                });
                break;
            case "delete":
                altTitlesNew.splice(payload.index, 1);
                break;
        }

        setDataBook((dataBook) =>
            dataBook
                ? {
                      ...dataBook,
                      altTitles: [...altTitlesNew],
                  }
                : dataBook
        );
    };

    const handleGetDataBook = useCallback(async () => {
        if (!bookId) return;
        try {
            const bookRes = await getDetailBookCreatorApi({
                bookId: bookId,
            });

            if (bookRes?.success) {
                const tags = bookRes?.data?.tags;
                // Map tags từ format BookMapper (array các meta objects) sang tagId strings
                const tagIds = tags?.map((tag) => String(tag?.metaId));

                setListTagsSelect(new Set(tagIds));
                // Parse altTitles từ backend (có thể là string hoặc array)
                let parsedAltTitles: IAltTitleBookType[] = [];
                try {
                    const altTitles = bookRes?.data.altTitles;
                    if (typeof altTitles === "string") {
                        parsedAltTitles = JSON.parse(altTitles);
                    } else if (Array.isArray(altTitles)) {
                        parsedAltTitles = altTitles;
                    }
                    // Convert từ format cũ [{vi: "name"}] sang format mới [{languageCode: "vi", title: "name"}]
                    parsedAltTitles = parsedAltTitles.map((item: any) => {
                        if (item.languageCode && item.title) {
                            return item; // Đã đúng format mới
                        }
                        // Convert từ format cũ
                        const key = Object.keys(item)[0];
                        return {
                            languageCode: key,
                            title: item[key],
                        };
                    });
                } catch (error) {
                    console.error("Error parsing altTitles:", error);
                    parsedAltTitles = [];
                }

                setDataBook({
                    bookId: bookId ?? "",
                    raw: bookRes?.data.raw ?? "",
                    title: bookRes?.data.title ?? "",
                    description: bookRes?.data.description ?? "",
                    altTitles: parsedAltTitles,
                    contributors: bookRes?.data?.contributors,
                });

                setDataImagesCover(bookRes?.data?.covers);
                setDataImagesPoster(bookRes?.data?.posters);

                const matchingOptionStorage = dataOptionsStorageBook.find(
                    (option) => option.name === bookRes?.data?.storage
                );
                const matchingOptionCategory = dataOptionsCategoryBook.find(
                    (option) => option.name === bookRes?.data?.category
                );

                setSelectedOptionStorage(matchingOptionStorage || null);
                setSelectedOptionCategory(matchingOptionCategory || null);
            }
        } catch (error) {
            console.error(error);
        }
    }, [bookId]);

    const handleDataDefault = useCallback(async () => {
        try {
            // Get List Tags
            const categoryRes = await getListTagsBookApi({
                options: {
                    take: 60,
                    category: content,
                },
                revalidate: 24 * 60 * 60,
            });
            if (categoryRes?.success) {
                setListTags(categoryRes?.data);
            }
        } catch (error) {
            console.error(error);
        }
    }, [content]);

    useEffect(() => {
        handleDataDefault();
        handleGetDataBook();
    }, []);

    return (
        <div className="">
            <>
                <h2 className="font-semibold text-lg mb-4 border-l-4 px-3">
                    {!!bookId ? "Cập nhập" : "Tạo"} truyện
                </h2>

                <div className="mb-4">
                    <Link
                        title=""
                        scroll={false}
                        prefetch={false}
                        // target="_blank"
                        href={`/${content}/creator/books/${bookId}/chapters`}
                        className="px-2 h-9 flex-1 leading-9 flex item-center space-x-2 bg-slate-600 hover:bg-slate-500/50 border border-gray-500 border-dashed"
                    >
                        <IconFilePen className="w-9 h-9 py-2 fill-white" />
                        <span className="">Danh sách chương</span>
                    </Link>
                </div>

                {bookId && (
                    <div className="bg-accent px-4 py-4 mb-3">
                        <div className="">
                            <div className="mb-3">
                                <h2 className="text-sm uppercase font-bold mb-4">
                                    ẢNH ĐẠI DIỆN
                                </h2>{" "}
                                <div className="mb-2">
                                    <input
                                        type="file"
                                        className="hidden"
                                        id="inputFileImageCover"
                                        onChange={handleSetImageCoverFile}
                                    />
                                    <label
                                        htmlFor="inputFileImageCover"
                                        className="aspect-[500/692] max-w-40 border rounded-lg relative block cursor-pointer overflow-hidden"
                                    >
                                        {dataImageCover?.fileImage && (
                                            <Image
                                                unoptimized
                                                width={500}
                                                height={692}
                                                alt=""
                                                className="aspect-[500/692] object-cover"
                                                src={`${dataImageCover?.urlImage}`}
                                            />
                                        )}
                                        <div
                                            className={`top-0 bottom-0 right-0 left-0 flex items-center justify-center absolute transition-all ${
                                                dataImageCover?.urlImage
                                                    ? "bg-black/30 opacity-0 hover:opacity-100"
                                                    : ""
                                            }`}
                                        >
                                            <IconPlus className="w-7 h-7 block fill-white z-10" />
                                        </div>
                                    </label>
                                </div>
                                <div
                                    className={`mb-3`}
                                >
                                    <input
                                        name="chapterUrl"
                                        onChange={handleSetImageCoverUrl}
                                        value={
                                            dataImageCover?.urlImageImport
                                        }
                                        placeholder="Cập nhật ảnh với liên kết"
                                        className={`h-10 px-4 rounded-md w-full`}
                                    />
                                </div>
                                <Button
                                    intent={"primary"}
                                    loading={
                                        isAction === "loading_update_image_book"
                                    }
                                    onClick={handleCreateImageCoverBook}
                                >
                                    Thêm ảnh đại diện
                                </Button>
                            </div>

                            <div className="mb-3">
                                <h2 className="text-sm uppercase font-bold mb-2">
                                    DANH SÁCH ẢNH
                                </h2>
                                <p className="text-sm italic mb-3">
                                    Chú ý: Ảnh đầu tiên là ảnh được hiển thị,
                                    các ảnh được sắp xếp từ mới nhất đến cũ nhất
                                </p>
                                <div className="">
                                    {dataImagesCover ? (
                                        dataImagesCover?.length ? (
                                            <ListImageOrder
                                                image={"cover"}
                                                data={dataImagesCover}
                                                handleOrderImage={(images) =>
                                                    setDataImagesCover(images)
                                                }
                                                handleDeleteImage={handleDeleteImageCoverBook}
                                            />
                                        ) : (
                                            <div className="font-bold">
                                                Không có ảnh nào!
                                            </div>
                                        )
                                    ) : (
                                        <div className="font-bold">
                                            Loading!
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Button
                                intent={"primary"}
                                loading={
                                    isAction === "loading_update_image_book"
                                }
                                onClick={handleOrderImageCoverBook}
                            >
                                Cập nhật sắp xếp ảnh
                            </Button>
                        </div>
                    </div>
                )}
                {bookId && (
                    <div className="bg-accent px-4 py-4 mb-3">
                        <div className="">
                            <div className="mb-3">
                                <h2 className="text-sm uppercase font-bold mb-4">
                                    ẢNH NỀN
                                </h2>
                                <div className="mb-2">
                                    <input
                                        type="file"
                                        className="hidden"
                                        id="inputFileImagePoster"
                                        onChange={handleSetImagePosterFile}
                                    />
                                    <label
                                        htmlFor="inputFileImagePoster"
                                        className="aspect-video max-w-80 border rounded-lg relative block cursor-pointer overflow-hidden"
                                    >
                                        {dataImagePoster?.fileImage && (
                                            <Image
                                                unoptimized
                                                width={500}
                                                height={692}
                                                alt=""
                                                className="aspect-video object-cover"
                                                src={`${dataImagePoster?.urlImage}`}
                                            />
                                        )}
                                        <div
                                            className={`top-0 bottom-0 right-0 left-0 flex items-center justify-center absolute transition-all ${
                                                dataImageCover?.urlImage
                                                    ? "bg-black/30 opacity-0 hover:opacity-100"
                                                    : ""
                                            }`}
                                        >
                                            <IconPlus className="w-7 h-7 block fill-white z-10" />
                                        </div>
                                    </label>
                                </div>
                                <div
                                    className={`mb-3`}
                                >
                                    <input
                                        name="chapterUrl"
                                        onChange={handleSetImagePosterUrl}
                                        value={
                                            dataImagePoster?.urlImageImport
                                        }
                                        placeholder="Cập nhật ảnh với liên kết"
                                        className={`h-10 px-4 rounded-md w-full`}
                                    />
                                </div>
                                <Button
                                    intent={"primary"}
                                    loading={
                                        isAction === "loading_update_image_book"
                                    }
                                    onClick={handleCreateImagePosterBook}
                                >
                                    Thêm ảnh nền
                                </Button>
                            </div>

                            <div className="mb-3">
                                <h2 className="text-sm uppercase font-bold mb-2">
                                    DANH SÁCH ẢNH
                                </h2>
                                <p className="text-sm italic mb-3">
                                    Chú ý: Ảnh đầu tiên là ảnh được hiển thị,
                                    các ảnh được sắp xếp từ mới nhất đến cũ nhất
                                </p>

                                <div>
                                    {dataImagesPoster ? (
                                        dataImagesPoster?.length ? (
                                            <ListImageOrder
                                                image={"poster"}
                                                data={dataImagesPoster}
                                                handleOrderImage={(images) =>
                                                    setDataImagesPoster(images)
                                                }
                                                handleDeleteImage={handleDeleteImagePosterBook}
                                            />
                                        ) : (
                                            <div className="font-bold">
                                                Không có ảnh nào!
                                            </div>
                                        )
                                    ) : (
                                        <div className="font-bold">
                                            Loading!
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Button
                                intent={"primary"}
                                loading={
                                    isAction === "loading_update_image_book"
                                }
                                onClick={handleOrderImagePosterBook}
                            >
                                Cập nhật sắp xếp ảnh
                            </Button>
                        </div>
                    </div>
                )}

                {selectedOptionStorage && (
                    <div className="bg-accent px-4 py-4 mb-3">
                        <h2 className="font-semibold text-lg mb-4 border-l-4 px-3">
                            Cập nhật kho lưu trữ
                        </h2>
                        <div className="mb-3">
                            <SelectOptions
                                value={selectedOptionStorage}
                                options={dataOptionsStorageBook}
                                handleOnchange={(value) =>
                                    setSelectedOptionStorage(
                                        dataOptionsStorageBook[value.id]
                                    )
                                }
                            />
                        </div>
                        <Button
                            intent={"primary"}
                            loading={isAction === "loading_update_storage_book"}
                            onClick={handleUpdateStorageBook}
                        >
                            Cập nhật kho lưu trữ
                        </Button>
                    </div>
                )}

                {bookId && (
                    <div
                        className={classNames(
                            "p-2 mb-3 bg-accent"
                            // listTeams?.loadTeam &&
                            //     "opacity-70 select-none pointer-events-none"
                        )}
                    >
                        <h2 className="font-semibold text-lg border-l-4 px-3 mb-3">
                            Danh sách thành viên đăng tải
                        </h2>
                        <div className="mb-3 text-sm italic space-y-2">
                            <p>
                                - Những thành viên bạn cho phép mới có quyền
                                đăng tải chương
                            </p>
                            <p>
                                - Chỉ có bản mới có toàn quyền chỉnh sửa truyện
                                và chương truyện
                            </p>
                        </div>
                        <div className="space-y-1 mb-3">
                            {dataBook?.contributors?.length > 0 ? (
                                dataBook?.contributors?.map((member) => {
                                    return (
                                        <div
                                            key={member?.user?.userId}
                                            className="flex items-center px-1 py-1 bg-slate-700"
                                        >
                                            <Link
                                                href={`/${content}/users/${member?.user?.userId}`}
                                                prefetch={false}
                                                target="_blank"
                                                className="px-2 py-1 rounded-md block hover:bg-slate-600/80"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <Image
                                                        alt=""
                                                        width={30}
                                                        height={30}
                                                        unoptimized
                                                        loading="lazy"
                                                        className={`w-[30px] h-[30px] rounded-full border object-cover`}
                                                        src={
                                                            member?.user
                                                                ?.avatarUrl
                                                                ? Env.NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO +
                                                                  "/" +
                                                                  member?.user
                                                                      ?.avatarUrl
                                                                : "/static/images/image-book-not-found.jpg"
                                                        }
                                                    />
                                                    <div className="text-xs font-semibold uppercase">
                                                        {member?.user?.name}
                                                    </div>
                                                </div>
                                            </Link>
                                            <div
                                                className={`mx-1 px-2 h-5 leading-5 uppercase font-semibold text-xs text-white rounded-md ${
                                                    member?.role ===
                                                    UserBookContributorRole.admin
                                                        ? "bg-green-600 boder border-green-400"
                                                        : member?.confirmed
                                                        ? "bg-teal-600 boder border-teal-400"
                                                        : "bg-yellow-600 boder border-yellow-400"
                                                }`}
                                            >
                                                {!member?.confirmed
                                                    ? "CHỜ XÁC NHẬN"
                                                    : member?.role}
                                            </div>
                                            {member?.role !==
                                                UserBookContributorRole.admin && (
                                                <div className="flex items-center ml-auto">
                                                    <button
                                                        onClick={() =>
                                                            outMemberBookContributor(
                                                                member?.user
                                                                    ?.userId
                                                            )
                                                        }
                                                    >
                                                        <IconArrowRightFromBracket className="w-8 h-8 p-2 fill-white bg-red-600 hover:bg-red-700" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center px-2 py-1 bg-slate-700">
                                    Không có thành viên!
                                </div>
                            )}
                        </div>
                        <div className="mb-3 space-y-2">
                            <input
                                value={dataAddMemberBookContributor?.email}
                                onChange={handleOnchangeDataAddBookContributor}
                                type="email"
                                name={`email`}
                                autoComplete="nope"
                                placeholder="Nhập email thành viên"
                                className={classNames(
                                    "w-full h-10 px-3 py-1 rounded-md"
                                )}
                            />
                        </div>
                        <Button
                            intent={"primary"}
                            loading={isAction === "loading_add_member"}
                            onClick={handleAddMemberBookContributor}
                        >
                            <p>Thêm thành viên</p>
                        </Button>
                    </div>
                )}

                {selectedOptionCategory && (
                    <div className="bg-accent px-4 py-4 mb-3">
                        <h2 className="font-semibold text-lg mb-3 border-l-4 px-3">
                            Cập nhật nội dung truyện
                        </h2>
                        <div className="mb-3">
                            <SelectOptions
                                value={selectedOptionCategory}
                                options={dataOptionsCategoryBook}
                                handleOnchange={(value) =>
                                    setSelectedOptionCategory(
                                        dataOptionsCategoryBook[value.id]
                                    )
                                }
                            />
                        </div>
                        <Button
                            intent={"primary"}
                            loading={
                                isAction === "loading_update_category_book"
                            }
                            onClick={handleUpdateCategoryBook}
                        >
                            Cập nhật nội dung
                        </Button>
                    </div>
                )}

                <div className="bg-accent px-4 py-4 mb-3">
                    {/* TIÊU ĐỀ */}
                    <h3 className="mb-3 font-semibold text-base">Tiêu đề</h3>
                    <div className={classNames("mb-3")}>
                        <input
                            name="title"
                            placeholder={"Tiêu đề"}
                            value={dataBook?.title}
                            onChange={handleOnchangeDataBook}
                            className={`h-10 px-4 rounded-md w-full`}
                        />
                    </div>

                    {/* TÊN RAW */}
                    <h3 className="mb-3 font-semibold text-base">Tên raw</h3>
                    <div className={classNames("mb-3")}>
                        <input
                            name="raw"
                            placeholder="Tên raw (tên gốc của truyện)"
                            value={dataBook?.raw ?? ""}
                            onChange={handleOnchangeDataBook}
                            className={`h-10 px-4 rounded-md w-full`}
                        />
                    </div>

                    {/* MÔ TẢ */}
                    <h3 className="mb-3 font-semibold text-base">Mô tả</h3>
                    <div
                        className={classNames("mb-3")}
                    >
                        <textarea
                            name="description"
                            placeholder="Mô tả"
                            value={dataBook?.description ?? ""}
                            onChange={handleOnchangeDataBook}
                            className={`focus:border-blue-500 border border-transparent min-h-24 max-h-32 p-3 rounded-md w-full outline-none`}
                        />
                    </div>

                    {/* DANH SÁCH TÊN */}
                    <h3 className="mb-3 font-semibold text-base">
                        Các tên khác
                    </h3>
                    <div className={classNames("mb-3 space-y-3")}>
                        <div className="space-y-1">
                            <ListAltTitles
                                data={dataBook?.altTitles}
                                handleAltTitlesAction={
                                    handleAltTitlesAction
                                }
                            />
                            {dataBook?.altTitles?.length === 0 && (
                                <div className="px-2 h-[32px] leading-[32px] text-center text-sm w-full bg-slate-600">
                                    Chưa có tên khác nào!
                                </div>
                            )}
                        </div>
                        <div className="">
                            <div className="flex flex-wrap gap-1 mb-2">
                                {dataOptionsNation?.map((nation, index) => (
                                    <button
                                        onClick={() =>
                                            setDataAddName((state) => ({
                                                ...state,
                                                nation,
                                            }))
                                        }
                                        key={nation?.id}
                                        className={classNames(
                                            "px-2 py-1 flex items-center space-x-2 rounded-md",
                                            dataAddName?.nation.id ===
                                                nation?.id
                                                ? "bg-blue-600"
                                                : "bg-accent-10"
                                        )}
                                    >
                                        <Image
                                            unoptimized
                                            width={150}
                                            height={100}
                                            alt={``}
                                            src={flagLink(nation.name)}
                                            className="w-[30px] h-[18px] flex-shrink-0 object-cover"
                                        />
                                        <p>{nation?.name}</p>
                                    </button>
                                ))}
                            </div>

                            <input
                                value={dataAddName?.name}
                                onChange={(e) =>
                                    setDataAddName((state) => ({
                                        ...state,
                                        name: e.target.value,
                                    }))
                                }
                                placeholder="Nhập thêm tên khác.."
                                className="h-10 px-4 rounded-md w-full"
                            />
                        </div>

                        <Button
                            intent={"primary"}
                            onClick={() =>
                                handleAltTitlesAction({
                                    action: "create",
                                    payload: { index: -1 },
                                })
                            }
                        >
                            Thêm tên
                        </Button>
                    </div>

                    {/* THỂ LOẠI */}
                    <div className="mb-3">
                        <TagSelector
                            listTags={listTags || []}
                            listTagsSelect={listTagsSelect}
                            setListTagsSelect={setListTagsSelect}
                        />
                    </div>

                    <Button
                        intent={"primary"}
                        loading={isAction === "loading_upsert_info_book"}
                        onClick={handleActionUpsertInfo}
                    >
                        {bookId ? "Cập nhật thông tin truyện" : "Tạo truyện"}
                    </Button>
                </div>
            </>

            {/* Modal xóa ảnh cover */}
            <ConfirmDeleteModal
                isOpen={deleteCoverImageId !== null}
                setIsOpen={(open) => {
                    if (!open) {
                        setDeleteCoverImageId(null);
                    }
                }}
                title="Xóa ảnh đại diện?"
                message="Bạn có chắc chắn muốn xóa ảnh đại diện này? Hành động này không thể hoàn tác."
                confirmText="Xóa"
                cancelText="Hủy"
                onConfirm={confirmDeleteImageCoverBook}
                isLoading={isAction === "loading_delete_image_cover_book"}
                loadingText="Đang xóa..."
                variant="danger"
            />

            {/* Modal xóa ảnh poster */}
            <ConfirmDeleteModal
                isOpen={deletePosterImageId !== null}
                setIsOpen={(open) => {
                    if (!open) {
                        setDeletePosterImageId(null);
                    }
                }}
                title="Xóa ảnh nền?"
                message="Bạn có chắc chắn muốn xóa ảnh nền này? Hành động này không thể hoàn tác."
                confirmText="Xóa"
                cancelText="Hủy"
                onConfirm={confirmDeleteImagePosterBook}
                isLoading={isAction === "loading_delete_image_poster_book"}
                loadingText="Đang xóa..."
                variant="danger"
            />
        </div>
    );
};

export default CreatorFormBookTemplate;
