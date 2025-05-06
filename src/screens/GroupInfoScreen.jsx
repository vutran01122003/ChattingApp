import React, { useEffect, useMemo, useState } from 'react';
import RNFS from 'react-native-fs';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
  Switch
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateConversation, updateMembersToConversation } from '../redux/thunks/chatThunks';
import {pick, types} from '@react-native-documents/picker';
import Avatar from '../component/Avatar';
import Account from '../component/Account';
import AddMemberModal from '../component/AddMemberModal';
import PermissionGroupModal from '../component/PermissionModal';

import Ionicons from 'react-native-vector-icons/Ionicons'; 
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; 
import Feather from 'react-native-vector-icons/Feather'; 
import { useSocket } from '../context/SocketContext';
import { navigate } from '../component/NavigationService';

const GroupInfo = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const {conversationId, authUser} = route.params;
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminOrSub, setIsAdminOrSub] = useState(false);
  const [conversation, setConversation] = useState(null);
  const { friendConversations, strangerConversations, groupConversations } = useSelector((state) => state.chat);
  const conversations = useMemo(() => {
    return [...friendConversations, ...strangerConversations, ...groupConversations];
  }, [
      JSON.stringify(friendConversations),
      JSON.stringify(strangerConversations),
      JSON.stringify(groupConversations)
  ]);
  const [visibleMemberList, setVisibleMemberList] = useState(false);
  const [visibleEditGroupInfoUI, setVisibleEditGroupInfoUI] = useState(false);
  const [visibleAddMemberModal, setVisibleAddMemberModal] = useState(false);
  const [visiblePermissionModal, setVisiblePermissionModal] = useState(false);
  const [visibleAdminPermissionModal, setVisibleAdminPermissionModal] = useState(false);
  const [file, setFile] = useState(null);
  const [groupName, setGroupName] = useState("");
  const status = 'remove-members';
  const [allowSendMessage, setAllowSendMessage] = useState(false);
  const [allowChangeGroupInfo, setAllowChangeGroupInfo] = useState(false);

  const handleToggleAllowSendMessagePermission = () => {
    setAllowSendMessage((prev) => !prev);

    dispatch(
        updateConversation({
            conversationId: conversation.conversation_id,
            allowSendMessage: !allowSendMessage
        })
    ).then((data) => {
        socket.emit("update_conversation", data.payload);
    });
  };

  const handleToggleAllowChangeGroupInfoPermission = () => {
      setAllowChangeGroupInfo((prev) => !prev);

      dispatch(
          updateConversation({
              conversationId: conversation.conversation_id,
              allowChangeGroupInfo: !allowChangeGroupInfo
          })
      ).then((data) => {
          socket.emit("update_conversation", data.payload);
      });
  };

  const handleTogglePermisionModal = () => {
    setVisiblePermissionModal((prev) => !prev);
  };

  const handleToggleAdminPermisionModal = () => {
      setVisibleAdminPermissionModal((prev) => !prev);
  };

  const handleToggleVisibleEditGroupInfoUI = () => {
    setVisibleEditGroupInfoUI((prev) => !prev);
  };

  const handleRemoveMemberFromConversation = (user) => {
    dispatch(
      updateMembersToConversation({
          userIdList: [user._id],
          conversationId: conversation.conversation_id,
          status
      })
    ).then((res) => {
        socket.emit("update_conversation_members", {
            ...res.payload,
            status,
            removedUser: user
        });
    });
  };

  const handleToggleVisibleMemberList = () => {
    setVisibleMemberList((prev) => !prev);
};

  const handleToggleVisibleAddMemberModal = () => {
      setVisibleAddMemberModal((prev) => !prev);
  };

  const resetFile = () => setFile(null);

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


  const handleUpdateGroupInfo = async () => {
    if (!groupName) return;

    const payload = {
      conversationId: conversation.conversation_id,
      groupName: groupName
    }
 
    if (file) {
      const base64 = await RNFS.readFile(file.uri, 'base64');
      payload.base64 = base64
    }


    dispatch(updateConversation(payload)).then((data) => {
      socket.emit('update_conversation', data.payload);
      setVisibleEditGroupInfoUI(false);
    });
  };

  const handleLeaveGroup = () => {
    dispatch(updateMembersToConversation({
      userIdList: [authUser._id],
      conversationId: conversation.conversation_id,
      status
    })).then((res) => {
      socket.emit('update_conversation_members', {
        ...res.payload,
        status,
        removedUser: authUser
      });
      Alert.alert("Rời nhóm", "Bạn đã rời khỏi nhóm");
      navigate("MainApp")
    });
  };

  const handleDeleteGroup = () => {
    dispatch(updateConversation({
      conversationId: conversation?.conversation_id,
      isActive: false
    })).then((data) => {
      socket.emit('update_conversation', {
        ...data.payload,
        delete_group: true
      });
      
      Alert.alert("Nhóm đã bị giải tán", );
      navigate("MainApp")
    });
  };

  useEffect(() => {
    setAllowSendMessage(conversation?.allow_send_message);
    setAllowChangeGroupInfo(conversation?.allow_change_group_info);
  }, [JSON.stringify(conversation)]);

  useEffect(() => {
    if (conversationId ) setConversation(conversations.find((conversation) => conversation.conversation_id === conversationId));
  }, [conversationId, JSON.stringify(conversations)]);

  useEffect(() => {
    if(conversation && authUser) {
      setGroupName(conversation.group_name)
      setAllowChangeGroupInfo(conversation.allow_change_group_info)
      setAllowSendMessage(conversation.allow_send_message)
      setIsAdmin(conversation.admin.includes(authUser._id));
      setIsAdminOrSub([...conversation.admin, ...conversation.sub_admin].includes(authUser._id))
    }
  }, [conversation, authUser])

  return (
   conversation &&  <ScrollView className="w-full h-full bg-white border-l border-gray-200">
   {visibleAddMemberModal && (
     <AddMemberModal
       handleToggleVisibleAddMemberModal={handleToggleVisibleAddMemberModal}
       otherUser={conversation.other_user}
       conversation={conversation}
       visible={visibleAddMemberModal}
       authUser={authUser}
     />
   )}

   {visiblePermissionModal && (
         <PermissionGroupModal
             users={conversation.participants.filter((participant) => participant._id !== authUser._id)}
             handleTogglePermisionModal={handleTogglePermisionModal}
             conversation={conversation}
             visible={visiblePermissionModal}
         />
     )}

     {visibleAdminPermissionModal && (
         <PermissionGroupModal
             users={conversation.participants.filter((participant) => participant._id !== authUser._id)}
             handleTogglePermisionModal={handleToggleAdminPermisionModal}
             conversation={conversation}
             visible={visibleAdminPermissionModal}
             adminPermission={true}
         />
     )}

   <View className="items-center border-b border-gray-200 py-4 flex-row">
      <TouchableOpacity onPress={() => {
        navigate("ChatMessage", {conversationId: conversation.conversation_id})
      }}>
        <Text className='ml-2 font-bold text-2xl'>
          {'<'}
        </Text>
      </TouchableOpacity>
     <Text className="text-lg font-semibold flex-1 text-center">Thông tin nhóm</Text>
   </View>

   {visibleMemberList ? (
     <View className="px-4">
       {conversation.participants.map((user) => (
         <Account
           key={user._id}
           user={user}
           authUser={authUser}
           group
           conversation={conversation}
           handleRemoveMemberFromConversation={handleRemoveMemberFromConversation}
         />
       ))}
     </View>
   ) : (
     <>
       <View className={`items-center ${visibleEditGroupInfoUI ? "pb-8" : "py-4"}`}>
         {!visibleEditGroupInfoUI ? (
           <>
             <Avatar src={conversation?.group_avatar} alt="avatar" size={80} />
             <Text className="font-semibold text-base mt-2">{conversation?.group_name}</Text>
              {
                allowChangeGroupInfo &&
                  <TouchableOpacity
                    className="absolute top-2 right-4"
                    onPress={handleToggleVisibleEditGroupInfoUI}
                  >
                    <MaterialIcons name="edit" size={20} color="#333" />
                </TouchableOpacity>
              }
            
           </>
         ) : (
            <>
              <Text className="font-medium text-lg mb-4">Chỉnh sửa thông tin</Text>
                {file ? (
                  <View className="relative w-20 h-20 rounded-full">
                    <Image
                      source={{ uri: file.uri }}
                      className="w-full h-full rounded-full"
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      className="absolute -bottom-1 right-1 w-6 h-6 bg-gray-500 rounded-full items-center justify-center"
                      onPress={resetFile}
                    >
                      <Ionicons name="close" size={14} color="white" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={handleImagePick}
                    className="w-20 h-20 rounded-full bg-gray-200 items-center justify-center"
                  >
                    <MaterialIcons name="edit" size={20} color="#555" />
                  </TouchableOpacity>
                )}

                <TextInput
                  className="border border-gray-300 mt-3 px-3 py-2 rounded w-60"
                  value={groupName}
                  onChangeText={setGroupName}
                  placeholder="Tên nhóm..."
                />

                <View className="flex-row gap-2 mt-4">
                  <TouchableOpacity
                    disabled={!groupName}
                    onPress={handleUpdateGroupInfo}
                    className={`w-24 py-2 rounded ${groupName ? "bg-blue-500" : "bg-blue-300"}`}
                  >
                    <Text className="text-center text-white font-semibold">Cập nhật</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleToggleVisibleEditGroupInfoUI}
                    className="w-24 py-2 bg-red-500 rounded"
                  >
                    <Text className="text-center text-white font-semibold">Hủy</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>

          <View className="px-6 py-4 border-y border-gray-300">
            <Text className="font-medium mb-2">Thành viên nhóm</Text>
            <TouchableOpacity
              onPress={handleToggleVisibleAddMemberModal}
              className="flex-row items-center mb-2"
            >
              <Ionicons name="add-circle-outline" size={16} />
              <Text className="ml-2 text-sm">Thêm thành viên</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleToggleVisibleMemberList}
              className="flex-row items-center"
            >
              <Feather name="users" size={16} />
              <Text className="ml-2 text-sm">{`${conversation.participants.length} thành viên`}</Text>
            </TouchableOpacity>
          </View>

          <View className="px-6 py-4 border-b border-gray-300">
            <Text className="font-medium mb-2">Trưởng và phó nhóm</Text>

            <TouchableOpacity
              disabled={!isAdmin}
              onPress={isAdmin ? handleTogglePermisionModal : null}
            >
              <Text className={`text-sm text-gray-700 mb-2 ${isAdmin ? 'text-blue-600' : 'text-gray-400'}`}>
                Quản lý phó nhóm
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={!isAdmin}
              onPress={isAdmin ? handleToggleAdminPermisionModal : null}
            >
              <Text className={`text-sm text-gray-700 mb-2 ${isAdmin ? 'text-blue-600' : 'text-gray-400'}`}>
                Chuyển quyền trưởng nhóm
              </Text>
            </TouchableOpacity>
          </View>

          <View className="px-6 py-4 border-b border-gray-300">
            <Text className="font-medium mb-2">Quyền hạn thành viên</Text>
            <View className="px-4">
              <TouchableOpacity
                className="flex-row justify-between items-center py-1 mb-2"
                disabled={!isAdminOrSub}
                onPress={isAdminOrSub ? handleToggleAllowChangeGroupInfoPermission : null}
              >
                <Text className="text-sm text-gray-700">Thay đổi tên & ảnh đại diện của nhóm</Text>
                <Switch
                  value={allowChangeGroupInfo}
                  onValueChange={isAdminOrSub ? handleToggleAllowChangeGroupInfoPermission : null}
                  trackColor={{ false: "#ccc", true: "#3b82f6" }}
                  thumbColor="#fff"
                />
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row justify-between items-center py-1"
                disabled={!isAdminOrSub}
                onPress={isAdminOrSub ? handleToggleAllowSendMessagePermission : null}
              >
                <Text className="text-sm text-gray-700">Gửi tin nhắn</Text>
                <Switch
                  value={allowSendMessage}
                  onValueChange={isAdminOrSub ? handleToggleAllowSendMessagePermission : null}
                  trackColor={{ false: "#ccc", true: "#3b82f6" }}
                  thumbColor="#fff"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex flex-col gap-4 px-6 py-4">
            <TouchableOpacity
              className="w-full bg-red-200 py-2 rounded"
              onPress={handleLeaveGroup}
            >
              <Text className="text-center text-red-600 font-semibold">Rời nhóm</Text>
            </TouchableOpacity>

            {isAdmin && (
              <TouchableOpacity
                className="w-full bg-red-200 py-2 rounded"
                onPress={handleDeleteGroup}
              >
                <Text className="text-center text-red-600 font-semibold">Giải tán nhóm</Text>
              </TouchableOpacity>
            )}
        </View>
      </>
    )}
  </ScrollView>
  );
};

export default GroupInfo;
