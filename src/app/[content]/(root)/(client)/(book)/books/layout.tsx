
const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <main className="block">
                <div className="min-h-screen">
                    {children}
                </div>
            </main>
        </>
    );
};

export default Layout;
