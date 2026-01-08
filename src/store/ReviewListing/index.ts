import {PayloadAction, createSlice} from '@reduxjs/toolkit';

const initialState: reviewListState = {
  reviewListData: [],
};

const slice = createSlice({
  name: 'reviewListData',
  initialState,
  reducers: {
    setReviewListData: (state: reviewListState, action: PayloadAction<any>) => {
      state.reviewListData = action.payload;
    },
  },
});

export const {setReviewListData} = slice.actions;

export default slice.reducer;

export type reviewListState = {
  reviewListData: any[];
};
