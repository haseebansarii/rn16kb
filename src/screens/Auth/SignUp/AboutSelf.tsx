import React, {useEffect, useRef, useState} from 'react';
import {Alert, Platform, Text, TouchableOpacity, View} from 'react-native';
import {
  CustomBottomSheet,
  CustomButton,
  CustomCheckBox,
  CustomDatePicker,
  CustomDropDown,
  CustomGooglePlaces,
  CustomInput,
  CustomLoading,
  TextBold,
  TextMedium,
  TextRegular,
  TextSemiBold,
} from '../../../components';
import {genderData} from '../../../utils/dummyData';

import {Formik} from 'formik';
import i18next from 'i18next';
import SemiBoldText from '../../../components/SemiBoldText';
import {useTheme} from '../../../hooks';
import {sHight, sWidth} from '../../../utils/ScreenDimentions';
import {UserPersonalDetailSchema} from '../../../utils/Validation';

import moment from 'moment';
import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  types,
} from 'react-native-document-picker';
import {useDispatch, useSelector} from 'react-redux';
import CustomGradientButton from '../../../components/CustomGradientButton';
import {useUploadImagesMutation} from '../../../services/submitForms/forms';
import {
  clearSignUpData,
  setClearSignUpBasic,
  setCongratulation,
  setLocationDropDownSelected,
  setSignUpUser,
  setStep,
  setSubscriptionFlags,
  storeSubscriptionPlans,
} from '../../../store/SignUp';
import {
  useLazyGetCountryNameQuery,
  useLazyGetSubscriptionPlansQuery,
  useSignUpCompleteMutation,
} from '../../../services/auth/signupApi';
import {GOOGLE_MAP_API_KEY} from '../../../config';
import {verifyDriverLicence} from '../../../services/carJam/carJamApis';
import {toastDangerMessage, toastSuccessMessage} from '../../../utils/helpers';
import {ImageSelectFromCamera} from '../../../utils/ImageSelection';
import {RootState} from '../../../store/store';
import CreditCardViewSignUp, {
  CreditCardViewSignUpRef,
} from './CreditCardViewSignUp';
import {StackActions} from '@react-navigation/native';
import {useIAP} from 'react-native-iap';

type Props = {
  navigation: any;
};

