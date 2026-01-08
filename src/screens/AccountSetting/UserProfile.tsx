import {Formik} from 'formik';
import i18next, {use} from 'i18next';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {useDispatch, useSelector} from 'react-redux';
import {
  CustomBottomSheet,
  CustomButton,
  CustomCheckBox,
  CustomDatePicker,
  CustomDropDown,
  CustomFastImage,
  CustomGooglePlaces,
  CustomInput,
  CustomLoading,
  ScreenWrapper,
  TextMedium,
  TextRegular,
  TextSemiBold,
} from '../../components';
import {useTheme} from '../../hooks';
import {useUpdateUserMutation} from '../../services/accountSettings/userProfileService';
import {useUploadFileMutation} from '../../services/fileUpload/fileUpload';
import {
  imageUploading,
  setGuest,
  setUserData,
  storeToken,
} from '../../store/auth/AuthSlice';
import {sHight, sWidth} from '../../utils/ScreenDimentions';
import {AccountSettingSchema} from '../../utils/Validation';
import {genderData} from '../../utils/dummyData';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FastImage from 'react-native-fast-image';
import {
  getPlaceHolderProduct,
  getURLPhoto,
  toastDangerMessage,
  toastSuccessMessage,
} from '../../utils/helpers';
import Modal from 'react-native-modal';
import {useDeleteProfileMutation} from '../../services/auth/signupApi';
import {axiosUploadImagesMutation} from '../../services/submitForms/imageUploadFormAxios';
import {deepLinkToSubscriptionsIos, useIAP} from 'react-native-iap';
import {
  useDeleteMotorcentralRecordsMutation,
  useLazyFetchmotorcentralQuery,
  useLazyGetmotorCentralRecordQuery,
  useUpdateMcDealershipMutation,
  useUploadMotorcentralRecordsMutation,
} from '../../services/motorcentral/motorcentralApi';

type Props = {
  navigation: any;
};

let isLoading = false;

