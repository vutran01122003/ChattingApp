import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import {
  getConversation,
  getConversationMessages,
  sendMessage,
  markAsReadMessage,
  sendMessageWithFiles,
} from '../redux/thunks/chatThunks';
import {
  currentConversationSelector,
  messagePaginationSelector,
  messagesSelector,
  userSelector,
} from '../redux/selector';
import { launchImageLibrary } from 'react-native-image-picker';
import FullscreenMediaViewer from './FullScreenMediaViewer';
import { clearCurrentConversation } from '../redux/slices/chatSlice';
import { useSocket } from '../context/SocketContext';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageList from './MessageList';
import { getUserInfo } from '../redux/slices/userSlice';
import { pick, types } from '@react-native-documents/picker';
import {
  sendFriendRequest,
  checkFriendShip,
  checkSendRequest,
  checkReceiveRequest,
  cancelFriendRequest,
  acceptFriendRequest,
  unfriend,
  getFriendList,
} from '../redux/slices/friendSlice';

const ChatMessageScreen = ({ route }) => {
  const navigation = useNavigation();
  const isFocus = useIsFocused();
  const dispatch = useDispatch();
  const { conversationId } = route.params;

  const currentConversation = useSelector(currentConversationSelector);
  const messagePagination = useSelector(messagePaginationSelector);
  const messages = useSelector(messagesSelector);
  const user = useSelector(userSelector);

  const {
    socket,
    isConnected,
    joinConversation,
    sendMessage: emitMessage,
    startTyping,
    stopTyping,
    markMessageRead,
    revokeMessageSocket,
    deleteMessageSocket,
    addReactionSocket,
    removeReactionSocket,
    sendFriendRequestSocket,
    acceptFriendRequestSocket,
    declineFriendRequestSocket,
    cancelFriendRequestSocket,
    unfriendSocket,
  } = useSocket();
  const [fullscreenMedia, setFullscreenMedia] = useState({
    visible: false,
    type: null,
    source: null,
  });
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState();
  const [isSending, setIsSending] = useState(false);
  const [restUser, setRestUser] = useState(null);
  const flatListRef = useRef(null);
  const hasScrolledToTop = useRef(false);
  const typingTimeoutRef = useRef(null);
  const { isFriend, isSentRequest, isReceiveRequest } = useSelector(
    state => state.friend,
  );

  const loadFriendshipStatus = () => {
    if (!restUser?._id) {
      console.warn(`restUser không hợp lệ:`, restUser);
      return;
    }
    if (!user?._id) {
      console.error(`clientId không hợp lệ khi tải trạng thái:`, user);
      return;
    }
    dispatch(checkFriendShip({ friendId: restUser._id }));
    dispatch(checkSendRequest({ friendId: restUser._id }));
    dispatch(checkReceiveRequest({ friendId: restUser._id }));
  };

  useEffect(() => {
    if (
      currentConversation &&
      currentConversation.conversation_type !== 'group'
    ) {
      setRestUser(currentConversation.other_user[0]);
    }
  }, [currentConversation]);

  useEffect(() => {
    if (restUser) {
      loadFriendshipStatus();
    }
  }, [restUser]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on('receive_friend_request', () => {
      dispatch(checkReceiveRequest({ friendId: restUser._id }));
    });

    socket.on('friend_request_accepted', () => {
      dispatch({ type: 'friend/setIsFriend', payload: true });
      dispatch(getFriendList());
    });

    socket.on('friend_request_accepted_success', () => {
      dispatch(checkSendRequest({ friendId: restUser._id }));
      dispatch({ type: 'friend/setIsFriend', payload: true });
    });

    socket.on('friend_request_declined', () => {
      dispatch(checkSendRequest({ friendId: restUser._id }));
    });

    socket.on('friend_request_canceled', () => {
      dispatch(checkReceiveRequest({ friendId: restUser._id }));
    });

    socket.on('user_unfriended', () => {
      dispatch(checkFriendShip({ friendId: restUser._id }));
      dispatch(getFriendList());
    });

    return () => {
      socket.off('receive_friend_request');
      socket.off('friend_request_accepted');
      socket.off('friend_request_accepted_success');
      socket.off('friend_request_declined');
      socket.off('friend_request_canceled');
      socket.off('user_unfriended');
    };
  }, [socket, isConnected, restUser, dispatch]);

  const handleSendFriendRequest = async () => {
    try {
      await dispatch(sendFriendRequest({ friendId: restUser._id }));
      sendFriendRequestSocket(restUser._id);
      dispatch(checkSendRequest({ friendId: restUser._id }));
    } catch (error) {
      console.error('Send friend request failed:', error);
    }
  };

  const handleCancelFriendRequest = async () => {
    try {
      await dispatch(cancelFriendRequest({ friendId: restUser._id }));
      cancelFriendRequestSocket(restUser._id);
      dispatch(checkSendRequest({ friendId: restUser._id }));
    } catch (error) {
      console.error('Cancel friend request failed:', error);
    }
  };

  const handleAcceptFriendRequest = async () => {
    try {
      await dispatch(acceptFriendRequest({ friendId: restUser._id }));
      acceptFriendRequestSocket(restUser._id);
      setTimeout(() => {
        loadFriendshipStatus();
      }, 1000);
    } catch (error) {
      console.error('Accept friend request failed:', error);
    }
  };

  const handleUnfriend = async () => {
    try {
      await dispatch(unfriend({ friendId: restUser._id }));
      unfriendSocket(restUser._id);
      dispatch(checkFriendShip({ friendId: restUser._id }));
    } catch (error) {
      console.error('Unfriend failed:', error);
    }
  };

  const getUserLogin = async () => {
    await dispatch(getUserInfo());
  };

  useEffect(() => {
    if (isFocus) {
      dispatch(getConversation(conversationId));
      getUserLogin();
    }

    return () => {
      if (currentConversation) {
        dispatch(clearCurrentConversation());
      }
    };
  }, [isFocus]);

  useEffect(() => {
    if (currentConversation) {
      dispatch(
        getConversationMessages({
          conversationId: currentConversation.conversation_id,
          page: messagePagination.page,
          limit: messagePagination.limit,
        }),
      );

      if (isConnected) {
        joinConversation(currentConversation.conversation_id);
        dispatch(markAsReadMessage(currentConversation.conversation_id));
        markMessageRead(currentConversation.conversation_id);
      }
    }
  }, [currentConversation, isConnected]);

  useEffect(() => {
    if (socket && isConnected && currentConversation && user) {
      socket.on('user_typing', data => {
        if (
          data.user._id !== user._id &&
          data.conversation_id === currentConversation.conversation_id
        ) {
          setTypingUsers(data.user);
        }
      });

      socket.on('user_stop_typing', () => {
        setTypingUsers(null);
      });

      return () => {
        socket.off('user_typing');
        socket.off('user_stop_typing');
      };
    }
  }, [socket, isConnected, currentConversation, user]);

  const handleInputChange = text => {
    setInputText(text);

    if (isConnected && currentConversation) {
      if (!isTyping) {
        setIsTyping(true);
        startTyping(currentConversation.conversation_id, user);
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        stopTyping(currentConversation.conversation_id);
      }, 1500);
    }
  };

  const openFullscreenMedia = (type, source) => {
    setFullscreenMedia({
      visible: true,
      type,
      source,
    });
  };

  const closeFullscreenMedia = () => {
    setFullscreenMedia({
      visible: false,
      type: null,
      source: null,
    });
  };

  const renderDateHeader = date => {
    return (
      <View className="items-center my-3">
        <Text className="bg-gray-100 text-black px-3 py-1 rounded-lg text-xs">
          {date}
        </Text>
      </View>
    );
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !currentConversation) return;

    const messageContent = inputText.trim();
    setInputText('');
    setIsSending(true);

    try {
      const newMessage = await dispatch(
        sendMessage({
          conversationId: currentConversation.conversation_id,
          content: messageContent,
        }),
      );

      emitMessage(newMessage.payload);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);

      if (isTyping) {
        setIsTyping(false);
        stopTyping(currentConversation.conversation_id);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }
    }
  };

  const renderTypingIndicator = () => {
    if (typingUsers) {
      return (
        <View className="flex-row items-center p-2 ml-10">
          <View className="bg-gray-200 rounded-full px-3 py-1">
            <Text className="text-gray-600 text-xs">
              {typingUsers.full_name} đang nhập...
            </Text>
          </View>
        </View>
      );
    }
    return null;
  };

  if (!currentConversation) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text className="text-black mt-4">Đang tải tin nhắn...</Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#000" />
        <Text className="text-black mt-4">Đang tải người dùng...</Text>
      </SafeAreaView>
    );
  }

  const handlePickMedia = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'mixed',
        includeBase64: true,
        selectionLimit: 3,
      });

      if (result.assets && result.assets.length > 0) {
        const formData = new FormData();
        formData.append('conversation_id', currentConversation.conversation_id);

        result.assets.forEach(file => {
          const type = file.type.split('/')[0];
          if (type === 'video' && file.fileSize > 50 * 1024 * 1024) {
            Alert.alert('Lỗi', 'Kích thước file quá lớn (tối đa 50MB)');
            return;
          } else if (type === 'video' && result.assets.length > 1) {
            Alert.alert('Lỗi', 'Chỉ được gửi 1 video trong 1 lần');
            return;
          } else if (type === 'image' && file.fileSize > 5 * 1024 * 1024) {
            Alert.alert('Lỗi', 'Kích thước file quá lớn (tối đa 5MB)');
            return;
          }

          formData.append('files', {
            uri: file.uri,
            name: file.fileName,
            type: file.type,
          });
        });

        setIsSending(true);
        const res = await dispatch(sendMessageWithFiles(formData));
        emitMessage(res.payload);
      } else if (!result.assets) {
        Alert.alert('Lỗi', 'Chỉ được chọn tối đa 3 hình ảnh hoặc 1 video');
        return;
      }
    } catch (error) {
      console.error('Failed to pick image/video:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handlePickFile = async () => {
    try {
      const [file] = await pick({
        type: [
          types.pdf,
          types.doc,
          types.docx,
          types.xls,
          types.xlsx,
          types.ppt,
          types.pptx,
          types.pdf,
          types.plainText,
        ],
        copyTo: 'cachesDirectory',
      });

      if (file.size > 10 * 1024 * 1024) {
        Alert.alert('Lỗi', 'Kích thước file quá lớn (tối đa 10MB)');
        return;
      }

      const formData = new FormData();
      formData.append('conversation_id', currentConversation.conversation_id);

      formData.append('files', {
        uri: file.uri,
        name: file.name,
        type: file.type,
      });

      setIsSending(true);

      const res = await dispatch(sendMessageWithFiles(formData));
      emitMessage(res.payload);
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.error('Failed to pick file:', error);
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#3B82F6" />
      <View className="mt-12"></View>
      <ChatHeader
        navigation={navigation}
        dispatch={dispatch}
        currentConversation={currentConversation}
        authUser={user}
        restUser={restUser}
      />

      <View className="bg-gray-100 py-2 flex-row justify-center">
        <View className="flex-row items-center">
          <Icon name="user-plus" size={16} color="#666" />

          <TouchableOpacity
            onPress={
              isFriend
                ? handleUnfriend
                : isSentRequest
                ? handleCancelFriendRequest
                : isReceiveRequest
                ? handleAcceptFriendRequest
                : handleSendFriendRequest
            }
            className="flex-row items-center ml-2">
            {isFriend ? (
              <Text className="text-gray-700 text-sm ml-1">Xóa kết bạn</Text>
            ) : isSentRequest ? (
              <Text className="text-gray-700 text-sm ml-1">Hủy yêu cầu</Text>
            ) : isReceiveRequest ? (
              <Text className="text-gray-700 text-sm ml-1">Đồng ý kết bạn</Text>
            ) : (
              <Text className="text-gray-700 text-sm ml-1">
                Gửi yêu cầu kết bạn
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <MessageList
        flatListRef={flatListRef}
        messages={messages}
        renderDateHeader={renderDateHeader}
        renderTypingIndicator={renderTypingIndicator}
        hasScrolledToTop={hasScrolledToTop}
        dispatch={dispatch}
        messagePagination={messagePagination}
        currentUserId={user._id}
        openFullscreenMedia={openFullscreenMedia}
        currentConversation={currentConversation}
        revokeMessageSocket={revokeMessageSocket}
        deleteMessageSocket={deleteMessageSocket}
        addReactionSocket={addReactionSocket}
        removeReactionSocket={removeReactionSocket}
      />

      <View className="mt-2"></View>
      <MessageInput
        inputText={inputText}
        handleInputChange={handleInputChange}
        isSending={isSending}
        handleSendMessage={handleSendMessage}
        onPickMedia={handlePickMedia}
        onPickFile={handlePickFile}
        conversation={currentConversation}
        authUser={user}
      />
      <FullscreenMediaViewer
        visible={fullscreenMedia.visible}
        onClose={closeFullscreenMedia}
        source={fullscreenMedia.source}
      />
    </SafeAreaView>
  );
};

export default ChatMessageScreen;