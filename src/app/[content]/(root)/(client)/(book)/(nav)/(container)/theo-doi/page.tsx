import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { ContentPageEnum } from "@/common/data.types";
import BooksFollowTemplate from "@/components/Modules/BooksFollowTemplate";

export default async function FollowPage({
    params,
    searchParams,
}: SearchParamProps & { params: { content: ContentPageEnum } }) {
    const session = await getServerSession(authOptions);

    const { content } = params;
    const { page: page = "" } = searchParams;
    const currentPage = Number(page) || 1;

    return (
        <div className="px-3 mb-5">
            {session ? (
                <BooksFollowTemplate
                    title="Truyện đang theo dõi"
                    content={content}
                    currentPage={currentPage}
                />
            ) : (
                <div>Bạn chưa đăng nhập tài khoản!</div>
            )}
        </div>
    );
}
