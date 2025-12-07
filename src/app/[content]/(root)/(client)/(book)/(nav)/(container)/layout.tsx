import dynamic from "next/dynamic";
import SideHome from "@/components/Share/SideHome";
import { ContentPageEnum } from "@/common/data.types";
import TopAds from "@/components/Share/FormAds/TopAds";
import FeaturedSection from "@/components/Share/FeaturedSection";

const EventWinter = dynamic(
    () => import("@/components/Share/Event/EventWinter"),
    {
        ssr: false,
    }
);

const Layout = async ({
    children,
    params,
}: {
    children: React.ReactNode;
    params: {
        content: ContentPageEnum;
    };
}) => {
    const content =
        (params.content as ContentPageEnum) || ContentPageEnum.comics;

    return (
        <>
            <EventWinter />
            <div className="">
                <FeaturedSection
                    type="book"
                    content={content}
                    options={{ page: 1 }}
                />

                <div className="xl:max-w-screen-8xl lg:max-w-screen-lg md:max-w-screen-md mx-auto">
                    <TopAds />

                    <div className="py-4 grid grid-cols-12">
                        <div className="lg:col-span-8 col-span-full">{children}</div>

                        <div className="lg:col-span-4 col-span-full px-3 mb-5">
                            <SideHome content={content} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Layout;
