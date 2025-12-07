import { ReactNode } from "react";

import { cn } from "@/utils/cn";

const BASE_GRID_CLASSES =
    "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-3";

interface BookGridProps {
    children: ReactNode;
    className?: string;
}

const BookGrid = ({ children, className }: BookGridProps) => {
    return <div className={cn(BASE_GRID_CLASSES, className)}>{children}</div>;
};

export default BookGrid;

