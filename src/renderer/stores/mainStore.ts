import { createSlice } from "@reduxjs/toolkit";

const slicer = createSlice({
  name: 'main',
  initialState: {
    tab: 1,
  },
  reducers: {
    setTab: (state, action) => {
      state.tab = action.payload;
    }
  },
});

const { reducer, actions } = slicer

export const { setTab } = actions;
export default reducer;
