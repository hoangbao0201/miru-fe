import { Fragment } from "react";

const SkeletonCardBook = ({ count = 4 }: { count?: number }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => {
                return (
                    <Fragment key={i}>
                        <div className="animate-pulse">
                            <div className="aspect-[125/173] md:rounded-sm bg-gray-200 dark:bg-[rgb(var(--accent-20))] mb-2"></div>
                            <div className="md:rounded-sm mb-2">
                                <div className="h-6 bg-gray-200 dark:bg-[rgb(var(--accent-20))]"></div>
                            </div>
                            <div className="h-[51px] bg-gray-200 dark:bg-[rgb(var(--accent-20))] mb-2"></div>
                            <div className="md:rounded-sm mb-2">
                                <div className="h-6 bg-gray-200 dark:bg-[rgb(var(--accent-20))]"></div>
                            </div>
                        </div>
                    </Fragment>
                );
            })}
        </>
    );
};

export default SkeletonCardBook;
