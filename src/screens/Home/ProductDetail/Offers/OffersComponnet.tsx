import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useTheme} from '../../../../hooks';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../../store/store';
import FastImage from 'react-native-fast-image';
import {API_URL} from '../../../../config';
import moment from 'moment';
import {buyingType} from '../../../../store/productDetail/ProductDetailSlice';
import {useProductApiOfferMutation} from '../../../../services/offer/offerApi';
import {
  getPlaceHolderProduct,
  getURLPhoto,
  toastDangerMessage,
} from '../../../../utils/helpers';
import {dropdownPaymentOption} from '../../../../utils/dummyData';
import {screenWidth} from '../../../../utils/ScreenDimentions';
import {SvgUri} from 'react-native-svg';

const OffersComponnet = () => {
  const {Layout, Gutters, Colors, Images, Fonts} = useTheme();
  const dispatch = useDispatch();
  const [productApiOffer, {isLoading}] = useProductApiOfferMutation();

  const [offerAmount, setOfferAmount] = useState('');
  // const [selected, setSelected] = useState<null | number>(null);

  const [offerShipping, setOfferShipping] = useState({});
  const [totalSum, setTotalSum] = useState(0);

  const selectedProductData = useSelector(
    (state: any) => state?.list?.selectedProductData,
  );

  const user_data = useSelector(state => state.auth?.user_data);

  const confirmOfferFunc = () => {
    if (!offerShipping?.value) {
      toastDangerMessage('Please select shipping');
    } else if (offerAmount != '') {
      // console.log('placing offer');

      let reqObj = {
        key: 'offer',
        amount: parseInt(offerAmount),
        listing: selectedProductData?._id,
        shipping: offerShipping,
      };

      productApiOffer({
        payload: reqObj,
      });
    } else {
      // console.log('input field is empty');
      toastDangerMessage('Please enter offer amount');
    }
  };

  const shippingCostAddFunc = (item, index) => {
    setOfferShipping(item);
  };

  const cancelFunc = () => {
    dispatch(buyingType(null));
  };

  const shippingValue =
    offerShipping?.amount != null ? offerShipping?.amount : '0.00';

  useEffect(() => {
    setTotalSum(
      parseFloat(shippingValue) +
        parseFloat(offerAmount === '' ? '0' : offerAmount),
    );
  }, [offerAmount]);

  return (
    <View style={[Layout.screen]}>
      <ScrollView showsVerticalScrollIndicator={false} style={[Layout.fill]}>
        <View>
          <Text style={[Fonts.poppinSemiBold32, {color: Colors.black_232C28}]}>
            Make an Offer
          </Text>
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
              <FastImage
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
                <View style={[Layout.row, Layout.alignItemsCenter]}>
                  <View>
                    <Images.svg.OfferLocation.default />
                  </View>
                  <Text
                    style={[
                      Fonts.poppinReg12,
                      Gutters.tinyLMargin,
                      Gutters.smallRMargin,
                      {color: Colors.black_232C28, width: screenWidth * 0.4},
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
                        style={[
                          Fonts.poppinReg12,
                          {color: Colors.black_232C28},
                        ]}>
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
              <View style={[Layout.row, Gutters.smallBMargin]}>
                <Text
                  style={[
                    Gutters.tinyRMargin,
                    Fonts.poppinSemiBold16,
                    {color: Colors.black_232C28},
                  ]}>
                  {selectedProductData?.type == 'auction'
                    ? selectedProductData?.buy_now_price
                      ? 'Buy for: '
                      : 'Starting from: '
                    : 'Buy for: '}
                </Text>
                <Text
                  style={[
                    Gutters.tinyRMargin,
                    Fonts.poppinSemiBold24,
                    {color: Colors.primary},
                  ]}>
                  {`${t('common:nz')} ${
                    selectedProductData?.type == 'auction'
                      ? selectedProductData?.buy_now_price
                        ? selectedProductData?.buy_now_price
                        : selectedProductData?.start_price || 0
                      : selectedProductData?.fixed_price_offer || 0
                  }`}
                </Text>
              </View>
            </View>
          </View>
          <View>
            <Text
              style={[
                Gutters.smallVMargin,
                Fonts.poppinSemiBold20,
                {color: Colors.black_232C28},
              ]}>
              Your offer amount
            </Text>
            <View>
              <TextInput
                value={offerAmount}
                placeholder={`Enter offer amount`}
                placeholderTextColor={Colors.dark_gray_676C6A}
                style={[
                  Layout.fill,
                  Gutters.tinyLPadding,
                  Gutters.tinyRadius,
                  Fonts.poppinReg16,
                  {
                    backgroundColor: Colors.white,
                    height: 60,
                    borderWidth: 1,
                    borderColor: Colors.gray_C9C9C9,
                    fontWeight: '700',
                  },
                ]}
                onChangeText={amount => setOfferAmount(amount)}
                keyboardType="numeric"
              />
            </View>
            <View>
              <Text
                style={[
                  Gutters.smallVMargin,
                  Fonts.poppinReg16,
                  {color: Colors.dark_gray_676C6A},
                ]}>
                You can make up to 7 offers on this listing. Way's this?
              </Text>
            </View>
          </View>

          <View>
            <Text
              style={[
                Gutters.tinyVMargin,
                Fonts.poppinSemiBold20,
                {color: Colors.black_232C28},
              ]}>
              Shipping
            </Text>
            {/* <View style={[Gutters.xTinyTMargin]}>
              <TouchableOpacity
                disabled={true}
                onPress={() => setSelected(0)}
                style={[
                  Layout.center,
                  Layout.fullWidth,
                  Gutters.tinyRadius,
                  Gutters.borderWidth,
                  Gutters.tinyRadius,

                  {
                    height: 100,
                    backgroundColor:
                      selected == 0 ? Colors.primary : Colors.lightGreen_DBF5EC,
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
                        borderWidth: selected == 0 ? 3 : 1,
                        borderColor:
                          selected == 0 ? Colors.white : Colors.primary,
                        backgroundColor: Colors.white,
                        borderRadius: 20 / 2,
                      },
                    ]}>
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
                  <View style={[{flex: 1}]}>
                    <Text
                      style={[
                        Fonts.poppinMed16,
                        {fontWeight: '600', color: Colors.dark_gray_676C6A},
                      ]}>
                      {selectedProductData?.shipping?.option_name}
                    </Text>
                    {selectedProductData?.pickup_location && (
                      <Text
                        numberOfLines={1}
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
            </View> */}
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
                            offerShipping?.value == item.value
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
                            borderWidth:
                              offerShipping?.value == item.value ? 1 : 1,
                            borderColor:
                              offerShipping?.value == item.value
                                ? Colors.primary
                                : Colors.primary,

                            backgroundColor: Colors.transparent,
                            borderRadius: 20 / 2,
                          },
                        ]}>
                        {offerShipping?.value == item.value ? (
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
                            {item?.amount &&
                              ` - ${t('common:nz')} ${item?.amount}`}
                          </Text>
                        </View>
                        {item?.value === 'pickup' ? (
                          <Text
                            numberOfLines={2}
                            style={[
                              Fonts.poppinMed16,
                              Gutters.tinyRMargin,
                              {
                                color: Colors.dark_gray_676C6A,
                                width: '70%',
                              },
                            ]}>
                            {`Listing is located at ` +
                              selectedProductData?.pickup_location}
                          </Text>
                        ) : (item?.value === 'specify_costs' ||
                            item?.value === 'free_shipping') &&
                          user_data?.address ? (
                          <View style={[{flex: 1}]}>
                            <Text
                              numberOfLines={1}
                              style={[
                                Fonts.poppinMed16,
                                // Gutters.tinyVMargin,
                                {
                                  fontWeight: '600',
                                  color: Colors.dark_gray_676C6A,
                                },
                              ]}>
                              {user_data?.address}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>

          <View>
            <Text
              style={[
                Gutters.tinyVMargin,
                Fonts.poppinSemiBold20,
                {color: Colors.black_232C28},
              ]}>
              Payment
            </Text>
            <View style={[Gutters.xTinyTMargin]}>
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
                      borderWidth: offerShipping?.value ? 3 : 1,
                      borderColor: offerShipping?.value
                        ? Colors.white
                        : Colors.primary,
                      backgroundColor: Colors.white,
                      borderRadius: 20 / 2,
                    },
                  ]}>
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
                </View>
              </View>
            </View>
          </View>

          <View>
            <Text
              style={[
                Gutters.tinyVMargin,
                Fonts.poppinSemiBold20,
                {color: Colors.black_232C28},
              ]}>
              Order Summary
            </Text>
            <View style={[Gutters.xTinyTMargin]}>
              <View
                style={[
                  Layout.row,
                  Layout.justifyContentBetween,
                  Gutters.tinyVPadding,
                  {
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.gray_C9C9C9,
                  },
                ]}>
                <Text
                  style={[Fonts.poppinMed18, {color: Colors.dark_gray_676C6A}]}>
                  Price
                </Text>
                <Text style={[Fonts.poppinMed18, {color: Colors.black}]}>
                  {t('common:nz')} {offerAmount === '' ? '0' : offerAmount}
                </Text>
              </View>
              <View
                style={[
                  Layout.row,
                  Layout.justifyContentBetween,
                  Gutters.tinyVPadding,
                  {
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.gray_C9C9C9,
                  },
                ]}>
                <Text
                  style={[Fonts.poppinMed18, {color: Colors.dark_gray_676C6A}]}>
                  Shipping
                </Text>
                <Text style={[Fonts.poppinMed18, {color: Colors.black}]}>
                  {t('common:nz')} {shippingValue}
                </Text>
              </View>
              <View
                style={[
                  Layout.row,
                  Layout.justifyContentBetween,
                  Gutters.tinyVPadding,
                  {
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.gray_C9C9C9,
                  },
                ]}>
                <Text style={[Fonts.poppinMed20, {color: Colors.black}]}>
                  Total to pay
                </Text>
                <Text style={[Fonts.poppinMed20, {color: Colors.black}]}>
                  {t('common:nz')} {totalSum}
                </Text>
              </View>
            </View>
          </View>

          <View>
            <View
              style={[
                Layout.screenWidth,
                Layout.selfCenter,
                Gutters.smallTMargin,
              ]}>
              <TouchableOpacity
                onPress={confirmOfferFunc}
                style={[
                  Layout.center,
                  Layout.fullWidth,
                  Gutters.tinyRadius,
                  {
                    height: 60,
                    backgroundColor: Colors.primary,
                  },
                ]}>
                <Text
                  style={[
                    Fonts.poppinMed18,
                    {fontWeight: '600', color: Colors.white},
                  ]}>
                  Confirm Offer
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={[
                Gutters.xTinyVMargin,
                Layout.screenWidth,
                Layout.selfCenter,
              ]}>
              <TouchableOpacity
                onPress={cancelFunc}
                style={[
                  Layout.center,
                  Layout.fullWidth,
                  Gutters.tinyRadius,
                  Gutters.borderWidth,
                  Gutters.smallBMargin,
                  {
                    height: 60,
                    backgroundColor: Colors.transparent,
                    borderColor: Colors.dark_gray_676C6A,
                  },
                ]}>
                <Text
                  style={[
                    Fonts.poppinMed18,
                    {fontWeight: '600', color: Colors.dark_gray_676C6A},
                  ]}>
                  Go back to listing
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default OffersComponnet;
