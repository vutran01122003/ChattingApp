import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import Icon from "react-native-vector-icons/Entypo"
const OtpVerificationScreen = ({ route, navigation }) => {
    const { phoneNumber } = route.params || {};
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [countdown, setCountdown] = useState(60);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const otpInputs = useRef([]);
    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;
        let newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < otp.length - 1) {
            otpInputs.current[index + 1].focus();
        } else if (value === '') {
            newOtp[index] = '';
            setOtp(newOtp);
            if (index > 0) {
                otpInputs.current[index - 1].focus();
            }
        }
    };
    const handleResendOtp = () => {
        setCountdown(60);
        setIsResendDisabled(true);
        // API
        console.log('Gửi lại mã OTP...');
    };
    React.useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setIsResendDisabled(false);
        }
    }, [countdown]);

    return (
        <SafeAreaView className="flex-1 bg-white px-4 justify-center items-center">
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <Text className="text-[24px] font-semibold">Nhập mã xác thực</Text>
            <Text className="text-gray-600 mt-2 text-center">
                Đang gọi đến số <Text className="font-bold">{phoneNumber}</Text>. Nghe máy để nhận mã xác thực gồm 6 chữ số.
            </Text>


            <View className="flex-row mt-6 space-x-8">
                {otp.map((digit, index) => (
                    <TextInput
                        key={index}
                        ref={(ref) => (otpInputs.current[index] = ref)}
                        className="border border-gray-500 w-12 h-12 mr-2 text-center text-lg rounded-lg"
                        keyboardType="phone-pad"
                        maxLength={1}
                        value={digit}
                        onChangeText={(value) => handleOtpChange(index, value)}
                    />
                ))}
            </View>


            <TouchableOpacity className={`py-3 rounded-3xl mt-6 w-full ${otp.includes("")? "bg-gray-300" : "bg-blue-600"} `}
                disabled={otp.includes("")}
            >
                <Text className={`text-center text-lg font-semibold ${otp.includes("") ? "text-gray-500" : "text-white"}`}>Tiếp tục</Text>
            </TouchableOpacity>

            <View className='flex-row items-center justify-center mt-4'>
                <Text className="text-gray-600 mr-2">
                    Bạn không nhận được mã?
                </Text>
                <TouchableOpacity
                    onPress={handleResendOtp}
                    disabled={isResendDisabled}
                    className={`${isResendDisabled ? 'text-gray-400' : 'text-blue-600'}`}
                >
                    <Text className={`text-lg font-semibold ${isResendDisabled ? 'text-gray-400' : 'text-blue-600'}`}>
                        {isResendDisabled ? `Gửi lại (${countdown}s)` : 'Gửi lại mã'}
                    </Text>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity className="mt-4 flex-row items-center gap-2">
                    <Icon name="help-with-circle" size={14} color="#3b82f6"/>
                    <Text className="text-blue-500 font-semibold">Tôi cần hỗ trợ thêm về mã xác thực</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default OtpVerificationScreen;
