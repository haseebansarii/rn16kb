import React from 'react';
import {Text} from 'react-native';
import {useTheme} from '../hooks';
import {extractObjects} from '../utils/helpers';

type Props = {
  text: string;
  textStyle?: any;
  textProps?: any;
};

const BoldText = ({text, textProps, textStyle}: Props) => {
  const {Fonts, Colors, Layout, Gutters} = useTheme();
  return (
    <Text
      {...textProps}
      style={extractObjects([
        Fonts.poppinBold18,
        Layout.textTransform,
        {color: Colors.white},
        textStyle,
      ])}>
      {text}
    </Text>
  );
};

export default BoldText;
