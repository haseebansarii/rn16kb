import React, {useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {useTheme} from '../../../../hooks';
import {Colors} from '../../../../theme/Variables';

const Shipping = ({bidShipping, setBidShipping}) => {
  const {Layout, Colors, Fonts, Gutters, Images} = useTheme();
  const selectedProductData = useSelector(
    (state: any) => state?.list?.selectedProductData,
  );

  const shippingCostAddFunc = (item, index) => {
    setBidShipping(item);
  };
  return (
    <View style={[Layout.fullWidth, Gutters.smallTPadding]}>
      <View style={[Layout.screenWidth, Layout.selfCenter]}>
        <Text style={[Fonts.poppinSemiBold22]}>{t('shipping')}</Text>
        <FlatList
          data={selectedProductData?.shipping_methods}
          renderItem={({item, index}) => {
            return (
              <View style={[Gutters.xTinyTMargin, Layout.overflow]}>
                <TouchableOpacity
                  onPress={() => shippingCostAddFunc(item, index)}
                  style={[
                    Layout.fullWidth,
                    Gutters.tinyRadius,
                    Gutters.borderWidth,
                    Gutters.tinyRadius,
                    Layout.row,
                    Layout.alignItemsCenter,
                    Gutters.tinyLPadding,
                    // Layout.justifyContentCenter,
                    {
                      height: 80,
                      backgroundColor:
                        bidShipping?.value == item.value
                          ? Colors.lightGreen_DBF5EC
                          : Colors.white,
                      borderColor: Colors.primary,
                    },
                  ]}>
                  <View
                    style={[
                      Gutters.tinyRMargin,
                      Layout.center,
                      {
                        height: 20,
                        width: 20,
                        borderWidth: bidShipping?.value == item.value ? 1 : 1,
                        borderColor:
                          bidShipping?.value == item.value
                            ? Colors.primary
                            : Colors.primary,

                        backgroundColor: Colors.transparent,
                        borderRadius: 20 / 2,
                      },
                    ]}>
                    {bidShipping?.value == item.value ? (
                      <View
                        style={[
                          {
                            backgroundColor: Colors.primary,
                            width: 10,
                            height: 10,
                            borderRadius: 20 / 2,
                          },
                        ]}
                      />
                    ) : null}
                  </View>
                  <View style={[{}]}>
                    <View
                      style={[
                        Layout.row,
                        Layout.alignItemsCenter,
                        Layout.fill,
                        // Gutters.tinyTMargin,
                      ]}>
                      <Text
                        style={[
                          Fonts.poppinSemiBold16,
                          {
                            fontWeight: '600',
                            color: Colors.dark_gray_676C6A,
                          },
                        ]}>
                        {item?.option_name}
                      </Text>
                      <Text
                        style={[
                          Fonts.poppinSemiBold16,
                          {
                            fontWeight: '600',
                            color: Colors.dark_gray_676C6A,
                          },
                        ]}>
                        {item?.amount && ` - ${t('common:nz')} ${item?.amount}`}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
        />
        {/* <View
          style={[
            Layout.row,
            Layout.justifyContentBetween,
            Gutters.xTinyVPadding,
            Gutters.tinyTMargin,
            Gutters.tinyHPadding,
            {backgroundColor: Colors.light_grayF4F4F4},
          ]}>
          <Text style={[styles.subheading]}>
            {selectedProductData?.shipping?.option_name}
          </Text>
          {selectedProductData?.shipping?.amount && (
            <Text style={[styles.subheading]}>
              {selectedProductData?.shipping?.option_name === `I don't know yet`
                ? ''
                : t('common:nz') + ' ' + selectedProductData?.shipping?.amount}
            </Text>
          )}
        </View> */}
        {/* <View
          style={[
            Layout.row,
            Layout.justifyContentBetween,
            Gutters.xTinyVPadding,

            Gutters.tinyHPadding,
          ]}>
          <Text style={[styles.subheading]}>
            {product_details.shipping2.text}
          </Text>
          <Text style={[styles.subheading]}>
            {'$' + product_details.shipping2.price}
          </Text>
        </View> */}
      </View>
    </View>
  );
};

export default Shipping;

const styles = StyleSheet.create({
  locationText: {
    color: Colors.black_232C28,
    fontSize: 14,
    fontWeight: '400',
  },
  subheading: {color: Colors.black_232C28, fontSize: 16, fontWeight: '500'},
  description: {
    color: Colors.black_232C28,
    fontSize: 14,
    fontWeight: '400',
  },
});
