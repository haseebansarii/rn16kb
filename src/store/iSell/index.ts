import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  productOffers: [],
};

export const slice = createSlice({
  name: 'productOffer',
  initialState,
  reducers: {
    setProductOffer: (state, action) => {
      state.productOffers = action.payload;
    },
    setClearProductOffer: (state, action) => {
      state.productOffers = [];
    },
  },
});

export const {setProductOffer, setClearProductOffer} = slice.actions;

export default slice.reducer;
