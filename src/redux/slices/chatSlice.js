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
  reactionMessage,
  unReactionMessage,
  updateMembersToConversation,
  createConversation,
  updateConversation,
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
    addConversation: (state, action) => {
      const newConv = action.payload;
      if (newConv.conversation_type === "friend") {
          if (!state.friendConversations.some((c) => c.conversation_id === newConv.conversation_id)) {
              state.friendConversations.unshift(newConv);
          }
      } else if (newConv.conversation_type === "stranger") {
          if (!state.strangerConversations.some((c) => c.conversation_id === newConv.conversation_id)) {
              state.strangerConversations.unshift(newConv);
          }
      } else {
          if (!state.groupConversations.some((c) => c.conversation_id === newConv.conversation_id)) {
              state.groupConversations.unshift(newConv);
          }
      }
    },
    updateConv: (state, action) => {
        const newConv = action.payload;
        if (newConv.conversation_type === "friend") {
            const index = state.friendConversations.findIndex(
                (conversation) => conversation.conversation_id === newConv.conversation_id
            );
            if (index !== -1) state.friendConversations[index] = newConv;
        } else if (newConv.conversation_type === "stranger") {
            const index = state.strangerConversations.findIndex(
                (conversation) => conversation.conversation_id === newConv.conversation_id
            );
            if (index !== -1) state.strangerConversations[index] = newConv;
        } else {
            const index = state.groupConversations.findIndex(
                (conversation) => conversation.conversation_id === newConv.conversation_id
            );
            if (index !== -1) state.groupConversations[index] = newConv;
        }
    },
    removeConversation: (state, action) => {
        const newConv = action.payload;

        if (newConv.conversation_type === "friend") {
            return {
                ...state,
                friendConversations: state.friendConversations.filter(
                    (conversation) => conversation.conversation_id !== newConv.conversation_id
                )
            };
        } else if (newConv.conversation_type === "stranger") {
            return {
                ...state,
                strangerConversations: state.strangerConversations.filter(
                    (conversation) => conversation.conversation_id !== newConv.conversation_id
                )
            };
        } else {
            return {
                ...state,
                groupConversations: state.groupConversations.filter(
                    (conversation) => conversation.conversation_id !== newConv.conversation_id
                )
            };
        }
    },
    updateLastMessageConversation: (state, action) => {
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
      const data = action.payload;

      const messageIndex = state.messages.findIndex(
        msg => msg._id === data._id,
      );

      if (messageIndex !== -1) {
        state.messages[messageIndex] = {
          ...state.messages[messageIndex],
          ...data,
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
      .addCase(createConversation.fulfilled, (state, action) => {
        const newConv = action.payload;
        if (newConv.conversation_type === "friend") {
            if (!state.friendConversations.some((c) => c.conversation_id === newConv.conversation_id)) {
                state.friendConversations.unshift(newConv);
            }
        } else if (newConv.conversation_type === "stranger") {
            if (!state.strangerConversations.some((c) => c.conversation_id === newConv.conversation_id)) {
                state.strangerConversations.unshift(newConv);
            }
        } else {
            if (!state.groupConversations.some((c) => c.conversation_id === newConv.conversation_id)) {
                state.groupConversations.unshift(newConv);
            }
        }
    })
    .addCase(updateConversation.fulfilled, (state, action) => {
        const newConv = action.payload;

        if (newConv.conversation_type === "friend") {
            const index = state.friendConversations.findIndex(
                (conversation) => conversation.conversation_id === newConv.conversation_id
            );
            if (index !== -1) state.friendConversations[index] = newConv;
        } else if (newConv.conversation_type === "stranger") {
            const index = state.strangerConversations.findIndex(
                (conversation) => conversation.conversation_id === newConv.conversation_id
            );
            if (index !== -1) state.strangerConversations[index] = newConv;
        } else {
            const index = state.groupConversations.findIndex(
                (conversation) => conversation.conversation_id === newConv.conversation_id
            );
            if (index !== -1) state.groupConversations[index] = newConv;
        }
    })
    .addCase(updateMembersToConversation.fulfilled, (state, action) => {
        const newConv = action.payload;
        let index = state.groupConversations.findIndex(
            (conversation) => conversation.conversation_id === newConv.conversation_id
        );

        if (index != -1) state.groupConversations[index] = newConv;
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

      .addCase(revokeMessage.fulfilled, (state, action) => {
        const updatedMessage = action.payload;

        const index = state.messages.findIndex(
          msg => msg._id === updatedMessage._id,
        );

        if (index !== -1) {
          state.messages[index] = {
            ...state.messages[index],
            ...updatedMessage,
          };
        }
      })

      .addCase(deleteMessage.fulfilled, (state, action) => {
        const updatedMessage = action.payload;

        const index = state.messages.findIndex(
          msg => msg._id === updatedMessage._id,
        );

        if (index !== -1) {
          state.messages[index] = {
            ...state.messages[index],
            ...updatedMessage,
          };
        }
      })

      .addCase(forwardMessage.fulfilled, (state, action) => {
        const updatedMessage = action.payload;

        const index = state.messages.findIndex(
          msg => msg._id === updatedMessage._id,
        );

        if (index !== -1) {
          state.messages[index] = {
            ...state.messages[index],
            ...updatedMessage,
          };
        }
      })

      .addCase(reactionMessage.fulfilled, (state, action) => {
        const updatedMessage = action.payload;

        const index = state.messages.findIndex(
          msg => msg._id === updatedMessage._id,
        );

        if (index !== -1) {
          state.messages[index] = {
            ...state.messages[index],
            ...updatedMessage,
          };
        }
      })

      .addCase(unReactionMessage.fulfilled, (state, action) => {
        const updatedMessage = action.payload;

        const index = state.messages.findIndex(
          msg => msg._id === updatedMessage._id,
        );

        if (index !== -1) {
          state.messages[index] = {
            ...state.messages[index],
            ...updatedMessage,
          };
        }
      });
  },
});

export const {
  clearCurrentConversation,
  resetPagination,
  addConversation,
  updateConv,
  removeConversation,
  updateLastMessageConversation,
  receiveMessage,
  updateMessageStatus,
} = chatSlice.actions;

export default chatSlice.reducer;
