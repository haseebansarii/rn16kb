import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {useTheme} from '../../../hooks';
import {dropdownPaymentOption, product_details} from '../../../utils/dummyData';
import {Colors} from '../../../theme/Variables';
import {useSelector} from 'react-redux';

const PaymentOption = () => {
  const {Layout, Fonts, Gutters, Images} = useTheme();

  const selectedProductData = useSelector(
    (state: any) => state?.list?.selectedProductData,
  );

  return (
    <View
      style={[
        Layout.fullWidth,
        Gutters.borderTWidth,
        {borderColor: Colors.gray_C9C9C9},
      ]}>
      <View
        style={[Layout.screenWidth, Layout.selfCenter, Gutters.smallVPadding]}>
        <Text
          style={[
            Fonts.poppinSemiBold20,
            Gutters.tinyBMargin,
            {color: Colors.black_232C28},
          ]}>
          Payment Option
        </Text>
        <View style={[Layout.row]}>
          <Text
            style={[
              styles.subheading,
              {color: Colors.black_232C28, textTransform: 'none'},
            ]}>
            {selectedProductData?.payment_option ==
            dropdownPaymentOption[0]?.value
              ? dropdownPaymentOption[0]?.key
              : selectedProductData?.payment_option ==
                dropdownPaymentOption[1]?.value
              ? dropdownPaymentOption[1]?.key
              : selectedProductData?.payment_option ==
                dropdownPaymentOption[2]?.value
              ? dropdownPaymentOption[2]?.key
              : ''}
          </Text>

          {/* {product_details.payment_option.map((item, index) => {
            return (
              <Text style={[styles.subheading]}>
                {index != product_details.payment_option.length - 1
                  ? `${item}, `
                  : item}
              </Text>
            );
          })} */}
        </View>
        <View style={[Gutters.tinyTMargin]}>
          {/* <Text style={[Fonts.poppinMed16, {color: Colors.black_232C28}]}>
            You'll receive instructions on how to pay after confirming your
            purchase.
          </Text> */}
          <Text
            style={[
              Fonts.poppinMed4,
              Gutters.littleTMargin,
              {color: Colors.black_232C28},
            ]}>
            By confirming, you are legally obligated to make payment. You can't
            use your Isqroll account to pay for things you buy.
          </Text>
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
