import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {useTheme} from '../../../../hooks';
import {product_details} from '../../../../utils/dummyData';
import {Colors} from '../../../../theme/Variables';

const PaymentOption = () => {
  const {Layout, Fonts, Gutters, Images} = useTheme();
  return (
    <View style={[Layout.fullWidth]}>
      <View
        style={[Layout.screenWidth, Layout.selfCenter, Gutters.smallVPadding]}>
        <Text style={[Fonts.poppinSemiBold20, Gutters.tinyBMargin]}>
          PaymentOption
        </Text>
        <View style={[Layout.row]}>
          {product_details.payment_option.map((item, index) => {
            return (
              <Text style={[styles.subheading]}>
                {index != product_details.payment_option.length - 1
                  ? `${item}, `
                  : item}
              </Text>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default PaymentOption;

const styles = StyleSheet.create({
  subheading: {color: Colors.black_232C28, fontSize: 16, fontWeight: '500'},
  description: {
    color: Colors.black_232C28,
    fontSize: 14,
    fontWeight: '400',
  },
});
