
import { useDispatch, useSelector } from 'react-redux';
import { countryCodeSelector, selectedCountrySelector } from '../redux/selector';
import { signUp } from '../redux/slices/authSlice'; 
import React, { useState, useEffect } from 'react';
import {useIsFocused} from "@react-navigation/native"
import Icon from "react-native-vector-icons/AntDesign"
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Modal,
} from 'react-native';
import { Checkbox } from 'react-native-paper';

function SignUpScreen({ navigation }) {
    const dispatch = useDispatch();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [termsChecked, setTermsChecked] = useState(false);
    const [socialTermsChecked, setSocialTermsChecked] = useState(false);
    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const selectedCountry = useSelector(selectedCountrySelector);
    const isFocus = useIsFocused();

    useEffect(()=>{
        if(isFocus)
        setIsModalVisible(false)
        setPhoneNumber("")
    }, [isFocus])
    const openCountryCodeScreen = () => {
        navigation.navigate('CountryCodeScreen', {
            countryCode: selectedCountry
        });
    };
    const handleCheckPhone = (text) => {
        const phoneRegex = /^[0-9]{10}$/;
        setPhoneNumber(text);
        if (phoneRegex.test(text)) setIsPhoneValid(true);
        else setIsPhoneValid(false);
    }
    const handleContinue = () => {
        setIsModalVisible(true);
      };
    const handleButtonContinue = async () =>{
        try {
            const resultAction = await dispatch(signUp({ phone: phoneNumber })).unwrap();
            console.log("Sign up result:", resultAction);
            if (resultAction) {
                navigation.navigate("OtpVerificationScreen", { phoneNumber });
            }
        } catch (error) {
            console.error("Sign up failed:", error);
            Alert.alert("Lỗi đăng ký", error.message || "Đã xảy ra lỗi, vui lòng thử lại.");
        }
    }
    return (
        <SafeAreaView className="flex-1 bg-white mt-6">
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            <View className="px-6 pt-4 flex-1">

                <Text className="text-2xl font-bold text-gray-800 text-center mb-8">
                    Nhập số điện thoại
                </Text>


                <View className="border border-blue-200 rounded-lg mb-6 flex-row overflow-hidden">

                    <TouchableOpacity className="flex-row items-center px-4 py-3" onPress={openCountryCodeScreen}>
                        <Text className="text-gray-800 font-medium">{selectedCountry.code}</Text>
                        <View className="ml-1">
                            <Icon name="down" size={20} color="#000" />
                        </View>
                    </TouchableOpacity>


                    <View className="w-px bg-blue-200 h-full" />
                    <TextInput
                        className="flex-1 px-4 py-3 text-base"
                        placeholder=""
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={text => handleCheckPhone(text)}
                    />
                </View>

                <View className="mb-3 flex-row items-center">
                    <Checkbox
                        status={termsChecked ? 'checked' : 'unchecked'}
                        onPress={() => setTermsChecked(!termsChecked)}
                        color="#0091FF"
                    />
                    <Text className="text-gray-800 ml-2">
                        Tôi đồng ý với các{' '}
                        <Text className="text-blue-500">điều khoản sử dụng Zalo</Text>
                    </Text>
                </View>

                <View className="mb-6 flex-row items-center">
                    <Checkbox
                        status={socialTermsChecked ? 'checked' : 'unchecked'}
                        onPress={() => setSocialTermsChecked(!socialTermsChecked)}
                        color="#0091FF"
                    />
                    <Text className="text-gray-800 ml-2">
                        Tôi đồng ý với{' '}
                        <Text className="text-blue-500">điều khoản Mạng xã hội của Zalo</Text>
                    </Text>
                </View>

                <TouchableOpacity
                    className={`rounded-2xl py-4 items-center ${termsChecked && socialTermsChecked
                        && isPhoneValid ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                    disabled={!termsChecked || !socialTermsChecked}
                    onPress={handleContinue}
                >
                    <Text className={`font-medium ${termsChecked && socialTermsChecked && isPhoneValid ? 'text-white' :
                        'text-gray-500'} `}>Tiếp tục</Text>
                </TouchableOpacity>
                <Modal
                    transparent
                    animationType="fade"
                    visible={isModalVisible}
                    onRequestClose={() => setIsModalVisible(false)}
                >
                    <View className="flex-1 justify-center items-center bg-black/50">
                        <View className="bg-white w-80 p-6 rounded-lg shadow-lg">
                            <Text className="text-lg font-medium text-gray-800 mb-1">
                                Nhận mã xác thực qua số
                            </Text>
                            <Text className="text-lg font-semibold text-gray-900">{phoneNumber} ?</Text>
                            <Text className="text-gray-600 text-sm mt-2">
                                Zalo sẽ gửi mã xác thực cho bạn qua số điện thoại này
                            </Text>

                            <TouchableOpacity
                                className="bg-blue-500 py-3 rounded-lg mt-4"
                                onPress={() => handleButtonContinue()}
                            >
                                <Text className="text-center text-white text-lg font-semibold">Tiếp tục</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="mt-3"
                                onPress={() => setIsModalVisible(false)}
                            >
                                <Text className="text-center text-black font-semibold">Đổi số khác</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>

            <View className="py-6 items-center">
                <View className='flex-row items-center'>
                    <Text className="text-gray-700 ">
                        Bạn đã có tài khoản?{' '}
                    </Text>
                    <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
                        <Text className="text-blue-500 font-medium">Đăng nhập ngay</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default SignUpScreen;
