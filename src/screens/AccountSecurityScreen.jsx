import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Switch } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
const AccountSecurityScreen = ({ navigation, route }) => {
    const user = route.params?.user ||
    {
        avatar_url: 'https://via.placeholder.com/100',
        full_name: 'Bùi Hiếu',
        phone: '(+84) 392 006 277',
    }
    const handleChangePassword = () => {
        console.log(user?.is_has_password);
        if(user?.is_has_password){
            navigation.navigate('ChangePassword');
        }else{
            navigation.navigate('CreatePasswordNotLogout');
        }    
    }
    return (
        <View className="flex-1 bg-gray-100 mt-8">
            <View className="bg-blue-500 p-4 flex-row items-center">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-medium ml-3">Tài khoản và bảo mật</Text>
            </View>

            <ScrollView>
              
                <View className="mt-2 px-4 py-2">
                    <Text className="text-blue-600 font-medium">Tài khoản</Text>
                </View>

                <View className="bg-white rounded-md">
                 
                    <TouchableOpacity className="flex-row items-center p-3 border-b border-gray-100"
                        onPress={() => navigation.navigate('PersonalDetail', { user })}
                    >
                        <Image
                            source={{ uri: user?.avatar_url || 'https://via.placeholder.com/100' }}
                            className="w-12 h-12 rounded-full"
                        />
                        <View className="flex-1 ml-3">
                            <Text className="text-gray-500">Thông tin cá nhân</Text>
                            <Text className="font-medium">{user?.full_name}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#aaa" />
                    </TouchableOpacity>

              
                    <TouchableOpacity className="flex-row items-center p-3 border-b border-gray-100">
                        <View className="w-8 h-8 items-center justify-center">
                            <Ionicons name="call-outline" size={22} color="#666" />
                        </View>
                        <View className="flex-1 ml-3">
                            <Text className="font-medium">Số điện thoại</Text>
                            <Text className="text-gray-500">(+84) {user?.phone.replace("0", "")}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#aaa" />
                    </TouchableOpacity>

                 
                    <TouchableOpacity className="flex-row items-center p-3 border-b border-gray-100">
                        <View className="w-8 h-8 items-center justify-center">
                            <Ionicons name="mail-outline" size={22} color="#666" />
                        </View>
                        <View className="flex-1 ml-3">
                            <Text className="font-medium">Email</Text>
                            <Text className="text-gray-500">Chưa liên kết</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#aaa" />
                    </TouchableOpacity>

               
                    <TouchableOpacity className="flex-row items-center p-3 border-b border-gray-100">
                        <View className="w-8 h-8 items-center justify-center">
                            <Ionicons name="person-outline" size={22} color="#666" />
                        </View>
                        <View className="flex-1 ml-3">
                            <Text className="font-medium">Định danh tài khoản</Text>
                        </View>
                        <Text className="text-gray-400 mr-2">Chưa định danh</Text>
                        <Ionicons name="chevron-forward" size={20} color="#aaa" />
                    </TouchableOpacity>

                   
                    <TouchableOpacity className="flex-row items-center p-3">
                        <View className="w-8 h-8 items-center justify-center">
                            <Ionicons name="qr-code-outline" size={20} color="#666" />
                        </View>
                        <View className="flex-1 ml-3">
                            <Text className="font-medium">Mã QR của tôi</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#aaa" />
                    </TouchableOpacity>
                </View>

              
                <View className="mt-4 px-4 py-2">
                    <Text className="text-blue-600 font-medium">Bảo mật</Text>
                </View>

                <View className="bg-white rounded-md">
                    
                    <TouchableOpacity className="flex-row items-center p-3 border-b border-gray-100">
                        <View className="w-8 h-8 items-center justify-center">
                            <Ionicons name="shield-checkmark-outline" size={22} color="#666" />
                        </View>
                        <View className="flex-1 ml-3">
                            <Text className="font-medium">Kiểm tra bảo mật</Text>
                            <Text className="text-yellow-500">4 vấn đề bảo mật cần xử lý</Text>
                        </View>
                        <Ionicons name="warning-outline" size={20} color="#f59e0b" className="mr-2" />
                        <Ionicons name="chevron-forward" size={20} color="#aaa" />
                    </TouchableOpacity>

                    
                    <TouchableOpacity className="flex-row items-center p-3 border-b border-gray-100">
                        <View className="w-8 h-8 items-center justify-center">
                            <Ionicons name="lock-closed-outline" size={22} color="#666" />
                        </View>
                        <View className="flex-1 ml-3">
                            <Text className="font-medium">Khóa Zalo</Text>
                        </View>
                        <Text className="text-gray-400 mr-2">Đang tắt</Text>
                        <Ionicons name="chevron-forward" size={20} color="#aaa" />
                    </TouchableOpacity>
                </View>

               
                <View className="mt-4 px-4 py-2">
                    <Text className="text-blue-600 font-medium">Đăng nhập</Text>
                </View>

                <View className="bg-white rounded-md">

                    <TouchableOpacity className="flex-row items-center p-3"
                        onPress={handleChangePassword}
                    >
                        <View className="w-8 h-8 items-center justify-center">
                        <EvilIcon name="lock" size={28} color="#aaa" />
                        </View>
                        <View className=" flex-row flex-1 ml-3 items-center gap-20">
                            <Text className="font-medium">Mật khẩu</Text>
                            <Text className="text-gray-500 text-sm text-center">{(!user?.is_has_password)?"Chưa đặt":""}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#aaa" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

export default AccountSecurityScreen;