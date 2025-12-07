import Image from "next/image";

interface AvatarWithOutlineProps {
    avatarUrl?: string;
    outlineUrl?: string;
    outlineName?: string;
    size?: number; // Kích thước avatar chính (mặc định 32px)
    spacing?: number; // Kích thước viền (mặc định 55px)
    offsetX?: number; // Điều chỉnh độ lệch ngang (px)
    offsetY?: number; // Điều chỉnh độ lệch dọc (px)
    className?: string;
}

export default function AvatarWithOutline({
    avatarUrl = "/static/images/avatar_default.png",
    outlineUrl,
    outlineName,
    size = 32,
    spacing = 23,
    offsetX = 0,
    offsetY = 0,
    className = "",
}: AvatarWithOutlineProps) {
    return (
        <div
            className={`relative flex-shrink-0 ${className}`}
            style={{
                width: `${size}px`,
                height: `${size}px`,
            }}
        >
            {/* Avatar chính */}
            <Image
                unoptimized
                priority
                width={size}
                height={size}
                alt="Avatar"
                src={avatarUrl}
                className="rounded-full object-cover"
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                }}
            />

            {/* Viền avatar */}
            {outlineUrl && (
                <Image
                    unoptimized
                    loading="lazy"
                    width={size + spacing}
                    height={size + spacing}
                    alt={outlineName || "Avatar Outline"}
                    title={outlineName}
                    src={outlineUrl}
                    className="absolute"
                    style={{
                        width: `${size + spacing}px`,
                        height: `${size + spacing}px`,
                        maxWidth: `${size + spacing}px`,
                        maxHeight: `${size + spacing}px`,
                        top: `calc(50% + ${offsetY}px)`,
                        left: `calc(50% + ${offsetX}px)`,
                        transform: "translate(-50%, -50%)",
                    }}
                />
            )}
        </div>
    );
}
