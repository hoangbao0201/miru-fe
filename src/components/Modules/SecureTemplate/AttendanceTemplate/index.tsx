"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import LazyLoad from "react-lazyload";

import IconStar from "../../Icons/IconStar";
import { useSession } from "next-auth/react";
import Modal from "@/components/Share/Modal";
import getDayInMonth from "@/utils/getDayInMonth";
import IconLoadingSpin from "../../Icons/IconLoadingSpin";
import IconCircleDashed from "../../Icons/IconCircleDashed";
import userService, { AttendanceHistoryType } from "@/services/user.services";

const AttendanceTemplate = () => {
    const { data: session, status } = useSession();

    const { day, month, year, listDate } = getDayInMonth();

    const [isAds, setIsAds] = useState<boolean>(false);
    const [isClickAds, setIsClickAds] = useState<boolean>(false);
    const [isDayCheck, setIsDayCheck] = useState<null | number>(null);

    const [balance, setBalance] = useState<null | number>(null);
    const [listAttendance, setListAttendance] =
        useState<null | AttendanceHistoryType>(null);
    const [isShowModalItem, setIsShowModalItem] = useState<null | number>(null);

    const handleShowAds = (dayCheck: number) => {
        if (!listAttendance?.attendancePerDay?.[dayCheck] && dayCheck === day) {
            setIsAds(true);
            setIsDayCheck(dayCheck);
        }
    };

    const handleGetAttendance = async () => {
        if (status !== "authenticated") {
            return;
        }
        try {
            const userAttendance = await userService.getAttendanceHistory({
                token: session?.backendTokens.accessToken,
            });

            if (userAttendance?.success) {
                setBalance(userAttendance?.user?.balance);
                setListAttendance(userAttendance?.user?.attendance);
            }
        } catch (error) {}
    };

    useEffect(() => {
        handleGetAttendance();
    }, [status]);

    const handleAttendance = async () => {
        if (status !== "authenticated") {
            return;
        }
        if (isDayCheck && !!listAttendance) {
            try {
                const userAttendance = await userService.markAttendance({
                    token: session?.backendTokens.accessToken,
                });

                if (userAttendance?.success) {
                    setBalance((state) => (state || 0) + 5);
                    setListAttendance({
                        ...listAttendance,
                        attendancePerDay: {
                            ...listAttendance.attendancePerDay,
                            [isDayCheck]: true,
                        },
                    });
                }
            } catch (error) {
            } finally {
                setIsAds(false);
                setIsDayCheck(null);
                setIsClickAds(false);
            }
        }
    };

    // =================

    useEffect(() => {
        if (!isAds && isClickAds) {
            handleAttendance();
        }
    }, [isAds]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsAds(false);
            setIsClickAds(true);
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, []);

    return (
        <div>
            <h1 title="THÔNG TIN CHUNG" className="postname">
                ĐIỂM DANH
            </h1>
            <div>
                <div className="mb-7">
                    <div className="flex items-center text-2xl mb-4">
                        <h3 className="font-extrabold text-[#22f2ff] mr-3 bg-[url('/static/images/level/bg-rank.gif')]">
                            MIRUCOINS:{" "}
                        </h3>
                        <span className="font-semibold">{balance}</span>
                        <span className="ml-2">
                            <Image
                                width={200}
                                height={200}
                                alt=""
                                className="w-[25px] h-[25px]"
                                src={"/static/images/minocoin.png"}
                            />
                        </span>
                    </div>

                    <div className="">
                        <div className="flex items-end font-extrabold text-2xl">
                            <span className="">{day}</span>
                            <span className="mx-2">/</span>
                            <span className="">{month}</span>
                            <span className="mx-2">/</span>
                            <span className="">{year}</span>
                        </div>

                        {listAttendance ? (
                            <div className="py-2 max-w-[550px] mb-3">
                                <div className="grid grid-cols-7 text-center gap-1 font-semibold text-orange-700 bg-gray-200 rounded-md px-1 py-1 text-sm mb-1 [&>div]:px-1">
                                    <div>Chủ nhật</div>
                                    <div>Thứ 2</div>
                                    <div>Thứ 3</div>
                                    <div>Thứ 4</div>
                                    <div>Thứ 5</div>
                                    <div>Thứ 6</div>
                                    <div>Thứ 7</div>
                                </div>
                                <div className="grid grid-cols-7 gap-1">
                                    {listDate.map((date, index) => {
                                        return (
                                            <button
                                                key={index}
                                                onClick={() =>
                                                    handleShowAds(date?.day)
                                                }
                                                className={`${
                                                    (date?.month !== month ||
                                                        date?.day < day) &&
                                                    "pointer-events-none bg-gray-200 stripe-1"
                                                } ${
                                                    (date?.day > day ||
                                                        listAttendance
                                                            ?.attendancePerDay?.[
                                                            date?.day
                                                        ]) &&
                                                    "pointer-events-none"
                                                } ${
                                                    date?.day === day && ``
                                                } transition-all relative font-semibold outline-none border border-dashed select-none text-start hover:bg-gray-100 active:bg-gray-200 hover:dark:bg-gray-600 active:dark:bg-gray-500 h-8 px-2 leading-8 md:flex items-center justify-between`}
                                            >
                                                <span>{date?.day}</span>
                                                {listAttendance
                                                    ?.attendancePerDay?.[
                                                    date?.day
                                                ] && (
                                                    <>
                                                        <span className="absolute top-1 right-1">
                                                            <IconCircleDashed className="fill-red-500 right-2 w-6 h-6" />
                                                        </span>
                                                        <span className="absolute top-1 right-1">
                                                            <IconStar className="fill-yellow-500 w-6 h-6 p-1" />
                                                        </span>
                                                    </>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="mt-2 mb-5 flex items-center justify-center rounded-lg max-w-[550px] bg-gray-100 dark:bg-gray-600 animate-pulse w-full h-[208px]">
                                <IconLoadingSpin className="fill-black dark:fill-white" />
                            </div>
                        )}

                        <div>
                            {!!isAds && (
                                <div>
                                    <h4 className="font-semibold text-lg mb-3">
                                        Click vào quảng cáo để tiến hành điểm
                                        danh
                                    </h4>
                                    <div className="w-[300px] h-[500px] mx-auto my-2">
                                        {/* <TopAds /> */}

                                        <LazyLoad unmountIfInvisible>
                                            <iframe
                                                style={{
                                                    border: "none",
                                                    overflow: "hidden",
                                                }}
                                                loading="lazy"
                                                className="w-[300px] h-[500px]"
                                                src="/ads/chapter/bottom/index.html"
                                            ></iframe>
                                        </LazyLoad>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                title="Vật phẩm"
                isOpen={!!isShowModalItem}
                setIsOpen={(type) => setIsShowModalItem(null)}
            >
                <div className="text-center">
                    <p>Chúc mừng bạn nhận được vật phẩm</p>
                    <h3 className="font-semibold text-lg mb-3">
                        Cây Sinh Mệnh
                    </h3>
                    <Image
                        width={100}
                        height={100}
                        alt="Item 1"
                        src={`${isShowModalItem}`}
                        className="w-28 h-28 mx-auto mb-1 flex-shrink-0 object-cover"
                    />
                </div>
            </Modal>
        </div>
    );
};

export default AttendanceTemplate;
