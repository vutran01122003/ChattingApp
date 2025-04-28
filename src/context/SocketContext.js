import React, {createContext, useContext, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {io} from 'socket.io-client';
import {
  receiveMessage,
  updateConversation,
  updateMessageStatus,
} from '../redux/slices/chatSlice';
import {markAsReadMessage} from '../redux/thunks/chatThunks';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({children, userId, token}) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userId && token) {
      const newSocket = io(`http://${process.env.API_URL}:3055`, {
        transports: ['websocket'],
        auth: {
          userId,
          token,
        },
      });

      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('✅ Socket connected:', newSocket.id);
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
        dispatch(updateConversation(data));
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

      return () => {
        newSocket.disconnect();
        setIsConnected(false);
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
