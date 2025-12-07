import { ChangeEvent, useCallback, useState } from "react";
import {
    DndContext,
    closestCenter,
    DragEndEvent,
    DragOverlay,
    UniqueIdentifier,
    useSensors,
    MouseSensor,
    TouchSensor,
    useSensor,
    DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";

import {
    ISettings,
    reorderItems,
    RootStateChapterSlide,
} from "@/store/chapter/chapter.reducer";
import SortableItem from "./SortableItem";
import classNames from "@/utils/classNames";
import IconPlus from "@/components/Modules/Icons/IconPlus";
import { useAppDispatch, useAppSelector } from "@/store/store";

interface ListItemFullProps {
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

const ListItemFull = ({
    handleAddItems,
    handleTranslate,
    handleRemoveItem,
}: ListItemFullProps) => {
    const dispatch = useAppDispatch();
    const items = useAppSelector((state) => state.chapterSlice.items);
    const settings = useAppSelector((state) => state.chapterSlice.settings);

    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

    const [activeId, setActiveId] = useState<null | UniqueIdentifier>(null);
    const [isDraggingBoxImport, setIsDraggingImport] = useState(false);

    const handleDragStart = useCallback((event: DragStartEvent) => {
        setActiveId(event.active.id);
    }, []);

    const handleDragCancel = useCallback(() => {
        setActiveId(null);
    }, []);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);

            dispatch(reorderItems({ oldIndex, newIndex }));
            setActiveId(null);
        }
    };
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
            position: "append",
        });
    };
    const handleImportInput = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        e.target.value = "";

        handleAddItems({
            files,
            position: "append",
        });
    };

    const handleImportInputPrev = useCallback(
        (e: ChangeEvent<HTMLInputElement>, indexImportPrev: string) => {
            if (!e.target.files) return;
            const files = Array.from(e.target.files);
            e.target.value = "";

            handleAddItems({
                files: files,
                position: "before",
                targetId: indexImportPrev,
            });
        },
        [handleAddItems]
    );

    const activeItem = items.find((item) => item.id === activeId) || null;

    return (
        <DndContext
            sensors={sensors}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            onDragCancel={handleDragCancel}
            collisionDetection={closestCenter}
        >
            <SortableContext items={items} strategy={rectSortingStrategy}>
                <div className="flex justify-left justify-center flex-wrap gap-2">
                    {items.map((item) => (
                        <SortableItem
                            item={item}
                            key={item?.id}
                            settings={settings}
                            handleTranslate={handleTranslate}
                            handleRemoveItem={handleRemoveItem}
                            handleImportInputPrev={handleImportInputPrev}
                        />
                    ))}

                    <div
                        className={classNames(
                            "",
                            !items.length
                                ? "w-full flex-1 col-span-full"
                                : "pt-8 pb-1"
                        )}
                    >
                        <label
                            htmlFor="inputFileImage"
                            onDrop={handleImportDrop}
                            onDragOver={handleDragOverBoxImport}
                            onDragLeave={handleDragLeaveBoxImport}
                            className={classNames(
                                "relative w-[130px] group select-none border border-dashed rounded-lg flex items-center justify-center cursor-pointer overflow-hidden",
                                isDraggingBoxImport
                                    ? "border-blue-600 bg-blue-700/30"
                                    : "bg-white/5 hover:bg-white/10",
                                !items.length ? "w-full" : "w-[130px]",
                                settings?.isShowImages
                                    ? "h-[170px]"
                                    : "h-[100px]"
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
            </SortableContext>
            {/* <DragOverlay adjustScale style={{ transformOrigin: "0 0 " }}>
                {activeId && activeItem ? (
                    <ItemImage
                        isDragging
                        isOverlay={true}
                        item={activeItem}
                        handleTranslate={handleTranslate}
                        handleRemoveItem={handleRemoveItem}
                        handleImportInputPrev={handleImportInputPrev}
                    />
                ) : null}
            </DragOverlay> */}
        </DndContext>
    );
};

export default ListItemFull;
