import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useDispatch, useSelector} from 'react-redux';

export default function ChatScreen({route, navigation}) {
  const {userId, userName, userAvatar} = route.params;
  const dispatch = useDispatch();

  // Fetch the friend relationship and request status from Redux store

  // Function to send a message
  const sendMessage = () => {
    console.log('Message sent:', message);
    setMessage('');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar backgroundColor="#1E88E5" barStyle="light-content" />
      <View className="bg-blue-500 py-3 px-4 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-medium ml-3">
            {userName}
          </Text>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity className="mr-5">
            <Icon name="phone" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity className="mr-5">
            <Icon name="video" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="more-vertical" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="border-t border-gray-200 p-2 bg-white flex-row items-center">
        <TouchableOpacity className="mr-2">
          <Icon name="smile" size={24} color="#999" />
        </TouchableOpacity>
        <TextInput
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2"
          placeholder="Tin nhắn"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity onPress={sendMessage}>
          <Icon name="send" size={24} color="#1E88E5" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
