import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TextInput, TouchableOpacity, TouchableHighlight } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getUserBySearch } from '../redux/slices/userSlice';

const SearchScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState(route.params?.searchTerm || ''); 
  const searchResults = useSelector(state => state.user.searchResults);  
  const loading = useSelector(state => state.user.loading);
  const error = useSelector(state => state.user.error);


  useEffect(() => {
    if (searchTerm) {
      dispatch(getUserBySearch(searchTerm));  
    }
  }, [dispatch, searchTerm]);

  const renderItem = ({ item }) => (
    <TouchableHighlight
      underlayColor="#f0f0f0"  
      onPress={() => {}}
      style={{ borderBottomWidth: 1, borderBottomColor: '#e0e0e0' }}  
    >
      <View className="flex-row items-center px-4 py-3">
        <Image
          source={{ uri: item.avatar_url }}  
          className="w-12 h-12 rounded-full mr-3"
        />
        <View className="flex-1">
          <Text className="font-bold text-base text-black">
            {item.full_name || 'No name'}  
          </Text>
          <Text className="text-gray-500 text-sm" numberOfLines={1}>
            {item.message || 'No message'} 
          </Text>
        </View>
        <Text className="text-gray-400 text-sm">{item.timestamp || 'No time'}</Text>  
      </View>
    </TouchableHighlight>
  );

  return (
    <View className="flex-1 bg-white">
      <View className="mt-4 mx-5 px-4 py-3 rounded-xl border border-gray-300 shadow-lg bg-white">
        <TextInput
          value={searchTerm}  
          onChangeText={setSearchTerm}  
          placeholder="Tìm kiếm người dùng"
          className="text-lg text-gray-800"
        />
      </View>

      {loading ? (
        <Text className="text-center mt-5">Loading...</Text>  
      ) : error ? (
        <Text className="text-center mt-5 text-red-500">Error: {error}</Text> 
      ) : (
        <FlatList
          data={searchResults}  
          renderItem={renderItem}
          keyExtractor={item => item._id} 
          ListEmptyComponent={<Text className="text-center mt-5">No users found.</Text>} 
        />
      )}
    </View>
  );
};

export default SearchScreen;
