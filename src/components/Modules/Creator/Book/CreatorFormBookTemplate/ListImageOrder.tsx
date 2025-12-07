"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    useSortable,
    SortableContext,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import classNames from "@/utils/classNames";
import IconClose from "@/components/Modules/Icons/IconClose";
import IconMove from "@/components/Modules/Icons/IconMove";

interface ImageItem {
    imageId: number;
    url: string;
    width: number;
    height: number;
    index: number;
}

export default function ListImageOrder({
    data,
    image,
    handleOrderImage,
    handleDeleteImage,
}: {
    data: ImageItem[];
    image: "cover" | "poster";
    handleOrderImage: (newOrder: ImageItem[]) => void;
    handleDeleteImage: (imageId: number) => Promise<void>;
}) {
    const [items, setItems] = useState<ImageItem[]>(data || []);

    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = items.findIndex((i) => i.url === active.id);
        const newIndex = items.findIndex((i) => i.url === over.id);

        const moved = arrayMove(items, oldIndex, newIndex);

        const reIndexed = moved.map((item, idx) => ({
            ...item,
            index: moved.length - idx,
        }));

        setItems(reIndexed);
        handleOrderImage(reIndexed);
    };

    useEffect(() => {
        setItems(data || []);
    }, [data]);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items.map((i) => i.url)}
                strategy={rectSortingStrategy}
            >
                <div className={classNames(
                    "grid gap-2",
                    image === "cover" && "lg:grid-cols-8 md:grid-cols-6 grid-cols-3",
                    image === "poster" && "lg:grid-cols-4 md:grid-cols-2 grid-cols-1",
                )}>
                    {items.map((image) => (
                        <SortableImage
                            image={image}
                            key={image.url}
                            indexSelect={items?.[0].index || 0}
                            handleDeleteImage={handleDeleteImage}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}

function SortableImage({
    image,
    indexSelect,
    handleDeleteImage,
}: {
    image: ImageItem;
    indexSelect: number;
    handleDeleteImage: (imageId: number) => Promise<void>;
}) {
    const {
        isDragging,
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: image.url });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={{
                ...style,
            }}
        >
            {/* Overlay điều khiển */}
            <div
                style={{
                    backgroundImage: `url(${
                        image.url ?? "/static/images/image-book-not-found.jpg"
                    })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    aspectRatio: `${image?.width}/${image?.height}`,
                }}
                className={classNames(
                    "w-full relative select-none rounded-lg shadow-sm border overflow-hidden",
                    image?.index === indexSelect && "border-4 border-blue-800"
                )}
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    {/* Nút Xóa */}
                    {!isDragging && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation(); // ⚡ tránh trigger drag
                                handleDeleteImage(image.imageId);
                            }}
                            className="absolute top-2 left-2 z-10"
                        >
                            <IconClose className="w-7 h-7 p-1 fill-white bg-red-600 rounded-lg" />
                        </button>
                    )}

                    {/* Nút Kéo */}
                    <button
                        {...attributes}
                        {...listeners}
                        type="button"
                        className="w-10 h-10 z-10 cursor-grab active:cursor-grabbing"
                    >
                        <IconMove className="w-10 h-10 p-2 fill-gray-600 rounded-md border border-white/10 bg-white/80" />
                    </button>
                </div>
            </div>
        </div>
    );
}
