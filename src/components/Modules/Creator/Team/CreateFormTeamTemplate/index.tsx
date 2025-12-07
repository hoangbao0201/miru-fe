"use client";

import { useRouter } from "next/navigation";
import {
    ChangeEvent,
    FormEvent,
    useCallback,
    useEffect,
    useState,
} from "react";

import { useSession } from "next-auth/react";

import ShowToast, { NotificationTypeEnum } from "@/utils/ShowToast";
import { ContentPageEnum } from "@/common/data.types";
import { DetailTeamType } from "@/store/team/team.type";
import IconLoadingSpin from "@/components/Modules/Icons/IconLoadingSpin";
import {
    getDetailTeamApi,
    uploadCoverImageApi,
    upsertTeamApi,
} from "@/store/team/team.api";
import Button from "@/components/ui/Button";
import IconPlus from "@/components/Modules/Icons/IconPlus";
import Image from "next/image";
import { Env } from "@/config/Env";

export interface CreateFormTeamTemplateProps {
    teamId?: number;
    meta: {
        content: ContentPageEnum;
    };
}
const CreateFormTeamTemplate = ({
    meta,
    teamId,
}: CreateFormTeamTemplateProps) => {
    const router = useRouter();
    const { data: session, status } = useSession();

    const [isAction, setIsAction] = useState("");
    const [isLoadingForm, setIsLoadingForm] = useState(false);
    const [formState, setFormState] = useState<Omit<DetailTeamType, "teamId">>({
        name: "",
        facebook: "",
        coverUrl: "",
        description: "",
        panoramaUrl: "",
    });
    const [dataImage, setDataImage] = useState<{
        fileImage: File | null;
        urlImage: string | null;
        urlImageImport: string | null;
    }>({
        urlImage: null,
        fileImage: null,
        urlImageImport: null,
    });

    const handleSetImageFileCover = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files == null) {
            return;
        }
        const dataImg = e.target.files[0];

        setDataImage((state) => ({
            urlImageImport: "",
            fileImage: dataImg,
            urlImage: URL.createObjectURL(dataImg),
        }));
    };

    const handleOnchangeDataForm = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormState((state) => ({
            ...state,
            [e.target.name]: e.target.value,
        }));
    };

    const handleUpdateImageBook = async () => {
        if (!teamId) {
            return;
        }
        if (!dataImage.urlImageImport && !dataImage.fileImage) {
            ShowToast?.[NotificationTypeEnum?.info](`Chưa đăng tải ảnh lên!`, {
                duration: 3000,
            });
            return;
        }
        setIsAction("loading_update_image_book");

        try {
            if (dataImage?.fileImage) {
                const formData = new FormData();
                formData.append("Filedata", dataImage.fileImage);

                let thumbnailUpdateRes: { data: { success: boolean } } =
                    await uploadCoverImageApi({
                        data: {
                            file: formData,
                            teamId: teamId,
                        },
                        onProgress: () => {},
                    });

                ShowToast?.[
                    thumbnailUpdateRes?.data?.success
                        ? NotificationTypeEnum.success
                        : NotificationTypeEnum?.error
                ](
                    `Cập nhật ảnh đại diện ${
                        thumbnailUpdateRes?.data?.success
                            ? "thành công"
                            : "thất bại"
                    }!`,
                    {
                        duration: 3000,
                    }
                );
            }
        } catch (error) {
        } finally {
            setIsAction("");
        }
    };

    const handleActionUpsertInfo = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);

        // Lấy giá trị từ FormData
        const name = formData.get("name") as string;
        const facebook = formData.get("facebook") as string;
        const description = formData.get("description") as string;
        const coverUrl = "";
        const panoramaUrl = "";

        try {
            setIsLoadingForm(true);

            const detailTeamUpsert = await upsertTeamApi({
                teamId: teamId,
                name: name,
                coverUrl: coverUrl,
                facebook: facebook,
                description: description,
                panoramaUrl: panoramaUrl,
            });
            if (!teamId) {
                router.replace(
                    `/${meta.content}/creator/teams/${detailTeamUpsert?.data?.teamId}`
                );
            }
            ShowToast.success(
                `${teamId ? "Cập nhật" : "Tạo"} nhóm thành công!`,
                {
                    duration: 3000,
                }
            );
        } catch (error) {
            ShowToast.error(`${teamId ? "Cập nhật" : "Tạo"} nhóm thất bại!`, {
                duration: 3000,
            });
        } finally {
            setIsLoadingForm(false);
        }
    };

    const handleDataDefault = useCallback(async () => {
        if (!teamId) return;
        const dataRes = await getDetailTeamApi(teamId);
        setFormState({
            name: dataRes.data.name ?? "",
            facebook: dataRes.data.facebook ?? "",
            description: dataRes.data.description ?? "",
            coverUrl: dataRes.data.coverUrl ?? "",
            panoramaUrl: dataRes.data.panoramaUrl ?? "",
        });
    }, [teamId]);

    useEffect(() => {
        handleDataDefault();
    }, []);

    return (
        <div className="">
            <>
                <h2 className="font-semibold text-lg mb-4 border-l-4 px-3">
                    {!!teamId ? "Cập nhập" : "Tạo"} nhóm
                </h2>

                {teamId && (
                    <>
                        <div className="bg-accent px-4 py-4 mb-3">
                            <h2 className="text-lg font-semibold mb-2">
                                Cập nhật ảnh đại diện
                            </h2>
                            <p className="text-sm italic mb-4">
                                Tỉ lệ đẹp nhất là 1:1
                            </p>
                            <div className="flex items-center justify-center mb-3">
                                <label
                                    htmlFor="inputFileImage"
                                    className="relative w-40 h-40 rounded-full border block cursor-pointer overflow-hidden"
                                >
                                    <Image
                                        unoptimized
                                        width={500}
                                        height={692}
                                        alt=""
                                        className="w-40 h-40 object-cover"
                                        src={`${
                                            dataImage?.urlImage ||
                                            (formState?.coverUrl
                                                ? formState?.coverUrl
                                                : "/static/images/image-book-not-found.jpg")
                                        }`}
                                    />
                                    <div
                                        className={`z-10 absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 flex items-center justify-center transition-all ${
                                            dataImage?.fileImage ? "" : ""
                                        }`}
                                    >
                                        <IconPlus className="w-7 h-7 block fill-white" />
                                    </div>
                                </label>
                                <input
                                    type="file"
                                    className="hidden"
                                    id="inputFileImage"
                                    onChange={handleSetImageFileCover}
                                />
                            </div>
                            <Button
                                intent={"primary"}
                                loading={
                                    isAction === "loading_update_image_book"
                                }
                                onClick={handleUpdateImageBook}
                            >
                                Cập nhật ảnh đại diện
                            </Button>
                        </div>
                    </>
                )}

                <form onSubmit={handleActionUpsertInfo}>
                    <div className="bg-accent px-4 py-4 mb-2">
                        {/* TIÊU ĐỀ */}
                        <h3 className="font-semibold text-base mb-1">
                            Tiêu đề
                        </h3>
                        <div
                            className={`flex items-center mb-4 [&>input]:bg-[#2a3254]`}
                        >
                            <input
                                name="name"
                                value={formState.name ?? ""}
                                onChange={handleOnchangeDataForm}
                                required
                                placeholder="Nhập tên nhóm"
                                className={`h-10 px-4 rounded-sm w-full`}
                            />
                        </div>

                        {/* FACEBOOK */}
                        <h3 className="font-semibold text-base mb-1">
                            Facebook của nhóm
                        </h3>
                        <div
                            className={`flex items-center mb-4 [&>input]:bg-[#2a3254]`}
                        >
                            <div className="h-10 leading-10 px-4 bg-[#222841] opacity-60 select-none">
                                https://facebook.com/
                            </div>
                            <input
                                name="facebook"
                                placeholder="Đường dẫn Facebook"
                                value={formState?.facebook ?? ""}
                                onChange={handleOnchangeDataForm}
                                className={`h-10 px-4 w-full`}
                            />
                        </div>

                        {/* DESCRIPTION */}
                        <h3 className="font-semibold text-base mb-1">Mô tả</h3>
                        <div
                            className={`flex items-center mb-4 [&>textarea]:bg-[#2a3254]`}
                        >
                            <textarea
                                name="description"
                                placeholder="Mô tả"
                                value={formState?.description ?? ""}
                                onChange={handleOnchangeDataForm}
                                className={`focus:border-blue-500 border border-transparent min-h-24 max-h-32 p-3 rounded-sm w-full outline-none`}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="h-10 px-5 font-semibold bg-blue-600 rounded-md w-full flex items-center justify-center mt-5"
                    >
                        {isLoadingForm ? (
                            <IconLoadingSpin />
                        ) : teamId ? (
                            "Cập nhật nhóm"
                        ) : (
                            "Tạo nhóm"
                        )}
                    </button>
                </form>
            </>
        </div>
    );
};

export default CreateFormTeamTemplate;
