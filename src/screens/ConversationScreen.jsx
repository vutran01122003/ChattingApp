import React, {useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {formatMessageTime} from '../utils/timeUtils';
import {useDispatch, useSelector} from 'react-redux';
import {
  currentConversationSelector,
  friendConversationsSelector,
  groupConversationsSelector,
  strangerConversationsSelector,
} from '../redux/selector';
import {useIsFocused} from '@react-navigation/native';
import {fetchAllConversations} from '../redux/thunks/chatThunks';
import {useSocket} from '../context/SocketContext';

const ConversationScreen = ({navigation}) => {
  const friendConversation = useSelector(friendConversationsSelector);
  const strangerConversation = useSelector(strangerConversationsSelector);
  const groupConversation = useSelector(groupConversationsSelector);
  const isFocus = useIsFocused();
  const dispatch = useDispatch();
  const {isConnected} = useSocket();

  useEffect(() => {
    if (isFocus) {
      dispatch(fetchAllConversations());
    }
  }, [isFocus, dispatch]);

  const handleConversationPress = useCallback(
    item => {
      navigation.navigate('ChatMessage', {
        conversationId: item.conversation_id,
      });
    },
    [navigation],
  );

  const renderConversation = ({item}) => {
    if (!item) return null;

    return (
      <TouchableOpacity
        className="flex-row items-center p-3"
        onPress={() => handleConversationPress(item)}>
        <View className="relative">
          <View className="w-12 h-12 rounded-full justify-center items-center">
            <Image
              source={{
                uri: item.is_group
                  ? item.group_avatar
                  : item.other_user[0]?.avatar_url,
              }}
              className="w-full h-full rounded-full"
            />
          </View>
          {item.other_user.some(o => o.is_online) && (
            <View className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border border-white" />
          )}
        </View>

        <View className="flex-1 ml-3">
          <View className="flex-row justify-between items-center">
            <Text className={`font-medium ${item.unread ? 'font-bold' : ''}`}>
              {item.is_group
                ? item.group_name
                : item.other_user[0].full_name || 'Người lạ'}
            </Text>
            <Text className="text-gray-500 text-xs">
              {formatMessageTime(item.last_message_time)}
            </Text>
          </View>
          <Text
            className={`text-sm ${
              item.unread ? 'font-medium text-black' : 'text-gray-500'
            }`}
            numberOfLines={1}
            ellipsizeMode="tail">
            {item.last_message?.attachments &&
            item.last_message?.attachments.length > 0 &&
            item.last_message?.attachments[
              item.last_message?.attachments.length - 1
            ].file_name
              ? item.last_message?.attachments[
                  item.last_message?.attachments.length - 1
                ].file_name
              : item.last_message?.content || 'Không có tin nhắn'}
          </Text>
        </View>

        {item.unread && (
          <View className="w-2 h-2 rounded-full bg-blue-500 ml-2" />
        )}
      </TouchableOpacity>
    );
  };

  const allConversations = [
    ...friendConversation,
    ...strangerConversation,
    ...groupConversation,
  ].sort((a, b) => {
    return new Date(b.last_message_time) - new Date(a.last_message_time);
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#3B82F6" />

      {isConnected ? (
        <FlatList
          data={allConversations}
          renderItem={renderConversation}
          keyExtractor={item => item.conversation_id}
          ItemSeparatorComponent={() => (
            <View className="h-px bg-gray-100 ml-16" />
          )}
          refreshing={false}
          onRefresh={() => dispatch(fetchAllConversations())}
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">Đang kết nối...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ConversationScreen;
