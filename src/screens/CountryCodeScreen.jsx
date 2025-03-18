import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import Icon from "react-native-vector-icons/AntDesign";
import { useDispatch, useSelector } from 'react-redux';
import { countryCodeSelector } from '../redux/selector';
import { fetchCountryCode, setCountryCodeSelect } from '../redux/slices/countryCodeSlice';

const CountryCodeScreen = ({ navigation, route }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCountries, setFilteredCountries] = useState([]);
    const dispatch = useDispatch();
    const countries = useSelector(countryCodeSelector);
    const countrySelected = route.params?.countryCode;
    // Tạo danh sách alphabet cho việc phân nhóm
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    useEffect(() => {
        dispatch(fetchCountryCode());
    }, [dispatch]);


    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredCountries(countries);
        } else {
            const filtered = countries.filter(country =>
                country.name.toLowerCase() === searchQuery.toLocaleLowerCase() ||
                country.code.includes(searchQuery) ||
                country.name.toLowerCase().indexOf(searchQuery.toLowerCase().charAt(0)) === 0
            );
            setFilteredCountries(filtered);
        }
    }, [searchQuery, countries]);

    // Xử lý khi chọn một quốc gia
    const handleSelectCountry = (country) => {
        dispatch(setCountryCodeSelect(country));
        navigation.goBack();
    };

    // Render mỗi item trong danh sách quốc gia
    const renderCountryItem = ({ item }) => {
        const isSelected = item.code === countrySelected.code;

        return (
            <TouchableOpacity
                className="flex-row justify-between items-center py-4 px-6 border-b border-gray-100"
                onPress={() => handleSelectCountry(item)}
            >
                <Text className="text-base text-gray-800">
                    {item.name}({item.code})
                </Text>
                {isSelected && <Icon name="check" size={20} color="#0091FF" />}
            </TouchableOpacity>
        );
    };

    // Render section header cho các chữ cái
    const renderSectionHeader = ({ section }) => (
        <View className="py-1 px-6 bg-gray-100">
            <Text className="text-sm font-medium text-gray-500">{section.title}</Text>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-white mt-6">
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View className="flex-row items-center p-4 border-b border-gray-200">
                <TouchableOpacity
                    className="p-1 mr-4"
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="close" size={24} color="#000" />
                </TouchableOpacity>
                <Text className="text-base font-medium text-gray-800">
                    Chọn mã quốc gia/vùng lãnh thổ
                </Text>
            </View>

            {/* Search bar */}
            <View className="p-4">
                <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
                    <Icon name="search1" size={20} color="#666" />
                    <TextInput
                        className="flex-1 ml-2 text-base"
                        placeholder="Tìm kiếm"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <View className='flex-1'>
                <FlatList
                    data={filteredCountries}
                    renderItem={renderCountryItem}
                    keyExtractor={(item) => item.code}
                    initialNumToRender={20}
                />
            </View>
  
            <View className="py-4 items-center">
                <View className="w-16 h-1 bg-gray-400 rounded-full" />
            </View>
        </SafeAreaView>
    );
};

export default CountryCodeScreen;