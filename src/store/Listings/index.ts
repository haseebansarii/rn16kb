import {PayloadAction, createSlice} from '@reduxjs/toolkit';

const initialState: listState = {
  listData: {items: []},
  listDataIbuy: {items: []},
  listDataUser: {items: []},
  listDataExtra: {items: []},
  listFilters: [],
  selectedProductData: [],
  addNoteOfSelectedProduct: {},
  edit_single_listing_data: null,
};

const slice = createSlice({
  name: 'list',
  initialState,
  reducers: {
    setlistData: (state: listState, action: PayloadAction<any>) => {
      state.listData = action.payload;
    },
    setlistDataIbuy: (state: listState, action: PayloadAction<any>) => {
      state.listDataIbuy = action.payload;
    },
    setlistDataUser: (state: listState, action: PayloadAction<any>) => {
      state.listDataUser = action.payload;
    },
    setlistDataExtra: (state: listState, action: PayloadAction<any>) => {
      state.listData = action.payload;
    },
    setSelectedProductData: (state: listState, action: PayloadAction<any>) => {
      state.selectedProductData = action.payload;
    },
    setAddNoteOfSelectedProduct: (
      state: listState,
      action: PayloadAction<any>,
    ) => {
      state.addNoteOfSelectedProduct = action.payload;
    },
    editSingleListingData: (state: listState, action: PayloadAction<any>) => {
      state.edit_single_listing_data = action.payload;
    },
    setlistFilters: (state: listState, action: PayloadAction<any>) => {
      state.listFilters = action.payload;
    },
  },
});

export const {
  setlistData,
  setlistDataIbuy,
  setlistDataUser,
  setlistDataExtra,
  setAddNoteOfSelectedProduct,
  setSelectedProductData,
  editSingleListingData,
  setlistFilters,
} = slice.actions;

export default slice.reducer;

export type listState = {
  listData: object;
  listDataExtra: object;
  listDataIbuy: object;
  listDataUser: any;
  listFilters: any[];
  selectedProductData: any[];
  addNoteOfSelectedProduct: object;
  edit_single_listing_data?: any;
};
