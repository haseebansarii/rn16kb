import {Formik} from 'formik';
import React, {useState} from 'react';
import {Platform, TouchableOpacity, View} from 'react-native';
import {
  BackgroundImage,
  CustomCheckBox,
  CustomInput,
  CustomLoading,
  ScreenWrapper,
  TextRegular,
} from '../../../components';
import BoldText from '../../../components/BoldText';
import CustomGradientButton from '../../../components/CustomGradientButton';
import SemiBoldText from '../../../components/SemiBoldText';
import {useTheme} from '../../../hooks';

import {useResetPasswordMutation} from '../../../services/auth/signupApi';
import {ResetPasswordInterface} from '../../../utils/Interface';
import {sHight} from '../../../utils/ScreenDimentions';
import {ResetPasswordMatchValidationSchema} from '../../../utils/Validation';

type Props = {
  navigation: any;
  route: any;
};

const ResetPassword = ({navigation, route}: Props) => {
  const {Colors, Layout, Images, Gutters, Fonts} = useTheme();
  const [resetPassword, {isLoading}] = useResetPasswordMutation();
  const [selected, setSelected] = useState(false);
  const data = route.params;

  const submitPassword = v => {
    let reqObj = {
      password: v.password,
      confirm_password: v.confirmPassword,
      email: data?.email,
    };

    resetPassword({
      payload: reqObj,
      code: data?.token,
    }).then((res: any) => {
      if (res?.data?.message) {
        navigation.navigate('EmailContainer');
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
            <SemiBoldText
              textStyle={[Fonts.poppinSemiBold32, {color: Colors.white}]}
              text={t('common:set_new_password')}
            />
          </View>
          <View style={[Gutters.mediumTMargin]}>
            <Formik
              initialValues={ResetPasswordInterface}
              validationSchema={ResetPasswordMatchValidationSchema}
              onSubmit={submitPassword}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                touched,
                errors,
              }) => {
                const {password, confirmPassword} = values;
                return (
                  <>
                    <CustomInput
                      headingText={t('common:new_password')}
                      inputProps={{
                        onChangeText: handleChange('password'),
                        onBlur: handleBlur('password'),
                        value: password,
                      }}
                      inputStyle={[Fonts.poppinMed18]}
                      headingTextStyle={[
                        Fonts.poppinMed18,
                        {color: Colors.gray_C9C9C9},
                      ]}
                      placeholder={t('common:email_phone')}
                      showPassword={true}
                    />
                    {touched.password && errors.password && (
                      <TextRegular
                        text={errors.password}
                        textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                      />
                    )}
                    <View style={[Gutters.smallTMargin]}>
                      <CustomInput
                        headingText={t('common:confirm_password')}
                        inputProps={{
                          onChangeText: handleChange('confirmPassword'),
                          onBlur: handleBlur('confirmPassword'),
                          value: confirmPassword,
                        }}
                        headingTextStyle={[
                          Fonts.poppinMed18,
                          {color: Colors.gray_C9C9C9},
                        ]}
                        placeholder={t('common:email_phone')}
                        showPassword={true}
                      />
                      {touched.confirmPassword && errors.confirmPassword && (
                        <TextRegular
                          text={errors.confirmPassword}
                          textStyle={[
                            {color: Colors.red, marginLeft: sHight(1)},
                          ]}
                        />
                      )}
                    </View>
                    <View
                      style={[
                        Gutters.xTinyTMargin,
                        Layout.row,
                        Layout.justifyContentBetween,
                        Layout.alignItemsCenter,
                        {},
                      ]}>
                      {/* <View style={[Layout.row, Layout.alignItemsCenter]}>
                        <CustomCheckBox
                          selected={selected}
                          setSelected={setSelected}
                          isCard={true}
                        />
                        <TextRegular
                          text={t('common:remember')}
                          textStyle={[
                            Gutters.tinyLMargin,
                            Fonts.poppinReg20,
                            {color: Colors.white},
                          ]}
                        />
                      </View> */}
                    </View>
                    <View style={[Gutters.mediumTMargin, Layout.overflow]}>
                      <CustomGradientButton
                        onPress={handleSubmit}
                        text={t('common:submit')}
                        btnStyle={[Layout.fullWidth]}
                        textStyle={[Fonts.poppinBold24, {color: Colors.white}]}
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
                    Layout.textTransfrom,
                    {color: Colors.primary},
                  ]}
                  text={t('common:register_now')}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={[
              Layout.fill,
              Layout.alignItemsCenter,
              {justifyContent: 'flex-end'},
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

export default ResetPassword;
