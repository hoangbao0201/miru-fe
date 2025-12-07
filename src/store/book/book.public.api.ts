
import { Env } from "@/config/Env";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IGetListCoverPosterBookType } from "./book.type";

export const bookApi  = createApi({
    reducerPath: "bookApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${Env.NEXT_PUBLIC_API_URL}/api` }),
    tagTypes: ["CoverPosterBook"],
    endpoints: () => ({}),
});

export const bookPublicApi = bookApi.injectEndpoints({
    endpoints: (builder) => ({
        getListCoverPosterByBookId: builder.query<IGetListCoverPosterBookType, number>({
            query: (bookId: number) => `/books/${bookId}/images`,
            providesTags: (result, error, bookId) =>
                result ? [{ type: "CoverPosterBook" as const, id: bookId }] : [{ type: "CoverPosterBook" as const }],
        }),
    }),
    overrideExisting: false,
});

export const { useGetListCoverPosterByBookIdQuery } = bookPublicApi;
