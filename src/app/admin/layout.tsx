import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import AdminLayout from "@/components/Layouts/AdminLayout";
import { UserRole } from "@/services/user.services";

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const session = await getServerSession(authOptions);

    if (!session || (session?.user.role !== UserRole.ADMIN)) {
        redirect('/');
    }

    return (
        <>
            <AdminLayout>
                {children}
            </AdminLayout>
        </>
    );
};

export default Layout;
