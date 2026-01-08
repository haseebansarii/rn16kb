import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StackSliceProps } from './types';

const initialState: StackSliceProps = {
  current_stack: null,
  fix_bottom_tab: true,
};

export const stackSlice = createSlice({
  name: 'stack',
  initialState,
  reducers: {
    currentStack: (state: StackSliceProps, action: PayloadAction<any>) => {
      state.current_stack = action.payload;
    },
    fixBottomTab: (state: StackSliceProps, action: PayloadAction<boolean>) => {
      state.fix_bottom_tab = action.payload;
    },
  },
});

export const { currentStack, fixBottomTab } = stackSlice.actions;

export default stackSlice.reducer;
