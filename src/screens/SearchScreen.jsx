import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getUserBySearch} from '../redux/slices/userSlice';
import Account from '../component/Account';
import {userSelector} from '../redux/selector';

const SearchScreen = ({route, navigation}) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState(route.params?.searchTerm || '');
  const user = useSelector(userSelector);
  const searchResults = useSelector(state => state.user.searchResults);
  const loading = useSelector(state => state.user.loading);
  const error = useSelector(state => state.user.error);

  useEffect(() => {
    if (searchTerm) {
      dispatch(getUserBySearch(searchTerm));
    }
  }, [dispatch, searchTerm]);

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
        searchResults.map(result => (
          <Account key={result._id} user={result} authUser={user} />
        ))
      )}
    </View>
  );
};

export default SearchScreen;
