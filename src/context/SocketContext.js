import React, {createContext, useContext, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {io} from 'socket.io-client';
import {
  addConversation,
  receiveMessage,
  removeConversation,
  updateConv,
  updateLastMessageConversation,
  updateMessageStatus,
} from '../redux/slices/chatSlice';
import {markAsReadMessage} from '../redux/thunks/chatThunks';
import { navigate } from '../component/NavigationService';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({children, userId, token}) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userId && token) {
      const newSocket = io(`http://${process.env.API_URL}:3055`, {
        auth: {
          userId,
          token,
        },
      });

      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('✅ Socket connected:', newSocket.id);
        newSocket.emit("connected_user", userId);
        setIsConnected(true);
      });

      newSocket.on('connect_error', err => {
        console.log('❌ Socket connection error:', err.message);
        setIsConnected(false);
      });

      newSocket.on('disconnect', () => {
        console.log('⚠️ Socket disconnected');
        setIsConnected(false);
      });

      newSocket.on('receive_message', data => {
        console.log('📩 Message received:', data);
        dispatch(receiveMessage(data));
        dispatch(markAsReadMessage(data.conversation_id));
      });

      newSocket.on('conversation_updated', data => {
        console.log('🔄 Conversation updated:', data);
        dispatch(updateLastMessageConversation(data));
      });

      newSocket.on('message_revoked', data => {
        console.log('🔄 Message revoked:', data);
        dispatch(updateMessageStatus(data));
      });

      newSocket.on('message_deleted', data => {
        console.log('🗑️ Message deleted:', data);
        dispatch(updateMessageStatus(data));
      });

      newSocket.on('reaction_addded', data => {
        console.log('🗑️ Reaction added:', data);
        dispatch(updateMessageStatus(data));
      });

      newSocket.on('reaction_removed', data => {
        console.log('🗑️ Reaction removed:', data);
        dispatch(updateMessageStatus(data));
      });

      newSocket.on('user_status', data => {
        console.log('👤 User status update:', data);
      });

      const createConversationHandler = (data) => {
        dispatch(addConversation(data));
      };

      const updateConversationMembersHandler = (data) => {
          if (data.status === "add-members") {
              if(data.newUserIdList.includes(userId)) dispatch(addConversation(data));
              else dispatch(updateConv(data));
          } else {
              if (userId === data.removedUser._id) {
                dispatch(removeConversation(data));
                navigate('MainApp');
              }
              else dispatch(updateConv(data));
          }
      };

      const updateConversationHandler = (data) => {
          if (data.delete_group) navigate('MainApp');
          dispatch(updateConv(data));
      };

      newSocket.on("create_conversation", createConversationHandler);
      newSocket.on("update_conversation_members", updateConversationMembersHandler);
      newSocket.on("update_conversation", updateConversationHandler);

      return () => {
            newSocket.disconnect();
            setIsConnected(false);
            newSocket.off("create_conversation", createConversationHandler);
            newSocket.off("update_conversation_members", updateConversationMembersHandler);
            newSocket.off("update_conversation", updateConversationHandler);
      };
    }

    if (!userId && socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  }, [userId, token, dispatch]);

  const joinConversation = conversationId => {
    if (socket && isConnected) {
      socket.emit('join_conversation', conversationId);
    }
  };

  const sendMessage = messageData => {
    if (socket && isConnected) {
      socket.emit('send_message', messageData);
    }
  };

  const startTyping = (conversationId, user) => {
    if (socket && isConnected) {
      socket.emit('typing', {conversation_id: conversationId, user});
    }
  };

  const stopTyping = conversationId => {
    if (socket && isConnected) {
      socket.emit('stop_typing', {conversation_id: conversationId});
    }
  };

  const markMessageRead = conversationId => {
    if (socket && isConnected) {
      socket.emit('mark_read', {conversation_id: conversationId});
    }
  };

  const revokeMessageSocket = data => {
    if (socket && isConnected) {
      socket.emit('revoke_message', data);
    }
  };

  const deleteMessageSocket = data => {
    if (socket && isConnected) {
      socket.emit('delete_message', data);
    }
  };

  const addReactionSocket = data => {
    if (socket && isConnected) {
      socket.emit('add_reaction', data);
    }
  };

  const removeReactionSocket = data => {
    if (socket && isConnected) {
      socket.emit('remove_reaction', data);
    }
  };

  const disconnectSocket = () => {
    if (socket && isConnected) {
      socket.emit('disconnect');
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        joinConversation,
        sendMessage,
        startTyping,
        stopTyping,
        markMessageRead,
        revokeMessageSocket,
        deleteMessageSocket,
        addReactionSocket,
        removeReactionSocket,
        disconnectSocket,
      }}>
      {children}
    </SocketContext.Provider>
  );
};
