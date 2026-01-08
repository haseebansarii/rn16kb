import messaging from '@react-native-firebase/messaging';
import {Formik} from 'formik';
import React, {useEffect} from 'react';
import {Platform, TouchableOpacity, View} from 'react-native';
import {
  BackgroundImage,
  CustomCheckBox,
  CustomInput,
  CustomLoading,
  ScreenWrapper,
  TextRegular,
} from '../../../components';
import CustomGradientButton from '../../../components/CustomGradientButton';
import SemiBoldText from '../../../components/SemiBoldText';
import {useTheme} from '../../../hooks';
import {PasswordInterface} from '../../../utils/Interface';
import {sHight} from '../../../utils/ScreenDimentions';
import {PasswordvalidationSchema} from '../../../utils/Validation';

import {useRoute} from '@react-navigation/core';

import {
  useLazyGetMobileSettingQuery,
  useLoginApiMutation,
} from '../../../services/auth/signupApi';
import {toastDangerMessage} from '../../../utils/helpers';
import {useDispatch} from 'react-redux';
import {useLazyGetLoginSaltQuery} from '../../../services/apple_identity';

type Props = {
  navigation: any;
};

const PasswordContainer = ({navigation}: Props) => {
  const {Colors, Layout, Images, Gutters, Fonts} = useTheme();
  const {
    params: {email},
  }: any = useRoute();

  const dispatch = useDispatch();
  const [login, {isLoading}] = useLoginApiMutation();
  const [getLoginSalt] = useLazyGetLoginSaltQuery();
  const [getMobileSettings] = useLazyGetMobileSettingQuery();

  const customEncrypt = async (inputString: any) => {
    let encryptedString = '';

    for (let i = 0; i < inputString.length; i++) {
      const charCode = inputString.charCodeAt(i);
      const encryptedCharCode = charCode + 10; // Custom encryption logic

      encryptedString += String.fromCharCode(encryptedCharCode);
    }

    return encryptedString;
  };

  const submitPassword = async v => {
    let fcmToken = '';
    try {
      fcmToken = await messaging().getToken();
    } catch (error) {}

    // if (!fcmToken) {
    //   toastDangerMessage('FCM Token not generated');
    // }
    const {password} = v;
    const data = {
      email: email,
      password: password,
      current_time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      firebase_token: fcmToken ?? '123',
      platform: Platform.OS,
    };

    await login(data);

    // try {
    //   let createdSalt;
    //   getLoginSalt('').then(async (res: any) => {
    //     if (res?.data?.meta_values) {
    //       let salt = res?.data?.meta_values;
    //       createdSalt = await customEncrypt(salt + email);

    //       await login({...data, salt: createdSalt});
    //     }
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
  };

  useEffect(() => {
    dispatch({type: 'logout'});
    getMobileSettings('');
  }, []);

  return (
    <BackgroundImage>
      <ScreenWrapper>
        <View style={[Layout.fill]}>
          <View
            style={[
              Gutters.mediumVMargin,
              Layout['fill_1/2'],
              Layout.alignItemsCenter,
              Layout.justifyContentEnd,
            ]}>
            <SemiBoldText
              textStyle={[Fonts.poppinSemiBold32, {color: Colors.white}]}
              text={t('common:enter_password')}
            />
          </View>
          <View style={[Gutters.mediumTMargin]}>
            <Formik
              initialValues={PasswordInterface}
              validationSchema={PasswordvalidationSchema}
              onSubmit={(v, {resetForm}) => {
                submitPassword(v);
              }}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                touched,
                errors,
              }) => {
                const {password} = values;
                return (
                  <>
                    <CustomInput
                      headingText={t('common:password')}
                      inputProps={{
                        onChangeText: handleChange('password'),
                        onBlur: handleBlur('password'),
                        value: password,
                      }}
                      headingTextStyle={[
                        Fonts.poppinMed18,
                        {color: Colors.gray_C9C9C9},
                      ]}
                      inputStyle={[Fonts.poppinMed18]}
                      placeholder={'*********'}
                      showPassword={true}
                    />
                    {touched.password && errors.password && (
                      <TextRegular
                        text={errors.password}
                        textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                      />
                    )}
                    <View
                      style={[
                        Gutters.xTinyTMargin,
                        Layout.row,
                        Layout.justifyContentEnd,
                        Layout.alignItemsCenter,
                      ]}>
                      {/* <View style={[Layout.row, Layout.alignItemsCenter]}>
                        <CustomCheckBox setSelected={() => {}} />
                        <TextRegular
                          text={t('common:remember')}
                          textStyle={[
                            Gutters.tinyLMargin,
                            Fonts.poppinReg20,
                            {color: Colors.white},
                          ]}
                        />
                      </View> */}
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('ForgotPassword')}>
                        <TextRegular
                          text={`${t('common:forgot_password')}?`}
                          textStyle={[
                            Gutters.littleLMargin,
                            Fonts.poppinReg20,
                            {color: Colors.white},
                          ]}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={[Gutters.mediumTMargin, Layout.overflow]}>
                      <CustomGradientButton
                        onPress={handleSubmit}
                        text={t('common:login')}
                        textStyle={[Fonts.poppinBold24]}
                      />
                    </View>
                  </>
                );
              }}
            </Formik>

            <View
              style={[
                Layout.row,
                Gutters.smallTMargin,
                Layout.alignItemsCenter,
              ]}>
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
                onPress={() => navigation.navigate('SignUpContainer')}>
                <SemiBoldText
                  textStyle={[
                    Fonts.poppinSemiBold20,
                    Layout.textTransform,
                    {color: Colors.primary},
                  ]}
                  text={t('common:register_now')}
                />
              </TouchableOpacity>
            </View>
          </View>
          <CustomLoading isLoading={isLoading} />
        </View>
      </ScreenWrapper>
    </BackgroundImage>
  );
};

export default PasswordContainer;
