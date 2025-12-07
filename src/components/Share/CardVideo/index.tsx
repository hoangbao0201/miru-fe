import Link from "next/link";
import Image from "next/image";
import classNames from "@/utils/classNames";
import { VideoTypeTypeEnum } from "@/constants/type";
import { IGetListVideoType } from "@/store/video/video.types";
import { ContentPageEnum } from "@/common/data.types";
import convertTime from "@/utils/convertTime";

interface CardVideoProps {
    content: ContentPageEnum;
    video: IGetListVideoType["data"]["videos"][number];
}
const CardVideo = ({ video, content }: CardVideoProps) => {
    return (
        <>
            <figure>
                <div className="">
                    <div className="relative text-center overflow-hidden mb-2">
                        <Link
                            prefetch={false}
                            href={`/${content}/t/videos/${
                                video?.localizedContent?.[0]?.slug
                            }-${video?.videoId}${
                                video?.type === VideoTypeTypeEnum.MOVIE &&
                                video?.isAdult
                                    ? "/0"
                                    : ""
                            }`}
                            title={`Phim ${video?.localizedContent?.[0]?.title}`}
                            className=""
                        >
                            <div className="absolute flex inset-1 space-x-1 leading-loose">
                                {/* {book?.isFeatured && (
                                    <span className="px-1 rounded-sm bg-[#FF2F5F] text-white text-sm font-bold shadow">
                                        HOT
                                    </span>
                                )}
                                {diffInDays <= 3 && (
                                    <span className="px-1 rounded-sm bg-sky-600 text-white text-sm font-bold shadow">
                                        NEW
                                    </span>
                                )} */}
                                {video?.episodes?.length > 0 && (
                                    <div className="rounded-sm px-2 h-5 leading-5 text-xs text-center bg-red-700 text-white font-bold shadow">
                                        T.{video?.episodes?.[0]?.episodeNumber}
                                    </div>
                                )}
                            </div>
                            <Image
                                key={`${video?.videoId}`}
                                unoptimized
                                loading="lazy"
                                src={
                                    video?.covers?.[0]?.url ??
                                    "/static/images/image-book-not-found.jpg"
                                }
                                width={175}
                                height={238}
                                alt={`Phim ${video?.localizedContent?.[0]?.title}`}
                                className={classNames(
                                    "w-full rounded-md object-cover bg-[#151D35] align-middle",
                                    video?.type === VideoTypeTypeEnum.MOVIE &&
                                        video?.isAdult
                                        ? "aspect-video"
                                        : "aspect-[125/173]"
                                )}
                            />
                        </Link>
                    </div>
                    <div className="">
                        <Link
                            prefetch={false}
                            href={`/${content}/t/videos/${
                                video?.localizedContent?.[0]?.slug
                            }-${video?.videoId}${
                                video?.type === VideoTypeTypeEnum.MOVIE &&
                                video?.isAdult
                                    ? "/0"
                                    : ""
                            }`}
                            title={`Phim ${video?.localizedContent?.[0]?.title}`}
                            className="text-sm font-semibold line-clamp-2"
                        >
                            {video?.localizedContent?.[0]?.title}
                        </Link>
                            
                        <div className="mt-2">
                            {video?.episodes?.[0] && [video?.episodes?.[0]].map((episode, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="mb-2 flex justify-between items-center whitespace-nowrap space-x-1"
                                    >
                                        <Link
                                            prefetch={false}
                                            title={`Tập ${episode?.episodeNumber}`}
                                            className="uppercase visited:text-gray-600 text-gray-50 px-[8px] py-[6px] text-[12px] leading-[12px] font-semibold bg-white/5 hover:underline hover:bg-[#02aab0] hover:text-white rounded-md"
                                            href={`/${content}/t/videos/${video?.videoId}/${episode?.episodeId}`}
                                        >
                                            {"T." + episode?.episodeNumber}
                                        </Link>
                                        <span className="text-[10px] leading-[10px] text-gray-400">{`${convertTime(
                                            episode?.createdAt
                                        )}`}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </figure>
        </>
    );
};

export default CardVideo;
