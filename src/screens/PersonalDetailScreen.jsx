// screens/PersonalDetailScreen.js
import React from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PersonalDetailScreen = ({navigation, route}) => {
  const user = route.params?.user || {
    name: 'Bùi Hiếu',
    birthday: '26/10/2003',
    gender: 'Nam',
    avatar: 'https://via.placeholder.com/100',
  };
  const formatDate = date => {
    if (!date) return '';
    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
  };

  return (
    <View className="flex-1 bg-gray-100 mt-8">
      {/* Header */}
      <View className="bg-blue-500 p-4 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-medium ml-3">
          Thông tin cá nhân
        </Text>
      </View>

      {/* Profile Image */}
      <View className="items-center mt-8">
        <Image
          source={{uri: user?.avatar_url}}
          className="w-28 h-28 rounded-full"
        />
      </View>

      {/* Personal Info */}
      <View className="mt-8 bg-white">
        {/* Name */}
        <View className="flex-row items-center p-4 border-b border-gray-100">
          <View className="w-10 items-start">
            <Ionicons name="person-outline" size={22} color="#666" />
          </View>
          <View className="flex-1">
            <Text className="text-gray-500">Tên Lochat</Text>
          </View>
          <Text className="font-medium">{user?.full_name}</Text>
        </View>

        {/* Birthday */}
        <View className="flex-row items-center p-4 border-b border-gray-100">
          <View className="w-10 items-start">
            <Ionicons name="calendar-outline" size={22} color="#666" />
          </View>
          <View className="flex-1">
            <Text className="text-gray-500">Ngày sinh</Text>
          </View>
          <Text className="font-medium">
            {formatDate(new Date(user?.date_of_birth))}
          </Text>
        </View>

        {/* Gender */}
        <View className="flex-row items-center p-4">
          <View className="w-10 items-start">
            <Ionicons name="male-female-outline" size={22} color="#666" />
          </View>
          <View className="flex-1">
            <Text className="text-gray-500">Giới tính</Text>
          </View>
          <Text className="font-medium">
            {user?.gender === 'male' ? 'Nam' : 'Nữ'}
          </Text>
        </View>
      </View>

      {/* Edit Button */}
      <View className="mt-4 mx-4">
        <TouchableOpacity
          className="bg-gray-200 p-3 rounded-md flex-row justify-center items-center"
          onPress={() => navigation.navigate('EditProfile', {user})}>
          <Ionicons name="pencil" size={18} color="#333" />
          <Text className="ml-2 font-medium text-gray-700">Chỉnh sửa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PersonalDetailScreen;
