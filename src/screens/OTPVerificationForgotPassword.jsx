import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const OTPVerificationForgotPassword = ({ route, navigation }) => {
  const { phone } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]);

  const isComplete = otp.every((digit) => digit !== '');

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    console.log('OTP entered:', code);
    // Thực hiện xử lý xác minh tại đây
  };

  const formattedPhone = `(+84) ${phone.slice(1, 4)} ${phone.slice(4, 7)} ${phone.slice(7)}`;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#0AA1FF" />

      <LinearGradient colors={['#0AA1FF', '#3BBEFF']} className="h-16 flex-row items-center px-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold ml-4">Nhập mã xác thực</Text>
      </LinearGradient>

      <View className="px-6 pt-4">
        <Text className="text-sm text-gray-700 mb-3">
          Vui lòng không chia sẻ mã xác thực để tránh mất tài khoản
        </Text>

        <View className="items-center mt-4 mb-6">
          <Icon name="call-outline" size={50} color="#c4c4c4" />
          <Text className="text-lg font-semibold mt-3">{formattedPhone}</Text>
          <Text className="text-gray-500 text-center mt-2">
            Nhận mã xác thực và điền vào bên dưới
          </Text>
        </View>

        <View className="flex-row justify-between px-3 mb-6">
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref)}
              className="w-10 h-12 border-b border-gray-400 text-center text-lg"
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
            />
          ))}
        </View>


        <TouchableOpacity
          className={`h-12 rounded-full items-center justify-center ${
            isComplete ? 'bg-blue-500' : 'bg-blue-100'
          }`}
          disabled={!isComplete}
          onPress={()=> navigation.navigate('CreateNewPassword')}>
          <Text className="text-white text-base">Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OTPVerificationForgotPassword;
