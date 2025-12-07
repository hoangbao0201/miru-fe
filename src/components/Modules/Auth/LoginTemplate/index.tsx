"use client";

import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { ChangeEvent, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import Turnstile, { useTurnstile } from "react-turnstile";

import { Env } from "@/config/Env";
import ButtonAuth from "../ButtonAuth";
import userService from "@/services/user.services";

const { NEXT_PUBLIC_TITLE_SEO, NEXT_PUBLIC_API_URL, NEXT_PUBLIC_CAPTCHA_TURNSTILE_SITE_KEY } = Env

interface LoginTemplateProps {
    token?: string;
    returnurl?: string;
}
const LoginTemplate = ({ token, returnurl }: LoginTemplateProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const turnstile = useTurnstile();

    const [isError, setIsError] = useState<null | string>(null);
    const [dataLogin, setDataLogin] = useState({
        accout: "",
        password: "",
        token: "",
    });
    const [loadingLogin, setLoadingLogin] = useState(!!token);

    const eventChangeValueInput = (e: ChangeEvent<HTMLInputElement>) => {
        if(isError) {
            setIsError(null);
        }
        setDataLogin({
            ...dataLogin,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogin = async () => {
        setIsError(null);
        if (dataLogin?.token.length === 0) {
            return;
        }
        const { accout, password } = dataLogin;
        if (!accout || !password) {
            setIsError("Chưa điền đầy đủ thông tin");
            return;
        }
        if (accout.length < 3 || accout.length > 50) {
            setIsError("Tài khoản phải từ 3 đến 50 kí tự");
            return;
        }
        setLoadingLogin(true);

        try {
            const { accout, password, token } = dataLogin;

            const result = await signIn("login-basic", {
                redirect: false,
                tokenVerify: token,
                accout: accout,
                password: password,
            });
            setLoadingLogin(false);

            if (!result?.ok) {
                throw new Error(String(result?.error));
            }
            router.push(returnurl || "/");
        } catch (error: any) {
            setIsError(error?.message);

            setLoadingLogin(false);
            setDataLogin(state => ({
                ...state,
                token: "",
            }))
            turnstile.reset();
        }
    };

    // Handle Signin Github
    const handleSigninGithub = async () => {
        signIn("github", { redirect: false });
    };

    // Handle Signin Google
    const handleSigninGoogle = async () => {
        const appUrl = window.location.origin;
        localStorage.setItem("returnurl", returnurl || "/");
        window.location.href = `${NEXT_PUBLIC_API_URL}/api/auth/google?state=${appUrl}`;
    };
    // window.open(`${NEXT_PUBLIC_API_URL}/api/auth/google`, "_self", 'toolbar=no, scrollbars=yes, resizable=no, width=1000, height=auto')

    const handleLoginWithToken = async () => {
        if (!token) {
            return;
        }
        setLoadingLogin(true);
        try {
            if(localStorage.getItem("mino-b")) {
                await userService.banUser({ token: token });
                throw new Error('Server xảy ra lỗi!');
            }
            const result = await signIn("login-token", {
                redirect: false,
                token: token,
            });

            setLoadingLogin(false);

            if (!result?.ok) {
                throw new Error(String(result?.error));
            }

            router.push(localStorage.getItem("returnurl") || "/");
        } catch (error: any) {
            setIsError(error?.message);
            setLoadingLogin(false);
        }
    };

    useEffect(() => {
        if (token) {
            handleLoginWithToken();
        }
    }, [token]);

    return (
        <>
            <div
                className={`bg-slate-800 md:rounded-md shadow-sm max-w-xl w-full mx-auto overflow-hidden ${
                    loadingLogin && "pointer-events-none opacity-90"
                }`}
            >
                <div
                    className={`loading-bar bg-slate-800 ${
                        !loadingLogin && "before:content-none"
                    }`}
                ></div>
                <div className="md:px-6 mx-3 py-5">
                    <h1 className="mb-3">
                        <Link
                            href={`/`}
                            className="flex items-center justify-center font-bold text-2xl"
                        >
                            MIRUDEX
                        </Link>
                    </h1>
                    <div className="font-semibold text-center text-xl mb-5">
                        Đăng nhập
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
                                className="h-11 py-2 px-4 rounded-md w-full"
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
                        <div className="mb-3 text-gray-100 flex items-center gap-4 pr-1">
                            <div className="text-red-500 line-clamp-none mr-auto">
                                {isError}
                            </div>
                            <Link
                                aria-label={`Đăng kí mới`}
                                href={`/auth/register?returnurl=${
                                    pathname === "/auth/login" ||
                                    pathname === "/auth/register"
                                        ? returnurl || "/"
                                        : pathname
                                }`}
                            >
                                <span className="hover:underline">
                                    Đăng kí mới
                                </span>
                            </Link>
                        </div>

                        <div
                            onClick={handleLogin}
                            className={`mb-2 select-none bg-blue-600 hover:bg-blue-700 text-lg h-13 py-2 px-2 cursor-pointer text-center text-white rounded-md`}
                        >
                            Đăng nhập
                        </div>

                        <ButtonAuth
                            color="text-black text-[15px] leading-[44px] bg-gray-200 hover:bg-gray-200/90"
                            content="Đăng kí bằng tài khoản Google"
                            linkIcon="/static/icons/google.svg"
                            handle={handleSigninGoogle}
                        />

                        <div className="relative w-[300px] h-[72px] mx-auto">
                            <Turnstile
                                sitekey={NEXT_PUBLIC_CAPTCHA_TURNSTILE_SITE_KEY}
                                onVerify={(token) => setDataLogin(state => ({ ...state, token: token }))}
                                className="z-10"
                            />
                        </div>

                        <div className="mt-2">
                            <Link
                                prefetch={false}
                                href={returnurl || "/"}
                                className="block text-center text-[16px] leading-[44px] select-none bg-slate-700 hover:bg-slate-700/90 text-white rounded-md"
                            >
                                Quay lại trang trước
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginTemplate;
