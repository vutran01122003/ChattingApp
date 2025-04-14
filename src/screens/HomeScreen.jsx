import { Text, TouchableOpacity, View, SafeAreaView, StatusBar, FlatList, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { countSelector, productSelector } from '../redux/selector';
import { increase, decrease } from '../redux/slices/countSlice';
import { fetchData } from '../redux/slices/productSlice';
import { useEffect } from 'react';
import { getUserInfo } from '../redux/slices/userSlice';
import { logOut } from '../redux/slices/authSlice';

function HomeScreen({navigation}) {
  const dispatch = useDispatch();
  const count = useSelector(countSelector);
  const product = useSelector(productSelector);

  const increaseValue = () => {
    dispatch(increase());
  };

  const decreaseValue = () => {
    dispatch(decrease());
  };
  
  useEffect(() => {
    dispatch(fetchData());
  }, []);

  const groups = [
    { id: '1', name: 'Gia đình', avatar: 'https://via.placeholder.com/50', members: 5 },
    { id: '2', name: 'Nhóm làm việc', avatar: 'https://via.placeholder.com/50', members: 12 },
    // Thêm các nhóm khác
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity className="flex-row items-center p-3 border-b border-gray-200">
      <Image 
        source={{ uri: item.avatar }} 
        className="w-12 h-12 rounded-full" 
      />
      <View className="ml-4">
        <Text className="text-base">{item.name}</Text>
        <Text className="text-gray-500 text-sm">{item.members} thành viên</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={groups}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

export default HomeScreen;
