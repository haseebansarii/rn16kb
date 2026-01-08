import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {AuthSliceProps} from './types';

const initialState: AuthSliceProps = {
  token: null,
  user_data: {},
  user_permissions: {},
  isell_stack: null,
  guest: false,
  image_uploading: false,
  isAppUpdate: false,
  mobileSettings: [],
};

export const authSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    storeToken: (state: AuthSliceProps, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setUserData: (state: AuthSliceProps, action: PayloadAction<any>) => {
      state.user_data = action.payload;
    },
    ISellStack: (state: AuthSliceProps, action: PayloadAction<any>) => {
      state.isell_stack = action.payload;
    },
    setGuest: (state: AuthSliceProps, action: PayloadAction<boolean>) => {
      state.guest = action.payload;
    },
    logoutUser: () => ({...initialState}),
    imageUploading: (state: AuthSliceProps, action: PayloadAction<boolean>) => {
      state.image_uploading = action.payload;
    },
    setIsAppUpdate: (state, {payload}) => {
      state.isAppUpdate = payload;
    },
    storeMobileSettings: (state, action) => {
      state.mobileSettings = action.payload;
    },
    storeUserCheckPermissons: (state, action) => {
      state.user_permissions = action.payload;
    },
  },
});

export const {
  storeToken,
  setGuest,
  setUserData,
  imageUploading,
  ISellStack,
  logoutUser,
  setIsAppUpdate,
  storeMobileSettings,
  storeUserCheckPermissons,
} = authSlice.actions;

export default authSlice.reducer;
