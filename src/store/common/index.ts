import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {COMMON} from './types';

const initialState: COMMON = {
  appLoading: false,
  // shouldLoaderStart: true,
};

export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setLoading: (state: COMMON, action: PayloadAction<boolean>) => {
      state.appLoading = action.payload;
    },
    // setShouldLoaderStart: (state: COMMON, action: PayloadAction<boolean>) => {
    //   state.shouldLoaderStart = action.payload;
    // },
  },
});

export const {
  setLoading,
  //setShouldLoaderStart
} = commonSlice.actions;

export default commonSlice.reducer;
