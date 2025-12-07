import { instanceAxios } from "@/config/axios"
import { cleanAndSerializeQueryParams } from "@/utils/cleanAndSerializeQueryParams";
import { AddMemberBookContributorBookParameterType, AddMemberBookContributorBookResType, CreateBookParameterType, CreateBookResType, GetDataPendingInvitationsBookContriutorResType, GetDetailBookCreatorParameterType, GetDetailBookCreatorResType, GetListTagsBookParameterType, GetListTagsBookResType, IBookListType, IGetListBookType, IParamsGetListBookType, JoinBookContributorParameterType, JoinBookContributorResType, OutMemberBookContributorBookParameterType, OutMemberBookContributorBookResType, UpdateBookParameterType, UpdateBookResType } from './book.type';
import { Env } from "@/config/Env";

const pathnameBooks = '/api/books';
const pathnameCreatorBooks = '/api/creator/books';
const pathnameContributorCreatorBooks = '/api/creator/books/contributor';

// Create Book

export const createBookApi = (params: CreateBookParameterType): Promise<CreateBookResType> => {
    return instanceAxios.post(`${pathnameCreatorBooks}/create/manual`, params);
}

// Update Book

export const updateBookApi = (params: UpdateBookParameterType): Promise<UpdateBookResType> => {
    return instanceAxios.put(`${pathnameCreatorBooks}/info`, params);
}

// CREATOR

export const getDetailBookCreatorApi = ({ bookId }: GetDetailBookCreatorParameterType): Promise<GetDetailBookCreatorResType> => {
    return instanceAxios.get(`${pathnameCreatorBooks}/${bookId}`);
}

export const getListTagsBookApi = async ({
    options,
    cache,
    revalidate,
}:{
    options: GetListTagsBookParameterType,
    revalidate?: number;
    cache?: RequestCache;
}): Promise<GetListTagsBookResType> => {
    const newParams = cleanAndSerializeQueryParams(options);

    const bookRes = await fetch(
        `${Env.NEXT_PUBLIC_API_URL}/api/books/tags/list?${newParams}`,
        {
            method: "GET",
            cache: cache,
            next: {
                revalidate: revalidate,
            },
        }
    );
    const data = await bookRes.json();
    return data;
}

// Contributor

export const addMemberContributorBookApi = (params: AddMemberBookContributorBookParameterType): Promise<AddMemberBookContributorBookResType> => {
    return instanceAxios.post(`${pathnameContributorCreatorBooks}/add-member`, params);
}

export const outMemberContributorBookApi = (params: OutMemberBookContributorBookParameterType): Promise<OutMemberBookContributorBookResType> => {
    return instanceAxios.post(`${pathnameContributorCreatorBooks}/out-member`, params);
}

export const getPendingInvitationsBookContributorApi = (): Promise<GetDataPendingInvitationsBookContriutorResType> => {
    return instanceAxios.get(`${pathnameContributorCreatorBooks}/invitations`);
}

export const confirmJoinContributorBookApi = (params: JoinBookContributorParameterType): Promise<JoinBookContributorResType> => {
    return instanceAxios.post(`${pathnameContributorCreatorBooks}/confirm-join-member`, params);
}
export const confirmRejectContributorBookApi = (params: JoinBookContributorParameterType): Promise<JoinBookContributorResType> => {
    return instanceAxios.post(`${pathnameContributorCreatorBooks}/reject-join-member`, params);
}

export const getListBookFeaturedApi = async (
    data: IParamsGetListBookType
): Promise<IGetListBookType> => {
    const newParams = cleanAndSerializeQueryParams({
        ...data?.data?.query,
    });

    const url = "api/books/top/featured";
    const dataRes = await fetch(
        `${Env.NEXT_PUBLIC_API_URL}/${url}?${newParams}`,
        {
            cache: data?.options?.cache,
            next: { revalidate: data?.options.revalidate },
        }
    );

    return await dataRes.json();
};
