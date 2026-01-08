import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {useTheme} from '../hooks';

type Props = {
  btnStyle?: any;
  textStyle?: any;
  text: string;
  onPress: CallableFunction;
  btnProps?: any;
  backgroundColor?: string;
  textColor?: string;
  disabled?: boolean;
};

const CustomButton = ({
  btnStyle,
  btnProps,
  textStyle,
  text,
  backgroundColor,
  textColor,
  disabled = false,
  onPress,
}: Props) => {
  const {Colors, Gutters, Fonts, Layout} = useTheme();
  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={0.8}
      onPress={onPress}
      {...btnProps}
      style={[
        Layout.center,
        Layout.justifyContentCenter,
        {
          backgroundColor: backgroundColor
            ? backgroundColor
            : Colors.dark_gray_676C6A,
          height: 60,
          borderRadius: 8,
        },
        btnStyle,
      ]}>
      <Text
        style={[
          Fonts.poppinBold24,
          textStyle,
          {color: textColor ? textColor : Colors.white},
          {
            // textTransform: 'uppercase',
            textTransform: 'capitalize',
            textAlign: 'center',
          },
        ]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
