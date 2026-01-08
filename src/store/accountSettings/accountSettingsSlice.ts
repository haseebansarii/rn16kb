import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {accountSettingsSliceProps} from './types';

const initialState: any = {
  subscription_plans: [],
};

export const accountSettingsSlice = createSlice({
  name: 'accountSettings',
  initialState,
  reducers: {
    storeSubscriptionPlansAccount: (
      state: accountSettingsSliceProps,
      action: PayloadAction<string>,
    ) => {
      state.subscription_plans = action.payload;
    },
  },
});

export const {storeSubscriptionPlansAccount} = accountSettingsSlice.actions;

export default accountSettingsSlice.reducer;
