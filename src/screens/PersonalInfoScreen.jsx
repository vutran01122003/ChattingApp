import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateUserInfo } from '../redux/slices/userSlice';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from "react-native-vector-icons/AntDesign";
import { Alert } from 'react-native';

const PersonalInfoScreen = ({ route, navigation }) => {
    const dispatch = useDispatch();
    const [birthDate, setBirthDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [gender, setGender] = useState('');
    const [showGenderModal, setShowGenderModal] = useState(false);
    const [isValidAge, setIsValidAge] = useState(false);

    const genders = ['Nam', 'Nữ'];


    const formatDate = (date) => {
        if (!date) return '';
        const year = date.getFullYear();

        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleUpdateUserInfo = async () => {
        const payload = {
            phone: route.params.phoneNumber,
            fullName: route.params.fullName,
            dateOfBirth: formatDate(birthDate),
            gender: gender === "Nam" ? 'male' : 'female'
        };

        try {
            const res = await dispatch(updateUserInfo(payload)).unwrap();
            if(res.modifiedCount > 0){
                Alert.alert("Cập nhật thông tin thành công", "Thông tin cá nhân của bạn đã được cập nhật thành công.");
                navigation.navigate("HomeScreen");
            }
            
            // TODO: Điều hướng sang màn hình khác nếu cần
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin:', error);
        }
    }
    useEffect(() => {
        if (birthDate) {
            const today = new Date();
            const birthYear = birthDate.getFullYear();
            const currentYear = today.getFullYear();

            let age = currentYear - birthYear;

            const birthMonth = birthDate.getMonth();
            const currentMonth = today.getMonth();
            const birthDay = birthDate.getDate();
            const currentDay = today.getDate();

            if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
                age--;
            }

            setIsValidAge(age >= 14);
        } else {
            setIsValidAge(false);
        }
    }, [birthDate]);


    const isValid = gender && isValidAge;

    return (
        <View className="flex-1 bg-[#fdfdfd] px-6 pt-24">
            <Text className="text-xl font-semibold text-center text-black mb-8">
                Thêm thông tin cá nhân
            </Text>

            <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="flex-row items-center justify-between border border-gray-300 rounded-lg px-4 py-3 bg-white mb-4"
            >
                <Text className={`text-base ${birthDate ? 'text-black' : 'text-gray-400'}`}>
                    {birthDate ? formatDate(birthDate) : 'Sinh nhật'}
                </Text>
                <Icon name="down" size={20} color="#000" />
            </TouchableOpacity>

            {birthDate && !isValidAge && (
                <Text className="text-red-500 mb-4 text-sm">
                    Bạn phải đủ 14 tuổi trở lên để tiếp tục.
                </Text>
            )}

            {showDatePicker && (
                <DateTimePicker
                    mode="date"
                    display="spinner"
                    value={birthDate || new Date()}
                    onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                            setBirthDate(selectedDate);
                        }
                    }}
                />
            )}

            <TouchableOpacity
                onPress={() => setShowGenderModal(true)}
                className="flex-row items-center justify-between border border-gray-300 rounded-lg px-4 py-3 bg-white"
            >
                <Text className={`text-base ${gender ? 'text-black' : 'text-gray-400'}`}>
                    {gender || 'Giới tính'}
                </Text>
                <Icon name="down" size={20} color="#000" />
            </TouchableOpacity>

            <Modal visible={showGenderModal} transparent animationType="fade">
                <Pressable className="flex-1 justify-center items-center bg-black/30" onPress={() => setShowGenderModal(false)}>
                    <View className="bg-white w-[80%] rounded-xl p-4">
                        {genders.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                className="py-3 px-2"
                                onPress={() => {
                                    setGender(item);
                                    setShowGenderModal(false);
                                }}
                            >
                                <Text className="text-base text-black">{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Pressable>
            </Modal>

            <TouchableOpacity
                className={`mt-10 py-3 rounded-full ${isValid ? 'bg-blue-500' : 'bg-gray-300'}`}
                disabled={!isValid}
                onPress={handleUpdateUserInfo}
            >
                <Text className="text-center text-white text-base font-semibold">Tiếp tục</Text>
            </TouchableOpacity>
        </View>
    );
};

export default PersonalInfoScreen;