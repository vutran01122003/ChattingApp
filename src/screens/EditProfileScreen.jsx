// screens/EditProfileScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert
} from 'react-native';
import axios from '../config/axios.config';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

const EditProfileScreen = ({ navigation, route }) => {
  const user = route.params?.user;
  const [avatarUri, setAvatarUri] = useState(user?.avatar_url || 'https://via.placeholder.com/100');
  const [avatarBase64, setAvatarBase64] = useState(null); // để upload
  const [birthday, setBirthday] = useState(user?.date_of_birth ? new Date(user.date_of_birth) : new Date('2003-10-26'));
  const [name, setName] = useState(user?.full_name || 'Bùi Hiếu');
  const [gender, setGender] = useState(user?.gender === 'male' ? 'Nam' : 'Nữ');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const getMaxDate = () => {
    const today = new Date();
    return new Date(today.getFullYear() - 14, today.getMonth(), today.getDate());
  };

  const formatDate = (date) => {
    if (!date) return '';
    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  // Chọn ảnh từ thư viện
  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      maxHeight: 2000,
      maxWidth: 2000,
    };
    launchImageLibrary(options, async (response) => {
      if (response.didCancel || !response.assets?.length) return;

      const asset = response.assets[0];
      const uri = asset.uri;
      const base64String = asset.base64;

      setAvatarUri(uri);

      setAvatarBase64(base64String);
    });
  };



  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };


  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };


  const handleConfirm = (date) => {
    setBirthday(date);
    const maxDate = getMaxDate();
    if (date > maxDate) {
      Alert.alert('Lỗi', 'Bạn phải từ 14 tuổi trở lên');
      return;
    }
    hideDatePicker();
  };


  const handleSave = async () => {
    try {
      const clientId = await AsyncStorage.getItem('client_id');
      const body = avatarBase64 === null ? {
        fullName: name,
        gender: gender === "Nam" ? "male" : 'female',
        dateOfBirth: formatDate(new Date(birthday)),
      } : {
        base64: avatarBase64,
        fullName: name,
        gender: gender === "Nam" ? "male" : 'female',
        dateOfBirth: formatDate(new Date(birthday)),
      }
      const userUpdate = await axios.post('/user/edit-profile', JSON.stringify({...body}), {
        headers: {
          "x-client-id": clientId,
          "Content-Type": "application/json"
        }
      });

      console.log('userUpdate', userUpdate.data.metadata);

      if (userUpdate.data.metadata) {
        Alert.alert('Thành công', 'Cập nhật thông tin thành công');
        navigation.navigate('MainTabs');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi lưu thông tin cá nhân');
    }
  };


  return (
    <View className="flex-1 bg-white mt-8">
      {/* Header */}
      <View className="bg-blue-500 px-4 py-3 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-medium ml-3">
          Chỉnh sửa thông tin
        </Text>
      </View>


      <View className="flex-1 px-4 py-4">
        {/* Ảnh đại diện và nút chỉnh sửa */}
        <View className="items-center mt-4">
          <View className="relative">
            <Image
              source={{ uri: avatarUri }}
              className="w-24 h-24 rounded-full"
              resizeMode="cover"
            />
            <TouchableOpacity
              className="absolute bottom-0 right-0 bg-white p-1 rounded-full border border-gray-300"
              onPress={selectImage}
            >
              <AntDesign name="camera" size={20} color="#ccc" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Khối thông tin chỉnh sửa */}
        <View className="mt-6 space-y-4">
          {/* Trường Họ Tên */}
          <View>
            <Text className="text-gray-700 mb-1">Họ và Tên</Text>
            <View className="flex-row items-center bg-gray-100 rounded-md px-2">
              <TextInput
                className="flex-1 py-2 text-gray-800"
                placeholder="Nhập họ và tên"
                value={name}
                onChangeText={setName}
              />
              <Ionicons name="person" size={20} color="#555" />
            </View>
          </View>


          <View>
            <Text className="text-gray-700 mb-1">Ngày sinh</Text>
            <View className="flex-row items-center bg-gray-100 rounded-md px-2">
              <TextInput
                className="flex-1 py-2 text-gray-800"
                placeholder="DD/MM/YYYY"
                value={formatDate(new Date(birthday))}
                editable={false}
                onPressIn={showDatePicker}
              />
              <TouchableOpacity onPress={showDatePicker}>
                <Ionicons name="calendar" size={20} color="#555" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Chọn giới tính */}
          <View>
            <Text className="text-gray-700 mb-1">Giới tính</Text>
            <View className="flex-row items-center space-x-6 gap-10 justify-center">
              {/* Nam */}
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => setGender('Nam')}
              >
                <View
                  className={`w-5 h-5 rounded-full border border-blue-500 items-center justify-center ${gender === 'Nam' ? 'bg-blue-500' : 'bg-white'
                    }`}
                >
                  {gender === 'Nam' && (
                    <Ionicons name="checkmark" size={12} color="white" />
                  )}
                </View>
                <Text className="ml-2 text-gray-800">Nam</Text>
              </TouchableOpacity>

              {/* Nữ */}
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => setGender('Nữ')}
              >
                <View
                  className={`w-5 h-5 rounded-full border border-blue-500 items-center justify-center ${gender === 'Nữ' ? 'bg-blue-500' : 'bg-white'
                    }`}
                >
                  {gender === 'Nữ' && (
                    <Ionicons name="checkmark" size={12} color="white" />
                  )}
                </View>
                <Text className="ml-2 text-gray-800">Nữ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity
          className="bg-blue-500 mt-8 py-3 rounded-lg items-center"
          onPress={handleSave}
        >
          <Text className="text-white font-medium uppercase">Lưu</Text>
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={birthday}
        maximumDate={getMaxDate()}
      />
    </View>
  );
};

export default EditProfileScreen;
