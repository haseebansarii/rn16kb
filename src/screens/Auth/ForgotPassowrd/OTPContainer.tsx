import React, {useRef, useState} from 'react';
import {Alert, Platform, TouchableOpacity, View} from 'react-native';
import OTPTextView from 'react-native-otp-textinput';

import i18next from 'i18next';
import {
  BackgroundImage,
  CustomButton,
  CustomGradientButton,
  ScreenWrapper,
  TextBold,
  TextMedium,
  TextRegular,
  TextSemiBold,
} from '../../../../components';
import {useTheme} from '../../../../hooks';
import {sHight, sWidth} from '../../../../utils/ScreenDimentions';
import {useDispatch} from 'react-redux';
import {setStep} from '../../../../store/SignUp';

import {useOTPApiMutation} from '../../../../services/auth/signupApi';

type Props = {
  navigation: any;
  route: any;
};

const OTPContainer = ({navigation, route}: Props) => {
  const {Colors, Layout, Images, Gutters, Fonts} = useTheme();
  const [otpInput, setOtpInput] = useState<string>('');
  const [verifyCode, setverifyCode] = useState<boolean>(false);
  const input = useRef<OTPTextView>(null);
  const dispacth = useDispatch();
  const [checkSignupToken, {isLoading}] = useOTPApiMutation();

  const showTextAlert = () => otpInput && Alert.alert(otpInput);
  // const handleCellTextChange = async (text: string, i: number) => {
  //   if (i === 0) {
  //     const clippedText = await Clipboard.getString();
  //     if (clippedText.slice(0, 1) === text) {
  //       input.current?.setValue(clippedText, true);
  //     }
  //   }
  // };

  const submitToken = () => {
    const data = {
      email: route?.params?.email,
      token: otpInput,
    };
    // dispatch(setLoading(true));
    checkSignupToken(data).then((res: any) => {
      if (res?.data?.message == 'User otp is verified') {
        navigation.navigate('SignUpContainer');
        dispacth(setStep({selectedTab: 2}));
      }
    });
  };

  return (
    <BackgroundImage>
      <ScreenWrapper>
        <View style={[Layout.fill, {width: '90%'}]}>
          <View
            style={[
              Layout.alignItemsCenter,
              Layout['fill_1/4'],
              Gutters.xxtinyTPadding,
              Gutters.smallBPadding,
              Layout.justifyContentEnd,
            ]}>
            <TextBold
              textStyle={[Fonts.poppinSemiBold32, {color: Colors.white}]}
              text={t('common:registeration')}
            />
            <View
              style={[
                Layout.fullWidth,
                Layout.alignItemsCenter,
                Layout.justifyContentEnd,
                {height: sHight(20)},
              ]}>
              {otpInput?.length == 5 && (
                <View
                  style={[
                    Layout.fullWidth,
                    Layout.alignItemsCenter,
                    Layout.justifyContentEnd,
                    {height: sHight(20)},
                  ]}>
                  <Images.svg.verifyOTP.default />
                </View>
              )}
            </View>
          </View>

          <View>
            <View style={[Gutters.regularTMargin]}>
              <OTPTextView
                ref={input}
                containerStyle={[Gutters.smallHPadding]}
                textInputStyle={[
                  {
                    height: Platform.OS === 'ios' ? sHight(6) : sHight(7),
                    backgroundColor: Colors.white,
                    width: sWidth(14),

                    borderRadius: 6,
                    color: Colors.black,
                  },
                ]}
                handleTextChange={setOtpInput}
                handleCellTextChange={handleCellTextChange}
                inputCount={5}
                keyboardType="numeric"
              />
            </View>
            <View style={[Gutters.regularTMargin, Gutters.regularHPadding]}>
              <TextMedium
                textProps={{
                  numberOfLines: 2,
                }}
                textStyle={[
                  Fonts.poppinMed18,
                  {
                    textAlign: 'center',
                    color: verifyCode ? Colors.dark_gray_676C6A : Colors.white,
                  },
                ]}
                text={`${t('common:enter_code')} ${
                  route?.params ? route?.params?.phone : '922 12312321'
                }`}
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
                    {
                      color: verifyCode
                        ? Colors.dark_gray_676C6A
                        : Colors.white,
                    },
                  ]}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[Gutters.tinyLMargin]}
                  disabled={verifyCode}
                  onPress={() =>
                    Alert.alert('Alert', 'Resend Code', [
                      {
                        text: 'Cancel',
                        onPress: () => console.log('resendCode'),
                      },
                      {
                        text: 'OK',
                        onPress: () => console.log('resendCode'),
                      },
                    ])
                  }>
                  <TextSemiBold
                    text={t('common:send_again')}
                    textStyle={[
                      Fonts.poppinSemiBold20,
                      {
                        color: verifyCode
                          ? Colors.dark_gray_676C6A
                          : Colors.primary,
                      },
                    ]}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={[Gutters.smallLMargin]}>
            {otpInput?.length == 5 ? (
              <CustomGradientButton
                onPress={() => submitToken()}
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
          <View style={[Layout.row, Gutters.smallTMargin, Layout.center]}>
            <TextRegular
              textStyle={[Fonts.poppinReg18, {color: Colors.gray_C9C9C9}]}
              text={t('common:have_account')}
            />
            <TouchableOpacity
              style={[Gutters.littleLMargin]}
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
      </ScreenWrapper>
    </BackgroundImage>
  );
};

export default OTPContainer;
