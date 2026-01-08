import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BackgroundImage,
  CustomBottomSheet,
  CustomButton,
  ScreenWrapper,
  TextBold,
  TextMedium,
  TextRegular,
  TextSemiBold,
} from '../../../components';
import {useTheme} from '../../../hooks';

import ImagePicker from 'react-native-image-crop-picker';
import {useDispatch, useSelector} from 'react-redux';

import AboutSelf from './AboutSelf';
import CreateAccount from './CreateAccount';
import StepsSignUp from './StepsSignUp';
import Subscription from './Subscription';
import CreditCardView from './CreditCardView';
import CreditCard from './CreditCard';
import OTPContainer from './OTP/OTPContainer';
import i18next from 'i18next';
import SemiBoldText from '../../../components/SemiBoldText';
import {RootState} from '../../../store/store';

import {
  setClearSignUpBasic,
  setSignUpUser,
  setStripeCard,
} from '../../../store/SignUp';
import SubscriptionPlan from './SubscriptionPlan';
import {useLazyGetSubscriptionPlansQuery} from '../../../services/auth/signupApi';
import {toastDangerMessage} from '../../../utils/helpers';
import {imageUploading} from '../../../store/auth/AuthSlice';
import {axiosUploadImagesMutation} from '../../../services/submitForms/imageUploadFormAxios';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

type Props = {
  navigation: any;
};

const SignUpContainer = ({navigation}: Props) => {
  const {Colors, Fonts, Gutters, Images, Layout} = useTheme();
  const scrollRef = useRef<KeyboardAwareScrollView>(null);
  const [userImage, setUserImage] = useState<any>();
  const [loading, setLoading] = useState(false);

  const [getSubscriptionPlans] = useLazyGetSubscriptionPlansQuery();
  const {step, subscription, signUpBasic, stripeCard} = useSelector(
    (state: RootState) => state.signup,
  );
  const dispatch = useDispatch();

  const imagePicker = () => {
    setLoading(true);
    ImagePicker.openPicker({
      width: 200,
      height: 200,
      // cropping: true,
      compressImageQuality: Platform.OS === 'android' ? 0.5 : 0.4,
      compressImageFormat: 'jpeg',
    })
      .then(result => {
        const photo: any = {
          //   name:
          //   Platform.OS === 'ios'
          //     ? result?.filename
          //     : result?.path.split('/')[11],
          // type: result?.mime,
          // uri: Platform.OS == 'ios' ? result?.sourceURL : result?.path,
          name: result?.path?.split('/').pop(),
          type: result?.mime,
          uri: result?.path,
        };
        setUserImage(photo);
        uploadImages(photo);
      })
      .catch(err => {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      });
  };

  const uploadImages = async (temp: Object) => {
    if (temp?.type?.includes('image') || temp?.type?.includes('jpeg')) {
      const form_data = new FormData();
      console.log(temp);
      form_data.append('files', temp);
      form_data.append('Content-Disposition', 'form-data');
      form_data.append('Content-Type', 'image/png');

      // dispatch(imageUploading(true));
      setTimeout(() => {
        axiosUploadImagesMutation(form_data)
          .then(res => {
            // dispatch(imageUploading(false));
            if (res?.data?.document && res?.data?.document[0]) {
              console.log(res?.data, 'image uploaded successfully');
              dispatch(setSignUpUser({photo: res?.data?.document[0]}));
              setTimeout(() => {
                setLoading(false);
              }, 500);
            } else {
              setTimeout(() => {
                setLoading(false);
              }, 500);
            }
          })
          .catch(err => {
            // dispatch(imageUploading(false));
            console.log(err, 'error in image uploading 55 ');
            setTimeout(() => {
              setLoading(false);
            }, 500);
          });
      }, 1000);
    } else {
      toastDangerMessage('Please select image type');
      setLoading(false);
    }
  };

  useEffect(() => {
    getSubscriptionPlans('');
  }, []);

  const scrollToTop = () => {
    scrollRef.current?.scrollToPosition(0, 0, true);
    // if (Platform.OS === 'ios') {
    //   setTimeout(() => {
    //     scrollRef.current?.scrollToPosition(0, 0, true);
    //   }, 400);
    // } else {
    //   scrollRef.current?.scrollToPosition(0, 0, true);
    // }
  };
  const scrollToEnd = () => {
    // Scrolls to the bottom

    scrollRef.current?.scrollToEnd({animated: true});
    // if (Platform.OS === 'ios') {
    //   setTimeout(() => {
    //     scrollRef.current?.scrollToEnd({animated: true});
    //   }, 400);
    // } else {
    //   scrollRef.current?.scrollToEnd({animated: true});
    // }
  };

  return (
    <BackgroundImage>
      <KeyboardAwareScrollView
        ref={scrollRef}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps={'always'}
        contentContainerStyle={[Layout.flexGrow, Gutters.tinyHPadding]}
        style={[Layout.fill, {marginHorizontal: '1%'}]}
        extraScrollHeight={Platform.OS === 'android' ? 70 : 100}>
        <TouchableOpacity
          onPress={Keyboard.dismiss}
          accessible={false}
          activeOpacity={1}>
          <View style={[Layout.alignItemsCenter, Gutters.smallTPadding]}>
            <SemiBoldText
              text={t('common:create_account')}
              textStyle={[
                Fonts.poppinSemiBold32,
                Gutters.smallBMargin,
                {color: Colors.white},
              ]}
            />
            {/* 
            <TouchableOpacity
              onPress={imagePicker}
              activeOpacity={0.8}
              style={[
                Layout.center,
                Layout.overflow,
                Gutters.smallVMargin,
                {
                  backgroundColor: Colors.black_232C28,
                  width: 92,
                  height: 92,
                  borderRadius: 10,
                },
              ]}>
              {userImage?.uri ? (
                <>
                  {loading ? (
                    <View
                      style={[
                        Layout.fullWidth,
                        Layout.center,
                        Layout.fullHeight,
                      ]}>
                      <ActivityIndicator
                        color={Colors.primary}
                        size={'small'}
                      />
                    </View>
                  ) : (
                    <Image
                      source={{uri: userImage?.uri}}
                      resizeMode="cover"
                      style={[Layout.fullWidth, Layout.fullHeight]}
                    />
                  )}
                </>
              ) : (
                <Images.svg.imagePicker.default />
              )}
            </TouchableOpacity>
             */}
          </View>
          <StepsSignUp />
          <View
            style={[
              Layout.fill,
              Layout.alignItemsCenter,
              Gutters.xTinyTMargin,
            ]}>
            {step.selectedTab == 1 ? (
              <CreateAccount
                // setUserImage={setUserImage}
                navigation={navigation}
                scrollToTop={scrollToTop}
                scrollToEnd={scrollToEnd}
              />
            ) : step.selectedTab == 2 ? (
              <OTPContainer navigation={navigation} route={{}} />
            ) : (
              step.selectedTab == 3 && <AboutSelf navigation={navigation} />
            )}
          </View>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </BackgroundImage>
  );
};

export default SignUpContainer;
