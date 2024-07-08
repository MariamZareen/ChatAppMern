
//store.js


import { configureStore } from '@reduxjs/toolkit';
import themeSliceReducer from './themeSlice';

// Configure the store with the theme slice reducer
export const store = configureStore({
   reducer: {
      themeKey: themeSliceReducer,
   },
});


//themeslice.js

import { createSlice } from '@reduxjs/toolkit';

export const themeSlice = createSlice({
    name: 'themeSlice',
    initialState: true,
    reducers: {
        toggleTheme: (state) => {
            return !state; // Return the new state
        },
    },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
