import React from 'react';
import {Modal, View, TouchableOpacity, Image, StatusBar} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const FullscreenMediaViewer = ({visible, onClose, source}) => {
  return (
    <>
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}>
        <StatusBar hidden />
        <View className="flex-1 bg-black">
          <TouchableOpacity
            className="absolute top-12 right-4 z-10"
            onPress={onClose}>
            <Ionicons name="close" size={32} color="#FFFFFF" />
          </TouchableOpacity>

          <Image
            source={{uri: source}}
            className="flex-1"
            resizeMode="contain"
          />
        </View>
      </Modal>
    </>
  );
};

export default FullscreenMediaViewer;
