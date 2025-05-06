import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Avatar from "./Avatar"; 
import Icon from "react-native-vector-icons/FontAwesome"; 
import { createConversation } from "../redux/thunks/chatThunks";

const Account = ({
  user,
  authUser,
  group,
  conversation,
  handleRemoveMemberFromConversation,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleOpenConversation = () => {
    if (authUser?._id === user?._id) return;

    dispatch(
      createConversation({
        otherUserId: [user?._id],
      })
    ).then((res) => {
      const { conversation_id } = res.payload;
      navigation.navigate("ChatScreen", { conversationId: conversation_id });
    });
  };

  const isAdmin = group && conversation.admin.includes(user._id);
  const isSubAdmin = group && conversation.sub_admin.includes(user._id);
  const isCurrentUser = authUser._id === user._id;
  const isAuthAdmin =
    [...conversation.admin, ...conversation.sub_admin].includes(authUser._id);
  const isTargetAdmin =
    [...conversation.admin, ...conversation.sub_admin].includes(user._id);
  const canRemove =
    group &&
    isAuthAdmin &&
    (!isTargetAdmin || conversation.admin.includes(authUser._id)) &&
    !isCurrentUser;

  return (
    <TouchableOpacity
      className="flex-row gap-3 items-center px-4 py-3 border-b border-gray-200 bg-white w-full"
      onPress={handleOpenConversation}
    >
      <View className="flex-row gap-3 items-center flex-1">
        <View className="h-10 w-10 relative">
          <Avatar src={user.avatar_url} alt={user.full_name} size={40} />
          {(isAdmin || isSubAdmin) && (
            <View className="h-5 w-5 rounded-full bg-stone-600/60 items-center justify-center absolute -bottom-0.5 -right-0.5">
              <Icon
                name="key"
                size={12}
                color={isAdmin ? "yellow" : "white"}
              />
            </View>
          )}
        </View>
        <Text className="text-sm font-medium text-gray-900">
          {isCurrentUser ? "Bạn" : user.full_name}
        </Text>
      </View>

      {canRemove && (
        <TouchableOpacity
          className="rounded-full bg-stone-600/10 items-center justify-center p-2"
          onPress={() => handleRemoveMemberFromConversation(user)}
        >
          <Icon name="minus" size={14} color="red" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default Account;
