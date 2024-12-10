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
    let url = `${process.env.REACT_APP_API_URL}/categories.json`;
    if(is_include_subcategories){
      url = `${process.env.REACT_APP_API_URL}/categories.json?include_subcategories=true`;
    }

    const response = await axios.get(url,{
      headers: {
          'Api-Key': `${process.env.REACT_APP_API_KEY}`,
          'Api-Username': user.username,
          'Content-Type': 'application/json'
      }
  });
    const categories = response.data.category_list.categories;
    dispatch(setCategories(categories.map((category) => ({
      ...category, 
      label: category.name, 
      value: category.name, 
      id: category.id
    }))));

    dispatch(setCategories(response.category_list.categories));
    
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export default categoriesSlice.reducer;
