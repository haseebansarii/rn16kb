import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {TChats} from './type';

const initialState: TChats = {
  allUserChats: [{}],
  messages: [{}],
  all_messages: [],
};

export const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setAllUserChats: (state, action: PayloadAction<[object]>) => {
      state.allUserChats = action.payload;
    },
    setAllUserMessages: (state, action: PayloadAction<[object]>) => {
      state.messages = action.payload;
    },
    allMessages: (state, action: PayloadAction<any>) => {
      state.all_messages = action.payload;
    },
  },
});

export const {setAllUserChats, setAllUserMessages, allMessages} =
  chatsSlice.actions;

export default chatsSlice.reducer;
