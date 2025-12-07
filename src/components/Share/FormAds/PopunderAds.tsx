import { ReactNode } from "react";

const PopunderAds = ({ children }: { children: ReactNode }) => {
    const handleClick = () => {
        const bannerPopunder = localStorage.getItem("popunder-ads");
        if (bannerPopunder) {
            const milionDiff = Math.abs(
                new Date().getTime() - new Date(bannerPopunder).getTime()
            );
            if (milionDiff > 30 * 60 * 1000) {
                localStorage.setItem("popunder-ads", new Date().toISOString());
                window.open("https://vesmart.vn/bai-viet/sua-chua-robot-hut-bui-da-nang", "_blank");
            }
        } else {
            localStorage.setItem("popunder-ads", new Date().toISOString());
            window.open("https://vesmart.vn/bai-viet/sua-chua-robot-hut-bui-da-nang", "_blank");
        }
    }

    return <div onClick={handleClick}>{children}</div>;
};

export default PopunderAds;
