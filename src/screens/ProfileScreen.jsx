import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from "@react-navigation/native"
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAweSome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { logOut } from '../redux/slices/authSlice';
import { getUserInfo } from '../redux/slices/userSlice';
function ProfileScreen({ navigation, route }) {
  const [user, setUser] = React.useState({});
  const dispatch = useDispatch();
  const isFocus = useIsFocused();
  const getUserLogin = async () => {
    const userLogin = await dispatch(getUserInfo()).unwrap();
    setUser(userLogin);
  }
  const handleLogout = async () => {
    try {
      const resultAction = await dispatch(getUserInfo());

      if (getUserInfo.fulfilled.match(resultAction)) {
        const user = resultAction.payload;
        console.log('User info:', user);
        if (!user.is_has_password) {
          navigation.navigate('CreatePassword');
        } else {
          const reuslt = await dispatch(logOut());
          console.log('Logout result:', reuslt);
          if (reuslt.meta.requestStatus === 'fulfilled') {
            await AsyncStorage.removeItem('access_token');
            await AsyncStorage.removeItem('client_id');
            await AsyncStorage.removeItem('refresh_token');
            navigation.replace('Home');
          }
        }

      } else {
        Alert.alert('Failed to fetch user info');
      }

    } catch (error) {
      Alert.alert('Something went wrong', error.message || 'Unknown error');
    }
  }
  React.useEffect(() => {
    if (isFocus) {
      getUserLogin();
    }
  }, [isFocus])
  return (
    <ScrollView className="flex-1 bg-gray-100">

      <View className="bg-white p-4 mb-2 flex-row items-center">
        <Image
          source={{ uri: user?.avatar_url || 'https://via.placeholder.com/150' }}
          className="w-16 h-16 rounded-full"
        />
        <View className="ml-4">
          <Text className="text-lg font-bold">{user?.full_name}</Text>
          <Text className="text-gray-500">Xem trang cá nhân</Text>
        </View>
      </View>

      {/* List of Options */}
      <View className="bg-white mb-2">
        <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-100">
          <View className="w-8 h-8 rounded-full items-center justify-center mr-3">
            <Ionicons name="cloud-upload-outline" size={20} color="#0084ff" />
          </View>
          <View className="flex-1">
            <Text className="font-medium">zCloud</Text>
            <Text className="text-gray-500 text-sm">Không gian lưu trữ dữ liệu trên đám mây</Text>
          </View>
          <Text className="text-gray-400">›</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-100">
          <View className="w-8 h-8 rounded-full items-center justify-center mr-3">
            <FontAweSome name="magic" size={20} color="#0084ff" />
          </View>
          <View className="flex-1">
            <Text className="font-medium">zStyle – Nổi bật trên Zalo</Text>
            <Text className="text-gray-500 text-sm">Hình nền và nhạc cho cuộc gọi Zalo</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-100">
          <View className="w-8 h-8 rounded-full items-center justify-center mr-3">
            <Ionicons name="cloud-outline" size={20} color="#0084ff" />
          </View>
          <View className="flex-1">
            <Text className="font-medium">Cloud của tôi</Text>
            <Text className="text-gray-500 text-sm">Lưu trữ các tin nhắn quan trọng</Text>
          </View>
          <Text className="text-gray-400">›</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-100">
          <View className="w-8 h-8 rounded-full items-center justify-center mr-3">
            <Entypo name="time-slot" size={20} color="#0084ff" />
          </View>
          <View className="flex-1">
            <Text className="font-medium">Dữ liệu trên máy</Text>
            <Text className="text-gray-500 text-sm">Quản lý dữ liệu Zalo của bạn</Text>
          </View>
          <Text className="text-gray-400">›</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center p-4">
          <View className="w-8 h-8 rounded-full items-center justify-center mr-3">
            <Entypo name="wallet" size={20} color="#0084ff" />
          </View>
          <View className="flex-1">
            <Text className="font-medium">Ví QR</Text>
            <Text className="text-gray-500 text-sm">Lưu trữ và xuất trình các mã QR quan trọng</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Account and Security */}
      <View className="bg-white mb-2">
        <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-100"
          onPress={() => navigation.navigate('AccountSecurity', { user })}
        >
          <View className="w-8 h-8 rounded-full items-center justify-center mr-3">
            <Entypo name="shield" size={20} color="#0084ff" />
          </View>
          <View className="flex-1">
            <Text className="font-medium">Tài khoản và bảo mật</Text>
          </View>
          <Text className="text-gray-400">›</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center p-4">
          <View className="w-8 h-8 rounded-full items-center justify-center mr-3">
            <EvilIcon name="lock" size={24} color="#0084ff" />
          </View>
          <View className="flex-1">
            <Text className="font-medium">Quyền riêng tư</Text>
          </View>
          <Text className="text-gray-400">›</Text>
        </TouchableOpacity>
      </View>

      <View className="p-4">
        <TouchableOpacity
          className="bg-white p-4 items-center rounded-lg"
          onPress={handleLogout}
        >
          <Text className="text-red-500 font-bold">Đăng xuất</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

export default ProfileScreen;
