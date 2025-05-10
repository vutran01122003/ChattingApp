import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import {
  getReceivedRequests,
  getSentRequests,
  declineFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest,
  checkFriendShip,
  getFriendList,
  checkSendRequest,
  checkReceiveRequest,
} from '../redux/slices/friendSlice';
import { useSocket } from '../context/SocketContext';

export default function FriendRequestScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { socket, isConnected, acceptFriendRequestSocket, declineFriendRequestSocket, cancelFriendRequestSocket } = useSocket();

  const { receivedRequests, sentRequests, loading, error } = useSelector(
    state => state.friend,
  );
  const [activeTab, setActiveTab] = useState('received');


  useEffect(() => {
    if (activeTab === 'received') {
      dispatch(getReceivedRequests());
    } else if (activeTab === 'sent') {
      dispatch(getSentRequests());
    }
  }, [dispatch, activeTab]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on('receive_friend_request', () => {
      if (activeTab === 'received') {
        dispatch(getReceivedRequests());
      }
    });

    socket.on('friend_request_accepted', () => {
      if (activeTab === 'sent') {
        dispatch(getSentRequests());
      }
    });

    socket.on('friend_request_accepted_success', () => {
      if (activeTab === 'received') {
        dispatch(getReceivedRequests());
      }
    });

    socket.on('friend_request_declined', () => {
      if (activeTab === 'sent') {
        dispatch(getSentRequests());
      }
    });

    socket.on('friend_request_canceled', () => {
      if (activeTab === 'received') {
        dispatch(getReceivedRequests());
      }
    });

    return () => {
      socket.off('receive_friend_request');
      socket.off('friend_request_accepted');
      socket.off('friend_request_accepted_success');
      socket.off('friend_request_declined');
      socket.off('friend_request_canceled');
    };
  }, [socket, isConnected, activeTab, dispatch]);

  const handleDeclineRequest = friendId => {
    dispatch(declineFriendRequest({ friendId }))
      .then(() => {
        declineFriendRequestSocket(friendId);
        setTimeout(() => {
          dispatch(getReceivedRequests());
        }, 1000);
      })
      .catch(error => {
        console.log('Error declining friend request:', error);
      });
  };

  const handleCancelRequest = friendId => {
    dispatch(cancelFriendRequest({ friendId }))
      .then(() => {
        cancelFriendRequestSocket(friendId);
        setTimeout(() => {
          dispatch(getSentRequests());
        }, 1000);
      })
      .catch(error => {
        console.log('Error canceling friend request:', error);
      });
  };

  const handleAcceptRequest = (friendId) => {
    dispatch(acceptFriendRequest({ friendId }))
      .then(() => {
        acceptFriendRequestSocket(friendId);
        dispatch(getFriendList()); // Làm mới danh sách bạn bè
        dispatch(getReceivedRequests()); // Làm mới danh sách lời mời
        // Kiểm tra trạng thái quan hệ
        dispatch(checkFriendShip({ friendId }));
        dispatch(checkSendRequest({ friendId }));
        dispatch(checkReceiveRequest({ friendId }));
      })
      .catch((error) => {
        console.log('Error accepting friend request:', error);
        alert('Không thể chấp nhận lời mời kết bạn. Vui lòng thử lại.');
      });
  };

  const renderRequests = () => {
    const requests = activeTab === 'received' ? receivedRequests : sentRequests;

    return requests.length > 0 ? (
      requests.map((friend, index) => (
        <View key={index} className="p-4 border-b border-gray-100">
          <View className="flex-row">
            <Image
              source={{ uri: friend.avatar || 'https://via.placeholder.com/50' }}
              className="w-12 h-12 rounded-full mr-3"
            />
            <View className="flex-1">
              <Text className="font-medium text-base">{friend.full_name}</Text>
              <Text className="text-gray-500 text-sm">{friend.time}</Text>
            </View>
          </View>

          <View className="flex-row justify-between mt-2">
            {activeTab === 'received' ? (
              <>
                <TouchableOpacity
                  className="bg-gray-100 rounded-md py-2 px-6"
                  onPress={() => handleDeclineRequest(friend._id)}
                >
                  <Text className="text-center text-gray-700">Từ chối</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-blue-100 rounded-md py-2 px-6"
                  onPress={() => handleAcceptRequest(friend._id)}
                >
                  <Text className="text-center text-blue-500">Đồng ý</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                className="bg-gray-100 rounded-md py-2 px-6"
                onPress={() => handleCancelRequest(friend._id)}
              >
                <Text className="text-center text-gray-700">Thu hồi</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))
    ) : (
      <Text className="text-center text-gray-500 py-4">
        Không có yêu cầu nào
      </Text>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar backgroundColor="#0091FF" barStyle="light-content" />

      <View className="bg-blue-500 px-4 py-3 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <TouchableOpacity
            className="mr-3"
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-left" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold">
            Lời mời kết bạn
          </Text>
        </View>
        <TouchableOpacity>
          <Icon name="settings" size={22} color="white" />
        </TouchableOpacity>
      </View>

      <View className="flex-row border-b border-gray-200">
        <TouchableOpacity
          className={`flex-1 py-3 items-center ${
            activeTab === 'received' ? 'border-b-2 border-blue-500' : ''
          }`}
          onPress={() => setActiveTab('received')}
        >
          <Text
            className={`text-base ${
              activeTab === 'received' ? 'text-blue-500' : 'text-gray-500'
            }`}
          >
            Đã nhận {receivedRequests.length}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 py-3 items-center ${
            activeTab === 'sent' ? 'border-b-2 border-blue-500' : ''
          }`}
          onPress={() => setActiveTab('sent')}
        >
          <Text
            className={`text-base ${
              activeTab === 'sent' ? 'text-blue-500' : 'text-gray-500'
            }`}
          >
            Đã gửi {sentRequests.length}
          </Text>
        </TouchableOpacity>
      </View>

      {loading && <Text className="text-center py-4">Đang tải...</Text>}
      {error && <Text className="text-center text-red-500 py-4">{error}</Text>}

      <ScrollView className="flex-1">{renderRequests()}</ScrollView>

      <TouchableOpacity className="items-center py-4">
        <View className="flex-row items-center">
          <Text className="text-gray-800 font-medium mr-1">XEM THÊM</Text>
          <Icon name="chevron-down" size={16} color="#4B5563" />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}