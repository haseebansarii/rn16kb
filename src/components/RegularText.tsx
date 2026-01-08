import React, {memo} from 'react';
import {Text, TextStyle} from 'react-native';
import {useTheme} from '../hooks';
import {extractObjects} from '../utils/helpers';

type Props = {
  text: string;
  textStyle?: TextStyle;
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
