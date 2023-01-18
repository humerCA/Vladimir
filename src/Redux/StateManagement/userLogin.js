import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
    name: 'token',
    initialState: {
        token: localStorage.getItem("token"),
    },
    reducers: {
        removeToken: (state) => {
            state.token = null;
        },
        addToken: (state, action) => {
        state.token = action.payload.token;
        },
    }

})

export const { removeToken, addToken } = counterSlice.actions
export default counterSlice.reducer