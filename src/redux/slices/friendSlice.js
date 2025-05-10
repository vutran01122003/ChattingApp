import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axios.config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const sendFriendRequest = createAsyncThunk(
  'user/sendFriendRequest',
  async ({ friendId }) => {
    const clientId = await AsyncStorage.getItem('client_id');
    const accessToken = await AsyncStorage.getItem('access_token');
    if (!clientId || !accessToken) {
      throw new Error('Please log in again.');
    }
    const res = await axios.post(
      `/user/send-friend-request/${friendId}`,
      {},
      {
        headers: {
          'x-client-id': clientId,
          authorization: accessToken,
        },
      },
    );
    return {
      message: res.data.metadata.message,
      status: res.data.statusCode,
    };
  },
);

export const checkFriendShip = createAsyncThunk(
  'checkFriendShip',
  async ({ friendId }) => {
    const clientId = await AsyncStorage.getItem('client_id');
    const accessToken = await AsyncStorage.getItem('access_token');
    if (!clientId || !accessToken) {
      throw new Error('Please log in again.');
    }

    const res = await axios.get(`/user/check-friendship/${friendId}`, {
      headers: { 'x-client-id': clientId },
    });

    return {
      isFriend: res.data.metadata.isFriend,
      message: res.data.metadata.message,
    };
  },
);

export const checkSendRequest = createAsyncThunk(
  'checkSendRequest',
  async ({ friendId }) => {
    const clientId = await AsyncStorage.getItem('client_id');
    const accessToken = await AsyncStorage.getItem('access_token');
    if (!clientId || !accessToken) {
      throw new Error('Please log in again.');
    }

    const res = await axios.get(`/user/check-send-friend-request/${friendId}`, {
      headers: {
        'x-client-id': clientId,
      },
    });

    return {
      isSentRequest: res.data.metadata.isSentRequest,
      message: res.data.metadata.message,
    };
  },
);

export const cancelFriendRequest = createAsyncThunk(
  'cancelFriendRequest',
  async ({ friendId }) => {
    const clientId = await AsyncStorage.getItem('client_id');
    const accessToken = await AsyncStorage.getItem('access_token');
    if (!clientId || !accessToken) {
      throw new Error('Please log in again.');
    }
    const res = await axios.post(
      `/user/cancel-friend-request/${friendId}`,
      {},
      {
        headers: {
          'x-client-id': clientId,
        },
      },
    );
    return {
      message: res.data.metadata.message,
      status: res.data.statusCode,
    };
  },
);

export const checkReceiveRequest = createAsyncThunk(
  'checkReceiveRequest',
  async ({ friendId }) => {
    const clientId = await AsyncStorage.getItem('client_id');
    const accessToken = await AsyncStorage.getItem('access_token');
    if (!clientId || !accessToken) {
      throw new Error('Please log in again.');
    }
    const res = await axios.get(
      `/user/check-receive-friend-request/${friendId}`,
      {
        headers: {
          'x-client-id': clientId,
        },
      },
    );
    return {
      isReceiveRequest: res.data.metadata.isReceiveRequest,
      message: res.data.metadata.message,
    };
  },
);

export const declineFriendRequest = createAsyncThunk(
  'declineFriendRequest',
  async ({ friendId }) => {
    const clientId = await AsyncStorage.getItem('client_id');
    const accessToken = await AsyncStorage.getItem('access_token');
    if (!clientId || !accessToken) {
      throw new Error('Please log in again.');
    }
    const res = await axios.post(
      `/user/decline-friend-request/${friendId}`,
      {},
      {
        headers: {
          'x-client-id': clientId,
        },
      },
    );
    return {
      message: res.data.metadata.message,
      status: res.data.statusCode,
    };
  },
);

export const acceptFriendRequest = createAsyncThunk(
  'acceptFriendRequest',
  async ({ friendId }) => {
    const clientId = await AsyncStorage.getItem('client_id');
    const accessToken = await AsyncStorage.getItem('access_token');
    if (!clientId || !accessToken) {
      throw new Error('Please log in again.');
    }
    const res = await axios.post(
      `/user/accept-friend-request/${friendId}`,
      {},
      {
        headers: {
          'x-client-id': clientId,
        },
      },
    );
    return {
      message: res.data.metadata.message,
      status: res.data.statusCode,
    };
  },
);

