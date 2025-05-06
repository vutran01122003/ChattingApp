import React, {useEffect} from 'react';
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
import {useDispatch, useSelector} from 'react-redux';
import {getFriendList} from '../redux/slices/friendSlice';
import { useNavigation } from '@react-navigation/native';

export default function ContactScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {friendList, loading, error} = useSelector(state => state.friend); 

  useEffect(() => {
    dispatch(getFriendList());
  }, [dispatch]);

  console.log('Friend List:', friendList); 

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar backgroundColor="#0091FF" barStyle="light-content" />

      <View className="flex-row border-b border-gray-200">
        <TouchableOpacity className="flex-1 py-3 items-center border-b-2 border-blue-500">
          <Text className="text-blue-500 font-medium">Bạn bè</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 py-3 items-center">
          <Text className="text-gray-500">Nhóm</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 py-3 items-center">
          <Text className="text-gray-500">OA</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity className="flex-row items-center p-4"  onPress={() => navigation.navigate('FriendRequestScreen')}>
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
              friend.name && typeof friend.name === 'string'
                ? friend.name.charAt(0).toUpperCase()
                : 'A';
            return (
              <React.Fragment key={index}>
                <Text className="px-4 py-1 bg-gray-100 text-gray-500">
                  {firstLetter}
                </Text>
                <TouchableOpacity className="flex-row items-center p-4">
                  <Image
                    source={{
                      uri:
                        friend.avatar_url ,
                    }}
                    className="w-10 h-10 rounded-full mr-3"
                  />

                  <View className="flex-1">
                    <Text className="text-base">{friend.full_name}</Text>
                  </View>
                  <TouchableOpacity className="mr-3">
                    <Icon name="phone" size={20} color="#4B5563" />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Icon name="message-circle" size={20} color="#4B5563" />
                  </TouchableOpacity>
                </TouchableOpacity>
              </React.Fragment>
            );
          })
        ) : (
          <Text className="text-center text-gray-500 py-4">
            Không tìm thấy bạn bè
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
