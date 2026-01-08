import React, {memo} from 'react';
import {Text} from 'react-native';
import {useTheme} from '../hooks';
import {StyleProps} from 'react-native-reanimated';
import {extractObjects} from '../utils/helpers';

type Props = {
  text: string;
  textStyle?: StyleProps;
  textProps?: any;
};

const SemiBoldText = ({textStyle, textProps, text}: Props) => {
  const {Fonts, Layout, Colors} = useTheme();
  return (
    <Text
      {...textProps}
      style={extractObjects([
        Fonts.poppinSemiBold32,
        // Layout.textTransform,
        {color: Colors.white},
        textStyle,
      ])}>
      {text}
    </Text>
  );
};

export default SemiBoldText;
