import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal as RNModal,
} from "react-native";
import { useDispatch } from "react-redux";
import { updateConversation } from "../redux/thunks/chatThunks";
import Avatar from "../component/Avatar";
import Icon from "react-native-vector-icons/FontAwesome";
import { useSocket } from "../context/SocketContext";
import { Checkbox } from "react-native-paper";
import { navigate } from "./NavigationService";

const sortByTheFirstLetter = (arr) => {
  return arr.reduce((acc, contact) => {
    const firstLetter = contact.full_name.charAt(0).toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(contact);
    return acc;
  }, {});
};

const PermissionGroupModal = ({
  users,
  handleTogglePermisionModal,
  conversation,
  adminPermission,
  visible,
}) => {
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const [keyword, setKeyword] = useState("");
  const [selected, setSelected] = useState([]);
  const [groupedContacts, setGroupedContacts] = useState({});
  const [userList, setUserList] = useState(users);

  const toggleSelect = (id) => {
    if (adminPermission) {
      setSelected([id]);
    } else {
      setSelected((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    }
    
  };

  const handleAddSubAdminToConversation = () => {
    dispatch(
      updateConversation({
        conversationId: conversation.conversation_id,
        subAdmin: selected,
        subAdminStatus: "add-sub-admin",
      })
    ).then((data) => {
      socket.emit("update_conversation", data.payload);
      setKeyword("");
      setSelected([]);
    });
  };

  const handleChangeAdmin = () => {
    dispatch(
      updateConversation({
        conversationId: conversation.conversation_id,
        admin: selected,
      })
    ).then((data) => {
      socket.emit("update_conversation", data.payload);
      setKeyword("");
      setSelected([]);
      handleTogglePermisionModal();
    });
  };

  const handleDeleteSubAdminToConversation = (userId) => {
    dispatch(
      updateConversation({
        conversationId: conversation.conversation_id,
        subAdmin: [userId],
        subAdminStatus: "delete-sub-admin",
      })
    ).then((data) => {
      socket.emit("update_conversation", data.payload);
      setKeyword("");
      setSelected([]);
    });
  };

  useEffect(() => {
    if (!keyword) {
      setUserList(users.filter((u) => !conversation.sub_admin.includes(u._id)));
    } else {
      setUserList(
        users.filter((u) =>
          u.full_name.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    }
  }, [keyword, conversation.sub_admin]);

  useEffect(() => {
    if (userList) {
      setGroupedContacts(sortByTheFirstLetter(userList));
    }
  }, [userList]);

  return (
    <RNModal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="w-[90%] bg-white rounded-2xl p-4">
          {!adminPermission && (
            <ScrollView className="max-h-48 mb-3">
              <Text className="font-semibold mb-2">Danh sách phó nhóm</Text>
              {users.map((user) => {
                if (conversation.sub_admin.includes(user._id)) {
                  return (
                    <View
                      key={user._id}
                      className="flex-row items-center mb-3"
                    >
                      <Avatar src={user.avatar_url} size={40} />
                      <Text className="flex-1 ml-2 font-semibold">
                        {user.full_name}
                      </Text>
                      <TouchableOpacity
                        className="bg-stone-300/20 rounded-full h-6 w-6 items-center justify-center"
                        onPress={() => handleDeleteSubAdminToConversation(user._id)}
                      >
                        <Icon name="minus" size={14} color="red" />
                      </TouchableOpacity>
                    </View>
                  );
                }
                return null;
              })}
              {conversation.sub_admin.length === 0 && (
                <Text className="text-center text-gray-500">Trống</Text>
              )}
            </ScrollView>
          )}

          <View className="mb-3">
            <Text className="font-semibold mb-2">
              {adminPermission ? "Chuyển quyền trưởng nhóm" : "Thêm phó nhóm"}
            </Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-3 h-12"
              placeholder="Nhập tên..."
              value={keyword}
              onChangeText={setKeyword}
            />
          </View>

          <ScrollView className="max-h-48">
            {Object.entries(groupedContacts).map(([letter, items]) => (
              <View key={letter} className="mb-2">
                <Text className="font-bold text-gray-700 mb-1">{letter}</Text>
                {items.map(({ _id, full_name, avatar_url }) => (
                  <TouchableOpacity
                    key={_id}
                    className="flex-row items-center mb-2"
                    onPress={() => toggleSelect(_id)}
                  >
                    <Checkbox status={selected.includes(_id) ? 'checked' : 'unchecked'} />
                    <View className="w-8 h-8 rounded-full bg-gray-200 mx-2 items-center justify-center">
                      <Avatar src={avatar_url} size={32} />
                    </View>
                    <Text>{full_name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </ScrollView>

          <View className="flex-row justify-end mt-4 space-x-2 gap-3">
            <TouchableOpacity
              className="bg-gray-300 rounded px-4 py-2"
              onPress={handleTogglePermisionModal}
            >
              <Text className="font-semibold">Hủy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={selected.length === 0}
              className={`rounded px-4 py-2 ${
                selected.length === 0
                  ? "bg-blue-300"
                  : "bg-blue-500"
              }`}
              onPress={
                adminPermission
                  ? handleChangeAdmin
                  : handleAddSubAdminToConversation
              }
            >
              <Text className="text-white font-semibold">
                {adminPermission ? "Đồng ý" : "Thêm"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </RNModal>
  );
};

export default PermissionGroupModal;
