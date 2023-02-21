import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

// State Management
import sidebarReducer from "../StateManagement/sidebar"
import toastReducer from './toastSlice'
import confirmReducer from './confirmSlice'
import drawerReducer from './drawerSlice'

import userLoginReducer from "../StateManagement/userLogin"

// Query
import { modulesApi } from '../Query/ModulesApi'
import { userAccountsApi } from '../Query/UserAccountsApi'
import { serviceProviderApi } from '../Query/ServiceProviderApi'
import { sedarUsersApi } from '../Query/SedarUserApi'
import { majorCategoryApi } from '../Query/Category/MajorCategory'
import { minorCategoryApi } from '../Query/Category/MinorCategory'
import { categoryListApi } from '../Query/Category/CategoryList'
import { supplierApi } from '../Query/SupplierApi'
import { roleManagementApi } from '../Query/RoleManagementApi'

export const store =  configureStore({
    reducer: {
        sidebar : sidebarReducer,
        userLogin : userLoginReducer,
        toast: toastReducer, 
        confirm: confirmReducer, 
        drawer: drawerReducer,
        [modulesApi.reducerPath]: modulesApi.reducer,
        [userAccountsApi.reducerPath]: userAccountsApi.reducer,
        [sedarUsersApi.reducerPath]: sedarUsersApi.reducer,
        [serviceProviderApi.reducerPath]: serviceProviderApi.reducer,
        [majorCategoryApi.reducerPath]: majorCategoryApi.reducer,
        [minorCategoryApi.reducerPath]: minorCategoryApi.reducer,
        [categoryListApi.reducerPath]: categoryListApi.reducer,
        [supplierApi.reducerPath]: supplierApi.reducer,
        [roleManagementApi.reducerPath]: roleManagementApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({serializableCheck: false,}).concat([modulesApi.middleware, userAccountsApi.middleware, sedarUsersApi.middleware, serviceProviderApi.middleware, majorCategoryApi.middleware, minorCategoryApi.middleware, categoryListApi.middleware, supplierApi.middleware, roleManagementApi.middleware]),
})

setupListeners(store.dispatch)