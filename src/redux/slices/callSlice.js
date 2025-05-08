import {createSlice} from '@reduxjs/toolkit';

const initialState = {};

const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    callUser(state, action) {
      return {...action.payload};
    },
    calling(state, action) {
      return {
        ...state,
        calling: action.payload,
      };
    },
  },
});

export const {callUser, calling} = callSlice.actions;
export default callSlice.reducer;
