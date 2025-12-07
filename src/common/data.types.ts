export interface IMetaPage {
    pageCount: number;
    totalCount: number;
    isLastPage: boolean;
    currentPage: number;
    isFirstPage: boolean;
    nextPage: number | null;
    previousPage: number | null;
}

export enum ContentPageEnum {
    // BOOK
    'manga' = 'manga',
    'comics' = 'comics',
}
