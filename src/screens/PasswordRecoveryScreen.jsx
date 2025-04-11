import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StatusBar, Modal } from 'react-native';
import { useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {requestResetPassword} from '../redux/slices/userSlice';

export default function PasswordRecoveryScreen({ navigation }) {
    const [phoneNumber, setPhoneNumber] = React.useState('0392006277');
    const [modalVisible, setModalVisible] = useState(false);
    const dispatch = useDispatch();
    const handleClearInput = () => {
        setPhoneNumber('');
    };

    const handleContinue = () => {
        setModalVisible(true);
      };
    
      const handleCancel = () => {
        setModalVisible(false);
      };
    
      const handleConfirm = () => {
        dispatch(requestResetPassword({phone: phoneNumber}))
          .then((response) => {
            setModalVisible(false);
            navigation.navigate('VerificationCode', { token: response.payload ,phoneNumber});
          })
          .catch((error) => {
            Alert.alert('Lỗi', 'Đã xảy ra lỗi trong quá trình gửi mã xác thực.');
          });
        
      };

    return (
        <SafeAreaView className="flex-1 bg-blue-500 mt-8">
            <StatusBar barStyle="dark-content" backgroundColor="#3B82F6" />


            <View className="flex-row items-center p-4">
                <TouchableOpacity className="mr-4"
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-medium">Lấy lại mật khẩu</Text>
            </View>


            <View className="flex-1 bg-white p-4">
                <Text className="text-gray-600 mb-2">Nhập số điện thoại để lấy lại mật khẩu</Text>


                <View className="border-b border-blue-500 pb-1 mb-8 flex-row items-center">
                    <TextInput
                        className="flex-1 py-2 text-base"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
                    />
                    {phoneNumber ? (
                        <TouchableOpacity onPress={handleClearInput}>
                            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>

            <View className="p-4 bg-white">
                <TouchableOpacity
                    className="rounded-full bg-blue-500 p-3 items-center justify-center"
                    activeOpacity={0.8}
                    onPress={handleContinue}
                >
                    <Ionicons name="arrow-forward" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleCancel}
            >
                <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
                    <View className="bg-white rounded-lg w-4/5 shadow-lg">
                    
                        <View className="p-6">
                            <Text className="text-lg font-medium text-center mb-4">
                                Xác nhận số điện thoại {'\n'}
                                {phoneNumber}?
                            </Text>

                            <Text className="text-gray-600 text-center mb-8">
                                Số điện thoại này sẽ được sử dụng để{'\n'}
                                nhận mã xác thực
                            </Text>

                    
                            <View className="flex-row justify-end mb-8">
                                <TouchableOpacity
                                    onPress={handleCancel}
                                    className="mr-4"
                                >
                                    <Text className="text-gray-600 font-medium">HỦY</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={handleConfirm}>
                                    <Text className="text-blue-500 font-medium">XÁC NHẬN</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>

    );
}