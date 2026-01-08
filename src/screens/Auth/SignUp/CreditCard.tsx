import i18next from 'i18next';
import React from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {TextRegular} from '../../../components';
import {useTheme} from '../../../hooks';
import {RootState} from '../../../store/store';

type Props = {
  setAddCard: CallableFunction;
  name?: string;
  brand: string;
  cardNumber?: string;
  expDate: string;
  nameOnCard: string;
  expYear: string;
};

const CreditCard = ({
  setAddCard,
  expYear,
  expDate,
  brand,
  name,
  cardNumber,
  nameOnCard,
}: Props) => {
  const {Colors, Gutters, Images, Fonts, Layout} = useTheme();
  const {user_data} = useSelector((state: RootState) => state.auth);
  const {signUpBasic} = useSelector((state: RootState) => state.signup);

  // console.log('signUpBasic', signUpBasic.nameOnCard);

  var expYear_last2 = expYear && expYear.toString()?.slice(-2);

  const cardViewItem = () => {
    return (
      <View
        style={[
          {
            borderWidth: 0.5,
            borderColor: Colors.gray_C9C9C9,
            borderRadius: 5,
            overflow: 'hidden',
          },
        ]}>
        <View
          style={[
            Gutters.tinyVPadding,
            Layout.row,
            Layout.justifyContentBetween,
            Layout.alignItemsCenter,
            {
              paddingRight: 10,
              backgroundColor: Colors.light_grayF4F4F4,
            },
          ]}>
          <View
            style={[
              Gutters.tinyHPadding,

              Layout.justifyContentBetween,
              i18next.language === 'en' ? Layout.row : Layout.rowReverse,
            ]}>
            <View>
              <TextRegular
                text={t('common:card_number')}
                textStyle={[
                  Fonts.poppinSemiBold16,
                  {color: Colors.black_232C28},
                ]}
              />
              <View style={[Layout.row]}>
                <TextRegular
                  text={`**** **** **** `}
                  textStyle={[
                    Fonts.poppinSemiBold16,
                    {color: Colors.black_232C28, marginTop: 3},
                  ]}
                />

                <TextRegular
                  text={`${cardNumber}`}
                  textStyle={[
                    Fonts.poppinSemiBold16,
                    {color: Colors.black_232C28},
                  ]}
                />
              </View>
            </View>
          </View>
          <View>
            {brand == 'Visa' ? (
              <Images.svg.visa.default />
            ) : brand == 'MasterCard' ? (
              <Images.svg.masterCard.default width="58" height="38" />
            ) : brand == 'ApplePay' ? (
              <Images.svg.applePay.default width="58" height="38" />
            ) : (
              brand == 'Maestro' && (
                <Images.svg.maestro.default width="58" height="38" />
              )
            )}
          </View>
        </View>

        <View style={[Gutters.smallVPadding]}>
          <View
            style={[
              Gutters.tinyHPadding,
              Layout.justifyContentBetween,
              i18next.language === 'en' ? Layout.row : Layout.rowReverse,
            ]}>
            {/* <View style={[{height: 30}]} /> */}
            <View>
              <TextRegular
                text={'Name on Card'}
                textStyle={[
                  Fonts.poppinSemiBold16,
                  {color: Colors.black_232C28},
                ]}
              />
              <View style={[Layout.row]}>
                <TextRegular
                  text={`${signUpBasic.nameOnCard}`}
                  textStyle={[
                    Fonts.poppinSemiBold16,
                    {color: Colors.black_232C28},
                  ]}
                />
              </View>
            </View>
          </View>
        </View>
        <View
          style={[
            i18next.language === 'en' ? Layout.row : Layout.rowReverse,
            Layout.alignItemsCenter,
            Layout.row,
            Layout.justifyContentBetween,
            Layout.alignItemsCenter,
            Gutters.tinyRPadding,
            {},
          ]}>
          <View style={[Gutters.tinyLMargin]}>
            <TextRegular
              text={`Expiry`}
              textStyle={[Fonts.poppinSemiBold16, {color: Colors.black_232C28}]}
            />
            <TextRegular
              text={
                expDate.toString().length == 1
                  ? `0${expDate}/${expYear_last2}`
                  : `${expDate}/${expYear_last2}`
              }
              textStyle={[Fonts.poppinSemiBold12, {color: Colors.black_232C28}]}
            />
          </View>
          <View style={[Layout.center]}>
            <TextRegular
              text={`CVC`}
              textStyle={[Fonts.poppinSemiBold16, {color: Colors.black_232C28}]}
            />
            <TextRegular
              text={`***`}
              textStyle={[Fonts.poppinSemiBold14, {color: Colors.black_232C28}]}
            />
          </View>
        </View>
      </View>
    );
  };
  return (
    <View
      style={[
        Gutters.smallTMargin,
        {backgroundColor: Colors.white, borderRadius: 6},
      ]}>
      {cardViewItem()}
    </View>
    // <View>
    //   <View
    //     style={[
    //       Layout.alignItemsEnd,
    //       Layout.justifyContentEnd,
    //       Gutters.smallTMargin,
    //       Gutters.tinyPadding,
    //     ]}>
    //     {/* <TouchableOpacity activeOpacity={0.8} onPress={() => setAddCard(true)}>
    //       <Images.svg.dustbin.default width={20} height={20} />
    //     </TouchableOpacity> */}
    //   </View>
    //   <View style={[Layout.fullWidth, Layout.overflow, {borderRadius: 8}]}>
    //     <View
    //       style={[
    //         Gutters.smallPadding,
    //         Layout.column,
    //         Layout.justifyContentBetween,

    //         {
    //           width: '100%',
    //           borderRadius: 8,
    //           height: 250,
    //           backgroundColor: Colors.white,
    //         },
    //       ]}>
    //       <View
    //         style={[
    //           i18next.language == 'en' ? Layout.row : Layout.rowReverse,
    //           Layout.justifyContentBetween,
    //           Layout.alignItemsCenter,
    //         ]}>
    //         <View>
    //           <TextRegular
    //             text={t('common:card_number')}
    //             textStyle={[Fonts.poppinReg14, {color: Colors.black}]}
    //           />
    //           <TextMedium
    //             text={`**** **** **** ${cardNumber}`}
    //             textStyle={[
    //               Fonts.poppinMed18,
    //               Gutters.littleTMargin,
    //               {color: Colors.black},
    //             ]}
    //           />
    //         </View>
    //         {brand == 'Visa' ? (
    //           <Images.svg.visa.default />
    //         ) : brand == 'Mastercard' ? (
    //           <Images.svg.mastercard.default width="58" height="38" />
    //         ) : brand == 'ApplePay' ? (
    //           <Images.svg.applePay.default width="58" height="38" />
    //         ) : (
    //           brand == 'Maestro' && (
    //             <Images.svg.mastercard.default width="58" height="38" />
    //           )
    //         )}
    //       </View>
    //       <View
    //         style={[
    //           i18next.language == 'en' ? Layout.row : Layout.rowReverse,
    //           Layout.justifyContentBetween,
    //           Layout.alignItemsCenter,
    //         ]}>
    //         <View>
    //           <TextRegular
    //             text={t('common:name_on_card')}
    //             textStyle={[Fonts.poppinReg14, {color: Colors.black}]}
    //           />
    //           <TextMedium
    //             text={name}
    //             textStyle={[
    //               Fonts.poppinMed18,
    //               Gutters.littleTMargin,
    //               {color: Colors.black},
    //             ]}
    //           />
    //         </View>
    //       </View>
    //       <View
    //         style={[
    //           i18next.language == 'en' ? Layout.row : Layout.rowReverse,
    //           Layout.justifyContentBetween,
    //           Layout.alignItemsCenter,
    //         ]}>
    //         <View>
    //           <TextRegular
    //             text={t('common:expiry')}
    //             textStyle={[Fonts.poppinReg14, {color: Colors.black}]}
    //           />
    //           <TextMedium
    //             text={expDate}
    //             textStyle={[
    //               Fonts.poppinMed18,
    //               Gutters.littleTMargin,
    //               {color: Colors.black},
    //             ]}
    //           />
    //         </View>
    //         <View>
    //           <TextRegular
    //             text={t('common:csv')}
    //             textStyle={[
    //               Fonts.poppinReg14,
    //               Layout.textTransfromNone,
    //               {color: Colors.black},
    //             ]}
    //           />
    //           <TextMedium
    //             text={'***'}
    //             textStyle={[
    //               Fonts.poppinMed18,
    //               Gutters.littleTMargin,
    //               {color: Colors.black},
    //             ]}
    //           />
    //         </View>
    //       </View>
    //     </View>
    //   </View>
    // </View>
  );
};

export default CreditCard;
