"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Lỗi ở page:", error);
    }, [error]);

    return (
        <div className="p-4 text-center">
            <h2 className="text-red-500 font-bold">Có lỗi xảy ra 😥</h2>
            <p>{error.message}</p>
            <button
                onClick={() => reset()}
                className="mt-4 px-4 py-2 rounded bg-blue-500 text-white"
            >
                Thử lại
            </button>
        </div>
    );
}
