import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axios.config';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const signUp = createAsyncThunk('auth/signUp', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post('/auth/signup', userData);
        return response.data.metadata;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const logIn = createAsyncThunk('auth/logIn', async (credentials, { rejectWithValue }) => {
    try {
        const response = await axios.post('/auth/login', credentials);
        return response.data.metadata;
    } catch (error) {
        
        return rejectWithValue(error.message);
    }
});

export const verifyOTP = createAsyncThunk('auth/verifyOTP', async (otpData, { rejectWithValue }) => {
    try {
        const response = await axios.post('/auth/verify-otp', otpData);
        return response.data.metadata;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const introspectToken = createAsyncThunk('auth/introspectToken', async (_, { rejectWithValue }) => {
    try {
        const clientId = await AsyncStorage.getItem('client_id');
        if (!clientId) {
            throw new Error('Please log in again.');
        }
        const response = await axios.get('/auth/introspect-token', {
            headers: { 'x-client-id': clientId },
        });
        return response.data.metadata;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});


export const logOut = createAsyncThunk('auth/logOut', async (_, { rejectWithValue }) => {
    try {
        const clientId = await AsyncStorage.getItem('client_id');
        if(!clientId) throw new Error('Please log in again.');
        const response = await axios.post('/auth/logout',{}, {
            headers: { 
                'x-client-id': clientId, 
            },
        });
        console.log(response.data.metadata || response.data)
        return response.data.metadata;
    } catch (error) {
        console.log("LogoutError: ",error)
        return rejectWithValue(error.message);
    }
});

export const refreshToken = createAsyncThunk('auth/refreshToken', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.post('/auth/refresh-token');
        return response.data.metadata;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// Slice
const authSlice = createSlice({
    name: 'authentication',
    initialState: {
        user: null,
        otpToken: null,
        accsessToken: null,
        refreshToken: null,
        is_valid: false,
        loading: false,
        error: null,
    },
    reducers: {
        resetError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Sign Up
            .addCase(signUp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signUp.fulfilled, (state, action) => {
                state.loading = false;
                state.otpToken = action.payload.token;
            })
            .addCase(signUp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Log In
            .addCase(logIn.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logIn.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user; 
                state.token = action.payload.token;
            })
            .addCase(logIn.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Verify OTP
            .addCase(verifyOTP.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOTP.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.accsessToken = action.payload.tokens.accessToken;
                state.refreshToken = action.payload.tokens.refreshToken; 
            })
            .addCase(verifyOTP.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(introspectToken.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(introspectToken.fulfilled, (state, action) => {
                state.loading = false;
                state.is_valid = action.payload.is_valid;
            })
            .addCase(introspectToken.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            // Log Out
            .addCase(logOut.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logOut.fulfilled, (state) => {
                state.loading = false;
                state.user = null; 
                state.token = null;
            })
            .addCase(logOut.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Refresh Token
            .addCase(refreshToken.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.metadata.token; 
            })
            .addCase(refreshToken.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetError } = authSlice.actions;
export default authSlice.reducer;