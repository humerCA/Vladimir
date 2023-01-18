import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import sidebarReducer from "../StateManagement/sidebar"

export const store =  configureStore({
    reducer: {
        sidebar : sidebarReducer,
        
    },

    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({serializableCheck: false,}).concat([]),
})

setupListeners(store.dispatch)