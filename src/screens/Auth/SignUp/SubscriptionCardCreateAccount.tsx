import i18next from 'i18next';
import React, {ReactNode, useEffect, useState} from 'react';
import {
  Alert,
  Keyboard,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {TextBold, TextRegular, TextSemiBold} from '../../../components';

import {useDispatch, useSelector} from 'react-redux';
import {useTheme} from '../../../hooks';
import {
  planId,
  setSignUpUser,
  setSubscriptionPlan,
} from '../../../store/SignUp';
import {screenHeight, sHight, sWidth} from '../../../utils/ScreenDimentions';
import {RootState} from '../../../store/store';
import {
  deepLinkToSubscriptions,
  deepLinkToSubscriptionsIos,
  promotedProductListener,
  useIAP,
} from 'react-native-iap';
import {useNavigation} from '@react-navigation/native';
import SubscriptionPointsRender from '../../../components/SubscriptionPointsRender';
import SubscriptionPointsRenderSignup from '../../../components/SubscriptionPointsRenderSignup';
import DeviceInfo from 'react-native-device-info';
import {RFValue} from 'react-native-responsive-fontsize';

type Props = {
  category: string;
  interval: string;
  title: string;
  subTitle: string;
  plan_id: string;
  plan?: Object;
  index: number;
  description: string;
  selected?: boolean;
  setSelected?: CallableFunction;
  showCardDetail?: CallableFunction;
  children?: ReactNode;
  radio?: boolean;
  active?: boolean;
  price: string;
  cancelSubscription?: CallableFunction;
  monthly_price: any;
  yearly_price: any;
  iaFromSettings?: boolean;
  currentUserSubscription?: any;
  selectedPlanType?: any;
};

const SubscriptionCardCreateAccount = ({
  interval,
  category,
  title,
  radio = true,
  subTitle,
  active,
  plan_id,
  price,
  plan,
  selected,
  cancelSubscription = () => {},
  setSelected,
  index,
  children,
  showCardDetail,
  description,
  monthly_price,
  yearly_price,
  iaFromSettings,
  currentUserSubscription,
  selectedPlanType = 0,
}: Props) => {
  const {Gutters, Colors, Layout, Fonts, Images} = useTheme();
  const dispatch = useDispatch();

  const navigation = useNavigation();

  const {token, user_data} = useSelector((state: any) => state.auth);

  const [SubscriptionTime, setSubscriptionTime] = useState(selectedPlanType);

  const [isTablet, setIsTablet] = useState(DeviceInfo.isTablet());
  const responsiveFontSize = size => {
    let calculatedFontSize = RFValue(size, screenHeight);

    // If it's a tablet and in landscape mode, reduce font size
    // if (isTablet && orientation === 'landscape') {
    if (isTablet) {
      calculatedFontSize *= 0.75; // Reduce font size by 20% on tablets in landscape
    }

    return calculatedFontSize;
  };

  // console.log(plan_id, 'plan id');
  const colorsStars = ['#F7BB16', '#14B6DD', '#E23F40', '#01FF85'];
  const colorsTick = [
    Colors.black_232C28,
    Colors.black_232C28,
    Colors.white,
    Colors.white,
  ];
  const colorsBackGround = [
    Colors.light_grayF4F4F4,
    Colors.gray_D9D9D9,
    Colors.black_303E37,
    Colors.green_06975E,
  ];
  const colorsTitle = [
    Colors.dark_gray_676C6A,
    Colors.dark_gray_676C6A,
    Colors.white,
    Colors.white,
  ];
  const colorsTitleDes = [
    Colors.dark_gray_676C6A,
    Colors.dark_gray_676C6A,
    Colors.white,
    Colors.white,
  ];
  const colorsButton = [
    Colors.gray_C9C9C9,
    Colors.dark_gray_676C6A,
    Colors.green_black_34594A,
    Colors.white,
  ];
  const colorsButtonText = [
    Colors.white,
    Colors.white,
    Colors.white,
    Colors.primary,
  ];

  return (
    <View
      // key={index}

      style={[
        {
          borderRadius: 8,
        },
      ]}>
      <View
        style={[
          Gutters.tinyTPadding,
          Gutters.smallHPadding,
          {
            // minHeight: '20%',
            // width: '100%',
            borderWidth: selected ? 4 : 0,
            borderColor: selected ? Colors.primary : 'transparent',
            backgroundColor: colorsBackGround[index % colorsBackGround.length],
            borderRadius: 6,
          },
          selected
            ? {
                shadowColor: '#FFF',
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.22,
                shadowRadius: 2.22,
                elevation: 5,
                zIndex: 5,
                opacity: 0.8,
              }
            : {},
        ]}>
        <View style={[Layout.center, Gutters.tinyVMargin]}>
          <Images.svg.star.default
            fill={colorsStars[index % colorsStars.length]}
            width={50}
            height={50}
          />
          <TextSemiBold
            text={title}
            textStyle={[
              Fonts.poppinSemiBold24,
              Gutters.tinyTMargin,
              Fonts.textCenter,
              {
                color: colorsTitle[index % colorsTitle.length],
                // width: sWidth(iaFromSettings ? 50 : 60),
              },
            ]}
            // textProps={{
            //   numberOfLines: 1,
            // }}
          />
        </View>
        <SubscriptionPointsRenderSignup
          plan={plan}
          SubscriptionTime={selectedPlanType}
          titleColor={colorsTitle[index % colorsTitle.length]}
        />
        <Text
          numberOfLines={2}
          style={[
            // price?.toString()?.length > 3
            //   ? Fonts.poppinSemiBold16
            // :
            Fonts.poppinSemiBold40,
            Gutters.smallVMargin,
            // Gutters.littleLPadding,
            Fonts.textCenter,
            {
              color: colorsTitleDes[index % colorsTitleDes.length],
              // width: '60%',
              // height: 80,
            },
          ]}>
          {t('common:nz')} {price}
          {price ? (
            <Text
              style={[
                // price?.toString()?.length > 3
                //   ? Fonts.poppinMed14
                //   :
                Fonts.poppinSemiBold20,

                {
                  color: colorsTitleDes[index % colorsTitleDes.length],
                  lineHeight: responsiveFontSize(48, sHight(100)),
                },
              ]}>
              {interval && `/${interval ?? ''}`}
            </Text>
          ) : null}
        </Text>
        <View
          style={[
            Gutters.smallBPadding,
            // Gutters.xRegularTMargin,
            Layout.justifyContentCenter,
            Layout.alignItemsCenter,
            i18next.language === 'en' ? Layout.row : Layout.rowReverse,
            {
              zIndex: 1,
            },
          ]}>
          <TouchableOpacity
            activeOpacity={0.8}
            // disabled={true}
            onPress={async () => {
              if (active) {
                if (currentUserSubscription?.status === 'expire') {
                } else {
                  !!token
                    ? cancelSubscription(true)
                    : Alert.alert(
                        '',
                        `Please use ${
                          Platform.OS == 'android' ? 'ios' : 'android/web'
                        } application to make any changes to your subscription plan.`,
                        [
                          {
                            text: 'OK',
                            onPress: () => {},
                          },
                        ],
                      );
                }
              } else {
                let interval = plan?.interval;

                if (setSelected) {
                  setSelected({
                    index,
                    title,
                    subTitle,
                    description,
                    price,
                    plan_id,
                    selected: selectedPlanType,
                    monthly_price,
                    yearly_price,
                    category,
                    interval,
                    plan,
                  });
                } else {
                  dispatch(
                    setSubscriptionPlan({
                      index,
                      title,
                      subTitle,
                      description,
                      price,
                      plan_id,
                      selected: selectedPlanType,
                      monthly_price,
                      yearly_price,
                      category,
                      interval,
                      plan,
                    }),
                  );
                  dispatch(planId(plan));
                }
              }
              Keyboard.dismiss();
              setTimeout(() => {
                showCardDetail(true);
              }, 200);
            }}
            style={[
              Layout.center,
              {
                width: sWidth(70),
                height: 50,
                borderRadius: 6,
                backgroundColor: colorsButton[index % colorsButton.length],
              },
            ]}>
            <TextBold
              text={
                active
                  ? currentUserSubscription?.status === 'expire'
                    ? 'Expired'
                    : t('common:cancel')
                  : t('common:buy')
              }
              textStyle={[
                Fonts.poppinReg18,
                Fonts.textUppercase,
                {color: colorsButtonText[index % colorsButtonText.length]},
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SubscriptionCardCreateAccount;
