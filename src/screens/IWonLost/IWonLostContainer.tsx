import {Formik} from 'formik';
import moment from 'moment';
import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CustomBottomSheet,
  CustomButton,
  CustomHeader,
  CustomInput,
  CustomList,
  CustomLoading,
  CustomMenu,
  CustomPageLoading,
  CustomStarRating,
  TextBold,
  TextMedium,
  TextRegular,
  TextSemiBold,
} from '../../components';
import {useTheme} from '../../hooks';
import {FeedBackProduct} from '../../utils/Interface';
import {sHight, sWidth} from '../../utils/ScreenDimentions';
import {FeedBackProductSchema} from '../../utils/Validation';

import CustomCard from './CustomCard';
import Listing from './Listing';
import {t} from 'i18next';
import {useLazyGetListDataQuery} from '../../services/modules/Listings/getList';
import {useDispatch, useSelector} from 'react-redux';
import {usePlaceFeedBackMutation} from '../../services/iWonLost/placeFeedBack';
import {
  getPlaceHolderProduct,
  getURLPhoto,
  toastDangerMessage,
} from '../../utils/helpers';
import {
  setAddNoteOfSelectedProduct,
  setlistData,
  setSelectedProductData,
} from '../../store/Listings';
import {Image} from 'react-native';
import {fixBottomTab} from '../../store/stack/StackSlice';
import {selectedProduct} from '../../store/productDetail/ProductDetailSlice';
import RegularText from '../../components/RegularText';
import SemiBoldText from '../../components/SemiBoldText';
import {SvgUri} from 'react-native-svg';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

type Props = {
  navigation: any;
};

