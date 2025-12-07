import { Fragment } from "react";

const SkeletionItemComment = ({ count }: { count: number }) => {

    return (
        <>
            <div className="divide-y">
                {Array.from({ length: count }).map((_, i) => {
                    return (
                        <Fragment key={i}>
                            <div className="flex py-2">
                                <div className="w-full animate-pulse">
                                    <div className="flex">
                                        <div className="w-8 h-8 bg-gray-200 rounded-full dark:bg-[rgb(var(--accent-20))]"></div>
                                        <div className="ml-2 flex-1">
                                            <div className="h-5 bg-gray-200 rounded-sm dark:bg-[rgb(var(--accent-20))] w-ful w-1/4 mb-1"></div>
                                            <div className="h-5 bg-gray-200 rounded-sm dark:bg-[rgb(var(--accent-20))] w-2/5 mb-1 mr-3"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                    );
                })}
            </div>
        </>
    )
}

export default SkeletionItemComment;