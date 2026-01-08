import {Formik} from 'formik';
import React from 'react';
import {Platform, View} from 'react-native';
import {
  BackgroundImage,
  CustomGradientButton,
  CustomInput,
  CustomLoading,
  ScreenWrapper,
  TextRegular,
} from '../../components';
import BoldText from '../../components/BoldText';
import {useTheme} from '../../hooks';
// import {ResetPasswordInterface} from '../../utils/Interface';
import {sHight} from '../../utils/ScreenDimentions';
import {PasswordMatchValidationSchema} from '../../utils/Validation';

import {useDispatch} from 'react-redux';
import {useChangePassowrdMutation} from '../../services/auth/signupApi';
import {logoutUser} from '../../store/auth/AuthSlice';
import {persistor} from '../../store/store';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

type Props = {
  navigation: any;
};

const ResetPasswordInterface = {
  currPassword: '',
  password: '',
  confirmPassword: '',
};

const ChangePassword = ({navigation}: Props) => {
  const {Colors, Layout, Images, Gutters, Fonts} = useTheme();
  const [changePassword, {isLoading}] = useChangePassowrdMutation();
  const dispatch = useDispatch();

  return (
    <BackgroundImage>
      <View style={[Layout.fill, Gutters.smallHPadding]}>
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
          <Formik
            initialValues={ResetPasswordInterface}
            validationSchema={PasswordMatchValidationSchema}
            onSubmit={(v, {resetForm}) => {
              changePassword({
                payload: {
                  current_password: v?.currPassword,
                  new_password: v?.password,
                  confirm_password: v?.confirmPassword,
                },
              }).then(res => {
                if (res?.data?.message) {
                  // persistor.flush();
                  // persistor.purge();
                  // dispatch(logoutUser());
                  navigation.goBack();
                }
              });
            }}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              touched,
              errors,
            }) => {
              const {password, confirmPassword, currPassword} = values;
              return (
                <>
                  <View
                    style={[
                      Gutters.mediumVMargin,

                      Layout.alignItemsCenter,
                      {
                        justifyContent: 'flex-end',
                        height: sHight(20),
                      },
                    ]}>
                    <BoldText
                      textStyle={[
                        Fonts.poppinSemiBold32,
                        {color: Colors.white},
                      ]}
                      text={t('common:reset_password')}
                    />
                  </View>
                  <CustomInput
                    headingText={t('common:current_password')}
                    headingTextStyle={{color: Colors.white}}
                    inputProps={{
                      onChangeText: handleChange('currPassword'),
                      onBlur: handleBlur('currPassword'),
                      value: currPassword,
                    }}
                    placeholder={t('common:email_phone')}
                    showPassword={true}
                  />
                  {touched.currPassword && errors.currPassword && (
                    <TextRegular
                      text={errors.currPassword}
                      textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                    />
                  )}
                  <View style={[Gutters.smallTMargin]}>
                    <CustomInput
                      headingTextStyle={{color: Colors.white}}
                      headingText={t('common:new_password')}
                      inputProps={{
                        onChangeText: handleChange('password'),
                        onBlur: handleBlur('password'),
                        value: password,
                      }}
                      placeholder={t('common:email_phone')}
                      showPassword={true}
                    />
                    {touched.password && errors.password && (
                      <TextRegular
                        text={errors.password}
                        textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                      />
                    )}
                  </View>
                  <View style={[Gutters.smallTMargin]}>
                    <CustomInput
                      headingText={t('common:confirm_password')}
                      headingTextStyle={{color: Colors.white}}
                      inputProps={{
                        onChangeText: handleChange('confirmPassword'),
                        onBlur: handleBlur('confirmPassword'),
                        value: confirmPassword,
                      }}
                      placeholder={t('common:email_phone')}
                      showPassword={true}
                    />
                    {touched.confirmPassword && errors.confirmPassword && (
                      <TextRegular
                        text={errors.confirmPassword}
                        textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
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
                    ]}></View>
                  <View style={[Gutters.mediumTMargin, Layout.overflow]}>
                    <CustomGradientButton
                      onPress={handleSubmit}
                      text={t('common:submit')}
                      btnStyle={[Layout.fullWidth]}
                      textStyle={[Fonts.poppinBold24]}
                    />
                  </View>
                </>
              );
            }}
          </Formik>
        </KeyboardAwareScrollView>
        <CustomLoading isLoading={isLoading} />
      </View>
    </BackgroundImage>
  );
};

export default ChangePassword;
