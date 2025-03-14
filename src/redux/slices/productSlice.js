import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

const initialState = {
  data: [],
  isLoading: false,
  error: null,
};

export const fetchData = createAsyncThunk('fetchData', async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([{title: 'laptop'}, {title: 'iphone'}]);
    }, 1000);
  });
});

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});

export default productSlice.reducer;
