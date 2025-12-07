import dynamic from "next/dynamic";

import Footer from "@/components/Partials/Footer";
import Header from "@/components/Partials/Header";
import { ContentPageEnum } from "@/common/data.types";

// const CatfixAds = dynamic(() => import("@/components/Share/FormAds/CatfixAds"), { ssr: false })

const Layout = ({
    children,
    params,
}: {
    children: React.ReactNode;
    params: {
        content: ContentPageEnum;
    };
}) => {
    return (
        <>  
            <Header />
            <main>{children}</main>
            <Footer content={params?.content}/>
        </>
    );
};

export default Layout;
