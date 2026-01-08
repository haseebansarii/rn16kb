import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {useTheme} from '../hooks';

type Props = {};

const CustomPageLoading = (props: Props) => {
  const {Fonts, Layout, Colors} = useTheme();
  return (
    <View style={[Layout.fill, Layout.center]}>
      <ActivityIndicator size={'large'} color={Colors.primary} animating />
    </View>
  );
};

export default CustomPageLoading;
