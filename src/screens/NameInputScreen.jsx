import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';

const NameInputScreen = ({route, navigation}) => {
  const [name, setName] = useState('');

  const isValid = name.trim().length >= 2 && name.trim().length <= 40;

  return (
    <View className="flex-1 bg-[#f5f5f5] px-6 pt-24">
      <Text className="text-xl font-semibold text-center text-black mb-2">
        Nhập tên Lochat
      </Text>
      <Text className="text-center text-gray-500 mb-6">
        Hãy dùng tên thật để mọi người dễ nhận ra bạn
      </Text>

      <TextInput
        className="bg-white px-4 py-3 rounded-lg border border-gray-300 text-base text-black"
        placeholder="Nguyễn Văn A"
        value={name}
        onChangeText={setName}
        maxLength={40}
      />

      <View className="mt-4">
        <Text className="text-sm text-gray-500">• Dài từ 2 đến 40 ký tự</Text>
        <Text className="text-sm text-gray-500">• Không chứa số</Text>
        <Text className="text-sm text-gray-500">
          • Cần tuân thủ{' '}
          <Text className="text-blue-600">quy định đặt tên Lochat</Text>
        </Text>
      </View>

      <TouchableOpacity
        className={`mt-8 py-3 rounded-full ${
          isValid ? 'bg-blue-500' : 'bg-gray-300'
        }`}
        disabled={!isValid}
        onPress={() =>
          navigation.navigate('PersonalInfoScreen', {
            phoneNumber: route.params.phoneNumber,
            fullName: name,
          })
        }>
        <Text className="text-center text-white text-base font-semibold">
          Tiếp tục
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default NameInputScreen;
