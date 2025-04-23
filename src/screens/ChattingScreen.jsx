import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import { sendFriendRequest, checkFriendShip, checkSendRequest, cancelFriendRequest, checkReceiveRequest, acceptFriendRequest, unfriend } from '../redux/slices/friendSlice'; // Import necessary actions

export default function ChatScreen({ route, navigation }) {
  const { userId, userName, userAvatar } = route.params;
  const dispatch = useDispatch();

  // Fetch the friend relationship and request status from Redux store
  const { isFriend, isSentRequest, isReceiveRequest } = useSelector(state => state.friend);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check friendship, sent request, and received request statuses when the screen loads
    dispatch(checkFriendShip({ friendId: userId }));
    dispatch(checkSendRequest({ friendId: userId }));
    dispatch(checkReceiveRequest({ friendId: userId }));
  }, [dispatch, userId]);

  // Send friend request
  const handleSendFriendRequest = async () => {
    try {
      await dispatch(sendFriendRequest({ friendId: userId }));
      dispatch(checkSendRequest({ friendId: userId }));  // Re-fetch after sending request
    } catch (error) {
      console.error('Send friend request failed:', error);
    }
  };

  // Cancel friend request
  const handleCancelFriendRequest = async () => {
    try {
      await dispatch(cancelFriendRequest({ friendId: userId }));
      dispatch(checkSendRequest({ friendId: userId }));  // Re-fetch after canceling request
    } catch (error) {
      console.error('Cancel friend request failed:', error);
    }
  };

  // Accept friend request
  const handleAcceptFriendRequest = async () => {
    try {
      await dispatch(acceptFriendRequest({ friendId: userId }));
      dispatch(checkFriendShip({ friendId: userId }));  // Re-fetch after accepting the request
    } catch (error) {
      console.error('Accept friend request failed:', error);
    }
  };

  // Unfriend
  const handleUnfriend = async () => {
    try {
      await dispatch(unfriend({ friendId: userId }));
      dispatch(checkFriendShip({ friendId: userId }));  // Re-fetch after unfriending
    } catch (error) {
      console.error('Unfriend failed:', error);
    }
  };

  // Function to send a message
  const sendMessage = () => {
    console.log('Message sent:', message);
    setMessage('');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar backgroundColor="#1E88E5" barStyle="light-content" />
      <View className="bg-blue-500 py-3 px-4 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-medium ml-3">{userName}</Text>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity className="mr-5">
            <Icon name="phone" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity className="mr-5">
            <Icon name="video" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="more-vertical" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="bg-gray-100 py-2 flex-row justify-center">
        <View className="flex-row items-center">
          <Icon name="user-plus" size={16} color="#666" />

          <TouchableOpacity onPress={isFriend ? handleUnfriend : (isSentRequest ? handleCancelFriendRequest : (isReceiveRequest ? handleAcceptFriendRequest : handleSendFriendRequest))} className="flex-row items-center ml-2">
            {isFriend ? (
              <Text className="text-gray-700 text-sm ml-1">Xóa kết bạn</Text>
            ) : isSentRequest ? (
              <Text className="text-gray-700 text-sm ml-1">Hủy yêu cầu</Text>
            ) : isReceiveRequest ? (
              <Text className="text-gray-700 text-sm ml-1">Đồng ý kết bạn</Text>
            ) : (
              <Text className="text-gray-700 text-sm ml-1">Gửi yêu cầu kết bạn</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View className="border-t border-gray-200 p-2 bg-white flex-row items-center">
        <TouchableOpacity className="mr-2">
          <Icon name="smile" size={24} color="#999" />
        </TouchableOpacity>
        <TextInput
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2"
          placeholder="Tin nhắn"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity onPress={sendMessage}>
          <Icon name="send" size={24} color="#1E88E5" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
