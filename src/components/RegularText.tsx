import React, {memo} from 'react';
import {Text} from 'react-native';
import {useTheme} from '../hooks';
import {extractObjects} from '../utils/helpers';
import {StyleProps} from 'react-native-reanimated';

type Props = {
  text: string;
  textStyle?: StyleProps;
  textProps?: any;
};

const RegularText = ({text, textProps, textStyle}: Props) => {
  const {Fonts, Layout, Colors} = useTheme();
  return (
    <Text
      {...textProps}
      style={extractObjects([
        Fonts.poppinReg16,
        {color: Colors.white},
        textStyle,
      ])}>
      {text}
    </Text>
  );
};

export default RegularText;
