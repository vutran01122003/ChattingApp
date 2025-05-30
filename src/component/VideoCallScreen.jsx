import React from 'react';
import {View, TouchableOpacity, Modal} from 'react-native';
import {RTCView} from 'react-native-webrtc';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import Avatar from './Avatar';
import {Text} from 'react-native-paper';

export default function VideoCallScreen({
  localStream,
  remoteStream,
  visible,
  call,
  authUser,
  startCall,
  endCall,
}) {
  const device = device ? device : useCameraDevice('front');
  console.log({
    localStream,
    remoteStream,
  });
  return (
    <Modal visible={visible} animationType="slide">
      <View className="flex-1 relative bg-blue-500">
        {call.receiver._id === authUser._id && !localStream && (
          <View className="gap-2 w-full items-center h-5/6 justify-center">
            <>{console.log({call})}</>
            <Avatar src={call.sender.avatar} size={120} alt="avatar" />
            <Text className="font-semibold text-white text-xl">
              {call.sender.full_name}
            </Text>
          </View>
        )}

        {call.sender._id === authUser._id && !localStream && device && (
          <Camera
            style={{
              height: '90%',
            }}
            device={device}
            isActive={true}
          />
        )}

        {localStream && remoteStream && (
          <RTCView
            streamURL={localStream.toURL()}
            style={{
              height: remoteStream ? '45%' : '90%',
              backgroundColor: 'black',
            }}
            objectFit="contain"
            mirror={true}
          />
        )}

        {remoteStream && remoteStream.getVideoTracks().length > 0 && (
          <RTCView
            streamURL={remoteStream.toURL()}
            style={{
              height: '45%',
              backgroundColor: 'black',
            }}
            objectFit="contain"
          />
        )}

        <View className="flex-row justify-around items-center w-full p-2 bg-black flex-1">
          <TouchableOpacity onPress={() => endCall()}>
            <View className="h-14 w-14 rounded-full bg-gray-100 items-center justify-center">
              <MaterialIcons name="call-end" size={30} color="red" />
            </View>
          </TouchableOpacity>

          {call.receiver._id === authUser._id && !call.calling && (
            <TouchableOpacity onPress={startCall}>
              <View className="h-14 w-14 rounded-full bg-gray-100 items-center justify-center">
                <MaterialIcons name="call" size={30} color="#1E88E5" />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}
