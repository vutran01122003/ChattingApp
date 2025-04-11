import { Dimensions, Linking, Platform } from 'react-native';

export const isIos = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export const goToSettings = () => {
  if (isIos) {
    Linking.openURL('app-settings:');
  } else {
    Linking.openSettings();
  }
};

export const getWindowWidth = () => {
  return Dimensions.get('window').width;
};

export const getWindowHeight = () => {
  return Dimensions.get('window').height;
};
