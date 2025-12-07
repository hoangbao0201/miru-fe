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
    // const content =
    //     (params.content as ContentPageEnum) || ContentPageEnum.comics;

    return (
        <>
            <div className="xl:max-w-screen-8xl lg:max-w-screen-lg md:max-w-screen-md mx-auto">
                {children}
            </div>
        </>
    );
};

export default Layout;
