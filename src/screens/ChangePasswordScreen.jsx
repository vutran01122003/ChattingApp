import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from '../config/axios.config';

const ChangePasswordScreen = ({ navigation, route }) => {

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [isPasswordCorrect, setIsPasswordCorrect] = useState(true);

    const checkPasswordAPI = async (password) => {
        const clientId = await AsyncStorage.getItem('client_id');
        const res = await axios.post('/user/check-password', {
            password
        }, {
            headers: {
                'x-client-id': clientId
            }
        });
        return res.data.metadata.is_valid;
    };


    useEffect(() => {
        const timeout = setTimeout(() => {
            if (currentPassword.length > 0) {
                checkPasswordAPI(currentPassword)
                    .then((valid) => {
                        setIsPasswordCorrect(valid);
                    })
                    .catch((err) => {
                        console.log('Error checking password', err);
                        setIsPasswordCorrect(false);
                    });
            }
        }, 400);

        return () => clearTimeout(timeout);
    }, [currentPassword]);
    const validatePassword = (pwd) => {
        const hasLetter = /[A-Za-z]/.test(pwd);
        const hasNumber = /[0-9]/.test(pwd);
        return pwd.length >= 6 && hasLetter && hasNumber;
    };

    useEffect(() => {
        const isFormValid =
            validatePassword(newPassword) &&
            newPassword === confirmNewPassword &&
            currentPassword.length > 0 &&
            isPasswordCorrect;
        setIsValid(isFormValid);
    }, [currentPassword, newPassword, confirmNewPassword, isPasswordCorrect]);

    const handleUpdatePassword = async () => {
        if (!isValid) {
            Alert.alert('Lỗi', 'Vui lòng kiểm tra lại thông tin!');
            return;
        }
        if (currentPassword === newPassword) {
            Alert.alert('Lỗi', 'Mật khẩu mới không được giống mật khẩu hiện tại!');
            return;
        }
        const clientId = await AsyncStorage.getItem('client_id');
        try {
            const result = await axios.post('/user/change-password', {
                password: currentPassword,
                newPassword: newPassword
            }, {
                headers: {
                    'x-client-id': clientId
                }
            })

            if (result.data.metadata) {
                Alert.alert('Thành công', 'Cập nhật mật khẩu thành công!');
                navigation.navigate('MainTabs');
            }
        } catch (error) {
            console.error('Error updating password:', error);
            Alert.alert('Lỗi', 'Đã xảy ra lỗi khi cập nhật mật khẩu');
        }
    };

    return (
        <View className="flex-1 bg-white mt-8">
            <View className="bg-blue-500 p-4 flex-row items-center">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-medium ml-3">Cập nhật mật khẩu</Text>
            </View>

            <Text className="text-sm text-center text-gray-600 mb-4">
                Mật khẩu phải gồm chữ và số, không được chứa năm sinh, username và tên Zalo của bạn.
            </Text>


            <View className='px-4 py-4'>
                <Text className="text-gray-800 mb-1">Mật khẩu hiện tại:</Text>
                <View className="flex-row items-center border-b border-gray-300 mb-4">
                    <TextInput
                        className="flex-1 py-2 text-gray-900"
                        secureTextEntry={!showCurrent}
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        placeholder="Nhập mật khẩu hiện tại"
                    />
                    <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                        <Text className="text-blue-500">{showCurrent ? 'ẨN' : 'HIỆN'}</Text>
                    </TouchableOpacity>
                </View>
                {!isPasswordCorrect && currentPassword.length > 0 && (
                    <Text className="text-red-500 text-sm mb-2">Mật khẩu không đúng</Text>
                )}

                <Text className="text-gray-800 mb-1">Mật khẩu mới:</Text>
                <TextInput
                    className="border-b border-gray-300 py-2 text-gray-900 mb-4"
                    secureTextEntry
                    placeholder="Nhập mật khẩu mới"
                    value={newPassword}
                    onChangeText={setNewPassword}
                />


                <TextInput
                    className="border-b border-gray-300 py-2 text-gray-900 mb-6"
                    secureTextEntry
                    placeholder="Nhập lại mật khẩu mới"
                    value={confirmNewPassword}
                    onChangeText={setConfirmNewPassword}
                />


                <TouchableOpacity
                    className={`py-3 rounded-lg items-center ${isValid ? 'bg-blue-500' : 'bg-blue-200'}`}
                    onPress={handleUpdatePassword}
                    disabled={!isValid}
                >
                    <Text className="text-white font-semibold">CẬP NHẬT</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ChangePasswordScreen;
