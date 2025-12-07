import { Fragment } from "react";

const SkeletonItemComment = ({ count = 4 }: { count?: number }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => {
                return (
                    <Fragment key={i}>
                        <div className="md:px-3 flex mb-4">
                            <div className="w-full bg-white dark:bg-[rgb(var(--accent-20))] rounded-md animate-pulse">
                                <div className="flex px-3 py-3">
                                    <div className="w-8 h-8 m-[2px] flex-shrink-0 bg-gray-200 rounded-full dark:bg-[rgb(var(--accent-20))]"></div>
                                    <div className="ml-3 flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="h-4 bg-gray-200 rounded-sm dark:bg-[rgb(var(--accent-20))] w-ful w-1/4 mb-1"></div>
                                            <div className="h-4 bg-gray-200 rounded-sm dark:bg-[rgb(var(--accent-20))] w-ful w-1/4 mb-1"></div>
                                        </div>
                                        <div className="flex mb-1">
                                            <div className="h-4 bg-gray-200 rounded-sm dark:bg-[rgb(var(--accent-20))] w-2/5 mb-1 mr-3"></div>
                                            <div className="h-4 bg-gray-200 rounded-sm dark:bg-[rgb(var(--accent-20))] w-3/5 mb-1"></div>
                                        </div>
                                        {/* <div className="flex mb-1">
                                            <div className="h-4 bg-gray-200 rounded-sm dark:bg-[rgb(var(--accent-20))] w-4/6 mb-1 mr-3"></div>
                                            <div className="h-4 bg-gray-200 rounded-sm dark:bg-[rgb(var(--accent-20))] w-2/6 mb-1"></div>
                                        </div> */}
                                        <div className="h-4 bg-gray-200 rounded-sm dark:bg-[rgb(var(--accent-20))] w-full mb-2"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Fragment>
                );
            })}
        </>
    );
};

export default SkeletonItemComment;
