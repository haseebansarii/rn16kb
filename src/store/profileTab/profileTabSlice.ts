import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {userReportsSliceProps} from './types';

const initialState: userReportsSliceProps = {
  userReports: {
    total: 0,
    isell: 0,
    sold: 0,
    ibuy: 0,
    bids_iwon: 0,
    bids_ilost: 0,
    total_sales: 0,
    local_sales: 0,
    international_sales: 0,
  },
  productsReport: [],
};

export const profileTabSlice = createSlice({
  name: 'reportsUser',
  initialState,
  reducers: {
    storeUserReports: (
      state: userReportsSliceProps,
      action: PayloadAction<string>,
    ) => {
      state.userReports = action.payload;
    },
    setProductsReport: (state, action) => {
      state.productsReport = action.payload;
    },
  },
});

export const {storeUserReports, setProductsReport} = profileTabSlice.actions;

export default profileTabSlice.reducer;
