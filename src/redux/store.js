import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from './features/categoriesSlice';
import postsReducer from './features/postsSlice';

export const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    posts: postsReducer
  },
});

export default store;