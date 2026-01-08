import i18next from 'i18next';
import React, {useState} from 'react';
import {
  Keyboard,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {
  CustomBottomSheet,
  CustomButton,
  CustomInput,
  CustomLoading,
  CustomStarRating,
  TextBold,
  TextMedium,
  TextRegular,
  TextSemiBold,
} from '../../components';
import {useDeleteItemForSaleMutation} from '../../services/submitForms/forms';
import {useTheme} from '../../hooks';
import {
  getPlaceHolderProduct,
  getURLPhoto,
  toastSuccessMessage,
} from '../../utils/helpers';
import {
  useAddFavouriteListingMutation,
  useRemoveFavouriteListingMutation,
} from '../../services/modules/home/favouriteListing';
import {useLazySingleListingQuery} from '../../services/modules/Listings/getSingleListing';
import moment from 'moment';
import {usePlaceFeedBackMutation} from '../../services/iWonLost/placeFeedBack';
import {Formik} from 'formik';
import {FeedBackProduct} from '../../utils/Interface';
import {FeedBackProductSchema} from '../../utils/Validation';
import SemiBoldText from '../../components/SemiBoldText';
import {setVehicalDataEpmty} from '../../store/Forms/vehicalForms';
import {useDispatch} from 'react-redux';
import {SvgUri} from 'react-native-svg';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {setCatagory, setSubCatagory} from '../../store/catagories/Catagories';
import {toastDangerMessage} from '../../utils/helpers';

type Props = {
  index?: number;
  showTriangleImage?: boolean;
  closingDate?: string;
  image: string;
  title: string;
  column?: any;
  selected?: number;
  offerCount: string;
  startingPrice: string;
  buyNowPrice: string;
  id: string;
  status?: string;
  type: string;
  is_favourite?: boolean;
  listing_type?: string;
  item?: any;
  getData?: CallableFunction;
  onDeleteSuccess: CallableFunction;
};

const CustomCard = ({
  index,
  id,
  startingPrice,
  buyNowPrice,
  selected,
  type,
  listing_type,
  status,
  is_favourite,
  title,
  offerCount,
  image,
  item,
  getData,
  onDeleteSuccess,
}: Props) => {
  const {Layout, Colors, Fonts, Images, Gutters} = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [placeFeedBack, setPlaceFeedBack] = useState(false);
  const [starPress, setStarPress] = useState(0);
  const [starError, setStarError] = useState('');
  const [feedBackError, setFeedBackError] = useState('');
  const [listStyle, setListStyle] = useState(true);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackSentSheet, setFeedbackSentSheet] = useState(false);

  const [placeFeedBackApi, placeFeedBackApiResult] = usePlaceFeedBackMutation();
  const [removeFavouriteListing, {isLoading: isLoadingRemoveFav}] =
    useRemoveFavouriteListingMutation();
  const [addFavoriteListing, {isLoading: isLoadingAddFav}] =
    useAddFavouriteListingMutation();
  const [singleListingDetail, {isLoading}] = useLazySingleListingQuery();
  const [deleteProduct, {isLoading: deleteLoading}] =
    useDeleteItemForSaleMutation();

  const addRemoveFavourites = (id: string, is_favourite: boolean) => {
    if (!!is_favourite) {
      removeFavouriteListing(id).then(() => {
        getData && getData();
      });
    } else {
      addFavoriteListing({listing: id}).then(() => {
        getData && getData();
      });
    }
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
      listing: item?._id,
      rating: starPress,
      to_user: item?.buyer?._id,
      type: 'seller_to_buyer',
    };
    try {
      placeFeedBackApi(data)
        .then(res => {
          console.log('>>> res ', JSON.stringify(res));

          if (res?.data?.message) {
            toastSuccessMessage(res?.data?.message);
            getData && getData();
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
            console.log(res, 'error in feedback');
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
  return (
    <View
      key={index}
      style={[
        Layout.selfCenter,
        Gutters.darkShadow,
        Gutters.smallBMargin,
        {
          marginRight: '3%',
          marginLeft: '3%',
          borderRadius: 10,
          backgroundColor: Colors.white,
        },
      ]}>
      <View
        style={[
          i18next.language === 'en' ? Layout.row : Layout.rowReverse,
          Layout.justifyContentBetween,

          Layout.overflow,
          Layout.fullWidth,
          {
            height: 194,
          },
        ]}>
        <View style={[{width: 150}]}>
          {image?.endsWith('.svg') ? (
            <View
              style={[
                Layout.alignItemsCenter,
                Layout.justifyContentCenter,
                {
                  height: '100%',
                },
              ]}>
              <SvgUri
                width="100"
                height="100"
                uri={getURLPhoto(image)}
                style={[
                  Layout.fill,
                  Gutters.tinyTLRadius,
                  Gutters.tinyBLRadius,
                ]}
              />
              <TouchableOpacity
                onPress={() => addRemoveFavourites(id, is_favourite)}
                style={{position: 'absolute', top: -1, right: 0}}>
                {is_favourite ? (
                  <Images.svg.rectangleGroup.default />
                ) : (
                  <Images.svg.eyeOpen.default />
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <FastImage
              source={
                image
                  ? {
                      uri: getURLPhoto(image),
                    }
                  : getPlaceHolderProduct()
              }
              resizeMode="cover"
              style={[Layout.fill, Gutters.tinyTLRadius, Gutters.tinyBLRadius]}>
              <TouchableOpacity
                onPress={() => addRemoveFavourites(id, is_favourite)}
                style={{position: 'absolute', top: -1, right: 0}}>
                {is_favourite ? (
                  <Images.svg.rectangleGroup.default />
                ) : (
                  <Images.svg.EyeRectangle.default />
                )}
              </TouchableOpacity>
            </FastImage>
          )}
          {item?.type === 'auction' && (
            <View
              style={[
                Layout.row,
                Layout.alignItemsCenter,
                Gutters.littleVPadding,
                Gutters.tinyHPadding,
                {
                  position: 'absolute',
                  bottom: 5,
                  left: 5,
                  zIndex: 1,
                  backgroundColor: item?.reserve_price
                    ? item?.reserve_met
                      ? Colors.primary
                      : Colors.gray_868e96
                    : Colors.gray_adb5bd,
                  borderRadius: 20,
                },
              ]}>
              {item?.reserve_price ? (
                item?.reserve_met ? (
                  <Images.svg.TickIwtach.default height={11} width={11} />
                ) : (
                  <Images.svg.SimpleCrossIcon.default height={11} width={11} />
                )
              ) : null}
              <Text
                numberOfLines={1}
                style={[
                  Fonts.poppinMed10,
                  // Gutters.tinyBMargin,
                  {
                    color: Colors.white,
                  },
                ]}>
                {item?.reserve_price
                  ? item?.reserve_met
                    ? ' Reserve Met'
                    : ' Reserve Met'
                  : 'No Reserve'}
              </Text>
            </View>
          )}
        </View>
        <View
          style={[
            Layout.fill,
            Gutters.tinyVMargin,
            Layout.column,
            Layout.justifyContentAround,
            Gutters.xTinyHPadding,
          ]}>
          <View
            style={[
              Layout.row,
              Layout.alignItemsCenter,
              Layout.justifyContentBetween,

              {
                zIndex: 999,
              },
            ]}>
            {selected === 0 && item?.end_date ? (
              <View style={[Layout.row, Gutters.tinyTMargin]}>
                {/* <Images.svg.calendarTick.default /> */}
                <Text
                  style={[
                    Fonts.poppinSemiBold12,
                    // Gutters.tinyLMargin,
                    {
                      color: Colors.dark_gray_676C6A,
                      width: '90%',
                    },
                  ]}>
                  {`Closes: ${moment(
                    item?.end_date ? item?.end_date : item?.updated_at,
                  ).format('DD MMM YYYY')}`}
                </Text>
              </View>
            ) : // <TextMedium
            //   text={`closes: ${closingDate}`}
            //   textStyle={[
            //     Fonts.poppinMed10,
            //     {color: Colors.dark_gray_676C6A},
            //   ]}
            // />

            status === 'expired' ||
              status === 'sold' ||
              status === 'withdrawn' ? (
              <View
                style={[
                  Layout.row,
                  Layout.alignItemsCenter,
                  Gutters.tinyBMargin,
                  Layout.justifyContentBetween,
                  {width: '100%'},
                ]}>
                <View style={[Layout.row, Layout.alignItemsCenter]}>
                  <Images.svg.calendarTick.default width={15} />
                  <TextMedium
                    text={`${moment(
                      item?.end_date
                        ? item?.end_date
                        : item?.status_changed_at
                        ? item?.status_changed_at
                        : item?.updated_at,
                    ).format('DD MMM YYYY')}`}
                    textStyle={[
                      Fonts.poppinMed10,
                      Gutters.tinyLMargin,
                      // Gutters.littleBMargin,
                      Layout.textTransform,
                      {color: Colors.red},
                    ]}
                  />
                </View>

                <TextMedium
                  text={`${status}`}
                  textStyle={[
                    Fonts.poppinMed10,
                    Gutters.tinyLMargin,
                    // Gutters.littleBMargin,
                    Layout.textTransform,
                    {color: Colors.red},
                  ]}
                />
              </View>
            ) : null}
            {/* <TouchableOpacity
              style={[Layout.absolute, Gutters.littlePadding, {right: -10}]}>
              <Images.svg.threeDots.default fill={Colors.gray_C9C9C9} />
            </TouchableOpacity> */}
          </View>

          <TextSemiBold
            text={title?.length > 20 ? title?.slice(0, 20) + '...' : title}
            textStyle={[
              Fonts.poppinSemiBold16,
              Gutters.littleBMargin,

              {
                color: Colors.black_232C28,
                width: '90%',
              },
            ]}
          />

          <View
            style={[
              Layout.row,
              Layout.justifyContentBetween,
              Layout.alignItemsCenter,
            ]}>
            {type == 'auction' ? (
              <View style={[{width: '50%'}]}>
                <Text
                  style={[Fonts.poppinMed14, {color: Colors.dark_gray_676C6A}]}>
                  Starting:
                </Text>
                <View style={[{width: '100%'}]}>
                  <Text
                    numberOfLines={3}
                    ellipsizeMode="tail"
                    style={[Fonts.poppinBold14]}>
                    {item?.type == 'auction'
                      ? `${t('common:nz')} ${startingPrice}`
                      : `${t('common:nz')} ${item?.fixed_price_offer}`}
                  </Text>
                </View>
              </View>
            ) : (
              <View></View>
            )}
            {!!item?.buy_now_price && status !== 'sold' && (
              <View style={[{width: '48%'}]}>
                <Text
                  style={[
                    Fonts.poppinMed14,
                    {color: Colors.primary, textAlign: 'right'},
                  ]}>
                  Buy Now:
                </Text>

                <Text
                  style={[
                    Fonts.poppinBold14,
                    Layout.selfEnd,
                    {color: Colors.primary},
                  ]}>
                  {t('common:nz') + ' ' + item?.buy_now_price}
                </Text>
                {/* )} */}
              </View>
            )}
          </View>

          {(selected === 1 && status === 'expired') ||
          status === 'withdrawn' ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                return singleListingDetail(id).then((res: any) => {
                  if (res?.data?._id) {
                    navigation.navigate(
                      listing_type === 'general'
                        ? 'ItemForSale'
                        : listing_type === 'vehicle'
                        ? 'VehicalForSale'
                        : 'PropertyForSale',
                      {
                        isEdit: true,
                        id: id,
                        edit_single_listing_data: res?.data,
                      },
                    );
                  }
                });
              }}
              style={[
                Gutters.tinyPadding,
                Layout.center,
                {backgroundColor: Colors.primary, borderRadius: 6},
              ]}>
              <Text style={[Fonts.poppinSemiBold16, {color: Colors.white}]}>
                Re List
              </Text>
            </TouchableOpacity>
          ) : (
            <View>
              {offerCount ? (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    let productObj = item;
                    navigation.navigate('RecievedOffers', {
                      item: {
                        id,
                        image,
                        title,
                        buyNowPrice,
                        productObj,
                      },
                    });
                  }}
                  style={[
                    Layout.row,
                    Layout.alignItemsCenter,
                    Layout.justifyContentBetween,
                    Gutters.tinyBMargin,
                    Gutters.tinyVPadding,
                  ]}>
                  <View>
                    <TextSemiBold
                      text={t('common:offer_received')}
                      textStyle={[
                        Fonts.poppinSemiBold14,
                        {
                          color: Colors.dark_gray_676C6A,
                          textDecorationLine: 'underline',
                        },
                      ]}
                    />
                  </View>
                  <TextSemiBold
                    text={`(${offerCount})`}
                    textStyle={[
                      Fonts.poppinSemiBold16,
                      {color: Colors.primary},
                    ]}
                  />
                </TouchableOpacity>
              ) : null}

              {selected === 0 && status !== 'sold' && (
                <TouchableOpacity
                  onPress={() => {
                    return singleListingDetail(id).then((res: any) => {
                      if (res?.data?._id) {
                        if (listing_type === 'vehicle') {
                          dispatch(setVehicalDataEpmty({}));
                        }
                        dispatch(setCatagory([]));
                        dispatch(setSubCatagory([]));
                        navigation.navigate(
                          listing_type === 'general'
                            ? 'ItemForSale'
                            : listing_type === 'vehicle'
                            ? 'VehicalForSale'
                            : 'PropertyForSale',
                          {
                            isEdit: true,
                            id: id,
                            edit_single_listing_data: res?.data,
                            withdrawn: true,
                          },
                        );
                      }
                    });
                  }}
                  style={[
                    Layout.fullWidth,
                    Layout.center,
                    Gutters.littlePadding,
                    {borderRadius: 6, backgroundColor: Colors.primary},
                  ]}>
                  <Text style={[Fonts.poppinMed14, {color: Colors.white}]}>
                    Edit List
                  </Text>
                </TouchableOpacity>
              )}

              {selected === 1 && status === 'sold' && (
                <TouchableOpacity
                  onPress={() => {
                    deleteProduct(id).then(res => {
                      if (res?.data?.message) {
                        onDeleteSuccess(id);
                      } else {
                        toastDangerMessage(
                          res?.data?.message || 'Something went wrong!',
                        );
                      }
                    });
                  }}
                  style={[
                    Layout.fullWidth,
                    Layout.center,
                    Gutters.littlePadding,
                    {borderRadius: 6, backgroundColor: Colors.red},
                  ]}>
                  <Text style={[Fonts.poppinMed14, {color: Colors.white}]}>
                    Delete Listing
                  </Text>
                </TouchableOpacity>
              )}

              <View>
                <Text
                  style={[
                    Fonts.poppinReg14,
                    Gutters.tinyTMargin,
                    {color: Colors.dark_gray_676C6A, marginRight: 2},
                  ]}>
                  {item.listing_views} views
                </Text>
              </View>
              {selected === 1 &&
                status === 'sold' &&
                item?.buyer &&
                item?.buyer?._id && (
                  <TouchableOpacity
                    activeOpacity={!item?.is_seller_feedback ? 0.8 : 1}
                    onPress={() => {
                      !item?.is_seller_feedback && setPlaceFeedBack(true);
                    }}
                    style={[
                      Gutters.tinyPadding,
                      Gutters.tinyTMargin,
                      Layout.center,
                      {
                        backgroundColor: Colors.primary,
                        borderRadius: 6,
                        zIndex: 2,
                      },
                    ]}>
                    <Text
                      style={[Fonts.poppinSemiBold16, {color: Colors.white}]}>
                      {!!item?.is_seller_feedback
                        ? 'Feedback Sent'
                        : 'Place Feedback'}
                    </Text>
                  </TouchableOpacity>
                )}
            </View>
          )}
        </View>
      </View>
      <CustomBottomSheet
        visible={placeFeedBack}
        setShowBottomSheet={setPlaceFeedBack}
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
                item?.buyer?.first_name + ' ' + item?.buyer?.last_name
              } ${t('common:for')} "${item?.title}"`}
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
                          onPress={() => setPlaceFeedBack(false)}
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
        visible={feedbackSent}
        setShowBottomSheet={setFeedbackSent}
        icon={false}
        height={'80%'}>
        <ScrollView
          contentContainerStyle={[Layout.grow, Layout.fill]}
          style={[Layout.fill, Layout.overflow]}
          keyboardShouldPersistTaps={'always'}>
          <View style={[Layout.center, {height: '30%'}]}></View>
          <View style={[Layout.fill, Layout.alignItemsCenter]}>
            <TextSemiBold
              text={t('common:feedback_sent')}
              textStyle={[{color: Colors.black_232C28}]}
            />
            <TextRegular
              text={t('common:review_has_posted')}
              textStyle={[Layout.textAlign, {color: Colors.black_232C28}]}
            />
            <CustomButton
              onPress={() => {}}
              text={t('common:continue')}
              btnStyle={[
                Layout.screenWidth,
                Gutters.smallTMargin,
                {backgroundColor: Colors.primary},
              ]}
              textStyle={[Fonts.poppinSemiBold24, {color: Colors.white}]}
            />
          </View>
        </ScrollView>
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
            }}
            textColor={Colors.white}
          />
        </View>
      </CustomBottomSheet>
      <CustomLoading
        isLoading={
          isLoading || isLoadingRemoveFav || isLoadingAddFav || deleteLoading
        }
      />
    </View>
  );
};

export default CustomCard;
