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
import {
  receiveFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  cancelFriendRequest,
  unfriendUser,

} from '../redux/slices/friendSlice';
import {markAsReadMessage} from '../redux/thunks/chatThunks';
import {navigate} from '../component/NavigationService';
import {calling, callUser} from '../redux/slices/callSlice';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({children, userId, token}) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log({
      userId,
      token,
    });
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
        newSocket.emit('connected_user', userId);
        setIsConnected(true);
      });

      newSocket.on('connect_error', err => {
        console.log('❌ Socket connection error:', err.message);
        setTimeout(() => {
          newSocket.connect();
        }, 1000);
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

      const createConversationHandler = data => {
        dispatch(addConversation(data));
      };

      newSocket.on('receive_friend_request', data => {
        console.log('📩 Nhận lời mời kết bạn:', data);
        dispatch(receiveFriendRequest(data));
      });

      newSocket.on('receive_user_blocked', data => {
        console.log('🚫 Nhận thông báo người dùng bị chặn:', data);
        dispatch(receiveFriendRequest(data));
      });

      newSocket.on('friend_request_accepted', data => {
        console.log('✅ Lời mời kết bạn được chấp nhận:', data);
        dispatch(acceptFriendRequest(data));
      });

      newSocket.on('friend_request_accept_success', data => {
        console.log('✅ Chấp nhận lời mời kết bạn thành công:', data);
        dispatch(acceptFriendRequest(data));
      });

      newSocket.on('friend_request_declined', data => {
        console.log('❌ Lời mời kết bạn bị từ chối:', data);
        dispatch(declineFriendRequest(data));
      });

      newSocket.on('friend_request_canceled', data => {
        console.log('🗑️ Lời mời kết bạn bị hủy:', data);
        dispatch(cancelFriendRequest(data));
      });

      newSocket.on('user_blocked', data => {
        console.log('🚫 Người dùng đã bị chặn:', data)
        dispatch(receiveFriendRequest(data));
      });

      newSocket.on('user_unfriended', data => {
        console.log('👤 Đã bị hủy kết bạn:', data);
        dispatch(unfriendUser(data));
      });

      const updateConversationMembersHandler = data => {
        if (data.status === 'add-members') {
          if (data.newUserIdList.includes(userId))
            dispatch(addConversation(data));
          else dispatch(updateConv(data));
        } else {
          if (userId === data.removedUser._id) {
            dispatch(removeConversation(data));
            navigate('MainApp');
          } else dispatch(updateConv(data));
        }
      };

      const updateConversationHandler = data => {
        if (data.delete_group) navigate('MainApp');
        dispatch(updateConv(data));
      };

      const answerHandler = data => {
        navigate('ChatMessage', {
          conversationId: data.conversationId,
        });

        dispatch(callUser(data));
      };

      const callingHandler = () => {
        dispatch(calling(true));
      };

      newSocket.on('answer_user_mobile', answerHandler);
      newSocket.on('calling_mobile', callingHandler);
      newSocket.on('create_conversation', createConversationHandler);
      newSocket.on(
        'update_conversation_members',
        updateConversationMembersHandler,
      );
      newSocket.on('update_conversation', updateConversationHandler);

      return () => {
        newSocket.disconnect();
        setIsConnected(false);
        newSocket.off('create_conversation', createConversationHandler);
        newSocket.off(
          'update_conversation_members',
          updateConversationMembersHandler,
        );
        newSocket.off('update_conversation', updateConversationHandler);
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

  const sendFriendRequestSocket = (
    toUserId,
    message = 'Bạn có một lời mời kết bạn mới!',
  ) => {
    if (socket && isConnected) {
      socket.emit('send_friend_request', {
        fromUserId: userId,
        toUserId,
        message,
      });
    }
  };

  const blockUserSocket = (
    toUserId,
    message = 'Bạn đã chặn người dùng này.',
  ) => {
    if (socket && isConnected) {
      socket.emit('user_blocked', {
        fromUserId: userId,
        toUserId,
        message,
      });
    }
  }

  const unblockUserSocket = toUserId => {
    if (socket && isConnected) {
      socket.emit('user_unblocked', {fromUserId: userId, toUserId});
    }
  };

  const acceptFriendRequestSocket = toUserId => {
    if (socket && isConnected) {
      socket.emit('friend_request_accepted', {fromUserId: userId, toUserId});
      socket.emit('friend_request_accept_success', {toUserId});
    }
  };

  const declineFriendRequestSocket = fromUserId => {
    if (socket && isConnected) {
      socket.emit('friend_request_declined', {fromUserId, toUserId: userId});
    }
  };

  const cancelFriendRequestSocket = toUserId => {
    if (socket && isConnected) {
      socket.emit('friend_request_canceled', {fromUserId: userId, toUserId});
    }
  };

  const unfriendSocket = friendUserId => {
    if (socket && isConnected) {
      socket.emit('user_unfriended', {
        fromUserId: userId,
        toUserId: friendUserId,
      });
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
        sendFriendRequestSocket,
        acceptFriendRequestSocket,
        declineFriendRequestSocket,
        cancelFriendRequestSocket,
        unfriendSocket,
        blockUserSocket,
        unblockUserSocket
      }}>
      {children}
    </SocketContext.Provider>
  );
};
