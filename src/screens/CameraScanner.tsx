import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from '../config/axios.config'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RESULTS } from 'react-native-permissions';
import {
  Camera,
  CameraRuntimeError,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import { useAppStateListener } from '../hooks/useAppStateListener';
import { isIos } from '../utils/helpers';
import { askPermissions } from '../utils/permissions';
import { useNavigation } from '@react-navigation/native';

export interface CameraScannerProps {
  onCodeScanned?: (code: string) => void;
  onClose?: () => void;
}

const CameraScanner: React.FC<CameraScannerProps> = ({
  onCodeScanned,
  onClose,
}) => {
  const navigation = useNavigation();
  const device = useCameraDevice('back');
  const camera = useRef<Camera>(null);
  const [codeScanned, setCodeScanned] = useState<string | null>(null);
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [flash, setFlash] = useState<'on' | 'off'>(isIos ? 'off' : 'off');
  const { appState } = useAppStateListener();
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scanLinePosition] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isActive && !codeScanned) {
      Animated.loop(
        Animated.timing(scanLinePosition, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ).start();
    } else {
      scanLinePosition.stopAnimation();
      scanLinePosition.setValue(0);
    }
  }, [isActive, codeScanned, scanLinePosition]);

  const checkAndRequestPermissions = async () => {
    try {
      setIsLoading(true);
      const result = await askPermissions();

      if (result === RESULTS.GRANTED) {
        setHasPermission(true);
        setIsActive(true);
      } else if (result === RESULTS.DENIED) {
        Alert.alert(
          'Quyền truy cập camera bị từ chối',
          'Vui lòng cấp quyền truy cập camera trong cài đặt của thiết bị để sử dụng tính năng này.',
          [
            {
              text: 'Mở cài đặt',
              onPress: () => {
                Linking.openSettings();
              },
            },
            {
              text: 'Thử lại',
              onPress: () => {
                checkAndRequestPermissions();
              },
            },
            {
              text: 'Hủy',
              style: 'cancel',
            },
          ],
        );
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra quyền:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi kiểm tra quyền truy cập camera');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAndRequestPermissions();
  }, []);

  useEffect(() => {
    if (hasPermission && device) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [hasPermission, device]);

  const onInitialized = () => {
    setIsCameraInitialized(true);
  };

  const onError = (error: CameraRuntimeError) => {
    console.error('Lỗi camera:', error);
    Alert.alert('Lỗi camera', error.message);
  };

  const toggleFlash = () => {
    setFlash(prev => (prev === 'on' ? 'off' : 'on'));
  };

  const resetCodeScanned = () => {
    setCodeScanned(null);
    setIsActive(true);
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      if (codes.length > 0 && codes[0].value) {
        const codeValue = codes[0].value;
        setCodeScanned(codeValue);
        setIsActive(false);
        if (onCodeScanned) {
          onCodeScanned(codeValue);
        }
        handleQRLogin(codeValue);
      }
    },
  });
  const handleQRLogin = (qrValue: string) => {
    Alert.alert(
      "Xác nhận đăng nhập",
      "",
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        {
          text: "Đăng nhập",
          onPress: () => processQRLogin(qrValue)
        }
      ]
    );
  };
  const processQRLogin = async (qrValue: string) => {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      const clientId = await AsyncStorage.getItem('client_id');
      Alert.alert("Đang xử lý", "Vui lòng đợi trong giây lát...");
      const result = await axios.post('auth/approveQRLogin', {
        sessionId: qrValue,
        accessToken,
        refreshToken
      },{
        headers:{
          "x-client-id": clientId,
        }
      })
      console.log("Kết quả đăng nhập QR:", result);
      if(result.data.statusCode === 200){
        Alert.alert(
          "Đăng nhập thành công",
          "Bạn đã đăng nhập thành công với mã QR",
          [
            {
              text: "OK",
              onPress: resetCodeScanned
            }
          ]
        );
      }

    } catch (error) {
      console.error('Lỗi đăng nhập QR:', error);
      Alert.alert(
        "Lỗi đăng nhập",
        "Đã xảy ra lỗi khi xử lý đăng nhập. Vui lòng thử lại.",
        [
          {
            text: "Thử lại",
            onPress: resetCodeScanned
          }
        ]
      );
    }
  };
  const scanLineTranslateY = scanLinePosition.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100],
  });

  const handleGoBack = () => {
    if (onClose) {
      onClose();
    } else {
      navigation.goBack();
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Ứng dụng cần quyền truy cập camera</Text>
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={checkAndRequestPermissions}
          disabled={isLoading}>
          <Text style={styles.buttonText}>
            {isLoading ? 'Đang xử lý...' : 'Cấp quyền'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Không tìm thấy camera</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={checkAndRequestPermissions}>
          <Text style={styles.buttonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        codeScanner={codeScanner}
        onError={onError}
        onInitialized={onInitialized}
        torch={flash}
        video={false}
        audio={false}
        enableZoomGesture={true}
      />

      {/* Overlay */}
      <View style={styles.overlay}>
        {/* Close Button */}
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={handleGoBack}
        >
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>

        <View style={styles.qrFrame}>
          <View style={styles.qrFrameCorner} />
          <View style={[styles.qrFrameCorner, styles.qrFrameCornerTopRight]} />
          <View
            style={[styles.qrFrameCorner, styles.qrFrameCornerBottomLeft]}
          />
          <View
            style={[styles.qrFrameCorner, styles.qrFrameCornerBottomRight]}
          />

          <Animated.View
            style={[
              styles.scanLine,
              {
                transform: [{ translateY: scanLineTranslateY }],
              },
            ]}
          />
        </View>
        <View style={styles.flashButton}>
          <TouchableOpacity
            style={[
              styles.iconButton,
              flash === 'on' ? styles.iconButtonOn : styles.iconButtonOff,
            ]}
            onPress={toggleFlash}>
            <Text style={styles.flashIcon}>{flash === 'on' ? '⚡' : '⚡'}</Text>
          </TouchableOpacity>
        </View>
        {/* Bottom content */}
        <View style={styles.bottomContent}>
          {codeScanned ? (
            <View style={styles.scannedContent}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.resetButton]}
                  onPress={resetCodeScanned}>
                  <Text style={styles.resetButtonText}>Quét lại</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Text style={styles.instructionText}>
              Đặt mã QR vào khung để quét
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');
const qrFrameSize = Math.min(width, height) * 0.7;
export const Scanner = () => {
  return <CameraScanner />
}
const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    flex: 1,
    margin: 5,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#555555',
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  flashButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
    paddingTop: 40,
    width: '100%',
    alignItems: 'center',
  },
  iconButton: {
    padding: 12,
    borderRadius: 35,
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonOn: {
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  iconButtonOff: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  flashIcon: {
    color: 'white',
    fontSize: 35,
  },
  qrFrame: {
    width: qrFrameSize,
    height: qrFrameSize,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginTop: 150,
  },
  qrFrameCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#00FF00',
    borderLeftWidth: 3,
    borderTopWidth: 3,
    top: 0,
    left: 0,
  },
  qrFrameCornerTopRight: {
    right: 0,
    left: 'auto',
    borderRightWidth: 3,
    borderLeftWidth: 0,
  },
  qrFrameCornerBottomLeft: {
    top: 'auto',
    bottom: 0,
    borderBottomWidth: 3,
    borderTopWidth: 0,
  },
  qrFrameCornerBottomRight: {
    top: 'auto',
    right: 0,
    left: 'auto',
    bottom: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanLine: {
    width: qrFrameSize,
    height: 2,
    backgroundColor: '#00FF00',
  },
  bottomContent: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    padding: 20,
  },
  scannedContent: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 15,
    borderRadius: 10,
  },
  scannedTitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  scannedText: {
    color: '#00FF00',
    fontSize: 14,
    marginBottom: 15,
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 14,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  closeIcon: {
    color: 'white',
    fontSize: 30,
  },
});