export const unfriend = createAsyncThunk('unfriend', async ({ friendId }) => {
  const clientId = await AsyncStorage.getItem('client_id');
  const accessToken = await AsyncStorage.getItem('access_token');
  if (!clientId || !accessToken) {
    throw new Error('Please log in again.');
  }
  const res = await axios.post(
    `/user/unfriend/${friendId}`,
    {},
    {
      headers: {
        'x-client-id': clientId,
      },
    },
  );
  return {
    message: res.data.metadata.message,
    status: res.data.statusCode,
  };
});

export const getFriendList = createAsyncThunk('getFriendList', async () => {
  const clientId = await AsyncStorage.getItem('client_id');
  const accessToken = await AsyncStorage.getItem('access_token');
  if (!clientId || !accessToken) {
    throw new Error('Please log in again.');
  }
  const res = await axios.get('/user/get-friend-list', {
    headers: {
      'x-client-id': clientId,
    },
  });
  return res.data.metadata;
});

export const getSentRequests = createAsyncThunk('getSentRequests', async () => {
  const clientId = await AsyncStorage.getItem('client_id');
  const accessToken = await AsyncStorage.getItem('access_token');
  if (!clientId || !accessToken) {
    throw new Error('Please log in again.');
  }
  const res = await axios.get('/user/get-send-friend-request', {
    headers: {
      'x-client-id': clientId,
    },
  });
  return res.data.metadata;
});

export const getReceivedRequests = createAsyncThunk(
  'getReceivedRequests',
  async () => {
    const clientId = await AsyncStorage.getItem('client_id');
    const accessToken = await AsyncStorage.getItem('access_token');
    if (!clientId || !accessToken) {
      throw new Error('Please log in again.');
    }
    const res = await axios.get('/user/get-receive-friend-request', {
      headers: {
        'x-client-id': clientId,
      },
    });
    return res.data.metadata;
  },
);

const friendSlice = createSlice({
  name: 'friend',
  initialState: {
    isFriend: null,
    isSentRequest: null,
    isReceiveRequest: null,
    message: '',
    loading: false,
    error: null,
    friendList: [],
    sentRequests: [],
    receivedRequests: [],
  },
  reducers: {
    resetError(state) {
      state.error = null;
    },
    setIsFriend(state, action) {
      state.isFriend = action.payload;
      state.isReceiveRequest = false; // Reset isReceiveRequest khi là bạn bè
      state.isSentRequest = false; // Reset isSentRequest khi là bạn bè
    },
  },
  extraReducers: builder => {
    builder
      .addCase(sendFriendRequest.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.isSentRequest = true;
      })
      .addCase(sendFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkFriendShip.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkFriendShip.fulfilled, (state, action) => {
        state.loading = false;
        state.isFriend = action.payload.isFriend;
        state.message = action.payload.message;
      })
      .addCase(checkFriendShip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkSendRequest.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkSendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.isSentRequest = action.payload.isSentRequest;
        state.message = action.payload.message;
      })
      .addCase(checkSendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(cancelFriendRequest.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.isSentRequest = false;
      })
      .addCase(cancelFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(declineFriendRequest.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(declineFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.isReceiveRequest = false;
      })
      .addCase(declineFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkReceiveRequest.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkReceiveRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.isReceiveRequest = action.payload.isReceiveRequest;
        state.message = action.payload.message;
      })
      .addCase(checkReceiveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(acceptFriendRequest.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.isFriend = true;
        state.isReceiveRequest = false;
        state.isSentRequest = false;
      })
      .addCase(acceptFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(unfriend.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unfriend.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.isFriend = false;
      })
      .addCase(unfriend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getFriendList.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFriendList.fulfilled, (state, action) => {
        state.loading = false;
        state.friendList = action.payload;
      })
      .addCase(getFriendList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getSentRequests.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSentRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.sentRequests = action.payload;
      })
      .addCase(getSentRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getReceivedRequests.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReceivedRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.receivedRequests = action.payload;
      })
      .addCase(getReceivedRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError, setIsFriend } = friendSlice.actions;
export default friendSlice.reducer;