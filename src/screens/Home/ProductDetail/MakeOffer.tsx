import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from '../../../hooks';
import {useDispatch, useSelector} from 'react-redux';
import {
  buyingType,
  offeredProduct,
} from '../../../store/productDetail/ProductDetailSlice';
import {RootState} from '../../../store/store';
import {showUserAlert} from '../../../utils/helpers';
import {useLazyGetSingleListingQuery} from '../../../services/modules/Listings/getList';
import {useNavigation} from '@react-navigation/native';

const MakeOffer = () => {
  const {Layout, Colors, Fonts, Gutters, Images} = useTheme();
  const token = useSelector((state: RootState) => state?.auth?.token);
  const offered_product = useSelector(
    (state: RootState) => state.product?.offered_product,
  );

  const navigation = useNavigation();
  const [getSingleListing] = useLazyGetSingleListingQuery();

  const dispacth = useDispatch();

  useEffect(() => {
    return () => {
      dispacth(offeredProduct(null));
    };
  }, []);

  return (
    <View
      style={[
        Layout.fullWidth,
        Gutters.tinyVMargin,
        Gutters.smallVPadding,
        Gutters.borderBWidth,
        Gutters.borderTWidth,
        {borderColor: Colors.gray_C9C9C9},
      ]}>
      <View
        style={[
          Layout.screenWidth,
          Layout.selfCenter,
          Layout.row,
          Layout.justifyContentBetween,
          Layout.alignItemsCenter,
        ]}>
        {!!offered_product ? (
          <View style={[Layout.fill]}>
            <Text
              numberOfLines={2}
              style={[
                Fonts.poppinMed14,
                Gutters.littleTMargin,
                {
                  color: Colors.dark_gray_676C6A,
                  lineHeight: 18,
                  fontWeight: '400',
                },
              ]}>
              {'Your offer has been sent'}
            </Text>
          </View>
        ) : (
          <View style={[{width: '50%'}]}>
            <Text
              numberOfLines={2}
              style={[
                Fonts.poppinMed14,
                Gutters.littleTMargin,
                {
                  color: Colors.dark_gray_676C6A,
                  lineHeight: 18,
                  fontWeight: '400',
                },
              ]}>
              {t('open_offer_text')}
            </Text>
            <Text
              numberOfLines={2}
              style={[
                Fonts.poppinMed14,
                Gutters.littleTMargin,
                {
                  color: Colors.dark_gray_676C6A,
                  lineHeight: 18,
                  fontWeight: '400',
                },
              ]}>
              {t('open_offer_text2')}
            </Text>
          </View>
        )}
        <View style={[{width: '35%'}]}>
          <TouchableOpacity
            onPress={() => {
              if (offered_product) {
                getSingleListing(offered_product).then((res: any) => {
                  navigation.navigate('RecievedOffers', {
                    item: {
                      id: res?.data?._id,
                      image: res?.data?.images && res?.data?.images[0]?.name,
                      title: res?.data?.title,
                      buyNowPrice: res?.data?.buy_now_price,
                      productObj: res?.data,
                    },
                  });
                });
              } else {
                if (token == null) {
                  showUserAlert(navigation);
                  return;
                }
                dispacth(buyingType('offer'));
              }
            }}
            style={[
              Layout.center,
              Gutters.tinyRadius,
              {
                height: 45,
                backgroundColor: Colors.primary,
              },
            ]}>
            <Text
              style={[
                Fonts.poppinReg14,
                {fontWeight: '500', color: Colors.white},
              ]}>
              {!!offered_product ? 'View Offer' : t('make_an_offer')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MakeOffer;
