"use client";

import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, useState } from "react";

const UpdatePassword = () => {
    const [loadingUpdatePassword, setLoadingUpdatePassword] = useState(false);

    const [isError, setIsError] = useState<null | string>(null);
    const [dataLogin, setDataLogin] = useState({
        accout: "",
        password: "",
    });

    const eventChangeValueInput = (e: ChangeEvent<HTMLInputElement>) => {
        setDataLogin({
            ...dataLogin,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdate = async () => {
        try {
            
        } catch (error) {
            
        }
    }

    return (
        <div>
            <div className="py-4" style={{ minHeight: "calc(100vh - 174px)" }}>
                <div
                    className={`bg-white dark:bg-slate-800/70 rounded-md shadow-sm border max-w-xl w-full mx-auto overflow-hidden ${
                        loadingUpdatePassword &&
                        "pointer-events-none opacity-70"
                    }`}
                >
                    <div
                        className={`loading-bar ${
                            !loadingUpdatePassword && "before:content-none"
                        }`}
                    ></div>
                    <div className="px-5 py-5">
                        <div className="font-semibold text-center text-2xl mb-5">
                            Cập nhật mật khẩu
                        </div>
                        <div>
                            <div className="mb-3 relative">
                                <label
                                    htmlFor="idInputAccout"
                                    className="select-none cursor-pointer mb-1 block"
                                >
                                    Tài khoản
                                </label>
                                <input
                                    id="idInputAccout"
                                    name="accout"
                                    value={dataLogin.accout}
                                    onChange={eventChangeValueInput}
                                    disabled={true}
                                    className="h-11 py-2 px-4 rounded-md w-full cursor-not-allowed"
                                />
                            </div>
                            <div className="mb-3 relative">
                                <label
                                    htmlFor="idInputPassword"
                                    className="select-none cursor-pointer mb-1 block"
                                >
                                    Mật khẩu
                                </label>
                                <input
                                    id="idInputPassword"
                                    name="password"
                                    type="password"
                                    value={dataLogin.password}
                                    onChange={eventChangeValueInput}
                                    className="h-11 py-2 px-4 rounded-md w-full"
                                />
                            </div>
                            <div className="mb-3 text-blue-600 dark:text-gray-100 flex items-center gap-4">
                                <div className="text-red-500 line-clamp-none mr-auto">
                                    {isError}
                                </div>
                            </div>

                            <div
                                onClick={handleUpdate}
                                className="mb-2 select-none border bg-blue-600 hover:bg-blue-700 text-lg h-13 py-2 px-2 cursor-pointer text-center text-white rounded-md"
                            >
                                Cập nhật mật khẩu
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdatePassword;
