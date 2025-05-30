import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {clearCurrentConversation} from '../redux/slices/chatSlice';
import VideoCallScreen from '../component/VideoCallScreen';
import {useSocket} from '../context/SocketContext';
import {
  RTCPeerConnection,
  mediaDevices,
  RTCSessionDescription,
  RTCIceCandidate,
} from 'react-native-webrtc';
import {calling, callUser} from '../redux/slices/callSlice';
import {useSelector} from 'react-redux';
import {callSelector} from '../redux/selector';

const configuration = {
  iceServers: [{urls: 'stun:stun.l.google.com:19302'}],
};

const ChatHeader = ({
  navigation,
  dispatch,
  currentConversation,
  authUser,
  restUser,
}) => {
  const call = useSelector(callSelector);
  const [visibleCallVideo, setVisibleCallVideo] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const peerConnection = useRef(null);
  const {socket} = useSocket();
  const pendingCandidates = useRef([]);

  const handleVisibleCallVideo = () => {
    const data = {
      sender: {
        _id: authUser._id,
        full_name: authUser.full_name,
        avatar: authUser.avatar_url,
      },
      receiver: restUser,
      video: true,
      conversationId: currentConversation.conversation_id,
    };
    dispatch(callUser(data));
    socket.emit('call_user_mobile', data);
    dispatch(calling(true));
  };

  useEffect(() => {
    requestPermissions();
    socket.on('offer', handleReceiveOffer);
    socket.on('answer', handleReceiveAnswer);
    socket.on('ice-candidate', handleReceiveCandidate);
    socket.on('hang-up', endCall);

    return () => {
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      socket.off('hang-up');
    };
  }, [JSON.stringify(restUser)]);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
    }
  };

  const startCall = async () => {
    const stream = await mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    setLocalStream(stream);

    peerConnection.current = new RTCPeerConnection(configuration);

    pendingCandidates.current.forEach(async candidate => {
      try {
        await peerConnection.current.addIceCandidate(candidate);
      } catch (error) {
        console.error('Error adding queued ICE candidate', error);
      }
    });
    pendingCandidates.current = [];

    stream.getTracks().forEach(track => {
      peerConnection.current.addTrack(track, stream);
    });

    peerConnection.current.onicecandidate = event => {
      if (event.candidate) {
        socket.emit('ice-candidate', {
          candidate: event.candidate,
          userIdList: [restUser._id],
        });
      }
    };

    peerConnection.current.ontrack = event => {
      const inboundStream = event.streams?.[0];
      if (inboundStream) {
        const hasVideo = inboundStream.getVideoTracks().length > 0;
        if (hasVideo) setRemoteStream(inboundStream);
        else console.log('🔈 Remote audio stream (no video track)');
      }
    };

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    socket.emit('offer', {
      offer,
      userIdList: [restUser._id],
    });

    dispatch(calling(true));
  };

  const endCall = data => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    setLocalStream(null);
    setRemoteStream(null);

    if (!data) {
      console.log('ok');
      socket.emit('hang-up', {
        otherUserId: restUser._id,
      });
    }

    dispatch(callUser({}));
  };

  const handleReceiveOffer = async offer => {
    const stream = await mediaDevices.getUserMedia({audio: true, video: true});
    setLocalStream(stream);

    peerConnection.current = new RTCPeerConnection(configuration);

    stream.getTracks().forEach(track => {
      peerConnection.current.addTrack(track, stream);
    });

    console.log(call);
    // Detect the public IP and port mapping
    peerConnection.current.onicecandidate = event => {
      if (event.candidate) {
        socket.emit('ice-candidate', {
          candidate: event.candidate,
          userIdList: [restUser._id],
        });
      }
    };

    peerConnection.current.ontrack = event => {
      const inboundStream = event.streams?.[0];

      if (inboundStream) {
        const hasVideo = inboundStream.getVideoTracks().length > 0;
        if (hasVideo) setRemoteStream(inboundStream);
        else console.log('🔈 Remote audio stream (no video track)');
      }
    };

    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(offer),
    );

    pendingCandidates.current.forEach(async candidate => {
      try {
        await peerConnection.current.addIceCandidate(candidate);
      } catch (error) {
        console.error('Error adding queued ICE candidate', error);
      }
    });
    pendingCandidates.current = [];
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);
    socket.emit('answer', {
      answer,
      userIdList: [restUser._id],
    });
  };

  const handleReceiveAnswer = async answer => {
    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(answer),
    );

    for (const candidate of pendingCandidates.current) {
      try {
        await peerConnection.current.addIceCandidate(candidate);
      } catch (error) {
        console.error('Error adding queued ICE candidate', error);
      }
    }

    pendingCandidates.current = [];
  };

  const handleReceiveCandidate = async candidate => {
    console.log(candidate);
    const iceCandidate = new RTCIceCandidate(candidate);

    if (peerConnection.current) {
      try {
        await peerConnection.current.addIceCandidate(iceCandidate);
      } catch (error) {
        console.error('Error adding received ice candidate', error);
      }
    } else {
      pendingCandidates.current.push(iceCandidate);
    }
  };

  return (
    <View className="flex-row items-center p-3 bg-blue-500 h-16">
      {call && call.video > 0 && (
        <VideoCallScreen
          remoteStream={remoteStream}
          localStream={localStream}
          call={call}
          authUser={authUser}
          startCall={startCall}
          endCall={endCall}
        />
      )}
      <TouchableOpacity
        onPress={() => {
          dispatch(clearCurrentConversation());
          navigation.navigate('MainApp');
        }}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <View className="flex-1 ml-4">
        <Text className="text-white text-base font-bold">
          {currentConversation.is_group
            ? currentConversation.group_name
            : currentConversation.other_user[0].full_name}
        </Text>
        <Text className="text-slate-200 text-xs">
          {currentConversation.other_user.some(o => o.is_online)
            ? 'Đang hoạt động'
            : `Lần cuối ${new Date(
                currentConversation.other_user[0].last_seen,
              ).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}`}
        </Text>
      </View>

      <View className="flex-row">
        <TouchableOpacity className="ml-4">
          <Ionicons name="call-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity className="ml-4" onPress={handleVisibleCallVideo}>
          <Ionicons name="videocam-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          className="ml-4"
          onPress={() => {
            if (currentConversation.conversation_type === 'group') {
              navigation.navigate('GroupInfo', {
                conversationId: currentConversation.conversation_id,
                authUser,
              });
            }
          }}>
          <Ionicons name="ellipsis-vertical" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatHeader;
