import { AppState, Platform } from 'react-native';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';

export const askPermissions = async () => {
  // Kiểm tra nếu ứng dụng không ở trạng thái active
  if (AppState.currentState !== 'active') {
    return RESULTS.DENIED;
  }

  const permission = Platform.select({
    ios: PERMISSIONS.IOS.CAMERA,
    android: PERMISSIONS.ANDROID.CAMERA,
    default: PERMISSIONS.ANDROID.CAMERA,
  });

  try {
    // Kiểm tra trạng thái quyền hiện tại
    const status = await check(permission);

    // Nếu quyền đã được cấp hoặc bị hạn chế, trả về ngay
    if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) {
      return status;
    }

    // Nếu quyền chưa được cấp, yêu cầu quyền
    const result = await request(permission);
    return result;
  } catch (error) {
    console.error('Lỗi khi kiểm tra quyền:', error);
    return RESULTS.DENIED;
  }
};
