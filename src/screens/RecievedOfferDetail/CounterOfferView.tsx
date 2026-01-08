import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FlatList, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../../hooks';
import {
  CustomButton,
  CustomFastImage,
  CustomStarRating,
  TextMedium,
  TextRegular,
  TextSemiBold,
} from '../../components';
import SemiBoldText from '../../components/SemiBoldText';
import moment from 'moment';
import 'moment-duration-format';
import {
  formatNumberFloat,
  formatNumberInt,
  getStaticImage,
  getURLPhoto,
  toastDangerMessage,
} from '../../utils/helpers';
import {API_URL} from '../../config';
import {
  useAcceptOrRejectOfferMutation,
  useCounterOfferMutation,
  useLazyProductOffersQuery,
} from '../../services/iSell/Offers';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import FastImage from 'react-native-fast-image';
import {StackActions, useNavigation} from '@react-navigation/native';
import {RefreshControl} from 'react-native-gesture-handler';
import {dropdownPaymentOption} from '../../utils/dummyData';
import {allMessages, setAllUserMessages} from '../../store/chats/chats';
import {useLazyGetSingleListingQuery} from '../../services/modules/Listings/getList';
import {screenWidth} from '../../utils/ScreenDimentions';
type Props = {
  params: object;
  getProductOfferFunc: CallableFunction;
  productObj: object;
};

