import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDataApi, postDataApi } from "../../utils/fetchDataApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
    isFriend: null,
    isSentRequest: null,
    isReceiveRequest: null,
    sentRequests: [],
    receivedRequests: [],
    friendList: [],
    message: "",
    loading: false,
    error: null
};

// kiểm tra mối quan hệ bạn bè
export const checkFriendShip = createAsyncThunk("checkFriendShip", async ({ friendId }) => {
    const clientId = await AsyncStorage.getItem('client_id');
    const res = await getDataApi(`/user/check-friendship/${friendId}`, null, {
        "x-client-id": clientId
    });

    return {
        isFriend: res.data.metadata.isFriend,
        message: res.data.metadata.message
    };
});

// Gửi lời mời kết bạn
export const sendFriendRequest = createAsyncThunk("sendFriendRequest", async ({ friendId }) => {
    const clientId = await AsyncStorage.getItem('client_id');
    const accessToken = await AsyncStorage.getItem('access_token');
    const data = {};
    const res = await postDataApi(`/user/send-friend-request/${friendId}`, data, {
        "x-client-id": clientId,
        Authorization: accessToken
    });
    return {
        message: res.data.metadata.message,
        status: res.data.statusCode
    };
});

// Kiểm tra xem đã gửi yêu cầu kết bạn cho người này chưa
export const checkSendFriendRequest = createAsyncThunk("checkSendFriendRequest", async ({ friendId }) => {
    const clientId = await AsyncStorage.getItem('client_id');
    const accessToken = await AsyncStorage.getItem('access_token');
    const res = await getDataApi(`/user/check-send-friend-request/${friendId}`, null, {
        "x-client-id": clientId,
        Authorization: accessToken
    });

    return {
        isSentRequest: res.data.metadata.isSentRequest,
        message: res.data.metadata.message
    };
});

// Hủy yêu cầu kết bạn đã gửi
export const cancelFriendRequest = createAsyncThunk("cancelFriendRequest", async ({ friendId }) => {
    const clientId = await AsyncStorage.getItem('client_id');
    const accessToken = await AsyncStorage.getItem('access_token');

    const res = await postDataApi(`/user/cancel-friend-request/${friendId}`, null, {
        "x-client-id": clientId,
        Authorization: accessToken
    });

    return {
        message: res.data.metadata.message,
        status: res.data.statusCode
    };
});

// Từ chối yêu cầu kết bạn từ người khác
export const declineFriendRequest = createAsyncThunk("declineFriendRequest", async ({ friendId }) => {
    const clientId = await AsyncStorage.getItem('client_id');
    const accessToken = await AsyncStorage.getItem('access_token');

    const res = await postDataApi(`/user/decline-friend-request/${friendId}`, null, {
        "x-client-id": clientId,
        Authorization: accessToken
    });
    return {
        message: res.data.metadata.message,
        status: res.data.statusCode
    };
});

// Kiểm tra xem có nhận được yêu cầu kết bạn từ người này chưa
export const checkReceiveFriendRequest = createAsyncThunk("checkReceiveFriendRequest", async ({ friendId }) => {
    const clientId = await AsyncStorage.getItem('client_id');
    const accessToken = await AsyncStorage.getItem('access_token');

    const res = await getDataApi(`/user/check-receive-friend-request/${friendId}`, null, {
        "x-client-id": clientId,
        Authorization: accessToken
    });

    return {
        isReceiveRequest: res.data.metadata.isReceiveRequest,
        message: res.data.metadata.message
    };
});

// Chấp nhận yêu cầu kết bạn từ người khác
export const acceptFriendRequest = createAsyncThunk("acceptFriendRequest", async ({ receiverId }) => {
    const clientId = await AsyncStorage.getItem('client_id');
    const accessToken = await AsyncStorage.getItem('access_token');

    const res = await postDataApi(`/user/accept-friend-request/${receiverId}`, null, {
        "x-client-id": clientId,
        Authorization: accessToken
    });
    return {
        message: res.data.metadata.message,
        status: res.data.statusCode
    };
});

// Hủy kết bạn với người khác
export const unfriendUser = createAsyncThunk("unfriendUser", async ({ friendId }) => {
    const clientId = await AsyncStorage.getItem('client_id');
    const accessToken = await AsyncStorage.getItem('access_token');

    const res = await postDataApi(`/user/unfriend/${friendId}`, null, {
        "x-client-id": clientId,
        Authorization: accessToken
    });
    return {
        message: res.data.metadata.message,
        status: res.data.statusCode
    };
});

// GET danh sách lời mời đã nhận
export const getReceivedFriendRequests = createAsyncThunk("getReceivedFriendRequests", async () => {
    const clientId = await AsyncStorage.getItem('client_id');
    const accessToken = await AsyncStorage.getItem('access_token');

    const res = await getDataApi(`/user/get-receive-friend-request`, null, {
        "x-client-id": clientId,
        Authorization: accessToken
    });
    return res.data.metadata;
});

// GET danh sách lời mời đã gửi
export const getSentFriendRequests = createAsyncThunk("getSentFriendRequests", async () => {
    const clientId = await AsyncStorage.getItem('client_id');
    const accessToken = await AsyncStorage.getItem('access_token');

    const res = await getDataApi(`/user/get-send-friend-request`, null, {
        "x-client-id": clientId,
        Authorization: accessToken
    });
    return res.data.metadata;
});

// GET danh sách bạn bè
export const getFriendList = createAsyncThunk("getFriendList", async () => {
    const clientId = await AsyncStorage.getItem('client_id');
    const accessToken = await AsyncStorage.getItem('access_token');

    const res = await getDataApi(`/user/get-friend-list`, null, {
        "x-client-id": clientId,
        Authorization: accessToken
    });
  
    return res.data.metadata;
});

const friendshipSlice = createSlice({
    name: "friendship",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(checkFriendShip.pending, (state) => {
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
                state.error = action.error.message;
            })
            .addCase(checkSendFriendRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkSendFriendRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.isSentRequest = action.payload.isSentRequest;
                state.message = action.payload.message;
            })
            .addCase(checkSendFriendRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(sendFriendRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendFriendRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
                state.isFriend = false;
            })
            .addCase(sendFriendRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(cancelFriendRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cancelFriendRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
                state.isSentRequest = false;
            })
            .addCase(checkReceiveFriendRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkReceiveFriendRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.isReceiveRequest = action.payload.isReceiveRequest;
                state.message = action.payload.message;
            })
            .addCase(checkReceiveFriendRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(acceptFriendRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(acceptFriendRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
                state.isFriend = true;
                state.isReceiveRequest = false;
            })
            .addCase(acceptFriendRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(unfriendUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(unfriendUser.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
                state.isFriend = false;
            })
            .addCase(unfriendUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getReceivedFriendRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getReceivedFriendRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.receivedRequests = action.payload;
            })
            .addCase(getReceivedFriendRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getSentFriendRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSentFriendRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.sentRequests = action.payload;
            })
            .addCase(getSentFriendRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(declineFriendRequest.pending, (state) => {
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
                state.error = action.error.message;
            })
            .addCase(getFriendList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFriendList.fulfilled, (state, action) => {
                state.loading = false;
                state.friendList = action.payload;
            })
            .addCase(getFriendList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export default friendshipSlice.reducer;
