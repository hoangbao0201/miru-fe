"use client";

import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import { Suspense, useEffect } from "react";

export function onStart() {
    NProgress.start();
}

export function onComplete() {
    NProgress.done();
}

function HandleOnCompleteChild() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    useEffect(() => onComplete(), [pathname, searchParams]);
    return null;
}

const MyProgressBar = () => {
    return (
        <Suspense>
            <HandleOnCompleteChild />
        </Suspense>
    );
};

export default MyProgressBar;
