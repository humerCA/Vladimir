import { createSlice } from '@reduxjs/toolkit'

export const confirmSlice = createSlice({
    name: 'confirm',
    initialState: {
        open: false,
        icon: null,
        iconProps: null,
        message: 'Are you sure you want to',
        onConfirm: () => {}
    },
    reducers: {
        openConfirm: (state, action) => {
            state.open = true;
            state.icon = action.payload.icon;
            state.iconProps = action.payload.iconProps;
            state.message = action.payload.message;
            state.onConfirm= action.payload.onConfirm;
        },
        closeConfirm: (state) => {
            // state.icon = null;
            // state.iconProps = null;
            // state.message = '';
            state.onConfirm= () => {};
            state.open = false;
        },
    }

})

export const { openConfirm, closeConfirm } = confirmSlice.actions
export default confirmSlice.reducer