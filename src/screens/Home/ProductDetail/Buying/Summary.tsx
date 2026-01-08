import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTheme} from '../../../../hooks';
import {Colors} from '../../../../theme/Variables';
import {product_details} from '../../../../utils/dummyData';

const Summary = () => {
  const {Layout, Gutters, Colors, Fonts, Images} = useTheme();
  return (
    <View style={[Layout.screenWidth, Layout.selfCenter, Gutters.smallVMargin]}>
      <Text style={[Fonts.poppinSemiBold22, Gutters.tinyBMargin]}>Summary</Text>
      <View
        style={[
          Layout.row,
          Layout.justifyContentBetween,
          Gutters.xTinyVPadding,
          Gutters.tinyHPadding,
          {backgroundColor: Colors.light_grayF4F4F4},
        ]}>
        <Text style={[styles.subheading]}>Item Price</Text>
        <Text style={[styles.subheading]}>
          {t('common:nz') + ' ' + product_details.starting_price}
        </Text>
      </View>
      <View
        style={[
          Layout.row,
          Layout.justifyContentBetween,
          Gutters.xTinyVPadding,
          Gutters.tinyHPadding,
        ]}>
        <Text style={[styles.subheading]}>Shipping (Urban)</Text>
        <Text style={[styles.subheading]}>
          {t('common:nz') + ' ' + product_details.shipping.price}
        </Text>
      </View>

      <View
        style={[
          Layout.row,
          Layout.justifyContentBetween,
          Gutters.xTinyVPadding,
          Gutters.tinyHPadding,
          {backgroundColor: Colors.light_grayF4F4F4},
        ]}>
        <Text style={[styles.subheading]}>Grand Total</Text>
        <View style={[Layout.row]}>
          <Text style={[styles.subheading]}>{t('common:nz')}</Text>
          <Text style={[styles.subheading]}>
            {' '}
            {product_details.starting_price + 10}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Summary;

const styles = StyleSheet.create({
  subheading: {color: Colors.black_232C28, fontSize: 16, fontWeight: '500'},
  description: {
    color: Colors.black_232C28,
    fontSize: 14,
    fontWeight: '400',
  },
});
