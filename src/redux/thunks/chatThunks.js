import {createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../../config/axios.config';

export const fetchAllConversations = createAsyncThunk(
  'conversation/fetchAllConversations',
  async (_, {rejectWithValue}) => {
    try {
      const clientId = await AsyncStorage.getItem('client_id');
      const response = await axios.get('/conversations', {
        headers: {'x-client-id': clientId},
      });
      return response.data.metadata;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch conversations',
      );
    }
  },
);

export const getConversation = createAsyncThunk(
  'conversation/getConversation',
  async (conversationId, {rejectWithValue}) => {
    try {
      const clientId = await AsyncStorage.getItem('client_id');
      const response = await axios.get(`/conversations/${conversationId}`, {
        headers: {'x-client-id': clientId},
      });
      return response.data.metadata;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to create/get conversation',
      );
    }
  },
);

export const getConversationMessages = createAsyncThunk(
  'conversation/getConversationMessages',
  async ({conversationId, page = 1, limit = 20}, {rejectWithValue}) => {
    try {
      const clientId = await AsyncStorage.getItem('client_id');
      const response = await axios.get(
        `/conversations/${conversationId}/messages?page=${page}&limit=${limit}`,
        {headers: {'x-client-id': clientId}},
      );
      return response.data.metadata;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to get conversation details',
      );
    }
  },
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({conversationId, content}, {rejectWithValue}) => {
    try {
      const clientId = await AsyncStorage.getItem('client_id');
      const response = await axios.post(
        '/messages/',
        {
          conversation_id: conversationId,
          content,
        },
        {headers: {'x-client-id': clientId}},
      );
      return response.data.metadata;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to update conversation',
      );
    }
  },
);

export const sendMessageWithFiles = createAsyncThunk(
  'messages/sendMessageWithFiles',
  async (formData, {rejectWithValue}) => {
    try {
      const clientId = await AsyncStorage.getItem('client_id');
      const response = await axios.post('/messages', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-client-id': clientId,
        },
      });
      return response.data.metadata;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to update conversation',
      );
    }
  },
);

export const revokeMessage = createAsyncThunk(
  'messages/revokeMessage',
  async (messageId, {rejectWithValue}) => {
    try {
      const clientId = await AsyncStorage.getItem('client_id');
      const response = await axios.put(
        `/messages/${messageId}/revoke`,
        {},
        {
          headers: {'x-client-id': clientId},
        },
      );
      return response.data.metadata;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to mark conversation as read',
      );
    }
  },
);

export const deleteMessage = createAsyncThunk(
  'messages/deleteMessage',
  async (messageId, {rejectWithValue}) => {
    try {
      const clientId = await AsyncStorage.getItem('client_id');
      const response = await axios.put(
        `/messages/${messageId}/delete`,
        {},
        {
          headers: {'x-client-id': clientId},
        },
      );

      return response.data.metadata;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to mark conversation as read',
      );
    }
  },
);

export const markAsReadMessage = createAsyncThunk(
  'messages/markAsReadMessage',
  async (conversationId, {rejectWithValue}) => {
    try {
      const clientId = await AsyncStorage.getItem('client_id');
      const response = await axios.put(
        '/messages/mark-as-read',
        {
          conversation_id: conversationId,
        },
        {headers: {'x-client-id': clientId}},
      );

      return response.data.metadata;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to mark conversation as read',
      );
    }
  },
);

export const forwardMessage = createAsyncThunk(
  'messages/forwardMessage',
  async ({messageId, targetConversationId}, {rejectWithValue, getState}) => {
    try {
      const clientId = await AsyncStorage.getItem('client_id');
      const response = await axios.post(
        '/messages/forward',
        {
          message_id: messageId,
          target_conversion_id: targetConversationId,
        },
        {headers: {'x-client-id': clientId}},
      );
      return response.data.metadata;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to mark conversation as read',
      );
    }
  },
);

export const reactionMessage = createAsyncThunk(
  'messages/reactionMessage',
  async ({messageId, emoji}, {rejectWithValue, getState}) => {
    try {
      const clientId = await AsyncStorage.getItem('client_id');
      const response = await axios.post(
        '/messages/reaction',
        {
          message_id: messageId,
          emoji,
        },
        {headers: {'x-client-id': clientId}},
      );
      return response.data.metadata;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to mark conversation as read',
      );
    }
  },
);

export const unReactionMessage = createAsyncThunk(
  'messages/unReactionMessage',
  async (messageId, {rejectWithValue, getState}) => {
    try {
      const clientId = await AsyncStorage.getItem('client_id');

      const response = await axios.delete('/messages/reaction', {
        data: {message_id: messageId},
        headers: {'x-client-id': clientId},
      });

      return response.data.metadata;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to mark conversation as read',
      );
    }
  },
);
