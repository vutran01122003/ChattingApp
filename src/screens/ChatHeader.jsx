import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {clearCurrentConversation} from '../redux/slices/chatSlice';

const ChatHeader = ({navigation, dispatch, currentConversation, authUser}) => {
  return (
    <View className="flex-row items-center p-3 bg-blue-500 h-16">
      <TouchableOpacity
        onPress={() => {
          dispatch(clearCurrentConversation());
          navigation.navigate("MainApp");
        }}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <View className="flex-1 ml-4">
        <Text className="text-white text-base font-bold">
          {currentConversation.is_group
            ? currentConversation.group_name
            : currentConversation.other_user[0].full_name}
        </Text>
        <Text className="text-slate-200 text-xs">
          {currentConversation.other_user.some(o => o.is_online)
            ? 'Đang hoạt động'
            : `Lần cuối ${new Date(
                currentConversation.other_user[0].last_seen,
              ).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}`}
        </Text>
      </View>
              
      <View className="flex-row">
        <TouchableOpacity className="ml-4">
          <Ionicons name="call-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity className="ml-4">
          <Ionicons name="videocam-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity className="ml-4" onPress={() =>{
          navigation.navigate("GroupInfo", {
            conversationId: currentConversation.conversation_id,
            authUser
          })
        }}>
          <Ionicons name="ellipsis-vertical" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatHeader;
