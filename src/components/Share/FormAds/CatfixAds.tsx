"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import IconClose from "@/components/Modules/Icons/IconClose";

const CatfixAds = () => {
    const searchParams = useSearchParams();
    const [isShowAds, setIsShowAds] = useState(true);

    const handleCloseAds = () => {
        setIsShowAds(false);
    };

    useEffect(() => {
        setIsShowAds(true);
    }, [searchParams]);

    if (!isShowAds) {
        return null;
    }

    return (
        <>
            <div className="fixed z-[50] bottom-0 left-0 right-0 lg:left-[40%] lg:-translate-x-[33.3%]">
                <div className="grid md:grid-cols-2 grid-cols-1 relative md:bg-transparent md:backdrop-blur-0 backdrop-blur-xl bg-[#0000004f] mx-auto md:px-0 px-6">

                    {/* i9 */}
                    {/* /20240723_8/17217294811206rkp1_GIF/728-x-90-new.gif */}
                    {/* 88vn */}
                    {/* /20240709_252/1720527498535e4n8E_GIF/728-90.gif */}

                    {/* <Link
                        href={`https://bit.ly/4hJAE5M`}
                        target="_blank"
                        className="block"
                        rel="nofollow"
                        onClick={handleCloseAds}
                    >
                        <Image
                            priority
                            unoptimized
                            width={728}
                            height={90}
                            alt="Ảnh nhà cái"
                            src={`/static/images/ads/f8bet/728-90.png`}
                            className="w-full block object-conver"
                        />
                    </Link> */}
                    {/* <div></div> */}
                    <Link
                        href={`https://686.win/home?code=NSZXRU`}
                        target="_blank"
                        className="block"
                        rel="nofollow"
                        onClick={handleCloseAds}
                    >
                        <Image
                            priority
                            unoptimized
                            width={728}
                            height={90}
                            alt="Ảnh nhà cái"
                            src={`/static/images/ads/yylive/728-90.png`}
                            className="w-full block object-conver"
                        />
                    </Link>
                    <Link
                        href={`https://686.win/home?code=NSZXRU`}
                        target="_blank"
                        className="block"
                        rel="nofollow"
                        onClick={handleCloseAds}
                    >
                        <Image
                            priority
                            unoptimized
                            width={728}
                            height={90}
                            alt="Ảnh nhà cái"
                            src={`/static/images/ads/yylive/728-90.png`}
                            className="w-full block object-conver"
                        />
                    </Link>

                    <button
                        title="Nút thoát quảng cáo"
                        onClick={handleCloseAds}
                        className="absolute text-foreground bg-error hover:bg-error/80 border border-border w-16 h-7 left-1/2 -translate-x-1/2 -top-7"
                    >
                        <IconClose className="w-7 h-7 mx-auto p-[5px] fill-white" />
                    </button>
                </div>
            </div>

            {/* <PopAds isShowAds={isShowAds} setIsShowAds={setIsShowAds}/> */}
        </>
    );
};

export default CatfixAds;
