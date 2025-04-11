import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const CreateNewPassword = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isValid =
    password.length >= 6 &&
    confirmPassword.length >= 6 &&
    password === confirmPassword;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#0AA1FF" />

      <LinearGradient
        colors={['#0AA1FF', '#3BBEFF']}
        className="h-16 flex-row items-center px-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold ml-4">Tạo mật khẩu</Text>
      </LinearGradient>

      <View className="px-5 pt-4">
        <Text className="text-sm text-gray-700 mb-4">
          Mật khẩu phải gồm chữ, số hoặc ký tự đặc biệt; không được chứa năm sinh và tên Zalo của bạn.
        </Text>

        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-blue-500 font-semibold">Mật khẩu mới</Text>
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text className="text-blue-500 font-semibold">
              {showPassword ? 'ẨN' : 'HIỆN'}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center border-b border-blue-400 mb-3">
          <TextInput
            className="flex-1 py-2"
            placeholder="Nhập mật khẩu mới"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          {password.length > 0 && (
            <TouchableOpacity onPress={() => setPassword('')}>
              <Icon name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        <TextInput
          className="border-b border-gray-300 py-2 mb-6"
          placeholder="Nhập lại mật khẩu mới"
          secureTextEntry={!showPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />


        <TouchableOpacity
          className={`h-12 rounded-full items-center justify-center ${
            isValid ? 'bg-blue-500' : 'bg-blue-100'
          }`}
          disabled={!isValid}
          onPress={() => {
            // Gửi API cập nhật mật khẩu tại đây
            console.log('Mật khẩu mới:', password);
          }}>
          <Text className="text-white text-base">Cập nhật</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateNewPassword;
