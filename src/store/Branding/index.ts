import {PayloadAction, createSlice} from '@reduxjs/toolkit';

const initialState: BrandingState = {
  brandingData: {},
};

const slice = createSlice({
  name: 'branding',
  initialState,
  reducers: {
    setBrandingData: (state: BrandingState, action: PayloadAction<any>) => {
      state.brandingData = action.payload;
    },
  },
});

export const {setBrandingData} = slice.actions;

export default slice.reducer;

export type BrandingState = {
  brandingData: object;
};
