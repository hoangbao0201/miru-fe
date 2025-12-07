"use client";

import axios from "axios";
import { useEffect, useState } from "react";

const TestNetworkSpeed = () => {
    const [downloadSpeed, setDownloadSpeed] = useState<null | string>(null);
    const [isTesting, setIsTesting] = useState(false);

    const testNetworkSpeed = async () => {
        const imageUrl = `https://placehold.co/720x1000/orange/white?timestamp=${Date.now()}`;

        const startTime = performance.now();

        try {
            const response = await axios.get(imageUrl, {
                responseType: "blob",
                headers: {},
            });
            const endTime = performance.now();
            const blobSize = response.data.size; // Kích thước tệp
            const duration = (endTime - startTime) / 1000; // Thời gian tải (giây)
            const speedMbps = (blobSize * 8) / (1024 * 1024 * duration); // Tốc độ mạng (Mbps)

            console.log(`Tốc độ mạng: ${speedMbps.toFixed(2)} Mbps`);

            setDownloadSpeed(speedMbps.toFixed(2)); // Giữ 2 chữ số thập phân
        } catch (error) {
            console.error("Error testing network speed:", error);
            setDownloadSpeed("Error");
        }
    };

    // useEffect(() => {
    //     let interval: NodeJS.Timeout | undefined;

    //     if (isTesting) {
    //         interval = setInterval(() => {
    //             testNetworkSpeed();
    //         }, 2000); // Kiểm tra mỗi 5 giây
    //     }

    //     // Dọn dẹp interval khi trạng thái thay đổi hoặc component unmount
    //     return () => {
    //         if (interval !== undefined) {
    //             clearInterval(interval);
    //         }
    //     };
    // }, [isTesting]);

    return (
        <div>
            <h1>Network Speed Test</h1>
            <p>
                {downloadSpeed !== null
                    ? `Your download speed: ${downloadSpeed} Mbps`
                    : "Click 'Start' to test."}
            </p>
            <button
                // onClick={() => testNetworkSpeed()}
                onClick={() => setIsTesting(true)}
                style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    fontSize: "16px",
                    cursor: "pointer",
                }}
            >
                {isTesting ? "Stop" : "Start"}
            </button>
        </div>
    );
};

export default TestNetworkSpeed;
