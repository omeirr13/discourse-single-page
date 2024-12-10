import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [
  ],
    status: 'idle',
    error: null,
  },
  reducers: {
    setLoading: (state) => {
      state.status = 'loading';
    },
    setCategories: (state, action) => {
      state.status = 'succeeded';
      state.categories = action.payload;
    },
    setError: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
  },
});

export const { setLoading, setCategories, setError } = categoriesSlice.actions;

export const fetchCategories = (is_include_subcategories=false) => async (dispatch) => {
  try {
    dispatch(setLoading());

    const userObj = localStorage.getItem("salla_discourse_user");
    const user = JSON.parse(userObj);
    let username = process.env.REACT_APP_API_USERNAME;
    if(user){
        username = user.username;
    }
    let url = `${process.env.REACT_APP_API_URL}/categories.json`;
    if(is_include_subcategories){
      url = `${process.env.REACT_APP_API_URL}/categories.json?include_subcategories=true`;
    }

    const response = await axios.get(url,{
      headers: {
          'Api-Key': `${process.env.REACT_APP_API_KEY}`,
          'Api-Username': username,
          'Content-Type': 'application/json'
      }
  });

    const filteredCategories = response.data.category_list.categories.filter(
      (category) => category.id !== 3 && category.id !== 4
    );
    const categories = filteredCategories.sort(
      (a, b) => (a.subcategory_count === null ? -1 : 1)
    );

    dispatch(setCategories(categories));
    
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export default categoriesSlice.reducer;
