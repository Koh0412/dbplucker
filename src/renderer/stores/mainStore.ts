import { createSlice } from "@reduxjs/toolkit";

const slicer = createSlice({
  name: 'main',
  initialState: {
    tab: 1,
    dblistWidth: 300,
  },
  reducers: {
    setTab: (state, action) => {
      state.tab = action.payload;
    },
    setDblistWidth: (state, action) => {
      state.dblistWidth = action.payload;
    }
  },
});

const { reducer, actions } = slicer

export const { setTab, setDblistWidth } = actions;
export default reducer;