const AboutSelf = ({navigation}: Props) => {
  const {Gutters, Colors, Layout, Fonts, Images} = useTheme();
  const [selected, setSelectedGender] = useState('');
  const dispatch = useDispatch();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [error, setErrors] = useState({
    passport: false,
    driver_licence_no: false,
    card_version_no: false,
    addres: '',
  });
  const [selectedCheckBoxTerms, setSelectedCheckBoxTerms] = useState(false);

  const [nameDoc, setNameDoc] = useState('');
  const [picturUploadObj, setPicturUploadObj] = useState({
    sideFront: false,
    showSheet: false,
    fromCamera: false,
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

  const [uploadPicture, setUploadPicture] = React.useState<
    Array<DocumentPickerResponse> | DirectoryPickerResponse | undefined | null
  >([{}, {}]);
  const [userPersonalDetail, setUserPersonalDetail] = useState({
    // date_of_birth: '',
    // gender: '',
    // address: '',
    // passport_number: '',
    // nz_driver_license: null,
    status: 'pending',
    driver_licence_no: '',
    card_version_no: '',
    token: {},
    is_licence_verified: false,
    country: 'New Zealand',
    card_name: '',
  });

  const [userDataToApi, setUserDataToApi] = useState({});
  const dispacth = useDispatch();
  const {signUpBasic, subscription, congratulation} = useSelector(
    state => state.signup,
  );
  const [uploadDocum] = useUploadImagesMutation();
  const [getCountryName] = useLazyGetCountryNameQuery();
  const [getSubscriptionPlans, {}] = useLazyGetSubscriptionPlansQuery();
  const {isSecondStepErr, firstStep, stripeCard} = useSelector(
    state => state.signup.step,
  );

  const [signUpComplete, {isLoading: isLoadingSignup}] =
    useSignUpCompleteMutation();
  const creditCardRef = useRef<CreditCardViewSignUpRef>(null);
  const {cardViewFlag, addCardFlag, stripeViewFlag, subscriptionPlanFlag} =
    useSelector((state: RootState) => state.signup.subscriptionFlags);

  useEffect(() => {
    getSubscriptionPlans('');
    // setSelectedDate(signUpBasic?.date_of_birth || '');
    // setSelectedGender(signUpBasic?.gender || '');
    // setUploadPicture(signUpBasic?.uploadPicture || [{}, {}]);
    setUserPersonalDetail({
      // date_of_birth: signUpBasic?.date_of_birth || '',
      // gender: signUpBasic?.gender || '',
      // address: signUpBasic?.address || '',
      // passport_number: signUpBasic?.passport_number || '',
      // nz_driver_license: signUpBasic?.nz_driver_license || null,
      driver_licence_no: signUpBasic?.driver_licence_no || null,
      card_version_no: signUpBasic?.card_version_no || null,
      is_licence_verified: signUpBasic?.is_licence_verified || false,
      country: signUpBasic?.country || null,
    });
  }, []);
  useEffect(() => {
    if (signUpBasic?.token) {
      createUserApiCall({
        ...userDataToApi,
        ...signUpBasic,
        setIsLoading: setIsLoading,
      });
    }
  }, [signUpBasic?.token]);

  const uploadDocument = () => {
    DocumentPicker.pick({
      type: [types.pdf],
    })
      .then(res => {
        let docName =
          res[0]?.uri?.split('/').pop().length > 12
            ? res[0]?.uri?.split('/').pop()?.split('.')[0]?.slice(0, 15) +
              '.pdf'
            : res[0]?.uri?.split('/').pop();
        // setNameDoc(res[0]?.name);
        if (picturUploadObj.sideFront) {
          let data = [...uploadPicture];
          data[0] = {
            name: res[0]?.name,
            uri: res[0]?.uri,
            type: res[0].type,
            // fileName: res[0]?.name,
          };
          setUploadPicture(data);
        } else {
          let data = [...uploadPicture];
          data[1] = {
            name: res[0]?.name,
            uri: res[0]?.uri,
            type: res[0].type,
            // fileName: res[0]?.name,
          };
          setUploadPicture(data);
        }
        setErrors({
          ...error,
        });
      })
      .catch(err => console.warn('cancelled', err));
  };
  const takeImage = async () => {
    let object = {
      w: 300,
      h: 400,
      cropping: false,
    };

    let res = await ImageSelectFromCamera({object: object});

    if (res) {
      let imgObj = {
        // type: res?.mime,
        // uri: res?.sourceURL || res?.path,
        // name: getFileName(res?.path) || res?.mime,
        name: res?.path?.split('/').pop(),
        type: res?.mime,
        uri: res?.path,
      };
      if (picturUploadObj.sideFront) {
        let data = [...uploadPicture];
        data[0] = imgObj;
        setUploadPicture(data);
      } else {
        let data = [...uploadPicture];
        data[1] = imgObj;
        setUploadPicture(data);
      }
      setErrors({
        ...error,
      });
    }
  };
  const getFileName = filePath => {
    // Split the file path by '/' and get the last element which is the file name
    const parts = filePath.split('/');
    return parts[parts.length - 1];
  };
  const onPressChangePlanFunc = plan => {};

  const uploadDoc = async () => {
    const formdata = new FormData();
    let documentRes = [];
    try {
      uploadPicture?.forEach(item => formdata.append('files', item));
      const {
        data: {document},
      }: any = await uploadDocum(formdata);
      documentRes = document;
    } catch (error) {
      setIsLoading(false);
    }
    return documentRes;
  };
  const handleCreateStripeToken = () => {
    let res = false;
    if (creditCardRef.current) {
      res = creditCardRef.current.createStripeToken();
    }
    return res;
  };

  const hasDataAray = obj => {
    return Object.keys(obj).length > 0;
  };

  const checkLicence = async (driverLicenceNo, cardVersionNo) => {
    const response = await verifyDriverLicence(driverLicenceNo, cardVersionNo);

    if (response.status == 200) {
      if (response?.data?.code && response.data?.code == -1) {
        throw new Error(response.data.message);
      } else {
        if (response?.data?.dlvs?.errors?.length > 0) {
          throw new Error(response.data.dlvs.errors[0].innerErrors[0].message);
        } else {
          return {success: true, data: response?.data?.dlvs};
        }
      }
    } else {
      throw new Error('Something went wrong');
    }
  };
  const createUserApiCall = data => {
    setIsLoading(true);
    signUpComplete(data)
      .then(res => {
        // setIsLoading(false);
        // Platform.OS == 'ios' &&
        //   setTimeout(() => {
        //     dispatch(setCongratulation(true));
        //   }, 1000);
        // console.log('response=========', JSON.stringify(res));
        // return;
        // dispacth(setSignUpUser({cong: true}));
        // setShowBottomSheet(false);
      })
      .catch(e => {
        setIsLoading(false);
        toastDangerMessage(e.data.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const submitForm = async v => {
    // if (!v?.driver_licence_no) {
    //   setErrors({
    //     ...error,
    //     driver_licence_no: true,
    //   });
    //   setIsLoading(false);
    //   toastDangerMessage('Licence number is required');
    //   return;
    // }
    // if (v?.driver_licence_no?.length < 8) {
    //   setErrors({
    //     ...error,
    //     driver_licence_no: true,
    //   });
    //   setIsLoading(false);
    //   toastDangerMessage('Licence number should be 8 characters long');
    //   return;
    // }
    // if (!v?.card_version_no) {
    //   setErrors({
    //     ...error,
    //     card_version_no: true,
    //   });
    //   setIsLoading(false);
    //   toastDangerMessage('Card version is required');
    //   return;
    // }
    // if (v?.card_version_no?.length < 3) {
    //   setErrors({
    //     ...error,
    //     card_version_no: true,
    //   });
    //   setIsLoading(false);
    //   toastDangerMessage('Card version should be 3 characters long');
    //   return;
    // }
    if (selectedCheckBoxTerms == false) {
      toastDangerMessage(
        'Please read and agree to the Terms and Conditions to create an account.',
      );
      return;
    }
    setIsLoading(true);

    let data: any = {is_licence_verified: false};

    if (v?.driver_licence_no && v?.card_version_no) {
      try {
        // console.log('>> test 00 ', v?.driver_licence_no, v?.card_version_no);

        let dlvs = await checkLicence(v?.driver_licence_no, v?.card_version_no);

        if (dlvs.success) {
          if (
            dlvs.data.errors.length == 0 &&
            dlvs.data.messages.length == 0 &&
            dlvs.data.DriverLicenceMatchFlag == 1 &&
            dlvs.data.DriverLicenceVersionMatchFlag == 1
          ) {
            data.is_licence_verified = true;
            toastSuccessMessage('Licence verified');
          } else {
            toastDangerMessage('Licence not verified');
          }
          // this.activeTab = 'tab-three';
        } else {
          toastDangerMessage('Licence not verified');
          // return;
          // if (this.feEnvironment === 'dev' || this.feEnvironment === 'localhost') {
          //   this.activeTab = 'tab-three'
          // }
        }
      } catch (error) {
        // setIsLoading(false);
        toastDangerMessage('Licence not verified');
        // toastDangerMessage(error.message);
        // console.log('> error.message > ', error.message);

        // return;
        // if (this.feEnvironment === 'dev' || this.feEnvironment === 'localhost') {
        //   this.activeTab = 'tab-three'
        // }
      }
    }

    let plan_id =
      subscription?.category == 'paid'
        ? subscription?.selected == 0
          ? subscription?.plan?.monthly_plan?._id
          : subscription?.plan?.yearly_plan?._id
        : subscription?.plan?.free_plan?._id;

    // console.log('>>>data 11 ', data);
    // console.log('>>>firstStep 11 ', firstStep);
    // console.log('>>>signUpBasic 11 ', signUpBasic);
    data = {
      ...data,
      ...firstStep,
      ...signUpBasic,
      plan_id: plan_id,
      driver_licence_no: v?.driver_licence_no,
      card_version_no: v?.card_version_no,
      status: 'pending',
      country: 'New Zealand',
    };
    if (subscription?.category === 'paid') {
      setUserDataToApi(data);
      // Wait for the createStripeToken to complete

      setIsLoading(false);
      const result = await creditCardRef?.current.createStripeToken();
      if (result) {
        data = {...data, ...result};
      }
      return;

      // toastDangerMessage('Something went wrong!');
    } else {
      createUserApiCall({...data, setIsLoading: setIsLoading});
    }

    // if (v?.address !== locationDropDownSelected) {
    //   setIsLoading(false);
    //   toastDangerMessage('Please select address from dropdown');
    //   setErrors({
    //     ...error,
    //     address: 'Please select address from dropdown',
    //   });
    //   return;
    // } else
    // if (v?.country == 'New Zealand') {
    //   let uplaodDocRes = [];

    //   const hasObjectWithData = uploadPicture?.some(hasDataAray);

    //   if (uploadPicture && uploadPicture.length > 0 && hasObjectWithData) {
    //     uplaodDocRes = await uploadDoc();
    //   }
    //   console.log('>>> uplaodDocRes ', uplaodDocRes);

    //   // if (uplaodDocRes) {

    //   // } else {
    //   //   toastDangerMessage('Licence Upload error');
    //   // }

    //   if (
    //     // v?.passport_number === '' &&
    //     !v?.card_version_no &&
    //     v?.driver_licence_no
    //   ) {
    //     setErrors({
    //       ...error,
    //       passport: true,
    //     });

    //     setIsLoading(false);
    //     toastDangerMessage('Passport number is required');
    //     return;
    //   }
    //   setErrors({
    //     ...error,
    //     passport: false,
    //     driver_licence_no: false,
    //     card_version_no: false,
    //   });

    //   data = {
    //     ...v,
    //     ...data,
    //     // nz_driver_license: uplaodDocRes || null,
    //     driver_licence_no: v?.driver_licence_no,
    //     card_version_no: v?.card_version_no,
    //     country: v?.country,
    //   };
    //   dispacth(setSignUpUser({...data, uploadPicture: uploadPicture}));

    //   setIsLoading(false);
    //   dispacth(
    //     setStep({
    //       isSecondStepVerified: true,
    //       selectedTab: 3,
    //       isSecondStepErr: false,
    //     }),
    //   );
    // } else {
    //   setErrors({
    //     ...error,
    //     passport: false,
    //     driver_licence_no: false,
    //     card_version_no: false,
    //   });
    //   data = {
    //     ...v,
    //     ...data,
    //     // nz_driver_license: null,
    //     country: v?.country,
    //     driver_licence_no: v?.driver_licence_no,
    //     card_version_no: v?.card_version_no,
    //   };
    //   dispacth(setSignUpUser({...data, uploadPicture: uploadPicture}));
    //   setIsLoading(false);
    //   dispacth(
    //     setStep({
    //       isSecondStepVerified: true,
    //       selectedTab: 3,
    //       isSecondStepErr: false,
    //     }),
    //   );
    // }
  };

  // console.log('>>stripeCard?.length ', stripeCard?.length < 1);

  return (
    <View style={[Layout.fill]}>
      <View style={[Gutters.smallTMargin]}>
        <Formik
          enableReinitialize
          initialValues={userPersonalDetail}
          validationSchema={UserPersonalDetailSchema}
          onSubmit={(v, {resetForm}) => {
            // loginEmail(v);
            submitForm(v);
          }}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
            touched,
            errors,
          }) => {
            return (
              <View style={[Gutters.tinyHMargin]}>
                <View style={[Gutters.regularTMargin]}>
                  <SemiBoldText
                    text={t('common:verification')}
                    textStyle={[Fonts.poppinSemiBold24, {color: Colors.white}]}
                  />
                </View>
                <TextRegular
                  text={
                    'iSQROLL does not store any personal verification details'
                  }
                  textStyle={[
                    Fonts.poppinReg14,
                    Gutters.tinyTMargin,
                    {color: Colors.white},
                  ]}
                />

                {subscription?.category == 'paid' && (
                  <View style={[Gutters.smallTMargin]}>
                    <CreditCardViewSignUp
                      ref={creditCardRef}
                      setCardView={v =>
                        dispatch(setSubscriptionFlags({cardViewFlag: v}))
                      }
                      index={3}
                      StripeView={stripeViewFlag}
                      setstripeView={v =>
                        dispatch(setSubscriptionFlags({stripeViewFlag: v}))
                      }
                      setAddCard={v =>
                        dispatch(setSubscriptionFlags({addCardFlag: v}))
                      }
                      onPressChangePlan={onPressChangePlanFunc}
                    />
                  </View>
                )}

                <View
                  style={[
                    Layout.row,
                    // Layout.alignItemsCenter,
                    Gutters.smallVMargin,
                  ]}>
                  <CustomCheckBox
                    isCard={true}
                    selected={selectedCheckBoxTerms}
                    setSelected={setSelectedCheckBoxTerms}
                    customStyle={[{marginTop: 2}]}
                  />
                  <View
                    style={[
                      Gutters.smallLMargin,
                      Layout.row,
                      Layout.alignItemsCenter,
                      {flexWrap: 'wrap'},
                    ]}>
                    <Text
                      style={[Fonts.poppinReg18, {color: Colors.gray_C9C9C9}]}>
                      {'I have read and agreed to the '}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('TermsCondition', {
                          isSignUp: true,
                        });
                      }}>
                      <Text
                        style={[
                          Fonts.poppinReg18,
                          {
                            color: Colors.primary,
                            textAlignVertical: 'center',
                          },
                        ]}>
                        {'terms and conditions.'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={[Gutters.smallVMargin]}>
                  <CustomGradientButton
                    onPress={() => {
                      handleSubmit();
                    }}
                    text={t('common:continue')}
                    textStyle={[Fonts.poppinBold24]}
                  />

                  <View
                    style={[Layout.row, Gutters.smallVMargin, Layout.center]}>
                    <TextRegular
                      textStyle={[
                        Fonts.poppinReg18,
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
                <CustomLoading isLoading={isLoading} />
                {/* {Platform.OS === 'android' && (
                  <View style={[Gutters.smallTMargin]}>
                    <CustomDatePicker
                      dateProps={{
                        maximumDate: new Date(),
                      }}
                      customHeadingStyle={[
                        Fonts.poppinMed18,
                        {color: Colors.gray_C9C9C9},
                      ]}
                      selectDate={selectedDate}
                      setSelectedDate={date => {
                        // const formateDate = moment(date).format('DD/MM/YYYY');
                        // setSelectedDate(formateDate);
                        setSelectedDate(date);
                        setFieldValue(
                          'date_of_birth',
                          moment(date).format('YYYY-MM-DD'),
                        );
                        dispacth(
                          setSignUpUser({
                            date_of_birth: moment(date).format('YYYY-MM-DD'),
                          }),
                        );
                      }}
                      customBackgroundStyle={[
                        {
                          backgroundColor: Colors.white,
                          borderWidth: 2,
                          borderColor: errors.date_of_birth
                            ? Colors.red
                            : Colors.gray_C9C9C9,
                        },
                      ]}
                      headingText={t('common:dob')}
                    />
                    {touched.date_of_birth && errors.date_of_birth && (
                      <TextRegular
                        text={errors.date_of_birth}
                        textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                      />
                    )}
                  </View>
                )} */}
                {/* {Platform.OS === 'android' && (
                  <View style={[Gutters.smallVMargin]}>
                    <CustomDropDown
                      value={
                        genderData[0].value === selected
                          ? genderData[0].key
                          : genderData[1].value === selected
                          ? genderData[1].key
                          : genderData[2].value === selected
                          ? genderData[2].key
                          : ''
                      }
                      headingText={t('common:gender')}
                      headingTextStyle={[
                        Fonts.poppinMed18,
                        {color: Colors.gray_C9C9C9},
                      ]}
                      setSelected={v => {
                        setFieldValue('gender', v);
                        setSelectedGender(v);
                        dispacth(
                          setSignUpUser({
                            gender: v,
                          }),
                        );
                      }}
                      customListStyle={[
                        {
                          backgroundColor: Colors.white,
                        },
                      ]}
                      customStyle={[
                        {
                          backgroundColor: Colors.white,
                          borderWidth: 2,
                          borderColor: errors.gender
                            ? Colors.red
                            : Colors.gray_C9C9C9,
                        },
                      ]}
                      data={genderData}
                      placeholder={t('common:select')}
                    />
                    {touched.gender && errors.gender && (
                      <TextRegular
                        text={errors.gender}
                        textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                      />
                    )}
                  </View>
                )} */}
                {/* <TextMedium
                  text="Address"
                  textStyle={[Fonts.poppinMed18, {color: Colors.gray_C9C9C9}]}
                />
                <CustomGooglePlaces
                  value={address}
                  // isCompleteAddres={true}
                  editable={true}
                  // setPickup={t => setLocation(t)}
                  setFieldValue={(details: any) => {
                    setFieldValue('address', details?.formatted_address);
                    // setFieldValue('address', details?.geometry.location);
                    dispacth(
                      setLocationDropDownSelected(details?.shortLocation),
                    );

                    let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${details?.geometry?.location?.lat},${details?.geometry?.location?.lng}&key=${GOOGLE_MAP_API_KEY}&result_type=country`;

                    getCountryName(url).then(async (res: any) => {
                      let country =
                        res?.data?.results[0]?.formatted_address ?? null;

                      setFieldValue('country', country);
                      dispacth(
                        setSignUpUser({
                          country: country,
                        }),
                      );

                      if (country == 'New Zealand') {
                        setErrors({
                          ...error,
                          passport: true,
                          driver_licence_no: true,
                          card_version_no: true,
                        });
                      } else {
                        setErrors({
                          ...error,
                          driver_licence_no: false,
                          card_version_no: false,
                          passport: true,
                        });
                      }
                    });
                  }}
                  setPickup={v => {
                    setFieldValue('address', v ? v : '');
                    dispacth(
                      setSignUpUser({
                        address: v ? v : '',
                      }),
                    );
                    if (isSecondStepErr === false && !v) {
                      dispacth(setStep({isSecondStepErr: true}));
                    }
                    // if (v) {
                    //   setFieldValue('address', v);
                    // } else {
                    //   setFieldValue('address', v);
                    // }
                  }}
                  textInputProps={
                    {
                      // onChangeText: text => {
                      //   if (text!== ) {
                      //     setLocation('');
                      //   }
                      // },
                    }
                  }
                  customStyle={[
                    {
                      backgroundColor: Colors.white,
                      borderWidth: 2,
                      borderColor: errors.address
                        ? Colors.red
                        : Colors.gray_C9C9C9,
                      borderRadius: 4,
                    },
                  ]}
                /> */}
                {/* <CustomInput
                  headingText={t('common:address')}
                  inputProps={{
                    onChangeText: handleChange('address'),
                    onBlur: handleBlur('address'),
                    value: address,
                  }}
                  headingTextStyle={[Fonts.poppinMed18]}
                  placeholder={t('common:email_phone')}
                  showPassword={false}
                /> */}
                {/* <TextMedium
                  text={t('common:address')}
                  textStyle={[
                    Fonts.poppinMed14,
                    Gutters.littleBMargin,
                    Gutters.littleLMargin,
                  ]}
                />
                <CustomGooglePlaces
                  editable={true}
                  autoPlacesProps={{
                    onChangeText: handleChange('address'),
                    onBlur: handleBlur('address'),
                    value: address,
                  }}
                  setFieldValue={(details: any) =>
                    setFieldValue('address', details?.geometry?.location)
                  }
                /> */}
                {/* {touched.address && errors.address && (
                  <TextRegular
                    text={errors.address}
                    textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                  />
                )} */}

                {/* <View style={[Gutters.smallTMargin]}>
                  <TextMedium
                    text={t('common:nz_license')}
                    textStyle={[
                      Fonts.poppinMed18,
                      Gutters.littleBMargin,
                      Gutters.littleLMargin,
                      {color: Colors.gray_C9C9C9},
                    ]}
                  />
                  <View
                    style={[
                      Layout.fullWidth,
                      Layout.justifyContentBetween,
                      Layout.alignItemsCenter,
                      i18next.language === 'en'
                        ? Layout.row
                        : Layout.rowReverse,
                      {
                        height: 60,
                        paddingHorizontal: 5,
                        backgroundColor: Colors.white,
                        borderRadius: 6,
                        borderWidth: 2,
                        borderColor: Colors.gray_C9C9C9,
                        // error.drive_license && !uploadPicture?.uri
                        //   ? Colors.red
                        //   : Colors.gray_C9C9C9,
                      },
                    ]}>
                    <TextMedium
                      text={
                        !!uploadPicture[0]?.name
                          ? uploadPicture[0]?.name
                          : 'Drivers licence (Front Side)'
                      }
                      numberOfLines={numberOfLines}
                      textStyle={[
                        Fonts.poppinMed16,
                        Gutters.xTinyLPadding,
                        {color: Colors.dark_gray_676C6A, flex: 1},
                      ]}
                    />
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={async () => {
                        setPicturUploadObj({
                          ...picturUploadObj,
                          sideFront: true,
                          showSheet: true,
                        });
                      }}
                      style={[
                        Layout.center,
                        {
                          width: 100,
                          height: 52,
                          borderRadius: 6,
                          backgroundColor: Colors.black_232C28,
                        },
                      ]}>
                      <TextBold
                        text={t('common:upload')}
                        textStyle={[Fonts.poppinBold18, {color: Colors.white}]}
                      />
                    </TouchableOpacity>
                  </View>

                  {uploadPicture[0]?.uri && (
                    <View
                      style={[
                        Layout.alignItemsCenter,
                        Gutters.tinyTMargin,
                        i18next.language === 'en'
                          ? Layout.row
                          : Layout.rowReverse,
                      ]}>
                      <View
                        style={[
                          Layout.center,

                          {
                            width: sWidth(45),
                            height: sHight(5),
                            borderRadius: 6,
                            backgroundColor: Colors.gray_C9C9C9,
                          },
                        ]}>
                        <View style={[Gutters.tinyHMargin]}>
                          <TextRegular
                            text={
                              uploadPicture[0]?.name ?? uploadPicture[0]?.name
                            }
                            textStyle={[
                              Fonts.poppinSemiBold14,
                              {color: Colors.dark_gray_676C6A},
                            ]}
                            textProps={{numberOfLines: 1}}
                          />
                        </View>
                      </View>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          // setNameDoc(null);
                          let data = [...uploadPicture];
                          data[0] = {};
                          setUploadPicture(data);
                        }}
                        style={[
                          Gutters.smallLMargin,
                          {
                            borderBottomWidth: 1,
                            borderColor: Colors.primary,
                          },
                        ]}>
                        <TextMedium
                          text={t('common:remove')}
                          textStyle={[
                            Fonts.poppinMed18,
                            {color: Colors.primary},
                          ]}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                  <View
                    style={[
                      Gutters.tinyTMargin,
                      Layout.fullWidth,
                      Layout.justifyContentBetween,
                      Layout.alignItemsCenter,
                      i18next.language === 'en'
                        ? Layout.row
                        : Layout.rowReverse,
                      {
                        height: 60,
                        paddingHorizontal: 5,
                        backgroundColor: Colors.white,
                        borderRadius: 6,
                        borderWidth: 2,
                        borderColor: Colors.gray_C9C9C9,
                        // error.drive_license && !uploadPicture?.uri
                        //   ? Colors.red
                        //   : Colors.gray_C9C9C9,
                      },
                    ]}>
                    <TextMedium
                      text={
                        !!uploadPicture[1]?.name
                          ? uploadPicture[1]?.name
                          : 'Drivers licence (Back Side)'
                      }
                      numberOfLines={numberOfLines}
                      textStyle={[
                        Fonts.poppinMed16,
                        Gutters.xTinyLPadding,
                        {color: Colors.dark_gray_676C6A, flex: 1},
                      ]}
                    />
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={async () => {
                        setPicturUploadObj({
                          ...picturUploadObj,
                          sideFront: false,
                          showSheet: true,
                        });
                      }}
                      style={[
                        Layout.center,
                        {
                          width: 100,
                          height: 52,
                          borderRadius: 6,
                          backgroundColor: Colors.black_232C28,
                        },
                      ]}>
                      <TextBold
                        text={t('common:upload')}
                        textStyle={[Fonts.poppinBold18, {color: Colors.white}]}
                      />
                    </TouchableOpacity>
                  </View>

                  {uploadPicture[1]?.uri && (
                    <View
                      style={[
                        Layout.alignItemsCenter,
                        Gutters.tinyTMargin,
                        i18next.language === 'en'
                          ? Layout.row
                          : Layout.rowReverse,
                      ]}>
                      <View
                        style={[
                          Layout.center,

                          {
                            width: sWidth(45),
                            height: sHight(5),
                            borderRadius: 6,
                            backgroundColor: Colors.gray_C9C9C9,
                          },
                        ]}>
                        <View style={[Gutters.tinyHMargin]}>
                          <TextRegular
                            text={
                              uploadPicture[1]?.name ?? uploadPicture[1]?.name
                            }
                            textStyle={[
                              Fonts.poppinSemiBold14,
                              {color: Colors.dark_gray_676C6A},
                            ]}
                            textProps={{numberOfLines: 1}}
                          />
                        </View>
                      </View>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          // setNameDoc(null);
                          let data = [...uploadPicture];
                          data[1] = {};
                          setUploadPicture(data);
                        }}
                        style={[
                          Gutters.smallLMargin,
                          {
                            borderBottomWidth: 1,
                            borderColor: Colors.primary,
                          },
                        ]}>
                        <TextMedium
                          text={t('common:remove')}
                          textStyle={[
                            Fonts.poppinMed18,
                            {color: Colors.primary},
                          ]}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View> */}

                {/* <View style={[Gutters.smallVMargin]}>
                  <CustomInput
                    headingText={t('common:passport_number')}
                    inputProps={{
                      onChangeText: t => {
                        handleChange('passport_number')(t);
                        dispacth(
                          setSignUpUser({
                            passport_number: t,
                          }),
                        );
                        if (t) {
                          setErrors({
                            ...error,
                            passport: false,
                            card_version_no: false,
                            driver_licence_no: false,
                          });
                          if (t !== signUpBasic?.passport_number) {
                            if (isSecondStepErr === false) {
                              dispacth(setStep({isSecondStepErr: true}));
                            }
                          }
                        } else {
                          if (t && driver_licence_no && card_version_no) {
                          } else {
                            setErrors({
                              ...error,
                              passport: true,
                              card_version_no: true,
                              driver_licence_no: true,
                            });
                            if (isSecondStepErr === false) {
                              dispacth(setStep({isSecondStepErr: true}));
                            }
                          }
                        }
                      },
                      onBlur: handleBlur('passport_number'),
                      value: passport_number,
                    }}
                    headingTextStyle={[
                      Fonts.poppinMed18,
                      {color: Colors.gray_C9C9C9},
                    ]}
                    placeholder={t('common:email_phone')}
                    showPassword={false}
                  />
                  {error.passport != false &&
                    !passport_number &&
                    !driver_licence_no &&
                    !card_version_no && (
                      <TextRegular
                        text={'Passport number is required'}
                        textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                      />
                    )}
                  <TextRegular
                    text={
                      '*' +
                      t('common:passports_verifications_may_take_up_to_hours')
                    }
                    textStyle={[
                      Gutters.littleTMargin,
                      {
                        color: Colors.white,
                        marginLeft: sHight(1),
                      },
                    ]}
                  />
                </View> */}

                {/* <View style={[Gutters.mediumTMargin, Layout.overflow]}>
                  {!btnStatus ? (
                    <CustomGradientButton
                      onPress={handleSubmit}
                      text={t('common:continue')}
                      textStyle={[Fonts.poppinBold24]}
                    />
                  ) : (
                    <CustomButton
                      onPress={() => {}}
                      btnProps={{disabled: !btnStatus}}
                      text={t('common:continue')}
                    />
                  )}
                </View> */}
              </View>
            );
          }}
        </Formik>
        <CustomBottomSheet
          icon={true}
          visible={picturUploadObj.showSheet}
          height={'50%'}
          setShowBottomSheet={flag =>
            setPicturUploadObj({...picturUploadObj, showSheet: flag})
          }>
          <View
            style={[
              Layout.fill,
              Layout.alignItemsCenter,
              Gutters.smallTPadding,
            ]}>
            <TextSemiBold
              text={'Please select from where you wanted to upload picture.'}
              textStyle={[
                Layout.textAlign,
                Gutters.regularVMargin,
                Gutters.tinyHPadding,
                Fonts.poppinSemiBold20,
                {textTransform: 'none', color: Colors.black_232C28},
              ]}
            />
            <View
              style={[
                Gutters.xRegularVPadding,
                // Layout.screenWidth,
                Layout.justifyContentBetween,
                Layout.row,
                // {height: 200, width: 100},
              ]}>
              <TouchableOpacity
                style={[
                  Gutters.smallPadding,
                  Layout.center,
                  Gutters.tinyRMargin,
                  {
                    backgroundColor: Colors.primary,
                    borderRadius: 10,
                    height: 100,
                    width: 100,
                  },
                ]}
                onPress={() => {
                  setPicturUploadObj({
                    ...picturUploadObj,
                    sideFront: true,
                    showSheet: false,
                  });
                  Platform.OS == 'ios'
                    ? setTimeout(() => {
                        takeImage();
                      }, 700)
                    : takeImage();
                }}>
                <Images.svg.cameraIcon.default width="55" height="50" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  Gutters.smallPadding,
                  Gutters.tinyLMargin,
                  Layout.center,
                  {
                    backgroundColor: Colors.primary,
                    borderRadius: 10,
                    height: 100,
                    width: 100,
                  },
                ]}
                onPress={() => {
                  setPicturUploadObj({
                    ...picturUploadObj,
                    sideFront: true,
                    showSheet: false,
                  });

                  Platform.OS == 'ios'
                    ? setTimeout(() => {
                        uploadDocument();
                      }, 700)
                    : uploadDocument();
                }}>
                <Images.svg.FolderIcon.default style={{marginTop: 5}} />
              </TouchableOpacity>
              {/* <CustomButton
                text={'Camera'}
                btnStyle={[{backgroundColor: Colors.primary}]}
                textStyle={[Fonts.poppinSemiBold20, {color: Colors.white}]}
                onPress={() => {
                  setPicturUploadObj({
                    ...picturUploadObj,
                    sideFront: true,
                    showSheet: false,
                  });
                  takeImage();
                }}
              /> */}
              {/* <CustomButton
                text={'Files'}
                btnStyle={[
                  Gutters.xTinyTMargin,
                  {backgroundColor: Colors.dark_gray_676C6A},
                ]}
                textStyle={[Fonts.poppinSemiBold24, {color: Colors.white}]}
                onPress={() => {
                  setPicturUploadObj({
                    ...picturUploadObj,
                    sideFront: true,
                    showSheet: false,
                  });
                  uploadDocument();
                }}
              /> */}
            </View>
          </View>
        </CustomBottomSheet>
      </View>
      <CustomBottomSheet
        icon={false}
        setShowBottomSheet={() => {
          dispatch(setCongratulation(false));
        }}
        visible={!isLoading && !!congratulation}
        height={'90%'}>
        <View
          style={[
            Layout.fill,
            Layout.alignItemsCenter,
            Gutters.regularTPadding,
            {
              backgroundColor: 'white',
              borderTopEndRadius: 20,
              borderTopStartRadius: 20,
            },
          ]}>
          <Images.svg.bucket.default />
          <SemiBoldText
            text={t('common:congratulation')}
            textStyle={[
              Fonts.poppinSemiBold32,
              Gutters.sRegularTMargin,
              {color: Colors.black_232C28},
            ]}
          />
          <TextRegular
            text={`${t('common:sign_up_message')}${
              subscription?.title
            } Package! `}
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
            btnStyle={[Gutters.sRegularVMargin, {width: '80%'}]}
            textStyle={[Layout.textTransform]}
            onPress={async () => {
              dispatch(setCongratulation(false));
              dispatch(setClearSignUpBasic({}));
              dispatch(clearSignUpData());
              navigation.dispatch(StackActions.popToTop());
            }}
            textColor={Colors.white}
          />
        </View>
      </CustomBottomSheet>
    </View>
  );
};

export default AboutSelf;
