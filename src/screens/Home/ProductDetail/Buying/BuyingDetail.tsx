import {View, Text} from 'react-native';
import React from 'react';
import {useTheme} from '../../../../hooks';
import {product_details} from '../../../../utils/dummyData';
import moment from 'moment';
import {Image} from 'react-native';
import {useSelector} from 'react-redux';
import {API_URL} from '../../../../config';
import {getPlaceHolderProduct, getURLPhoto} from '../../../../utils/helpers';
import {SvgUri} from 'react-native-svg';

const BuyingDetail = () => {
  const {Layout, Gutters, Colors, Fonts, Images} = useTheme();
  const selectedProductData = useSelector(
    (state: any) => state?.list?.selectedProductData,
  );

  return (
    <View style={[Layout.screenWidth, Layout.selfCenter, Gutters.tinyTMargin]}>
      <View style={[Gutters.tinyTMargin, Gutters.tinyBPadding]}>
        <Text
          style={[
            Fonts.poppinSemiBold24,
            Gutters.tinyBMargin,
            Gutters.littleTMargin,
          ]}>
          Buy It Now
        </Text>
        {/* <Text style={[Fonts.poppinMed16]}>{product_details.title}</Text> */}
        <View
          style={[
            Gutters.borderWidth,
            Gutters.littleRadius,
            Gutters.smallTMargin,
            {
              borderColor: Colors.dark_gray_676C6A,
              backgroundColor: Colors.light_grayF4F4F4,
            },
          ]}>
          {selectedProductData?.images &&
          selectedProductData?.images[0]?.name?.endsWith('.svg') ? (
            <View
              style={[
                Layout.alignItemsCenter,
                Layout.justifyContentCenter,
                {
                  height: 240,
                },
              ]}>
              <SvgUri
                width="100"
                height="100"
                uri={getURLPhoto(selectedProductData?.images[0]?.name)}
                style={{
                  height: 240,
                }}
              />
            </View>
          ) : (
            <Image
              source={
                selectedProductData?.images &&
                selectedProductData?.images[0]?.name
                  ? {
                      uri: getURLPhoto(selectedProductData?.images[0]?.name),
                    }
                  : getPlaceHolderProduct()
              }
              resizeMode="cover"
              style={{
                height: 240,
              }}
            />
          )}
          <View
            style={[
              Layout.screenWidth,
              Layout.selfCenter,
              Gutters.smallTMargin,
            ]}>
            <View
              style={[
                Layout.row,
                Layout.fullWidth,
                Layout.justifyContentBetween,
              ]}>
              <View
                style={[
                  Layout.row,
                  Layout.alignItemsCenter,
                  Layout.fill,
                  Layout.overflow,
                ]}>
                <View>
                  <Images.svg.OfferLocation.default />
                </View>
                <Text
                  numberOfLines={3}
                  style={[
                    Fonts.poppinReg12,
                    Gutters.tinyLMargin,
                    Gutters.smallRMargin,
                    {color: Colors.black_232C28},
                  ]}>
                  {selectedProductData?.pickup_location ?? '-'}
                </Text>
              </View>
              <View style={[Layout.row, Layout.alignItemsCenter]}>
                <View>
                  <Images.svg.OfferCalender.default />
                </View>
                <View style={[Gutters.tinyLMargin, Gutters.littleTMargin]}>
                  <Text
                    style={[Fonts.poppinReg12, {color: Colors.black_232C28}]}>
                    Closes:
                    <Text
                      style={[Fonts.poppinReg12, {color: Colors.black_232C28}]}>
                      {` ${
                        selectedProductData?.end_date
                          ? moment(selectedProductData?.end_date).format(
                              'ddd, DD MMM',
                            )
                          : '-'
                      }`}
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
            <Text
              style={[
                Gutters.smallVMargin,
                Fonts.poppinSemiBold20,
                {color: Colors.black_232C28},
              ]}>
              {selectedProductData?.title}
            </Text>
            {/* <View style={[Layout.row, {width: '100%'}]}>
              <View style={[Layout.justifyContentCenter, {width: '15%'}]}>
                <Images.svg.shippingIcon.default />
              </View>
              <View style={{width: '85%'}}>
                <Text style={[Fonts.poppinReg16, {color: Colors.black_232C28}]}>
                  Specify Shipping Costs
                  {selectedProductData?.shipping?.amount &&
                    `- ${t('common:nz')} ${
                      selectedProductData?.shipping?.amount
                    }`}
                </Text>
              </View>
            </View> */}
            <View style={[Layout.row, Gutters.smallBMargin, {width: '100%'}]}>
              <View style={[Layout.justifyContentCenter, {width: '15%'}]}>
                <Images.svg.DeliveryBox.default />
              </View>
              <View style={[{width: '85%'}]}>
                <Text style={[Fonts.poppinReg16, {color: Colors.black_232C28}]}>
                  Expected delivery in 1-2 business days
                </Text>
              </View>
            </View>
            <View style={[Layout.row, Gutters.smallBMargin]}>
              <Text
                style={[
                  Gutters.tinyRMargin,
                  Fonts.poppinSemiBold16,
                  {color: Colors.black_232C28},
                ]}>
                Buy for:
              </Text>
              <Text
                style={[
                  Gutters.tinyRMargin,
                  Fonts.poppinSemiBold24,
                  {color: Colors.primary},
                ]}>
                {`${t('common:nz')} ${
                  selectedProductData?.fixed_price_offer ??
                  !!selectedProductData?.buy_now_price
                    ? selectedProductData?.buy_now_price || 0
                    : selectedProductData?.start_price || 0
                }`}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BuyingDetail;
