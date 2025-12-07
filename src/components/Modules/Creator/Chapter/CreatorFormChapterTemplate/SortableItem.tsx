import React, { ChangeEvent, Dispatch, memo } from "react";
import { useSortable } from "@dnd-kit/sortable";

import ItemImage from "./ItemImage";
import { CSS } from "@dnd-kit/utilities";
import { IImageItem, ISettings } from "@/store/chapter/chapter.reducer";

interface SortableItemProps {
    item: IImageItem;
    settings: ISettings;
    handleTranslate: Dispatch<string>;
    handleRemoveItem: Dispatch<string>;
    handleImportInputPrev: (e: ChangeEvent<HTMLInputElement>, indexImportPrev: string) => void;
}

const SortableItemComponent = ({
    item,
    settings,
    handleTranslate,
    handleRemoveItem,
    handleImportInputPrev,
}: SortableItemProps) => {
    const {
        isDragging,
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition || undefined,
    };

    return (
        <ItemImage
            item={item}
            style={style}
            ref={setNodeRef}
            settings={settings}
            isOverlay={false}
            isDragging={isDragging}
            dragListeners={listeners}
            dragAttributes={attributes}
            handleTranslate={handleTranslate}
            handleRemoveItem={handleRemoveItem}
            handleImportInputPrev={handleImportInputPrev}
        />
    );
};

const arePropsEqual = (prev: SortableItemProps, next: SortableItemProps) =>
    prev.item === next.item &&
    prev.settings === next.settings &&
    prev.handleTranslate === next.handleTranslate &&
    prev.handleRemoveItem === next.handleRemoveItem &&
    prev.handleImportInputPrev === next.handleImportInputPrev;

export default memo(SortableItemComponent, arePropsEqual);
