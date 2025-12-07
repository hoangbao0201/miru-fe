import Image from "next/image";
import { Fragment } from "react";

import { Env } from "@/config/Env";
import convertTime from "@/utils/convertTime";
import TextLevel from "@/components/Share/TextLevel";
import { CategoryItemEnum, GetUserDetailProps } from "@/services/user.services";

const { NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO } = Env

interface UserDetailTemplateProps {
    user: GetUserDetailProps & { lastOnlineAt: Date | null };
}
const UserDetailTemplate = ({ user }: UserDetailTemplateProps) => {
    // Separate items
    const avatarOutlineItems = user?.ownedItems?.filter(item => item.category === CategoryItemEnum.AVATAR_OUTLINE) || [];
    const accessoryItems = user?.ownedItems?.filter(item => item.category === CategoryItemEnum.ACCESSORY) || [];
    const otherItems = user?.ownedItems?.filter(item => item.category !== CategoryItemEnum.ACCESSORY && item.category !== CategoryItemEnum.AVATAR_OUTLINE) || [];

    return (
        <div className="py-4 flex flex-col gap-6">
            <div className="flex flex-col items-center gap-4">
                <div className="relative w-full max-w-lg mx-auto flex flex-col items-center ">
                    {/* Modern avatar card */}
                    <div className="bg-gradient-to-br from-blue-300/60 via-fuchsia-200/40 to-white/60 rounded-3xl shadow-2xl flex flex-col items-center pb-6 pt-10 px-7 w-full">
                        <div className="-mt-20 relative flex items-center justify-center mb-3">
                            <Image
                                width={144}
                                height={144}
                                unoptimized
                                alt="Ảnh người dùng"
                                src={user?.avatarUrl ? NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO + "/" + user?.avatarUrl : "/static/images/avatar_default.png"}
                                className="w-36 h-36 rounded-full border-4 border-white shadow-md object-cover bg-white" />
                            {/* Optional subtle ring */}
                            <span className="absolute inset-0 rounded-full border-4 border-blue-200 animate-[fadeIn_0.8s]" style={{zIndex: 0}}></span>
                        </div>
                        <div className="w-full flex flex-col items-center gap-1">
                            <TextLevel user={user} />
                            <div className="mt-2 text-gray-800 dark:text-white/90 text-[16px]">Ngày đăng ký: <span className="font-semibold">{convertTime(user?.createdAt)}</span></div>
                            <div className="text-gray-800 dark:text-white/90 text-[16px]">Online gần nhất: <span className="font-semibold">{user?.lastOnlineAt ? convertTime(user?.lastOnlineAt) : "Không có"}</span></div>
                        </div>
                    </div>
                </div>
            </div>

            {avatarOutlineItems.length > 0 && (
                <Section title="Khung đại diện">
                    <div className="flex flex-wrap gap-4 justify-center">
                        {avatarOutlineItems.map(item => (
                            <BoxItem key={item?.itemId} imageUrl={item?.imagePreview} category={item?.category} />
                        ))}
                    </div>
                </Section>
            )}

            {accessoryItems.length > 0 && (
                <Section title="Phụ kiện">
                    <div className="flex flex-wrap gap-4 justify-center">
                        {accessoryItems.map(item => (
                            <BoxItem key={item?.itemId} imageUrl={item?.imagePreview} category={item?.category} />
                        ))}
                    </div>
                </Section>
            )}

            <Section title="Vật phẩm khác">
                <div className="flex flex-wrap gap-3 justify-center pb-4 px-4">
                    {otherItems.length === 0 ? (
                        <div className="text-gray-400">Không có vật phẩm nào khác</div>
                    ) : (
                        otherItems.map((item) => (
                            <Fragment key={item?.itemId}>
                                <BoxItem category={item?.category} imageUrl={item?.imagePreview} />
                            </Fragment>
                        ))
                    )}
                </div>
            </Section>
        </div>
    );
};

export default UserDetailTemplate;

/**
 * Section for labeled blocks
 */
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="w-full max-w-4xl mx-auto py-2">
        <h3 className="font-bold uppercase tracking-wider text-lg text-gray-800 dark:text-white/80 mb-4 pl-2 border-l-4 border-blue-500">{title}</h3>
        {children}
    </div>
);

const BoxItem = ({ imageUrl, category }: { imageUrl: string; category: CategoryItemEnum }) => {
    // Color border for special categories
    const borderClass = category === CategoryItemEnum.AVATAR_OUTLINE
        ? "border-yellow-400"
        : category === CategoryItemEnum.ACCESSORY
        ? "border-blue-400"
        : "border-gray-300 dark:border-gray-700";
    return (
        <div className={`flex flex-col items-center p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-lg transition-transform hover:-translate-y-1 border-2 ${borderClass}`}>
            <Image
                width={80}
                height={80}
                alt="Item"
                loading="lazy"
                unoptimized
                className="w-20 h-20 object-cover rounded-lg"
                src={`${imageUrl}`}
            />
        </div>
    );
};