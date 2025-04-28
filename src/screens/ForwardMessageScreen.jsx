import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
  Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {
  friendConversationsSelector,
  groupConversationsSelector,
  strangerConversationsSelector,
} from '../redux/selector';
import {forwardMessage} from '../redux/thunks/chatThunks';
import {useSocket} from '../context/SocketContext';

const ForwardMessageScreen = ({route}) => {
  const [selectedConversations, setSelectedConversations] = useState([]);
  const [activeTab, setActiveTab] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const navigation = useNavigation();
  const friendConversations = useSelector(friendConversationsSelector);
  const strangerConversations = useSelector(strangerConversationsSelector);
  const groupConversations = useSelector(groupConversationsSelector);
  const selectedMessage = route.params;
  const dispatch = useDispatch();
  const {sendMessage} = useSocket();

  const handleForwardMessage = async () => {
    selectedConversations.forEach(async selected => {
      const res = await dispatch(
        forwardMessage({
          messageId: selectedMessage._id,
          targetConversationId: selected,
        }),
      );
      sendMessage(res.payload);
    });
    navigation.goBack();
  };

  const tabs = [
    {id: 'recent', name: 'Gần đây'},
    {id: 'friends', name: 'Bạn bè'},
    {id: 'groups', name: 'Nhóm'},
    {id: 'strangers', name: 'Người lạ'},
  ];

  const allConversations = [
    ...friendConversations,
    ...groupConversations,
    ...strangerConversations,
  ].sort(
    (a, b) => new Date(b.last_message_time) - new Date(a.last_message_time),
  );

  useEffect(() => {
    const getActiveData = () => {
      switch (activeTab) {
        case 'recent':
          return allConversations;
        case 'friends':
          return friendConversations;
        case 'groups':
          return groupConversations;
        case 'strangers':
          return strangerConversations;
        default:
          return allConversations;
      }
    };

    const performSearch = () => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) {
        return getActiveData();
      }

      return getActiveData().filter(conversation => {
        if (conversation.is_group) {
          return conversation.group_name?.toLowerCase().includes(query);
        }

        const fullName =
          conversation.other_user[0]?.full_name?.toLowerCase() || '';

        return fullName.includes(query);
      });
    };

    setFilteredData(performSearch());
  }, [
    activeTab,
    searchQuery,
    friendConversations,
    groupConversations,
    strangerConversations,
  ]);

  const toggleContactSelection = contactId => {
    if (selectedConversations.includes(contactId)) {
      setSelectedConversations(
        selectedConversations.filter(id => id !== contactId),
      );
    } else {
      setSelectedConversations([...selectedConversations, contactId]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View className="h-8"></View>
      <View className="flex-1 bg-white">
        <View className="flex-row justify-between items-center px-4 py-2 border-b border-gray-200">
          <Text className="text-black text-lg font-semibold">Chia sẻ</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View className="bg-gray-100 mx-4 my-3 px-3 py-2 rounded-lg">
          <View className="flex-row items-center">
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              className="flex-1 text-black ml-2"
              placeholder="Tìm kiếm..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
            />
            {searchQuery ? (
              <TouchableOpacity onPress={clearSearch}>
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        <View className="flex-row border-b border-gray-200">
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.id}
              className="flex-1"
              onPress={() => setActiveTab(tab.id)}>
              <View
                className={`px-2 py-3 ${
                  activeTab === tab.id ? 'border-b-2 border-blue-500' : ''
                }`}>
                <Text
                  className={`text-center ${
                    activeTab === tab.id ? 'text-blue-500' : 'text-gray-500'
                  }`}>
                  {tab.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'recent' && (
          <View className="h-0.5 bg-blue-500" style={{width: '25%'}} />
        )}

        <ScrollView className="flex-1">
          {filteredData.length > 0 ? (
            filteredData.map(conversation => (
              <Pressable
                key={conversation.conversation_id}
                className="flex-row items-center justify-between px-4 py-3"
                onPress={() =>
                  toggleContactSelection(conversation.conversation_id)
                }>
                <View className="flex-row items-center flex-1">
                  <View className="mr-3">
                    <Image
                      source={{
                        uri: conversation.is_group
                          ? conversation.group_avatar
                          : conversation.other_user[0]?.avatar_url,
                      }}
                      className="w-10 h-10 rounded-full"
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="text-black font-medium">
                      {conversation.is_group
                        ? conversation.group_name
                        : conversation.other_user[0]?.full_name || 'Người lạ'}
                    </Text>
                  </View>
                </View>

                <View
                  className={`w-5 h-5 rounded-full border ${
                    selectedConversations.includes(conversation.conversation_id)
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-400'
                  }`}>
                  {selectedConversations.includes(
                    conversation.conversation_id,
                  ) && (
                    <View className="w-full h-full justify-center items-center">
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    </View>
                  )}
                </View>
              </Pressable>
            ))
          ) : (
            <View className="flex-1 justify-center items-center py-10">
              <Ionicons name="search-outline" size={40} color="#ccc" />
              <Text className="text-gray-500 mt-2">
                {searchQuery
                  ? 'Không tìm thấy kết quả nào'
                  : 'Không có dữ liệu'}
              </Text>
            </View>
          )}
        </ScrollView>

        <View className="bg-gray-100 mx-4 mt-2 mb-3 p-3 rounded-lg flex-row items-center">
          <View className="w-10 h-10 bg-blue-500 rounded justify-center items-center mr-3">
            <Text className="text-white font-bold">
              {selectedMessage.content ? 'TEXT' : 'FILE'}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-black">Chuyển tiếp tin nhắn</Text>
            <Text className="text-gray-700 text-sm" numberOfLines={1}>
              {selectedMessage.content ||
                selectedMessage.attachments?.[0]?.file_name ||
                ''}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center px-4 py-3 border-t border-gray-200">
          <TouchableOpacity
            className="px-4 py-2"
            onPress={() => navigation.goBack()}>
            <Text className="text-gray-600">Hủy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`px-5 py-2 rounded-md ${
              selectedConversations.length === 0 ? 'bg-blue-300' : 'bg-blue-500'
            }`}
            disabled={selectedConversations.length === 0}
            onPress={handleForwardMessage}>
            <Text className="text-white font-semibold">Chia sẻ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForwardMessageScreen;
