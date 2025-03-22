import React from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const ProfileScreen = () => {
  return (
    <View className="flex-1 bg-gray-100">
      {/* Search Bar */}
      <View className="flex-row items-center bg-blue-500 px-4 py-3">
        <Text className="text-white font-bold">🔍</Text>
        <TextInput
          className="flex-1 ml-2 text-white text-base"
          placeholder="Tìm kiếm"
          placeholderTextColor="#ddd"
        />
        <Text className="text-white font-bold">⚙️</Text>
      </View>

      {/* Full Screen Scrollable Content */}
      <ScrollView className="flex-1">
        {/* Profile Section */}
        <TouchableOpacity className="p-4 bg-white flex-row items-center">
          <Image
            source={{
              uri: 'https://fastly.picsum.photos/id/1033/200/200.jpg?hmac=BxbwFiZimshaCKpNauTec7E5c0GSY7oInD4dhlyGYbw',
            }} // Replace with actual user image
            className="w-12 h-12 rounded-full"
          />
          <View className="ml-4">
            <Text className="text-lg font-semibold">Trần Đức Vũ</Text>
            <Text className="text-gray-500 text-sm">Xem trang cá nhân</Text>
          </View>
        </TouchableOpacity>

        {/* Features List */}
        <View className="bg-white">
          <FeatureItem
            title="Thêm nhạc nền Zalo"
            subtitle="Cài nhạc zStyle - Thể hiện cá tính"
            icon="🎵"
          />
          <FeatureItem
            title="zCloud"
            subtitle="Không gian lưu trữ dữ liệu trên đám mây"
            icon="☁️"
          />
          <FeatureItem
            title="zStyle – Nổi bật trên Zalo"
            subtitle="Hình nền và nhạc cho cuộc gọi Zalo"
            icon="🎨"
          />
          <FeatureItem
            title="Cloud của tôi"
            subtitle="Lưu trữ các tin nhắn quan trọng"
            icon="💾"
          />
          <FeatureItem
            title="Dữ liệu trên máy"
            subtitle="Quản lý dữ liệu Zalo của bạn"
            icon="📱"
          />
          <FeatureItem
            title="Ví QR"
            subtitle="Lưu trữ và xuất trình các mã QR quan trọng"
            icon="💳"
          />
          <FeatureItem title="Tài khoản và bảo mật" subtitle="" icon="🔒" />
        </View>
      </ScrollView>

      {/* Bottom Navigation (Fixed at bottom) */}
      <View className="flex-row justify-around py-3 bg-white border-t border-gray-200">
        <Text className="text-gray-500 text-lg">💬</Text>
        <Text className="text-gray-500 text-lg">📞</Text>
        <Text className="text-gray-500 text-lg">👥</Text>
        <Text className="text-gray-500 text-lg">🔔</Text>
        <Text className="text-blue-500 text-lg">👤</Text>
      </View>
    </View>
  );
};

// Feature Item Component
const FeatureItem = ({title, subtitle, icon}) => (
  <TouchableOpacity className="flex-row items-center px-4 py-3 border-b border-gray-200">
    <Text className="text-lg">{icon}</Text>
    <View className="ml-3">
      <Text className="text-base font-medium">{title}</Text>
      {subtitle ? (
        <Text className="text-gray-500 text-sm">{subtitle}</Text>
      ) : null}
    </View>
  </TouchableOpacity>
);

export default ProfileScreen;
