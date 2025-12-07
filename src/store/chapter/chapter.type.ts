import { ContentPageEnum } from "@/common/data.types";
import { MetaPagination, ParameterGet } from "@/constants/type";

export enum UploadStatusEnum {
    IDLE = "IDLE",
    PROCESSING = "PROCESSING",
    SUCCESS = "SUCCESS",
    ERROR = "ERROR",
}

export type ItemImage = {
    id: string;
    file: File;
    previewUrl: string;
    encodedImageUrl: string | null;
    uploadStatus: UploadStatusEnum;
};

export type CreatorChapterStateReducer = {
    items: ItemImage[];
    load: boolean;
    error: string;
};

// ListChapterBookT
export interface ExtendedParameterGetListBookType extends ParameterGet {
    // category?: ContentPageEnum;
}
export interface IListChapterBookType {
    num: string;
    title: string;
    viewsCount: number;
    chapterNumber: number;
    thumbnail: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface IGetListChapterBookType {
    success: boolean;
    chapters: IListChapterBookType[];
    data: {
        chapters: IListChapterBookType[];
        meta: MetaPagination;
    };
}