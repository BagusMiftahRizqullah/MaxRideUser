import React from 'react';
import {View} from 'react-native';

const VStack = ({
  children,
  padding,
  top,
  right,
  bottom,
  left,
  horizontal,
  vertical,
  style,
  ...props
}) => {
  let paddingStyles = {
    paddingTop: top,
    paddingRight: right,
    paddingBottom: bottom,
    paddingLeft: left,
    paddingHorizontal: horizontal,
    paddingVertical: vertical,
    padding,
  };

  return (
    <View style={[paddingStyles, style]} {...props}>
      {children}
    </View>
  );
};

export default VStack;