const IWonLostContainer = ({navigation}: Props) => {
  const dispatch = useDispatch();
  const {Layout, Colors, Fonts, Images, Gutters} = useTheme();
  const [selected, setSelected] = useState(0);
  const [placeFeedBack, setPlaceFeedBack] = useState(false);
  const [starPress, setStarPress] = useState(0);
  const [starError, setStarError] = useState('');
  const [feedBackError, setFeedBackError] = useState('');
  const [listStyle, setListStyle] = useState(true);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackSentSheet, setFeedbackSentSheet] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum,
  ] = useState(false);
  const [isLoadingBottom, setIsLoadingBottom] = useState(false);

  const [getListData, {isLoading: loading}] = useLazyGetListDataQuery();
  const [placeFeedBackApi, {isLoading}] = usePlaceFeedBackMutation();
  const listData = useSelector((state: any) => state?.list?.listData);
  const addNoteOfSelectedProduct = useSelector(
    (state: any) => state?.list?.addNoteOfSelectedProduct,
  );

  const getData = async (skip = 0) => {
    await getListData({
      pageName: 'iwon-ilost',
      filterType: `${selected === 0 ? 'iwon' : 'ilost'}`,
      skip: skip,
    }).finally(() => {
      setRefreshing(false);
      setIsLoadingBottom(false);
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    getData();
  };

  useEffect(() => {
    getData();
  }, [selected]);

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
  const LoadMoreRandomData = () => {
    setIsLoadingBottom(true);
    getData(listData?.items?.length);
  };

  const RenderItemGrid = ({item, index}: any) => {
    return (
      <TouchableOpacity
        style={[
          Gutters.darkShadow,
          Gutters.tinyVMargin,
          index % 2 == 0 && Gutters.smallLMargin,
          index % 2 == 1 && Gutters.smallRMargin,
          {
            width: sWidth(50) - 30,
            borderRadius: 10,
            backgroundColor: Colors.white,
          },
        ]}>
        <TouchableOpacity
          style={[
            {
              height: sHight(20),
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
            },
          ]}
          onPress={() => {
            dispatch(fixBottomTab(false));
            dispatch(selectedProduct(item));
            dispatch(setSelectedProductData({}));
            navigation.navigate('ProductDetailContainer' as never);
          }}>
          {item?.images && item?.images[0]?.name?.endsWith('.svg') ? (
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
                uri={getURLPhoto(item?.images[0]?.name)}
                style={[
                  Layout.fill,
                  {borderTopRightRadius: 10, borderTopLeftRadius: 10},
                ]}
              />
            </View>
          ) : (
            <Image
              source={
                item?.images && item?.images[0]?.name
                  ? {
                      uri: getURLPhoto(item?.images[0]?.name),
                    }
                  : getPlaceHolderProduct()
              }
              resizeMode="cover"
              style={[
                Layout.fill,
                {borderTopRightRadius: 10, borderTopLeftRadius: 10},
              ]}></Image>
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
        </TouchableOpacity>
        <View style={[Layout.fill]}>
          <View style={[Gutters.xTinyPadding, Layout.justifyContentBetween]}>
            <View>
              <View>
                <RegularText
                  text={`${
                    item?.status?.toLowerCase() === 'sold'
                      ? t('common:sold_on')
                      : t('common:expired_on')
                  }: ${moment(
                    item?.status_changed_at
                      ? item?.status_changed_at
                      : item?.updated_at,
                  ).format('DD MMM YYYY')}`}
                  textStyle={[
                    Fonts.poppinMed10,
                    {
                      color:
                        selected === 0 ? Colors.dark_gray_676C6A : Colors.red,
                    },
                  ]}
                />
              </View>
              <View>
                <View style={[Layout.row, Layout.alignItemsCenter]}>
                  {item?.pickup_location ? (
                    <>
                      <Images.svg.LocationTransparent.default
                        width={15}
                        height={15}
                      />

                      <TextSemiBold
                        text={
                          item?.pickup_location?.length > 10
                            ? item?.pickup_location?.slice(0, 12) + '...'
                            : item?.pickup_location
                        }
                        textStyle={[
                          Fonts.poppinSemiBold12,
                          {
                            color:
                              selected === 0
                                ? Colors.dark_gray_676C6A
                                : Colors.primary,
                          },
                        ]}
                      />
                    </>
                  ) : (
                    <TextSemiBold
                      text={'----'}
                      textStyle={[
                        Fonts.poppinSemiBold12,
                        {
                          color: Colors.transparent,
                        },
                      ]}
                    />
                  )}
                </View>
              </View>
              <View>
                <TextSemiBold
                  text={
                    item?.title?.length > 15
                      ? item?.title?.slice(0, 15) + '...'
                      : item?.title
                  }
                  textStyle={[
                    Fonts.poppinSemiBold12,
                    {
                      color: Colors.black_232C28,
                      // width: '80%',
                    },
                  ]}
                />
              </View>
            </View>
            <View>
              {selected === 0 && (
                <View
                  style={[
                    // Layout.fill,
                    Layout.row,
                    Layout.alignItemsCenter,
                    Layout.justifyContentBetween,
                  ]}>
                  <TextMedium
                    text={`${t('common:bought')}:`}
                    textStyle={[
                      Fonts.poppinMed10,
                      {color: Colors.dark_gray_676C6A},
                    ]}
                  />
                  <TextSemiBold
                    text={`${t('common:nz')} ${item?.sold_at_price_total}`}
                    textStyle={[
                      Fonts.poppinSemiBold12,
                      Layout.textUpperCase,
                      {color: Colors.black_232C28},
                    ]}
                  />
                </View>
              )}
            </View>

            {/* <View style={[Layout.row, Layout.alignItemsCenter]}>
              <Images.svg.calendarTick.default />
              <TextMedium
                text={`${status}`}
                textStyle={[
                  Fonts.poppinSemiBold13,
                  Gutters.littleLMargin,
                  {color: Colors.red},
                ]}
              />
            </View> */}

            {/* {selected === 0 ? (
            <TextMedium
              text={`${status}`}
              // text={`Closes: ${closingDate}`}
              textStyle={[
                Fonts.poppinMed10,
                Gutters.tinyTMargin,
                {color: Colors.red},
              ]}
            />
          ) : (
            <TextMedium
              text={`Expired on: ${moment(productEnded).format('MMM DD YYYY')}`}
              textStyle={[
                Fonts.poppinMed10,
                Gutters.tinyTMargin,
                {color: productEnded ? Colors.red : Colors.dark_gray_676C6A},
              ]}
            />
          )} */}
            {/* <View
            style={[
              Layout.row,
              Layout.justifyContentBetween,
              Layout.alignItemsCenter,
            ]}>
        
          </View> */}
          </View>
          <View
            style={[
              Gutters.smallHPadding,
              Gutters.tinyVPadding,

              {
                width: '100%',
                borderTopWidth: 1,
                borderColor: Colors.gray_C9C9C9,
              },
            ]}>
            {selected === 0 && (
              <TouchableOpacity
                onPress={() => {
                  if (item?.is_buyer_feedback) {
                  } else {
                    setPlaceFeedBack(true);
                    dispatch(
                      setAddNoteOfSelectedProduct({
                        id: item?._id,
                        user: item?.user,
                        title: item?.title,
                      }),
                    );
                  }
                }}>
                <TextBold
                  text={`${
                    item?.is_buyer_feedback
                      ? t('common:feedback_sent')
                      : t('common:place_feedback')
                  }`}
                  textStyle={[
                    Fonts.poppinBold12,
                    {
                      textDecorationLine: 'underline',
                      color: item?.is_buyer_feedback
                        ? Colors.black_232C28
                        : Colors.primary,
                    },
                  ]}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[Layout.fill, {backgroundColor: Colors.white}]}>
      <CustomHeader
        title={t('common:iwon_ilost')}
        navigation={navigation}
        rightIcon={true}
      />
      <View style={[Layout.screenWidth, Layout.selfCenter]}>
        <CustomMenu
          data={[
            {key: t('common:iwon'), valaue: '0'},
            {key: t('common:iLost'), valaue: '1'},
          ]}
          selected={selected}
          setSelected={i => {
            setSelected(i);
            dispatch(setlistData([]));
          }}
          textStyle={[{textTransform: 'none'}]}
        />
      </View>
      <View style={[Layout.fill]}>
        <View
          style={[
            Layout.alignItemsEnd,
            Layout.justifyContentCenter,
            // Gutters.tinyTMargin,
            Gutters.smallRMargin,
          ]}>
          <TouchableOpacity
            onPress={() => setListStyle(!listStyle)}
            style={[Gutters.smallTPadding, Gutters.xTinyBPadding]}>
            <View style={[Layout.row, Layout.alignItemsCenter]}>
              <TextMedium
                text={
                  listStyle ? t('common:grid_style') : t('common:list_style')
                }
                textStyle={[Fonts.poppinMed16, {color: Colors.black_232C28}]}
              />

              <Images.svg.listStyleIcon.default style={[Gutters.tinyLMargin]} />
            </View>
          </TouchableOpacity>
        </View>

        {listStyle ? (
          <FlatList
            extraData={listData?.items}
            data={listData?.items}
            keyExtractor={(_, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => {
              console.log('>>>item?.image ', item);

              return (
                <CustomCard
                  navigation={navigation}
                  item={item}
                  key={item?.index}
                  showTriangleImage={true}
                  user={item?.user}
                  id={item?._id}
                  status={item?.status}
                  image={item?.images && item?.images[0]?.name}
                  title={item?.title}
                  pickup_location={item?.pickup_location}
                  productEnded={item?.end_date}
                  index={index}
                  buy_now_price={item?.buy_now_price}
                  setPlaceFeedBack={() => {
                    setStarError('');
                    setFeedBackError('');
                    setStarPress(0);
                    setPlaceFeedBack(true);
                  }}
                  selected={selected}
                />
              );
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[Colors.primary]}
              />
            }
            onEndReached={({distanceFromEnd}) => {
              if (!onEndReachedCalledDuringMomentum) {
                if (
                  listData?.items &&
                  listData?.items?.length < listData?.pagination?.total
                ) {
                  LoadMoreRandomData();
                }
                setOnEndReachedCalledDuringMomentum(true);
              }
            }}
            onEndReachedThreshold={0.6}
            onMomentumScrollBegin={() => {
              setOnEndReachedCalledDuringMomentum(false);
            }}
            ListFooterComponent={() => {
              return (
                <View>
                  {isLoadingBottom ? (
                    <View
                      style={{
                        height: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <ActivityIndicator size="large" color={Colors.primary} />
                    </View>
                  ) : null}
                </View>
              );
            }}
            ListEmptyComponent={() => {
              return (
                <View style={[Layout.fill, Layout.center]}>
                  <Text
                    style={[
                      Fonts.poppinSemiBold16,
                      {color: Colors.black_232C28},
                    ]}>
                    No Data Found
                  </Text>
                </View>
              );
            }}
          />
        ) : (
          <View style={{flex: 1}}>
            <FlatList
              numColumns={2}
              extraData={listData?.items}
              data={listData?.items}
              keyExtractor={(_, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={RenderItemGrid}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={[Colors.primary]}
                />
              }
              columnWrapperStyle={[Layout.justifyContentBetween]}
              onEndReached={({distanceFromEnd}) => {
                if (!onEndReachedCalledDuringMomentum) {
                  if (
                    listData?.items &&
                    listData?.items?.length < listData?.pagination?.total
                  ) {
                    LoadMoreRandomData();
                  }
                  setOnEndReachedCalledDuringMomentum(true);
                }
              }}
              onEndReachedThreshold={0.6}
              onMomentumScrollBegin={() => {
                setOnEndReachedCalledDuringMomentum(false);
              }}
              ListFooterComponent={() => {
                return (
                  <View>
                    {isLoadingBottom ? (
                      <View
                        style={{
                          height: 50,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <ActivityIndicator
                          size="large"
                          color={Colors.primary}
                        />
                      </View>
                    ) : null}
                  </View>
                );
              }}
              ListEmptyComponent={() => {
                return (
                  <View style={[Layout.fill, Layout.center]}>
                    <Text
                      style={[
                        Fonts.poppinSemiBold16,
                        {color: Colors.black_232C28},
                      ]}>
                      No Data Found
                    </Text>
                  </View>
                );
              }}
            />
          </View>
        )}
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
        <KeyboardAwareScrollView
          contentContainerStyle={[Layout.grow, Layout.fill]}
          style={[Layout.fill, Layout.overflow]}>
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
        </KeyboardAwareScrollView>
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
      <CustomLoading isLoading={loading} />
    </View>
  );
};

export default IWonLostContainer;
