"use client";

import { useSession } from "next-auth/react";
import { ChangeEvent, useEffect, useState } from "react";

import badWords from "@/utils/badWords";
import userService from "@/services/user.services";
import InputForm from "@/components/Share/InputForm";
import IconLoadingSpin from "../../Icons/IconLoadingSpin";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getCurrentUserAction } from "@/store/auth/auth.action";
import { toast } from "sonner";

const UserProfileTemplate = () => {
    const dispatch = useAppDispatch();
    const { data: session, status, update } = useSession();
    const { user, loading } = useAppSelector((state) => state.authSlice);

    const [dataUpdate, setDataUpdate] = useState({
        name: "",
        // email: "",
    });
    const [isLoad, setIsLoad] = useState(false);
    const [isError, setIsError] = useState<{ [key: string]: string }>({});

    const eventChangeValueInput = (e: ChangeEvent<HTMLInputElement>) => {
        delete isError[e.target.name]
        delete isError["common"]
        setDataUpdate({
            ...dataUpdate,
            [e.target.name]: e.target.value,
        });
    };

    // Handle Update User
    const handleUpdate = async () => {
        const { name } = dataUpdate;
        if(status !== "authenticated" || !user) {
            return;
        }
        if(user?.name === name) {
            toast.success("Cập nhật thành công!", {
                duration: 3000,
            });
            return;
        }

        setIsLoad(true);
        try {
            const nameCv = name.trim();
            const checkBadText = badWords({
                input: nameCv
            });
            if(nameCv !== checkBadText) {
                setIsError({ name: "Ngôn từ không phù hợp" });
                throw new Error();
            }
            const userRes = await userService.updateName({
                name: name,
                token: session?.backendTokens.accessToken
            });

            if(userRes?.success) {
                // await update();
                await dispatch(getCurrentUserAction()).unwrap();
                toast.success("Cập nhật thành công!", {
                    duration: 3000,
                });
                return;
            };
            
            toast.error("Có lỗi xảy ra!", {
                duration: 3000,
            });
        } catch (error) {
            
        }
        finally {
            setIsLoad(false);
        }
    }

    useEffect(() => {
        if(status === "authenticated" && user) {
            setDataUpdate({
                name: user.name,
            })
        }
    }, [session]);

    return (
        <div>
            <h1 title="THÔNG TIN CHUNG" className="postname">
                THÔNG TIN TÀI KHOẢN
            </h1>
            <div className="mb-1">
                <div className="pb-2">
                    <InputForm
                        title="Tên"
                        type="name"
                        placehoder=""
                        data={dataUpdate?.name}
                        setData={eventChangeValueInput}
                        error={isError["name"]}
                    />
                    {isError["common"] && <div className="text-red-500 line-clamp-none mb-1">{isError["common"]}</div>}
                </div>
                <button
                    title="Nút cập nhật tên"
                    onClick={handleUpdate}
                    className="w-full select-none bg-blue-600 hover:bg-blue-700 active:bg-blue-700/90 text-lg h-11 px-2 cursor-pointer text-center text-white rounded-md flex items-center justify-center"
                >
                    {isLoad ? (
                        <IconLoadingSpin />
                    ) : (
                        "Cập nhật"
                    )}
                </button>
            </div>
        </div>
    );
};

export default UserProfileTemplate;