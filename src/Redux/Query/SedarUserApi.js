import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const sedarUsersApi = createApi({
    reducerPath: 'sedarUsersApi',
    tagTypes: ["User"],
    
    baseQuery: fetchBaseQuery({
        baseUrl: "http://rdfsedar.com/api",
        prepareHeaders: (headers) => {
            const token = process.env.SEDAR_KEY

            headers.set('Authorization', `Bearer ${token}`)
            return headers
        }
    }),

    endpoints: (builder) => ({
        getSedarUsersApi: builder.query ({
            query: () => `/data/employees`,
            transformResponse: (response) => response.data,
            providesTags: ["User"]
        }),
    }),
})


export const { useGetSedarUsersApiQuery } = sedarUsersApi
