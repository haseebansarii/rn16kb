import {View, Text, TouchableOpacity, StyleSheet, Linking} from 'react-native';
import React, {useEffect, useRef} from 'react';
import moment from 'moment';
import {useTheme} from '../../../hooks';
import {useSelector} from 'react-redux';
import {Colors} from '../../../theme/Variables';
import {useNavigation} from '@react-navigation/native';

const BuyingDetailProperty = () => {
  const {Layout, Colors, Fonts, Gutters, Images} = useTheme();

  const selectedProductData = useSelector(
    (state: any) => state?.list?.selectedProductData,
  );
  const navigation = useNavigation();
  const previouColorRenderGray = useRef(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      previouColorRenderGray.current = false;
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const getListingTypeLabel = () => {
    if (selectedProductData?.type === 'enquire') {
      return '';
    }
    if (selectedProductData?.property?.for_sale) {
      return 'Asking Price';
    }
    return 'Rental Price';
  };

  return (
    <View style={[Layout.screenWidth, Layout.selfCenter, Gutters.tinyTMargin]}>
      <View
        style={[
          Gutters.smallBPadding,
          Gutters.borderBWidth,
          selectedProductData?.type == 'auction' && Gutters.borderBWidth,
          {borderBlockColor: Colors.gray_C9C9C9},
        ]}>
        <Text
          style={[
            Fonts.poppinSemiBold20,
            {fontWeight: '600', fontSize: 20, color: Colors.black_232C28},
          ]}>
          {selectedProductData?.title}
        </Text>
        {selectedProductData?.property?.agent_name && (
          <Text style={[styles.subheading]}>
            {selectedProductData?.property?.agent_name ?? '-'}
          </Text>
        )}
      </View>

      <View
        style={[
          Layout.row,
          Layout.justifyContentBetween,
          Gutters.xTinyVMargin,
        ]}>
        {selectedProductData?.status != 'sold' && (
          <View>
            <Text
              style={[
                Fonts.poppinMed16,
                Gutters.tinyBMargin,
                {
                  fontWeight:
                    selectedProductData?.type === 'fixed_price' ? 800 : 500,
                },
              ]}>
              {getListingTypeLabel()}
            </Text>

            {!!selectedProductData?.fixed_price_offer && (
              <Text style={[Fonts.poppinSemiBold22]}>
                {t('common:nz') + ' ' + selectedProductData?.fixed_price_offer}
              </Text>
            )}
          </View>
        )}

        {!!selectedProductData?.end_date && (
          <View style={[Layout.alignItemsEnd, Layout.justifyContentBetween]}>
            <Text style={[Fonts.poppinMed16]}>Closes</Text>
            {!!selectedProductData?.end_date ? (
              <Text
                style={[
                  Fonts.poppinReg14,
                  {color: Colors.black_232C28, fontWeight: '400'},
                ]}>
                {moment(selectedProductData?.end_date).format(
                  'dddd Do MMMM, h:mma',
                )}
              </Text>
            ) : (
              <Text
                style={[
                  Fonts.poppinMed14,
                  {color: Colors.black_232C28, fontWeight: '400'},
                ]}>
                {'-'}
              </Text>
            )}
          </View>
        )}
      </View>

      {selectedProductData?.status == 'sold' ? null : (
        <View style={[Gutters.xTinyVMargin]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              Linking.openURL(`tel:${selectedProductData?.user.phone_number}`);
            }}
            style={[
              Layout.row,
              Layout.center,
              Layout.fullWidth,
              Gutters.tinyRadius,
              {height: 52, backgroundColor: Colors.primary},
            ]}>
            <View style={[Gutters.littleRMargin]}>
              <Images.svg.phone.default
                fill={Colors.white}
                height={23}
                width={23}
              />
            </View>
            <Text
              style={[
                Fonts.poppinMed16,
                {fontWeight: '600', color: Colors.white},
              ]}>
              Enquire
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default BuyingDetailProperty;

const styles = StyleSheet.create({
  subheading: {color: Colors.black_232C28, fontSize: 16, fontWeight: '500'},
  description: {
    color: Colors.black_232C28,
    fontSize: 14,
    fontWeight: '400',
  },
});
