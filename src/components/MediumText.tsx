import React, {memo} from 'react';
import {Text, TextStyle} from 'react-native';
import {useTheme} from '../hooks';
import {extractObjects} from '../utils/helpers';

type Props = {
  text: string;
  textStyle?: TextStyle;
  textProps?: any;
  numberOfLines?: any;
};

const MediumText = ({textProps, textStyle, text, numberOfLines}: Props) => {
  const {Fonts, Layout, Colors} = useTheme();
  return (
    <Text
      {...textProps}
      numberOfLines={numberOfLines}
      style={extractObjects([
        Fonts.poppinMed18,
        // Layout.textTransform,
        {color: Colors.gray_C9C9C9},
        textStyle,
      ])}>
      {text}
    </Text>
  );
};

export default MediumText;
