import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getFriendList } from "../redux/slices/friendSlice";
import { getUserBySearch } from "../redux/slices/authSlice";
import { updateMembersToConversation } from "../redux/thunks/chatThunks";
import Avatar from "./Account";
import Icon from "react-native-vector-icons/Ionicons";
import { useSocket } from "../context/SocketContext";
import { Checkbox } from "react-native-paper";

const sortByTheFirstLetter = (arr, otherUser) => {
  return arr.reduce((acc, contact) => {
    if (otherUser.every((user) => user?._id !== contact?._id)) {
      const firstLetter = contact.full_name[0].toUpperCase();
      if (!acc[firstLetter]) acc[firstLetter] = [];
      acc[firstLetter].push(contact);
    }
    return acc;
  }, {});
};

const AddMemberModal = ({
  visible,
  handleToggleVisibleAddMemberModal,
  otherUser,
  conversation,
  authUser
}) => {
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const friendship = useSelector((state) => state.friendship);
  const status = "add-members";

  const [keyword, setKeyWord] = useState("");
  const [selected, setSelected] = useState([]);
  const [groupedContacts, setGroupedContacts] = useState({});

  const toggleSelect = (userId) => {
    setSelected((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAddMembersToConversation = () => {
    dispatch(
      updateMembersToConversation({
        conversationId: conversation.conversation_id,
        userIdList: selected,
        status
      })
    ).then((res) => {
      handleToggleVisibleAddMemberModal();
      socket.emit("update_conversation_members", {
        ...res.payload,
        status,
        newUserIdList: selected
      });
    });
  };

  useEffect(() => {
    dispatch(getFriendList())
  }, []);

  useEffect(() => {
    setGroupedContacts(sortByTheFirstLetter(friendship.friendList, otherUser));
  }, [JSON.stringify(friendship.friendList), otherUser]);

  useEffect(() => {
    let timerId;
    if (keyword && otherUser) {
      timerId = setTimeout(() => {
        dispatch(getUserBySearch({ search: keyword, forGroup: true })).then((data) => {
          if (data?.error) setGroupedContacts({});
          else
            setGroupedContacts(
              sortByTheFirstLetter(data.payload.metadata, otherUser)
            );
        });
      }, 500);
    } else {
      setGroupedContacts(sortByTheFirstLetter(friendship.friendList, otherUser));
    }

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [keyword, otherUser]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/40 justify-center items-center">
        <View className="w-11/12 bg-white rounded-xl p-4 max-h-[90%]">
          {/* Header */}
          <View className="relative mb-4">
            <Text className="text-xl font-semibold">Thêm thành viên</Text>
            <TouchableOpacity
              className="absolute right-0 top-0 p-2"
              onPress={handleToggleVisibleAddMemberModal}
            >
              <Icon name="close" size={22} color="red" />
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <TextInput
            placeholder="Nhập tên hoặc số điện thoại..."
            className="border border-gray-300 h-12 px-3 rounded-xl mb-3"
            value={keyword}
            onChangeText={setKeyWord}
          />

          {
            Object.keys(groupedContacts).length > 0 && 
              <View className="max-h-[60vh]">
                {Object.entries(groupedContacts).map(([letter, items]) => (
                  <View key={letter} className="mb-2">
                    <Text className="font-bold text-gray-700 mb-1">{letter}</Text>
                    {items.map((item, index) => {
                        return (
                          <TouchableOpacity key={index} className="flex-row items-center mb-2" onPress={() => {
                            toggleSelect(item._id)
                          }}>
                              <Checkbox status={selected.includes(item?._id) ? 'checked' : 'unchecked'} readOnly />
                              <View className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                  <Avatar conversation={conversation} authUser={authUser} user={item} src={item.avatar_url} alt={item.full_name} size={32} />
                              </View>
                              <Text className="ml-10 font-semibold">{item.full_name}</Text>
                          </TouchableOpacity>
                        )
                    })}
                  </View>
                ))}
              </View>
          }
        

          {/* Footer Buttons */}
          <View className="flex-row justify-end gap-2 mt-4">
            <TouchableOpacity
              className="h-10 px-4 bg-gray-300 rounded justify-center items-center"
              onPress={handleToggleVisibleAddMemberModal}
            >
              <Text className="font-semibold">Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={selected.length === 0}
              className={`h-10 px-5 rounded justify-center items-center ${
                selected.length === 0
                  ? "bg-blue-300"
                  : "bg-blue-500"
              }`}
              onPress={handleAddMembersToConversation}
            >
              <Text className="text-white font-semibold">Thêm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddMemberModal;
