"use client";

import { Env } from "@/config/Env";
import { ReactNode } from "react";
import LazyLoad from "react-lazyload";
import TopAds from "../Share/FormAds/TopAds";

const { NODE_ENV } = Env;

const AdsLayout = ({ children, isAds = true }: { children?: ReactNode, isAds: boolean }) => {
    // const { banner }: { banner: GetBannerAdsProps } =
    //     await bannerAdsService.getBannerAdsRandom({
    //         cache: "no-store",
    //     });

    return (
        <>
            {/* Top Ads */}

            {isAds && (
                <>
                    <div className="w-[300px] h-[500px] mx-auto my-2">
                        <LazyLoad unmountIfInvisible>
                            <iframe
                                style={{ border: "none", overflow: "hidden" }}
                                loading="lazy"
                                className="w-[300px] h-[500px]"
                                src="/ads/chapter/top/index.html"
                            ></iframe>
                        </LazyLoad>
                    </div>

                    <div className="mx-auto max-w-[800px] px-3">
                        <TopAds />
                    </div>
                </>
            )}
            {/* Banner */}
            {/* <div className="py-2">
                <Link
                    href={`https://bit.ly/4hJAE5M`}
                    target="_blank"
                    rel="nofollow"
                >
                    <Image
                        unoptimized
                        width={728}
                        height={90}
                        alt="Ảnh nhà cái"
                        src="/static/images/ads/f8bet/728-90.png"
                        className="aspect-[728/90] block object-cover mx-auto w-full"
                    />
                </Link>
            </div> */}

            {/* ADS SHOPEE */}
            {/* <div>
                <Link
                    target="_blank"
                    href={
                        appUrl +
                        "/redirect?url=" +
                        banner?.productUrl
                    }
                    className="block bg-[#F7442E]"
                >
                    <div className="px-2 py-2 text-white border-b border-white">
                        <h6 className="uppercase font-semibold line-clamp-1">
                            {banner?.title}
                        </h6>
                    </div>
                    <div className="relative aspect-[8/3] rounded-lg w-full flex justify-end">
                        <div className="p-2">
                            <Image
                                alt=""
                                loading="lazy"
                                width={500}
                                unoptimized
                                height={500}
                                className="bg-cover w-full h-full"
                                src={banner?.productImageUrl}
                            />
                        </div>
                        <Image
                            alt=""
                            priority
                            width={900}
                            height={400}
                            src="/static/images/banner-shopee.png"
                            className="bg-cover w-full h-full absolute top-0 right-0 left-0 bottom-0"
                        />
                    </div>
                </Link>
            </div> */}

            <div>{children}</div>

            {/* Bottom Ads */}
            {isAds && (
                <div className="w-[300px] h-[500px] mx-auto my-2">
                    <LazyLoad unmountIfInvisible>
                        <iframe
                            style={{ border: "none", overflow: "hidden" }}
                            loading="lazy"
                            className="w-[300px] h-[500px]"
                            src="/ads/chapter/bottom/index.html"
                        ></iframe>
                    </LazyLoad>
                </div>
            )}
        </>
    );
};

export default AdsLayout;
