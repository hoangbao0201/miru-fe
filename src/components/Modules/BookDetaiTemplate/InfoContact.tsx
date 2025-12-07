import { ContentPageEnum } from "@/common/data.types";
import { UserBookContributorsType } from "@/services/book.services";
import Link from "next/link";
import IconFacebook from "../Icons/IconFacebook";

const InfoContact = ({
    user,
    content,
}: {
    user: UserBookContributorsType;
    content: ContentPageEnum;
}) => {
    return (
        <div className="px-3 py-3 divide-y divide-dashed divide-white/10 bg-accent">
            {user?.name && (
                <div className="pb-3 space-y-1">
                    <h3 title="NGƯỜI ĐĂNG TẢI" className="">
                        <p className="text-xs mb-2 font-bold">NGƯỜI ĐĂNG TẢI</p>
                        <div className="text-lg uppercase text-foreground font-semibold">
                            {user?.name}
                        </div>
                    </h3>
                    <div className="space-y-2">
                        {user?.facebookUrl && (
                            <div className="flex items-center gap-2">
                                <Link
                                    target="_blank"
                                    prefetch={false}
                                    title={user?.name}
                                    href={`http://fb.com/${user?.facebookUrl}`}
                                    className="flex items-center justify-center flex-1 px-2 py-2 gap-2 text-sm font-semibold rounded-md text-white fill-white bg-blue-600 hover:bg-blue-700"
                                >
                                    <IconFacebook />
                                    <span>fb.com</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {user?.team && (
                <>
                    <div className="pt-3 space-y-2">
                        <h3 title="NHÓM DỊCH" className="">
                            <p className="text-xs mb-2 font-bold">NHÓM DỊCH</p>
                            <div className="text-lg uppercase text-foreground font-semibold">
                                {user?.team?.team?.name}
                            </div>
                        </h3>

                        <div className="space-y-2">
                            {user?.team?.team?.facebook && (
                                <div className="flex items-center gap-2">
                                    <Link
                                        target="_blank"
                                        prefetch={false}
                                        title={user?.team?.team?.name}
                                        href={`http://fb.com/${user?.team?.team?.facebook}`}
                                        className="flex items-center justify-center flex-1 px-2 py-2 gap-2 text-sm font-semibold rounded-md text-white fill-white bg-blue-600 hover:bg-blue-700"
                                    >
                                        <IconFacebook />
                                        <span>fb.com</span>
                                    </Link>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Link
                                    prefetch={false}
                                    title={user?.team?.team?.name}
                                    href={`/${content}/teams/${user?.team?.team?.teamId}/books`}
                                    className="flex items-center justify-center flex-1 px-2 py-2 gap-2 text-sm font-semibold rounded-md bg-accent-10 hover:bg-accent-10-hover"
                                >
                                    <span>Xem chi tiết</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default InfoContact;
