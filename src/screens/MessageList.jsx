import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video';
import {
  deleteMessage,
  getConversationMessages,
  reactionMessage,
  revokeMessage,
  unReactionMessage,
} from '../redux/thunks/chatThunks';
import {createRef, useState, useRef} from 'react';
import {Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const MessageList = ({
  flatListRef,
  messages,
  renderDateHeader,
  renderTypingIndicator,
  hasScrolledToTop,
  dispatch,
  messagePagination,
  currentUserId,
  openFullscreenMedia,
  currentConversation,
  revokeMessageSocket,
  deleteMessageSocket,
  addReactionSocket,
  removeReactionSocket,
}) => {
  const reactionList = [
    {icon: '❤️', code: ':heart'},
    {icon: '👍', code: ':like'},
    {icon: '😆', code: ':haha'},
    {icon: '😮', code: ':wow'},
    {icon: '😭', code: ':huhu'},
    {icon: '😡', code: ':angry'},
  ];
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [menuPosition, setMenuPosition] = useState({x: 0, y: 0});
  const messageRef = useRef(null);
  const navigation = useNavigation();

  const handleLongPress = item => {
    if (messageRef.current) {
      messageRef.current.measureInWindow((x, y) => {
        setMenuPosition({x, y});
        setSelectedMessage(item);
      });
    }
  };

  const renderReactions = (reactions, isCurrentUser) => {
    if (!reactions || reactions.length === 0) return null;

    const emojiCounts = {};
    reactions.forEach(reaction => {
      const emoji = reaction.emoji;
      emojiCounts[emoji] = (emojiCounts[emoji] || 0) + 1;
    });

    const totalReactions = reactions.length;

    const uniqueEmojis = Object.keys(emojiCounts).slice(0, 3);
    const reactionIcons = uniqueEmojis.map(emojiCode => {
      const reaction = reactionList.find(r => r.code === emojiCode);
      return reaction ? reaction.icon : '👍';
    });

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'white',
          borderWidth: 1,
          borderColor: '#e2e8f0',
          borderRadius: 999,
          paddingHorizontal: 6,
          paddingVertical: 2,
          position: 'absolute',
          bottom: -10,
          [isCurrentUser ? 'right' : 'left']: 4,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 0.1,
          shadowRadius: 1,
          elevation: 2,
          zIndex: 10,
        }}>
        {reactionIcons.map((icon, index) => (
          <Text key={index} style={{fontSize: 12, marginRight: 2}}>
            {icon}
          </Text>
        ))}
        {totalReactions > 0 && (
          <Text style={{color: '#333', fontSize: 10}}>{totalReactions}</Text>
        )}
      </View>
    );
  };

  const renderMessage = ({item}) => {
    const isCurrentUser = item.sender._id === currentUserId;

    if (item.deleted_by.includes(currentUserId)) {
      return (
        <View
          className={`flex-row items-end my-1 max-w-4/5 ${
            item.sender._id === currentUserId
              ? 'self-end flex-row-reverse'
              : 'self-start'
          }`}>
          {!isCurrentUser && (
            <Image
              source={{
                uri: item.sender.avatar_url,
              }}
              className="w-8 h-8 rounded-full mr-2"
            />
          )}
          <View
            className={`p-3 rounded-2xl ${
              item.sender._id === currentUserId
                ? 'bg-blue-200 rounded-br-md mr-1'
                : 'bg-gray-200 rounded-bl-md ml-1'
            }`}>
            <Text className="text-gray-500 italic text-sm">
              Tin nhắn đã bị xóa
            </Text>
          </View>
          <Text className="text-gray-500 text-xs mt-1">
            {new Date(item.createdAt).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      );
    }

    if (item.is_revoked) {
      const isCurrentUser = item.sender._id === currentUserId;

      return (
        <View
          className={`flex-row items-end my-1 max-w-4/5 ${
            isCurrentUser ? 'self-end flex-row-reverse' : 'self-start'
          }`}>
          {!isCurrentUser && (
            <Image
              source={{
                uri: item.sender.avatar_url,
              }}
              className="w-8 h-8 rounded-full mr-2"
            />
          )}
          <View
            className={`p-3 rounded-2xl ${
              isCurrentUser
                ? 'bg-blue-200 rounded-br-md mr-1'
                : 'bg-gray-200 rounded-bl-md ml-1'
            }`}>
            <Text className="text-gray-500 italic text-sm">
              Tin nhắn đã bị thu hồi
            </Text>
          </View>
          <Text className="text-gray-500 text-xs mt-1">
            {new Date(item.createdAt).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      );
    }

    return (
      <TouchableOpacity
        ref={messageRef}
        activeOpacity={0.9}
        delayLongPress={500}
        onLongPress={() => handleLongPress(item)}
        className={`flex-row items-end my-1 max-w-4/5 ${
          isCurrentUser ? 'self-end flex-row-reverse' : 'self-start'
        }`}>
        {!isCurrentUser && (
          <Image
            source={{
              uri: item.sender.avatar_url,
            }}
            className="w-8 h-8 rounded-full mr-2"
          />
        )}
        <View className="relative">
          <View
            className={`p-3 rounded-2xl ${
              isCurrentUser
                ? 'bg-blue-200 rounded-br-md mr-1'
                : 'bg-gray-200 rounded-bl-md ml-1'
            }`}>
            {item.content && (
              <Text className="text-black text-base">{item.content}</Text>
            )}

            {item.attachments && renderAttachments(item.attachments)}
          </View>

          {item.reactions &&
            item.reactions.length > 0 &&
            renderReactions(item.reactions, isCurrentUser)}
        </View>
        <Text className="text-gray-500 text-xs mt-1">
          {new Date(item.createdAt).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleAddReaction = async (messageId, emoji) => {
    setSelectedMessage(null);
    const res = await dispatch(reactionMessage({messageId, emoji}));
    addReactionSocket(res.payload);
  };

  const renderAttachments = attachments => {
    if (!attachments || attachments.length === 0) return null;

    const imageAttachments = attachments.filter(att =>
      att.file_type?.includes('image'),
    );
    const nonImageAttachments = attachments.filter(
      att => !att.file_type?.includes('image'),
    );

    return (
      <>
        {imageAttachments.length > 0 && (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
              maxWidth: '100%',
              marginTop: 4,
            }}>
            {imageAttachments.map((img, index) =>
              renderImage(img, imageAttachments.length, index),
            )}
          </View>
        )}

        {nonImageAttachments.map(att => (
          <View key={Math.random().toString()}>{renderOtherTypes(att)}</View>
        ))}
      </>
    );
  };

  const renderImage = (attachment, totalImages, index) => {
    if (!attachment) return null;

    const isThreeImages = totalImages === 3;

    return (
      <TouchableOpacity
        key={Math.random().toString()}
        style={{
          width: isThreeImages ? 100 : 120,
          margin: 2,
        }}
        onPress={() => openFullscreenMedia('image', attachment.file_path)}>
        <Image
          source={{uri: attachment.file_path}}
          style={{
            width: '100%',
            aspectRatio: 1,
            borderRadius: 8,
            resizeMode: 'contain',
          }}
          onLoad={({
            nativeEvent: {
              source: {width, height},
            },
          }) => {
            const imageRef = createRef();
            if (imageRef.current) {
              imageRef.current.setNativeProps({
                style: {aspectRatio: width / height},
              });
            }
          }}
        />
      </TouchableOpacity>
    );
  };

  const renderOtherTypes = attachment => {
    if (!attachment) return null;

    if (attachment.file_type?.includes('video')) {
      return (
        <View className="rounded-lg overflow-hidden mt-2 w-48 h-36 bg-white">
          <Video
            source={{uri: attachment.file_path}}
            style={{width: '100%', height: '100%'}}
            resizeMode="cover"
            controls
            paused={true}
          />
          <Text className="text-black text-xs mt-1" numberOfLines={1}>
            {attachment.file_name}
          </Text>
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          className="flex-row items-center bg-gray-100 p-3 rounded-lg mt-2"
          onPress={() => handleOpenFile(attachment)}>
          <MaterialIcons name="description" size={24} color="#4A90E2" />
          <Text className="text-black text-xs ml-2">
            {attachment.file_name}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  const handleOpenFile = async attachment => {
    try {
      console.log(attachment);
    } catch (error) {
      console.error('Error opening file', error);
      alert('Cannot open this file');
    }
  };

  return (
    <>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        extraData={messages}
        keyExtractor={(item, index) => `message-${item._id}-${index}`}
        className="p-3 pb-5"
        inverted={true}
        ListFooterComponent={() => {
          if (messages.length > 0) {
            const lastMessageDate = new Date(
              messages[0].createdAt,
            ).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            });
            return renderDateHeader(lastMessageDate);
          }
          return null;
        }}
        ListHeaderComponent={renderTypingIndicator}
        onScroll={event => {
          const {contentOffset} = event.nativeEvent;
          if (contentOffset.y < 100) {
            hasScrolledToTop.current = true;
          }
        }}
        onEndReached={() => {
          if (!hasScrolledToTop.current) return;

          if (messagePagination.hasMore) {
            dispatch(
              getConversationMessages({
                conversationId: currentConversation.conversation_id,
                page: messagePagination.page + 1,
                limit: messagePagination.limit,
              }),
            );
          }
        }}
        onEndReachedThreshold={0.1}
        onContentSizeChange={() => {
          if (hasScrolledToTop.current) return;

          if (flatListRef.current) {
            flatListRef.current.scrollToOffset({offset: 0, animated: true});
          }
        }}
      />
      {selectedMessage && (
        <TouchableWithoutFeedback onPress={() => setSelectedMessage(null)}>
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
              backgroundColor: 'rgba(0,0,0,0.1)',
              zIndex: 9998,
            }}>
            <TouchableWithoutFeedback>
              <View
                style={{
                  position: 'absolute',
                  top: menuPosition.y - 10,
                  left: Math.min(
                    menuPosition.x,
                    Dimensions.get('window').width - 220,
                  ),
                  backgroundColor: '#fff',
                  padding: 10,
                  borderRadius: 10,
                  elevation: 5,
                  zIndex: 9999,
                  width: 200,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}>
                  {reactionList.map(({icon, code}) => (
                    <TouchableOpacity
                      key={code}
                      onPress={() =>
                        handleAddReaction(selectedMessage._id, code)
                      }>
                      <Text style={{fontSize: 22}}>{icon}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  onPress={async () => {
                    const res = await dispatch(
                      deleteMessage(selectedMessage._id),
                    );

                    deleteMessageSocket(res.payload);
                    setSelectedMessage(null);
                  }}>
                  <Text style={{marginBottom: 8}}>Xóa chỉ ở phía tôi</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(
                      'ForwardMessageScreen',
                      selectedMessage,
                    );
                  }}>
                  <Text style={{marginBottom: 8}}>Chuyển tiếp tin nhắn</Text>
                </TouchableOpacity>
                {selectedMessage.sender._id === currentUserId && (
                  <TouchableOpacity
                    onPress={async () => {
                      const res = await dispatch(
                        revokeMessage(selectedMessage._id),
                      );

                      revokeMessageSocket(res.payload);
                      setSelectedMessage(null);
                    }}>
                    <Text style={{marginBottom: 8}}>Thu hồi tin nhắn</Text>
                  </TouchableOpacity>
                )}
                {selectedMessage.reactions.some(
                  reaction => reaction.user === currentUserId,
                ) && (
                  <TouchableOpacity
                    onPress={async () => {
                      setSelectedMessage(null);
                      const res = await dispatch(
                        unReactionMessage(selectedMessage._id),
                      );

                      removeReactionSocket(res.payload);
                    }}>
                    <Text style={{marginBottom: 8}}>Gỡ cảm xúc</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}
    </>
  );
};

export default MessageList;
