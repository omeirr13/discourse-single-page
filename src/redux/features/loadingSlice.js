// Redux slice (loadingSlice.js)
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: {
    react: {},
    solution: {},
    bookmark: {},
    auth: {},
  },
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setIndiLoading(state, action) {
      const { actionType, postId, value } = action.payload;
      if (!state.loading[actionType]) {
        state.loading[actionType] = {};
      }
      state.loading[actionType][postId] = value;
    },
  },
});

export const { setIndiLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
