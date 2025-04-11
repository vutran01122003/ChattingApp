import { Text, TouchableOpacity, View, SafeAreaView, StatusBar } from 'react-native';
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

  return (
    <SafeAreaView className="p-5">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View className="flex-row gap-2">
        <TouchableOpacity onPress={decreaseValue}>
          <Text>-</Text>
        </TouchableOpacity>

        <Text>{count.value}</Text>

        <TouchableOpacity onPress={increaseValue}>
          <Text>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('Profile', { name: 'Jane' })}>
        <Text className="text-red-600">Go to Profile</Text>
      </TouchableOpacity>

      <View>
        <Text className="font-semibold">Test Fetch Data:</Text>
        {product.data.map((item, index) => (
          <Text key={index}>{item.title}</Text>
        ))}
      </View>
      <TouchableOpacity>
        <Text className="text-red-600">Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default HomeScreen;
