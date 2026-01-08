import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '../hooks';
type Props = {
  btnStyle?: any;
  text: string;
  textStyle: any;
  onPress: CallableFunction;
  disabled?: any;
};

const CustomGradientButton = ({
  btnStyle,
  textStyle,
  onPress,
  text,
  disabled,
}: Props) => {
  const {Colors, Gutters, Layout, Fonts} = useTheme();

  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        btnStyle,
        Layout.center,
        Layout.fullWidth,
        {
          borderRadius: 8,
        },
      ]}>
      <LinearGradient
        colors={
          disabled
            ? [Colors.dark_gray_676C6A, Colors.dark_gray_676C6A]
            : [Colors.green_075838, Colors.primary]
        }
        start={{x: 0, y: 4}}
        end={{x: 1, y: 2}}
        style={[
          Layout.center,
          Gutters.tinyPadding,
          Layout.fullWidth,
          btnStyle,
          {
            height: 60,
            borderRadius: 8,
          },
        ]}>
        <Text
          style={[
            textStyle,
            Fonts.poppinBold24,
            Fonts.textCapitalize,
            {color: Colors.white},
          ]}>
          {text}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default CustomGradientButton;
