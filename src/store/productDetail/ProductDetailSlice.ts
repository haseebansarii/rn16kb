import {PayloadAction, createSlice} from '@reduxjs/toolkit';

const initialState: any = {
  buying_type: null,
  selected_product: {},
  offered_product: null,
};

export const authSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    buyingType: (state: any, action: PayloadAction<string | null>) => {
      state.buying_type = action.payload;
    },
    selectedProduct: (state: any, action: PayloadAction<string | null>) => {
      state.selected_product = action.payload;
    },
    offeredProduct: (state: any, action: PayloadAction<any>) => {
      state.offered_product = action.payload;
    },
  },
});

export const {buyingType, selectedProduct, offeredProduct} = authSlice.actions;

export default authSlice.reducer;
