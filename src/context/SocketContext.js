import React, {createContext, useContext, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {io} from 'socket.io-client';
import {receiveMessage, updateConversation} from '../redux/slices/chatSlice';

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
      });

      newSocket.on('conversation_updated', data => {
        console.log('🔄 Conversation updated:', data);
        dispatch(updateConversation(data));
      });

      newSocket.on('message_revoked', data => {
        console.log('🔄 Message revoked:', data);
        dispatch(
          updateMessageStatus({
            messageId: data._id,
            updates: {is_revoked: true},
          }),
        );
      });

      newSocket.on('message_deleted', data => {
        console.log('🗑️ Message deleted:', data);
        dispatch(
          updateMessageStatus({
            messageId: data._id,
          }),
        );
      });

      newSocket.on('message_forwarded', data => {
        console.log('↪️ Message forwarded:', data);
        dispatch(receiveMessage(data));
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

  const revokeMessageSocket = (messageId, conversationId) => {
    if (socket && isConnected) {
      socket.emit('revoke_message', {
        messageId,
        conversation_id: conversationId,
      });
    }
  };

  const deleteMessageSocket = (messageId, conversationId) => {
    if (socket && isConnected) {
      socket.emit('delete_message', {
        messageId,
        conversation_id: conversationId,
      });
    }
  };

  const forwardMessageSocket = (messageId, conversationId) => {
    if (socket && isConnected) {
      socket.emit('forward_message', {
        messageId,
        conversation_id: conversationId,
      });
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
        forwardMessageSocket,
        disconnectSocket,
      }}>
      {children}
    </SocketContext.Provider>
  );
};
