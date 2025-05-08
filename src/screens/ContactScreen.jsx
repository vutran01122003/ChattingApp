import React, { useEffect, useState } from 'react';
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
import { getFriendList, unfriendUser } from '../redux/slices/friendSlice';
import { useNavigation } from '@react-navigation/native';
import { useSocket } from '../context/SocketContext';
import {
  groupConversationsSelector,
} from '../redux/selector';
import {fetchAllConversations} from '../redux/thunks/chatThunks';

export default function ContactScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { friendList, loading, error } = useSelector((state) => state.friend);
  const { unfriendSocket } = useSocket();
  const [activeTab, setActiveTab] = useState('Bạn bè');
  const groupConversation = useSelector(groupConversationsSelector);

    useEffect(() => {
      dispatch(fetchAllConversations());
    }, [ dispatch]);

    const groups = [
      ...groupConversation,
    ].sort((a, b) => {
      return new Date(b.last_message_time) - new Date(a.last_message_time);
    });

  useEffect(() => {
    if (activeTab === 'Bạn bè') {
      dispatch(getFriendList());
    }
  }, [dispatch, activeTab]);

  const handleUnfriend = (friendId) => {
    dispatch(unfriendUser({ friendId }))
      .then(() => {
        unfriendSocket(friendId);
      })
      .catch((err) => {
        console.log('Error unfriending:', err);
        alert('Không thể xóa kết bạn. Vui lòng thử lại.');
      });
  };

  const renderFriendsTab = () => {
    if (loading) {
      return <Text className="p-4 text-center">Loading...</Text>;
    }

    if (error) {
      return <Text className="p-4 text-center">Error: {error}</Text>;
    }

    return (
      <>
        <TouchableOpacity
          className="flex-row items-center p-4"
          onPress={() => navigation.navigate('FriendRequestScreen')}
        >
          <View className="w-10 h-10 rounded-full bg-blue-500 items-center justify-center mr-3">
            <Icon name="users" size={20} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-base">Lời mời kết bạn</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center p-4">
          <View className="w-10 h-10 rounded-full bg-blue-500 items-center justify-center mr-3">
            <Icon name="book" size={20} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-base">Danh bạ máy</Text>
            <Text className="text-gray-500 text-sm">Liên hệ có dùng Zalo</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center p-4">
          <View className="w-10 h-10 rounded-full bg-blue-500 items-center justify-center mr-3">
            <Icon name="gift" size={20} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-base">Sinh nhật</Text>
          </View>
        </TouchableOpacity>

        <View className="flex-row px-4 py-2">
          <TouchableOpacity className="bg-gray-200 rounded-full px-4 py-1 mr-2">
            <Text>{`Tất cả ${friendList.length}`}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-gray-200 rounded-full px-4 py-1">
            <Text>Mới truy cập</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1">
          {friendList && friendList.length > 0 ? (
            friendList.map((friend, index) => {
              const firstLetter =
                friend.full_name && typeof friend.full_name === 'string'
                  ? friend.full_name.charAt(0).toUpperCase()
                  : 'A';
              return (
                <React.Fragment key={index}>
                  {index === 0 ||
                  friendList[index - 1].full_name.charAt(0).toUpperCase() !==
                    firstLetter ? (
                    <Text className="px-4 py-1 bg-gray-100 text-gray-500">
                      {firstLetter}
                    </Text>
                  ) : null}
                  <View className="flex-row items-center p-4">
                    <Image
                      source={{
                        uri: friend.avatar_url || 'https://via.placeholder.com/50',
                      }}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <View className="flex-1">
                      <Text className="text-base">{friend.full_name}</Text>
                    </View>
                    <TouchableOpacity className="mr-3">
                      <Icon name="phone" size={20} color="#4B5563" />
                    </TouchableOpacity>
                    <TouchableOpacity className="mr-3">
                      <Icon name="message-circle" size={20} color="#4B5563" />
                    </TouchableOpacity>
                  </View>
                </React.Fragment>
              );
            })
          ) : (
            <Text className="text-center text-gray-500 py-4">
              Không tìm thấy bạn bè
            </Text>
          )}
        </ScrollView>
      </>
    );
  };

  const renderGroupCreationOptions = () => (
    <View className="bg-white p-4 mb-2">
      <View className="flex-row items-center mb-4">
        <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center mr-3">
          <Icon name="users" size={24} color="#0091FF" />
        </View>
        <Text className="text-base font-medium">Tạo nhóm</Text>
      </View>
    </View>
  );

  const renderGroupList = () => (
    <View className="flex-1">
      <View className="flex-row justify-between items-center px-4 py-2 bg-gray-100">
        <Text className="text-gray-600 font-medium">Nhóm đang tham gia ({groups.length})</Text>
        <Text className="text-gray-600">Hoạt động cuối</Text>
      </View>
      
      <ScrollView className="flex-1">
        {groups.map((group) => (
          <TouchableOpacity key={group._id} className="p-3 border-b border-gray-200">
            <View className="flex-row">
              <View className="relative mr-3">
              <Image
                    source={{ uri: group.group_avatar }}
                    className="w-12 h-12 rounded-lg"
                  />
                {group.participants && (
                  <View className="absolute -bottom-1 -right-1 bg-gray-200 rounded-full px-1.5 py-0.5">
                    <Text className="text-xs">{group.participants ? group.participants.length : 0}</Text>
                  </View>
                )}
              </View>
              <View className="flex-1">
                <View className="flex-row justify-between">
                  <Text className="font-medium text-base flex-1">{group.group_name}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );


  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar backgroundColor="#0091FF" barStyle="light-content" />
      <View className="flex-row border-b border-gray-200">
        <TouchableOpacity 
          className={`flex-1 py-3 items-center ${activeTab === 'Bạn bè' ? 'border-b-2 border-blue-500' : ''}`}
          onPress={() => setActiveTab('Bạn bè')}
        >
          <Text className={activeTab === 'Bạn bè' ? 'text-blue-500 font-medium' : 'text-gray-500'}>Bạn bè</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className={`flex-1 py-3 items-center ${activeTab === 'Nhóm' ? 'border-b-2 border-blue-500' : ''}`}
          onPress={() => setActiveTab('Nhóm')}
        >
          <Text className={activeTab === 'Nhóm' ? 'text-blue-500 font-medium' : 'text-gray-500'}>Nhóm</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'Bạn bè' && renderFriendsTab()}
      {activeTab === 'Nhóm' && (
        <>
          {renderGroupCreationOptions()}
          {renderGroupList()}
        </>
      )}
    </SafeAreaView>
  );
}