import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useTheme} from '../hooks';

type Props = {
  setSelected: CallableFunction;
  selected: any;
};

const CustomSwitch = ({setSelected, selected}: Props) => {
  const {Colors, Images, Fonts, Gutters, Layout} = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        setSelected(!selected);
      }}
      style={[
        Gutters.littlePadding,

        {
          alignItems: 'center',
          width: 50,
          borderWidth: selected ? 0 : 1,
          borderRadius: 30,
          backgroundColor: selected ? Colors.primary : 'transparent',
        },
      ]}>
      <View
        style={[
          selected ? Layout.selfEnd : Layout.selfStart,
          {
            width: 17,
            height: 17,
            borderRadius: 20,
            backgroundColor: selected ? Colors.white : Colors.dark_gray_676C6A,
          },
        ]}
      />
    </TouchableOpacity>
  );
};

export default CustomSwitch;
