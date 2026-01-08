import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  carJam: {},
};

export const FormsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    setCarJam: (state, {payload}) => {
      state.carJam = payload;
    },
  },
});

export const {setCarJam} = FormsSlice.actions;

export default FormsSlice.reducer;
