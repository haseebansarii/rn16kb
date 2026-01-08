import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../../hooks';
import {navigationRef} from '../../navigators/utils';
import {RootState} from '../../store/store';
import {useNavigation} from '@react-navigation/native';

type Props = {};

const RecentListing = (props: Props) => {
  const {Layout, Gutters, Images, Colors, Fonts} = useTheme();
  const navigation = useNavigation();
  return (
    <View
      style={[
        Gutters.tinyHPadding,
        Layout.fullWidth,
        Layout.selfCenter,
        Layout.row,
        Layout.alignItemsCenter,
        Layout.justifyContentBetween,
      ]}>
      <Text style={[Fonts.poppinSemiBold20, {color: Colors.black_232C28}]}>
        {t('common:recent_listing')}
      </Text>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('IBuy' as never);
          // if (token) navigationRef.navigate('IBuy');
        }}
        style={[Layout.row, Layout.center]}>
        <Text
          style={[
            Fonts.poppinReg16,
            {color: Colors.dark_gray_676C6A, marginRight: 2},
          ]}>
          {t('common:see_more')}
        </Text>
        <View style={[Layout.rotate90Inverse]}>
          <Images.svg.DropDown.default width={12} height={12} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default RecentListing;
