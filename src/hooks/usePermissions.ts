import { useEffect, useState } from 'react';
import { RESULTS } from 'react-native-permissions';
import { askPermissions } from '../utils/permissions';

export type TUsePermissionsReturnType = {
  isError?: boolean;
  type: (typeof RESULTS)[keyof typeof RESULTS];
  errorMessage?: string;
};

export enum EPermissionTypes {
  CAMERA = 'camera',
}

export const usePermissions = () => {
  const [permissionStatus, setPermissionStatus] = useState<typeof RESULTS[keyof typeof RESULTS] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkAndRequestPermissions = async () => {
    try {
      setIsLoading(true);
      const status = await askPermissions();
      setPermissionStatus(status);
      return status;
    } catch (error) {
      console.error('Lỗi khi kiểm tra quyền:', error);
      setPermissionStatus(RESULTS.DENIED);
      return RESULTS.DENIED;
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = () => {
    return permissionStatus === RESULTS.GRANTED || permissionStatus === RESULTS.LIMITED;
  };

  useEffect(() => {
    checkAndRequestPermissions();
  }, []);

  return {
    permissionStatus,
    hasPermission,
    checkAndRequestPermissions,
    isLoading,
  };
};
