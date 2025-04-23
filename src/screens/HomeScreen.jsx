import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, TouchableHighlight } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUser, getUserBySearch } from '../redux/slices/userSlice';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = ({ route }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation(); 
  const [searchTerm, setSearchTerm] = useState(route.params?.searchTerm || '');

  
  const allUsers = useSelector(state => state.user.allUsers);
  const searchResults = useSelector(state => state.user.searchResults);
  const loading = useSelector(state => state.user.loading);
  const error = useSelector(state => state.user.error);

  useEffect(() => {
    if (searchTerm) {
      dispatch(getUserBySearch(searchTerm));
    } else {
      dispatch(getAllUser());
    }
  }, [dispatch, searchTerm]);

  const renderItem = ({ item }) => (
    <TouchableHighlight
      underlayColor="#f0f0f0" 
      onPress={() => { 
        navigation.navigate('ChattingScreen', { userId: item._id, userName: item.full_name, userAvatar: item.avatar_url });
      }}
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
      {loading ? (
        <Text className="text-center mt-5">Loading...</Text>
      ) : error ? (
        <Text className="text-center mt-5 text-red-500">Error: {error}</Text>
      ) : (
        <FlatList
          data={searchTerm ? searchResults : allUsers}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          ListEmptyComponent={
            <Text className="text-center mt-5">No users found.</Text>
          }
        />
      )}
    </View>
  );
};

export default HomeScreen;
