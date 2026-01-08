import React, {memo, useEffect, useState} from 'react';
import {
  FlatList,
  Keyboard,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  CustomBottomSheet,
  CustomButton,
  CustomInput,
  CustomLoading,
  TextMedium,
  TextRegular,
  TextSemiBold,
} from '../../../components';
import CustomGradientButton from '../../../components/CustomGradientButton';
import {useTheme} from '../../../hooks';
import {
  setSignUpUser,
  setStep,
  setSubscriptionFlags,
  setSubscriptionPlan,
} from '../../../store/SignUp';
import {sHight} from '../../../utils/ScreenDimentions';
import {CreateAccountSchema} from '../../../utils/Validation';
import {clearTransactionIOS, isIosStorekit2, useIAP} from 'react-native-iap';

import {
  useLazyGetSubscriptionPlansQuery,
  useSignUpBasicMutation,
  useSignUpBasicUpdateMutation,
} from '../../../services/auth/signupApi';
import SemiBoldText from '../../../components/SemiBoldText';
import {toastDangerMessage} from '../../../utils/helpers';
import SubscriptionCardCreateAccount from './SubscriptionCardCreateAccount';
import i18next from 'i18next';
import SubscriptionPointsRender from '../../../components/SubscriptionPointsRender';

type Props = {
  navigation: any;
  setUserImage?: CallableFunction;
  scrollToTop?: CallableFunction;
  scrollToEnd?: CallableFunction;
};

