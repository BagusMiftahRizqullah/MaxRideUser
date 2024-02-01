import {ms} from 'react-native-size-matters';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

const Spacing = {
  1: RFValue(1),
  2: RFValue(2),
  3: RFValue(3),
  4: RFValue(4),
  5: RFValue(5),
  6: RFValue(6),
  8: RFValue(8),
  10: RFValue(10),
  12: RFValue(12),
  14: RFValue(14),
  16: RFValue(16),
  18: RFValue(18),
  20: RFValue(20),
  22: RFValue(22),
  24: RFValue(24),
  28: RFValue(28),
  32: RFValue(32),
  36: RFValue(36),
  42: RFValue(42),
  48: RFValue(48),
  54: RFValue(54),
  60: RFValue(60),
  64: RFValue(64),
  100: RFValue(100),
  128: RFValue(128),
  144: RFValue(144),
};

export const CustomSpacing = RFValue;

export const Rounded = {
  s: RFValue(4),
  m: RFValue(8),
  l: RFValue(12),
  xl: RFValue(16),
};

export default Spacing;