const CounterOfferView = ({params, getProductOfferFunc, productObj}: Props) => {
  const {Layout, Colors, Fonts, Images, Gutters} = useTheme();

  const navigation = useNavigation();

  const [getProductOffers] = useLazyProductOffersQuery();
  const [acceptOffer, setAcceptOffer] = useState(false);
  const [counterOffer, setCounterOffer] = useState(false);
  const [decline, setDecline] = useState(false);
  const [counterOfferText, setCounterOfferText] = useState('');
  const user_data = useSelector((state: RootState) => state?.auth?.user_data);
  const productOffers = useSelector(state => state.productOffer?.productOffers);
  const [counterOfferApi, {isLoading}] = useCounterOfferMutation();
  const [acceptOrRejectOffers] = useAcceptOrRejectOfferMutation();
  const [productObjData, setProductObjData] = useState(productObj?.productObj);

  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const findItemById = id => {
    return productOffers?.offers?.find(item => item._id === id);
  };

  const [getSingleListing] = useLazyGetSingleListingQuery();
  console.log('>>> productObjData ', productObjData);
  console.log('>>>user_data  ', user_data);

  useEffect(() => {
    setProductObjData(productObj?.productObj);
  }, []);
  const handleRefresh = () => {
    if (refreshing === false) {
      setRefreshing(true);
      getData();
    }
  };
  const getData = async () => {
    await getProductOffers(productObj?.productObj?._id).finally(() =>
      setRefreshing(false),
    );
    getSingleListing(productObj?.productObj?._id).then((res: any) => {
      setProductObjData(res?.data);
    });
  };
  const calculateRating = (avgRating: any) => {
    let maxRating = 5;
    const percentage = (avgRating / maxRating) * 100;
    // Return either the exact value or an integer if it's a whole number
    return percentage % 1 === 0
      ? Math.round(percentage)
      : percentage.toFixed(2);
  };

  const acceptOfferOrRejectOffer = ({id, status}: any) => {
    const payload = {
      id: id,
      data: {
        listing: params?.listing,
        status: status,
        buyer: params?.buyer?._id,
      },
    };

    acceptOrRejectOffers(payload).then((res: any) => {
      console.log(res, 'response in then');
      // if (res?.data?.message == 'Purchase successful') {
      if (res?.data?.message) {
        const popAction = StackActions.pop(4);
        navigation.dispatch(popAction);
        navigation.navigate('HomeContainer' as never);
      }
      getData();
    });
  };
  // console.log('text outer=====', counterOfferText);
  const sendCounter = async (item: string) => {
    // console.log('text=====', counterOfferText);
    if (counterOfferText == '') {
      toastDangerMessage('Please provide a valid amount');
      return;
    }
    const data = {
      listing: params?.listing,
      amount: Number(counterOfferText),
      key: 'counter_offer',
      buyer: params?.buyer?._id, // id of user who made the offer...required when seller counter offers
      offer_id: item?._id,
      shipping: item?.shipping,
    };
    try {
      await counterOfferApi(data).then(res => {
        setCounterOfferText('');
        getData();
        setCounterOffer(false);
        // console.log('res in counter offer========', res.data);
      });
    } catch (error) {}
  };

  const acceptOfferView = item => {
    return (
      <View
        style={[
          Layout.screenWidth,
          Gutters.largeBMargin,
          Gutters.smallTMargin,
        ]}>
        <View
          style={[
            Gutters.tinyPadding,
            Gutters.smallLMargin,
            {
              width: '70%',
              backgroundColor: Colors.primary,
              borderBottomLeftRadius: 15,
              borderBottomRightRadius: 15,
              borderTopRightRadius: 15,
            },
          ]}>
          <TextRegular
            text={`${
              'Made an offer of' +
              ' ' +
              t('common:nz') +
              ' ' +
              formatNumberInt(item?.amount)
            }`}
            textStyle={[Fonts.poppinReg16, {color: Colors.white}]}
          />
        </View>
        <View
          style={[
            {
              width: '70%',
              alignItems:
                item?.type == 'buyer_to_seller' ? 'flex-end' : 'flex-start',
            },
          ]}>
          <TextRegular
            text={`${moment(item?.offered_at).format('hh:mm a')}`}
            textStyle={[
              Fonts.poppinReg10,
              Gutters.smallLMargin,
              Gutters.tinyTMargin,
              {color: Colors.dark_gray_676C6A},
            ]}
          />
        </View>
        <View
          style={[
            Layout.center,
            Gutters.smallTMargin,
            // Layout.fullWidth,
            Gutters.darkShadow,
            Gutters.tinyHMargin,
            {
              borderRadius: 6,
              backgroundColor: Colors.white,
            },
          ]}>
          <View
            style={[
              Layout.fullWidth,
              Layout.center,
              Gutters.smallPadding,
              {borderColor: Colors.gray_C9C9C9},
            ]}>
            <Images.svg.markRight.default />
            <TextSemiBold
              text={t('common:congratulation')}
              textStyle={[
                Fonts.poppinSemiBold25,
                Gutters.tinyVMargin,
                {color: Colors.black_232C28},
              ]}
            />
            <Text
              numberOfLines={3}
              style={[
                Layout.textAlign,
                Fonts.poppinMed16,
                {width: '80%', lineHeight: 25},
              ]}>
              {t('common:you_have_successfully_accept_this_offer_in')}{' '}
              <Text style={[{color: Colors.primary}]}>
                {t('common:nz')} {formatNumberFloat(item?.amount)}
              </Text>
            </Text>
          </View>

          <View style={[Layout.fullWidth, Gutters.smallHPadding]}>
            <View
              style={{
                height: 1,
                backgroundColor: Colors.gray_C9C9C9,
                width: '100%',
              }}></View>
          </View>
          <View style={[Layout.fullWidth, Gutters.smallPadding]}>
            {/* <CustomFastImage
              url={
                params?.buyer?.photo == null
                  ? getStaticImage(true)
                  : `${API_URL}get-uploaded-image/${params?.buyer?.photo?.name}`
              }
              cutomViewStyle={[
                {
                  width: 57,
                  height: 57,
                  borderWidth: 4,
                  borderRadius: 100,
                  borderColor: Colors.primary,
                },
              ]}
              resizeMode="cover"
            /> */}
            <View style={[Layout.center]}>
              <CustomFastImage
                url={
                  params?.seller === user_data?._id
                    ? params?.buyer?.photo == null
                      ? getStaticImage(true)
                      : `${API_URL}get-uploaded-image/${params?.buyer?.photo?.name}`
                    : productObjData?.user?.photo == null
                    ? getStaticImage(true)
                    : `${API_URL}get-uploaded-image/${productObjData?.user?.photo?.name}`
                }
                customStyle={[
                  {
                    width: 70,
                    height: 70,
                    // marginTop: 5,
                    borderRadius: 70 / 2,
                    borderWidth: 2,
                    borderColor: Colors.primary,
                  },
                ]}
                resizeMode="cover"
              />
              <View
                style={[
                  Layout.row,
                  Layout.alignItemsCenter,
                  Layout.justifyContentBetween,
                  Gutters.tinyTMargin,
                ]}>
                <TextSemiBold
                  text={
                    params?.seller === user_data?._id
                      ? `${params?.buyer?.first_name} ${params?.buyer?.last_name}`
                      : `${productObjData?.user?.first_name} ${productObjData?.user?.last_name}`
                  }
                  textStyle={[
                    Fonts.poppinSemiBold20,
                    Gutters.tinyRMargin,
                    {color: Colors.black_232C28},
                  ]}
                />
                <CustomStarRating
                  starSize={12}
                  rating={
                    params?.seller === user_data?._id
                      ? params?.buyer?.avg_rating_as_buyer
                      : productObjData?.user?.avg_rating_as_seller
                  }
                  starProps={{
                    emptyStarColor: Colors.gray_707070,
                  }}
                />
              </View>
              <View style={[{borderBottomWidth: 1}]}>
                <Text
                  numberOfLines={2}
                  style={[
                    Layout.textAlign,
                    Fonts.poppinReg16,
                    {width: '80%', lineHeight: 25},
                  ]}>
                  {calculateRating(
                    params?.seller === user_data?._id
                      ? params?.buyer?.avg_rating_as_buyer
                      : productObjData?.user?.avg_rating_as_seller,
                  )}
                  % {t('common:feed_back')}
                </Text>
              </View>
            </View>
            {params?.seller === user_data?._id ? null : (
              <View style={[Gutters.smallTMargin]}>
                <View>
                  <TextRegular
                    text={'Email'}
                    textStyle={[
                      Fonts.poppinMed16,
                      {color: Colors.black_232C28},
                    ]}
                  />
                  <TextRegular
                    text={`${productObjData?.user?.email}`}
                    textStyle={[
                      Fonts.poppinReg16,
                      Gutters.littleTMargin,
                      {color: Colors.black_232C28},
                    ]}
                  />
                </View>
                <View style={[Gutters.tinyTMargin]}>
                  <TextRegular
                    text={'Phone Number'}
                    textStyle={[
                      Fonts.poppinMed16,
                      {color: Colors.black_232C28},
                    ]}
                  />
                  <TextRegular
                    text={`${productObjData?.user?.phone_number}`}
                    textStyle={[
                      Fonts.poppinReg16,
                      Gutters.littleTMargin,
                      {color: Colors.black_232C28},
                    ]}
                  />
                </View>
                <View style={[Layout.alignItemsStart, Gutters.smallTMargin]}>
                  <TouchableOpacity
                    style={[
                      {
                        backgroundColor: Colors.dark_gray_676C6A,
                        borderRadius: 5,
                      },
                    ]}
                    onPress={() => {
                      dispatch(setAllUserMessages([{}]));
                      dispatch(allMessages([]));
                      navigation.navigate('ChatDetail', {
                        listing: productObjData,
                        seller_id: params?.seller,
                        from_user:
                          params?.seller === user_data?._id
                            ? productObjData?.buyer
                            : productObjData?.user,
                      });
                    }}>
                    <TextMedium
                      text={`iChat`}
                      textStyle={[
                        Fonts.poppinMed16,
                        Gutters.tinyVMargin,
                        Gutters.smallHMargin,
                        {
                          color: Colors.white,
                        },
                      ]}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    Gutters.smallVMargin,
                    {
                      height: 1,
                      backgroundColor: Colors.gray_C9C9C9,
                      width: '100%',
                    },
                  ]}></View>

                <TextRegular
                  text={'Purchase summary'}
                  textStyle={[
                    Fonts.poppinSemiBold20,
                    Gutters.smallHPadding,
                    Gutters.tinyVPadding,
                    {
                      color: Colors.black_232C28,
                      textAlign: 'center',
                    },
                  ]}
                />

                <View
                  style={[
                    {
                      // borderTopRightRadius: 20,
                      // borderTopLeftRadius: 20,
                      // borderBottomRightRadius: 5,
                      // borderBottomLeftRadius: 5,
                      borderWidth: 1,
                      overflow: 'hidden',
                      borderColor: Colors.gray_C9C9C9,
                      borderRadius: 5,
                    },
                  ]}>
                  <View
                    style={[
                      Layout.row,
                      Layout.justifyContentBetween,
                      Gutters.tinyHMargin,
                      Gutters.tinyVMargin,
                      {},
                    ]}>
                    <TextRegular
                      text={'Item Price'}
                      textStyle={[
                        Fonts.poppinReg14,
                        {color: Colors.black_232C28},
                      ]}
                    />

                    <TextRegular
                      text={`${t('common:nz')} ${formatNumberFloat(
                        productObjData?.sold_at_price,
                      )}`}
                      textStyle={[
                        Fonts.poppinReg14,
                        {color: Colors.black_232C28},
                      ]}
                    />
                  </View>
                  <View
                    style={{
                      backgroundColor: Colors.gray_C9C9C9,
                      height: 1,
                    }}></View>
                  <View
                    style={[
                      Layout.row,
                      Layout.justifyContentBetween,
                      Gutters.tinyHMargin,
                      Gutters.tinyVMargin,
                      {},
                    ]}>
                    <TextRegular
                      text={'Shipping'}
                      textStyle={[
                        Fonts.poppinReg14,
                        {color: Colors.black_232C28},
                      ]}
                    />

                    <TextRegular
                      text={`${t('common:nz')} ${formatNumberFloat(
                        productObjData?.shipping?.amount,
                      )}`}
                      textStyle={[
                        Fonts.poppinReg14,
                        {color: Colors.black_232C28},
                      ]}
                    />
                  </View>
                  <View
                    style={{
                      backgroundColor: Colors.gray_C9C9C9,
                      height: 1,
                    }}></View>
                  <View
                    style={[
                      Layout.row,
                      Layout.justifyContentBetween,
                      Gutters.tinyHMargin,
                      Gutters.tinyVMargin,
                      {},
                    ]}>
                    <TextRegular
                      text={'Total'}
                      textStyle={[
                        Fonts.poppinSemiBold14,
                        {color: Colors.black_232C28},
                      ]}
                    />
                    <TextRegular
                      text={`${t('common:nz')} ${formatNumberFloat(
                        productObjData?.sold_at_price_total,
                      )}`}
                      textStyle={[
                        Fonts.poppinSemiBold14,
                        {color: Colors.black_232C28},
                      ]}
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  // const counterOfferView = (id: string) => {
  //   return (
  //     <View
  //       style={[
  //         Gutters.tinyLMargin,
  //         Layout.overflow,
  //         {
  //           width: '80%',
  //           borderRadius: 6,

  //           backgroundColor: Colors.white,
  //           shadowColor: '#000',
  //           shadowOffset: {
  //             width: 0,
  //             height: 2,
  //           },
  //           shadowOpacity: 0.25,
  //           shadowRadius: 3.84,

  //           elevation: 5,
  //         },
  //       ]}>
  //       <View
  //         style={[
  //           Layout.alignItemsEnd,
  //           Gutters.tinyTMargin,
  //           Gutters.tinyRMargin,
  //         ]}>
  //         <TextRegular
  //           text={`${t('common:expires_in')} ${moment
  //             .duration(23 * 60 * 60 * 1000)
  //             .format('h [hrs]')}`}
  //           textStyle={[Fonts.poppinReg14, {color: Colors.dark_gray_676C6A}]}
  //         />
  //       </View>
  //       <View style={[Gutters.smallHPadding]}>
  //         <View
  //           style={[
  //             Layout.row,
  //             Layout.fullWidth,
  //             Layout.justifyContentBetween,
  //             Layout.alignItemsCenter,
  //           ]}>
  //           <TextSemiBold
  //             text="$160.00 "
  //             textStyle={[Fonts.poppinSemiBold24, {color: Colors.black_232C28}]}
  //           />
  //         </View>
  //         <View style={[Gutters.smallVMargin]}>
  //           <View style={[Layout.row, Layout.alignItemsCenter]}>
  //             <Images.svg.walletgreen.default />
  //             <Text
  //               style={[
  //                 Fonts.poppinReg14,
  //                 Gutters.tinyLMargin,
  //                 {color: Colors.black_232C28},
  //               ]}>
  //               {t('common:offer_payment')}:{' '}
  //               <Text style={[Fonts.poppinReg14, {color: Colors.black_232C28}]}>
  //                 Cash
  //               </Text>
  //             </Text>
  //           </View>
  //           <View
  //             style={[
  //               Layout.row,
  //               Gutters.tinyTMargin,
  //               Layout.alignItemsCenter,
  //             ]}>
  //             <Images.svg.vangreen.default />
  //             <Text
  //               style={[
  //                 Fonts.poppinReg14,
  //                 Gutters.tinyLMargin,
  //                 {color: Colors.black_232C28},
  //               ]}>
  //               {t('common:shipping')}:{' '}
  //               <Text style={[Fonts.poppinReg14, {color: Colors.black_232C28}]}>
  //                 Buyer must pick-up
  //               </Text>
  //             </Text>
  //           </View>
  //         </View>
  //       </View>
  //       <View
  //         style={[
  //           Layout.fullWidth,
  //           Layout.center,
  //           Gutters.tinyPadding,
  //           {backgroundColor: Colors.gray_F0F0F0},
  //         ]}>
  //         <Text
  //           style={[
  //             Fonts.poppinReg14,
  //             Gutters.tinyLMargin,
  //             {color: Colors.black_232C28, lineHeight: 22},
  //           ]}>
  //           Chris Jav has 6 offers remaining
  //         </Text>
  //       </View>
  //       <View style={[Layout.fullWidth, Gutters.smallPadding]}>
  //         <TextSemiBold
  //           text={t('common:make_a_counter_offer')}
  //           textStyle={[Fonts.poppinSemiBold18, {color: Colors.black_232C28}]}
  //         />
  //         <View
  //           style={[
  //             Layout.fullWidth,
  //             Layout.row,
  //             Layout.justifyContentBetween,
  //             Layout.alignItemsCenter,
  //             Gutters.tinyVMargin,
  //             {height: 50},
  //           ]}>
  //           <TextInput
  //             placeholder="$00.00"
  //             onChangeText={setCounterOfferText}
  //             keyboardType="number-pad"
  //             style={[
  //               Layout.fullHeight,
  //               Gutters.tinyLPadding,
  //               Fonts.poppinSemiBold18,

  //               {
  //                 color: Colors.dark_gray_676C6A,
  //                 width: '65%',
  //                 borderWidth: 1,
  //                 borderColor:
  //                   counterOfferText == ''
  //                     ? Colors.red_F73838
  //                     : Colors.gray_C9C9C9,
  //                 borderRadius: 4,
  //               },
  //             ]}
  //           />
  //           <TouchableOpacity
  //             activeOpacity={0.8}
  //             onPress={() => sendCounter(id)}
  //             style={[
  //               Gutters.xTinyPadding,
  //               Layout.center,
  //               {backgroundColor: Colors.primary, height: 50, borderRadius: 4},
  //             ]}>
  //             <Text style={[Fonts.poppinSemiBold18, {color: Colors.white}]}>
  //               {t('common:send')}
  //             </Text>
  //           </TouchableOpacity>
  //         </View>
  //         <TextRegular
  //           text={t('common:you_can_make_one_counter_offer_per_offer_received')}
  //           textStyle={[Fonts.poppinReg14, {color: Colors.black_232C28}]}
  //         />
  //       </View>
  //     </View>
  //   );
  // };

  const remainingTimeOfOffer = offeredAt => {
    // Parse the offeredAt date as UTC
    const offeredAtDate = new Date(offeredAt);

    // Get the current time (UTC)
    const now = new Date();

    // Calculate the difference in milliseconds between now and offeredAt
    const diffInMs =
      offeredAtDate.getTime() + 24 * 60 * 60 * 1000 - now.getTime();

    // If the offer hasn't expired
    if (diffInMs > 0) {
      // Convert milliseconds to minutes
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;

      // Display the result
      const result = `Expires in ${hours} hours and ${minutes} minutes`;

      return result;
    } else {
      return 'Offer has expired.';
    }
  };

  const offerView = item => {
    console.log('>> item ', item);

    return (
      <View
        style={[
          Gutters.tinyLMargin,
          // Gutters.lightShadow,
          {
            width: '80%',
            borderRadius: 10,
            backgroundColor: Colors.white,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 0.34,
            shadowRadius: 6.27,
            elevation: 10,
            marginTop: 5,
          },
        ]}>
        <Text
          style={[
            Fonts.poppinReg14,
            Gutters.smallTMargin,
            Gutters.smallHMargin,
            {color: Colors.black_232C28, textAlign: 'right'},
          ]}>
          {remainingTimeOfOffer(item?.offered_at)}
        </Text>
        <View style={[Gutters.mediumPadding]}>
          <TextSemiBold
            text={`${t('common:nz')} ${formatNumberInt(item?.amount)}`}
            textStyle={[Fonts.poppinSemiBold24, {color: Colors.black_232C28}]}
          />
          <View style={[Gutters.smallTMargin]}>
            <View style={[Layout.row, Layout.alignItemsCenter]}>
              <Images.svg.walletgreen.default />
              <Text
                style={[
                  Fonts.poppinReg14,
                  Gutters.tinyLMargin,
                  {color: Colors.black_232C28},
                ]}>
                {t('common:offer_payment')}:{' '}
                <Text style={[Fonts.poppinReg14, {color: Colors.black_232C28}]}>
                  {productObjData?.payment_option ==
                  dropdownPaymentOption[0]?.value
                    ? dropdownPaymentOption[0]?.key
                    : productObjData?.payment_option ==
                      dropdownPaymentOption[1]?.value
                    ? dropdownPaymentOption[1]?.key
                    : productObjData?.payment_option ==
                      dropdownPaymentOption[2]?.value
                    ? dropdownPaymentOption[2]?.key
                    : ''}
                </Text>
              </Text>
            </View>
            <View
              style={[
                Layout.row,
                Gutters.tinyTMargin,
                Layout.alignItemsCenter,
              ]}>
              <Images.svg.vangreen.default />
              <Text
                style={[
                  Fonts.poppinReg14,
                  Gutters.tinyLMargin,
                  {color: Colors.black_232C28},
                ]}>
                {t('common:shipping')}:{' '}
                <Text style={[Fonts.poppinReg14, {color: Colors.black_232C28}]}>
                  {item?.shipping?.option_name}
                </Text>
              </Text>
            </View>
          </View>
        </View>
        <View
          style={[
            Layout.fullWidth,
            Layout.center,
            Gutters.tinyPadding,
            {backgroundColor: Colors.gray_F0F0F0},
          ]}>
          <Text
            style={[
              Fonts.poppinReg14,
              Gutters.tinyLMargin,
              {color: Colors.black_232C28, lineHeight: 22},
            ]}>
            {params?.buyer?.first_name + ' ' + params?.buyer?.last_name} has{' '}
            {params?.remaining_offers} offers remaining
          </Text>
        </View>

        {counterOffer ? (
          <View style={[Layout.fullWidth, Gutters.smallPadding]}>
            <TextSemiBold
              text={t('common:make_a_counter_offer')}
              textStyle={[Fonts.poppinSemiBold18, {color: Colors.black_232C28}]}
            />
            <View
              style={[
                Layout.fullWidth,
                Layout.row,
                Layout.justifyContentBetween,
                Layout.alignItemsCenter,
                Gutters.tinyVMargin,
                {height: 50},
              ]}>
              <TextInput
                placeholder="$00.00"
                onChangeText={setCounterOfferText}
                keyboardType="number-pad"
                style={[
                  Layout.fullHeight,
                  Gutters.tinyLPadding,
                  Fonts.poppinSemiBold18,

                  {
                    color: Colors.dark_gray_676C6A,
                    width: '65%',
                    borderWidth: 1,
                    borderColor:
                      counterOfferText == ''
                        ? Colors.red_F73838
                        : Colors.gray_C9C9C9,
                    borderRadius: 4,
                  },
                ]}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => sendCounter(item)}
                style={[
                  Gutters.xTinyPadding,
                  Layout.center,
                  {
                    backgroundColor: Colors.primary,
                    height: 50,
                    borderRadius: 4,
                  },
                ]}>
                <Text style={[Fonts.poppinSemiBold18, {color: Colors.white}]}>
                  {t('common:send')}
                </Text>
              </TouchableOpacity>
            </View>
            <TextRegular
              text={t(
                'common:you_can_make_one_counter_offer_per_offer_received',
              )}
              textStyle={[Fonts.poppinReg14, {color: Colors.black_232C28}]}
            />
          </View>
        ) : (
          <View style={[Layout.fullWidth, Gutters.littleTPadding]}>
            {[
              t('common:accept'),
              t('common:counter_offer'),
              t('common:decline'),
            ].map((items, index) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    console.log('pressed');
                    if (index === 0) {
                      setAcceptOffer(true);
                      acceptOfferOrRejectOffer({
                        id: item?._id,
                        status: 'accepted',
                      });
                      // setCounterOffer(false);
                      // setDecline(false);
                    } else if (index === 1) {
                      // setAcceptOffer(false);
                      setCounterOffer(true);
                      // setDecline(false);
                    } else {
                      // return console.log('pressed right', item);
                      // setAcceptOffer(false);
                      // setCounterOffer(false);
                      // setDecline(true);
                      acceptOfferOrRejectOffer({
                        id: item?._id,
                        status: 'rejected',
                      });
                    }
                  }}
                  style={[
                    Layout.fullWidth,
                    Gutters.smallPadding,
                    Layout.center,
                    {
                      borderTopWidth: index == 1 ? 1 : 0,
                      borderBottomWidth: index == 1 ? 1 : 0,
                      borderColor: Colors.gray_C9C9C9,
                    },
                  ]}>
                  <SemiBoldText
                    text={items}
                    textStyle={[
                      Fonts.poppinSemiBold18,
                      {
                        color: index === 2 ? Colors.red_F73838 : Colors.primary,
                      },
                    ]}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        <View style={{position: 'absolute', bottom: -40, right: 5}}>
          <TextRegular
            text={`${moment(item?.offered_at).format('hh:mm a')}`}
            textStyle={[
              Fonts.poppinReg10,
              Gutters.smallLMargin,
              Gutters.tinyTMargin,
              {color: Colors.dark_gray_676C6A},
            ]}
          />
        </View>
      </View>
    );
  };

  const memoizedCallBack = ({item, index}: any) => {
    return (
      <View
        style={
          {
            // marginBottom:
            //   findItemById(params?._id)?.offers?.length - 1 == index
            //     ? 200
            //     : params?.offers?.length - 1 == index
            //     ? 200
            //     : 0,
          }
        }>
        {item?.type == 'buyer_to_seller' ? (
          <View
            key={index}
            style={[Layout.fullWidth, Gutters.littleLMargin, Layout.row]}>
            <View>
              <CustomFastImage
                url={
                  params?.buyer?.photo == null
                    ? getStaticImage(true)
                    : `${API_URL}get-uploaded-image/${params?.buyer?.photo?.name}`
                }
                customStyle={[
                  {
                    width: 28,
                    height: 28,
                    // marginTop: 5,
                    borderRadius: 28 / 2,
                  },
                ]}
                resizeMode="cover"
              />
            </View>

            <View style={[Layout.fullWidth]}>
              {item?.status === 'pending' && offerView(item)}
              {item?.status === 'accepted' && acceptOfferView(item)}
              {/* {item?.status == 'pending' &&
                counterOffer &&
                counterOfferView(item)} */}

              {item?.status == 'counter' && (
                <>
                  <View
                    style={[
                      Gutters.tinyPadding,
                      Gutters.tinyLMargin,

                      {
                        width: '70%',
                        borderBottomRightRadius: 15,
                        borderBottomLeftRadius: 15,
                        borderTopRightRadius: 15,
                        backgroundColor: Colors.primary,
                      },
                    ]}>
                    <TextRegular
                      text={`Made an offer of ${t(
                        'common:nz',
                      )} ${formatNumberInt(item?.amount)}`}
                      textStyle={[Fonts.poppinReg16, {color: Colors.white}]}
                    />
                  </View>
                  <View
                    style={[
                      {
                        width: '70%',
                      },
                    ]}>
                    <TextRegular
                      text={`${moment(item?.offered_at).format('hh:mm a')}`}
                      textStyle={[
                        Fonts.poppinReg10,
                        Gutters.smallLMargin,
                        Gutters.tinyTMargin,
                        {color: Colors.dark_gray_676C6A},
                      ]}
                    />
                  </View>
                  <View
                    style={{
                      width: screenWidth - 40,
                      alignItems: 'flex-end',
                    }}>
                    <View style={[Layout.row]}>
                      <View
                        style={[
                          Gutters.tinyPadding,
                          Gutters.tinyRMargin,
                          Layout.alignItemsEnd,

                          {
                            // width: '70%',
                            borderBottomRightRadius: 15,
                            borderBottomLeftRadius: 15,
                            borderTopLeftRadius: 15,
                            backgroundColor: Colors.black_232C28,
                          },
                        ]}>
                        <TextRegular
                          text={`Declined the offer of ${t(
                            'common:nz',
                          )} ${formatNumberInt(item?.amount)}`}
                          textStyle={[Fonts.poppinReg16, {color: Colors.white}]}
                        />
                      </View>
                      <CustomFastImage
                        url={
                          productObjData?.user?.photo?.name
                            ? getURLPhoto(productObjData?.user?.photo?.name)
                            : getStaticImage(true)
                        }
                        customStyle={[
                          {
                            width: 28,
                            height: 28,
                            // marginTop: 5,
                            borderRadius: 28 / 2,
                          },
                        ]}
                        resizeMode="cover"
                      />
                    </View>
                    <View
                      style={{
                        width: '70%',
                        alignItems: 'flex-end',
                        marginRight: 20,
                      }}>
                      <TextRegular
                        text={`${moment(params?.created_at).format('hh:mm a')}`}
                        textStyle={[
                          Fonts.poppinReg10,
                          Gutters.smallRMargin,
                          Gutters.tinyTMargin,
                          {color: Colors.dark_gray_676C6A},
                        ]}
                      />
                    </View>
                  </View>
                </>
              )}
              {item?.status == 'rejected' && (
                <>
                  <View
                    style={[
                      Gutters.tinyPadding,
                      Gutters.tinyLMargin,

                      {
                        width: '70%',
                        borderBottomRightRadius: 15,
                        borderBottomLeftRadius: 15,
                        borderTopLeftRadius: 15,
                        backgroundColor: Colors.primary,
                      },
                    ]}>
                    <TextRegular
                      text={`Made an offer of ${t(
                        'common:nz',
                      )} ${formatNumberInt(item?.amount)}`}
                      textStyle={[Fonts.poppinReg16, {color: Colors.white}]}
                    />
                  </View>
                  <View style={[{width: '70%'}]}>
                    <TextRegular
                      text={`${moment(item?.offered_at).format('hh:mm a')}`}
                      textStyle={[
                        Fonts.poppinReg10,
                        Gutters.smallLMargin,
                        Gutters.tinyTMargin,
                        {color: Colors.dark_gray_676C6A},
                      ]}
                    />
                  </View>

                  <View
                    style={[
                      Layout.alignItemsEnd,
                      Gutters.smallVMargin,
                      Gutters.tinyRMargin,
                    ]}>
                    <View style={[Layout.rowReverse, Gutters.tinyHMargin]}>
                      <View style={[Gutters.smallRMargin]}>
                        {/* <CustomFastImage
                          url={
                            user_data?.photo?.name
                              ? getURLPhoto(user_data?.photo?.name)
                              : getStaticImage(true)
                          }
                          // url={
                          //   params?.buyer?.photo == null
                          //     ? 'https://cdn.pixabay.com/photo/2023/09/04/20/39/cake-8233676_1280.jpg'
                          //     : `${API_URL}get-uploaded-image/${params?.buyer?.photo?.name}`
                          // }
                          cutomViewStyle={[
                            {
                              width: 28,
                              height: 28,

                              borderRadius: 100,
                            },
                          ]}
                          resizeMode="cover"
                        /> */}
                        <CustomFastImage
                          url={
                            productObjData?.user?.photo?.name
                              ? getURLPhoto(productObjData?.user?.photo?.name)
                              : getStaticImage(true)
                          }
                          customStyle={[
                            {
                              width: 28,
                              height: 28,
                              // marginTop: 5,
                              borderRadius: 28 / 2,
                            },
                          ]}
                          resizeMode="cover"
                        />
                      </View>
                      <View>
                        <View
                          style={[
                            Gutters.tinyPadding,
                            Gutters.tinyRMargin,
                            Layout.alignItemsEnd,

                            {
                              // width: '80%',
                              borderBottomRightRadius: 15,
                              borderBottomLeftRadius: 15,
                              borderTopLeftRadius: 15,
                              backgroundColor: Colors.black_232C28,
                            },
                          ]}>
                          <TextRegular
                            text={`Declined the offer of ${t(
                              'common:nz',
                            )} ${formatNumberInt(item?.amount)}`}
                            textStyle={[
                              Fonts.poppinReg16,
                              {color: Colors.white},
                            ]}
                          />
                        </View>
                        <TextRegular
                          text={`${moment(params?.created_at).format(
                            'hh:mm a',
                          )}`}
                          textStyle={[
                            Fonts.poppinReg10,
                            Gutters.smallRMargin,
                            Gutters.tinyTMargin,
                            {color: Colors.dark_gray_676C6A},
                          ]}
                        />
                      </View>
                    </View>
                  </View>
                </>
              )}
              {/* <TextRegular
                text={`${moment(params?.created_at).format('hh:mm a')}`}
                textStyle={[
                  Fonts.poppinReg10,
                  Gutters.smallLMargin,
                  Gutters.tinyTMargin,
                  {color: Colors.dark_gray_676C6A},
                ]}
              /> */}
            </View>
          </View>
        ) : (
          <View
            style={[
              // Layout.alignItemsEnd,
              Gutters.smallTMargin,
              // Gutters.tinyRMargin,
            ]}>
            {item?.status === 'pending' && offerView(item)}
            {item?.status === 'accepted' && acceptOfferView(item)}

            {item?.status == 'counter' && (
              <>
                <View style={[Layout.row]}>
                  <View style={[Gutters.littleLMargin, Gutters.tinyRMargin]}>
                    <CustomFastImage
                      url={
                        params?.buyer?.photo?.name
                          ? getURLPhoto(params?.buyer?.photo?.name)
                          : getStaticImage(true)
                      }
                      customStyle={[
                        {
                          width: 28,
                          height: 28,

                          borderRadius: 100,
                        },
                      ]}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={{width: '70%'}}>
                    <View
                      style={[
                        Gutters.tinyPadding,
                        {
                          borderBottomRightRadius: 15,
                          borderBottomLeftRadius: 15,
                          borderTopRightRadius: 15,
                          backgroundColor: Colors.primary,
                        },
                      ]}>
                      <TextRegular
                        text={`Made an offer of ${t(
                          'common:nz',
                        )} ${formatNumberInt(item?.amount)}`}
                        textStyle={[Fonts.poppinReg16, {color: Colors.white}]}
                      />
                    </View>

                    <View>
                      <TextRegular
                        text={`${moment(item?.offered_at).format('hh:mm a')}`}
                        textStyle={[
                          Fonts.poppinReg10,
                          Gutters.smallLMargin,
                          Gutters.tinyTMargin,
                          {color: Colors.dark_gray_676C6A},
                        ]}
                      />
                    </View>
                  </View>
                </View>

                <View
                  style={[
                    Layout.alignItemsEnd,
                    Gutters.smallTMargin,
                    // Gutters.tinyRMargin,
                  ]}>
                  <View style={[Layout.rowReverse]}>
                    <View style={[Gutters.littleRMargin]}>
                      <CustomFastImage
                        url={
                          productObjData?.user?.photo?.name
                            ? getURLPhoto(productObjData?.user?.photo?.name)
                            : getStaticImage(true)
                        }
                        customStyle={[
                          {
                            width: 28,
                            height: 28,

                            borderRadius: 100,
                          },
                        ]}
                        resizeMode="cover"
                      />
                    </View>
                    <View>
                      <View
                        style={[
                          Gutters.tinyPadding,
                          Gutters.tinyRMargin,
                          Layout.alignItemsEnd,

                          {
                            // width: '80%',
                            borderBottomRightRadius: 15,
                            borderBottomLeftRadius: 15,
                            borderTopLeftRadius: 15,
                            backgroundColor: Colors.black_232C28,
                          },
                        ]}>
                        <TextRegular
                          text={`Declined the offer of ${t(
                            'common:nz',
                          )} ${formatNumberInt(item?.amount)}`}
                          textStyle={[Fonts.poppinReg16, {color: Colors.white}]}
                        />
                      </View>
                      <View style={[Layout.alignItemsEnd]}>
                        <TextRegular
                          text={`${moment(params?.created_at).format(
                            'hh:mm a',
                          )}`}
                          textStyle={[
                            Fonts.poppinReg10,
                            Gutters.smallRMargin,
                            Gutters.tinyTMargin,
                            {color: Colors.dark_gray_676C6A},
                          ]}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </>
            )}
            {item?.status == 'rejected' && (
              <View style={[Gutters.smallBMargin, Gutters.littleRMargin]}>
                <View style={[Layout.rowReverse]}>
                  <View style={[Gutters.tinyLMargin]}>
                    {/* <CustomFastImage
                      url={
                        user_data?.photo?.name
                          ? getURLPhoto(user_data?.photo?.name)
                          : getStaticImage(true)
                      }
                      cutomViewStyle={[
                        {
                          width: 28,
                          height: 28,
                          marginTop: 5,
                          borderRadius: 100,
                        },
                      ]}
                      resizeMode="cover"
                    /> */}
                    <CustomFastImage
                      url={
                        productObjData?.user?.photo?.name
                          ? getURLPhoto(productObjData?.user?.photo?.name)
                          : getStaticImage(true)
                      }
                      customStyle={[
                        {
                          width: 28,
                          height: 28,
                          // marginTop: 5,
                          borderRadius: 28 / 2,
                        },
                      ]}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={[{width: '70%'}]}>
                    <View
                      style={[
                        Gutters.tinyPadding,
                        Gutters.tinyRMargin,
                        {
                          width: '100%',
                          borderBottomRightRadius: 15,
                          borderBottomLeftRadius: 15,
                          borderTopLeftRadius: 15,
                          backgroundColor: Colors.primary,
                        },
                      ]}>
                      <TextRegular
                        text={`Made an offer of ${t(
                          'common:nz',
                        )} ${formatNumberInt(item?.amount)}`}
                        textStyle={[Fonts.poppinReg16, {color: Colors.white}]}
                      />
                    </View>
                    <View>
                      <TextRegular
                        text={`${moment(item?.offered_at).format('hh:mm a')}`}
                        textStyle={[
                          Fonts.poppinReg10,
                          Gutters.tinyTMargin,

                          {color: Colors.dark_gray_676C6A},
                        ]}
                      />
                    </View>
                  </View>
                </View>

                <View
                  style={[
                    // Layout.rowReverse,
                    // Layout.alignItemsEnd,
                    Gutters.smallTMargin,
                    Gutters.littleLMargin,
                  ]}>
                  <View style={[Layout.row]}>
                    <View>
                      {/* <CustomFastImage
                        url={
                          params?.buyer?.photo == null
                            ? getStaticImage(true)
                            : `${API_URL}get-uploaded-image/${params?.buyer?.photo?.name}`
                        }
                        cutomViewStyle={[
                          {
                            width: 28,
                            height: 28,

                            borderRadius: 100,
                          },
                        ]}
                        resizeMode="cover"
                      /> */}
                      <CustomFastImage
                        url={
                          params?.buyer?.photo == null
                            ? getStaticImage(true)
                            : `${API_URL}get-uploaded-image/${params?.buyer?.photo?.name}`
                        }
                        customStyle={[
                          {
                            width: 28,
                            height: 28,
                            // marginTop: 5,
                            borderRadius: 28 / 2,
                          },
                        ]}
                        resizeMode="cover"
                      />
                    </View>
                    <View>
                      <View
                        style={[
                          Gutters.tinyPadding,
                          Gutters.tinyLMargin,
                          Layout.alignItemsEnd,

                          {
                            // width: '80%',
                            borderBottomRightRadius: 15,
                            borderBottomLeftRadius: 15,
                            borderTopLeftRadius: 15,
                            backgroundColor: Colors.black_232C28,
                          },
                        ]}>
                        <TextRegular
                          text={`Declined the offer of ${t(
                            'common:nz',
                          )} ${formatNumberInt(item?.amount)}`}
                          textStyle={[Fonts.poppinReg16, {color: Colors.white}]}
                        />
                      </View>
                      <View style={[Layout.alignItemsEnd]}>
                        <TextRegular
                          text={`${moment(params?.created_at).format(
                            'hh:mm a',
                          )}`}
                          textStyle={[
                            Fonts.poppinReg10,
                            Gutters.smallRMargin,
                            Gutters.tinyTMargin,
                            {color: Colors.dark_gray_676C6A},
                          ]}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )}
            {/* <TextRegular
              text={`${moment(item?.offered_at).format('hh:mm a')}`}
              textStyle={[
                Fonts.poppinReg10,
                Gutters.smallLMargin,
                Gutters.tinyTMargin,
                {color: Colors.dark_gray_676C6A},
              ]}
            /> */}
          </View>
        )}
      </View>
    );
  };
  return (
    <View style={[Layout.fill, Gutters.smallTPadding]}>
      <FlatList
        ListFooterComponent={() => <View style={{height: 200}}></View>}
        extraData={
          findItemById(params?._id)
            ? findItemById(params?._id)?.offers
            : params?.offers
        }
        data={
          findItemById(params?._id)
            ? findItemById(params?._id)?.offers
            : params?.offers
        }
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={memoizedCallBack as CallableFunction}
        contentContainerStyle={[Layout.flexGrow]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
          />
        }
      />
    </View>
  );
};

export default CounterOfferView;
