
import { useDispatch, useSelector } from 'react-redux';
import { countryCodeSelector, countSelector, productSelector, selectedCountrySelector } from '../redux/selector';
import { increase, decrease } from '../redux/slices/countSlice';
import { fetchData } from '../redux/slices/productSlice';
import React, { useState, useEffect } from 'react';
import Icon from "react-native-vector-icons/AntDesign"
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Image,
} from 'react-native';
import { Checkbox } from 'react-native-paper';

function SignUpScreen({ navigation }) {
    const dispatch = useDispatch();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [termsChecked, setTermsChecked] = useState(false);
    const [socialTermsChecked, setSocialTermsChecked] = useState(false);
    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const selectedCountry = useSelector(selectedCountrySelector);


    useEffect(() => {
        dispatch(fetchData());
    }, []);
    const openCountryCodeScreen = () => {
        navigation.navigate('CountryCodeScreen', {
            countryCode: selectedCountry
        });
    };
    const handleCheckPhone = (text) => {
        const phoneRegex = /^[0-9]{10}$/;
        setPhoneNumber(text);
        console.log(text)
        if (phoneRegex.test(text)) setIsPhoneValid(true);
        else setIsPhoneValid(false);
    }
    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            <View className="px-6 pt-4 flex-1">
                {/* Title */}
                <Text className="text-2xl font-bold text-gray-800 text-center mb-8">
                    Nhập số điện thoại
                </Text>

                {/* Phone input field */}
                <View className="border border-blue-200 rounded-lg mb-6 flex-row overflow-hidden">
                    {/* Country code selector */}
                    <TouchableOpacity className="flex-row items-center px-4 py-3" onPress={openCountryCodeScreen}>
                        <Text className="text-gray-800 font-medium">{selectedCountry.code}</Text>
                        <View className="ml-1">
                            <Icon name="down" size={20} color="#000" />
                        </View>
                    </TouchableOpacity>

                    {/* Vertical separator */}
                    <View className="w-px bg-blue-200 h-full" />

                    {/* Phone number input */}
                    <TextInput
                        className="flex-1 px-4 py-3 text-base"
                        placeholder=""
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={text => handleCheckPhone(text)}
                    />
                </View>

                {/* Terms checkboxes */}
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

                {/* Continue button */}
                <TouchableOpacity
                    className={`rounded-2xl py-4 items-center ${termsChecked && socialTermsChecked
                        && isPhoneValid ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                    disabled={!termsChecked || !socialTermsChecked}
                >
                    <Text className={`font-medium ${termsChecked && socialTermsChecked && isPhoneValid ? 'text-white' :
                        'text-gray-500'} `}>Tiếp tục</Text>
                </TouchableOpacity>
            </View>

            {/* Footer */}
            <View className="py-6 items-center">
                <View className='flex-row items-center'>
                    <Text className="text-gray-700 ">
                        Bạn đã có tài khoản?{' '}
                    </Text>
                    <TouchableOpacity>
                        <Text className="text-blue-500 font-medium">Đăng nhập ngay</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default SignUpScreen;
