import Image from "next/image";

import { ContentPageEnum } from "@/common/data.types";
import { getDetailTeamApi } from "@/services/team.service";

const Layout = async ({
    children,
    params,
}: {
    children: React.ReactNode;
    params: {
        teamId: number;
        content: ContentPageEnum;
    };
}) => {
    const teamId = params?.teamId;
    const content =
        (params?.content as ContentPageEnum) || ContentPageEnum.comics;

    const [dataDetailTeam] = await Promise.all([
        await getDetailTeamApi({
            teamId,
            options: {
                cache: "no-cache",
            },
        }),
    ]);
    const team = dataDetailTeam?.data;

    return (
        <>
            <div className="py-10 min-h-screen">
                <div className="mx-auto pb-10 rounded-xl max-w-screen-xl bg-[#0000004f] backdrop-blur-xl">
                    <div className="">
                        <div className="w-full lg:h-[325px] md:h-[248px] h-[176px] rounded-xl overflow-hidden bg-slate-800">
                            <video
                                autoPlay
                                loop
                                playsInline
                                preload="auto"
                                x-webkit-airplay="allow"
                                webkit-playsinline=""
                                className="w-full h-full object-cover object-center"
                                // Nếu cần disable Picture-in-Picture
                                disablePictureInPicture
                            >
                                <source
                                    src="https://mirai.senkuro.net/collectibles/68/3a3d044fb15a2797b64b3d5960a0c95efa7e862c_1920.webm"
                                    type="video/webm"
                                    media="(min-width: 0px)"
                                />
                                <source
                                    src="https://mirai.senkuro.net/collectibles/68/c7f3950c7698f40cbca92cd699e0189feb98ffc0_1920.mp4"
                                    type="video/mp4"
                                    media="(min-width: 0px)"
                                />
                                <source
                                    src="https://mirai.senkuro.net/collectibles/68/aa802d56006be414417d0f39f022f75281ac5444_320.webm"
                                    type="video/webm"
                                    media="(min-width: 320px)"
                                />
                                <source
                                    src="https://mirai.senkuro.net/collectibles/68/2d9fc1292007ec2c7e7d719835504214fad1c6aa_320.mp4"
                                    type="video/mp4"
                                    media="(min-width: 320px)"
                                />
                            </video>
                        </div>

                        <div className="-translate-y-20">
                            <div className="flex md:flex-row flex-col md:justify-start justify-center">
                                <div className="relative w-32 h-32 m-4">
                                    <Image
                                        width={100}
                                        height={100}
                                        unoptimized
                                        alt="Ảnh người dùng"
                                        className="w-32 h-32 object-cover bg-white rounded-full"
                                        src={
                                            team?.coverUrl ||
                                            `https://mirai.senkuro.net/collectibles/12/569daf735cf7f98502d7aba9b013018acc79ac2c.jpeg`
                                        }
                                    />
                                    <Image
                                        width={100}
                                        height={100}
                                        unoptimized
                                        alt="Ảnh người dùng"
                                        src={`https://mirai.senkuro.net/collectibles/98/7ece39bcdae9f3a5791039b300a839e6a1b3aacf.webp`}
                                        className="absolute max-w-40 max-h-40 w-40 h-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                    />
                                </div>
                                <div className="px-3">
                                    <div className="w-32 h-16 mb-4 md:block hidden"></div>
                                    <div className="py-3">
                                        <h1
                                            title={"Tôi là boom-boom-boom"}
                                            className="text-2xl font-semibold mb-4"
                                        >
                                            {team?.name}
                                        </h1>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4 px-3">
                                <h2 className="text-md font-semibold mb-3">Mô tả</h2>
                                <p className="text-[14px] leading-7 whitespace-pre-line px-3 py-2 bg-slate-900 rounded-lg">
                                    {team?.description ||
                                        "Tham gia với tụi tui nào!"}
                                </p>
                            </div>

                            <div>{children}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Layout;
