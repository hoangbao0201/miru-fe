import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import ClientLoadingOnly from "@/components/Layouts/ClientLoadingOnly";

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const session = await getServerSession(authOptions);

    if (session) {
        redirect("/");
    }

    return (
        <>
            <div className="bg-fixed bg-cover bg-center bg-no-repeat bg-[url('https://phinf.pstatic.net/memo/20240813_77/1723547902129sauIS_JPEG/114336330_p0.jpg')] min-h-screen overflow-y-auto">
                <div className="flex justify-center pt-10 pb-10">
                    <ClientLoadingOnly>{children}</ClientLoadingOnly>
                </div>
            </div>
        </>
    );
};

export default Layout;
