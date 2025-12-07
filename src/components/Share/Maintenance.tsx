"use client";

import { useEffect, useState } from "react";

const Maintenance = () => {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const maintenanceStart = new Date();
        maintenanceStart.setHours(17);
        maintenanceStart.setMinutes(20);
        maintenanceStart.setSeconds(0);

        const maintenanceEnd = new Date(
            maintenanceStart.getTime() + 2 * 60 * 60 * 1000
        );

        const timer = setInterval(() => {
            const now = new Date();
            const distance = maintenanceEnd.getTime() - now.getTime();

            if (distance <= 0) {
                clearInterval(timer);
                setTimeLeft("Bảo trì đã hoàn tất ✅");
            } else {
                const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((distance / (1000 * 60)) % 60);
                const seconds = Math.floor((distance / 1000) % 60);

                setTimeLeft(
                    `${hours.toString().padStart(2, "0")}:${minutes
                        .toString()
                        .padStart(2, "0")}:${seconds
                        .toString()
                        .padStart(2, "0")}`
                );
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);
    return (
        <div
            className={`text-foreground bg-background min-h-screen flex items-center justify-center`}
        >
            <div className="max-w-lg w-full bg-accent rounded-2xl shadow-2xl mx-2 md:px-8 px-3 py-5 text-center">
                <h1 className="text-md font-bold uppercase mb-4 text-indigo-400">
                    Nâng cấp toàn bộ hệ thống
                </h1>
                <p className="text-gray-300 mb-6">
                    Đang tiến hành bảo trì để mang đến trải nghiệm tốt hơn cho
                    bạn.
                </p>

                <ul className="space-y-3 text-left mx-auto max-w-xs">
                    <li className="flex items-center gap-2">
                        <span className="text-pink-400 text-xl">🎬</span>
                        <span>Bổ sung thêm Anime</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="text-green-400 text-xl">⚡</span>
                        <span>Nhanh hơn, tăng hiệu suất tải trang</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="text-blue-400 text-xl">💨</span>
                        <span>Mượt hơn, cải thiện độ ổn định</span>
                    </li>

                    <li className="flex items-center gap-2">
                        <span className="text-yellow-400 text-xl">🔧</span>
                        <span>Bảo trì & nâng cấp bảo mật</span>
                    </li>
                </ul>

                <div className="mt-8">
                    <div className="text-sm text-gray-400 mb-2">
                        Thời gian bảo trì còn lại
                    </div>
                    <div className="text-2xl font-mono text-indigo-300 animate-pulse">
                        {timeLeft}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Maintenance;
