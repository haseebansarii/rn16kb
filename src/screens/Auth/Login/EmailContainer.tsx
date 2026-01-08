import {Formik} from 'formik';
import React, {useEffect} from 'react';
import {
  Platform,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  BackgroundImage,
  CustomButton,
  CustomInput,
  ScreenWrapper,
  TextRegular,
} from '../../../components';
import CustomGradientButton from '../../../components/CustomGradientButton';
import SemiBoldText from '../../../components/SemiBoldText';
import {useTheme} from '../../../hooks';
import {EmailInterface} from '../../../utils/Interface';
import {sHight} from '../../../utils/ScreenDimentions';
import {EmailvalidationSchema} from '../../../utils/Validation';
import {
  clearSignUpData,
  setClearSignUpBasic,
  setStep,
  setStepInitial,
  storeSubscriptionPlans,
} from '../../../store/SignUp';
import appleAuth, {
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import DeviceInfo from 'react-native-device-info';
import {
  useAppleIdentitySavedMutation,
  useLazyGetAppleIdentityQuery,
  useLazyGetLoginSaltQuery,
} from '../../../services/apple_identity';
import jwt_decode from 'jwt-decode';
import {useLoginApiMutation} from '../../../services/auth/signupApi';
import messaging from '@react-native-firebase/messaging';

type Props = {
  navigation: any;
};

const EmailContainer = ({navigation}: Props) => {
  const {Colors, Layout, Images, Gutters, Fonts} = useTheme();

  const dispatch = useDispatch();

  const {firstStep} = useSelector((state: any) => state.signup.step);

  const [getAppleIdentity] = useLazyGetAppleIdentityQuery();
  const [appleIdentity] = useAppleIdentitySavedMutation();
  const [getLoginSalt] = useLazyGetLoginSaltQuery();
  const [login, {isLoading}] = useLoginApiMutation();

  const loginEmail = v => {
    const {email} = v;
    navigation.navigate('PasswordContainer', {
      email,
    });
  };

  const customEncrypt = async (inputString: any) => {
    let encryptedString = '';

    for (let i = 0; i < inputString.length; i++) {
      const charCode = inputString.charCodeAt(i);
      const encryptedCharCode = charCode + 10; // Custom encryption logic

      encryptedString += String.fromCharCode(encryptedCharCode);
    }

    return encryptedString;
  };

  async function onAppleButtonPress(process: any) {
    console.warn('Beginning Apple Authentication');
    const deviceId = await DeviceInfo.getUniqueId();

    // start a login request
    try {
      const appleAuthRequestResponse: any = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      console.log(
        'appleAuthRequestResponse',
        appleAuthRequestResponse?.identityToken,
      );

      // e.g. sign in with Firebase Auth using `nonce` & `identityToken`
      var decoded: any = jwt_decode(appleAuthRequestResponse?.identityToken);
      console.log(decoded, 'checking decoded data ');
      if (!!appleAuthRequestResponse?.email) {
        appleIdentity({
          email: appleAuthRequestResponse?.email,
          first_name: appleAuthRequestResponse?.fullName?.givenName,
          last_name: appleAuthRequestResponse?.fullName?.familyName,
          token: deviceId.toString(),
        }).then((response: any) => {
          console.log(response, 'response in then');
          if (
            response?.data?.message == 'apple identity created successfully'
          ) {
            try {
              let createdSalt;
              getLoginSalt('').then(async (res: any) => {
                console.log(res, 'resddddd');
                if (res?.data?.meta_values) {
                  let userEmail = decoded?.email;
                  let salt = res?.data?.meta_values;
                  createdSalt = await customEncrypt(salt + userEmail);
                  let fcmToken = '';
                  try {
                    fcmToken = await messaging().getToken();
                  } catch (error) {}

                  const data = {
                    email: userEmail,
                    salt: createdSalt,
                    current_time_zone:
                      Intl.DateTimeFormat().resolvedOptions().timeZone,
                    firebase_token: fcmToken ?? '123',
                    platform: Platform.OS,
                  };
                  if (process == 'login') {
                    await login(data as any);
                  } else {
                    dispatch(setStepInitial({}));
                    dispatch(clearSignUpData({}));
                    dispatch(setClearSignUpBasic({}));
                    storeSubscriptionPlans([]);
                    dispatch(setStepInitial({}));
                    dispatch(clearSignUpData({}));
                    dispatch(setClearSignUpBasic({}));
                    storeSubscriptionPlans([]);
                    dispatch(
                      setStep({
                        firstStep: {
                          ...firstStep,
                          email: userEmail,
                          first_name:
                            appleAuthRequestResponse?.fullName?.givenName,
                          last_name:
                            appleAuthRequestResponse?.fullName?.familyName,
                        },
                      }),
                    );
                    navigation.navigate('SignUpContainer');
                  }
                }
              });
            } catch (error) {
              console.log(error);
            }
          }
        });
      } else {
        getAppleIdentity(deviceId.toString()).then((response: any) => {
          if (response?.isSuccess == true && response?.status == 'fulfilled') {
            try {
              let createdSalt;
              getLoginSalt('').then(async (res: any) => {
                if (res?.data?.meta_values) {
                  let userEmail =
                    decoded?.email !== undefined
                      ? decoded?.email
                      : response?.data?.identity?.email;
                  let salt = res?.data?.meta_values;
                  createdSalt = await customEncrypt(salt + userEmail);
                  let fcmToken = '';
                  try {
                    fcmToken = await messaging().getToken();
                  } catch (error) {}

                  const data = {
                    email: userEmail,
                    salt: createdSalt,
                    current_time_zone:
                      Intl.DateTimeFormat().resolvedOptions().timeZone,
                    firebase_token: fcmToken ?? '123',
                    platform: Platform.OS,
                  };
                  if (process == 'login') {
                    await login(data as any);
                  } else {
                    dispatch(setStepInitial({}));
                    dispatch(clearSignUpData({}));
                    dispatch(setClearSignUpBasic({}));
                    storeSubscriptionPlans([]);
                    dispatch(setStepInitial({}));
                    dispatch(clearSignUpData({}));
                    dispatch(setClearSignUpBasic({}));
                    storeSubscriptionPlans([]);
                    dispatch(
                      setStep({
                        firstStep: {
                          ...firstStep,
                          email: response?.data?.identity?.email,
                          first_name: response?.data?.identity?.first_name,
                          last_name: response?.data?.identity?.last_name,
                        },
                      }),
                    );
                    navigation.navigate('SignUpContainer');
                  }
                }
              });
            } catch (error) {
              console.log(error);
            }
          }
        });
      }
    } catch (error: any) {
      if (error.code === appleAuth.Error.CANCELED) {
        console.warn('User canceled Apple Sign in.');
      } else {
        console.log('error in something', error);
      }
    }
  }

  useEffect(() => {
    // onCredentialRevoked returns a function that will remove the event listener. useEffect will call this function when the component unmounts
    // return (
    //   Platform.OS == 'ios' &&
    //   appleAuth.onCredentialRevoked(async () => {
    //     console.log(
    //       'If this function executes, User Credentials have been Revoked',
    //     );
    //   })
    // );
  }, []);

  return (
    <BackgroundImage>
      <ScreenWrapper>
        <View style={[Layout.fill]}>
          <View
            style={[
              Gutters.mediumVMargin,
              Layout['fill_1/3'],
              Layout.alignItemsCenter,
              {
                justifyContent: 'flex-end',
              },
            ]}>
            <Image
              source={Images.png.isqrollLogo}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <View>
            <Formik
              initialValues={EmailInterface}
              validationSchema={EmailvalidationSchema}
              onSubmit={(v, {resetForm}) => {
                loginEmail(v);
              }}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                touched,
                errors,
              }) => {
                const {email} = values;
                return (
                  <>
                    <CustomInput
                      headingText={t('common:enter_email')}
                      inputProps={{
                        onChangeText: handleChange('email'),
                        onBlur: handleBlur('email'),
                        value: email,
                      }}
                      headingTextStyle={[
                        Fonts.poppinMed18,
                        {color: Colors.gray_C9C9C9},
                      ]}
                      inputStyle={[Fonts.poppinMed18]}
                      placeholder={t('common:enter_email')}
                      showPassword={false}
                    />
                    {touched.email && errors.email && (
                      <TextRegular
                        text={errors.email}
                        textStyle={[
                          // Layout.textTransformNone,
                          {color: Colors.red, marginLeft: sHight(1)},
                        ]}
                      />
                    )}

                    <View style={[Gutters.mediumTMargin, Layout.overflow]}>
                      <CustomGradientButton
                        onPress={handleSubmit}
                        text={t('common:continue')}
                        textStyle={[Fonts.poppinBold24, {color: Colors.white}]}
                      />

                      {/* <CustomButton
                        onPress={() => {
                          dispatch(setGuest(true));
                        }}
                        btnStyle={[Gutters.xRegularTMargin]}
                        text={t('common:continue_as_guest')}
                        textStyle={[
                          Fonts.poppinBold24,
                          {color: Colors.gray_C9C9C9},
                        ]}
                      /> */}
                    </View>
                  </>
                );
              }}
            </Formik>

            <View style={[Gutters.mediumTMargin, Layout.overflow]}>
              <CustomGradientButton
                text="CONTINUE AS A GUEST"
                onPress={() => {
                  // navigation.goBack();
                  // dispatch(setGuest(true));
                  navigation.navigate('HomeContainer');
                }}
                textStyle={[Fonts.poppinBold24, {color: Colors.white}]}
              />
            </View>
            <View style={[Layout.fullWidth, Gutters.smallTMargin]}>
              <View style={[Layout.row, Layout.alignItemsCenter]}>
                <TextRegular
                  textStyle={[
                    Fonts.poppinReg18,
                    Layout.textTransfromNone,
                    {color: Colors.gray_C9C9C9},
                  ]}
                  text={t('common:dont_have_account')}
                />
                <TouchableOpacity
                  style={[Gutters.littleLMargin]}
                  activeOpacity={0.8}
                  onPress={() => {
                    dispatch(setStepInitial({}));
                    dispatch(clearSignUpData({}));
                    dispatch(setClearSignUpBasic({}));
                    storeSubscriptionPlans([]);
                    navigation.navigate('SignUpContainer');
                    // if (Platform.OS == 'ios') {
                    //   onAppleButtonPress('register');
                    // } else {
                    //   dispatch(setStepInitial({}));
                    //   dispatch(clearSignUpData({}));
                    //   dispatch(setClearSignUpBasic({}));
                    //   storeSubscriptionPlans([]);
                    //   navigation.navigate('SignUpContainer');
                    // }
                  }}>
                  <SemiBoldText
                    textStyle={[
                      Fonts.poppinSemiBold18,
                      {color: Colors.primary, textTransform: 'capitalize'},
                    ]}
                    text={t('common:register_now')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScreenWrapper>
    </BackgroundImage>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: '100%',
    height: undefined,
    aspectRatio: 375 / 200,
  },
});

export default EmailContainer;
