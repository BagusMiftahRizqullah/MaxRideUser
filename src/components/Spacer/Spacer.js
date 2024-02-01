import React from 'react';
import {View} from 'react-native';
import {safeAreaHeight, phoneType} from '@config/Platform.config';
import {Spacing, Layout} from '@styles';

const Spacer = ({width, height, topSafeAreaHeight, bottomSafeAreaHeight}) => {
  if (width) {
    return <View style={{width}} />;
  }

  if (height) {
    return <View style={{height}} />;
  }

  if (topSafeAreaHeight) {
    return <View style={{height: safeAreaHeight[phoneType()].top}} />;
  }

  if (bottomSafeAreaHeight) {
    return (
      <View
        style={{height: safeAreaHeight[phoneType()].bottom || Spacing[24]}}
      />
    );
  }

  return <View style={Layout.flex} />;
};

export default Spacer;
