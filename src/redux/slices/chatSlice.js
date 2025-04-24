import {createSlice} from '@reduxjs/toolkit';

import {
  fetchAllConversations,
  getConversation,
  getConversationMessages,
  sendMessage,
  sendMessageWithFiles,
  revokeMessage,
  deleteMessage,
  forwardMessage,
} from '../thunks/chatThunks';

const initialState = {
  friendConversations: [],
  strangerConversations: [],
  groupConversations: [],
  currentConversation: null,

  messages: [],
  messagePagination: {
    page: 1,
    limit: 20,
    hasMore: false,
  },
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearCurrentConversation: state => {
      state.currentConversation = null;
      state.messages = [];
      state.messagePagination = {
        page: 1,
        limit: 20,
        hasMore: false,
      };
    },
    resetPagination: state => {
      state.messagePagination = {
        page: 1,
        limit: 20,
        hasMore: false,
      };
    },
    receiveMessage: (state, action) => {
      const newMessage = action.payload;

      const isSameConversation =
        state.currentConversation &&
        state.currentConversation.conversation_id ===
          newMessage.conversation_id;

      if (isSameConversation) {
        const exists = state.messages.some(msg => msg._id === newMessage._id);
        if (!exists) {
          state.messages = [newMessage, ...state.messages];
        }
      }
    },
    updateConversation: (state, action) => {
      const message = action.payload;

      const updateConversationList = list => {
        const index = list.findIndex(
          c => c.conversation_id === message.conversation_id,
        );
        if (index !== -1) {
          list[index].last_message = message;
          list[index].last_message_time = message.createdAt;
          list[index].unread = true;

          const conversation = list[index];
          list.splice(index, 1);
          list.unshift(conversation);

          return true;
        }
        return false;
      };

      const updatedInFriends = updateConversationList(
        state.friendConversations,
      );

      const updatedInStrangers = updateConversationList(
        state.strangerConversations,
      );

      const updatedInGroups = updateConversationList(state.groupConversations);

      if (!updatedInFriends && !updatedInStrangers && !updatedInGroups) {
        console.log(
          'Conversation not found in local state, might need to fetch',
        );
      }
    },
    updateMessageStatus: (state, action) => {
      const {messageId, updates} = action.payload;
      const messageIndex = state.messages.findIndex(
        msg => msg._id === messageId,
      );

      if (messageIndex !== -1) {
        state.messages[messageIndex] = {
          ...state.messages[messageIndex],
          ...updates,
        };
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllConversations.fulfilled, (state, action) => {
        state.friendConversations = action.payload.friends;
        state.strangerConversations = action.payload.strangers;
        state.groupConversations = action.payload.groups;
      })

      .addCase(getConversation.fulfilled, (state, action) => {
        state.currentConversation = action.payload;

        const newConv = action.payload;
        if (newConv.conversation_type === 'friend') {
          if (
            !state.friendConversations.some(
              c => c.conversation_id === newConv.conversation_id,
            )
          ) {
            state.friendConversations.unshift(newConv);
          }
        } else if (newConv.conversation_type === 'stranger') {
          if (
            !state.strangerConversations.some(
              c => c.conversation_id === newConv.conversation_id,
            )
          ) {
            state.strangerConversations.unshift(newConv);
          }
        } else {
          if (
            !state.groupConversations.some(
              c => c.conversation_id === newConv.conversation_id,
            )
          ) {
            state.groupConversations.unshift(newConv);
          }
        }
      })

      .addCase(getConversationMessages.fulfilled, (state, action) => {
        if (
          action.payload.pagination.page === 1 &&
          action.payload.messages.length !== 0
        ) {
          state.messages = action.payload.messages;
        } else {
          state.messages = [...state.messages, ...action.payload.messages];
        }

        state.messagePagination = {
          page: action.payload.pagination.page,
          limit: action.payload.pagination.limit,
          hasMore: action.payload.pagination.hasMore,
        };
      })

      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.unshift(action.payload);
      })

      .addCase(sendMessageWithFiles.fulfilled, (state, action) => {
        state.messages.unshift(action.payload);
      })

      .addCase(revokeMessage.fulfilled, (state, action) => {})

      .addCase(deleteMessage.fulfilled, (state, action) => {})

      .addCase(forwardMessage.fulfilled, (state, action) => {});
  },
});

export const {
  clearCurrentConversation,
  resetPagination,
  updateConversation,
  receiveMessage,
  updateMessageStatus,
} = chatSlice.actions;

export default chatSlice.reducer;
