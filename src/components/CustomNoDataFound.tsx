import React from 'react';
import {Text, View} from 'react-native';
import {useTheme} from '../hooks';

type Props = {
  text: string;
};

const CustomNoDataFound = ({text}: Props) => {
  const {Layout, Gutters, Fonts, Colors} = useTheme();
  return (
    <View style={[Layout.fill, Layout.center]}>
      <Text style={[Fonts.poppinMed18, {color: Colors.black_232C28}]}>
        {text}
      </Text>
    </View>
  );
};

export default CustomNoDataFound;
