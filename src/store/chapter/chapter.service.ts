import { instanceAxios } from "@/config/axios";
import { removeNullOrEmptyValues } from "@/utils/removeNullOrEmptyValues";

const pathnameCreatorChapters = '/api/creator/chapters';

export interface IUpdateChapterInfoByDataType {
    bookId: number;
    chapterNumber: number;
    num?: string;
    title?: string;
    originalLink?: string;
}
export interface IUpdateChapterInfoByDataResType {
    success: boolean;
}
export const updateChapterInfoByData = (
    data: IUpdateChapterInfoByDataType
): Promise<IUpdateChapterInfoByDataResType> => {
    const newsBody = removeNullOrEmptyValues(data);
    return instanceAxios.put(`${pathnameCreatorChapters}/update/info/by-data`, newsBody);
};