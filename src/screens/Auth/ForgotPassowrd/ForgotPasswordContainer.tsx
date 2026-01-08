import {Formik} from 'formik';
import React from 'react';
import {Platform, TouchableOpacity, View} from 'react-native';
import {
  BackgroundImage,
  CustomInput,
  CustomLoading,
  ScreenWrapper,
  TextRegular,
} from '../../../components';
import BoldText from '../../../components/BoldText';
import CustomGradientButton from '../../../components/CustomGradientButton';
import SemiBoldText from '../../../components/SemiBoldText';
import {useTheme} from '../../../hooks';
import {useForgotPasswordMutation} from '../../../services/auth/signupApi';
import {EmailInterface} from '../../../utils/Interface';
import {sHight} from '../../../utils/ScreenDimentions';
import {EmailvalidationSchema} from '../../../utils/Validation';

type Props = {
  navigation: any;
};

const ForgotPassword = ({navigation}: Props) => {
  const {Colors, Layout, Images, Gutters, Fonts} = useTheme();
  const [forgotPassword, {isLoading}] = useForgotPasswordMutation();

  const loginEmail = v => {
    forgotPassword(v).then(res => {
      if (res?.data?.message) {
        navigation.navigate('VerifyCode', {email: v.email});
      }
    });
  };

  return (
    <BackgroundImage>
      <ScreenWrapper>
        <View style={[Layout.fill]}>
          <View
            style={[
              Gutters.mediumVMargin,
              Layout['fill'],
              Layout.alignItemsCenter,
              Layout.justifyContentEnd,
            ]}>
            <BoldText
              textStyle={[Fonts.poppinSemiBold32, {color: Colors.white}]}
              text={t('common:forgot_password')}
            />
          </View>
          <View style={[Gutters.mediumTMargin]}>
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
                      headingText={t('common:enter_your_email')}
                      inputProps={{
                        onChangeText: handleChange('email'),
                        onBlur: handleBlur('email'),
                        value: email,
                      }}
                      inputStyle={[Fonts.poppinMed18]}
                      headingTextStyle={[
                        Fonts.poppinMed18,
                        Layout.textTransfromNone,
                        {color: Colors.gray_C9C9C9},
                      ]}
                      placeholder={'Enter your Email'}
                      showPassword={false}
                    />
                    {touched.email && errors.email && (
                      <TextRegular
                        text={errors.email}
                        textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                      />
                    )}

                    <View style={[Gutters.xRegularTMargin, Layout.overflow]}>
                      <CustomGradientButton
                        onPress={handleSubmit}
                        text={t('common:continue')}
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
                textStyle={[Fonts.poppinReg18, {color: Colors.gray_C9C9C9}]}
                text={t('common:dont_have_account')}
              />
              <TouchableOpacity
                style={[Gutters.littleLMargin]}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('SignUpContainer')}>
                <SemiBoldText
                  textStyle={[
                    Fonts.poppinSemiBold20,
                    Layout.textTransfrom,
                    {color: Colors.primary},
                  ]}
                  text={t('common:register_now')}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{height: sHight(15)}} />
          <View
            style={[
              Layout.fill,
              Layout.alignItemsCenter,
              {
                justifyContent: 'flex-end',
              },
            ]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('EmailContainer')}
              style={[Platform.OS === 'ios' && Gutters.xRegularBMargin]}>
              <SemiBoldText
                textStyle={[
                  Fonts.poppinSemiBold24,
                  {color: Colors.gray_C9C9C9},
                ]}
                text={t('common:login')}
              />
            </TouchableOpacity>
          </View>
          <CustomLoading isLoading={isLoading} />
        </View>
      </ScreenWrapper>
    </BackgroundImage>
  );
};

export default ForgotPassword;
