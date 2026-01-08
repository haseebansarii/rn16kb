import {Formik} from 'formik';
import React from 'react';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import {
  BackgroundImage,
  CustomInput,
  CustomLoading,
  ScreenWrapper,
  TextRegular,
} from '../../../components';
import BoldText from '../../../components/BoldText';
import CustomGradientButton from '../../../components/CustomGradientButton';
import RegularText from '../../../components/RegularText';
import SemiBoldText from '../../../components/SemiBoldText';
import {useTheme} from '../../../hooks';

import {
  useForgotPasswordMutation,
  useSendOTPMutation,
} from '../../../services/auth/signupApi';
import {OTPInterface} from '../../../utils/Interface';
import {sHight} from '../../../utils/ScreenDimentions';
import {OTPValidationSchema} from '../../../utils/Validation';

type Props = {
  navigation: any;
  route: any;
};

const VerifyCode = ({navigation, route}: Props) => {
  const {Colors, Layout, Images, Gutters, Fonts} = useTheme();
  const [sendOtp, {isLoading}] = useSendOTPMutation();
  const [forgotPassword, {isLoading: loading}] = useForgotPasswordMutation();
  const data = route.params;

  const verifyCode = v => {
    let reqObj = {
      ...data,
      token: v.otpCode,
      key: 'forget-password',
    };
    sendOtp({payload: reqObj}).then(res => {
      if (res?.data?.message) {
        navigation.navigate('ResetPassword', {token: v.otpCode, ...data});
      }
    });
  };

  const resendCode = () => {
    forgotPassword({...data});
  };

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
            <BoldText
              textStyle={[Fonts.poppinSemiBold32, {color: Colors.white}]}
              text={t('common:reset_password')}
            />
          </View>
          <View style={[Layout.center, Gutters.smallHPadding]}>
            <RegularText
              text={t('common:verify_email')}
              textStyle={[
                Fonts.poppinReg18,
                Gutters.littleBMargin,
                {textAlign: 'center', color: Colors.gray_C9C9C9},
              ]}
            />
          </View>
          <View style={[Gutters.mediumTMargin]}>
            <Formik
              initialValues={OTPInterface}
              validationSchema={OTPValidationSchema}
              onSubmit={(v, {resetForm}) => {
                verifyCode(v);
              }}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                touched,
                errors,
              }) => {
                const {otpCode} = values;
                return (
                  <>
                    <CustomInput
                      headingText={t('common:verification_code')}
                      inputProps={{
                        onChangeText: handleChange('otpCode'),
                        onBlur: handleBlur('otpCode'),
                        value: otpCode,
                        keyboardType: 'number-pad',
                        maxLength: 5,
                      }}
                      inputStyle={[Fonts.poppinMed18]}
                      headingTextStyle={[
                        Fonts.poppinMed18,
                        {color: Colors.gray_C9C9C9},
                      ]}
                      placeholder={'*****'}
                      showPassword={true}
                    />
                    {touched.otpCode && errors.otpCode && (
                      <TextRegular
                        text={errors.otpCode}
                        textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                      />
                    )}

                    <View style={[Gutters.xRegularTMargin, Layout.overflow]}>
                      <CustomGradientButton
                        onPress={handleSubmit}
                        text={t('common:confirm')}
                        textStyle={[Fonts.poppinBold24, {color: Colors.white}]}
                      />
                    </View>
                  </>
                );
              }}
            </Formik>
          </View>
          <View style={[Layout.alignItemsCenter]}>
            {loading ? (
              <View style={[Gutters.xRegularTMargin]}>
                <ActivityIndicator size={'large'} color={Colors.primary} />
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={resendCode}
                style={[Gutters.xRegularTMargin]}>
                <SemiBoldText
                  textStyle={[Fonts.poppinSemiBold20, {color: Colors.primary}]}
                  text={t('common:resend_code')}
                />
              </TouchableOpacity>
            )}
          </View>

          <CustomLoading isLoading={isLoading} />
        </View>
      </ScreenWrapper>
    </BackgroundImage>
  );
};

export default VerifyCode;
