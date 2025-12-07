import { IconProps } from "@/lib/types";

const IconVietNam: React.FC<IconProps> = ({
    size = "20",
    color = "currentColor",
    ...attributes
}) => {
    return (
        <>
            <svg
                width={size}
                height={size}
                {...attributes}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 341"
            >
                <rect width="512" height="341" fill="#da251d" />
                <polygon
                    fill="#ff0"
                    points="256,68 277,146 359,146 293,191 314,270 256,220 198,270 219,191 153,146 235,146"
                />
            </svg>
        </>
    );
};

export default IconVietNam;
