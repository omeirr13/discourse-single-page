import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [
    //   {
    //   id: 1,
    //   value: "واحد",
    //   label: "واحد",
    // },
    // {
    //   id: 2,
    //   value: "اثنان",
    //   label: "اثنان",
    // },
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

export const fetchCategories = () => async (dispatch) => {
  try {
    dispatch(setLoading());
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/categories.json`,{
      headers: {
          'Api-Key': `${process.env.REACT_APP_API_KEY}`,
          'Api-Username': `${process.env.REACT_APP_API_USERNAME}`,
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

    // AUTO LOGIN DISCOURSE CODE -------------------------

  // const response = await fetch(`${process.env.REACT_APP_API_URL}/session`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Api-Key': `${process.env.REACT_APP_API_KEY}`,
  //     'Api-Username': `${process.env.REACT_APP_API_USERNAME}`,
  //   },
  //   body: JSON.stringify({
  //     login: `${process.env.REACT_APP_API_USERNAME}`,// API username
  //     password: 'ashar11223344', // Admin password (used for session creation)
  //   }),
  //   credentials: 'include', // Ensure cookies are included in the request
  // });

  // console.log("cat response coming...");
  // console.log(response);

  // if (!response.ok) {
  //   throw new Error('Failed to log in to Discourse.');
  // }

  // window.location.href = `http://localhost:4200/admin`;

  // END AUTO LOGIN DISCOURSE CODE ------------------------------
    
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export default categoriesSlice.reducer;
