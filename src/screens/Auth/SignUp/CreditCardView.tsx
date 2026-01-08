import i18next from 'i18next';
import React, {memo, useRef, useState} from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CustomBottomSheet,
  CustomButton,
  CustomInput,
  CustomSubscriptionCard,
  TextBold,
  TextMedium,
  TextRegular,
  TextSemiBold,
} from '../../../components';
import {useTheme} from '../../../hooks';
import {storeToken} from '../../../store/auth/AuthSlice';
import {useDispatch, useSelector} from 'react-redux';

import {
  CardField,
  CardFieldInput,
  createToken,
  useStripe,
} from '@stripe/stripe-react-native';
import {setSignUpUser, setStripeCard} from '../../../store/SignUp';
import SemiBoldText from '../../../components/SemiBoldText';
import {toastDangerMessage} from '../../../utils/helpers';
import {sHight} from '../../../utils/ScreenDimentions';
// import {toastDangerMessage} from '../../../utils/helpers';
type Props = {
  setAddCard: CallableFunction;
  index: number;
  setCardView: CallableFunction;
  StripeView: boolean;
  setstripeView: CallableFunction;
  onPressChangePlan?: CallableFunction;
};

const CreditCardView = ({
  setAddCard,
  setstripeView,
  StripeView,
  setCardView,
  index,
  onPressChangePlan,
}: Props) => {
  const {Colors, Fonts, Gutters, Images, Layout} = useTheme();
  const {subscription, stripeCard, signUpBasic} = useSelector(
    state => state.signup,
  );

  const [nameOnCard, setNameOnCard] = useState('');
  const [nameError, setNameError] = useState(false);

  const cardRef = useRef();
  const stripe = useStripe();
  const dispatch = useDispatch();

  const _createStripeToken = async () => {
    if (!nameOnCard) {
      setNameError(true);
      toastDangerMessage('Please enter name on card');
      return;
    }
    let {error, token} = await stripe.createToken({type: 'Card'});

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
      toastDangerMessage(error?.message);
      return;
    } else if (token) {
      const card_data = {
        token: {
          id: token?.id,
          object: 'token',
          card: {
            id: token?.card?.id,
            object: 'card',
            address_city: null,
            address_country: null,
            address_line1: null,
            address_line1_check: null,
            address_line2: null,
            address_state: null,
            address_zip: token?.card?.address?.postalCode,
            address_zip_check: 'unchecked',
            brand: token?.card?.brand,
            country: token?.card?.country,
            cvc_check: 'unchecked',
            dynamic_last4: null,
            exp_month: token?.card?.expMonth,
            exp_year: token?.card?.expYear,
            funding: token?.card?.funding,
            last4: token?.card?.last4,
            name: null,
            networks: {preferred: null},
            tokenization_method: null,
            wallet: null,
          },
          client_ip: '154.81.246.111',
          created: 1719325736,
          livemode: false,
          type: 'card',
          used: false,
        },
      };
      dispatch(
        setSignUpUser({token: card_data?.token, nameOnCard: nameOnCard}),
      );
      dispatch(setStripeCard([card_data]));
      setAddCard(true);
      setCardView(false);
      setstripeView(false);
    }
  };
  return StripeView ? (
    <View style={{backgroundColor: Colors.bg_white_F4F4F4}}>
      <ScrollView
        style={[Layout.fill, Gutters.smallBPadding]}
        contentContainerStyle={[Layout.flexGrow]}>
        <View
          style={[Layout.fill, Gutters.smallTPadding, Layout.alignItemsCenter]}>
          <View
            style={[
              Layout.alignItemsCenter,
              i18next.language == 'en' ? Layout.row : Layout.rowReverse,
            ]}>
            <Images.svg.IconCreditcard.default />
            <View style={[Gutters.smallLMargin]}>
              <SemiBoldText
                text={t('common:credit_card')}
                textStyle={[
                  Fonts.poppinSemiBold32,
                  {color: Colors.black_232C28},
                ]}
              />
              <View style={[Layout.row]}>
                <TextMedium
                  text={t('common:powered_by')}
                  textStyle={[
                    Fonts.poppinMed18,
                    {color: Colors.dark_gray_676C6A},
                  ]}
                />
                <TextBold
                  text={t('common:stripe')}
                  textStyle={[Fonts.poppinSemiBold20, {color: Colors.primary}]}
                />
              </View>
            </View>
          </View>
          <View
            style={[
              Layout.fill,
              Layout.fullWidth,
              Layout.justifyContentBetween,
            ]}>
            <View style={[Gutters.xTinyTMargin]}>
              <CustomInput
                headingText={'Name on Card'}
                headingTextStyle={{color: Colors.black_232C28}}
                inputProps={{
                  autoFocus: true,
                  placeholderText: Colors.black_232C28,
                  onChangeText: t => {
                    setNameOnCard(t);
                    setNameError(false);
                  },
                  value: nameOnCard,
                }}
                placeholder={'Enter Name'}
                inputStyle={{borderWidth: 1, borderRadius: 8, height: 50}}
              />
              {!!nameError && (
                <TextRegular
                  text={'Please enter name'}
                  textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                />
              )}
              <View
                style={[
                  Gutters.tinyHPadding,
                  {width: '100%', marginTop: -10, alignSelf: 'center'},
                ]}>
                <CardField
                  // autofocus
                  postalCodeEnabled={false}
                  cardStyle={inputStyles}
                  style={styles.cardField}
                />
              </View>
            </View>
            <View style={[Layout.center, Gutters.tinyHMargin]}>
              <CustomButton
                text={t('common:continue')}
                onPress={_createStripeToken}
                btnStyle={[{width: '100%'}]}
                backgroundColor={Colors.primary}
                textColor={Colors.white}
                textStyle={[
                  Fonts.poppinSemiBold24,
                  // {textTransform: 'capitalize'},
                ]}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  ) : (
    <>
      <View
        style={[
          Layout.selfCenter,
          Gutters.mediumTMargin,
          Layout.alignItemsCenter,
          Gutters.xRegularVPadding,

          {
            width: '100%',
            borderStyle: 'dashed',
            borderWidth: 1,
            borderRadius: 8,
            borderColor: Colors.gray_C9C9C9,
            backgroundColor: Colors.black_323D3,
          },
        ]}>
        <View style={[Layout.alignItemsCenter, Layout.justifyContentBetween]}>
          <Images.svg.IconCreditcard.default />
          <View
            style={[
              Layout.fullWidth,
              Gutters.smallVMargin,
              Layout.alignItemsCenter,
            ]}>
            <TextSemiBold
              text={t('common:no_cred_card_added')}
              textStyle={[Fonts.poppinSemiBold24, {color: Colors.white}]}
            />
            <TextRegular
              text={t('common:add_card_text')}
              textStyle={[
                Fonts.poppinReg14,
                Gutters.littleTMargin,
                {color: Colors.white},
              ]}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              // console.log('button presed');
              setAddCard(true);
              setstripeView(true);
            }}
            style={[
              Layout.center,
              {
                backgroundColor: Colors.primary,
                width: 322,
                height: 56,
                borderRadius: 8,
              },
            ]}>
            <View style={[Layout.row, Layout.alignItemsCenter]}>
              <Images.svg.cameraIcon.default />
              <TextSemiBold
                text={t('common:add_card')}
                textStyle={[
                  Fonts.poppinSemiBold24,
                  Gutters.xTinyLMargin,
                  {color: Colors.white},
                ]}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <CustomSubscriptionCard
        index={subscription?.index}
        description={subscription?.description}
        title={subscription?.title}
        price={subscription?.price}
        selected={subscription}
        onPressChangePlan={onPressChangePlan}
      />
    </>
  );
};

export default CreditCardView;
const styles = StyleSheet.create({
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 30,
  },
  or: {
    textAlign: 'center',
    marginTop: 30,
  },
});

const inputStyles: CardFieldInput.Styles = {
  borderWidth: 1,
  backgroundColor: '#FFFFFF',
  borderColor: '#000000',
  borderRadius: 8,
  fontSize: 14,
  placeholderColor: '#999999',
};
