import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import SecureLayout from "@/components/Layouts/SecureLayout";

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/');
    }

    return (
        <>
            <SecureLayout>
                {children}
            </SecureLayout>
        </>
    );
};

export default Layout;
