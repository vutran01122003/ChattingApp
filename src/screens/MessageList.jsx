import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video';
import {getConversationMessages} from '../redux/thunks/chatThunks';
import {createRef} from 'react';

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
}) => {
  const renderMessage = ({item}) => {
    if (
      item.deleted_by.includes(currentUserId) &&
      item.sender._id === currentUserId
    ) {
      return (
        <View
          className={`flex-row items-end my-1 max-w-4/5 ${
            item.sender._id === currentUserId
              ? 'self-end flex-row-reverse'
              : 'self-start'
          }`}>
          <View
            className={`p-2 rounded-2xl ${
              item.sender._id === currentUserId
                ? 'bg-blue-200 rounded-br-md mr-1'
                : 'bg-gray-200 rounded-bl-md ml-1'
            }`}>
            <Text className="text-gray-500 italic text-sm">
              Tin nhắn đã bị xóa
            </Text>
          </View>
          {item.sender._id === currentUserId && (
            <Text className="text-gray-500 text-xs mt-1">
              {new Date(item.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          )}
        </View>
      );
    }

    if (item.is_revoked) {
      return (
        <View className="self-center my-2 flex-row items-end">
          <View className="bg-gray-100 p-2 rounded-lg">
            <Text className="text-gray-500 italic text-sm text-center">
              Tin nhắn đã bị thu hồi
            </Text>
          </View>
          <Text className="text-gray-500 text-xs mt-1 ml-1">
            {new Date(item.createdAt).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      );
    }

    const isCurrentUser = item.sender._id === currentUserId;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        className={`flex-row items-end my-1 max-w-4/5 ${
          isCurrentUser ? 'self-end flex-row-reverse' : 'self-start'
        }`}>
        {!isCurrentUser && (
          <Image
            source={{
              uri: item.sender.avatar_url || 'https://via.placeholder.com/40',
            }}
            className="w-8 h-8 rounded-full mr-2"
          />
        )}
        <View
          className={`p-2 rounded-2xl ${
            isCurrentUser
              ? 'bg-blue-200 rounded-br-md mr-1'
              : 'bg-gray-200 rounded-bl-md ml-1'
          }`}>
          {item.content && (
            <Text className="text-black text-base">{item.content}</Text>
          )}

          {item.attachments && renderAttachments(item.attachments)}
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
    const width = isThreeImages ? '32%' : '30%'; // Slightly adjust width for 3 images to fit better

    return (
      <TouchableOpacity
        key={Math.random().toString()}
        style={{
          width: isThreeImages ? 100 : 120, // Fixed width, smaller for 3 images
          margin: 2, // Reduced margin for tighter fit
        }}
        onPress={() => openFullscreenMedia('image', attachment.file_path)}>
        <Image
          source={{uri: attachment.file_path}}
          style={{
            width: '100%',
            aspectRatio: 1, // Placeholder
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
    } catch (error) {
      console.error('Error opening file', error);
      alert('Cannot open this file');
    }
  };

  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      renderItem={renderMessage}
      extraData={messages}
      keyExtractor={item => item._id}
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
        if (messages.length > 0) {
          flatListRef.current.scrollToOffset({offset: 0, animated: true});
        }
      }}
    />
  );
};

export default MessageList;