const CreateAccount = ({
  navigation,
  setUserImage,
  scrollToTop,
  scrollToEnd,
}: Props) => {
  const {Colors, Fonts, Layout, Gutters} = useTheme();
  const {userVerified, signUpBasic, subscription_plans, subscription} =
    useSelector(state => state.signup);
  const {firstStep, isFirstStepErr, isNumberVerified, isEmailVerified} =
    useSelector(state => state.signup.step);

  const [BasicSignup, {isLoading}] = useSignUpBasicMutation();
  const [BasicSignupUpdate, {}] = useSignUpBasicUpdateMutation();
  const [subscriptionSelectedSheet, setSubscriptionSelectedSheet] = useState(
    {},
  );
  const [errors, setErrors] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
    isShow: '',
  });

  const [reLoad, setReLoad] = useState(0);
  const [createAccountInterface, setCreateAccountInterface] = useState({
    firstName: '',
    lastName: '',
    email: '',
    userName: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
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
  const dispatch = useDispatch();
  const [getSubscriptionPlans] = useLazyGetSubscriptionPlansQuery();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [selectedPlanType, setSelectedPlanType] = useState(0);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [SubscriptionTime, setSubscriptionTime] = useState(0);
  const dispacth = useDispatch();
  console.log('>>errors ', errors);

  const formData = {
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
  };
  const hasValue = (data: typeof formData) => {
    return Object.values(data).some(value => value.trim() !== '');
  };
  useEffect(() => {
    if (errors.isShow) {
      if (hasValue(errors)) {
        scrollToTop();

        toastDangerMessage('Plese fill all mandatory fields');
      }
    }
  }, [errors]);
  useEffect(() => {
    getPlansAPIcall();
    setCreateAccountInterface({
      firstName: firstStep?.first_name || '',
      lastName: firstStep?.last_name || '',
      email: firstStep?.email || '',
      userName: firstStep?.username || '',
      phone: firstStep?.phone_number || '',
      password: firstStep?.password || '',
      confirmPassword: firstStep?.confirm_password || '',
    });
  }, []);
  useEffect(() => {
    const checkCurrentPurchase = async () => {
      try {
        if (
          (isIosStorekit2() && currentPurchase?.transactionId) ||
          currentPurchase?.transactionReceipt
        ) {
          await finishTransaction({
            purchase: currentPurchase,
            isConsumable: true,
          });
        }
      } catch (error) {
        console.log(error, 'error in finish transactiuon');
      }
    };

    checkCurrentPurchase();
  }, [currentPurchase, finishTransaction]);

  useEffect(() => {
    setReLoad(reLoad + 1);
  }, [subscription_plans]);

  const getPlansAPIcall = () => {
    getSubscriptionPlans('');
  };

  // console.log('>>>subscription_plans 00 ', subscription_plans);

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     // The screen is focused
  //     // Call any action
  //     console.log('>>>firstStep ', firstStep);

  //     setCreateAccountInterface({
  //       firstName: firstStep?.firstName,
  //       lastName: firstStep?.lastName,
  //       email: firstStep?.email,
  //       userName: firstStep?.userName,
  //       phone: firstStep?.phone,
  //       password: firstStep?.password,
  //       confirmPassword: firstStep?.confirmPassword,
  //     });
  //   });

  //   // Return the function to unsubscribe from the event so it gets removed on unmount
  //   return unsubscribe;
  // }, [navigation]);

  const createUserApi = () => {
    // emailRegex.test(email)

    let errorsTemp = errors;
    const isEmptyValue = (value: any): boolean => {
      return value === null || value === undefined || value.trim?.() === '';
    };
    if (isEmptyValue(firstStep.first_name)) {
      errorsTemp = {...errorsTemp, first_name: 'First Name is required'};
    }
    if (isEmptyValue(firstStep.last_name)) {
      errorsTemp = {...errorsTemp, last_name: 'Last Name is required'};
    }
    if (isEmptyValue(firstStep.email)) {
      errorsTemp = {...errorsTemp, email: 'Email is required'};
    } else if (!emailRegex.test(firstStep.email)) {
      errorsTemp = {...errorsTemp, email: 'Invalid email format'};
    }
    if (isEmptyValue(firstStep.phone_number)) {
      errorsTemp = {...errorsTemp, phone_number: 'Contact Number is required'};
    }
    // if (Platform.OS == 'android') {
    if (isEmptyValue(firstStep.password)) {
      errorsTemp = {...errorsTemp, password: 'Password is required'};
    } else if (firstStep.password.length < 8) {
      errorsTemp = {
        ...errorsTemp,
        password: 'Password must be at least 8 characters',
      };
    }

    if (isEmptyValue(firstStep.confirm_password)) {
      errorsTemp = {
        ...errorsTemp,
        confirm_password: 'Confirm Password is required',
      };
    } else if (firstStep.confirm_password !== firstStep.password) {
      errorsTemp = {
        ...errorsTemp,
        confirm_password: 'Password and Confirm Password do not match',
      };
    }
    // }

    if (hasValue(errorsTemp)) {
    } else if (Object.keys(subscription).length === 0) {
      toastDangerMessage('Please select a plan!');
    } else {
      const data: any = {
        email: firstStep.email,
        first_name: firstStep.first_name,
        last_name: firstStep.last_name,
        phone_number: firstStep.phone_number,
        password: firstStep.password,
        // username: firstStep.userName,
        confirm_password: firstStep.confirm_password,
        platform: Platform.OS,
        // status: 'pending',
      };
      BasicSignup(data).then((res: any) => {
        if (res?.data?.message) {
          dispacth(
            setStep({firstStep: data, selectedTab: 2, isFirstStepErr: false}),
          );
        }
      });
    }

    if (hasValue(errorsTemp)) {
      setErrors({...errorsTemp, isShow: 'y'});
    } else {
      setErrors({...errorsTemp, isShow: ''});
    }
    // dispatch(setLoading(true));
    // if (isNumberVerified) {
    //   dispatch(
    //     setStep({firstStep: data, selectedTab: 2, isFirstStepErr: false}),
    //   );
    // BasicSignupUpdate({body: data, id: signUpBasic?.user_id}).then(
    //   (res: any) => {
    //     if (res?.data?.message) {
    //       dispatch(
    //         setStep({firstStep: data, selectedTab: 2, isFirstStepErr: false}),
    //       );
    //     }
    //   },
    // );
    // }
    // else if (signUpBasic?.user_id && !isNumberVerified) {
    //   BasicSignupUpdate({body: data, id: signUpBasic?.user_id}).then(
    //     (res: any) => {
    //       if (res?.data?.message) {
    //         dispatch(setStep({firstStep: data, isFirstStepErr: false}));
    //         navigation.navigate('OTPContainer', {
    //           email: v.email,
    //           phone: v.phone,
    //         });
    //       }
    //     },
    //   );
    // }
    // else {
    // BasicSignup(Platform.OS == 'android' ? data : dataIOS).then((res: any) => {
    //   if (res?.data?.message) {
    //     dispatch(setStep({firstStep: data, isFirstStepErr: false}));
    //     dispatch(setSignUpUser({user_id: res?.data.user_id}));
    //     navigation.navigate('OTPContainer', {
    //       email: v.email,
    //       phone: v.phone,
    //     });
    //   } else {
    //     toastDangerMessage(res?.error?.data?.message ?? 'Something went rong!');
    //     // console.log('image is getting null');
    //     // setUserImage(null);
    //   }
    // });
    // }
  };

  return (
    <View style={[Gutters.smallTMargin]}>
      <>
        <CustomInput
          headingText={t('common:first_name')}
          inputProps={{
            onChangeText: text => {
              if (isFirstStepErr === false && !text) {
                dispatch(setStep({isFirstStepErr: true}));
              }
              dispatch(setStep({firstStep: {...firstStep, first_name: text}}));
              errors.first_name &&
                setErrors({...errors, first_name: '', isShow: ''});
            },
            // onBlur: text => {
            //   if (isFirstStepErr === false && !text) {
            //     dispatch(setStep({isFirstStepErr: true}));
            //   }
            //   dispatch(setStep({firstStep: {...firstStep, first_name: text}}));
            // },
            value: firstStep.first_name,
          }}
          inputStyle={[Fonts.poppinMed18]}
          headingTextStyle={[Fonts.poppinMed18, {color: Colors.gray_C9C9C9}]}
          backgroundStyle={[
            {
              borderWidth: 2,
              borderColor: errors.first_name ? Colors.red : Colors.gray_C9C9C9,
            },
          ]}
          placeholder={t('common:email_phone')}
          showPassword={false}
        />
        {errors.first_name && (
          <TextRegular
            text={errors.first_name}
            textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
          />
        )}
        <View style={[Gutters.smallTMargin]}>
          <CustomInput
            headingText={t('common:last_name')}
            inputProps={{
              onChangeText: text => {
                if (isFirstStepErr === false && !text) {
                  dispatch(setStep({isFirstStepErr: true}));
                }
                dispatch(setStep({firstStep: {...firstStep, last_name: text}}));
                errors.last_name &&
                  setErrors({...errors, last_name: '', isShow: ''});
              },
              // onBlur: text => {
              //   if (isFirstStepErr === false && !text) {
              //     dispatch(setStep({isFirstStepErr: true}));
              //   }
              //   dispatch(setStep({firstStep: {...firstStep, last_name: text}}));
              // },
              value: firstStep.last_name,
            }}
            inputStyle={[Fonts.poppinMed18]}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.gray_C9C9C9}]}
            backgroundStyle={[
              {
                borderWidth: 2,
                borderColor: errors.last_name ? Colors.red : Colors.gray_C9C9C9,
              },
            ]}
            placeholder={t('common:email_phone')}
            showPassword={false}
          />
          {errors.last_name && (
            <TextRegular
              text={errors.last_name}
              textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
            />
          )}
        </View>
        <View style={[Gutters.smallTMargin]}>
          <CustomInput
            // editable={
            //   isEmailVerified ? false : Platform.OS == 'ios' ? false : true
            // }
            headingText={t('common:email_address')}
            keyboardType="email-address"
            inputProps={{
              onChangeText: text => {
                if (isFirstStepErr === false && !text) {
                  dispatch(setStep({isFirstStepErr: true}));
                }
                dispatch(setStep({firstStep: {...firstStep, email: text}}));
                errors.email && setErrors({...errors, email: '', isShow: ''});
              },
              // onBlur: text => {
              //   if (isFirstStepErr === false && !text) {
              //     dispatch(setStep({isFirstStepErr: true}));
              //   }
              //   dispatch(setStep({firstStep: {...firstStep, email: text}}));
              // },
              value: firstStep.email,
            }}
            inputStyle={[Fonts.poppinMed18]}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.gray_C9C9C9}]}
            backgroundStyle={[
              {
                borderWidth: 2,
                borderColor: errors.email ? Colors.red : Colors.gray_C9C9C9,
              },
            ]}
            placeholder={t('common:email_phone')}
            showPassword={false}
          />
          {errors.email && (
            <TextRegular
              text={errors.email}
              textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
            />
          )}
        </View>
        {/* <View style={[Gutters.smallTMargin]}>
                <CustomInput
                  headingText={t('common:user_name')}
                  inputProps={{
                    onChangeText: text => {
                      if (isFirstStepErr === false && !text) {
                        dispatch(setStep({isFirstStepErr: true}));
                      }
                      handleChange('userName')(text);
                      dispatch(
                        setStep({firstStep: {...firstStep, username: text}}),
                      );
                    },
                    onBlur: handleBlur('userName'),
                    value: userName,
                  }}
                  inputStyle={[Fonts.poppinMed18]}
                  headingTextStyle={[
                    Fonts.poppinMed18,
                    {color: Colors.gray_C9C9C9},
                  ]}
                  backgroundStyle={[
                    {
                      borderWidth: 2,
                      borderColor: errors.userName
                        ? Colors.red
                        : Colors.gray_C9C9C9,
                    },
                  ]}
                  placeholder={t('common:email_phone')}
                  showPassword={false}
                  icon={userVerified}
                />
                {touched.userName && errors.userName && (
                  <TextRegular
                    text={errors.userName}
                    textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                  />
                )}
              </View> */}
        <View style={[Gutters.smallTMargin]}>
          <CustomInput
            headingText={t('common:enter_phone')}
            keyboardType={'phone-pad'}
            inputProps={{
              onChangeText: text => {
                // if (text !== firstStep.phone_number) {
                //   dispatch(setStep({isNumberVerified: false}));
                // }
                if (isFirstStepErr === false && !text) {
                  dispatch(setStep({isFirstStepErr: true}));
                }
                dispatch(
                  setStep({
                    firstStep: {...firstStep, phone_number: text},
                  }),
                );

                errors.phone_number &&
                  setErrors({...errors, phone_number: '', isShow: ''});
              },
              // onBlur: text => {
              //   // if (text !== firstStep.phone_number) {
              //   //   dispatch(setStep({isNumberVerified: false}));
              //   // }
              //   if (isFirstStepErr === false && !text) {
              //     dispatch(setStep({isFirstStepErr: true}));
              //   }
              //   dispatch(
              //     setStep({
              //       firstStep: {...firstStep, phone_number: text},
              //     }),
              //   );
              // },
              value: firstStep.phone_number,
            }}
            inputStyle={[Fonts.poppinMed18]}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.gray_C9C9C9}]}
            backgroundStyle={[
              {
                borderWidth: 2,
                borderColor: errors.phone_number
                  ? Colors.red
                  : Colors.gray_C9C9C9,
              },
            ]}
            icon={userVerified}
            placeholder={t('common:email_phone')}
            showPassword={false}
          />

          {errors.phone_number && (
            <TextRegular
              text={errors.phone_number}
              textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
            />
          )}
          <TextRegular
            text={'Note:+64xxxxxxxxx/0xxxxxxxxx'}
            textStyle={[
              Gutters.littleTMargin,
              {
                color: Colors.white,
                marginLeft: sHight(1),
              },
            ]}
          />
        </View>
        {/* {Platform.OS == 'android' && ( */}
        <View style={[Gutters.smallTMargin]}>
          <CustomInput
            headingText={t('common:password')}
            inputProps={{
              onChangeText: text => {
                if (isFirstStepErr === false && !text) {
                  dispatch(setStep({isFirstStepErr: true}));
                }
                dispatch(setStep({firstStep: {...firstStep, password: text}}));

                errors.password &&
                  setErrors({...errors, password: '', isShow: ''});
              },
              // onBlur: text => {
              //   if (isFirstStepErr === false && !text) {
              //     dispatch(setStep({isFirstStepErr: true}));
              //   }
              //   dispatch(
              //     setStep({firstStep: {...firstStep, password: text}}),
              //   );
              // },
              value: firstStep.password,
            }}
            inputStyle={[Fonts.poppinMed18]}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.gray_C9C9C9}]}
            backgroundStyle={[
              {
                borderWidth: 2,
                borderColor: errors.password ? Colors.red : Colors.gray_C9C9C9,
              },
            ]}
            placeholder={t('common:email_phone')}
            showPassword={true}
          />
          {errors.password && (
            <TextRegular
              text={errors.password}
              textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
            />
          )}
        </View>
        {/* {Platform.OS == 'android' && ( */}
        <View style={[Gutters.smallTMargin]}>
          <CustomInput
            headingText={t('common:confirm_password_text')}
            inputProps={{
              onChangeText: text => {
                if (isFirstStepErr === false && !text) {
                  dispatch(setStep({isFirstStepErr: true}));
                }
                dispatch(
                  setStep({
                    firstStep: {...firstStep, confirm_password: text},
                  }),
                );
                errors.confirm_password &&
                  setErrors({...errors, confirm_password: '', isShow: ''});
              },
              // onBlur: text => {
              //   if (isFirstStepErr === false && !text) {
              //     dispatch(setStep({isFirstStepErr: true}));
              //   }
              //   dispatch(
              //     setStep({
              //       firstStep: {...firstStep, confirm_password: text},
              //     }),
              //   );
              // },
              value: firstStep.confirm_password,
            }}
            inputStyle={[Fonts.poppinMed18]}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.gray_C9C9C9}]}
            backgroundStyle={[
              {
                borderWidth: 2,
                borderColor: errors.confirm_password
                  ? Colors.red
                  : Colors.gray_C9C9C9,
              },
            ]}
            placeholder={t('common:email_phone')}
            showPassword={true}
          />
          {errors.confirm_password && (
            <TextRegular
              text={errors.confirm_password}
              textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
            />
          )}
        </View>

        <SemiBoldText
          text={t('common:monthly_subscription')}
          textStyle={[
            Gutters.mediumTMargin,
            Fonts.poppinSemiBold32,
            // Gutters.tinyBMargin,
            Fonts.textCenter,
            {color: Colors.white},
          ]}
        />

        <View style={[Layout.fill]}>
          <FlatList
            keyboardShouldPersistTaps={'always'}
            extraData={subscription_plans || subscription}
            data={subscription_plans}
            renderItem={({item, index}) => {
              const {name, description, free_plan, category} = item;
              // console.log(item);
              let selectedPlanTypeTemp =
                index === subscription?.index && subscription?.selected === 1
                  ? 1
                  : 0;
              return (
                <View style={[Gutters.smallTMargin]}>
                  <SubscriptionCardCreateAccount
                    selectedPlanType={selectedPlanTypeTemp}
                    title={name}
                    subTitle={''}
                    category={category}
                    price={
                      category == 'free'
                        ? free_plan?.amount
                        : selectedPlanTypeTemp == 0
                        ? item?.monthly_plan?.amount
                        : item?.yearly_plan?.amount
                    }
                    monthly_price={
                      category == 'free'
                        ? free_plan?.amount
                        : item?.monthly_plan?.amount
                    }
                    yearly_price={
                      category == 'free'
                        ? free_plan?.amount
                        : item?.yearly_plan?.amount
                    }
                    index={index}
                    interval={
                      selectedPlanTypeTemp == 0
                        ? item?.monthly_plan?.interval
                        : item?.yearly_plan?.interval
                    }
                    plan_id={
                      category == 'free'
                        ? free_plan?._id
                        : selectedPlanTypeTemp == 0
                        ? item?.monthly_plan?._id
                        : item?.yearly_plan?._id
                    }
                    plan={item}
                    selected={subscription?.index === index}
                    description={description}
                    setSelected={plan => setSubscriptionSelectedSheet(plan)}
                    showCardDetail={flag => {
                      setSubscriptionTime(0);
                      setSelectedPlanType(0);
                      setShowBottomSheet(flag);
                    }}
                  />
                  {subscription_plans?.length == index + 1 && (
                    <View style={{height: 30}} />
                  )}
                </View>
              );
            }}
            ListEmptyComponent={() => {
              return (
                <View style={[Gutters.smallTMargin]}>
                  <CustomGradientButton
                    onPress={() => {
                      getPlansAPIcall();
                    }}
                    text={'Try Again'}
                    textStyle={[Fonts.poppinBold24]}
                  />
                </View>
              );
            }}
          />
        </View>

        <View style={[Gutters.regularVMargin]}>
          <CustomGradientButton
            onPress={() => {
              createUserApi();
            }}
            text={t('common:continue')}
            textStyle={[Fonts.poppinBold24]}
          />
          <View style={[Layout.row, Gutters.smallVMargin, Layout.center]}>
            <TextRegular
              textStyle={[
                Fonts.poppinReg18,
                Layout.textTransfromNone,
                {color: Colors.gray_C9C9C9},
              ]}
              text={t('common:have_account')}
            />
            <TouchableOpacity
              style={[Gutters.littleLMargin]}
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate('EmailContainer');
              }}>
              <SemiBoldText
                textStyle={[
                  Fonts.poppinSemiBold20,
                  Layout.textTransform,
                  {
                    color: Colors.primary,
                  },
                ]}
                text={t('common:login')}
              />
            </TouchableOpacity>
          </View>
        </View>
      </>

      <CustomBottomSheet
        setShowBottomSheet={setShowBottomSheet}
        visible={showBottomSheet}
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
              text={subscriptionSelectedSheet?.title}
              textStyle={[
                Fonts.poppinSemiBold38,
                Gutters.smallTMargin,
                {color: Colors.gray_161C24},
              ]}
            />
            <TextRegular
              text={subscriptionSelectedSheet?.description}
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
                subscriptionSelectedSheet?.plan?.category?.toLowerCase() ==
                'free'
                  ? subscriptionSelectedSheet?.plan?.free_plan?.amount || '0'
                  : SubscriptionTime == 0
                  ? subscriptionSelectedSheet?.monthly_price
                  : subscriptionSelectedSheet?.yearly_price
              }`}
              textStyle={[
                Fonts.poppinSemiBold56,
                Gutters.littleVMargin,
                {color: Colors.gray_161C24},
              ]}
            />
            {subscriptionSelectedSheet?.category !== 'free' && (
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
                    backgroundColor: Colors.light_grayF4F4F4,
                  },
                ]}>
                <>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setSubscriptionTime(0);
                      setSelectedPlanType(0);
                    }}
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
                    onPress={() => {
                      setSubscriptionTime(1);
                      setSelectedPlanType(1);
                    }}
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
              plan={subscriptionSelectedSheet?.plan}
              SubscriptionTime={SubscriptionTime}
            />
            <CustomButton
              text={t('common:buy_subscription')}
              onPress={() => {
                if (subscriptionSelectedSheet?.plan?.category === 'free') {
                  dispatch(setSubscriptionFlags({cardViewFlag: true}));
                  dispatch(setSubscriptionFlags({subscriptionPlanFlag: false}));
                  setShowBottomSheet(false);
                  // return;
                }
                dispacth(
                  setSubscriptionPlan({
                    ...subscriptionSelectedSheet,
                    selected: SubscriptionTime,
                  }),
                );
                dispatch(setSubscriptionFlags({cardViewFlag: true}));
                dispatch(setSubscriptionFlags({subscriptionPlanFlag: false}));
                setShowBottomSheet(false);
                Keyboard.dismiss();
                scrollToEnd();
              }}
              backgroundColor={Colors.primary}
              btnStyle={[Gutters.tinyBMargin, {width: '90%'}]}
              textStyle={[Fonts.poppinSemiBold20]}
              textColor={Colors.white}
            />
          </View>
        </ScrollView>
      </CustomBottomSheet>
      <CustomLoading isLoading={isLoading} />
    </View>
  );
};

export default CreateAccount;
