import {PayloadAction, createSlice} from '@reduxjs/toolkit';

const initialState: userFeedBackDataState = {
  userFeedBackData: [],
};

const slice = createSlice({
  name: 'userFeedBackData',
  initialState,
  reducers: {
    setUserFeedBackData: (
      state: userFeedBackDataState,
      action: PayloadAction<any>,
    ) => {
      state.userFeedBackData = action.payload;
    },
  },
});

export const {setUserFeedBackData} = slice.actions;

export default slice.reducer;

export type userFeedBackDataState = {
  userFeedBackData: any[];
};