const UserProfile = ({navigation}: Props) => {
  const {Colors, Fonts, Images, Gutters, Layout} = useTheme();
  const [updateUser] = useUpdateUserMutation();
  const [uploadFile] = useUploadFileMutation();
  const [updateDealershipID, {isLoading: isLoadingDealershipID}] =
    useUpdateMcDealershipMutation();
  const [fetchMotorCentral, {isLoading: isLoadingFecthMotorData}] =
    useLazyFetchmotorcentralQuery();
  const [getMotorCentral, {isLoading: isLoadingGetMotorData}] =
    useLazyGetmotorCentralRecordQuery();
  const [uploadMotorCentral, {isLoading: isLoadingUploadMotorData}] =
    useUploadMotorcentralRecordsMutation();
  const [deleteMotorCentral, {isLoading: isLoadingDeleteMotorData}] =
    useDeleteMotorcentralRecordsMutation();

  const [deleteProfile, {isLoading: deleteUser}] = useDeleteProfileMutation();
  const user_data = useSelector(state => state.auth?.user_data);
  const [userProfileImage, setUserProfileImage] = useState();
  const [deleteProfilePopUp, setDeleteProfilePopUp] = useState(false);
  const [deleteItemPopUp, setDeleteItemPopUp] = useState(false);
  const [selectedDateDOB, setSelectedDateDOB] = useState('');
  const [gender, setGender] = useState({});
  const [edit, setEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [locationDropDownSelected, setLocationDropDownSelected] = useState('');
  const [errorsText, setErrorsText] = useState({
    address: '',
    addressmatch: '',
  });
  const [dealerShipID, setDealerShipID] = useState('');
  const [mcRecordsIds, setMcRecordsIds] = useState([]);
  const [mcRecordsError, setMcRecordsError] = useState('');
  const [mcRecordsDialog, setMcRecordsDialog] = useState(false);
  const [mcRecordsDataListing, setMcRecordsDataListing] = useState([]);
  const [AccountSetting, setAccountSetting] = useState<{
    first_name: string;
    last_name: string;
    // username: any;
    phone: any;
    email: any;
    // gender: any;
    address: any;
    // dob: any;
    updatedAt: any;
    driver_licence_no: string;
    card_version_no: string;
    // passport_number: string;
  }>({
    first_name: '',
    last_name: '',
    // username: '',
    phone: '',
    email: '',
    // gender: '',
    address: '',
    // dob: '',
    updatedAt: '',
    driver_licence_no: '',
    card_version_no: '',
    // passport_number: '',
  });
  // console.log('>>>> user_data ', JSON.stringify(user_data));

  const {currentPurchase} = useIAP();

  const setInitialData = () => {
    setAccountSetting({
      first_name: user_data?.first_name,
      last_name: user_data?.last_name,
      // username: user_data?.username,
      phone: user_data?.phone_number,
      email: user_data?.email,
      // gender: user_data?.gender,
      address: user_data?.address,
      // dob: user_data?.date_of_birth,
      updatedAt: user_data?.updated_at,
      driver_licence_no: user_data?.driver_licence_no,
      card_version_no: user_data?.card_version_no,
      // passport_number: user_data?.passport_number,
    });
    setDealerShipID(user_data?.motorcentral_dealership || '');
  };

  const dispatch = useDispatch();

  useEffect(() => {
    setInitialData();
  }, [user_data?.updated_at]);

  useEffect(() => {
    setInitialData();
  }, []);
  // console.log(user_data);

  const uploadImages = async (temp: Object) => {
    if (temp?.type?.includes('image') || temp?.type?.includes('jpeg')) {
      const form_data = new FormData();
      form_data.append('files', temp);

      // dispatch(imageUploading(true));
      setTimeout(() => {
        axiosUploadImagesMutation(form_data)
          .then(res => {
            // dispatch(imageUploading(false));
            console.log('>>> res 111 res ', res);
            setTimeout(() => {
              if (res?.data?.document && res?.data?.document[0]) {
                let payload = {
                  first_name: user_data?.first_name,
                  last_name: user_data?.last_name,
                  email: user_data?.email,
                  // username: user_data?.username,
                  phone_number: user_data?.phone_number,
                  date_of_birth: user_data?.date_of_birth,
                  // gender: user_data?.gender,
                  address: user_data?.address,
                  photo: res?.data?.document[0],
                };
                updateUser({
                  payload: payload,
                  _id: user_data?._id,
                })
                  .then(res => {
                    console.log('>>> res 222 ', res);

                    setIsLoading(false);
                    setEdit(false);
                    // if (res?.data?.user) {
                    //   setIsLoading(false);
                    //   setEdit(false);
                    // }
                  })
                  .catch(err => {
                    setIsLoading(false);
                    setEdit(false);
                    console.log('>>> res 222 err ', err);
                  });
              } else {
                setIsLoading(false);
                setEdit(false);
              }
            }, 700);
          })
          .catch(err => {
            // dispatch(imageUploading(false));
            setIsLoading(false);
            setEdit(false);
            console.log('>>> res 111 err ', err);
          });
      }, 1000);
    } else {
      toastDangerMessage('Please select image type');
      // dispatch(imageUploading(false));
      setIsLoading(false);
      setEdit(false);
    }

    setTimeout(() => {
      // dispatch(imageUploading(false));
    }, 7000);
  };

  const imagePicker = async () => {
    setIsLoading(true);
    ImagePicker.openPicker({
      width: 200,
      height: 200,
      // cropping: true,
      compressImageQuality: Platform.OS === 'android' ? 0.5 : 0.4,
      compressImageFormat: 'jpeg',
    })
      .then(result => {
        const photo: any = {
          // name:
          //   Platform.OS === 'ios'
          //     ? result?.filename
          //     : result?.path.split('/')[11],
          // uri: Platform.OS == 'ios' ? result?.sourceURL : result?.path,
          name: result?.path?.split('/').pop(),
          type: result?.mime,
          uri: result?.path,
        };
        setImage(photo);
        uploadImages(photo);
      })
      .catch(error => {
        console.log('Image Picker Error :::::::::::::', error);

        if (error.code === 'E_PICKER_CANCELLED') {
          console.log('Image selection was cancelled');
          setIsLoading(false);
        } else {
          setIsLoading(false);
          console.log('Image Picker Error', error.message);
        }
      });
  };

  const deleteAction = () => {};

  const submitForm = info => {
    console.log('>>>info?.address ', info?.address);
    console.log('>>>address ', AccountSetting.address);
    // if (
    //   AccountSetting.address == '' ||
    //   AccountSetting.address == null ||
    //   AccountSetting.address == undefined
    // ) {
    //   toastDangerMessage('Address is required');
    //   setErrorsText({address: 'Address is required', addressmatch: ''});
    // } else

    if (
      (AccountSetting.address &&
        info?.address &&
        AccountSetting.address !== info?.address) ||
      (AccountSetting.address && AccountSetting.address !== info?.address)
    ) {
      toastDangerMessage('Please select address from dropdown');
      setErrorsText({
        address: '',
        addressmatch: 'Please select address from dropdown',
      });
    } else if (!info.first_name || info.first_name.trim() === '') {
      toastDangerMessage('First name is required');
    } else {
      let reqObj = {
        first_name: info.first_name,
        last_name: info.last_name,
        email: info?.email,
        // username: info?.username,
        phone_number: info?.phone,
        // date_of_birth: info?.dob,
        // gender: info?.gender,
        address: AccountSetting.address,
        // address: info?.address,
        // passport_number: info?.passport_number
        //   ? info?.passport_number
        //   : user_data?.passport_number,
      };

      // console.log('edit profile req obj ::::: ', JSON.stringify(user_data));
      console.log('edit profile req obj ::::: ', reqObj);
      setIsLoading(true);
      updateUser({
        payload: reqObj,
        _id: user_data?._id,
      })
        .then(res => {
          if (res?.data?.user) {
            setIsLoading(false);
            setEdit(false);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  const findFlagById = (array, value) => {
    return array.find(item => item.value === value);
  };

  const deleteUserProfile = () => {
    // if (user_data?.subscription?.category == 'paid' && Platform.OS == 'ios') {
    //   currentPurchase?.transactionReceipt && deepLinkToSubscriptionsIos();
    // }
    deleteProfile(user_data?._id)
      .then(res => {
        if (res?.data?.message) {
          setTimeout(() => {
            dispatch(setUserData({}));
            dispatch(storeToken(null));
            dispatch(setGuest(false));
          }, 1000);
        }
      })
      .catch(err => toastDangerMessage(err.error.data.message));
  };

  const DeleteProfile = () => {
    const {Colors, Fonts, Images, Gutters, Layout} = useTheme();
    return (
      <View
        style={[
          Layout.fullWidth,
          Layout.alignItemsCenter,
          Gutters.smallPadding,
          {
            borderRadius: 6,
            backgroundColor: Colors.white,
          },
        ]}>
        <Images.svg.dustbinRed.default />
        <Text
          style={[
            Fonts.poppinSemiBold25,
            Gutters.tinyVMargin,
            Fonts.textCenter,
            {color: Colors.black_232C28},
          ]}>
          {t('common:delete_profile')}
        </Text>
        <Text
          style={[
            Fonts.poppinMed16,
            Gutters.tinyTMargin,
            {color: Colors.dark_gray_676C6A, textAlign: 'center'},
          ]}>
          {t('common:are_you_sure_you_want_to_delete')}
        </Text>
        <View
          style={[
            Gutters.smallTMargin,
            Layout.selfCenter,
            Layout.row,
            Layout.alignItemsCenter,
          ]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setDeleteProfilePopUp(false);
            }}
            style={[
              Gutters.xTinyPadding,
              Layout.center,
              {
                backgroundColor: 'transparent',
                borderRadius: 6,
                borderWidth: 1,
                borderColor: Colors.black_232C28,
                width: 150,
              },
            ]}>
            <Text
              style={[Fonts.poppinSemiBold14, {color: Colors.black_232C28}]}>
              {t('common:cancel')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setDeleteProfilePopUp(false);
              deleteUserProfile();
            }}
            style={[
              Gutters.tinyPadding,
              Layout.center,
              Gutters.xTinyPadding,
              Gutters.tinyLMargin,
              {
                backgroundColor: Colors.red,
                borderRadius: 6,
                width: 150,
              },
            ]}>
            <Text
              style={[
                Fonts.poppinSemiBold14,
                {textTransform: 'capitalize', color: Colors.white},
              ]}>
              {t('common:delete')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderMotorcentralView = () => {
    return (
      <View style={{}}>
        <View
          style={[
            Gutters.smallVMargin,
            {height: 1, backgroundColor: Colors.gray_A4A4A4},
          ]}></View>
        <View style={[Gutters.tinyTMargin]}>
          <TextSemiBold
            text={t('common:motorcentral_data_import')}
            textStyle={[Fonts.poppinSemiBold18, {color: Colors.black_232C28}]}
          />
          <View style={[Gutters.smallTMargin]}>
            <CustomInput
              headingText={t('common:dealership_name_id')}
              headingTextStyle={[
                Fonts.poppinSemiBold18,
                {color: Colors.black_232C28},
              ]}
              inputProps={{
                onChangeText: setDealerShipID,
                value: dealerShipID,
              }}
              lefticon={true}
              lefticonName={'userIcon'}
              lefticonStyle={{height: 23, width: 23}}
              placeholder={t('common:email_phone')}
              // inputStyle={[Gutters.tinyLPadding]}
              backgroundStyle={[{backgroundColor: Colors.light_grayF4F4F4}]}
            />
            <CustomButton
              onPress={() => {
                if (dealerShipID) {
                  let body = {
                    id: user_data?._id,
                    body: {
                      motorcentral_dealership: dealerShipID,
                    },
                  };
                  updateDealershipID(body);
                } else {
                  toastDangerMessage('Please enter dealership ID');
                }
              }}
              btnStyle={[
                Gutters.smallVMargin,
                {backgroundColor: Colors.dark_gray_676C6A},
              ]}
              text={t('common:save')}
              textStyle={[Fonts.poppinSemiBold24, {color: Colors.white}]}
            />
            {/* <CustomButton
              onPress={() => {
                setIsLoading(true);
                fetchMotorCentral('').finally(() => {
                  setIsLoading(false);
                });
              }}
              btnStyle={[
                Gutters.mediumTMargin,
                {backgroundColor: Colors.black_232C28},
              ]}
              text={t('common:fetch_motocentral_record')}
              textStyle={[Fonts.poppinSemiBold24, {color: Colors.white}]}
            /> */}
            {/* <CustomButton
              onPress={() => {
                setIsLoading(true);
                setMcRecordsDataListing([]);
                setMcRecordsIds([]);
                getMotorCentral('')
                  .then(res => {
                    console.log(
                      '>> res  getMotorCentral 00 ',
                      JSON.stringify(res),
                    );

                    setIsLoading(false);
                    if (
                      res?.data?.motorcentral_records &&
                      res?.data?.motorcentral_records.length > 0 &&
                      !res?.error?.data?.message
                    ) {
                      console.log(
                        '>> res  getMotorCentral count ',
                        res?.data?.motorcentral_records.length,
                      );
                      setMcRecordsDataListing(
                        res?.data?.motorcentral_records || [],
                      );
                      if (Platform.OS === 'ios') {
                        setTimeout(() => {
                          setMcRecordsDialog(true);
                        }, 400);
                      } else {
                        setMcRecordsDialog(true);
                      }
                    }
                  })
                  .finally(() => {
                    setIsLoading(false);
                  });
              }}
              btnStyle={[
                Gutters.tinyVMargin,
                {backgroundColor: Colors.dark_gray_676C6A},
              ]}
              text={t('common:view_motocentral_record')}
              textStyle={[Fonts.poppinSemiBold24, {color: Colors.white}]}
            /> */}
          </View>
        </View>
      </View>
    );
  };
  const DeleteSelectedItem = () => {
    const {Colors, Fonts, Images, Gutters, Layout} = useTheme();
    return (
      <View
        style={[
          Layout.fullWidth,
          Layout.alignItemsCenter,
          Gutters.smallPadding,
          {
            borderRadius: 6,
            backgroundColor: Colors.white,
          },
        ]}>
        <Images.svg.dustbinRed.default />
        <Text
          style={[
            Fonts.poppinSemiBold25,
            Gutters.tinyVMargin,
            Fonts.textCenter,
            {color: Colors.black_232C28},
          ]}>
          {t('common:delete_motorcentral_records')}
        </Text>
        <Text
          style={[
            Fonts.poppinMed16,
            Gutters.tinyTMargin,
            Fonts.textCenter,
            {color: Colors.dark_gray_676C6A},
          ]}>
          {t('common:are_you_sure_you_want_to_delete')}
        </Text>
        <View
          style={[
            Gutters.smallTMargin,
            Layout.selfCenter,
            Layout.row,
            Layout.alignItemsCenter,
          ]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setDeleteItemPopUp(false);
            }}
            style={[
              Gutters.xTinyPadding,
              Layout.center,
              {
                backgroundColor: 'transparent',
                borderRadius: 6,
                borderWidth: 1,
                borderColor: Colors.black_232C28,
                width: 150,
              },
            ]}>
            <Text
              style={[Fonts.poppinSemiBold14, {color: Colors.black_232C28}]}>
              {t('common:cancel')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setDeleteItemPopUp(false);
              let body = {
                mc_records_ids: mcRecordsIds,
              };
              console.log('>>> body 00  ', body);
              // setMcRecordsDialog(false);
              // setTimeout(() => {
              //   setIsLoading(true);
              // }, 50);

              deleteMotorCentral(body).then(res => {
                console.log('>>> res 00 hello ', res);
                getMotorCentral('')
                  .then(res => {
                    console.log(
                      '>> res  getMotorCentral 11 ',
                      JSON.stringify(res),
                    );
                    if (
                      res?.data?.motorcentral_records &&
                      res?.data?.motorcentral_records.length > 0 &&
                      !res?.error?.data?.message
                    ) {
                      setMcRecordsDataListing(
                        res?.data?.motorcentral_records || [],
                      );
                    } else {
                      if (Platform.OS === 'ios') {
                        setTimeout(() => {
                          setMcRecordsDialog(false);
                        }, 400);
                      } else {
                        setMcRecordsDialog(false);
                      }
                    }
                  })
                  .catch(() => {
                    if (Platform.OS === 'ios') {
                      setTimeout(() => {
                        setMcRecordsDialog(false);
                      }, 400);
                    } else {
                      setMcRecordsDialog(false);
                    }
                  })
                  .finally(() => {
                    // setIsLoading(false);
                  });
              });
              // .catch(e => {
              //   console.log('>>> res 00 e ', e);
              //   toastDangerMessage('Hello');
              // })
              // .finally(() => {
              //   // setTimeout(() => {
              //   //   setIsLoading(false);
              //   // }, 50);
              // });
            }}
            style={[
              Gutters.tinyPadding,
              Layout.center,
              Gutters.xTinyPadding,
              Gutters.tinyLMargin,
              {
                backgroundColor: Colors.red,
                borderRadius: 6,
                width: 150,
              },
            ]}>
            <Text
              style={[
                Fonts.poppinSemiBold14,
                {textTransform: 'capitalize', color: Colors.white},
              ]}>
              {t('common:delete')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    // <ScreenWrapper>

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
      <View>
        {deleteUser && <CustomLoading isLoading={deleteUser} />}
        <View
          style={[
            Layout.fill,
            Layout.selfCenter,
            Gutters.smallBMargin,
            {width: '94%'},
          ]}>
          <View
            style={[
              i18next.language === 'en' ? Layout.row : Layout.rowReverse,
              Layout.alignItemsCenter,
            ]}>
            <View
              style={[
                Layout.center,

                {
                  width: 100,
                  height: 100,
                  borderRadius: 100,
                },
              ]}>
              <TouchableOpacity
                disabled={!edit}
                activeOpacity={0.8}
                onPress={imagePicker}
                style={[Layout.fill, Layout.center, {zIndex: 1}]}>
                {edit && (
                  <Images.svg.editImage.default
                    fill={Colors.white}
                    style={[Layout.absolute, {zIndex: 1}]}
                  />
                )}
                {/* {!userProfileImage?.uri && (
                <Images.svg.editImage.default
                  fill={Colors.white}
                  style={[Layout.absolute, {zIndex: 1}]}
                />
              )} */}
                <CustomFastImage
                  resizeMode="cover"
                  customStyle={[
                    {
                      width: 90,
                      height: 90,
                      borderRadius: 50,
                      borderWidth: 3,
                      borderColor: Colors.primary,
                    },
                  ]}
                  url={
                    user_data?.photo?.name
                      ? getURLPhoto(user_data?.photo?.name)
                      : require('../../theme/assets/images/user.png')
                  }
                />
              </TouchableOpacity>
            </View>
            <View style={{flex: 1}}>
              <TextSemiBold
                textProps={{
                  numberOfLines: 1,
                }}
                text={user_data?.first_name + ' ' + user_data?.last_name}
                textStyle={[
                  Fonts.poppinSemiBold24,
                  Gutters.smallLMargin,
                  {color: Colors.black_232C28},
                ]}
              />
            </View>

            {!edit && (
              <TouchableOpacity
                onPress={() => setEdit(true)}
                style={[
                  {
                    padding: 5,
                    alignItems: 'flex-end',
                  },
                ]}>
                <Images.svg.editImage.default fill={Colors.black} />
              </TouchableOpacity>
            )}
          </View>
          <View style={[Layout.fill, Gutters.smallTMargin]}>
            <Formik
              key={AccountSetting.updatedAt}
              initialValues={AccountSetting}
              validationSchema={AccountSettingSchema}
              onSubmit={submitForm}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
                values,
                touched,
                errors,
              }) => {
                const {
                  email,
                  // gender,
                  first_name,
                  last_name,
                  phone,
                  address,
                  // username,
                  // dob,
                  driver_licence_no,
                  card_version_no,
                  // passport_number,
                } = values;

                return (
                  <>
                    <View style={[Gutters.smallTMargin]}>
                      <CustomInput
                        editable={edit}
                        headingText={t('common:first_name')}
                        headingTextStyle={[
                          Fonts.poppinSemiBold18,
                          {color: Colors.black_232C28},
                        ]}
                        inputProps={{
                          onChangeText: handleChange('first_name'),
                          onBlur: handleBlur('first_name'),
                          value: first_name,
                        }}
                        lefticon={true}
                        lefticonName={'name'}
                        lefticonStyle={{height: 23, width: 23}}
                        placeholder={edit ? t('common:email_phone') : '-'}
                        showPassword={false}
                        inputStyle={[Gutters.tinyLPadding]}
                        backgroundStyle={[
                          {backgroundColor: Colors.light_grayF4F4F4},
                        ]}
                      />
                    </View>
                    {touched.first_name && errors.first_name && (
                      <TextRegular
                        text={errors.first_name}
                        textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                      />
                    )}
                    <View style={[Gutters.smallTMargin]}>
                      <CustomInput
                        editable={edit}
                        headingText={t('common:last_name')}
                        headingTextStyle={[
                          Fonts.poppinSemiBold18,
                          {color: Colors.black_232C28},
                        ]}
                        inputProps={{
                          onChangeText: handleChange('last_name'),
                          onBlur: handleBlur('last_name'),
                          value: last_name,
                        }}
                        lefticon={true}
                        lefticonName={'name'}
                        lefticonStyle={{height: 23, width: 23}}
                        placeholder={edit ? t('common:email_phone') : '-'}
                        showPassword={false}
                        inputStyle={[Gutters.tinyLPadding]}
                        backgroundStyle={[
                          {backgroundColor: Colors.light_grayF4F4F4},
                        ]}
                      />
                    </View>
                    {touched.last_name && errors.last_name && (
                      <TextRegular
                        text={errors.last_name}
                        textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                      />
                    )}

                    {/* <View style={[Gutters.smallTMargin]}>
                      <CustomInput
                        editable={edit}
                        headingText={t('common:username')}
                        headingTextStyle={[
                          Fonts.poppinSemiBold18,
                          { color: Colors.black_232C28 },
                        ]}
                        inputProps={{
                          onChangeText: handleChange('username'),
                          onBlur: handleBlur('username'),
                          value: username,
                        }}
                        lefticon={true}
                        lefticonName={'userIcon'}
                        lefticonStyle={{ height: 23, width: 23 }}
                        placeholder={edit ? t('common:email_phone') : '-'}
                        showPassword={false}
                        inputStyle={[Gutters.tinyLPadding]}
                        backgroundStyle={[
                          {
                            backgroundColor: Colors.light_grayF4F4F4,
                          },
                        ]}
                      />
                    </View>
                    {touched.username && errors.username && (
                      <TextRegular
                        text={errors.username}
                        textStyle={[{ color: Colors.red, marginLeft: sHight(1) }]}
                      />
                    )} */}
                    {/* {Platform.OS === 'android' && (
                      <View style={[Gutters.smallTMargin]}>
                        <CustomDropDown
                          hideRightIcon={!edit}
                          editable={edit}
                          headingText={t('common:gender')}
                          headingTextStyle={[
                            Fonts.poppinSemiBold18,
                            {color: Colors.black_232C28},
                          ]}
                          value={findFlagById(genderData, gender)?.key || ''}
                          selectedTextStyle={{color: Colors.black_232C28}}
                          setSelected={g => {
                            setFieldValue('gender', g === 'male' ? 'man' : g);
                            setGender(g);
                          }}
                          data={genderData}
                          leftIcon={true}
                          iconName="gender"
                          placeholder={edit ? t('common:select') : '-'}
                          customListStyle={[
                            {backgroundColor: Colors.light_grayF4F4F4},
                          ]}
                          customStyle={[
                            {
                              backgroundColor: Colors.light_grayF4F4F4,
                            },
                          ]}
                        />
                      </View>
                    )} */}

                    {/* {touched.gender && errors.gender && (
                      <TextRegular
                        text={errors.gender}
                        textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                      />
                    )} */}

                    <View style={[Gutters.smallTMargin]}>
                      <CustomInput
                        editable={edit}
                        headingText={t('common:phone_number')}
                        headingTextStyle={[
                          Fonts.poppinSemiBold18,
                          {color: Colors.black_232C28},
                        ]}
                        inputProps={{
                          onChangeText: handleChange('phone'),
                          onBlur: handleBlur('phone'),
                          value: phone,
                          keyboardType: 'number-pad',
                        }}
                        lefticon={true}
                        lefticonName={'phone_green'}
                        lefticonStyle={{height: 23, width: 23}}
                        placeholder={edit ? t('common:email_phone') : '-'}
                        showPassword={false}
                        inputStyle={[Gutters.tinyLPadding]}
                        backgroundStyle={[
                          {backgroundColor: Colors.light_grayF4F4F4},
                        ]}
                      />
                    </View>
                    {touched.phone && errors.phone && (
                      <TextRegular
                        text={errors.phone}
                        textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                      />
                    )}
                    {/* {Platform.OS === 'android' && (
                      <View style={[Gutters.smallTMargin]}>
                        <CustomDatePicker
                          // format="DD-MM-YYYY"
                          dateProps={{
                            maximumDate: new Date(),
                          }}
                          // value={dob}
                          editable={edit}
                          selectDate={
                            selectedDateDOB
                              ? selectedDateDOB
                              : user_data?.date_of_birth
                          }
                          placeHolderStyle={{color: Colors.black_232C28}}
                          setSelectedDate={date => {
                            // const formateDate = moment(date).format('DD/MM/YYYY');
                            // setSelectedDate(formateDate);
                            setSelectedDateDOB(date);
                            setFieldValue(
                              'dob',
                              moment(date).format('YYYY-MM-DD'),
                            );
                          }}
                          headingText={t('common:dob')}
                          customHeadingStyle={[
                            Fonts.poppinSemiBold18,
                            {color: Colors.black_232C28},
                          ]}
                          leftIcon={true}
                          leftIconName="calendarGreen"
                          lefticonStyle={{height: 23, width: 23}}
                          customBackgroundStyle={[
                            {backgroundColor: Colors.light_grayF4F4F4},
                          ]}
                        />
                      </View>
                    )} */}

                    <View style={[Gutters.smallTMargin]}>
                      <CustomInput
                        editable={edit}
                        headingText={t('common:email_address')}
                        headingTextStyle={[
                          Fonts.poppinSemiBold18,
                          {color: Colors.black_232C28},
                        ]}
                        inputProps={{
                          onChangeText: handleChange('email'),
                          onBlur: handleBlur('email'),
                          value: email,
                          keyboardType: 'email',
                        }}
                        lefticon={true}
                        lefticonName={'email'}
                        lefticonStyle={{height: 23, width: 23}}
                        placeholder={edit ? t('common:email_phone') : '-'}
                        showPassword={false}
                        inputStyle={[Gutters.tinyLPadding]}
                        backgroundStyle={[
                          {backgroundColor: Colors.light_grayF4F4F4},
                        ]}
                      />
                    </View>
                    {touched.email && errors.email && (
                      <TextRegular
                        text={errors.email}
                        textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                      />
                    )}
                    {/* <View style={[Gutters.smallTMargin]}>
                      <CustomInput
                        editable={false}
                        headingText={t('common:driver_licence_no')}
                        headingTextStyle={[
                          Fonts.poppinSemiBold18,
                          {color: Colors.black_232C28},
                        ]}
                        inputProps={{
                          // onChangeText: handleChange('email'),
                          // onBlur: handleBlur('email'),
                          value: driver_licence_no,
                          keyboardType: 'email',
                        }}
                        lefticon={true}
                        lefticonName={'DriverLicense'}
                        lefticonStyle={{height: 34, width: 34}}
                        placeholder={'-'}
                        showPassword={false}
                        inputStyle={[Gutters.tinyLPadding]}
                        backgroundStyle={[
                          {backgroundColor: Colors.light_grayF4F4F4},
                        ]}
                      />
                    </View> */}
                    {/* <View style={[Gutters.smallTMargin]}>
                      <CustomInput
                        editable={false}
                        headingText={t('common:card_version_no')}
                        headingTextStyle={[
                          Fonts.poppinSemiBold18,
                          {color: Colors.black_232C28},
                        ]}
                        inputProps={{
                          // onChangeText: handleChange('email'),
                          // onBlur: handleBlur('email'),
                          value: card_version_no,
                          keyboardType: 'email',
                        }}
                        lefticon={true}
                        lefticonName={'CardVersion'}
                        lefticonStyle={{height: 34, width: 34}}
                        placeholder={'-'}
                        showPassword={false}
                        inputStyle={[Gutters.tinyLPadding]}
                        backgroundStyle={[
                          {backgroundColor: Colors.light_grayF4F4F4},
                        ]}
                      />
                    </View> */}
                    {/* <View style={[Gutters.smallTMargin]}>
                      <CustomInput
                        editable={edit}
                        headingText={t('common:passport_number')}
                        headingTextStyle={[
                          Fonts.poppinSemiBold18,
                          {color: Colors.black_232C28},
                        ]}
                        inputProps={{
                          onChangeText: handleChange('passport_number'),
                          // onBlur: handleBlur('email'),
                          value: passport_number,
                        }}
                        lefticon={true}
                        lefticonName={'DriverLicense'}
                        lefticonStyle={{height: 34, width: 34}}
                        placeholder={edit ? t('common:email_phone') : '-'}
                        showPassword={false}
                        inputStyle={[Gutters.tinyLPadding]}
                        backgroundStyle={[
                          {backgroundColor: Colors.light_grayF4F4F4},
                        ]}
                      />
                    </View> */}

                    <View style={[Gutters.smallTMargin]}>
                      <TextMedium
                        text={t('common:address')}
                        textStyle={[
                          Gutters.tinyBMargin,
                          Gutters.littleLMargin,
                          Fonts.poppinSemiBold18,
                          {color: Colors.black_232C28},
                        ]}
                      />
                      <CustomGooglePlaces
                        editProfile
                        // isCompleteAddres={true}
                        editable={edit}
                        value={AccountSetting.address}
                        setPickup={t => {
                          console.log('>>> t t t  ', t);

                          setAccountSetting({
                            ...AccountSetting,
                            address: t ? t : '',
                          });
                        }}
                        setFieldValue={(details: any) => {
                          setFieldValue('address', details?.shortLocation);

                          // setAccountSetting({
                          //   ...AccountSetting,
                          //   address: details?.shortLocation,
                          // });
                        }}
                        customStyle={[
                          {
                            borderColor: errors.address
                              ? Colors.red
                              : undefined,
                          },
                        ]}
                      />
                      {/* <CustomInput
                      editable={edit}
                      headingText={t('common:address')}
                      headingTextStyle={[
                        Fonts.poppinSemiBold18,
                        {color: Colors.black_232C28},
                      ]}
                      inputProps={{
                        onChangeText: handleChange('address'),
                        onBlur: handleBlur('address'),
                        value: address,
                      }}
                      lefticon={true}
                      lefticonName={'location'}
                      lefticonStyle={{height: 23, width: 23}}
                      placeholder={t('common:email_phone')}
                      showPassword={false}
                      inputStyle={[Gutters.tinyLPadding]}
                      backgroundStyle={[
                        {backgroundColor: Colors.light_grayF4F4F4},
                      ]}
                    /> */}
                    </View>
                    {touched.address && errors.address && (
                      <TextRegular
                        text={errors.address}
                        textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                      />
                    )}
                    <View style={[Gutters.largeTMargin, Layout.overflow]}>
                      {edit && (
                        <CustomButton
                          disabled={!edit}
                          onPress={() => {
                            if (
                              errors.first_name ||
                              errors.last_name ||
                              // errors.username ||
                              errors.phone ||
                              errors.email ||
                              errors.address
                            ) {
                              // Show toast if data is missing or incorrect
                              toastDangerMessage(
                                errors.first_name ||
                                  errors.last_name ||
                                  // errors.username ||
                                  errors.phone ||
                                  errors.email ||
                                  errors.address,
                              );
                            }

                            handleSubmit();
                          }}
                          btnStyle={[
                            Gutters.tinyTMargin,
                            {backgroundColor: Colors.primary},
                          ]}
                          text={t('common:save')}
                          textStyle={[
                            Fonts.poppinSemiBold24,
                            {color: Colors.white},
                          ]}
                        />
                      )}

                      <CustomButton
                        onPress={() => {
                          navigation.navigate('ChangePassword');
                        }}
                        btnStyle={[
                          Gutters.tinyTMargin,
                          {backgroundColor: Colors.black_232C28},
                        ]}
                        text={t('common:reset_password')}
                        textStyle={[
                          Fonts.poppinSemiBold24,
                          {color: Colors.white},
                        ]}
                      />

                      <CustomButton
                        onPress={() => setDeleteProfilePopUp(true)}
                        btnStyle={[
                          Gutters.tinyVMargin,
                          {backgroundColor: Colors.red},
                        ]}
                        text={t('common:delete_profile')}
                        textStyle={[
                          Fonts.poppinSemiBold24,
                          {color: Colors.white},
                        ]}
                      />
                    </View>
                  </>
                );
              }}
            </Formik>
          </View>
          {user_data?.subscription?.allow_motorcentral_import &&
            renderMotorcentralView()}
          <CustomBottomSheet visible={false} height={'80%'} icon={false}>
            <View
              style={[
                Layout.fill,
                Layout.alignItemsCenter,
                Gutters.largeTPadding,
              ]}>
              <Images.svg.dustbinRed.default height={103} width={103} />
              <TextSemiBold
                text={t('common:are_you_sure_you_want_to_delete_your_account')}
                textStyle={[
                  Layout.textAlign,
                  Gutters.regularVMargin,
                  Gutters.tinyHPadding,
                  {textTransform: 'none', color: Colors.black_232C28},
                ]}
              />
              {/* <TextRegular
              text="Neque porro quisquam est qui ipsum quia dolor sit amet consectetur adipisci velit.."
              textStyle={[
                Fonts.poppinReg16,
                Layout.textAlign,
                Gutters.smallHPadding,
                {color: Colors.black_232C28},
              ]}
            /> */}
              <View
                style={[
                  Gutters.xRegularVPadding,
                  Layout.column,
                  Layout.screenWidth,
                  Layout.justifyContentBetween,
                ]}>
                <CustomButton
                  text={t('common:delete')}
                  btnStyle={[{backgroundColor: Colors.red_FF0505F7}]}
                  textStyle={[Fonts.poppinSemiBold20, {color: Colors.white}]}
                  onPress={() => {}}
                />
                <CustomButton
                  text={t('common:cancel')}
                  btnStyle={[
                    Gutters.xTinyTMargin,
                    {backgroundColor: Colors.dark_gray_676C6A},
                  ]}
                  textStyle={[Fonts.poppinSemiBold24, {color: Colors.white}]}
                  onPress={() => setLogout(false)}
                />
              </View>
            </View>
          </CustomBottomSheet>

          <CustomBottomSheet
            visible={mcRecordsDialog}
            height={'90%'}
            icon={true}
            setShowBottomSheet={setMcRecordsDialog}>
            <View
              style={[Layout.fill, Gutters.tinyHMargin, Gutters.smallTMargin]}>
              <TextSemiBold
                text={t('common:select_vehicles')}
                textStyle={[
                  Fonts.textLeft,
                  // Layout.textAlign,
                  // Gutters.regularVMargin,
                  // Gutters.tinyHPadding,
                  {
                    textTransform: 'none',
                    color: Colors.black_232C28,
                    marginTop: -10,
                  },
                ]}
              />
              <TextSemiBold
                text={`${t('common:total_records')}: ${
                  mcRecordsDataListing.length
                }`}
                textStyle={[
                  Fonts.textLeft,
                  Gutters.mediumTMargin,
                  Fonts.poppinSemiBold16,
                  // Gutters.tinyHPadding,
                  {textTransform: 'none', color: Colors.black_232C28},
                ]}
              />
              <View
                style={[
                  Layout.row,
                  Gutters.smallTMargin,
                  Layout.justifyContentBetween,
                ]}>
                <TextSemiBold
                  text={t('common:image')}
                  textStyle={[
                    Fonts.textLeft,

                    Fonts.poppinSemiBold14,
                    // Gutters.tinyHPadding,
                    {
                      textTransform: 'none',
                      color: Colors.black_232C28,
                      width: sWidth(12),
                    },
                  ]}
                />
                <TextSemiBold
                  text={t('common:product_title')}
                  textStyle={[
                    Fonts.textLeft,
                    Fonts.poppinSemiBold14,
                    // Gutters.tinyHPadding,
                    {
                      textTransform: 'none',
                      color: Colors.black_232C28,
                      width: sWidth(40),
                    },
                  ]}
                />
                <TextSemiBold
                  text={t('common:price')}
                  textStyle={[
                    Fonts.textLeft,
                    Fonts.poppinSemiBold14,
                    // Gutters.tinyHPadding,
                    {
                      textTransform: 'none',
                      color: Colors.black_232C28,
                      width: sWidth(10),
                    },
                  ]}
                />
                <View style={[Layout.row, {width: sWidth(20)}]}>
                  <TextSemiBold
                    text={t('common:select')}
                    textStyle={[
                      Fonts.textLeft,
                      Fonts.poppinSemiBold14,
                      Gutters.tinyRPadding,
                      {
                        textTransform: 'none',
                        color: Colors.black_232C28,
                      },
                    ]}
                  />
                  <CustomCheckBox
                    customStyle={[{borderColor: Colors.primary}]}
                    selected={
                      mcRecordsDataListing.length === mcRecordsIds.length
                    }
                    setSelected={select => {
                      if (mcRecordsDataListing.length === mcRecordsIds.length) {
                        setMcRecordsIds([]);
                      } else {
                        let data = mcRecordsDataListing.map(item => item._id);
                        setMcRecordsIds(data);
                      }
                    }}
                  />
                </View>
              </View>
              <View
                style={[
                  Gutters.smallVMargin,
                  {height: 1, backgroundColor: Colors.gray_767676},
                ]}></View>
              <FlatList
                extraData={
                  mcRecordsIds.length || mcRecordsIds || mcRecordsDataListing
                }
                // data={MotorCentralData.motorcentral_records}
                data={mcRecordsDataListing}
                renderItem={({item}) => {
                  let found = mcRecordsIds.includes(item._id);
                  // console.log('>>>item ', item);
                  return (
                    <View
                      style={[
                        Layout.row,
                        Layout.justifyContentBetween,
                        Gutters.smallTMargin,
                        Layout.alignItemsCenter,
                      ]}>
                      <View style={{width: sWidth(12)}}>
                        <View style={{height: 50, width: 50}}>
                          <CustomFastImage
                            url={
                              item.images &&
                              item.images.length > 0 &&
                              item?.images[0]?.name
                                ? getURLPhoto(item?.images[0]?.name)
                                : getPlaceHolderProduct()
                            }
                            // resizeMode="contains"
                            cutomViewStyle={[
                              {
                                width: 50,
                                height: 50,
                                // borderRadius: 55,
                                // borderWidth: 3,
                                // borderColor: Colors.primary,
                              },
                            ]}
                            customStyle={[
                              {
                                width: 50,
                                height: 50,
                              },
                            ]}
                          />
                        </View>
                      </View>
                      <TextSemiBold
                        text={item?.title}
                        textStyle={[
                          Fonts.textLeft,
                          Fonts.poppinMed14,
                          // Gutters.tinyHPadding,
                          {
                            textTransform: 'none',
                            color: Colors.black_232C28,
                            width: sWidth(40),
                          },
                        ]}
                      />
                      <TextSemiBold
                        text={`${t('common:nz')} ${item.fixed_price_offer}`}
                        textStyle={[
                          Fonts.textLeft,
                          Fonts.poppinMed14,
                          // Gutters.tinyHPadding,
                          {
                            textTransform: 'none',
                            color: Colors.black_232C28,
                            width: sWidth(20),
                          },
                        ]}
                      />

                      <View style={{width: sWidth(10)}}>
                        <CustomCheckBox
                          customStyle={[{borderColor: Colors.primary}]}
                          selected={found}
                          setSelected={select => {
                            if (found) {
                              const updatedIds = mcRecordsIds.filter(
                                id => id !== item?._id,
                              );
                              setMcRecordsIds(updatedIds);
                            } else {
                              let data = JSON.parse(
                                JSON.stringify(mcRecordsIds),
                              );
                              data.push(item?._id);
                              setMcRecordsIds(data);
                              setMcRecordsError('');
                            }
                          }}
                        />
                      </View>

                      <CustomLoading isLoading={isLoadingFecthMotorData} />
                    </View>
                  );
                }}
              />
              {mcRecordsError && (
                <TextSemiBold
                  text={mcRecordsError}
                  textStyle={[
                    Fonts.textLeft,
                    Fonts.poppinMed12,
                    Gutters.tinyVPadding,
                    {textTransform: 'none', color: Colors.red},
                  ]}
                />
              )}
              <CustomButton
                onPress={() => {
                  if (mcRecordsIds.length > 0) {
                    let body = {
                      mc_records_ids: mcRecordsIds,
                    };
                    console.log('>>> body 00  ', body);
                    setMcRecordsDialog(false);
                    setTimeout(() => {
                      setIsLoading(true);
                    }, 50);

                    uploadMotorCentral(body)
                      .then(res => {
                        console.log('>>> res uploadMotorCentral ', res);
                        if (res?.data?.message) {
                          setIsLoading(false);
                          setTimeout(() => {
                            setMcRecordsDialog(false);
                            setMcRecordsDataListing([]);
                          }, 50);
                        }
                      })
                      .finally(() => {
                        setTimeout(() => {
                          setIsLoading(false);
                        }, 50);
                        // getMotorCentral('')
                        //   .then(res => {
                        //     console.log(
                        //       '>> res  getMotorCentral 11 ',
                        //       JSON.stringify(res),
                        //     );
                        //     if (
                        //       res?.data?.motorcentral_records &&
                        //       res?.data?.motorcentral_records.length > 0 &&
                        //       !res?.error?.data?.message
                        //     ) {
                        //       setMcRecordsDataListing(
                        //         res?.data?.motorcentral_records || [],
                        //       );
                        //     } else {
                        //       if (Platform.OS === 'ios') {
                        //         setTimeout(() => {
                        //           setMcRecordsDialog(false);
                        //         }, 400);
                        //       } else {
                        //         setMcRecordsDialog(false);
                        //       }
                        //     }
                        //   })
                        //   .catch(() => {
                        //     if (Platform.OS === 'ios') {
                        //       setTimeout(() => {
                        //         setMcRecordsDialog(false);
                        //       }, 400);
                        //     } else {
                        //       setMcRecordsDialog(false);
                        //     }
                        //   })
                        //   .finally(() => {
                        //     // setIsLoading(false);
                        //   });
                      });
                  } else {
                    setMcRecordsError('Please select atleast one item');
                  }
                }}
                btnStyle={[
                  Gutters.smallTMargin,
                  mcRecordsIds.length < 1 && Gutters.mediumBMargin,
                  {backgroundColor: Colors.dark_gray_676C6A},
                ]}
                text={t('common:submit')}
                textStyle={[Fonts.poppinSemiBold24, {color: Colors.white}]}
              />
              {mcRecordsIds.length > 0 && (
                <CustomButton
                  onPress={() => {
                    setDeleteItemPopUp(true);
                  }}
                  btnStyle={[
                    Gutters.tinyTMargin,
                    Gutters.mediumBMargin,
                    {backgroundColor: Colors.red_F73838},
                  ]}
                  text={t('common:delete_selected')}
                  textStyle={[Fonts.poppinSemiBold24, {color: Colors.white}]}
                />
              )}
              <CustomLoading isLoading={isLoadingDeleteMotorData} />
              <Modal isVisible={deleteItemPopUp}>
                <View style={[Layout.fill, Layout.center]}>
                  {DeleteSelectedItem()}
                </View>
              </Modal>
            </View>
          </CustomBottomSheet>

          <CustomLoading
            isLoading={
              isLoading || isLoadingDealershipID || isLoadingFecthMotorData
            }
          />
        </View>

        <Modal isVisible={deleteProfilePopUp}>
          <View style={[Layout.fill, Layout.center]}>{DeleteProfile()}</View>
        </Modal>
      </View>
    </KeyboardAwareScrollView>
    // </ScreenWrapper>
  );
};

export default UserProfile;
