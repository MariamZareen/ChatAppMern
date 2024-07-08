import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../Features/themeSlice';
import conversationReducer from '../Features/conversationSlice';
import sidebarReducer from '../Features/sidebarSlice';

export const store = configureStore({
  reducer: {
    themeKey: themeReducer,
    conversations: conversationReducer,
    sidebar: sidebarReducer,
  },
});

export default store;
