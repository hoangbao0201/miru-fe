"use client"

import Link from "next/link";
const RedirectPage = ({ searchParams }: SearchParamProps) => {
    const { url: url = "" } = searchParams;

    window.location.href = String(url);
            
    return (
        <div>
            <div className="max-w-[550px] px-4 mx-auto mt-40 text-center">
                <div className="flex justify-center gap-2">
                    <div className="bubbles bg-black dark:bg-white"></div>
                    <div className="bubbles bg-black dark:bg-white"></div>
                    <div className="bubbles bg-black dark:bg-white"></div>
                </div>
                <h1 className="text-2xl font-semibold mt-5 mb-4">Đang trong quá trình chuyển trang</h1>

                <p className="mt-3 mb-6">Vui lòng đợi xử lý. Trình duyệt sẽ tự động chuyển trong vài giây…</p>

                <Link href={`url`} className="text-blue-500 underline">Nhấn vào đây nếu trình duyệt không tự chuyển sau 5 giây</Link>
            </div>
        </div>
    )
}

export default RedirectPage;