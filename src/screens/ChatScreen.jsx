import React, {useState} from 'react';
import {
  View,
  TextInput,
  Pressable,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';

function YourComponent({navigation, route}) {
  const userName = route.params?.name || 'Username';
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim()) {
      setMessages([...messages, {text: inputText, sent: true}]);
      setInputText('');
    }
  };

  const handleCallPress = () => {
    console.log('Call pressed');
    // Add call functionality here
  };

  const handleVideoPress = () => {
    console.log('Video call pressed');
    // Add video call functionality here
  };

  const handleMenuPress = () => {
    console.log('Menu pressed');
    // Add menu functionality here
  };

  return (
    <SafeAreaView className="flex-1">
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      {/* Custom Header */}
      <View className="bg-blue-600 p-4 flex-row items-center justify-between my-6">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className="text-white text-2xl mr-2">⬅</Text>
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold">{userName}</Text>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity onPress={handleCallPress}>
            <Text className="text-white text-xl mx-3">📞</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleVideoPress}>
            <Text className="text-white text-xl mx-3">🎥</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleMenuPress}>
            <Text className="text-white text-xl mx-3">⋮</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Message Area with ScrollView */}
      <ScrollView className="flex-1 p-4 bg-gray-100">
        {messages.map((msg, index) => (
          <View
            key={index}
            className={`p-3 my-2 rounded-lg ${
              msg.sent ? 'bg-blue-200 self-end' : 'bg-blue-100 self-start'
            } max-w-[70%]`}>
            <Text className="text-black">{msg.text}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Input Area */}
      <View className="flex-row items-center p-3 bg-white border-t border-gray-200">
        <TextInput
          className="flex-1 p-2 bg-gray-200 rounded-full mr-2 text-black"
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor="#888"
        />
        <Pressable className="mx-2">
          <Text className="text-2xl">😊</Text>
        </Pressable>
        <Pressable className="mx-2">
          <Text className="text-2xl text-gray-600">+</Text>
        </Pressable>
        <Pressable onPress={handleSend}>
          <Text className="text-blue-600 font-semibold text-lg mx-2">Send</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default YourComponent;
