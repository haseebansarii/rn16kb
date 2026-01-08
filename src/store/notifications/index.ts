import {PayloadAction, createSlice} from '@reduxjs/toolkit';

const initialState: notificationsState = {
  allNotifications: [],
  unreadNotifications: [],
  unreadNotificationsCount: 0,
};

const slice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setAllNotifications: (
      state: notificationsState,
      action: PayloadAction<any>,
    ) => {
      state.allNotifications = action.payload;
    },
    setUnreadNotifications: (
      state: notificationsState,
      action: PayloadAction<any>,
    ) => {
      state.unreadNotifications = action.payload;
    },
    setUnreadNotificationsCount: (
      state: notificationsState,
      action: PayloadAction<any>,
    ) => {
      state.unreadNotificationsCount = action.payload;
    },
    clearAllNotifications: (
      state: notificationsState,
      action: PayloadAction<any>,
    ) => {
      state.allNotifications = action.payload?.emptyArray;
      setTimeout(() => {
        action.payload?.getData();
      }, 1000);
    },
  },
});

export const {
  setAllNotifications,
  setUnreadNotifications,
  setUnreadNotificationsCount,
  clearAllNotifications,
} = slice.actions;

export default slice.reducer;

export type notificationsState = {
  allNotifications: any[];
  unreadNotifications: any[];
  unreadNotificationsCount: any;
};
