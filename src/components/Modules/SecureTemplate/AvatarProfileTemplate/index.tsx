"use client";

import Image from "next/image";
import { Fragment, useState } from "react";
import { useSession } from "next-auth/react";

import { Env } from "@/config/Env";
import userService from "@/services/user.services";
import IconLoadingSpin from "../../Icons/IconLoadingSpin";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getCurrentUserAction } from "@/store/auth/auth.action";
import { toast } from "sonner";
import AvatarWithOutline from "@/components/Share/AvatarWithOutline";

const { NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO } = Env;

const AvatarProfileTemplate = () => {
    const dispatch = useAppDispatch();
    const { data: session, status, update } = useSession();
    const { user, loading } = useAppSelector((state) => state.authSlice);

    const [isLoad, setIsLoad] = useState(false);
    const [selectAvatar, setSelectAvatar] = useState<null | number>(null);

    // Handle Update User
    const handleUpdate = async () => {
        const avatarNew = `share/avatar/${selectAvatar}.jpg`;
        if (loading || status !== "authenticated") {
            return;
        }
        if (!selectAvatar) {
            toast.warning("Bạn chưa chọn ảnh đại diện!", {
                duration: 3000,
            });
            return;
        }
        if (user?.avatarUrl === avatarNew) {
            toast.success("Cập nhật thành công!", {
                duration: 3000,
            });
            return;
        }
        setIsLoad(true);
        try {
            const userRes = await userService.updateAvatar({
                avatar: avatarNew,
                token: session?.backendTokens.accessToken,
            });

            if (userRes?.success) {
                // await update();
                await dispatch(getCurrentUserAction()).unwrap();
                toast.success("Cập nhật thành công!", {
                    duration: 3000,
                });
                return;
            }

            toast.error("Có lỗi xảy ra!", {
                duration: 3000,
            });
        } catch (error) {
        } finally {
            setIsLoad(false);
        }
    };

    return (
        <div>
            <h1 title="THÔNG TIN CHUNG" className="postname">
                Ảnh đại diện
            </h1>
            <div>
                <div className="mb-7">
                    <h3 className="posttitle">Ảnh đại diện hiện tại</h3>
                    <div className="flex">
                        <div className="border-4 border-white bg-white rounded-md relative">
                            {status === "loading" ? (
                                <div className="w-14 h-14 rounded-[4px] bg-gray-400 animate-pulse"></div>
                            ) : (
                                <Image
                                    unoptimized
                                    width={50}
                                    height={50}
                                    alt="Ảnh đại diện"
                                    src={`${
                                        user?.avatarUrl
                                            ? NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO +
                                              "/" +
                                              user?.avatarUrl
                                            : "/static/images/avatar_default.png"
                                    }`}
                                    className="w-14 h-14 rounded-[4px] block object-cover"
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div className="mb-7">
                    <h3 className="posttitle">Chọn ảnh đại diện</h3>
                    <div className="flex flex-wrap gap-2 mb-5">
                        {Array.from({ length: 89 }).map((_, i) => {
                            return (
                                <Fragment key={i}>
                                    <div
                                        className={`${
                                            selectAvatar === i + 1
                                                ? "border-blue-500"
                                                : "bg-white"
                                        } border-4 border-transparent bg-blue-500 rounded-md relative cursor-pointer`}
                                        onClick={() => setSelectAvatar(i + 1)}
                                    >
                                        {/* <span className={` absolute top-[2px] left-[2px] rounded-full w-3 h-3 border-2`}></span> */}
                                        <Image
                                            unoptimized
                                            loading="lazy"
                                            width={50}
                                            height={50}
                                            alt="Ảnh đại diện"
                                            src={`${NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO}/share/avatar/${
                                                i + 1
                                            }.jpg`}
                                            className="w-14 h-14 rounded-[4px] block object-cover"
                                        />
                                    </div>
                                </Fragment>
                            );
                        })}
                    </div>

                    <button
                        title="Nút cập nhật ảnh đại diện"
                        onClick={handleUpdate}
                        className="w-full select-none bg-blue-600 hover:bg-blue-700 active:bg-blue-700/90 text-lg h-11 px-2 cursor-pointer text-center text-white rounded-md flex items-center justify-center"
                    >
                        {isLoad ? (
                            <IconLoadingSpin className="fill-white" />
                        ) : (
                            "Cập nhật ảnh đại diện"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AvatarProfileTemplate;
