import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from './features/categoriesSlice';
import postsReducer from './features/postsSlice';
import topicsReducer from './features/topicsSlice';
// import storage from 'redux-persist/lib/storage';

// const persistConfig = {
//   key: 'root',
//   storage
// };

export const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    posts: postsReducer,
    topics: topicsReducer
  },
});

export default store;