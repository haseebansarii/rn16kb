import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {TCatagorySlice} from './types';

const initialState: TCatagorySlice = {
  categories: [],
  subCategories: [],
  sub_category_list: [],
};

export const catagorySlice = createSlice({
  name: 'catagories',
  initialState,
  reducers: {
    setCatagory: (state, action: PayloadAction<[object]>) => {
      state.categories = action.payload;
    },
    setSubCatagory: (state, action: PayloadAction<[object]>) => {
      state.subCategories = action.payload;
    },
    subCategoryList: (state, action: PayloadAction<any>) => {
      console.log(action);
      state.sub_category_list.push(action?.payload);
    },
    clearCategoryList: (state, action) => {
      state.sub_category_list = [];
    },
  },
});

export const {setCatagory, setSubCatagory, clearCategoryList, subCategoryList} =
  catagorySlice.actions;

export default catagorySlice.reducer;
