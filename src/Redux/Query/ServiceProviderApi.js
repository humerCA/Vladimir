import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const serviceProviderApi = createApi({
    reducerPath: 'serviceProviderApi',
    tagTypes: ["ServiceProvider"],
    

    baseQuery: fetchBaseQuery({
        baseUrl: "http://127.0.0.1:8000/api",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token')

            headers.set('Authorization', `Bearer ${token}`)
            return headers
        }
    }),

    endpoints: (builder) => ({
        getServiceProvidersApi: builder.query ({
            query: (params) => `/service-providers/search?search=${params.search}&page=${params.page}&limit=${params.limit}&status=${params.status}`,
            providesTags: ["ServiceProvider"]
        }),

        getServiceProviderApi: builder.query ({
            query: (id) => `/service-provider/${id}`,
        }),
        
        postServiceProviderStatusApi: builder.mutation({
            query: ({id, status}) => ({
                url: `/service-provider/archived-service-provider/${id}`,
                method: "PUT",
                body: {
                    status: status
                }
            }),
            invalidatesTags:  ["ServiceProvider"]
        }),

        postServiceProviderApi: builder.mutation({
            query: (data) => ({
                url: `/service-provider/`,
                method: "POST",
                body: data
            }),
            invalidatesTags:  ["ServiceProvider"]
        }),

        updateServiceProviderApi: builder.mutation({
            query: ({id, ...data}) => ({
                url: `/service-provider/${id}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags:  ["ServiceProvider"]
        }),
    }),
})

export const { useGetServiceProvidersApiQuery, useGetServiceProviderApiQuery, usePostServiceProviderStatusApiMutation, usePostServiceProviderApiMutation, useUpdateServiceProviderApiMutation} = serviceProviderApi