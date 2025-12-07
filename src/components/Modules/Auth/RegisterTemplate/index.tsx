"use client"

import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { ChangeEvent, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import Turnstile, { useTurnstile } from "react-turnstile";

import { Env } from "@/config/Env";
import ButtonAuth from "../ButtonAuth";
import userService from "@/services/user.services";
import authService from "@/services/auth.services";
import InputForm from "@/components/Share/InputForm";

const { NEXT_PUBLIC_TITLE_SEO, NEXT_PUBLIC_API_URL, NEXT_PUBLIC_CAPTCHA_TURNSTILE_SITE_KEY } = Env

interface RegisterTemplateProps {
    token?: string
    returnurl?: string
}
const RegisterTemplate = ({ token, returnurl }: RegisterTemplateProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const turnstile = useTurnstile();
    
    const [dataRegister, setDataRegister] = useState({
        name: "",
        email: "",
        password: "",
        rePassword: "",
        tokenVerify: "",
    });

    const [isError, setIsError] = useState<{ [key: string]: string }>({});
    const [loadingRegister, setLoadingRegister] = useState(false);
    const [loadingLogin, setLoadingLogin] = useState(!!token);

    const eventChangeValueInput = (e: ChangeEvent<HTMLInputElement>) => {
        if(Object.keys(isError).length > 0) {
            setIsError({});
        }
        setDataRegister({
            ...dataRegister,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async () => {
        setIsError({});
        
        // Validation
        if (!dataRegister.name || !dataRegister.email || !dataRegister.password || !dataRegister.rePassword) {
            setIsError({ common: "Vui lòng điền đầy đủ thông tin" });
            return;
        }

        if (dataRegister.name.length < 4 || dataRegister.name.length > 30) {
            setIsError({ name: "Tên phải từ 4 đến 30 ký tự" });
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dataRegister.email)) {
            setIsError({ email: "Email không hợp lệ" });
            return;
        }

        if (dataRegister.password.length < 4 || dataRegister.password.length > 20) {
            setIsError({ password: "Mật khẩu phải từ 4 đến 20 ký tự" });
            return;
        }

        if (dataRegister.password !== dataRegister.rePassword) {
            setIsError({ rePassword: "Mật khẩu nhập lại không khớp" });
            return;
        }

        if (!dataRegister.tokenVerify) {
            setIsError({ common: "Vui lòng xác thực captcha" });
            return;
        }

        setLoadingRegister(true);

        try {
            const result = await authService.register({
                name: dataRegister.name.trim(),
                email: dataRegister.email.trim(),
                password: dataRegister.password,
                tokenVerify: dataRegister.tokenVerify,
            });

            if (!result?.success) {
                throw new Error(result?.message || "Đăng ký thất bại");
            }

            // Đăng ký thành công, chuyển đến trang đăng nhập
            router.push(`/auth/login?returnurl=${returnurl || "/"}&registered=true`);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "Đăng ký thất bại";
            
            if (errorMessage.includes("Email") || errorMessage.includes("email")) {
                setIsError({ email: errorMessage });
            } else {
                setIsError({ common: errorMessage });
            }

            setDataRegister(prev => ({
                ...prev,
                tokenVerify: "",
            }));
            turnstile.reset();
        } finally {
            setLoadingRegister(false);
        }
    };

    // Handle Signin Google
    const handleSigninGoogle = async () => {
        const appUrl = window.location.origin;
        localStorage.setItem("returnurl", returnurl || "/");
        window.location.href = `${NEXT_PUBLIC_API_URL}/api/auth/google?state=${appUrl}`;
    };

    const handleLoginWithToken = async () => {
        if(!token) {
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
                token: token
            });

            setLoadingLogin(false);

            if (!result?.ok) {
                router.push("/auth/login")
                setIsError({
                    common: "Tài khoản hoặc mật khẩu không đúng"
                });
                setTimeout(() => {
                    setIsError({});
                }, 5000);
            }
            else {
                router.push(localStorage.getItem('returnurl') || "/");
            }
        } catch (error) {}
    }

    useEffect(() => {
        if(token) {
            handleLoginWithToken();
        }
    }, [token])

    return (
        <>
            <div
                className={`bg-slate-800 md:rounded-md shadow-sm max-w-xl w-full mx-auto ${(loadingLogin || loadingRegister) && "pointer-events-none opacity-70"}`}
            >
                <div
                    className={`loading-bar bg-slate-800 ${!(loadingLogin || loadingRegister) && "before:content-none"}`}
                ></div>
                <div className="md:px-6 mx-3 py-5">
                    <h1 className="mb-3">
                        <Link
                            href={`/`}
                            className="flex items-center justify-center leading-[56px] font-extrabold text-2xl"
                        >
                            MIRUDEX
                        </Link>
                    </h1>
                    <div className="font-semibold text-center text-xl mb-5">
                        Đăng kí
                    </div>

                    <div className="">
                        <InputForm
                            title="Tên"
                            type="name"
                            placehoder="Nhập tên của bạn"
                            data={dataRegister?.name}
                            setData={eventChangeValueInput}
                            error={isError["name"]}
                        />
                        <InputForm
                            title="Email"
                            type="email"
                            placehoder="Nhập email của bạn"
                            data={dataRegister?.email}
                            setData={eventChangeValueInput}
                            error={isError["email"]}
                        />
                        <InputForm
                            title="Mật khẩu"
                            type="password"
                            placehoder="Nhập mật khẩu"
                            data={dataRegister?.password}
                            setData={eventChangeValueInput}
                            error={isError["password"]}
                        />
                        <InputForm
                            title="Nhập lại mật khẩu"
                            type="rePassword"
                            placehoder="Nhập lại mật khẩu"
                            data={dataRegister?.rePassword}
                            setData={eventChangeValueInput}
                            error={isError["rePassword"]}
                        />
                    </div>

                    {/* Turnstile Captcha */}
                    <div className="mb-3 flex justify-center">
                        <Turnstile
                            sitekey={NEXT_PUBLIC_CAPTCHA_TURNSTILE_SITE_KEY}
                            onSuccess={(token) => {
                                setDataRegister(prev => ({
                                    ...prev,
                                    tokenVerify: token,
                                }));
                            }}
                            onError={() => {
                                setDataRegister(prev => ({
                                    ...prev,
                                    tokenVerify: "",
                                }));
                            }}
                            onExpire={() => {
                                setDataRegister(prev => ({
                                    ...prev,
                                    tokenVerify: "",
                                }));
                            }}
                        />
                    </div>

                    <div className="mb-3 text-gray-100 flex items-center gap-4 pr-1">
                        <div className="text-red-500 line-clamp-none mr-auto">{isError["common"]}</div>

                        <Link
                            aria-label={`Đăng nhập`}
                            href={`/auth/login?returnurl=${
                                pathname === "/auth/login" ||
                                pathname === "/auth/register"
                                    ? returnurl || "/"
                                    : pathname
                            }`}
                        >
                            <span className="hover:underline">
                                Đăng nhập ngay
                            </span>
                        </Link>
                    </div>

                    <div className="pt-1">
                        <button
                            onClick={handleRegister}
                            disabled={loadingRegister}
                            className="w-full text-center text-[16px] leading-[44px] select-none bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-md mb-3"
                        >
                            {loadingRegister ? "Đang xử lý..." : "Đăng ký"}
                        </button>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-600"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-slate-800 text-gray-400">Hoặc</span>
                            </div>
                        </div>

                        <ButtonAuth
                            color="text-black text-[15px] leading-[44px] bg-gray-200 hover:bg-gray-200/90"
                            content="Đăng kí bằng tài khoản Google"
                            linkIcon="/static/icons/google.svg"
                            handle={handleSigninGoogle}
                        />

                        <div className="mt-2">
                            <Link
                                prefetch={false}
                                href={`/auth/login?returnurl=${
                                    pathname === "/auth/login" ||
                                    pathname === "/auth/register"
                                        ? returnurl || "/"
                                        : pathname
                                }`}
                                aria-label={`Đăng nhập`}
                                className="block text-center text-[16px] leading-[44px] select-none bg-slate-700 hover:bg-slate-700/90 text-white rounded-md"
                            >
                                Tới trang đăng nhập
                            </Link>
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

export default RegisterTemplate;