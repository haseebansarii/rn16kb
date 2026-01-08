import React, {useEffect} from 'react';
import {Image, Text, View} from 'react-native';

import {useTheme} from '../../hooks';
import {ApplicationScreenProps} from '../../../@types/navigation';

const SplashContainer = ({navigation}: ApplicationScreenProps) => {
  const {Layout, Colors, Images} = useTheme();

  useEffect(() => {
    navigation.navigate('EmailContainer');
    return () => {};
  }, []);

  return (
    <View
      style={[
        Layout.fill,
        {backgroundColor: Colors.star_yello},
        Layout.center,
        Layout.row,
      ]}>
      <Text>Hello Splash </Text>
      <View>
        {/* <Images.svg.LikeFilled.default height={28} width={28} /> */}
      </View>
    </View>
  );
};

export default SplashContainer;
