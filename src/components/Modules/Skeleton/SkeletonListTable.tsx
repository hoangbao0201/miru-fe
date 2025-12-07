import { Fragment } from "react";

const SkeletonListTable = ({ count = 4, col = 6 }: { count?: number, col?: number }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => {
                return (
                    <Fragment key={i}>
                        <tr className="animate-pulse w-full [&>td]:w-full [&>td>div]:mx-1 [&>td>div]:my-1 [&>td>div]:bg-gray-200 [&>td>div]:dark:bg-[rgb(var(--accent-20))] [&>td>div]:rounded-md [&>td>div]:h-10">
                            {
                                Array.from({ length: col }).map((_, index) => {
                                    return (
                                        <td key={index} className="">
                                            <div></div>
                                        </td>
                                    )
                                })
                            }
                        </tr>
                    </Fragment>
                );
            })}
        </>
    );
};

export default SkeletonListTable;
