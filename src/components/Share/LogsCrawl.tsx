import { useEffect, useRef, useState } from "react";

import clsx from "clsx";
import { socket } from "@/lib/socket";
import getTimeMessage from "@/utils/getTimeMessage";

interface TypeLogProps {
    method: string;
    status: boolean;
    url: string;
    createdAt: Date;
}

const LogsCrawl = () => {
    const logsEndRef = useRef<HTMLDivElement>(null);
    const [logs, setLogs] = useState<TypeLogProps[]>([]);

    useEffect(() => {
        const handleSetMessageCrawl = (data: {
            success: boolean;
            message: { method: string; status: boolean; url: string };
        }) => {
            if (data?.success) {
                const { method, status, url } = data?.message;

                setLogs((state) => {
                    const newLogs = state.length > 40 ? state.slice(20) : state;
                    return [
                        ...newLogs,
                        {
                            method: method,
                            status: status,
                            url: url,
                            createdAt: new Date(),
                        },
                    ];
                });
            }
        };

        socket.on("message-crawl", handleSetMessageCrawl);

        return () => {
            socket.off("message-crawl");
        };
    }, [socket]);

    useEffect(() => {
        const currentRef = logsEndRef.current;

        if (currentRef && currentRef.lastElementChild && logs.length > 0) {
            const handleDOMNodeInserted = (event: Event) => {
                const target = event.currentTarget as HTMLDivElement;
                target.scroll({ top: target.scrollHeight, behavior: "smooth" });
            };

            currentRef.addEventListener(
                "DOMNodeInserted",
                handleDOMNodeInserted
            );

            return () => {
                currentRef.removeEventListener(
                    "DOMNodeInserted",
                    handleDOMNodeInserted
                );
            };
        }
    }, [logs]);

    return (
        <div className="">
            <h3 className="font-semibold text-base mb-2">
                Logs ({logs?.length})
            </h3>
            <div
                className="relative border mb-5 h-[300px] overflow-auto custom-scroll"
                ref={logsEndRef}
            >
                <table className="table-auto w-full">
                    <colgroup>
                        <col style={{ width: "10%" }} />
                        <col style={{ width: "10%" }} />
                        <col style={{ width: "10%" }} />
                        <col style={{ width: "70%" }} />
                    </colgroup>
                    <thead className="text-gray-600 bg-gray-100 sticky top-0">
                        <tr className="whitespace-nowrap [&>th]:px-2 [&>th]:py-2 [&>th]:font-semibold">
                            <th className="">Thời gian</th>
                            <th>Phương pháp</th>
                            <th>Trạng thái</th>
                            <th className="">Đường dẫn</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                        {logs?.map((log, index) => {
                            const { method, status, url, createdAt } = log;
                            return (
                                <tr
                                    key={url + method + status}
                                    className="[&>td]:px-2 [&>td]:py-2 divide-x whitespace-nowrap"
                                >
                                    <td>{getTimeMessage(createdAt)}</td>
                                    <td>
                                        <strong
                                            className={clsx(
                                                "py-1 px-2 rounded-sm uppercase text-sm",
                                                {
                                                    "text-white bg-green-600":
                                                        method ===
                                                            "GET IMAGE" &&
                                                        status,
                                                    "text-white bg-red-600":
                                                        (method ===
                                                            "GET IMAGE" ||
                                                            method ===
                                                                "UPLOAD IMAGE TIKTOK" ||
                                                            method ===
                                                                "UPLOAD IMAGE NAVER") &&
                                                        !status,
                                                    "text-white bg-violet-600":
                                                        method ===
                                                        "START IMAGE",

                                                    "text-white bg-blue-600":
                                                        method ===
                                                            "UPLOAD IMAGE TIKTOK" &&
                                                        status,
                                                    "text-white bg-pink-600":
                                                        method ===
                                                            "UPLOAD IMAGE NAVER" &&
                                                        status,
                                                }
                                            )}
                                        >
                                            {method}
                                        </strong>
                                    </td>
                                    <td
                                        className={`${
                                            status
                                                ? "text-green-500"
                                                : " text-red-500"
                                        } font-semibold`}
                                    >
                                        {status ? "TRUE" : "FALSE"}
                                    </td>
                                    <td>{url}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LogsCrawl;
