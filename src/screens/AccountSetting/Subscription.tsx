import React, {memo, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CustomBottomSheet,
  CustomButton,
  CustomLoading,
  TextMedium,
  TextRegular,
  TextSemiBold,
} from '../../components';
import {useTheme} from '../../hooks';
import {subscriptionData, subscription_points} from '../../utils/dummyData';
import SubscriptionCard from '../Auth/SignUp/SubscriptionCard';

import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import {
  useChangeSubscriptionMutation,
  useLazyCancelSubscriptionQuery,
  useLazyGetSubscriptionPlansQuery,
} from '../../services/accountSettings/subscriptionPlans';
import i18next from 'i18next';
import {useLazyGetUserDataByTokenQuery} from '../../services/accountSettings/userProfileService';
import SubscriptionPointsRender from '../../components/SubscriptionPointsRender';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import {
  clearTransactionIOS,
  deepLinkToSubscriptionsIos,
  isIosStorekit2,
  purchaseUpdatedListener,
  useIAP,
} from 'react-native-iap';
import SubscriptionCardCreateAccount from '../Auth/SignUp/SubscriptionCardCreateAccount';
type Props = {};

const Subscription = ({}: Props) => {
  const {Colors, Fonts, Images, Gutters, Layout} = useTheme();
  const [Subscription, setSubscription] = useState(3);
  const [SubscriptionTime, setSubscriptionTime] = useState(0);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showBottomSheetPlanDetails, setShowBottomSheetPlanDetails] =
    useState(false);
  const [showBottomSheetActivePlan, setShowBottomSheetActivePlan] =
    useState(false);

  const [MenuButton, setMenuButton] = useState(1);
  const [cancelSubscription, setCancelSubscription] = useState(false);
  const [buySubscription, setBuySubscription] = useState({});
  const [activeSubscriptionPlan, setActiveSubscriptionPlan] = useState<any>(0);
  const [isRestorePurchase, setIsRestorePurchase] = useState(false);

  const {
    connected,
    products,
    promotedProductsIOS,
    subscriptions,
    purchaseHistory,
    availablePurchases,
    currentPurchase,
    currentPurchaseError,
    initConnectionError,
    finishTransaction,
    getProducts,
    getSubscriptions,
    getAvailablePurchases,
    getPurchaseHistory,
    requestSubscription,
  } = useIAP();

  const fetchSubscriptions = async () => {
    try {
      const purchases = await getAvailablePurchases();

      console.log(purchases, 'checking purchases');
    } catch (err) {
      console.error('Error fetching subscriptions', err);
    }
  };

  useEffect(() => {
    // fetchSubscriptions();
  }, []);

  const {token, user_data} = useSelector(state => state.auth);

  const subscription_plans = useSelector(
    (state: RootState) => state?.accountSettings?.subscription_plans,
  );
  const subscription = useSelector(
    (state: RootState) => state.signup?.subscription,
  );

  const userData = useSelector((state: RootState) => state?.auth?.user_data);
  // console.log('>>userData 33 ', JSON.stringify(userData));

  const [getSubscriptionPlans, {isLoading: isLoadingPlans, isFetching}] =
    useLazyGetSubscriptionPlansQuery();
  const [cancelSubscriptionPlan] = useLazyCancelSubscriptionQuery();
  const [changeSubscriptionPlan, {isLoading: isLoadingChange}] =
    useChangeSubscriptionMutation();
  const [getUserData] = useLazyGetUserDataByTokenQuery();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingRestore, setIsCheckingRestore] = useState(false);

  useEffect(() => {
    setIsLoading(false);
    getSubscriptionPlans('').finally(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (
      showPlatformBasedContent() &&
      purchaseHistory &&
      purchaseHistory.length > 0 &&
      isCheckingRestore
    ) {
      // console.log('>>>>purchaseHistory ', purchaseHistory);
      // console.log(
      //   '>>>>userData?.subscription?.plan ',
      //   userData?.subscription?.plan,
      // );

      const productExists = findProductById(
        purchaseHistory,
        userData?.subscription?.plan || '0',
      );

      // Restore the purchase.
      if (productExists) {
        Alert.alert('Successfully restored your subscription.');
        setIsRestorePurchase(true);
        setIsCheckingRestore(false);
      } else {
        Alert.alert('No subscription available to restore.');
        setIsCheckingRestore(false);
      }
    }
  }, [purchaseHistory]);
  const findProductById = (purchases, productIdToFind) => {
    const purchase = purchases.find(p => p.productId === productIdToFind);
    return purchase ? true : false;
  };

  const findPlanById = id => {
    let itemTemp = null;
    subscription_plans.forEach(item => {
      if (item.free_plan?._id === id) {
        itemTemp = item;
      }
      if (item.monthly_plan?._id === id) {
        itemTemp = item;
      }
      if (item.yearly_plan?._id === id) {
        itemTemp = item;
      }
    });
    return itemTemp;
  };

  const calculateRemainingDays = endDate => {
    const currentDate = new Date();
    const subscriptionEndDate = new Date(endDate);

    // Zero out the hours, minutes, seconds, and milliseconds for both dates to ignore time
    currentDate.setHours(0, 0, 0, 0);
    subscriptionEndDate.setHours(0, 0, 0, 0);

    // Calculate the time difference in milliseconds
    const timeDifference = subscriptionEndDate - currentDate;

    // Convert time difference from milliseconds to days
    const daysRemaining = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    return daysRemaining;
  };
  const filterPlanById = id => {
    let dataTemp = [];
    dataTemp = subscription_plans.filter(item => {
      if (item.free_plan?._id === id) {
        return false;
      }
      if (item.monthly_plan?._id === id) {
        return false;
      }
      if (item.yearly_plan?._id === id) {
        return false;
      }
      return true;
    });
    return dataTemp;
  };
  const showPlatformBasedContent = () => {
    var show: any = null;
    if (Platform.OS == 'ios') {
      if (user_data?.platform == 'ios') {
        show = true;
      } else {
        if (user_data?.platform == 'android' || user_data?.platform == 'web') {
          show = false;
        }
      }
    }

    if (Platform.OS == 'android') {
      if (user_data?.platform == 'android' || user_data?.platform == 'web') {
        show = true;
      } else {
        if (user_data?.platform == 'ios') {
          show = false;
        }
      }
    }

    return show;
  };
  const renderActiveSubscription = () => {
    let itemPlan = findPlanById(userData?.subscription?.plan);

    return (
      <View
        style={[
          Layout['fill_1/3'],
          Gutters.smallPadding,
          {backgroundColor: Colors.lightGreen_DBF5EC},
        ]}>
        <TextSemiBold
          text={
            'Current Subscription'
            // itemPlan?.status === 'expire'
            //   ? 'Expired Subscription'
            //   : t('common:active_subscription')
          }
          textStyle={[
            Fonts.poppinSemiBold20,
            Gutters.tinyBMargin,
            {color: Colors.black_232C28},
          ]}
        />
        {itemPlan && (
          <SubscriptionCardCreateAccount
            interval={
              itemPlan?.free_plan?._id
                ? null
                : itemPlan?.monthly_plan?._id == userData?.subscription?.plan
                ? itemPlan?.monthly_plan?.interval
                : itemPlan?.yearly_plan?.interval
            }
            selectedPlanType={
              itemPlan?.monthly_plan?._id == userData?.subscription?.plan
                ? 0
                : 1
            }
            iaFromSettings={true}
            plan={itemPlan}
            title={itemPlan?.name}
            subTitle={itemPlan?.category}
            price={`${
              itemPlan?.free_plan?._id
                ? itemPlan?.free_plan?.amount
                : itemPlan?.monthly_plan?._id == userData?.subscription?.plan
                ? itemPlan?.monthly_plan?.amount
                : itemPlan?.yearly_plan?.amount
            }`}
            index={3}
            active={true}
            description={itemPlan?.description}
            // selected={Subscription}
            // setSelected={setSubscription}
            showCardDetail={setShowBottomSheet}
            cancelSubscription={setCancelSubscription}
            currentUserSubscription={userData?.subscription}
          />
        )}
        <CustomButton
          text={'View Details'}
          onPress={() => {
            let itemPlan: any = findPlanById(userData?.subscription?.plan);
            setActiveSubscriptionPlan(itemPlan);
            setShowBottomSheetActivePlan(true);
          }}
          backgroundColor={Colors.primary}
          btnStyle={[Gutters.tinyBMargin, Gutters.smallTMargin]}
          textStyle={[Fonts.poppinSemiBold20]}
          textColor={Colors.white}
        />
      </View>
    );
  };

  return (
    <View
      style={[
        Layout.fill,
        Gutters.smallHMargin,
        {backgroundColor: Colors.white},
      ]}>
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
        {showPlatformBasedContent() &&
          Platform.OS === 'ios' &&
          !isRestorePurchase && (
            <CustomButton
              text={'Restore Purchases'}
              onPress={async () => {
                try {
                  setIsLoading(true);
                  setIsCheckingRestore(true);
                  await getPurchaseHistory();
                } catch (error) {
                  console.warn(error);
                } finally {
                  setIsLoading(false);
                }
              }}
              backgroundColor={Colors.primary}
              btnStyle={[Gutters.smallVMargin]}
              textStyle={[Fonts.poppinSemiBold20]}
              textColor={Colors.white}
            />
          )}
        {(userData?.subscription?.plan || userData?.subscription?.status) &&
          // userData?.subscription?.status !== 'canceled' &&
          // findPlanById(userData?.subscription?.plan) &&
          renderActiveSubscription()}
        {!!token ? (
          <View style={[Layout.fill, Gutters.smallTMargin]}>
            <TextSemiBold
              text={t('common:other_subscriptions')}
              textStyle={[Fonts.poppinSemiBold20, {color: Colors.black_232C28}]}
            />
            {filterPlanById(
              userData?.subscription?.status !== 'canceled' &&
                userData?.subscription?.plan,
            )?.map((item, index) => (
              <View style={[Gutters.tinyTMargin]}>
                <SubscriptionCardCreateAccount
                  interval={
                    item?.free_plan?._id
                      ? null
                      : item?.monthly_plan?._id
                      ? item?.monthly_plan?.interval
                      : item?.yearly_plan?.interval
                  }
                  plan={item}
                  title={item?.name}
                  subTitle={item?.category}
                  description={item?.description}
                  // plan={free_plan || monthly_plan}
                  index={index}
                  price={
                    item?.free_plan?._id
                      ? item?.free_plan?.amount
                      : item?.monthly_plan?._id
                      ? item?.monthly_plan?.amount
                      : item?.yearly_plan?.amount
                  }
                  // selected={Subscription}
                  // setSelected={setSubscription}
                  showCardDetail={flag => {
                    setSubscriptionTime(0);
                    setShowBottomSheetPlanDetails(flag);
                  }}
                />
              </View>
            ))}
          </View>
        ) : (
          <View style={[Layout.fill, Gutters.smallTMargin]}>
            <TextSemiBold
              text={`Please use ${
                Platform.OS == 'android' ? 'ios' : 'android/web'
              } application to make any changes to your subscription plan.`}
              textStyle={[Fonts.poppinSemiBold20, {color: Colors.black_232C28}]}
            />
          </View>
        )}
        <View style={{height: 100}}></View>

        <CustomBottomSheet
          visible={cancelSubscription}
          height={'80%'}
          icon={false}>
          <View
            style={[
              Layout.fill,
              Gutters.regularTPadding,
              Layout.alignItemsCenter,
            ]}>
            <Images.svg.questionMarkCircle.default />
            <TextSemiBold
              text={t('common:are_you_sure_you_want_to_cancel_subscription')}
              textStyle={[
                Layout.textAlign,
                Gutters.regularTMargin,
                Gutters.smallHMargin,
                Fonts.poppinSemiBold28,
                {color: Colors.black_232C28},
              ]}
            />
            {userData?.subscription?.category == 'free' ? null : (
              <TextRegular
                text={`You have ${calculateRemainingDays(
                  userData?.subscription?.end_date,
                )} days remaining.`}
                textStyle={[
                  Layout.textAlign,
                  Gutters.smallPadding,
                  {color: Colors.black_232C28},
                ]}
              />
            )}

            <View style={[Gutters.smallTMargin, Layout.screenWidth]}>
              <CustomButton
                text={t('common:yes')}
                onPress={() => {
                  if (Platform.OS === 'ios') {
                    deepLinkToSubscriptionsIos();
                  } else {
                    cancelSubscriptionPlan('').then((res: any) => {
                      getSubscriptionPlans('');
                      getUserData('');
                    });
                  }
                  setCancelSubscription(false);
                }}
                btnStyle={[{backgroundColor: Colors.red_FF0505F7}]}
                textStyle={[Fonts.poppinSemiBold24, {color: Colors.white}]}
              />
              <CustomButton
                text={t('common:cancel')}
                onPress={() => setCancelSubscription(false)}
                btnStyle={[
                  Gutters.xTinyTMargin,
                  {backgroundColor: Colors.dark_gray_676C6A},
                ]}
                textStyle={[Fonts.poppinSemiBold24, {color: Colors.white}]}
              />
            </View>
          </View>
        </CustomBottomSheet>
        <CustomBottomSheet
          setShowBottomSheet={setShowBottomSheetPlanDetails}
          visible={showBottomSheetPlanDetails}
          height={'90%'}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={[
                Layout.fill,
                Layout.alignItemsCenter,
                Gutters.tinyPadding,
                Gutters.smallMargin,
                {borderWidth: 2, borderRadius: 10},
              ]}>
              <TextSemiBold
                text={subscription?.title}
                textStyle={[
                  Fonts.poppinSemiBold38,
                  Gutters.smallTMargin,
                  {color: Colors.gray_161C24},
                ]}
              />
              <TextRegular
                text={subscription?.description}
                textProps={{numberOfLines: 2}}
                textStyle={[
                  Fonts.poppinReg18,
                  Gutters.littleVMargin,
                  Layout.textAlign,
                  {width: '70%', color: Colors.black_232C28},
                ]}
              />
              <TextSemiBold
                text={`${t('common:nz')} ${
                  subscription?.plan?.category?.toLowerCase() == 'free'
                    ? subscription?.plan?.free_plan?.amount
                      ? subscription?.plan?.free_plan?.amount
                      : '0'
                    : SubscriptionTime == 0
                    ? subscription?.plan?.monthly_plan?.amount
                    : subscription?.plan?.yearly_plan?.amount || '0'
                }`}
                textStyle={[
                  Fonts.poppinSemiBold50,
                  Gutters.littleVMargin,
                  {color: Colors.gray_161C24},
                ]}
              />
              {subscription?.plan?.category !== 'free' && (
                <View
                  style={[
                    Layout.overflow,
                    i18next.language == 'en' ? Layout.row : Layout.rowReverse,
                    Layout.justifyContentBetween,
                    Layout.alignItemsCenter,
                    Gutters.xTinyBMargin,
                    {
                      width: '50%',
                      height: 40,
                      borderRadius: 10,
                      backgroundColor:
                        Platform.OS != 'ios'
                          ? Colors.light_grayF4F4F4
                          : !!subscription?.plan?.yearly_plan?.show_plan
                          ? Colors.light_grayF4F4F4
                          : 'transparent',
                    },
                  ]}>
                  <>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => setSubscriptionTime(0)}
                      style={[
                        Layout.center,
                        {
                          height: 40,
                          borderRadius: 10,
                          backgroundColor:
                            SubscriptionTime == 0
                              ? Colors.primary
                              : 'transparent',
                          width: '50%',
                        },
                      ]}>
                      <TextMedium
                        text={t('common:monthly')}
                        textStyle={[
                          Fonts.poppinMed16,
                          {
                            color:
                              SubscriptionTime == 0
                                ? Colors.white
                                : Colors.dark_gray_676C6A,
                          },
                        ]}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => setSubscriptionTime(1)}
                      style={[
                        Layout.center,
                        {
                          height: 40,
                          borderRadius: 10,
                          backgroundColor:
                            SubscriptionTime == 1
                              ? Colors.primary
                              : 'transparent',
                          width: '50%',
                        },
                      ]}>
                      <TextMedium
                        text={t('common:yearly')}
                        textStyle={[
                          Fonts.poppinMed16,
                          {
                            color:
                              SubscriptionTime == 1
                                ? Colors.white
                                : Colors.dark_gray_676C6A,
                          },
                        ]}
                      />
                    </TouchableOpacity>
                  </>
                </View>
              )}
              <SubscriptionPointsRender
                plan={subscription?.plan}
                SubscriptionTime={SubscriptionTime}
              />
              {/* {console.log(subscription?.plan?.yearly_plan)} */}
              <CustomButton
                text={t('common:buy_subscription')}
                onPress={async () => {
                  // dispatch(setsetSubscriptionPlan())

                  let id =
                    subscription?.plan?.category?.toLowerCase() == 'free'
                      ? subscription?.plan?.free_plan?._id
                      : SubscriptionTime == 0
                      ? subscription?.plan?.monthly_plan?._id
                      : subscription?.plan?.yearly_plan?._id;

                  if (Platform.OS == 'ios') {
                    if (subscription?.plan?.category?.toLowerCase() != 'free') {
                      console.log('started ...');
                      // await clearTransactionIOS();
                      console.log('proceeds after clearence ...');

                      getSubscriptions({
                        skus: [id],
                      })
                        .then(resp => {
                          requestSubscription({
                            sku: id,
                          })
                            .then(res => {
                              if (res?.transactionReceipt) {
                                let body = {
                                  plan_id: id,
                                  transaction_receipt: res,
                                };
                                changeSubscriptionPlan(body).then(() => {
                                  getUserData('');
                                });
                              }
                              console.log(res, 'checking response');
                            })
                            .catch(err => {
                              Alert.alert(JSON.stringify(err?.message));
                            });
                        })
                        .catch(err => console.log(err));
                    } else {
                      if (currentPurchase?.transactionReceipt) {
                        console.log('exist already package');
                        Alert.alert(
                          'Subscription',
                          'Please cancel paid subscription first',
                          [
                            {
                              text: 'Cancel',
                              onPress: () => {},
                            },
                            {
                              text: 'OK',
                              onPress: () => deepLinkToSubscriptionsIos(),
                            },
                          ],
                        );
                      } else {
                        let body = {plan_id: id};
                        changeSubscriptionPlan(body).then(() => {
                          getUserData('');
                        });
                      }
                    }
                  } else {
                    let body = {plan_id: id};
                    changeSubscriptionPlan(body).then(() => {
                      getUserData('');
                    });
                  }

                  setShowBottomSheetPlanDetails(false);
                  return;
                  // setCardView(true); now
                  // setSubscriptionPlan(false); now
                }}
                backgroundColor={Colors.primary}
                btnStyle={[Gutters.tinyBMargin, {width: '90%'}]}
                textStyle={[Fonts.poppinSemiBold20]}
                textColor={Colors.white}
              />
            </View>
          </ScrollView>
        </CustomBottomSheet>
        <CustomBottomSheet
          setShowBottomSheet={setShowBottomSheetActivePlan}
          visible={showBottomSheetActivePlan}
          height={'90%'}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <TextSemiBold
              text={'Current Plan Details'}
              textStyle={[
                Fonts.poppinSemiBold30,
                Gutters.smallTMargin,
                Gutters.smallHMargin,
                {color: Colors.gray_161C24},
              ]}
            />
            <View
              style={[
                Layout.fill,
                // Layout.alignItemsCenter,
                Gutters.tinyPadding,
                Gutters.smallMargin,
                {borderWidth: 2, borderRadius: 10},
              ]}>
              {/* <TextSemiBold
                text={subscription?.title}
                textStyle={[
                  Fonts.poppinSemiBold40,
                  Gutters.smallTMargin,
                  {color: Colors.gray_161C24},
                ]}
              /> */}
              {/* <TextRegular
                text={subscription?.description}
                textProps={{numberOfLines: 2}}
                textStyle={[
                  Fonts.poppinReg18,
                  Gutters.littleVMargin,
                  Layout.textAlign,
                  {width: '70%', color: Colors.black_232C28},
                ]}
              /> */}
              {/* <View>
                <TextSemiBold
                  text={'Plan Name'}
                  textStyle={[
                    Fonts.poppinSemiBold16,
                    Gutters.tinyTMargin,
                    {color: Colors.black_232C28},
                  ]}
                />
                <TextSemiBold
                  text={itemPlan?.name}
                  textStyle={[
                    Fonts.poppinMed16,
                    {color: Colors.dark_gray_676C6A},
                  ]}
                />
              </View> */}
              <View>
                <TextSemiBold
                  text={'Status'}
                  textStyle={[
                    Fonts.poppinSemiBold16,
                    Gutters.smallTMargin,
                    {color: Colors.black_232C28},
                  ]}
                />
                <TextSemiBold
                  text={userData?.subscription?.status}
                  textStyle={[
                    Fonts.poppinMed16,
                    {
                      color: Colors.dark_gray_676C6A,
                      textTransform: 'capitalize',
                    },
                  ]}
                />
              </View>
              <View>
                <TextSemiBold
                  text={'Plan Name'}
                  textStyle={[
                    Fonts.poppinSemiBold16,
                    Gutters.smallTMargin,
                    {color: Colors.black_232C28},
                  ]}
                />
                {/* {console.log(userData?.subscription?.plan_name)} */}
                <TextSemiBold
                  text={userData?.subscription?.plan_name ?? '-'}
                  textStyle={[
                    Fonts.poppinMed16,
                    {color: Colors.dark_gray_676C6A},
                  ]}
                />
              </View>
              {userData?.subscription?.category == 'paid' && (
                <View>
                  <View>
                    <TextSemiBold
                      text={'Subscription End Date'}
                      textStyle={[
                        Fonts.poppinSemiBold16,
                        Gutters.smallTMargin,
                        {color: Colors.black_232C28},
                      ]}
                    />
                    <TextSemiBold
                      text={
                        moment(userData?.subscription?.end_date).format(
                          'DD-MM-YYYY',
                        ) ?? '-'
                      }
                      textStyle={[
                        Fonts.poppinMed16,
                        {color: Colors.dark_gray_676C6A},
                      ]}
                    />
                  </View>
                  {user_data?.platform == 'ios' && (
                    <View>
                      <TextSemiBold
                        text={'Subscription Renewal Date'}
                        textStyle={[
                          Fonts.poppinSemiBold16,
                          Gutters.smallTMargin,
                          {color: Colors.black_232C28},
                        ]}
                      />
                      <TextSemiBold
                        text={
                          moment(userData?.subscription?.end_date).format(
                            'DD-MM-YYYY',
                          ) ?? '-'
                        }
                        textStyle={[
                          Fonts.poppinMed16,
                          {color: Colors.dark_gray_676C6A},
                        ]}
                      />
                    </View>
                  )}
                  {activeSubscriptionPlan?.monthly_plan?._id ==
                    userData?.subscription?.plan && (
                    <View>
                      <TextSemiBold
                        text={'Plan Price'}
                        textStyle={[
                          Fonts.poppinSemiBold16,
                          Gutters.smallTMargin,
                          {color: Colors.black_232C28},
                        ]}
                      />
                      <TextSemiBold
                        text={`NZ$${
                          activeSubscriptionPlan?.monthly_plan?._id ==
                          userData?.subscription?.plan
                            ? activeSubscriptionPlan?.monthly_plan?.amount ??
                              '0'
                            : activeSubscriptionPlan?.yearly_plan?.amount ?? '0'
                        }`}
                        textStyle={[
                          Fonts.poppinMed16,
                          {color: Colors.dark_gray_676C6A},
                        ]}
                      />
                    </View>
                  )}
                  {activeSubscriptionPlan?.monthly_plan?._id ==
                    userData?.subscription?.plan && (
                    <View>
                      <TextSemiBold
                        text={'Renewal Amount'}
                        textStyle={[
                          Fonts.poppinSemiBold16,
                          Gutters.smallTMargin,
                          {color: Colors.black_232C28},
                        ]}
                      />
                      <TextSemiBold
                        text={`NZ$${
                          activeSubscriptionPlan?.monthly_plan?._id ==
                          userData?.subscription?.plan
                            ? activeSubscriptionPlan?.monthly_plan?.amount ??
                              '0'
                            : activeSubscriptionPlan?.yearly_plan?.amount ?? '0'
                        }`}
                        textStyle={[
                          Fonts.poppinMed16,
                          {color: Colors.dark_gray_676C6A},
                        ]}
                      />
                    </View>
                  )}
                  <View>
                    <TextSemiBold
                      text={'Plan Duration'}
                      textStyle={[
                        Fonts.poppinSemiBold16,
                        Gutters.smallTMargin,
                        {color: Colors.black_232C28},
                      ]}
                    />
                    <TextSemiBold
                      text={
                        activeSubscriptionPlan?.monthly_plan?._id ==
                        userData?.subscription?.plan
                          ? 'Monthly'
                          : 'Yearly'
                      }
                      textStyle={[
                        Fonts.poppinMed16,
                        {color: Colors.dark_gray_676C6A},
                      ]}
                    />
                  </View>
                </View>
              )}
              <View>
                <TextSemiBold
                  text={'Available features & listings'}
                  textStyle={[
                    Fonts.poppinSemiBold20,
                    Gutters.smallTMargin,
                    {color: Colors.black_232C28},
                  ]}
                />
              </View>
              <View style={[Layout.row, Layout.justifyContentBetween]}>
                <View>
                  <TextSemiBold
                    text={'iChat'}
                    textStyle={[
                      Fonts.poppinSemiBold16,
                      Gutters.smallTMargin,
                      {color: Colors.black_232C28},
                    ]}
                  />
                  <TextSemiBold
                    text={
                      userData?.subscription?.allow_ichat
                        ? 'Allowed'
                        : 'Not Allowed'
                    }
                    textStyle={[
                      Fonts.poppinMed16,
                      {color: Colors.dark_gray_676C6A},
                    ]}
                  />
                </View>
                <View style={{width: '50%'}}>
                  <TextSemiBold
                    text={'iRate'}
                    textStyle={[
                      Fonts.poppinSemiBold16,
                      Gutters.smallTMargin,
                      {color: Colors.black_232C28},
                    ]}
                  />
                  <TextSemiBold
                    text={
                      userData?.subscription?.allow_irate
                        ? 'Allowed'
                        : 'Not Allowed'
                    }
                    textStyle={[
                      Fonts.poppinMed16,
                      {color: Colors.dark_gray_676C6A},
                    ]}
                  />
                </View>
              </View>
              <View>
                <TextSemiBold
                  text={t('common:motorcentral_data_import')}
                  textStyle={[
                    Fonts.poppinSemiBold16,
                    Gutters.smallTMargin,
                    {color: Colors.black_232C28},
                  ]}
                />
                <TextSemiBold
                  text={
                    userData?.subscription?.allow_motorcentral_import
                      ? 'Allowed'
                      : 'Not Allowed'
                  }
                  textStyle={[
                    Fonts.poppinMed16,
                    {color: Colors.dark_gray_676C6A},
                  ]}
                />
              </View>

              <View>
                <TextSemiBold
                  text={'Unlimited Selling'}
                  textStyle={[
                    Fonts.poppinSemiBold16,
                    Gutters.smallTMargin,
                    {color: Colors.black_232C28},
                  ]}
                />
                <TextSemiBold
                  text={
                    userData?.subscription?.unlimited_selling ||
                    userData?.subscription?.unlimited_property_selling ||
                    userData?.subscription?.unlimited_vehicle_selling ||
                    userData?.subscription?.unlimited_general_selling
                      ? 'Yes'
                      : 'No'
                  }
                  textStyle={[
                    Fonts.poppinMed16,
                    {color: Colors.dark_gray_676C6A},
                  ]}
                />
              </View>

              {!userData?.subscription?.unlimited_selling && (
                <View>
                  <TextSemiBold
                    text={'Automotive/Motors'}
                    textStyle={[
                      Fonts.poppinSemiBold16,
                      Gutters.smallTMargin,
                      {color: Colors.black_232C28},
                    ]}
                  />
                  {(userData?.subscription?.unlimited_vehicle_selling && (
                    <TextSemiBold
                      text="Unlimited"
                      textStyle={[
                        Fonts.poppinMed16,
                        {color: Colors.dark_gray_676C6A},
                      ]}
                    />
                  )) || (
                    <TextSemiBold
                      text={`Total Allowed: ${
                        userData?.subscription?.no_of_sells_automotive || 0
                      }, Remaining: ${
                        userData?.subscription
                          ?.remaining_no_of_sells_automotive || 0
                      }`}
                      textStyle={[
                        Fonts.poppinMed16,
                        {color: Colors.dark_gray_676C6A},
                      ]}
                    />
                  )}

                  <TextSemiBold
                    text={'General items'}
                    textStyle={[
                      Fonts.poppinSemiBold16,
                      Gutters.smallTMargin,
                      {color: Colors.black_232C28},
                    ]}
                  />

                  {(userData?.subscription?.unlimited_general_selling && (
                    <TextSemiBold
                      text="Unlimited"
                      textStyle={[
                        Fonts.poppinMed16,
                        {color: Colors.dark_gray_676C6A},
                      ]}
                    />
                  )) || (
                    <TextSemiBold
                      text={`Total Allowed: ${
                        userData?.subscription?.no_of_sells_other || 0
                      }, Remaining: ${
                        userData?.subscription?.remaining_no_of_sells_other || 0
                      }`}
                      textStyle={[
                        Fonts.poppinMed16,
                        {color: Colors.dark_gray_676C6A},
                      ]}
                    />
                  )}

                  <TextSemiBold
                    text={'Property'}
                    textStyle={[
                      Fonts.poppinSemiBold16,
                      Gutters.smallTMargin,
                      {color: Colors.black_232C28},
                    ]}
                  />

                  {(userData?.subscription?.unlimited_property_selling && (
                    <TextSemiBold
                      text="Unlimited"
                      textStyle={[
                        Fonts.poppinMed16,
                        {color: Colors.dark_gray_676C6A},
                      ]}
                    />
                  )) || (
                    <TextSemiBold
                      text={`Total Allowed: ${
                        userData?.subscription?.no_of_sells_property || 0
                      }, Remaining: ${
                        userData?.subscription
                          ?.remaining_no_of_sells_property || 0
                      }`}
                      textStyle={[
                        Fonts.poppinMed16,
                        {color: Colors.dark_gray_676C6A},
                      ]}
                    />
                  )}
                </View>
              )}
            </View>
          </ScrollView>
        </CustomBottomSheet>
        <CustomLoading
          isLoading={
            isLoading ||
            isLoadingPlans ||
            (subscription_plans.length < 1 && isFetching) ||
            isLoadingChange
          }
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Subscription;
