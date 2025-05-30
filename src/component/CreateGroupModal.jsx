import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Modal
} from "react-native";
import {pick, types} from '@react-native-documents/picker';
import { useDispatch, useSelector } from "react-redux";
import { getFriendList } from "../redux/slices/friendSlice";
import { createConversation } from "../redux/thunks/chatThunks";
import { getUserBySearch } from "../redux/slices/authSlice";
import Avatar from "./Avatar"; 
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useSocket } from "../context/SocketContext";

const sortByTheFirstLetter = (arr) => {
  return arr.reduce((acc, contact) => {
    const firstLetter = contact.full_name?.[0]?.toUpperCase() || "#";
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(contact);
    return acc;
  }, {});
};

const CreateGroupModal = ({ visible, handleToggleDisplayCreateGroupModal }) => {
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const friendship = useSelector((state) => state.friendship);

  const [groupName, setGroupName] = useState("");
  const [keyword, setKeyword] = useState("");
  const [selected, setSelected] = useState([]);
  const [file, setFile] = useState(null);
  const [groupedContacts, setGroupedContacts] = useState({});

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const resetData = () => {
    setGroupName("");
    setSelected([]);
    setFile(null);
  };

  const handleCreateGroup = async () => {
    if (selected.length === 0 || !groupName) return;

    let payload = {
        groupName,
        otherUserId: selected
    }

    if (file) {
      const base64 = await RNFS.readFile(file.uri, 'base64');
      payload.base64 = base64
    }
    
    dispatch(createConversation(payload)).then((data) => {
        console.log(data);
      resetData();
      handleToggleDisplayCreateGroupModal();
      socket.emit("create_conversation", data.payload);
    });
  };

  const handleImagePick = async () => {
      try {
        const [file] = await pick({
          type: [
            types.images,
          ],
          copyTo: 'cachesDirectory',
        });
  
        if (file.size > 10 * 1024 * 1024) {
          Alert.alert('Lỗi', 'Kích thước file quá lớn (tối đa 10MB)');
          return;
        }
  
        setFile(file);
      } catch (error) {
        if (!DocumentPicker.isCancel(error)) Alert.alert('Failed to pick file:', error);
      } 
    };

  useEffect(() => {
    dispatch(getFriendList());
  }, []);

  useEffect(() => {
    setGroupedContacts(sortByTheFirstLetter(friendship.friendList || []));
  }, [friendship.friendList]);

  useEffect(() => {
    let timerId = null;
    if (keyword) {
      timerId = setTimeout(() => {
        dispatch(getUserBySearch({ search: keyword, forGroup: true })).then(
          (data) => {
            if (data?.error) setGroupedContacts({});
            else
              setGroupedContacts(
                sortByTheFirstLetter(data.payload.metadata || [])
              );
          }
        );
      }, 500);
    } else {
      setGroupedContacts(sortByTheFirstLetter(friendship.friendList || []));
    }

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [keyword]);

  return (
    <Modal visible={visible} animationType="slide" >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="bg-white rounded-xl p-4 w-full max-w-md self-center"
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold">Tạo nhóm</Text>
          <TouchableOpacity onPress={handleToggleDisplayCreateGroupModal}>
            <Ionicons name="close" size={24} color="red" />
          </TouchableOpacity>
        </View>

        {/* Group Info */}
        <View className="flex-row items-center gap-2 mb-2">
          {file ? (
            <View className="relative">
              <Image
                source={{ uri: file.uri }}
                className="w-10 h-10 rounded-full"
              />
              <TouchableOpacity
                className="absolute -right-1 -bottom-1 bg-white p-0.5 rounded-full border"
                onPress={() => setFile(null)}
              >
                <MaterialIcons name="delete-outline" size={16} color="red" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              className="w-10 h-10 border border-gray-300 rounded-full items-center justify-center"
              onPress={handleImagePick}
            >
              <Ionicons name="camera" size={20} color="gray" />
            </TouchableOpacity>
          )}
          <TextInput
            className="flex-1 h-12 border border-gray-300 rounded px-3"
            placeholder="Nhập tên nhóm..."
            value={groupName}
            onChangeText={setGroupName}
          />
        </View>

        {/* Search */}
        <TextInput
          className="h-12 border border-gray-300 rounded px-3 mb-3"
          placeholder="Nhập tên hoặc số điện thoại..."
          value={keyword}
          onChangeText={setKeyword}
        />

        {/* Contact List */}
        <ScrollView className="h-72">
          {Object.entries(groupedContacts).map(([letter, items]) => (
            <View key={letter} className="mb-2">
              <Text className="font-bold text-gray-700 mb-1">{letter}</Text>
              {items.map(({ _id, full_name, avatar_url }) => (
                <TouchableOpacity
                  key={_id}
                  className="flex-row items-center gap-2 mb-2"
                  onPress={() => toggleSelect(_id)}
                >
                  <Ionicons
                    name={
                      selected.includes(_id)
                        ? "checkbox"
                        : "square-outline"
                    }
                    size={20}
                    color="gray"
                  />
                  <Avatar src={avatar_url} size={32} />
                  <Text>{full_name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>

        {/* Buttons */}
        <View className="flex-row justify-end mt-4 gap-2">
          <TouchableOpacity
            className="bg-gray-300 px-4 py-2 rounded"
            onPress={handleToggleDisplayCreateGroupModal}
          >
            <Text className="text-black font-semibold">Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={!groupName || selected.length < 2}
            className={`px-4 py-2 rounded ${
              !groupName || selected.length < 2
                ? "bg-blue-300"
                : "bg-blue-500"
            }`}
            onPress={handleCreateGroup}
          >
            <Text className="text-white font-semibold">Tạo nhóm</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CreateGroupModal;
