import React, { useState, useEffect } from "react";
import { Image, View } from "react-native";
import defaultAvatar from "../assets/images/user/default-avatar.jpg"; 

const Avatar = ({ src, alt = "Avatar", size = 44 }) => {
  const [imgSrc, setImgSrc] = useState(src || defaultAvatar);

  useEffect(() => {
    setImgSrc(src || defaultAvatar);
  }, [src]);

  const handleError = () => {
    setImgSrc(defaultAvatar);
  };

  return (
    <View
      className={`rounded-full overflow-hidden border border-gray-300 shadow-sm`}
      style={{ width: size, height: size }}
    >
      <Image
        source={{ uri: imgSrc }}
        className="w-full h-full object-cover"
        onError={handleError}
        alt={alt}
      />
    </View>
  );
};

export default Avatar;
