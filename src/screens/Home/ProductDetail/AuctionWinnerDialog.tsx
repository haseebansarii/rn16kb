import {View, Text, TouchableOpacity, Platform, Keyboard} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../../../hooks';
import moment from 'moment';
import {product_details} from '../../../utils/dummyData';
import {useDispatch, useSelector} from 'react-redux';
import {buyingType} from '../../../store/productDetail/ProductDetailSlice';
import {
  formatNumberFloat,
  formatNumberInt,
  getStaticImage,
  getURLPhoto,
  showUserAlert,
} from '../../../utils/helpers';
import {RootState} from '../../../store/store';
import {screenWidth, sWidth} from '../../../utils/ScreenDimentions';
import {
  CustomBottomSheet,
  CustomButton,
  CustomFastImage,
  CustomInput,
  CustomStarRating,
  TextMedium,
  TextRegular,
  TextSemiBold,
} from '../../../components';
import {ScrollView} from 'react-native-gesture-handler';
import SellerAccount from './SellerAccount';
import {setAddNoteOfSelectedProduct} from '../../../store/Listings';
import {Formik} from 'formik';
import {FeedBackProduct} from '../../../utils/Interface';
import {FeedBackProductSchema} from '../../../utils/Validation';
import {usePlaceFeedBackMutation} from '../../../services/iWonLost/placeFeedBack';
import {useLazyGetSelectedProductDataQuery} from '../../../services/modules/Listings/getSelectedProductData';
import SemiBoldText from '../../../components/SemiBoldText';
import {useLazyGetListDataQuery} from '../../../services/modules/Listings/getList';
import {allMessages, setAllUserMessages} from '../../../store/chats/chats';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SvgUri} from 'react-native-svg';

