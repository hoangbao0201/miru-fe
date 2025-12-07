import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { ContentPageEnum } from "@/common/data.types";
import CreatorLayout from "@/components/Layouts/CreatorLayout";
import { UserRole } from "@/services/user.services";

const Layout = async ({ children, params }: { children: React.ReactNode, params: {
    content: ContentPageEnum;
}; }) => {
    const session = await getServerSession(authOptions);
    const content = params.content as ContentPageEnum || ContentPageEnum.comics;

    if (!session || ![UserRole.ADMIN, UserRole.EDITOR, UserRole.CREATOR].includes(session?.user.role)) {
        redirect('/');
    }

    return (
        <>
            <CreatorLayout content={content}>
                {children}
            </CreatorLayout>
        </>
    );
};

export default Layout;
