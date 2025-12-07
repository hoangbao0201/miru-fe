"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";

import LuckyWheel from "@/components/Share/LuckyWheel";

const LuckyWheelTemplate = () => {
    const { data: session, status } = useSession();

    const [balance, setBalance] = useState<null | number>(null);
    

    const handleGetAttendance = async () => {
        // if (status !== "authenticated") {
        //     return;
        // }
        // try {
        //     const userAttendance = await userService.getAttendanceHistory({
        //         token: session?.backendTokens.accessToken,
        //     });
        //     if (userAttendance?.success) {
        //         setBalance(userAttendance?.user?.balance);
        //         setListAttendance(userAttendance?.user?.attendance);
        //     }
        // } catch (error) {}
    };

    useEffect(() => {
        handleGetAttendance();
    }, [status]);

    // =================

    return (
        <div>
            <h1 title="THÔNG TIN CHUNG" className="postname">
                ĐIỂM DANH
            </h1>
            <div>
                <div className="mb-7">
                    <div className="flex items-center text-2xl mb-4">
                        <h3 className="font-extrabold text-[#22f2ff] mr-3 bg-[url('/static/images/level/bg-rank.gif')]">
                            MINOCOIN:{" "}
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

                    <LuckyWheel />
                </div>
            </div>
        </div>
    );
};

export default LuckyWheelTemplate;
