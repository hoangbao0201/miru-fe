import Link from "next/link";
import Image from "next/image";

import { Env } from "@/config/Env";
import getDomainConfig from "@/lib/domain";
import { ContentPageEnum } from "@/common/data.types";

const listTitleWeb = [
    "Netruyen",
    "Truyện tranh",
    "Truyen tranh online",
    "Đọc truyện tranh",
    "Truyện tranh hot",
    "Truyện tranh hay",
    "Truyện ngôn tình",
    "Manhwa",
    "Manga",
    "Manhua",
    "truyenqq",
    "mi2manga",
    "doctruyen3q",
    "toptruyen",
    "cmanga",
    "vlogtruyen",
    "blogtruyen",
    "truyentranhaudio",
    "vcomic",
];

const listBookSeo = [
    {
        title: "Ta là tà đế",
        link: "truyen/ta-la-ta-de-1",
    },
];

const { NEXT_PUBLIC_TITLE_SEO } = Env;

const Footer = async ({ content }: { content: ContentPageEnum; }) => {
    const { appUrl } = await getDomainConfig();

    return (
        <footer>
            <div className="bg-accent shadow">
                <div className="text-foreground xl:max-w-screen-8xl lg:max-w-screen-lg md:max-w-screen-md mx-auto py-5 px-3">
                    <div className="-mx-3">
                        <div className="lg:flex">
                            <div className="lg:w-4/12 px-3 mb-8">
                                <div className="mb-2">
                                    <Link
                                        href={`/`}
                                        title={NEXT_PUBLIC_TITLE_SEO}
                                        className="flex items-center font-extrabold text-2xl"
                                    >
                                        MIRUDEX
                                    </Link>
                                </div>
                                <div className="mb-3">
                                    <Link
                                        title="about"
                                        href={`/${content}/chinh-sach-bao-mat`}
                                        className="hover:underline"
                                    >
                                        Giới thiệu
                                    </Link>
                                </div>

                                <div className="mb-3">
                                    <Link
                                        title="privacy"
                                        href={`/${content}/chinh-sach-bao-mat`}
                                        className="hover:underline"
                                    >
                                        Chính sách bảo mật
                                    </Link>
                                </div>

                                {/* <BackLink /> */}
                            </div>

                            <div className="lg:w-8/12 px-3 mb-10">
                                <div className="mb-3">
                                    © 2024 Copyright {NEXT_PUBLIC_TITLE_SEO}
                                </div>

                                <p className="font-semibold mb-2">Từ khóa</p>
                                <div className="text-sm whitespace-nowrap flex flex-wrap gap-1 mb-3">
                                    {listTitleWeb?.map((item, index) => {
                                        return (
                                            <Link
                                                key={index}
                                                href="/"
                                                target="_self"
                                                title={item}
                                                className="px-2 py-1 bg-muted/10 rounded-lg border border-border border-dashed text-muted-foreground"
                                            >
                                                {item}
                                            </Link>
                                        );
                                    })}
                                </div>

                                <p className="font-semibold mb-2">
                                    Từ khóa truyện hay
                                </p>
                                <div className="text-sm whitespace-nowrap flex flex-wrap gap-1 mb-3">
                                    {listBookSeo?.map((item, index) => {
                                        return (
                                            <Link
                                                key={index}
                                                target="_self"
                                                title={item?.title}
                                                href={`${appUrl}/${ContentPageEnum.comics}/${item?.link}`}
                                                className="px-2 py-1 bg-muted/10 rounded-lg border border-border border-dashed text-muted-foreground"
                                            >
                                                {item?.title}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="px-3 mb-8">
                            <h5 className="font-semibold mb-2">
                                Nội dung hướng đến
                            </h5>
                            <div>
                                <p className="mb-2">
                                    Trang web của chúng tôi chỉ cung cấp dịch vụ
                                    đọc truyện tranh online với mục đích giải
                                    trí và chia sẻ nội dung. Toàn bộ các truyện
                                    tranh được đăng tải trên trang web được sưu
                                    tầm từ nhiều nguồn trên internet và chúng
                                    tôi không chịu trách nhiệm về bản quyền hoặc
                                    quyền sở hữu đối với bất kỳ nội dung nào.
                                    Nếu bạn là chủ sở hữu bản quyền và cho rằng
                                    nội dung trên trang vi phạm quyền của bạn,
                                    vui lòng liên hệ với chúng tôi để tiến hành
                                    gỡ bỏ nội dung vi phạm một cách kịp thời.
                                </p>
                                <p>
                                    Ngoài ra, chúng tôi không chịu trách nhiệm
                                    về các nội dung quảng cáo hiển thị trên
                                    trang web, bao gồm nhưng không giới hạn ở
                                    việc quảng cáo sản phẩm hoặc dịch vụ của bên
                                    thứ ba. Những quảng cáo này không phản ánh
                                    quan điểm hoặc cam kết của chúng tôi. Người
                                    dùng cần tự cân nhắc và chịu trách nhiệm khi
                                    tương tác với các quảng cáo đó.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
