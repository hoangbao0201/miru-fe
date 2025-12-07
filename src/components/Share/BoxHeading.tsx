import classNames from "@/utils/classNames";
import { ReactNode } from "react";

interface BoxHeadingProps {
    heading: "1" | "2" | "3" | "4";
    variant?: "default" | "primary" | "secondary";
    title: string;
    titleSeo?: string;
    className?: string;
}

const BoxHeading = ({
    title = "",
    titleSeo,
    heading,
    className = "",
    variant = "default",
}: BoxHeadingProps) => {
    const Tag = `h${heading}` as keyof JSX.IntrinsicElements;
    return (
        <div className="mb-8 relative inline-block z-0">
            <div className="relative inline-block">
                <Tag
                    title={titleSeo || title}
                    className={classNames(
                        "uppercase font-bold relative z-10",
                        heading === "1" && "text-xl",
                        heading === "2" && "text-lg",
                        heading === "3" && "text-base",
                        heading === "4" && "text-base"
                    )}
                >
                    {title}
                </Tag>
                <span
                    className="absolute w-[40%] -bottom-[6px] left-0 right-0 bg-black dark:bg-white h-[3px]"
                ></span>
            </div>
        </div>
    );
};

export default BoxHeading;
