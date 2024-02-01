import {CustomSpacing} from './Spacing';
import * as Colors from './Color';
import {fs} from './Reponsive';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

const baseFont = {
  color: Colors.black,
  letterSpacing: RFValue(0.25),
};

const headBoldFont = {
  fontFamily: 'Roboto-Bold',
  ...baseFont,
};

const headLight = {
  fontFamily: 'Roboto-Light',
  ...baseFont,
};

const headItalic = {
  fontFamily: 'Roboto-BoldItalic',
  ...baseFont,
};

const textfont = {
  fontFamily: 'Roboto-Regular',
  ...baseFont,
};

const textBoldFont = {
  fontFamily: 'Roboto-Medium',
  ...baseFont,
};

const textSemiboldFont = {
  fontFamily: 'Roboto-Thin',
  ...baseFont,
};

export const Fonts = {
  h1: {
    ...headBoldFont,
    fontSize: RFValue(34),
  },
  h2: {
    ...headLight,
    fontSize: RFValue(34),
  },
  h3: {
    ...headItalic,
    fontSize: RFValue(34),
  },
  titleL: {
    ...textfont,
    fontSize: RFValue(28),
  },
  titleMBold: {
    ...headBoldFont,
    fontSize: RFValue(22),
  },
  titleSBold: {
    ...headBoldFont,
    fontSize: RFValue(20),
  },
  headlineL: {
    ...textBoldFont,
    fontSize: RFValue(17),
  },
  headlineM: {
    ...textBoldFont,
    fontSize: RFValue(14),
  },
  body: {
    ...textfont,
    fontSize: RFValue(17),
  },
  bodySemiBold: {
    ...textSemiboldFont,
    fontSize: RFValue(17),
  },
  subhead: {
    ...textSemiboldFont,
    fontSize: RFValue(15),
  },
  label: {
    ...textfont,
    fontSize: RFValue(14),
  },
  labelSemiBold: {
    ...textSemiboldFont,
    fontSize: RFValue(14),
  },
  captionM: {
    ...textfont,
    fontSize: RFValue(12),
  },
  captionMSemiBold: {
    ...textSemiboldFont,
    fontSize: RFValue(12),
  },
  captionS: {
    ...textfont,
    fontSize: RFValue(11),
  },
  captionSSemiBold: {
    ...textSemiboldFont,
    fontSize: RFValue(11),
  },
};
