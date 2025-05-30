import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from '../../config/axios.config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ------------------- Request OTP -------------------
export const requestResetPassword = createAsyncThunk(
  'user/requestResetPassword',
  async ({phone}, {rejectWithValue}) => {
    try {
      const res = await axios.post('/user/request-reset-password', {phone});
      return res.data.metadata.token;
    } catch (err) {
      return rejectWithValue(err.message || 'Request OTP failed');
    }
  },
);

// ------------------- Verify OTP -------------------
export const verifyOTP = createAsyncThunk(
  'user/verifyOTP',
  async ({otp, token}, {rejectWithValue}) => {
    try {
      const res = await axios.post('/user/verify-reset-password', {otp, token});
      return res.data.metadata.phone;
    } catch (err) {
      return rejectWithValue(err.message || 'OTP verification failed');
    }
  },
);

// ------------------- Reset Password -------------------
export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async ({phone, newPassword}, {rejectWithValue}) => {
    try {
      const res = await axios.post('/user/reset-password', {
        phone,
        newPassword,
      });
      return res.data.metadata;
    } catch (err) {
      return rejectWithValue(err.message || 'Reset password failed');
    }
  },
);

// ------------------- Create Password -------------------
export const createPassword = createAsyncThunk(
  'user/createPassword',
  async ({password}, {rejectWithValue}) => {
    try {
      const clientId = await AsyncStorage.getItem('client_id');
      const res = await axios.post(
        '/user/create-password',
        {password},
        {
          headers: {'x-client-id': clientId},
        },
      );
      return res.data.metadata;
    } catch (err) {
      return rejectWithValue(err.message || 'Create password failed');
    }
  },
);

// get user info
export const getUserInfo = createAsyncThunk(
  'user/getUserInfo',
  async (_, {rejectWithValue}) => {
    try {
      const clientId = await AsyncStorage.getItem('client_id');
      const res = await axios.get('/user/info', {
        headers: {'x-client-id': clientId},
      });
      return res.data.metadata;
    } catch (err) {
      return rejectWithValue(err.message || 'Get user info failed');
    }
  },
);

// ------------------- Update User Info -------------------
export const updateUserInfo = createAsyncThunk(
  'user/updateUserInfo',
  async ({fullName, dateOfBirth, gender}, {rejectWithValue}) => {
    try {
      const clientId = await AsyncStorage.getItem('client_id');
      const res = await axios.post(
        '/user/update-info',
        {fullName, dateOfBirth, gender},
        {headers: {'x-client-id': clientId}},
      );
      return res.data.metadata;
    } catch (err) {
      return rejectWithValue(err.message || 'Update info failed');
    }
  },
);

// ------------------- Change Password -------------------
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({password, newPassword}, {rejectWithValue}) => {
    try {
      const clientId = await AsyncStorage.getItem('client_id');
      const res = await axios.post(
        '/user/change-password',
        {password, newPassword},
        {headers: {'x-client-id': clientId}},
      );
      return res.data.metadata;
    } catch (err) {
      return rejectWithValue(err.message || 'Change password failed');
    }
  },
);

export const updateUserStatus = createAsyncThunk(
  'user/updateUserStatus',
  async ({status}, {rejectWithValue}) => {
    try {
      const clientId = await AsyncStorage.getItem('client_id');
      const res = await axios.post(
        '/user/update-status',
        {status},
        {
          headers: {
            'x-client-id': clientId,
          },
        },
      );
      return res.data.metadata;
    } catch (err) {
      return rejectWithValue(err.message || 'Update status failed');
    }
  },
);


// ------------------- Get All User -------------------
export const getAllUser = createAsyncThunk(
  'user/getAllUser',
  async (_, { rejectWithValue }) => {
    try {
      const clientId = await AsyncStorage.getItem('client_id');
      const res = await axios.get('/user/getAllUser', {
        headers: { 'x-client-id': clientId }
      });
      return res.data.metadata; 
    } catch (err) {
      return rejectWithValue(err.message || 'Get all users failed');
    }
  }
);


// ------------------- Get User By Search -------------------
export const getUserBySearch = createAsyncThunk(
  'user/getUserBySearch',
  async (searchTerm, { rejectWithValue }) => {
    try {
      const clientId = await AsyncStorage.getItem('client_id');
      const res = await axios.get(`/user/getUserBySearch/${searchTerm}`, {
        headers: { 'x-client-id': clientId }
      });
      return res.data.metadata; 
    } catch (err) {
      return rejectWithValue(err.message || 'Search users failed');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    phone: null,
    otpToken: null,
    user: null,
    loading: false,
    error: null,
    allUser:[],
    searchResults: [],
  },
  reducers: {
    logout: state => {
      state.phone = null;
      state.otpToken = null;
      state.user = null;
      state.loading = false;
      state.error = null;
      AsyncStorage.removeItem('access_token');
      AsyncStorage.removeItem('client_id');
    },
  },
  extraReducers: builder => {
    builder
      .addCase(requestResetPassword.fulfilled, (state, action) => {
        state.otpToken = action.payload;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.phone = action.payload;
        state.error = null;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, state => {
        state.error = null;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, state => {
        state.error = null;
      })
      .addCase(createPassword.fulfilled, state => {
        state.error = null;
      })
      .addCase(getAllUser.fulfilled, (state, action) => {
        state.allUsers = action.payload;
        state.error = null;
      })
      .addCase(getUserBySearch.fulfilled, (state, action) => {
        state.searchResults = action.payload; 
        state.error = null;
      })
      .addMatcher((action) => action.type.endsWith('rejected'), (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addMatcher(
        action => action.type.endsWith('rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        },
      );
  },
     
});

export const {logout} = userSlice.actions;
export default userSlice.reducer;
