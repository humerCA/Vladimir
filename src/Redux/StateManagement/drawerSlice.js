import { createSlice } from '@reduxjs/toolkit'

export const drawerSlice = createSlice({
    name: 'drawer',
    initialState: false,
    
    
    reducers: {
        openDrawer: (state, action) => {
            return true;
            
        },
        closeDrawer: (state) => {
            return false;
        },
    }

})

export const { openDrawer, closeDrawer } = drawerSlice.actions
export default drawerSlice.reducer