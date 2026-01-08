import React, {useRef, useState} from 'react';
import {Alert, Platform, TouchableOpacity, View} from 'react-native';
import {OtpInput} from 'react-native-otp-entry';

import i18next from 'i18next';
import {useDispatch, useSelector} from 'react-redux';
import {
  BackgroundImage,
  CustomButton,
  CustomGradientButton,
  CustomLoading,
  ScreenWrapper,
  TextBold,
  TextMedium,
  TextRegular,
  TextSemiBold,
} from '../../../../components';
import {useTheme} from '../../../../hooks';
import {setStep} from '../../../../store/SignUp';
import {sHight, sWidth} from '../../../../utils/ScreenDimentions';

import {
  useOTPApiMutation,
  useResendOTPMutation,
} from '../../../../services/auth/signupApi';

type Props = {
  navigation: any;
  route: any;
};

const OTPContainer = ({navigation, route}: Props) => {
  const {Colors, Layout, Images, Gutters, Fonts} = useTheme();
  const [otpInput, setOtpInput] = useState<string>('');
  const [verifyCode, setverifyCode] = useState<boolean>(false);
  const input = useRef(null);
  const [checkSignupToken, {isLoading}] = useOTPApiMutation();
  const [resendOTP, {isLoading: loading}] = useResendOTPMutation();
  const dispatch = useDispatch();
  const {firstStep} = useSelector(state => state.signup.step);
  // const showTextAlert = () => otpInput && Alert.alert(otpInput);
  // const handleCellTextChange = async (text: string, i: number) => {
  //   if (i === 0) {
  //     const clippedText = await Clipboard.getString();
  //     if (clippedText.slice(0, 1) === text) {
  //       input.current?.setValue(clippedText, true);
  //     }
  //   }
  // };
  const submitToken = (token: string) => {
    const data = {
      phone_number: firstStep.phone_number,
      email: firstStep.email,
      token,
      key: 'register',
    };
    checkSignupToken(data).then(res => {
      input.current?.clear();
      setOtpInput('');
      if (res.data.message === 'OTP is verified') {
        dispatch(
          setStep({
            selectedTab: 3,
            isNumberVerified: true,
            isEmailVerified: true,
          }),
        );
      }
    });
  };

  const resendOTPCode = async () => {
    const data = {
      phone_number: firstStep.phone_number,
      email: firstStep.email,
      token: otpInput,
      key: 'register',
    };
    resendOTP(data);
  };
  return (
    <>
      <View style={[{width: '90%'}]}>
        <View
          style={[
            Layout.alignItemsCenter,
            Gutters.xxtinyTPadding,
            Gutters.smallBPadding,
          ]}>
          <TextBold
            textStyle={[Fonts.poppinSemiBold32, {color: Colors.white}]}
            text={''}
          />
          {otpInput?.length == 5 && (
            <View
              style={[
                Layout.fullWidth,
                Layout.alignItemsCenter,
                Layout.justifyContentEnd,
              ]}></View>
          )}
        </View>

        <View>
          <View style={[Gutters.regularTMargin]}>
            <OtpInput
              ref={input}
              onTextChange={text => setOtpInput(text)}
              numberOfDigits={5}
              type="numeric"
              autoFocus={true}
              blurOnFilled={true}
              onFilled={submitToken}
              theme={{
                pinCodeContainerStyle: {
                  height: Platform.OS === 'ios' ? sHight(6) : sHight(7),
                  backgroundColor: Colors.white,
                  width: sWidth(14),
                  borderRadius: 6,
                  color: Colors.black,
                },
              }}
            />
          </View>
          <View style={[Gutters.regularTMargin]}>
            <TextMedium
              textProps={{
                numberOfLines: 2,
              }}
              textStyle={[
                Fonts.poppinMed18,
                {
                  textAlign: 'center',
                  color:
                    otpInput?.length == 5
                      ? Colors.dark_gray_676C6A
                      : Colors.white,
                },
              ]}
              text={`${t('common:enter_code')} ${firstStep.phone_number}`}
            />
            <View
              style={[
                Gutters.regularVMargin,
                Layout.center,
                i18next.language === 'en' ? Layout.row : Layout.rowReverse,
              ]}>
              <TextSemiBold
                text={t('common:did_not_recieve')}
                textStyle={[
                  Fonts.poppinSemiBold20,
                  Gutters.littleRMargin,
                  {
                    color:
                      otpInput?.length == 5
                        ? Colors.dark_gray_676C6A
                        : Colors.white,
                  },
                ]}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                disabled={verifyCode}
                onPress={() => resendOTPCode()}>
                <TextSemiBold
                  text={t('common:send_again')}
                  textStyle={[
                    Fonts.poppinSemiBold20,

                    {
                      color:
                        otpInput?.length == 5
                          ? Colors.dark_gray_676C6A
                          : Colors.primary,
                    },
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View>
          {otpInput?.length == 5 ? (
            <CustomGradientButton
              onPress={() => submitToken(otpInput)}
              text={t('common:continue')}
              textStyle={[Fonts.poppinBold24]}
            />
          ) : (
            <CustomButton
              onPress={() => {}}
              btnProps={[{disabled: !verifyCode}]}
              text={t('common:continue')}
            />
          )}
        </View>
        <View style={[Layout.rowHCenter, Gutters.smallTMargin, Layout.center]}>
          <TextRegular
            textStyle={[Fonts.poppinReg18, {color: Colors.gray_C9C9C9}]}
            text={t('common:have_account')}
          />
          <TouchableOpacity
            style={[Gutters.littleLMargin, {marginTop: -5}]}
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate('EmailContainer');
            }}>
            <TextSemiBold
              textStyle={[
                Fonts.poppinSemiBold20,
                {color: Colors.primary, textTransform: 'capitalize'},
              ]}
              text={t('common:login')}
            />
          </TouchableOpacity>
        </View>
      </View>
      <CustomLoading isLoading={isLoading || loading} />
    </>
  );
};

export default OTPContainer;
