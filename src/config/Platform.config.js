import {Dimensions, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

const {width, height} = Dimensions.get('window');

export const dimensions = {
  screenWidth: width < height ? width : height,
  screenHeight: height,
};

export const safeAreaHeight = {
  iphoneNotch: {
    top: 44,
    bottom: 34,
  },
  iphone: {
    top: 20,
    bottom: 0,
  },
  android: {
    top: 0,
    bottom: 0,
  },
};

export const phoneType = () => {
  if (Platform.OS === 'ios') {
    return DeviceInfo.hasNotch() ? 'iphoneNotch' : 'iphone';
  }
  return 'android';
};
