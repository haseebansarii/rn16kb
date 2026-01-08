import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {memo} from 'react';
import {useTheme} from '../../hooks';
import {TextMedium} from '../../components';

type Props = {
  image: string;
  title: string;
  backgroundColor: string;
  navigation: any;
  move: string;
};

const CatagoriesCard = ({
  image,
  title,
  move,
  backgroundColor,
  navigation,
}: Props) => {
  const {Colors, Gutters, Images, Layout, Fonts} = useTheme();
  const Icon = image ? Images?.svg[image]?.default : null;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[Gutters.tinyTMargin, {width: '30%'}]}
      onPress={() => navigation.navigate(move)}>
      <View
        style={[
          Layout.center,
          {
            width: '100%',
            height: 110,
            borderRadius: 10,
            backgroundColor: backgroundColor,
          },
        ]}>
        <Icon />
      </View>
      <View style={[Layout.center]}>
        <Text
          numberOfLines={1}
          style={[
            Gutters.tinyTMargin,
            Fonts.poppinMed16,
            {color: Colors.black_232C28},
          ]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default memo(CatagoriesCard);
