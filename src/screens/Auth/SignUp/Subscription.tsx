import i18next from 'i18next';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  CustomBottomSheet,
  CustomButton,
  CustomGradientButton,
  CustomLoading,
  CustomMenu,
  TextMedium,
  TextRegular,
  TextSemiBold,
} from '../../../components';
import {useTheme} from '../../../hooks';
import {
  useLazyGetSubscriptionPlansQuery,
  useSignUpCompleteMutation,
} from '../../../services/auth/signupApi';
import {RootState} from '../../../store/store';
import {toastDangerMessage} from '../../../utils/helpers';
import SubscriptionCard from './SubscriptionCard';
import {
  subscription_points,
  subscriptionDetailMonthly,
  subscriptionDetailYearly,
} from '../../../utils/dummyData';
import {setSignUpUser, setSubscriptionPlan} from '../../../store/SignUp';
import SubscriptionPointsRender from '../../../components/SubscriptionPointsRender';

type Props = {
  setCardView: CallableFunction;
  setSubscriptionPlan: CallableFunction;
  changeSubscriptionPlan?: boolean;
};

const Subscription = ({
  setCardView,
  setSubscriptionPlan: setSubscriptionPlanFlag,
  changeSubscriptionPlan = false,
}: Props) => {
  const {Gutters, Colors, Layout, Fonts, Images} = useTheme();
  const [Subscription, setSubscription] = useState(0);
  const [SubscriptionTime, setSubscriptionTime] = useState(0);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const dispacth = useDispatch();
  const [selected, setSelected] = useState(0);
  console.log(selected);
  const {subscription, subscription_plans, signUpBasic, plan_id} = useSelector(
    (state: RootState) => state.signup,
  );
  const [signUpComplete, {isLoading}] = useSignUpCompleteMutation();
  // console.log('>>subscription_plans 00  ', subscription_plans);
  const [reLoad, setReLoad] = useState(0);
  const [getSubscriptionPlans] = useLazyGetSubscriptionPlansQuery();

  useEffect(() => {
    getPlansAPIcall();
  }, []);
  const getPlansAPIcall = () => {
    getSubscriptionPlans('').then(() => {
      // if (changeSubscriptionPlan) {
      //   setShowBottomSheet(true);
      //   setSubscriptionTime(subscription.selected);
      // }
    });
  };

  useEffect(() => {
    setReLoad(reLoad + 1);
  }, [subscription_plans]);
  const submitForm = async plan => {
    const {user_id, ...remainingData} = signUpBasic;
    dispacth(setSignUpUser({plan: plan}));
    setShowBottomSheet(false);
    const data = {
      id: signUpBasic?.user_id,
      ...remainingData,
      plan_id:
        subscription?.plan?.category === 'free'
          ? subscription?.plan?.free_plan?._id
          : subscription?.selected === 0
          ? subscription?.plan?.monthly_plan?._id
          : subscription?.plan?.yearly_plan?._id,
    };

    signUpComplete(data)
      .then(res => {
        // console.log('response=========', JSON.stringify(res));
        // return;
        // dispacth(setSignUpUser({cong: true}));
        // setShowBottomSheet(false);
      })
      .catch(e => {
        toastDangerMessage(e.data.message);
      });
    setCardView(false);
  };
  // console.log('>>>> signUpBasic ', signUpBasic);
  // console.log(subscription_plans, 'checking subscription');
  return (
    <View style={[Layout.fill]}>
      <CustomMenu
        data={[
          {key: t('common:monthly'), valaue: '0'},
          {key: t('common:yearly'), valaue: '1'},
        ]}
        cutomStyle={[
          Gutters.smallVMargin,
          {backgroundColor: Colors.dark_gray_676C6A, height: 40},
        ]}
        textStyle={[Fonts.poppinMed18]}
        selected={selected}
        setSelected={setSelected}
        setSubscriptionTime={setSubscriptionTime}
      />
      <View style={[Layout.fill]}>
        <FlatList
          extraData={subscription_plans}
          data={subscription_plans}
          renderItem={({item, index}) => {
            const {name, description, free_plan, category} = item;
            // console.log(item);
            return (
              <View style={[Gutters.tinyTMargin]}>
                <SubscriptionCard
                  title={name}
                  subTitle={''}
                  category={category}
                  price={
                    category == 'free'
                      ? free_plan?.amount
                      : selected === 0
                      ? item?.monthly_plan?.amount
                      : item?.yearly_plan?.amount
                  }
                  monthly_price={
                    category == 'free'
                      ? free_plan?.amount
                      : item?.monthly_plan?.amount
                  }
                  yearly_price={
                    category == 'free'
                      ? free_plan?.amount
                      : item?.yearly_plan?.amount
                  }
                  index={index}
                  interval={
                    selected == 0
                      ? item?.monthly_plan?.interval
                      : item?.yearly_plan?.interval
                  }
                  plan_id={
                    category == 'free'
                      ? free_plan?._id
                      : selected === 0
                      ? item?.monthly_plan?._id
                      : item?.yearly_plan?._id
                  }
                  plan={item}
                  selected={Subscription}
                  description={description}
                  setSelected={setSubscription}
                  showCardDetail={flag => {
                    setSubscriptionTime(0);
                    setShowBottomSheet(flag);
                  }}
                />

                {subscription_plans?.length == index + 1 && (
                  <View style={{height: 100}} />
                )}
              </View>
            );
          }}
          ListEmptyComponent={() => {
            return (
              <View style={[Gutters.smallTMargin]}>
                <CustomGradientButton
                  onPress={() => {
                    getPlansAPIcall();
                  }}
                  text={'Try Again'}
                  textStyle={[Fonts.poppinBold24]}
                />
              </View>
            );
          }}
        />
      </View>

      {/* <View style={[Gutters.sRegularTMargin, Layout.overflow]}>
        <CustomGradientButton
          onPress={() => setShowBottomSheet(true)}
          text={t('common:continue')}
          textStyle={[Fonts.poppinBold24]}
        />
      </View> */}
      <CustomBottomSheet
        setShowBottomSheet={setShowBottomSheet}
        visible={showBottomSheet}
        height={'90%'}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={[
              Layout.fill,
              Layout.alignItemsCenter,
              Gutters.tinyPadding,
              Gutters.smallMargin,
              {borderWidth: 2, borderRadius: 10},
            ]}>
            <TextSemiBold
              text={subscription?.title}
              textStyle={[
                Fonts.poppinSemiBold38,
                Gutters.smallTMargin,
                {color: Colors.gray_161C24},
              ]}
            />
            <TextRegular
              text={subscription?.description}
              textProps={{numberOfLines: 2}}
              textStyle={[
                Fonts.poppinReg18,
                Gutters.littleVMargin,
                Layout.textAlign,
                {width: '70%', color: Colors.black_232C28},
              ]}
            />

            <TextSemiBold
              text={`${t('common:nz')} ${
                subscription?.plan?.category?.toLowerCase() == 'free'
                  ? subscription?.plan?.free_plan?.amount || '0'
                  : SubscriptionTime == 0
                  ? subscription?.monthly_price
                  : subscription?.yearly_price
              }`}
              textStyle={[
                Fonts.poppinSemiBold56,
                Gutters.littleVMargin,
                {color: Colors.gray_161C24},
              ]}
            />
            {subscription?.category !== 'free' && (
              <View
                style={[
                  Layout.overflow,
                  i18next.language == 'en' ? Layout.row : Layout.rowReverse,
                  Layout.justifyContentBetween,
                  Layout.alignItemsCenter,
                  Gutters.xTinyBMargin,
                  {
                    width: '50%',
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: Colors.light_grayF4F4F4,
                  },
                ]}>
                <>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setSubscriptionTime(0);
                    }}
                    style={[
                      Layout.center,
                      {
                        height: 40,
                        borderRadius: 10,
                        backgroundColor:
                          SubscriptionTime == 0
                            ? Colors.primary
                            : 'transparent',
                        width: '50%',
                      },
                    ]}>
                    <TextMedium
                      text={t('common:monthly')}
                      textStyle={[
                        Fonts.poppinMed16,
                        {
                          color:
                            SubscriptionTime == 0
                              ? Colors.white
                              : Colors.dark_gray_676C6A,
                        },
                      ]}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setSubscriptionTime(1);
                    }}
                    style={[
                      Layout.center,
                      {
                        height: 40,
                        borderRadius: 10,
                        backgroundColor:
                          SubscriptionTime == 1
                            ? Colors.primary
                            : 'transparent',
                        width: '50%',
                      },
                    ]}>
                    <TextMedium
                      text={t('common:yearly')}
                      textStyle={[
                        Fonts.poppinMed16,
                        {
                          color:
                            SubscriptionTime == 1
                              ? Colors.white
                              : Colors.dark_gray_676C6A,
                        },
                      ]}
                    />
                  </TouchableOpacity>
                </>
              </View>
            )}
            {/* <View
              style={[
                Layout.fill,
                Gutters.xTinyBMargin,

                {
                  width: '90%',
                  marginTop: subscription?.category == 'free' ? -40 : 0,
                },
              ]}>
              <FlatList
                data={subscription_points[subscription?.index]}
                renderItem={({item}) => (
                  <View
                    style={[
                      Layout.row,
                      Gutters.littleTMargin,
                      Layout.alignItemsCenter,
                    ]}>
                    <Images.svg.Check.default />
                    <Text
                      style={[
                        Fonts.poppinReg14,
                        Gutters.tinyLMargin,
                        {
                          fontSize: 14,
                          color: Colors.black_232C28,
                          fontWeight: '400',
                        },
                      ]}>
                      {item}
                    </Text>
                  </View>
                )}
              />
            </View> */}
            <SubscriptionPointsRender
              plan={subscription?.plan}
              SubscriptionTime={SubscriptionTime}
            />
            <CustomButton
              text={t('common:buy_subscription')}
              onPress={() => {
                // dispatch(setsetSubscriptionPlan())
                if (subscription?.plan?.category === 'free') {
                  // submitForm(subscription?.plan);

                  setCardView(true);
                  setSubscriptionPlanFlag(false);

                  return;
                }
                // return console.log('setting subscription plan ',);
                dispacth(
                  setSubscriptionPlan({
                    ...subscription,
                    selected: SubscriptionTime,
                  }),
                );
                setCardView(true);
                setSubscriptionPlanFlag(false);
              }}
              backgroundColor={Colors.primary}
              btnStyle={[Gutters.tinyBMargin, {width: '90%'}]}
              textStyle={[Fonts.poppinSemiBold20]}
              textColor={Colors.white}
            />

            {/* <View
              style={[Gutters.smallPadding, Layout.fullWidth, Layout.flexWrap]}>
              {subscription.index === 0 && subscription?.category == 'free'
                ? Object.entries(subscription?.plan?.free_plan).map(
                    (item, index) => {
                      return (
                        <View
                          key={index}
                          style={[
                            Gutters.tinyVPadding,
                            i18next.language == 'en'
                              ? Layout.row
                              : Layout.rowReverse,
                          ]}>
                          <Images.svg.checkCircle.default
                            stroke={Colors.primary}
                          />
                          <TextRegular
                            text={`${item[1]}`}
                            textStyle={[
                              Fonts.poppinReg14,
                              Gutters.littleLMargin,
                              {color: Colors.black_232C28},
                            ]}
                          />
                        </View>
                      );
                    },
                  )
                : SubscriptionTime === 1 && subscription?.plan?.monthly_plan
                ? // ? Object.entries(subscription?.plan?.monthly_plan).map(
                  subscriptionDetailMonthly?.map((item, index) => (
                    <View
                      key={index}
                      style={[
                        Gutters.tinyVPadding,
                        i18next.language == 'en'
                          ? Layout.row
                          : Layout.rowReverse,
                      ]}>
                      <Images.svg.checkCircle.default stroke={Colors.primary} />
                      <TextRegular
                        text={`${item?.text}`}
                        textStyle={[
                          Fonts.poppinReg14,
                          Gutters.littleLMargin,
                          {color: Colors.black_232C28},
                        ]}
                      />
                    </View>
                  ))
                : subscription?.plan?.yearly_plan &&
                  // Object.entries(subscription?.plan?.yearly_plan)?.map(
                  subscriptionDetailYearly?.map((item, index) => (
                    <View
                      key={index}
                      style={[
                        Gutters.tinyVPadding,
                        i18next.language == 'en'
                          ? Layout.row
                          : Layout.rowReverse,
                      ]}>
                      <Images.svg.checkCircle.default stroke={Colors.primary} />
                      <TextRegular
                        text={`${item?.text}`}
                        textStyle={[
                          Fonts.poppinReg14,
                          Gutters.littleLMargin,
                          {color: Colors.black_232C28},
                        ]}
                      />
                    </View>
                  ))}
            </View> */}
          </View>
        </ScrollView>
      </CustomBottomSheet>

      <CustomLoading isLoading={isLoading} />
    </View>
  );
};

export default Subscription;
