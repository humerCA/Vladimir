import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const userAccountsApi = createApi({
    reducerPath: 'userAccountsApi',
    
    baseQuery: fetchBaseQuery({
        baseUrl: "http://10.10.10.4:8000/api/",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token')

            headers.set('Authorization', `Bearer ${token}`)
            return headers
        }
    }),
    endpoints: (builder) => ({
        getUserAccountsApi: builder.query ({
            query: (params) => `admin/user-accounts?search=${params.search}&page=${params.page}&limit=${params.limit}&status=${params.status}`,
            keepUnusedDataFor: 0
        }),
        getUserAccountApi: builder.query ({
            query: (id) => `/admin/getuserbyid?id=${id}`,
            transformResponse: (response, meta, arg) => response.user,
            keepUnusedDataFor: 0
        }),

    }),
})

export const { useGetUserAccountsApiQuery, useGetUserAccountApiQuery } = userAccountsApi