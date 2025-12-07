import Link from "next/link";

import Header from "@/components/Partials/Header";
import Footer from "@/components/Partials/Footer";
import { ContentPageEnum } from "@/common/data.types";

export default async function NotFound({
    children,
    params,
}: {
    children: React.ReactNode;
    params: {
        content: ContentPageEnum;
    };
}) {

    return (
        <>
            <Header />
            <div className="py-4 px-3 flex flex-col items-center">
                <h1 className="font-semibold text-xl mb-4">Error 404 Not Found</h1>
                <div className="mb-4 text-center">
                    <p>Không tìm thấy!</p>
                    <p>Link không tồn tại hoặc đã bị xóa. Nhấp vào bên dưới để trở về trang chủ nhé.</p>
                </div>
                
                {/* <button 
                    onClick={handleReload}
                    className="bg-indigo-600 text-white rounded-md px-3 py-3 max-w-[500px] w-full text-center mx-auto mb-3"
                >
                    Tải lại trang
                </button> */}
                <Link href={'/'} className="bg-blue-500 text-white rounded-md px-3 py-3 max-w-[500px] w-full text-center mx-auto">Quay về trang chủ</Link>
            </div>
            <Footer content={params?.content}/>
        </>
    );
}
