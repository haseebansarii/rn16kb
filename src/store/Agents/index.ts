import {PayloadAction, createSlice} from '@reduxjs/toolkit';

const initialState: AgentsState = {
  agentsData: [],
};

const slice = createSlice({
  name: 'agents',
  initialState,
  reducers: {
    setAgentsData: (state: AgentsState, action: PayloadAction<any>) => {
      state.agentsData = action.payload;
    },
  },
});

export const {setAgentsData} = slice.actions;

export default slice.reducer;

export type AgentsState = {
  agentsData: object;
};
