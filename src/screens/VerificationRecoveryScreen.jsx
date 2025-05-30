import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Image,
    StyleSheet,
    Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import { verifyOTP } from '../redux/slices/userSlice';

export default function VerificationCodeScreen({ navigation, route }) {
    const dispatch = useDispatch();
    const { phoneNumber, token } = route?.params || {};

    const inputRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
    ];


    const [code, setCode] = useState(['', '', '', '', '', '']);


    const handleCodeChange = (text, index) => {

        if (/^[0-9]?$/.test(text)) {
            const newCode = [...code];
            newCode[index] = text;
            setCode(newCode);
            if (text !== '' && index < inputRefs.length - 1) {
                inputRefs[index + 1].current.focus();
            }
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && index > 0 && code[index] === '') {
            inputRefs[index - 1].current.focus();
        }
    };

    const formattedPhone = phoneNumber.startsWith('84')
        ? `(+84) ${phoneNumber.substring(2, 5)} ${phoneNumber.substring(5, 8)} ${phoneNumber.substring(8)}`
        : phoneNumber;


    const isCodeComplete = code.every(digit => digit !== '');
    const handleContinue = async () => {
        const otpCode = code.join('');
        try {
            const response = await dispatch(verifyOTP({ otp: otpCode, token }));
            if (response.meta.requestStatus === 'fulfilled') {
                navigation.navigate('CreatePassword', { phoneNumber, type: 'recovery' });
            } else {
                Alert.alert('Lỗi', 'Mã xác thực không đúng. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            Alert.alert('Lỗi', 'Đã xảy ra lỗi trong quá trình xác thực.');
        }
    }
    return (
        <SafeAreaView className="flex-1 bg-blue-500 mt-8">
            <StatusBar barStyle="dark-content" backgroundColor="#3B82F6" />

            
            <View className="flex-row items-center p-4">
                <TouchableOpacity className="mr-4"
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-medium">Nhập mã xác thực</Text>
            </View>

           
            <View className="bg-gray-100 p-3">
                <Text className="text-gray-600 text-center text-sm">
                    Vui lòng không chia sẻ mã xác thực để tránh mất tài khoản
                </Text>
            </View>

            
            <View className="flex-1 bg-white p-4 items-center">
                
                <View className="w-16 h-16 rounded-full border border-gray-300 items-center justify-center mb-6 mt-6">
                    <Ionicons name="phone-portrait-outline" size={28} color="#6B7280" />
                </View>

                
                <Text className="text-gray-800 text-lg mb-2">{formattedPhone}</Text>
                <Text className="text-gray-600 text-center mb-8">
                    Soạn tin nhắn nhận mã xác thực và điền vào bên dưới
                </Text>

                
                <View className="flex-row justify-between w-full px-4 mb-8">
                    {code.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={inputRefs[index]}
                            className="border-b-2 border-gray-300 w-12 text-center text-xl"
                            value={digit}
                            onChangeText={(text) => handleCodeChange(text, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            keyboardType="number-pad"
                            maxLength={1}
                        />
                    ))}
                </View>

                <TouchableOpacity
                    className={`rounded-full py-3 px-8 ${isCodeComplete ? 'bg-blue-500' : 'bg-gray-300'}`}
                    disabled={!isCodeComplete}
                    onPress={handleContinue}
                >
                    <Text className="text-white font-medium">Tiếp tục</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}