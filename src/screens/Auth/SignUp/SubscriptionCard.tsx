import i18next from 'i18next';
import React, {ReactNode, useEffect} from 'react';
import {
  Alert,
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
import {sWidth} from '../../../utils/ScreenDimentions';
import {RootState} from '../../../store/store';
import {
  deepLinkToSubscriptions,
  deepLinkToSubscriptionsIos,
  promotedProductListener,
  useIAP,
} from 'react-native-iap';
import {useNavigation} from '@react-navigation/native';

type Props = {
  category: string;
  interval: string;
  title: string;
  subTitle: string;
  plan_id: string;
  plan?: Object;
  index: number;
  description: string;
  selected?: number;
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
};

const SubscriptionCard = ({
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
  setSelected = () => {},
  index,
  children,
  showCardDetail,
  description,
  monthly_price,
  yearly_price,
  iaFromSettings,
  currentUserSubscription,
}: Props) => {
  const {Gutters, Colors, Layout, Fonts, Images} = useTheme();
  const dispatch = useDispatch();

  const navigation = useNavigation();

  const {token, user_data} = useSelector((state: any) => state.auth);

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
    Colors.black_232C28,
    Colors.black_232C28,
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
          Gutters.smallPadding,
          {
            // minHeight: '20%',
            // width: '100%',
            borderWidth: selected == index ? 1 : 0,
            borderColor: selected == index ? Colors.primary : 'transparent',
            backgroundColor: colorsBackGround[index % colorsBackGround.length],

            borderRadius: 6,
          },
        ]}>
        <View
          style={[
            i18next.language === 'en' ? Layout.row : Layout.rowReverse,
            Layout.alignItemsCenter,
            // Layout.justifyContentBetween,
            {},
          ]}>
          <Images.svg.star.default
            fill={colorsStars[index % colorsStars.length]}
            width={50}
            height={50}
          />
          <View style={[Gutters.smallLMargin]}>
            <TextSemiBold
              text={title}
              textStyle={[
                Fonts.poppinSemiBold24,
                {
                  color: colorsTitle[index % colorsTitle.length],
                  width: sWidth(iaFromSettings ? 50 : 60),
                },
              ]}
              textProps={{
                numberOfLines: 1,
              }}
            />
            <View
              style={[
                Layout.alignItemsCenter,
                Gutters.tinyTMargin,
                i18next.language === 'en' ? Layout.row : Layout.rowReverse,
              ]}>
              <Images.svg.checkCircle.default
                stroke={colorsTick[index % colorsTick.length]}
              />
              <TextRegular
                text={title}
                textStyle={[
                  Fonts.poppinReg14,
                  Gutters.tinyLMargin,
                  {
                    color: colorsTitle[index % colorsTitle.length],

                    width: sWidth(iaFromSettings ? 40 : 50),
                  },
                ]}
                textProps={{
                  numberOfLines: 1,
                }}
              />
            </View>
          </View>
        </View>

        <View style={[{height: 100, justifyContent: 'center'}]}>
          <TextRegular
            text={description}
            textStyle={[
              // Gutters.smallTMargin,
              Fonts.poppinReg14,
              Gutters.tinyLMargin,
              {
                color: colorsTitleDes[index % colorsTitleDes.length],
              },
            ]}
          />
        </View>

        {/* <TextRegular
          text={description}
          textStyle={[
            // Gutters.smallTMargin,
            Fonts.poppinReg14,
            Gutters.tinyLMargin,
            {
              color:
                index == 2 || index == 3
                  ? Colors.white
                  : Colors.dark_gray_676C6A,
            },
          ]}
        /> */}
        <View
          style={[
            Gutters.tinyPadding,
            // Gutters.xRegularTMargin,
            Layout.justifyContentBetween,
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

                dispatch(
                  setSubscriptionPlan({
                    index,
                    title,
                    subTitle,
                    description,
                    price,
                    plan_id,
                    selected,
                    monthly_price,
                    yearly_price,
                    category,
                    interval,
                    plan,
                  }),
                );
                dispatch(planId(plan));
              }
              showCardDetail(true);
            }}
            style={[
              Layout.center,
              {
                width: 133,
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
                  : t('common:continue')
              }
              textStyle={[Fonts.poppinBold16, {color: Colors.white}]}
            />
          </TouchableOpacity>
          <Text
            numberOfLines={2}
            style={[
              price?.toString()?.length > 3
                ? Fonts.poppinSemiBold16
                : Fonts.poppinSemiBold20,
              Gutters.smallTPadding,
              Gutters.littleLPadding,
              {
                color: colorsTitleDes[index % colorsTitleDes.length],
                width: '60%',
              },
            ]}>
            {t('common:nz')} {price}
            {price ? (
              <Text
                style={[
                  price?.toString()?.length > 3
                    ? Fonts.poppinMed14
                    : Fonts.poppinMed16,
                  {
                    color: colorsTitleDes[index % colorsTitleDes.length],
                  },
                ]}>
                {interval && `/${interval ?? ''}`}
              </Text>
            ) : null}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SubscriptionCard;
