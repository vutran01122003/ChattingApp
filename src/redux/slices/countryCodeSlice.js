import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    data: [],
    isLoading: false,
    error: null,
    isSlected: { name: 'Vietnam', code: '+84' }
};


export const fetchCountryCode = createAsyncThunk('fetchCountryCode', async () => {
    const countryCodes = await import('../../core/country_code')
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(countryCodes.default)
        }, 1000);
    });
});
export const setCountryCodeSelect = createAsyncThunk('setCountryCodeSelect', async (country) => {
    return Promise.resolve(country);
});
const countryCodeSlice = createSlice({
    name: 'countryCode',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchCountryCode.fulfilled, (state, action) => {
            state.data = action.payload
        })
        .addCase(setCountryCodeSelect.fulfilled, (state, action)=>{
            state.isSlected = action.payload
        })
        ;
    },
});

export default countryCodeSlice.reducer;
