import axios from "axios";
import { CloudImageEnum } from "@/components/Share/CloudImage";
import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

export const enum IMethodImport {
    MANUAL = "MANUAL",
    FROM_URL = "FROM_URL",
    FROM_EXTERNAL_SOURCE = "FROM_EXTERNAL_SOURCE",
}

export const optionsImportData = [
    { id: IMethodImport.MANUAL, title: "Tạo thủ công" },
    { id: IMethodImport.FROM_URL, title: "Thêm từ nguồn" },
];

export const optionsLanguageData = [
    { id: 0, source: "en", name: "Tiếng Anh" },
    { id: 1, source: "zh", name: "Tiếng Trung Quốc" },
    { id: 2, source: "ko", name: "Tiếng Hàn Quốc" },
    { id: 3, source: "ja", name: "Tiếng Nhật Bản" },
];

export const enum ChapterStepEnum {
    "IDLE" = "IDLE",
    "MERGING_FILES" = "MERGING_FILES",
    "ENCRYPTING" = "ENCRYPTING",
    "UPLOADING" = "UPLOADING",
    "CREATING_CHAPTER" = "CREATING_CHAPTER",

    // OTHER
    "TRANSLATE" = "TRANSLATE",
    "LOAD_IMAGE" = "LOAD_IMAGE",
}

export const enum StepStatusEnum {
    "PENDING" = "PENDING",
    "PROCESSING" = "PROCESSING",
    "DONE" = "DONE",
    "FAILED" = "FAILED",
}

export interface IImageItem {
    id: string;
    name: string;
    // order: number;
    previewUrl: string | null;
    currentStep: ChapterStepEnum;
    stepStatus: StepStatusEnum;

    uploadProgress?: number;
    dataUpload?: Record<string, string>;

    metadata?: {
        order: number;
        width: number;
        height: number;
        drmData?: string;
        keySecure?: number;
        secureImageUrl?: Record<CloudImageEnum, string>;
    };
}

export interface ISettings {
    isMerge: boolean;
    isAddBanner: boolean;
    isShowImages: boolean;
    isAddWatermark: boolean;
}
export interface RootStateChapterSlide {
    chapterSlice: ChapterSliceProps;
}

export interface ChapterSliceProps {
    stepStatus: StepStatusEnum;
    items: IImageItem[];
    settings: ISettings;
    activeItem: {
        id: string;
        previewUrl: string | null;
    } | null;
}

