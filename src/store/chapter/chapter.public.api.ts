import { Env } from "@/config/Env";
import { ExtendedParameterGetListBookType, IGetListChapterBookType } from "./chapter.type";
import { GetChaptersAdvancedProps } from "@/services/chapter.services";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { cleanAndSerializeQueryParams } from "@/utils/cleanAndSerializeQueryParams";

export const chapterApi = createApi({
    reducerPath: "chapterApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${Env.NEXT_PUBLIC_API_URL}/api` }),
    tagTypes: ["ListChapterAdvanced"],
    endpoints: () => ({}),
});

export const chapterPublicApi = chapterApi.injectEndpoints({
    endpoints: (builder) => ({
        getListChapterAdvancedByBookId: builder.query<
            IGetListChapterBookType,
            { bookId: number; query?: ExtendedParameterGetListBookType }
        >({
            query: ({ bookId, query }) => {
                const newParams = cleanAndSerializeQueryParams({
                    ...query,
                });
                return `/chapters/${bookId}?${newParams}`;
            },
            providesTags: (result, error, arg) => [{ type: "ListChapterAdvanced" as const, id: arg.bookId }]
        }),
    }),
    overrideExisting: false,
});

export const { useGetListChapterAdvancedByBookIdQuery } = chapterPublicApi;
