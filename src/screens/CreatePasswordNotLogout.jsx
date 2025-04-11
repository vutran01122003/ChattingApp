import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { createPassword } from '../redux/slices/userSlice';
import { logOut } from '../redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CreatePasswordNotLogoutScreen = ({ navigation }) => {
    const [password, setPasswordInput] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showRetypePassword, setShowRetypePassword] = useState(false);
    const dispatch = useDispatch();


    const handleSubmit = async () => {
        if (password.length < 6) {
            Alert.alert('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }
        if (!/^[a-zA-Z0-9]{6,}$/.test(password)) {
            Alert.alert('Mật khẩu chỉ được chứa chữ cái và số');
            return;
        }
        if (password !== retypePassword) {
            Alert.alert('Mật khẩu nhập lại không khớp');
            return;
        }

        try {
            const res = await dispatch(createPassword({ password }));
            if (res.meta.requestStatus === 'fulfilled') {
                Alert.alert('Cập nhật mật khẩu thành công');
                await dispatch(logOut());
                await AsyncStorage.removeItem('access_token');
                await AsyncStorage.removeItem('client_id');
                await AsyncStorage.removeItem('refresh_token');
                navigation.replace('AuthLoading');
            } else {
                Alert.alert('Có lỗi xảy ra khi cập nhật mật khẩu');
            }
        } catch (error) {
            Alert.alert('Lỗi không xác định', error.message);
        }
    };

    const isDisabled = password === '' || retypePassword === '';

    return (
        <View className="flex-1 bg-white mt-8">
            <View className="bg-blue-500 p-4 flex-row items-center">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-medium ml-3">Tạo mật khẩu mới</Text>
            </View>
            <Text className="text-center text-gray-700 mb-4 mt-4">
                Mật khẩu phải gồm chữ và số, không chứa username hoặc tên của bạn.
            </Text>

            <View className='px-5 pt-10'>
                <Text className="text-sm text-gray-600 mb-1">Mật khẩu mới:</Text>
                <View className="border border-gray-300 rounded-lg flex-row items-center px-4 py-2 mb-4">
                    <TextInput
                        style={{ flex: 1 }}
                        secureTextEntry={!showPassword}
                        placeholder="Nhập mật khẩu mới"
                        value={password}
                        onChangeText={setPasswordInput}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Text className="text-blue-500 text-sm">{showPassword ? 'Ẩn' : 'Hiện'}</Text>
                    </TouchableOpacity>
                </View>

                <Text className="text-sm text-gray-600 mb-1">Nhập lại mật khẩu mới:</Text>
                <View className="border border-gray-300 rounded-lg flex-row items-center px-4 py-2 mb-6">
                    <TextInput
                        style={{ flex: 1 }}
                        secureTextEntry={!showRetypePassword}
                        placeholder="Nhập lại mật khẩu mới"
                        value={retypePassword}
                        onChangeText={setRetypePassword}
                    />
                    <TouchableOpacity onPress={() => setShowRetypePassword(!showRetypePassword)}>
                        <Text className="text-blue-500 text-sm">{showRetypePassword ? 'Ẩn' : 'Hiện'}</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    disabled={isDisabled}
                    onPress={handleSubmit}
                    className={`${isDisabled ? 'bg-gray-300' : 'bg-blue-500'} py-3 rounded-full`}
                >
                    <Text className="text-white text-center text-base font-semibold">CẬP NHẬT</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CreatePasswordNotLogoutScreen;
