import {Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {countSelector, productSelector} from '../redux/selector';
import {increase, decrease} from '../redux/slices/countSlice';
import {fetchData} from '../redux/slices/productSlice';
import {useEffect} from 'react';

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
  }, [dispatch]);

  return (
    <View className="gap-5">
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
        onPress={() => navigation.navigate('Profile', {name: 'Jane'})}>
        <Text className="text-red-600">Go to Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Chat', {name: 'haha'})}>
        <Text className="text-red-600">Go to Chat Screen</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text className="text-red-600">Go to Register Screen</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Personal')}>
        <Text className="text-red-600">Go to Personal Page</Text>
      </TouchableOpacity>

      <View>
        <Text className="font-semibold">Test Fetch Data:</Text>
        {product.data.map((item, index) => (
          <Text key={index}>{item.title}</Text>
        ))}
      </View>
    </View>
  );
}

export default HomeScreen;