const AuctionWinnerDialog = () => {
  const {Layout, Colors, Fonts, Gutters, Images} = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const user_data = useSelector((state: RootState) => state.auth?.user_data);
  const selectedProductData = useSelector(
    (state: any) => state?.list?.selectedProductData,
  );
  const addNoteOfSelectedProduct = useSelector(
    (state: any) => state?.list?.addNoteOfSelectedProduct,
  );
  const [getSelectedProductData, {}] = useLazyGetSelectedProductDataQuery();

  const [getListData, {isLoading: loading}] = useLazyGetListDataQuery();
  const currentTime = moment();
  const targetTime = moment(selectedProductData?.end_date);

  const timeDifference = moment.duration(targetTime.diff(currentTime));

  const [placeFeedBackApi, {isLoading}] = usePlaceFeedBackMutation();
  const [showAuctionDetails, setShowAuctionDetails] = useState(false);

  const [placeFeedBack, setPlaceFeedBack] = useState(false);
  const [starPress, setStarPress] = useState(0);
  const [starError, setStarError] = useState('');
  const [feedBackError, setFeedBackError] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackSentSheet, setFeedbackSentSheet] = useState(false);

  // Format the time difference
  const days = timeDifference.days();
  const hours = timeDifference.hours();
  const minutes = timeDifference.minutes();
  // const {token} = useSelector(state => state?.auth);
  const getData = async () => {
    await getSelectedProductData({
      product_id: selectedProductData?._id,
    });
    getDataAllListingIwon();
  };
  const getDataAllListingIwon = async () => {
    await getListData({
      pageName: 'iwon-ilost',
      filterType: `${'iwon'}`,
    });
  };

  const sendFeedBack = async v => {
    if (starPress === 0 || v.feedback === '') {
      starPress === 0 && setStarError(t('common:please_provide_rating'));
      v.feedback === '' &&
        setFeedBackError(t('common:please_provide_your_feedback'));
      return;
    }
    const data = {
      comment: v?.feedback,
      listing: addNoteOfSelectedProduct?.id,
      rating: starPress,
      to_user: addNoteOfSelectedProduct?.user?._id,
      type: 'buyer_to_seller',
    };
    try {
      placeFeedBackApi(data)
        .then(res => {
          if (res?.data?.message) {
            getData();
            setStarPress(0);
            setFeedbackSent(false);
            setPlaceFeedBack(false);
            if (Platform.OS === 'ios') {
              setTimeout(() => {
                setFeedbackSentSheet(true);
              }, 700);
            } else {
              setTimeout(() => {
                setFeedbackSentSheet(true);
              }, 200);
            }
          } else {
            setStarPress(0);
            setFeedbackSent(false);
            setPlaceFeedBack(false);
          }
        })
        .catch(error => {
          setFeedbackSent(false);
          setPlaceFeedBack(false);
        });
    } catch (error) {}
  };
  const calculateRating = (avgRating: any) => {
    let maxRating = 5;
    const percentage = (avgRating / maxRating) * 100;
    // Return either the exact value or an integer if it's a whole number
    return percentage % 1 === 0
      ? Math.round(percentage)
      : percentage.toFixed(2);
  };

  return (
    <View
      style={[
        Layout.screenWidth,
        Layout.selfCenter,
        Gutters.tinyTMargin,
        Gutters.smallBMargin,
        Gutters.smallPadding,
        {
          backgroundColor: Colors.lightGreen_DBF5EC,
          borderWidth: 1,
          borderColor: Colors.primary,
          borderRadius: 10,
        },
      ]}>
      <View style={[{borderBlockColor: Colors.gray_C9C9C9}]}>
        <Text
          style={[
            Fonts.poppinSemiBold32,
            Layout.textAlign,
            {color: Colors.black_232C28},
          ]}>
          {'Congratulations'}
        </Text>
        <Text
          style={[
            Fonts.poppinSemiBold24,
            Layout.textAlign,
            {color: Colors.black_232C28},
          ]}>
          {'you have won!'}
        </Text>
      </View>
      <TouchableOpacity
        style={[Gutters.tinyVMargin, Gutters.tinyVPadding]}
        onPress={() => setShowAuctionDetails(true)}>
        <Text
          style={[
            Fonts.poppinSemiBold20,
            Layout.textAlign,
            {color: Colors.green_06975E, textDecorationLine: 'underline'},
          ]}>
          {'View Details'}
        </Text>
      </TouchableOpacity>
      <View
        style={[
          Layout.row,
          Layout.justifyContentBetween,
          Layout.alignItemsCenter,
        ]}>
        <Text
          style={[
            Gutters.littleLMargin,
            Fonts.poppinMed18,
            {color: Colors.black_232C28},
          ]}>
          Current Bid:
        </Text>
        <Text style={[Fonts.poppinMed18, {color: Colors.black_232C28}]}>
          {t('common:nz') +
            ' ' +
            formatNumberFloat(selectedProductData?.auction_data?.current_bid)}
        </Text>
      </View>
      <CustomBottomSheet
        visible={showAuctionDetails}
        setShowBottomSheet={setShowAuctionDetails}
        icon={false}
        height={'90%'}>
        <KeyboardAwareScrollView
          // contentContainerStyle={[Layout.flexGrow]}
          style={[Layout.fill, Gutters.smallHPadding]}
          keyboardShouldPersistTaps="always">
          <View style={[Layout.alignItemsEnd]}>
            <TouchableOpacity
              style={[Gutters.tinyPadding]}
              onPress={() => setShowAuctionDetails(false)}>
              <Images.svg.cross.default fill="black" stroke={'black'} />
            </TouchableOpacity>
          </View>
          <TextSemiBold
            text={'Congratulations on your purchase!'}
            textStyle={[Fonts.poppinSemiBold28, {color: Colors.black_232C28}]}
          />
          <TextRegular
            text={'Only you can see this section'}
            textStyle={[
              Fonts.poppinMed18,
              Gutters.tinyVMargin,
              {color: Colors.black_232C28},
            ]}
          />
          <View
            style={[
              {
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
                borderBottomRightRadius: 5,
                borderBottomLeftRadius: 5,
                borderWidth: 1,
                overflow: 'hidden',
                borderColor: Colors.gray_C9C9C9,
              },
            ]}>
            <TextRegular
              text={'Purchase summary'}
              textStyle={[
                Fonts.poppinMed16,
                Gutters.smallHPadding,
                Gutters.tinyVPadding,
                {
                  color: Colors.black_232C28,
                  backgroundColor: Colors.light_grayF4F4F4,
                },
              ]}
            />
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
                text={'Item Price'}
                textStyle={[Fonts.poppinReg14, {color: Colors.black_232C28}]}
              />

              <TextRegular
                text={`${t('common:nz')} ${formatNumberFloat(
                  selectedProductData?.sold_at_price,
                )}`}
                textStyle={[Fonts.poppinReg14, {color: Colors.black_232C28}]}
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
                textStyle={[Fonts.poppinReg14, {color: Colors.black_232C28}]}
              />

              <TextRegular
                text={`${t('common:nz')} ${formatNumberFloat(
                  selectedProductData?.shipping?.amount,
                )}`}
                textStyle={[Fonts.poppinReg14, {color: Colors.black_232C28}]}
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
                  selectedProductData?.sold_at_price_total,
                )}`}
                textStyle={[
                  Fonts.poppinSemiBold14,
                  {color: Colors.black_232C28},
                ]}
              />
            </View>
          </View>
          <TextRegular
            text={`Bidder's`}
            textStyle={[
              Fonts.poppinSemiBold24,
              Gutters.smallVMargin,
              {color: Colors.black_232C28},
            ]}
          />
          <View style={[Layout.row, Layout.justifyContentBetween, {}]}>
            <View>
              <TextRegular
                text={'Username'}
                textStyle={[Fonts.poppinMed16, {color: Colors.black_232C28}]}
              />
              <TextRegular
                text={`${selectedProductData?.buyer?.first_name} ${selectedProductData?.buyer?.last_name}`}
                textStyle={[
                  Fonts.poppinReg16,
                  Gutters.littleTMargin,
                  {color: Colors.black_232C28},
                ]}
              />
            </View>
            {selectedProductData?.auction_data?.current_bid ? (
              <View>
                <TextRegular
                  text={'Bid Amount'}
                  textStyle={[Fonts.poppinMed16, {color: Colors.black_232C28}]}
                />
                <TextRegular
                  text={`${t('common:nz')} ${formatNumberFloat(
                    selectedProductData?.auction_data?.current_bid,
                  )}`}
                  textStyle={[
                    Fonts.poppinReg16,
                    Gutters.littleTMargin,
                    {color: Colors.black_232C28},
                  ]}
                />
              </View>
            ) : null}
          </View>

          <View style={[Gutters.tinyTMargin]}>
            <TextRegular
              text={'Reference'}
              textStyle={[Fonts.poppinMed16, {color: Colors.black_232C28}]}
            />
            <TextRegular
              text={`#${selectedProductData?._id}`}
              textStyle={[
                Fonts.poppinReg16,
                Gutters.littleTMargin,
                {color: Colors.black_232C28},
              ]}
            />
          </View>
          <View style={[Gutters.tinyTMargin, {}]}>
            {/* <View>
              <TextRegular
                text={'Timestamp'}
                textStyle={[Fonts.poppinMed16, {color: Colors.black_232C28}]}
              />
              <TextRegular
                text={`#${selectedProductData?._id}`}
                textStyle={[
                  Fonts.poppinReg16,
                  Gutters.littleTMargin,
                  {color: Colors.black_232C28},
                ]}
              />
            </View> */}
            <TextRegular
              text={'Selected Shipping'}
              textStyle={[Fonts.poppinMed16, {color: Colors.black_232C28}]}
            />
            <TextRegular
              text={`${selectedProductData?.shipping?.option_name}`}
              textStyle={[
                Fonts.poppinReg16,
                Gutters.littleTMargin,
                {color: Colors.black_232C28},
              ]}
            />
          </View>

          <View
            style={[
              Gutters.smallVMargin,
              {
                backgroundColor: Colors.gray_C9C9C9,
                height: 1,
              },
            ]}></View>
          <View style={[Gutters.tinyTMargin]}>
            <Text
              style={[Fonts.poppinSemiBold20, {color: Colors.black_232C28}]}>
              Seller
            </Text>
            <View
              style={[
                Layout.row,
                Layout.alignItemsCenter,
                Gutters.tinyTMargin,
                Layout.justifyContentBetween,
              ]}>
              <View style={[Layout.row, Layout.alignItemsCenter]}>
                <CustomFastImage
                  url={
                    selectedProductData?.user?.photo?.name
                      ? getURLPhoto(selectedProductData?.user?.photo?.name)
                      : getStaticImage(true)
                  }
                  resizeMode="cover"
                  style={[
                    {
                      height: 80,
                      width: 80,
                      borderRadius: 80 / 2,
                    },
                  ]}
                />

                <View style={[Gutters.tinyLMargin]}>
                  <View
                    style={[
                      Layout.row,
                      Layout.alignItemsCenter,
                      {width: screenWidth * 0.45},
                    ]}>
                    <Text style={[Fonts.poppinSemiBold20, Gutters.tinyRMargin]}>
                      {selectedProductData?.user?.first_name}{' '}
                      {selectedProductData?.user?.last_name}
                    </Text>
                  </View>
                  <View
                    style={[
                      {
                        width: screenWidth * 0.25,
                        justifyContent: 'center',
                        alignContent: 'center',
                      },
                    ]}>
                    <CustomStarRating
                      starSize={15}
                      // rating={selectedProductData?.user?.avg_rating_as_seller}
                      // starSize={32}
                      starProps={{
                        emptyStarColor: Colors.gray_707070,
                        rating: selectedProductData?.user?.avg_rating_as_seller,
                      }}
                      customStyle={[Gutters.tinyTMargin, {width: '45%'}]}
                    />
                  </View>
                  <TextMedium
                    text={`${calculateRating(
                      selectedProductData?.user?.avg_rating_as_seller,
                    )}% ${t('common:feed_back')}`}
                    textStyle={[
                      Fonts.poppinMed14,
                      {
                        color: Colors.black_232C28,
                        textDecorationLine: 'underline',
                      },
                    ]}
                  />
                </View>
              </View>
              <TouchableOpacity
                style={[
                  {backgroundColor: Colors.dark_gray_676C6A, borderRadius: 5},
                ]}
                onPress={() => {
                  dispatch(setAllUserMessages([{}]));
                  dispatch(allMessages([]));
                  navigation.navigate('ChatDetail', {
                    listing: selectedProductData,
                    seller_id: selectedProductData?.user?._id,
                    from_user:
                      selectedProductData?.user?._id != user_data?._id
                        ? selectedProductData?.user
                        : selectedProductData?.buyer,
                  });
                  setTimeout(() => {
                    setShowAuctionDetails(false);
                  }, 500);
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
                // Layout.row,
                // Layout.justifyContentBetween,
                Gutters.smallTMargin,
                {},
              ]}>
              <View>
                <TextRegular
                  text={'Email'}
                  textStyle={[Fonts.poppinMed16, {color: Colors.black_232C28}]}
                />
                <TextRegular
                  text={`${selectedProductData?.user?.email}`}
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
                  textStyle={[Fonts.poppinMed16, {color: Colors.black_232C28}]}
                />
                <TextRegular
                  text={`${selectedProductData?.user?.phone_number}`}
                  textStyle={[
                    Fonts.poppinReg16,
                    Gutters.littleTMargin,
                    {color: Colors.black_232C28},
                  ]}
                />
              </View>
            </View>
          </View>

          <View
            style={[
              Gutters.smallVMargin,
              {
                backgroundColor: Colors.gray_C9C9C9,
                height: 1,
              },
            ]}></View>

          <View>
            <TextRegular
              text={'Next Step'}
              textStyle={[Fonts.poppinSemiBold20, {color: Colors.black_232C28}]}
            />
            <TextRegular
              text={`Arrange with the seller to pay via Cash or NZ Bank deposit.`}
              textStyle={[
                Fonts.poppinReg14,
                Gutters.littleTMargin,
                {color: Colors.black_232C28},
              ]}
            />
          </View>
          <View style={[Gutters.tinyTMargin]}>
            <TextRegular
              text={'Feedback'}
              textStyle={[Fonts.poppinSemiBold20, {color: Colors.black_232C28}]}
            />
            <TextRegular
              text={`Inform iSqroll community of how your trade went once the sale is completed.`}
              textStyle={[
                Fonts.poppinReg14,
                Gutters.littleTMargin,
                {color: Colors.black_232C28},
              ]}
            />
          </View>
          <CustomButton
            text={
              selectedProductData?.is_buyer_feedback
                ? t('common:feedback_sent')
                : t('common:place_feedback')
            }
            btnStyle={[
              Gutters.smallVMargin,
              {
                backgroundColor: Colors.primary,
              },
            ]}
            textStyle={[{color: Colors.white}]}
            onPress={() => {
              if (selectedProductData?.is_buyer_feedback) {
              } else {
                setShowAuctionDetails(false);
                dispatch(
                  setAddNoteOfSelectedProduct({
                    id: selectedProductData?._id,
                    user: selectedProductData?.user,
                    title: selectedProductData?.title,
                  }),
                );
                setTimeout(() => {
                  setPlaceFeedBack(true);
                }, 700);
              }
            }}
          />
        </KeyboardAwareScrollView>
      </CustomBottomSheet>
      <CustomBottomSheet
        visible={placeFeedBack}
        setShowBottomSheet={v => {
          setPlaceFeedBack(v);
          setTimeout(() => {
            setShowAuctionDetails(true);
          }, 700);
        }}
        icon={false}
        height={'80%'}>
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss();
          }}
          style={[Layout.fill]}
          activeOpacity={1}>
          <KeyboardAwareScrollView
            style={[Layout.fill, Layout.overflow, Gutters.littleHMargin]}
            keyboardShouldPersistTaps={'always'}>
            <TextSemiBold
              text={t('common:feedback_iwon')}
              textStyle={[Fonts.poppinSemiBold30, {color: Colors.black_232C28}]}
            />
            <TextMedium
              text={`${t('common:your_trade_with')} ${
                addNoteOfSelectedProduct?.user?.first_name +
                ' ' +
                addNoteOfSelectedProduct?.user?.last_name
              } ${t('common:for')} "${addNoteOfSelectedProduct?.title}"`}
              textStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            />
            <View style={[Gutters.smallVMargin]}>
              <TextSemiBold
                text={t('common:rating')}
                textStyle={[
                  Fonts.poppinSemiBold20,
                  {color: Colors.black_232C28},
                ]}
              />
              <CustomStarRating
                starSize={32}
                starProps={{
                  emptyStarColor: Colors.gray_707070,
                  rating: starPress,
                  selectedStar: (rating: number) => {
                    starError && setStarError('');
                    setStarPress(rating);
                  },
                }}
                customStyle={[Gutters.tinyTMargin, {width: '45%'}]}
              />
              {starError !== '' && (
                <TextRegular
                  text={starError}
                  textStyle={[{color: Colors.red}]}
                />
              )}
            </View>

            <View style={[Gutters.smallBMargin]}>
              <Formik
                initialValues={FeedBackProduct}
                validationSchema={FeedBackProductSchema}
                onSubmit={(v, {resetForm}) => {
                  sendFeedBack(v);
                }}>
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  touched,
                  errors,
                }) => {
                  const {feedback} = values;
                  return (
                    <>
                      <CustomInput
                        headingText={t('common:your_feedback')}
                        placeholder={t('common:write_something')}
                        headingTextStyle={[
                          Fonts.poppinSemiBold20,
                          {color: Colors.black_232C28},
                        ]}
                        inputProps={{
                          placeholderTextColor: Colors.dark_gray_676C6A,
                          multiline: true,
                          onChangeText: text => {
                            feedBackError && setFeedBackError('');
                            handleChange('feedback')(text);
                          },
                          onBlur: handleBlur('feedback'),
                          value: feedback,
                        }}
                        inputStyle={[
                          Fonts.poppinReg14,
                          {
                            paddingLeft: 0,
                            textAlignVertical: 'top',
                          },
                        ]}
                        backgroundStyle={[
                          {
                            borderWidth: 1,
                            borderColor: Colors.gray_C9C9C9,
                            backgroundColor: Colors.bg_white_F4F4F4,
                            height: 133,
                          },
                        ]}
                      />
                      {feedBackError !== '' && (
                        <TextRegular
                          text={feedBackError}
                          textStyle={[{color: Colors.red}]}
                        />
                      )}

                      <View style={[Gutters.xRegularTMargin, Layout.overflow]}>
                        <CustomButton
                          onPress={handleSubmit}
                          text={t('common:place_feedback')}
                          btnStyle={[{backgroundColor: Colors.primary}]}
                          textStyle={[
                            Fonts.poppinSemiBold24,
                            Layout.textTransfromNone,
                            {color: Colors.white},
                          ]}
                        />
                        <CustomButton
                          onPress={() => {
                            setPlaceFeedBack(false);
                            setTimeout(() => {
                              setShowAuctionDetails(true);
                            }, 700);
                          }}
                          text={t('common:cancel')}
                          btnStyle={[
                            Gutters.tinyVMargin,
                            {backgroundColor: Colors.gray_C9C9C9},
                          ]}
                          textStyle={[
                            Fonts.poppinSemiBold24,
                            Layout.textTransfromNone,
                            {color: Colors.white},
                          ]}
                        />
                      </View>
                    </>
                  );
                }}
              </Formik>
            </View>
          </KeyboardAwareScrollView>
        </TouchableOpacity>
      </CustomBottomSheet>
      <CustomBottomSheet
        icon={false}
        height={'80%'}
        setShowBottomSheet={setFeedbackSentSheet}
        visible={feedbackSentSheet}>
        <View
          style={[
            Layout.fill,
            Layout.alignItemsCenter,
            Gutters.regularTPadding,
          ]}>
          <Images.svg.bucket.default />
          <SemiBoldText
            text={t('common:feedback_sent')}
            textStyle={[
              Fonts.poppinSemiBold32,
              Gutters.sRegularTMargin,
              {color: Colors.black_232C28},
            ]}
          />
          <TextRegular
            text={`${t('common:review_has_posted')}`}
            textProps={{
              numberOfLines: 3,
            }}
            textStyle={[
              Fonts.poppinReg20,
              Layout.selfCenter,
              Gutters.smallTMargin,
              {
                color: Colors.black_343434,
                width: '85%',
                textAlign: 'center',
              },
            ]}
          />
          <CustomButton
            text={t('common:continue')}
            backgroundColor={Colors.primary}
            btnStyle={[Gutters.sRegularTMargin, {width: '90%'}]}
            textStyle={[Layout.textTransform]}
            onPress={async () => {
              setFeedbackSentSheet(false);
              setTimeout(() => {
                setShowAuctionDetails(true);
              }, 700);
            }}
            textColor={Colors.white}
          />
        </View>
      </CustomBottomSheet>
    </View>
  );
};

export default AuctionWinnerDialog;
