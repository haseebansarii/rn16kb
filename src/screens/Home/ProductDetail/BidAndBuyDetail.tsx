import {View, Text, TouchableOpacity, Linking} from 'react-native';
import React from 'react';
import {useTheme} from '../../../hooks';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {buyingType} from '../../../store/productDetail/ProductDetailSlice';
import {formatNumberFloat, showUserAlert} from '../../../utils/helpers';
import {RootState} from '../../../store/store';
import {useNavigation} from '@react-navigation/native';

const BidAndBuyDetail = () => {
  const {Layout, Colors, Fonts, Gutters, Images} = useTheme();

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const selectedProductData = useSelector(
    (state: any) => state?.list?.selectedProductData,
  );
  const token = useSelector((state: RootState) => state?.auth?.token);

  return (
    <View
      style={[
        Layout.screenWidth,
        Layout.selfCenter,
        Gutters.tinyTMargin,
        Gutters.xTinyBMargin,
      ]}>
      <View
        style={[Gutters.smallBPadding, {borderBlockColor: Colors.gray_C9C9C9}]}>
        <Text
          style={[
            Fonts.poppinSemiBold20,
            {fontWeight: '600', fontSize: 20, color: Colors.black_232C28},
          ]}>
          {selectedProductData?.title}
        </Text>
        {selectedProductData?.status === 'sold' && (
          <Text
            numberOfLines={1}
            style={[
              Fonts.poppinMed20,
              {color: Colors.red, textAlign: 'right'},
            ]}>
            SOLD
          </Text>
        )}
      </View>

      <View
        style={[
          Layout.row,
          Layout.justifyContentBetween,
          Gutters.xTinyVMargin,
        ]}>
        {selectedProductData?.type !== 'enquire' &&
          selectedProductData?.status != 'sold' && (
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
                {selectedProductData?.type === 'fixed_price'
                  ? // ? 'Fixed Price Offer'
                    t('common:nz') +
                    ' ' +
                    formatNumberFloat(selectedProductData?.fixed_price_offer)
                  : 'Starting Price'}
              </Text>

              {selectedProductData?.type === 'fixed_price' ? null : (
                <Text style={[Fonts.poppinSemiBold22, {fontWeight: '800'}]}>
                  {t('common:nz') +
                    ' ' +
                    formatNumberFloat(selectedProductData?.start_price)}
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

      {selectedProductData?.show_phone && (
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(`tel:${selectedProductData?.user.phone_number}`);
          }}
          style={[
            Layout.row,
            Layout.center,
            Layout.fullWidth,
            Gutters.tinyRadius,
            Gutters.tinyTMargin,
            Gutters.smallBMargin,
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
              Fonts.poppinSemiBold16,
              {fontWeight: '600', color: Colors.white},
            ]}>
            Contact
          </Text>
        </TouchableOpacity>
      )}

      {selectedProductData?.type === 'auction' && (
        <View
          style={[
            Layout.fullWidth,
            Gutters.borderWidth,
            Gutters.littleRadius,
            Gutters.smallBMargin,
            Layout.row,
            {
              height: 65,
              backgroundColor: Colors.light_grayF4F4F4,
              borderColor: Colors.gray_C9C9C9,
            },
          ]}>
          <View
            style={[
              Layout.halfWidth,
              Layout.fullHeight,
              Gutters.borderRWidth,
              Layout.center,
              {borderRightColor: Colors.gray_C9C9C9},
            ]}>
            <Text style={[Fonts.poppinMed12, {color: Colors.dark_gray_676C6A}]}>
              Current Bid
            </Text>
            <Text
              style={[Fonts.poppinMed14, {color: Colors.black, marginTop: 2}]}>
              {t('common:nz') +
                ' ' +
                formatNumberFloat(
                  selectedProductData?.auction_data?.current_bid,
                )}
            </Text>
          </View>
          <View style={[Layout.halfWidth, Layout.fullHeight, Layout.center]}>
            <Text style={[Fonts.poppinMed12, {color: Colors.dark_gray_676C6A}]}>
              Active Bids
            </Text>
            <Text
              style={[Fonts.poppinMed14, {color: Colors.black, marginTop: 2}]}>
              {selectedProductData?.auction_data?.bids_count}
            </Text>
          </View>
        </View>
      )}

      {selectedProductData?.type === 'auction' &&
        selectedProductData?.status != 'sold' && (
          <View>
            <TouchableOpacity
              onPress={() => {
                if (token == null) {
                  showUserAlert(navigation);
                  return;
                }
                dispatch(buyingType('bidding'));
              }}
              style={[
                Layout.center,
                Layout.fullWidth,
                Gutters.tinyRadius,
                {height: 52, backgroundColor: Colors.black_232C28},
              ]}>
              <Text
                style={[
                  Fonts.poppinSemiBold16,
                  {fontWeight: '600', color: Colors.white},
                ]}>
                Place a Bid
              </Text>
            </TouchableOpacity>
            {!!selectedProductData?.buy_now_price && (
              <TouchableOpacity
                onPress={() => {
                  if (token == null) {
                    showUserAlert(navigation);
                    return;
                  }
                  dispatch(buyingType('buying'));
                }}
                style={[
                  Layout.center,
                  Layout.fullWidth,
                  Gutters.tinyRadius,
                  Gutters.tinyTMargin,
                  {height: 52, backgroundColor: Colors.primary},
                ]}>
                <Text
                  style={[
                    Fonts.poppinSemiBold16,

                    {fontWeight: '600', color: Colors.white},
                  ]}>
                  Buy for
                  {` ${t('common:nz')} ${
                    selectedProductData?.buy_now_price || 0
                  }`}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

      {selectedProductData?.type === 'fixed_price' ? (
        selectedProductData?.status == 'sold' ? null : (
          <View style={[Gutters.xTinyVMargin]}>
            <TouchableOpacity
              onPress={() => {
                if (token == null) {
                  showUserAlert(navigation);
                  return;
                }
                dispatch(buyingType('buying'));
              }}
              style={[
                Layout.center,
                Layout.fullWidth,
                Gutters.tinyRadius,
                {height: 52, backgroundColor: Colors.primary},
              ]}>
              <Text
                style={[
                  Fonts.poppinMed16,
                  {fontWeight: '600', color: Colors.white},
                ]}>
                Buy Now
              </Text>
            </TouchableOpacity>
          </View>
        )
      ) : null}
    </View>
  );
};

export default BidAndBuyDetail;
