import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  StatusBar,
  Alert 
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const ForgotPassword = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const isPhoneValid = phone.length >= 10;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#0AA1FF" />
      <LinearGradient
        colors={['#0AA1FF', '#3BBEFF']}
        className="h-16 flex-row items-center px-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold ml-4">
          Lấy lại mật khẩu
        </Text>
      </LinearGradient>

      <View className="flex-1 px-5 pt-6">
        <Text className="text-sm text-gray-700 mb-5">
          Nhập số điện thoại để lấy lại mật khẩu
        </Text>

        <TextInput
          className="border-b border-gray-300 text-base pb-2 mb-8"
          placeholder="Số điện thoại"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <TouchableOpacity
          className={`h-12 rounded-full items-center justify-center ${
            isPhoneValid ? 'bg-blue-500' : 'bg-blue-100'
          }`}
          disabled={!isPhoneValid}
          onPress={() => {
            const formattedPhone = `(+84) ${phone.slice(1, 4)} ${phone.slice(4, 7)} ${phone.slice(7)}`;
  
            try {
              Alert.alert(
                'Xác nhận số điện thoại',
                `Số điện thoại này sẽ được sử dụng để nhận mã xác thực:\n${formattedPhone}`,
                [
                  { text: 'Hủy', style: 'cancel' },
                  {
                    text: 'Xác nhận',
                    onPress: () => {
                      navigation.navigate('OTPVerificationForgotPassword', { phone });
                    },
                  },
                ],
                { cancelable: true }
              );
            } catch (err) {
              console.error('Alert error:', err);
            }
          }}
          >
          <Text className="text-white text-base">Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
