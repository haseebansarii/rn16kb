import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../../../../hooks';
import {Colors} from '../../../../theme/Variables';
import {product_details} from '../../../../utils/dummyData';
import {useSelector} from 'react-redux';
import {t} from 'i18next';

const ShippingDetail = () => {
  const {Layout, Colors, Fonts, Gutters} = useTheme();
  const [selected, setSelected] = useState<null | number>(null);
  const selectedProductData = useSelector(
    (state: any) => state?.list?.selectedProductData,
  );

  const user_data = useSelector(state => state.auth?.user_data);
  const shippingCostAddFunc = () => {
    if (selected === null) {
      setSelected(0);
    } else {
      setSelected(null);
    }
  };

  // console.log('::::::::::::::::::::', selected);
  return (
    <View style={[Layout.fullWidth, Gutters.tinyVMargin]}>
      <View style={[Layout.screenWidth, Layout.selfCenter]}>
        <Text style={[Fonts.poppinSemiBold20]}>{t('shipping')}</Text>
        <View style={[Gutters.xTinyTMargin]}>
          <TouchableOpacity
            onPress={shippingCostAddFunc}
            style={[
              Layout.center,
              Layout.fullWidth,
              Gutters.tinyRadius,
              Gutters.borderWidth,
              Gutters.tinyRadius,
              {
                height: 80,
                backgroundColor:
                  selected == 0 ? Colors.lightGreen_DBF5EC : Colors.white,
                borderColor: Colors.primary,
              },
            ]}>
            <View
              style={[
                Layout.screenWidth,
                Layout.selfCenter,
                Layout.row,
                Layout.alignItemsCenter,
              ]}>
              <View
                style={[
                  Gutters.tinyRMargin,
                  Layout.center,
                  {
                    height: 20,
                    width: 20,
                    borderWidth: selected == 0 ? 1 : 1,
                    borderColor:
                      selected == 0 ? Colors.primary : Colors.primary,

                    backgroundColor: Colors.transparent,
                    borderRadius: 20 / 2,
                  },
                ]}>
                {selected == 0 ? (
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

              <Text
                style={[
                  Fonts.poppinMed16,
                  {fontWeight: '600', color: Colors.dark_gray_676C6A},
                ]}>
                {product_details.shipping.text}
              </Text>
              <Text
                style={[
                  Fonts.poppinMed16,
                  Gutters.tinyHMargin,
                  {fontWeight: '600', color: Colors.dark_gray_676C6A},
                ]}>
                -
              </Text>
              <Text
                style={[
                  Fonts.poppinMed16,
                  {fontWeight: '600', color: Colors.dark_gray_676C6A},
                ]}>
                {t('common:nz') + product_details.shipping.price}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {selected == 0 ? (
          <View style={[Gutters.xTinyTMargin]}>
            <Text style={[Fonts.poppinSemiBold20, Gutters.xTinyBMargin]}>
              Delivery Address
            </Text>

            <TouchableOpacity
              disabled={true}
              // onPress={() => setSelected(0)}
              style={[
                Layout.center,
                Layout.fullWidth,
                Gutters.tinyRadius,
                Gutters.borderWidth,
                Gutters.tinyRadius,

                {
                  height: 100,
                  backgroundColor:
                    selected == 0 ? Colors.lightGreen_DBF5EC : Colors.white,
                  borderColor: Colors.primary,
                },
              ]}>
              <View
                style={[
                  Layout.screenWidth,
                  Layout.selfCenter,
                  Layout.row,
                  Layout.alignItemsCenter,
                ]}>
                <View
                  style={[
                    Gutters.tinyRMargin,
                    Layout.center,
                    {
                      height: 20,
                      width: 20,
                      borderWidth: selected == 0 ? 1 : 1,
                      borderColor:
                        selected == 0 ? Colors.primary : Colors.primary,
                      backgroundColor: Colors.white,
                      borderRadius: 20 / 2,
                    },
                  ]}>
                  {/* <Text>{'\u2B24'}</Text> */}
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
                </View>
                <View style={[]}>
                  <Text
                    style={[
                      Fonts.poppinMed16,
                      {fontWeight: '600', color: Colors.dark_gray_676C6A},
                    ]}>
                    {selectedProductData?.shipping?.option_name}
                  </Text>
                  {selectedProductData?.pickup_location && (
                    <Text
                      style={[
                        Fonts.poppinMed16,
                        Gutters.tinyVMargin,
                        Gutters.tinyRMargin,
                        {color: Colors.dark_gray_676C6A},
                      ]}>
                      {selectedProductData?.shipping?.value === 'pickup'
                        ? `Listing is located at ${selectedProductData?.pickup_location}`
                        : `${user_data?.address}`}
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ) : null}
        {/* <View style={[Gutters.xTinyTMargin]}>
          <TouchableOpacity
            onPress={() => setSelected(1)}
            style={[
              Layout.center,
              Layout.fullWidth,
              Gutters.tinyRadius,
              Gutters.borderWidth,
              Gutters.tinyRadius,
              {
                height: 80,
                backgroundColor:
                  selected == 1 ? Colors.primary : Colors.lightGreen_DBF5EC,
                borderColor: Colors.primary,
              },
            ]}>
            <View
              style={[
                Layout.screenWidth,
                Layout.selfCenter,
                Layout.row,
                Layout.alignItemsCenter,
              ]}>
              <View
                style={[
                  Gutters.tinyRMargin,
                  {
                    height: 20,
                    width: 20,
                    borderWidth: selected == 1 ? 3 : 1,
                    borderColor: selected == 1 ? Colors.white : Colors.primary,
                    backgroundColor: Colors.transparent,
                    borderRadius: 20 / 2,
                  },
                ]}
              />
              <Text
                style={[
                  Fonts.poppinMed16,
                  {fontWeight: '600', color: Colors.dark_gray_676C6A},
                ]}>
                {product_details.shipping.text}
              </Text>
              <Text
                style={[
                  Fonts.poppinMed16,
                  Gutters.tinyHMargin,
                  {fontWeight: '600', color: Colors.dark_gray_676C6A},
                ]}>
                -
              </Text>
              <Text
                style={[
                  Fonts.poppinMed16,
                  {fontWeight: '600', color: Colors.dark_gray_676C6A},
                ]}>
                {'$' + product_details.shipping.price}
              </Text>
            </View>
          </TouchableOpacity>
        </View> */}
        {/* <Text style={[Fonts.poppinReg14, Gutters.tinyTMargin]}>
          {t('common:buying_delivery_text')}
        </Text> */}
      </View>
    </View>
  );
};

export default ShippingDetail;

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
