// Redux slice (loadingSlice.js)
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: {}, // An object to store multiple loading states
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setLoading(state, action) {
      const { key, value } = action.payload;
      state.loading[key] = value;
    },
  },
});

export const { setLoading } = loadingSlice.actions;

export default loadingSlice.reducer;
