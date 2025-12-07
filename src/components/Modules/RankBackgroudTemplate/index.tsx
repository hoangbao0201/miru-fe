import Breadcrumbs from "@/components/Share/BreadCrumbs";

const RankBackgroudTemplate = () => {
    return (
        <div className="py-2">
                <div className="xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md mx-auto shadow dark:shadow-none bg-white dark:bg-slate-800 md:rounded-md">
                    <div className="py-4">
                        <Breadcrumbs
                            listBreadcrumbs={[
                                {
                                    title: "Nền xếp hạng",
                                    slug: `/xep-hang/nen`,
                                },
                            ]}
                            className="mx-3 mb-3 pb-3"
                        />

                    <div className="px-3 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4">
                        {
                            Array.from({ length: 22 }).map((_, index) => {
                                return (
                                    <div key={index}>
                                        <div
                                            className={`flex items-end text-base bg-clip-text whitespace-nowrap overflow-hidden relative font-black text-black/10`}
                                            style={{ backgroundImage: `url("/static/images/level/${index+1}.gif")` }}
                                        >
                                            <div className="mr-1">USER TEST</div>
                                            <div className="relative px-[4px] ml-2 text-[11px] border text-red-600 border-red-600 rounded-sm overflow-hidden font-medium">
                                                <span>{`Cấp ${index + 1}`} </span>
                                                <span style={{ right: `calc(100% - ${100}%)`}} className={`absolute top-0 bottom-0 left-0 bg-yellow-500/30`}></span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RankBackgroudTemplate;
