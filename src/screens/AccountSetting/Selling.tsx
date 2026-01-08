import i18next from 'i18next';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {
  CustomBottomSheet,
  CustomButton,
  CustomCheckBox,
  CustomInput,
  CustomSwitch,
  ScreenWrapper,
  TextMedium,
  TextRegular,
  TextSemiBold,
} from '../../components';
import {useTheme} from '../../hooks';
import {sHight, sWidth} from '../../utils/ScreenDimentions';
import {useDispatch, useSelector} from 'react-redux';
import {
  useLazyGetUserDataByTokenQuery,
  useUpdateUserDataProfileMutation,
} from '../../services/accountSettings/userProfileService';
import CreditCard from '../Auth/SignUp/CreditCard';
import {
  useDeleteCardMutation,
  useSetDefaultCardMutation,
} from '../../services/accountSettings/sellingService';
import {
  CardField,
  CardFieldInput,
  createToken,
  useStripe,
} from '@stripe/stripe-react-native';
import {toastDangerMessage} from '../../utils/helpers';
import {
  useCreateStripeCardMutation,
  useCreateStripeMutation,
} from '../../services/Stripe/stripe';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

type Props = {};

type TBankDetail = {
  bank_name: string;
  account_number: string;
  account_holder_name: string;
};
const Selling = (props: Props) => {
  const {Colors, Fonts, Images, Gutters, Layout} = useTheme();

  const user_data = useSelector(state => state.auth?.user_data);
  const [EditBankDetail, setEditBankDetail] = useState(false);
  const [bankDetail, setbankDetail] = useState<TBankDetail>({
    bank_name: user_data?.bank_details?.bank_name || '',
    account_number: user_data?.bank_details?.account_number || '',
    account_holder_name: user_data?.bank_details?.account_holder_name || '',
  });

  const [selectedShippingDetail, setSelectedShippingDetail] = useState(
    user_data?.shipping_methods || [],
  );
  const [storeShippingDetail, setStoreShippingDetail] = useState(false);
  const [showStripeView, setShowStripeView] = useState(false);

  const [getUserDataAPI] = useLazyGetUserDataByTokenQuery();
  const [setDefaultCardAPI] = useSetDefaultCardMutation();
  const [deleteCardAPI] = useDeleteCardMutation();
  const [isShowDeleteDialog, setIsShowDeleteDialog] = useState(false);
  const [deleteItemSelected, setDeleteItemSelected] = useState({});
  const [updateUserProfile] = useUpdateUserDataProfileMutation();
  const [nameOnCard, setNameOnCard] = useState('');
  const [nameError, setNameError] = useState(false);

  const shipping_methods = [
    {
      option_name: 'Free shipping within New Zealand',
      value: 'free_shipping',
      amount: null,
      description: null,
      url: null,
    },
    {
      option_name: 'Specify Shipping Costs',
      value: 'specify_costs',
      amount: '',
      description: null,
      url: null,
    },
    {
      option_name: 'Pickup',
      value: 'pickup',
      amount: null,
      description: null,
      url: null,
    },
    {
      option_name: 'To be arranged',
      value: 'dont_know',
      amount: null,
      description: null,
      url: null,
    },
  ];

  const [createStripeCard] = useCreateStripeCardMutation();
  const stripe = useStripe();
  const dispatch = useDispatch();

  const {token} = useSelector((state: any) => state.auth);

  const _createStripeToken = async () => {
    // if (!nameOnCard) {
    //   console.log('hello');
    //   setNameError(true);
    //   toastDangerMessage('Please enter name on card');
    //   return;
    // }
    let {error, token} = await stripe.createToken({type: 'Card'});

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
      toastDangerMessage(error?.message);
      return;
    } else if (token) {
      const card_data = {
        token: {
          id: token?.id,
          object: 'token',
          card: {
            id: token?.card?.id,
            object: 'card',
            address_city: null,
            address_country: null,
            address_line1: null,
            address_line1_check: null,
            address_line2: null,
            address_state: null,
            address_zip: token?.card?.address?.postalCode,
            address_zip_check: 'unchecked',
            brand: token?.card?.brand,
            country: token?.card?.country,
            cvc_check: 'unchecked',
            dynamic_last4: null,
            exp_month: token?.card?.expMonth,
            exp_year: token?.card?.expYear,
            funding: token?.card?.funding,
            last4: token?.card?.last4,
            name: null,
            networks: {preferred: null},
            tokenization_method: null,
            wallet: null,
          },
          client_ip: '154.81.246.111',
          created: 1719325736,
          livemode: false,
          type: 'card',
          used: false,
        },
      };

      // return console.log(card_data);
      createStripeCard(card_data);
      setShowStripeView(false);
    }
  };

  useEffect(() => {
    getUserDataAPI('');
  }, []);

  const addBankDetailsFunc = () => {
    setEditBankDetail(false);
    // console.log('>>> bankDetail ', bankDetail);

    let body = {
      bank_details: bankDetail,
    };
    updateUserProfile(body);
  };
  const addShippingMethodsFunc = () => {
    let body = {
      shipping_methods: selectedShippingDetail,
    };

    setStoreShippingDetail(false);
    setTimeout(() => {
      updateUserProfile(body);
    }, 50);
  };

  const findFlagById = (array, value) => {
    return array.find(item => item.value === value);
  };
  const findIndexByValue = (array, value) => {
    return array.findIndex(item => item.value === value);
  };
  const addItem = (array, newItem) => {
    return [...array, newItem];
  };
  const filterItemByValue = (array, value) => {
    return array.filter(item => item.value !== value);
  };
  const cardViewItem = ({item, index}) => {
    return (
      <View
        style={[
          Gutters.xTinyTMargin,
          {
            borderWidth: 0.5,
            borderColor: Colors.gray_C9C9C9,
            borderRadius: 5,
            // height: sHight(20),
            overflow: 'hidden',
          },
        ]}>
        <View
          style={[
            Gutters.tinyVPadding,
            {
              backgroundColor: Colors.light_grayF4F4F4,
            },
          ]}>
          {item.default ? null : (
            <View style={[Layout.alignItemsEnd]}>
              <TouchableOpacity
                style={[Gutters.tinyPadding]}
                onPress={() => {
                  setDeleteItemSelected(item);
                  setIsShowDeleteDialog(true);
                }}>
                <Images.svg.dustbin.default height={18} width={18} />
              </TouchableOpacity>
            </View>
          )}

          <View
            style={[
              Gutters.tinyHPadding,
              // Gutters.smallVPadding,
              Layout.justifyContentBetween,
              i18next.language === 'en' ? Layout.row : Layout.rowReverse,
            ]}>
            <View>
              <TextRegular
                text={t('common:card_number')}
                textStyle={[
                  Fonts.poppinSemiBold16,
                  {color: Colors.black_232C28},
                ]}
              />
              <TextRegular
                text={item.ccard_last4}
                textStyle={[
                  Fonts.poppinSemiBold16,
                  {color: Colors.black_232C28},
                ]}
              />
            </View>
            <View
              style={[
                i18next.language === 'en' ? Layout.row : Layout.rowReverse,
              ]}>
              <TextRegular
                text={t('common:default_card')}
                textStyle={[
                  Fonts.poppinSemiBold16,
                  Gutters.littleRMargin,
                  {
                    color: item.default ? Colors.primary : Colors.black_232C28,
                  },
                ]}
              />
              <CustomCheckBox
                isCard={true}
                selected={item.default}
                setSelected={() => {
                  setDefaultCardAPI(item._id);
                }}
              />
            </View>
          </View>
        </View>

        <View
          style={[
            i18next.language === 'en' ? Layout.row : Layout.rowReverse,
            Layout.alignItemsCenter,
            Gutters.tinyHPadding,
            Gutters.smallVPadding,
            {},
          ]}>
          <View>
            {item.brand == 'Visa' ? (
              <Images.svg.visa.default />
            ) : item.brand == 'MasterCard' ? (
              <Images.svg.masterCard.default width="58" height="38" />
            ) : item.brand == 'ApplePay' ? (
              <Images.svg.applePay.default width="58" height="38" />
            ) : (
              item.brand == 'Maestro' && (
                <Images.svg.maestro.default width="58" height="38" />
              )
            )}
          </View>
          <View style={[Gutters.tinyLMargin]}>
            <TextRegular
              text={`${item.brand} ${t('common:card')}`}
              textStyle={[Fonts.poppinSemiBold16, {color: Colors.black_232C28}]}
            />
            <TextRegular
              text={`${t('common:expiry_on')} ${item.expiry_month}/${
                item.expiry_year
              }`}
              textStyle={[Fonts.poppinSemiBold14, {color: Colors.black_232C28}]}
            />
            <TextRegular
              text={user_data.email}
              textStyle={[Fonts.poppinSemiBold12, {color: Colors.black_232C28}]}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAwareScrollView
      nestedScrollEnabled={true}
      keyboardShouldPersistTaps={'always'}
      contentContainerStyle={[Layout.flexGrow, Gutters.littleHPadding]}
      style={[Layout.fill]}
      extraScrollHeight={Platform.OS === 'android' ? 70 : 100}
      // scrollEnabled={scrollEnabledDate}
      // enableAutomaticScroll={scrollEnabled}
      // keyboardDismissMode="on-drag"
      enableResetScrollToCoords={false}>
      <View
        style={[
          Layout.fill,
          Layout.selfCenter,
          {backgroundColor: 'transparent', width: '94%'},
        ]}>
        <View style={[Layout.fill, Layout.justifyContentBetween]}>
          {!!token &&
            Platform.OS == 'android' &&
            (user_data?.platform == 'android' ||
              user_data?.platform == 'web') && (
              <View style={[Layout['fill'], Layout.justifyContentBetween]}>
                <TextSemiBold
                  text={t('common:cards')}
                  textStyle={[
                    Fonts.poppinSemiBold20,
                    {color: Colors.black_232C28},
                  ]}
                />
                {user_data?.stripe_detail?.cards?.length > 0 ? (
                  <FlatList
                    extraData={user_data?.stripe_detail?.cards}
                    data={user_data?.stripe_detail?.cards}
                    renderItem={cardViewItem}
                  />
                ) : (
                  <View>
                    <TextSemiBold
                      text={t('common:no_cards_added')}
                      textStyle={[
                        Fonts.poppinSemiBold20,
                        {color: Colors.dark_gray_676C6A},
                      ]}
                    />
                  </View>
                )}

                {showStripeView ? (
                  <View>
                    <CardField
                      // autofocus
                      postalCodeEnabled={false}
                      cardStyle={inputStyles}
                      style={styles.cardField}
                    />
                    <View style={[Layout.fullWidth, Layout.center]}>
                      <CustomButton
                        text={t('common:continue')}
                        onPress={_createStripeToken}
                        btnStyle={[{width: '85%'}]}
                        backgroundColor={Colors.primary}
                        textColor={Colors.white}
                        textStyle={[
                          Fonts.poppinSemiBold24,
                          // {textTransform: 'capitalize'},
                        ]}
                      />
                    </View>
                  </View>
                ) : (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      setShowStripeView(true);
                    }}
                    style={[
                      Layout.fullWidth,
                      Layout.center,
                      i18next.language === 'en'
                        ? Layout.row
                        : Layout.rowReverse,
                      Layout.alignItemsCenter,
                      Gutters.smallVMargin,
                      {
                        height: 88,
                        borderStyle: 'dashed',
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: Colors.primary,
                        backgroundColor: Colors.lightGreen_DBF5EC,
                      },
                    ]}>
                    <View
                      style={[
                        Layout.center,
                        {
                          width: 48,
                          height: 48,
                          borderRadius: 24,
                          backgroundColor: Colors.primary,
                        },
                      ]}>
                      <Images.svg.plus.default
                        fill={Colors.white}
                        width={24}
                        height={24}
                      />
                    </View>
                    <TextSemiBold
                      text={t('common:add_new_card')}
                      textStyle={[
                        Fonts.poppinSemiBold24,
                        Gutters.tinyLMargin,
                        {color: Colors.primary},
                      ]}
                    />
                  </TouchableWithoutFeedback>
                )}
              </View>
            )}
          <View style={[Layout.justifyContentCenter]}>
            <View style={[Gutters.smallTMargin, Layout.justifyContentBetween]}>
              <View
                style={[
                  i18next.language === 'en' ? Layout.row : Layout.rowReverse,
                  Layout.alignItemsCenter,
                  Layout.justifyContentBetween,
                  Gutters.smallBMargin,
                ]}>
                <TextSemiBold
                  text={t('common:bank_detail')}
                  textStyle={[
                    Fonts.poppinSemiBold20,
                    {color: Colors.black_232C28},
                  ]}
                />
                <TouchableWithoutFeedback
                  style={[]}
                  onPress={() => {
                    setEditBankDetail(true);
                  }}>
                  <Images.svg.editImage.default fill={Colors.gray_C9C9C9} />
                </TouchableWithoutFeedback>
              </View>
              <View
                style={[
                  Layout.fullWidth,
                  Layout.overflow,
                  {
                    borderWidth: 1,
                    borderColor: Colors.gray_C9C9C9,
                    borderRadius: 4,
                  },
                ]}>
                <View style={[Layout.fill, Gutters.smallPadding]}>
                  <>
                    <TextSemiBold
                      text={t('common:account_number')}
                      textStyle={[
                        Fonts.poppinSemiBold16,
                        {color: Colors.black_232C28},
                      ]}
                    />
                    <TextRegular
                      text={`${bankDetail?.account_number || t('common:n_a')}`}
                      textStyle={[
                        Fonts.poppinReg18,
                        {color: Colors.black_232C28},
                      ]}
                    />
                  </>
                </View>
                <View
                  style={[
                    Layout.fill,
                    Gutters.smallPadding,
                    {borderTopWidth: 1, borderColor: Colors.gray_C9C9C9},
                  ]}>
                  <>
                    <TextSemiBold
                      text={t('common:account_holder_name')}
                      textStyle={[
                        Fonts.poppinSemiBold16,
                        {color: Colors.black_232C28},
                      ]}
                    />
                    <TextRegular
                      text={`${
                        bankDetail?.account_holder_name || t('common:n_a')
                      }`}
                      textStyle={[
                        Fonts.poppinReg16,
                        {color: Colors.black_232C28},
                      ]}
                    />
                    <TextRegular
                      text={`${bankDetail?.bank_name}`}
                      textStyle={[
                        Fonts.poppinReg14,
                        {color: Colors.black_232C28},
                      ]}
                    />
                  </>
                </View>
              </View>
              <View
                style={[
                  i18next.language === 'en' ? Layout.row : Layout.rowReverse,
                  Layout.alignItemsCenter,
                  Layout.justifyContentBetween,
                  Gutters.smallTMargin,
                ]}>
                <TextSemiBold
                  text={t('common:display_phone_on_listing')}
                  textStyle={[
                    Fonts.poppinSemiBold20,
                    {color: Colors.black_232C28},
                  ]}
                />
                <CustomSwitch
                  selected={user_data?.display_phone}
                  setSelected={() => {
                    updateUserProfile({
                      display_phone: !user_data?.display_phone,
                    });
                  }}
                />
              </View>
              <View style={{height: 80}}></View>
              {/* <View
                style={[
                  Layout.fill,
                  Gutters.mediumVMargin,
                  Layout.justifyContentEnd,
                ]}>
                <CustomButton
                  text={t('common:store_shipping_details')}
                  btnStyle={[{backgroundColor: Colors.primary}]}
                  textStyle={[{color: Colors.white}]}
                  onPress={() => setStoreShippingDetail(true)}
                />
              </View> */}
            </View>
          </View>

          <CustomBottomSheet
            visible={storeShippingDetail}
            setShowBottomSheet={setStoreShippingDetail}
            icon={false}
            height={'90%'}>
            <ScrollView
              // contentContainerStyle={[Layout.flexGrow]}
              style={[Layout.fill, Gutters.smallHPadding]}
              keyboardShouldPersistTaps="always">
              <View style={[Layout.alignItemsEnd]}>
                <TouchableOpacity
                  style={[Gutters.tinyPadding]}
                  onPress={() => setStoreShippingDetail(false)}>
                  <Images.svg.cross.default fill="black" stroke={'black'} />
                </TouchableOpacity>
              </View>
              <TextSemiBold
                text={t('common:add_shipping_detail')}
                textStyle={[{color: Colors.black_232C28}]}
              />
              <View style={[Layout.fill, Gutters.smallTMargin, {}]}>
                <TextRegular
                  text={t('common:select_and_define_shipping_option')}
                  textStyle={[Fonts.poppinReg18, {color: Colors.black_232C28}]}
                />
                <FlatList
                  extraData={selectedShippingDetail}
                  data={shipping_methods}
                  renderItem={({item, index}) => {
                    let foundObjFlag = findFlagById(
                      selectedShippingDetail,
                      item.value,
                    );
                    return (
                      <>
                        <View
                          style={[
                            Gutters.tinyVMargin,
                            i18next.language === 'en'
                              ? Layout.row
                              : Layout.rowReverse,
                            Layout.alignItemsCenter,
                          ]}>
                          <CustomCheckBox
                            index={index}
                            customStyle={[{borderColor: Colors.primary}]}
                            selected={foundObjFlag?.value ? true : false}
                            setSelected={value => {
                              if (foundObjFlag?.value) {
                                setSelectedShippingDetail(
                                  filterItemByValue(
                                    selectedShippingDetail,
                                    item.value,
                                  ),
                                );
                              } else {
                                setSelectedShippingDetail(
                                  addItem(selectedShippingDetail, item),
                                );
                              }

                              // setSelectedShippingDetail
                            }}
                          />
                          <TextRegular
                            text={item?.option_name}
                            textStyle={[
                              Fonts.poppinReg18,
                              Gutters.tinyLMargin,
                              // Gutters.tinyTMargin,
                              {
                                color: Colors.black_232C28,
                                width: sWidth(80),
                                marginTop: 3,
                              },
                            ]}
                          />
                        </View>
                        {item.value === 'specify_costs' && (
                          <View style={[Gutters.regularHMargin]}>
                            <CustomInput
                              headingText={t(
                                'common:enter_shipping_cost_amount',
                              )}
                              headingTextStyle={[
                                Fonts.poppinMed16,
                                {color: Colors.dark_gray_676C6A},
                              ]}
                              placeholder={t('common:type')}
                              backgroundStyle={[
                                {
                                  borderWidth: 1,
                                  width: '105%',
                                  backgroundColor: Colors.light_grayF4F4F4,
                                },
                              ]}
                              inputProps={{
                                keyboardType: 'numeric',
                                placeholderText: Colors.black_232C28,
                                value: foundObjFlag?.amount
                                  ? foundObjFlag?.amount?.toString()
                                  : '',
                                onChangeText: t => {
                                  let index = findIndexByValue(
                                    selectedShippingDetail,
                                    item.value,
                                  );
                                  if (index > -1) {
                                    let tempArray = JSON.parse(
                                      JSON.stringify(selectedShippingDetail),
                                    );
                                    tempArray[index].amount = Number(t);
                                    if (t) {
                                      tempArray[index].amountError = '';
                                    }
                                    setSelectedShippingDetail(tempArray);
                                  }
                                },
                              }}
                            />
                            {foundObjFlag?.amountError && (
                              <TextRegular
                                text={foundObjFlag?.amountError}
                                textStyle={[
                                  Layout.textTransfromNone,
                                  {
                                    color: Colors.red,
                                    marginLeft: sHight(1),
                                  },
                                ]}
                              />
                            )}
                            <View style={[Gutters.xTinyTMargin]}>
                              <CustomInput
                                headingText={t(
                                  'common:enter_shipping_description',
                                )}
                                headingTextStyle={[
                                  Fonts.poppinMed16,
                                  {color: Colors.dark_gray_676C6A},
                                ]}
                                placeholder={t('common:type')}
                                backgroundStyle={[
                                  {
                                    borderWidth: 1,
                                    width: '105%',
                                    borderColor: Colors.black_232C28,
                                    backgroundColor: Colors.light_grayF4F4F4,
                                  },
                                ]}
                                inputStyle={[
                                  Fonts.poppinReg16,
                                  Platform.OS === 'ios' && Gutters.tinyTPadding,
                                ]}
                                inputProps={{
                                  placeholderText: Colors.dark_gray_676C6A,
                                  multiline: true,
                                  value: foundObjFlag?.description,
                                  onChangeText: t => {
                                    let index = findIndexByValue(
                                      selectedShippingDetail,
                                      item.value,
                                    );
                                    if (index > -1) {
                                      let tempArray = JSON.parse(
                                        JSON.stringify(selectedShippingDetail),
                                      );
                                      tempArray[index].description = t;
                                      setSelectedShippingDetail(tempArray);
                                    }
                                  },
                                }}
                              />
                            </View>
                          </View>
                        )}
                      </>
                    );
                  }}
                />
                <View style={[Gutters.smallRMargin, Gutters.littleTMargin]}>
                  <TouchableOpacity
                    style={[Gutters.littlePadding]}
                    onPress={() =>
                      Linking.openURL(
                        'https://www.nzpost.co.nz/tools/rate-finder/sending-nz/parcels',
                      )
                    }>
                    <TextRegular
                      text="https://www.nzpost.co.nz/tools/rate-finder/
            sending-nz/parcels"
                      textStyle={[
                        Fonts.poppinReg16,
                        {
                          lineHeight: 20,
                          textTransform: 'none',
                          color: Colors.black_232C28,
                        },
                      ]}
                    />
                  </TouchableOpacity>
                </View>
                <CustomButton
                  text={t('common:submit')}
                  btnStyle={[
                    Gutters.smallTMargin,
                    {
                      backgroundColor: Colors.primary,
                      //     selectedShippingDetail?.shippingCost != '' &&
                      //     shippingDetail?.shippingDescription != ''
                      //       ? Colors.primary
                      //       : Colors.gray_C9C9C9,
                    },
                  ]}
                  btnProps={
                    {
                      // disabled:
                      //   shippingDetail?.shippingCost != '' &&
                      //   shippingDetail?.shippingDescription != ''
                      //     ? false
                      //     : true,
                    }
                  }
                  textStyle={[{color: Colors.white}]}
                  onPress={() => {
                    let index = findIndexByValue(
                      selectedShippingDetail,
                      'specify_costs',
                    );
                    if (index > -1) {
                      let itemFound = selectedShippingDetail[index];
                      let tempAray = JSON.parse(
                        JSON.stringify(selectedShippingDetail),
                      );
                      if (
                        itemFound.amount === '' ||
                        itemFound.amount === null ||
                        itemFound.amount < 1
                      ) {
                        tempAray[index].amountError = t(
                          'common:please_enter_shipping_cost_amount',
                        );
                        setSelectedShippingDetail(tempAray);
                      } else {
                        addShippingMethodsFunc();
                      }
                      // else if (itemFound.description)
                      //   console.log('>>>itemFound ', itemFound);
                    } else {
                      addShippingMethodsFunc();
                    }
                  }}
                />
              </View>
            </ScrollView>
          </CustomBottomSheet>
          <CustomBottomSheet
            visible={isShowDeleteDialog}
            height={'80%'}
            icon={false}>
            <View
              style={[
                Layout.fill,
                Layout.alignItemsCenter,
                Gutters.smallTPadding,
              ]}>
              <Images.svg.dustbinRed.default height={53} width={60} />
              <TextSemiBold
                text={t('common:are_you_sure_you_want_to_delete_card')}
                textStyle={[
                  Layout.textAlign,
                  Gutters.regularVMargin,
                  Gutters.tinyHPadding,
                  {textTransform: 'none', color: Colors.black_232C28},
                ]}
              />
              <View
                style={[
                  Gutters.xRegularVPadding,
                  Layout.screenWidth,
                  Layout.justifyContentBetween,
                ]}>
                <CustomButton
                  text={t('common:delete')}
                  btnStyle={[{backgroundColor: Colors.red_FF0505F7}]}
                  textStyle={[Fonts.poppinSemiBold20, {color: Colors.white}]}
                  onPress={() => {
                    deleteCardAPI(deleteItemSelected._id);
                    setIsShowDeleteDialog(false);
                  }}
                />
                <CustomButton
                  text={t('common:cancel')}
                  btnStyle={[
                    Gutters.xTinyTMargin,
                    {backgroundColor: Colors.dark_gray_676C6A},
                  ]}
                  textStyle={[Fonts.poppinSemiBold24, {color: Colors.white}]}
                  onPress={() => {
                    setIsShowDeleteDialog(false);
                  }}
                />
              </View>
            </View>
          </CustomBottomSheet>
          <CustomBottomSheet
            visible={EditBankDetail}
            setShowBottomSheet={setEditBankDetail}
            icon={false}
            height={'80%'}>
            <View style={[Layout.alignItemsEnd]}>
              <TouchableOpacity
                style={[Gutters.tinyPadding]}
                onPress={() => setEditBankDetail(false)}>
                <Images.svg.cross.default fill="black" stroke={'black'} />
              </TouchableOpacity>
            </View>
            <TextSemiBold
              text={t('common:add_bank_details')}
              textStyle={[Fonts.poppinSemiBold24, {color: Colors.black}]}
            />
            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss();
              }}
              style={[Layout.fill]}
              activeOpacity={1}>
              <KeyboardAwareScrollView
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps={'always'}
                // contentContainerStyle={[
                //   Layout.flexGrow,
                //   Gutters.littleHPadding,
                // ]}
                // style={[Layout.fill]}
                extraScrollHeight={Platform.OS === 'android' ? 70 : 100}
                // scrollEnabled={scrollEnabledDate}
                // enableAutomaticScroll={scrollEnabled}
                // keyboardDismissMode="on-drag"
                enableResetScrollToCoords={false}>
                <View style={[Layout.overflow, Gutters.smallTMargin]}>
                  <CustomInput
                    placeholder={t('common:email_phone')}
                    headingText={t('common:account_number')}
                    headingTextStyle={[
                      Fonts.poppinSemiBold16,
                      {color: Colors.black_232C28},
                    ]}
                    inputProps={{
                      value: bankDetail.account_number,
                      onChangeText: t =>
                        setbankDetail({...bankDetail, account_number: t}),
                      keyboardType: 'number-pad',
                    }}
                    backgroundStyle={[
                      {
                        borderWidth: 1,
                        width: '100%',
                        backgroundColor: 'transparent',
                      },
                    ]}
                  />
                </View>
                <View style={[Layout.overflow, Gutters.tinyTMargin]}>
                  <CustomInput
                    placeholder={t('common:email_phone')}
                    headingText={t('common:account_holder_name')}
                    headingTextStyle={[
                      Fonts.poppinSemiBold16,
                      {color: Colors.black_232C28},
                    ]}
                    inputProps={{
                      value: bankDetail.account_holder_name,
                      onChangeText: t =>
                        setbankDetail({...bankDetail, account_holder_name: t}),
                    }}
                    backgroundStyle={[
                      {
                        borderWidth: 1,
                        width: '100%',
                        backgroundColor: 'transparent',
                      },
                    ]}
                  />
                </View>
                <View style={[Layout.overflow, Gutters.tinyTMargin]}>
                  <CustomInput
                    placeholder={t('common:email_phone')}
                    headingText={t('common:bank_name')}
                    headingTextStyle={[
                      Fonts.poppinSemiBold16,
                      {color: Colors.black_232C28},
                    ]}
                    inputProps={{
                      value: bankDetail.bank_name,
                      onChangeText: t =>
                        setbankDetail({...bankDetail, bank_name: t}),
                    }}
                    backgroundStyle={[
                      {
                        borderWidth: 1,
                        width: '100%',
                        backgroundColor: 'transparent',
                      },
                    ]}
                  />
                </View>

                <CustomButton
                  text={t('common:submit')}
                  btnStyle={[
                    Gutters.smallTMargin,
                    {backgroundColor: Colors.primary},
                  ]}
                  textStyle={[Fonts.poppinSemiBold20, {color: Colors.white}]}
                  onPress={addBankDetailsFunc}
                />
              </KeyboardAwareScrollView>
            </TouchableOpacity>
          </CustomBottomSheet>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Selling;

const styles = StyleSheet.create({
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 30,
  },
  or: {
    textAlign: 'center',
    marginTop: 30,
  },
});

const inputStyles: CardFieldInput.Styles = {
  borderWidth: 1,
  backgroundColor: '#FFFFFF',
  borderColor: '#000000',
  borderRadius: 8,
  fontSize: 14,
  placeholderColor: '#999999',
};
