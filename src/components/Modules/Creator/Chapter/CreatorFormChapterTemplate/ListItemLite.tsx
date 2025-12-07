import { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    activeItem,
    StepStatusEnum,
    ChapterStepEnum,
    RootStateChapterSlide,
} from "@/store/chapter/chapter.reducer";
import classNames from "@/utils/classNames";
import ItemImageLite from "./ItemImageLite";
import IconPlus from "@/components/Modules/Icons/IconPlus";

interface ListItemLiteProps {
    handleRemoveItem: (id: string) => void;
    handleAddItems: ({
        files,
        position,
        targetId,
    }: {
        files: File[];
        position: "prepend" | "append" | "before" | "after";
        targetId?: string;
    }) => void;
    handleTranslate: (id: string) => Promise<void>;
}

const ListItemLite = ({
    handleAddItems,
    handleTranslate,
    handleRemoveItem,
}: ListItemLiteProps) => {
    const { items } = useSelector(
        (state: RootStateChapterSlide) => state.chapterSlice
    );

    const [isDraggingBoxImport, setIsDraggingImport] = useState(false);

    const handleDragOverBoxImport = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingImport(true);
    };

    const handleDragLeaveBoxImport = () => {
        setIsDraggingImport(false);
    };

    const handleImportDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingImport(false);
        const files = Array.from(e.dataTransfer.files);

        handleAddItems({
            files,
            position: "append"
        });
    };

    const handleImportInput = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        e.target.value = "";

        handleAddItems({
            files,
            position: "append"
        });
    };

    const handleImportInputPrev = (
        e: ChangeEvent<HTMLInputElement>,
        indexImportPrev: string
    ) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        e.target.value = "";

        handleAddItems({
            files: files,
            position: "before",
            targetId: indexImportPrev,
        })
    };

    return (
        <div className="grid 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-y-1">
            {items.map((item) => (
                <ItemImageLite
                    item={item}
                    key={item?.id}
                    handleTranslate={handleTranslate}
                    handleRemoveItem={handleRemoveItem}
                    handleImportInputPrev={handleImportInputPrev}
                />
            ))}

            <div
                className={classNames(
                    "pt-7 pb-1 pl-2 mx-auto",
                    !items.length && "w-full flex-1 col-span-full"
                )}
            >
                <label
                    htmlFor="inputFileImage"
                    onDrop={handleImportDrop}
                    onDragOver={handleDragOverBoxImport}
                    onDragLeave={handleDragLeaveBoxImport}
                    className={classNames(
                        "relative h-24 bg-slate-900 group select-none border border-dashed rounded-lg flex items-center justify-center cursor-pointer overflow-hidden",
                        isDraggingBoxImport
                            ? "border-blue-600 bg-blue-700/30"
                            : "bg-slate-800 hover:bg-slate-700/50",
                        !items.length ? "w-full" : "w-[164px]"
                    )}
                >
                    <div
                        className={`top-0 bottom-0 right-0 left-0 flex items-center justify-center absolute transition-all`}
                    >
                        <IconPlus className="w-7 h-7 block fill-white z-10" />
                    </div>
                </label>
                <input
                    multiple
                    type="file"
                    className="hidden"
                    id="inputFileImage"
                    onChange={handleImportInput}
                />
            </div>
        </div>
    );
};

export default ListItemLite;