const initialState: ChapterSliceProps = {
    stepStatus: StepStatusEnum.DONE,
    items: [],
    settings: {
        isMerge: false,
        isAddBanner: false,
        isShowImages: false,
        isAddWatermark: false,
    },
    activeItem: null,
};
export const chapterSlice = createSlice({
    name: "chapterSlice",
    initialState,
    reducers: {
        // ERROR

        // ACTIVE
        activeItem(
            state,
            action: PayloadAction<ChapterSliceProps["activeItem"]>
        ) {
            state.activeItem = null;
            state.activeItem = action.payload;
        },
        removeActiveItem(state) {
            state.activeItem = null;
        },
        sortItemsByName(state) {
            state.items = [...state.items].sort((a, b) =>
                a.name.localeCompare(b.name, "vi", { sensitivity: "base" })
            );
        },

        // Thêm 1 ảnh
        addImage(state, action: PayloadAction<IImageItem>) {
            state.items.push({
                id: action.payload.id,
                name: action.payload.name,
                // order: action.payload.order,
                previewUrl: action.payload.previewUrl,
                stepStatus: action.payload.stepStatus,
                currentStep: action.payload.currentStep,
            });
        },

        addItems(
            state,
            action: PayloadAction<{
                items: Array<IImageItem>;
                position: "prepend" | "append" | "before" | "after";
                targetId?: string;
            }>
        ) {
            const { items, position = "append", targetId } = action.payload;

            if (position === "prepend") {
                state.items.unshift(...items);
            } else if (position === "append") {
                state.items.push(...items);
            } else if (position === "before" || position === "after") {
                const index = state.items.findIndex(
                    (img) => img.id === targetId
                );
                if (index !== -1) {
                    const insertAt = position === "before" ? index : index + 1;
                    state.items.splice(insertAt, 0, ...items);
                } else {
                    // state.items.push(...items);
                }
            }

            // items.forEach((item) => URL.revokeObjectURL(item?.previewUrl));
        },

        // Cập nhật ảnh
        updateItem(state, action: PayloadAction<Partial<IImageItem>>) {
            const targetIndex = state.items.findIndex(
                (img) => img.id === action.payload.id
            );
            if (targetIndex !== -1) {
                state.items[targetIndex] = {
                    ...state.items[targetIndex],
                    ...action.payload,
                };
            }
        },

        // Xoá ảnh
        removeItem(state, action: PayloadAction<Pick<IImageItem, "id">>) {
            state.items = state.items.filter(
                (img) => img.id !== action.payload.id
            );
        },
        removeItemList(state, action: PayloadAction<string[]>) {
            state.items = state.items.filter(
                (img) => !action.payload.includes(img.id)
            );
        },

        // Reset toàn bộ
        clearItems(state) {
            const clonedItems = state.items.slice();
            clonedItems.forEach((item) => {
                if (item?.previewUrl) URL.revokeObjectURL(item?.previewUrl);
            });
            state.items = [];
        },

        resetChapter(state) {
            const clonedItems = state.items.slice();
            clonedItems.forEach((item) => {
                if (item?.previewUrl) URL.revokeObjectURL(item?.previewUrl);
            });
            return initialState;
        },

        // Thay đổi status
        updateStepItem(
            state,
            action: PayloadAction<{
                id: string;
                stepStatus: IImageItem["stepStatus"];
                currentStep: IImageItem["currentStep"];
            }>
        ) {
            const target = state.items.find(
                (img) => img.id === action.payload.id
            );
            if (target) {
                target.currentStep = action.payload.currentStep;
                target.stepStatus = action.payload.stepStatus;
            }
        },

        // Thay đổi status Chapter
        updateStepChapter(
            state,
            action: PayloadAction<{
                stepStatus: ChapterSliceProps["stepStatus"];
            }>
        ) {
            state.stepStatus = action.payload.stepStatus;
        },

        // Thêm metadata
        addMetadataItem: (
            state,
            action: PayloadAction<Pick<IImageItem, "id" | "metadata">>
        ) => {
            const target = state.items.find(
                (img) => img.id === action.payload.id
            );
            if (target) target.metadata = action.payload.metadata;
        },
        updateMetadataItem: (
            state,
            action: PayloadAction<{
                id: IImageItem["id"];
                metadata: Partial<IImageItem["metadata"]>;
            }>
        ) => {
            const target = state.items.find(
                (img) => img.id === action.payload.id
            );
            if (target && target?.metadata) {
                target.metadata = {
                    ...target.metadata,
                    ...action.payload.metadata,
                };
            }
        },
        updateSetting: (state, action: PayloadAction<Partial<ISettings>>) => {
            state.settings = {
                ...state.settings,
                ...action.payload,
            };
        },

        // Kéo thả item
        reorderItems: (
            state,
            action: PayloadAction<{ oldIndex: number; newIndex: number }>
        ) => {
            const { oldIndex, newIndex } = action.payload;
            if (
                oldIndex >= 0 &&
                oldIndex < state.items.length &&
                newIndex >= 0 &&
                newIndex < state.items.length
            ) {
                const movedItem = state.items.splice(oldIndex, 1)[0];
                state.items.splice(newIndex, 0, movedItem);
            }
        },

        setItems: (state, action: PayloadAction<typeof state.items>) => {
            state.items = action.payload;
        },
    },
    // extraReducers: (builder) => {
    //     builder
    //         .addCase(uploadImage.pending, (state, action) => {
    //             const target = state.images.find(
    //                 (img) => img.id === action.meta.arg.id
    //             );
    //             if (target) target.uploadStatus = UploadStatusEnum.PROCESSING;
    //         })
    //         .addCase(uploadImage.fulfilled, (state, action) => {
    //             const target = state.images.find(
    //                 (img) => img.id === action.payload.id
    //             );
    //             if (target) target.uploadStatus = UploadStatusEnum.SUCCESS;
    //         })
    //         .addCase(uploadImage.rejected, (state, action) => {
    //             const target = state.images.find(
    //                 (img) => img.id === action.meta.arg.id
    //             );
    //             if (target) target.uploadStatus = UploadStatusEnum.ERROR;
    //         });
    // },
});

export const {
    activeItem,
    addImage,
    addItems,
    clearItems,
    updateItem,
    removeItemList,
    removeItem,
    resetChapter,
    reorderItems,
    updateSetting,
    sortItemsByName,
    addMetadataItem,
    removeActiveItem,
    updateMetadataItem,
    updateStepItem,
    updateStepChapter,
    setItems,
} = chapterSlice.actions;

export default chapterSlice.reducer;
