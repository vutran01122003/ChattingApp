import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Text,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

const emojis = ['❤️', '👍', '😆', '😮', '😭', '😡'];

const MessageInput = ({
  inputText,
  handleInputChange,
  isSending,
  handleSendMessage,
  onPickMedia,
  onPickFile,
  conversation,
  authUser,
  isBlocked,
  isBlockedUser
}) => {
  const [showEmojis, setShowEmojis] = useState(false);
  const allow_send_message = conversation?.allow_send_message;
  const isAdminOrSub = [...conversation.admin, ...conversation.sub_admin].includes(authUser._id);
  
  // Check if user can send messages (not blocked and has permission)
  const canSendMessage = !isBlocked && !isBlockedUser && (allow_send_message || isAdminOrSub);

  const handleEmojiPress = emoji => {
    handleInputChange(inputText + emoji);
    setShowEmojis(false);
  };

  return (
    <View className="bg-gray-100">
      {showEmojis && (
        <FlatList
          horizontal
          data={emojis}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => handleEmojiPress(item)}
              className="p-2">
              <Text style={{fontSize: 24}}>{item}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{paddingHorizontal: 10}}
        />
      )}

      <View className="flex-row items-center p-2">
        <TouchableOpacity
          className="mr-2"
          onPress={() => canSendMessage ? setShowEmojis(!showEmojis) : null}>
          <FontAwesome name="smile-o" size={24} color="#7D7D7D" />
        </TouchableOpacity>

        <TextInput
          className="flex-1 bg-gray-200 rounded-full px-4 py-2 text-black max-h-24"
          placeholder={canSendMessage ? "Tin nhắn" : "Bạn không thể gửi tin nhắn"}
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={handleInputChange}
          multiline
          readOnly={!canSendMessage}
        />

        <View className="flex-row ml-2">
          <TouchableOpacity className="ml-2" onPress={canSendMessage ? onPickMedia : null}>
            <Ionicons 
              name="image-outline" 
              size={24} 
              color={canSendMessage ? "#7D7D7D" : "#CCCCCC"} 
            />
          </TouchableOpacity>

          <TouchableOpacity className="ml-2" onPress={canSendMessage ? onPickFile : null}>
            <Feather 
              name="paperclip" 
              size={24} 
              color={canSendMessage ? "#7D7D7D" : "#CCCCCC"} 
            />
          </TouchableOpacity>

          <TouchableOpacity
            className={`ml-2 ${
              inputText && !isSending && canSendMessage
                ? 'bg-blue-500 rounded-full w-9 h-9 items-center justify-center'
                : ''
            }`}
            disabled={!inputText || isSending || !canSendMessage}
            onPress={canSendMessage ? handleSendMessage : null}>
            {isSending ? (
              <ActivityIndicator size="small" color="#7D7D7D" />
            ) : (
              <Ionicons
                name="send"
                size={24}
                color={inputText && canSendMessage ? '#FFFFFF' : '#7D7D7D'}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MessageInput;