"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import Modal from "./Modal";
import {
    getListItemLuckyWheelApi,
    IGetListItemLuckyWheelType,
    IItemLuckyWheelType,
} from "@/store/game/game.service";

export default function LuckyWheel() {
    const [rotation, setRotation] = useState(0);
    const [spinning, setSpinning] = useState(false);
    const [items, setItems] = useState<IItemLuckyWheelType[]>();
    const [isShowModalItem, setIsShowModalItem] = useState<IItemLuckyWheelType | null>(null);

    const spinWheel = () => {
        if (!items) return;
        if (spinning) return;

        const resultIndex = Math.floor(Math.random() * items.length);
        const segmentAngle = 360 / items.length;
        let randomOffset: number;

        if (Math.random() < 0.5) {
            randomOffset = 1 + Math.random() * 9;
        } else {
            randomOffset = segmentAngle - 5 + Math.random() * 10;
        }

        const extraSpins = 3 * 360;
        const targetRotation = resultIndex * segmentAngle + randomOffset;
        const finalRotation = extraSpins + targetRotation;

        setSpinning(true);
        setRotation((prev) => {
            const base = prev + (360 - (prev % 360));
            return base + finalRotation;
        });

        setTimeout(() => {
            setSpinning(false);
            setIsShowModalItem(items[resultIndex]);
        }, 8 * 1000);
    };

    const handleGetItemLucky = async () => {
        const items = await getListItemLuckyWheelApi({
            options: {
                cache: "no-store",
            },
        });
        if (items?.success) {
            setItems(items?.data?.content);
        }
    };

    useEffect(() => {
        handleGetItemLucky();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-white">
            {/* Vòng quay và mũi tên */}
            <div className="relative w-[400px] h-[400px]">
                {/* Vòng quay tĩnh */}
                <svg
                    width="400"
                    height="400"
                    viewBox="0 0 400 400"
                    className="absolute top-0 left-0"
                >
                    {/* Định nghĩa gradient */}
                    <defs>
                        <radialGradient id="gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                            <stop offset="0%" style={{ stopColor: "white", stopOpacity: 0.5 }} />
                            <stop offset="100%" style={{ stopColor: "white", stopOpacity: 0 }} />
                        </radialGradient>
                    </defs>
                    {/* Vẽ các phần của vòng quay */}
                    {items &&
                        items.map((item, index) => {
                            // Bắt đầu từ góc -90° (12h) để item 0 ở trên
                            const segmentAngle = 360 / items.length;
                            const startAngle = index * segmentAngle - 90;
                            const endAngle = (index + 1) * segmentAngle - 90;
                            const midAngle = startAngle + segmentAngle / 2;

                            // Tính bán kính hiệu dụng (trừ đi nửa độ rộng của stroke)
                            const effectiveRadius = 178; // 180 - 2 (strokeWidth)
                            const textRadius = 110; // Điều chỉnh vị trí text/hình ảnh gần vào trong hơn

                            const x1 =
                                200 +
                                effectiveRadius * Math.cos((startAngle * Math.PI) / 180);
                            const y1 =
                                200 +
                                effectiveRadius * Math.sin((startAngle * Math.PI) / 180);
                            const x2 =
                                200 +
                                effectiveRadius * Math.cos((endAngle * Math.PI) / 180);
                            const y2 =
                                200 +
                                effectiveRadius * Math.sin((endAngle * Math.PI) / 180);

                            const largeArc = segmentAngle > 180 ? 1 : 0;

                            const textX =
                                200 +
                                textRadius * Math.cos((midAngle * Math.PI) / 180);
                            const textY =
                                200 +
                                textRadius * Math.sin((midAngle * Math.PI) / 180);

                            return (
                                <g key={index}>
                                    {/* Phần màu */}
                                    <path
                                        d={`M 200 200 L ${x1} ${y1} A 180 180 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                        fill={item.type === "COIN" 
                                            ? index % 2 === 0
                                                ? "#4338ca"
                                                : "#1e3a8a"
                                            : "#991b1b"}
                                        stroke="#ffffff"
                                        strokeWidth="2"
                                    />
                                    {/* Thêm hiệu ứng gradient */}
                                    <path
                                        d={`M 200 200 L ${x1} ${y1} A 180 180 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                        fill="url(#gradient)"
                                        opacity="0.1"
                                    />

                                    {/* Text */}
                                    {item?.type === "COIN" ? (
                                        <text
                                            x={textX}
                                            y={textY}
                                            fill="white"
                                            fontSize="18"
                                            fontWeight="bold"
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            transform={`rotate(${
                                                midAngle + 90
                                            }, ${textX}, ${textY})`}
                                        >
                                            {item?.content ? `${item?.content} MN` : '?'}
                                        </text>
                                    ) : (
                                        <g transform={`translate(${textX - 25}, ${textY - 25})`}>
                                            <image
                                                href={item?.imageUrl}
                                                width="50"
                                                height="50"
                                                transform={`rotate(${
                                                    midAngle + 90
                                                }, 25, 25)`}
                                            />
                                        </g>
                                    )}
                                </g>
                            );
                        })}

                    {/* Viền vàng ngoài */}
                    <circle
                        cx="200"
                        cy="200"
                        r="180"
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="6"
                    />

                    {/* Tâm vòng quay và mũi tên quay */}
                    <g
                        style={{
                            transition: spinning
                                ? "transform 8s cubic-bezier(0.1, 0.9, 0.05, 1)"
                                : "none",
                            transform: `rotate(${rotation}deg)`,
                            transformOrigin: "center",
                        }}
                    >
                        {/* Mũi tên */}
                        <path
                            d="M 200 140 L 215 180 L 200 170 L 185 180 Z"
                            fill="#dc2626"
                            stroke="#ffffff"
                            strokeWidth="1"
                        />
                        
                        {/* Tâm vòng quay */}
                        <circle cx="200" cy="200" r="25" fill="#fbbf24" />
                        <circle cx="200" cy="200" r="15" fill="#ffffff" />
                    </g>
                </svg>
            </div>

            {/* Nút quay */}
            <button
                onClick={spinWheel}
                disabled={spinning}
                className="mt-8 px-8 py-2 bg-primary hover:bg-primary/80 rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {spinning ? "Đang quay..." : "QUAY NGAY"}
            </button>

            <Modal
                title="Vật phẩm"
                isOpen={!!isShowModalItem}
                setIsOpen={() => setIsShowModalItem(null)}
            >
                <div className="text-center">
                    <p>Chúc mừng bạn nhận được</p>
                    <h3 className="font-semibold text-lg mb-3">
                        {
                            isShowModalItem?.type === 'COIN' ? `${isShowModalItem?.content} MINO` : (
                                `VẬT PHẨM`
                            )
                        }
                    </h3>
                    {
                        isShowModalItem?.imageUrl && (
                            <Image
                                width={100}
                                height={100}
                                alt=""
                                unoptimized
                                src={`${isShowModalItem?.imageUrl}`}
                                className="w-28 h-28 mx-auto mb-1 flex-shrink-0 object-cover"
                            />
                        )
                    }
                </div>
            </Modal>
        </div>
    );
}
