import {Formik} from 'formik';
import i18next from 'i18next';
import React, {memo, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {MethodOfSaleSelection} from '.';
import {
  CustomButton,
  CustomCheckBox,
  CustomDatePicker,
  CustomDropDown,
  CustomInput,
  CustomRadioButton,
  CustomSwitch,
  TextMedium,
  TextRegular,
  TextSemiBold,
} from '../../../components';
import {useTheme} from '../../../hooks';
import {VehicalAutomatically} from '../../../utils/Interface';
import {sHight, sWidth} from '../../../utils/ScreenDimentions';
import {VehicalAutomaticallySchema} from '../../../utils/Validation';
import moment from 'moment';

type Props = {};
// This component doesn't seem to be used
const ItemForVehical = (props: Props) => {
  const {Colors, Images, Fonts, Gutters, Layout} = useTheme();
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState({
    catagory: '',
    subCatagory: '',
    condition: '',
    payment: '',
    shipping: '',
  });
  const [selectedFromDate, setSelectedFromDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [selected, setSelected] = useState(0);
  const [auctionSelection, setAuctionSelection] = useState(0);
  const [allowBuyers, setAllowBuyers] = useState(false);

  return (
    <View style={[]}>
      <Formik
        initialValues={VehicalAutomatically}
        validationSchema={VehicalAutomaticallySchema}
        onSubmit={(v, {resetForm}) => {
          // loginEmail(v);
        }}>
        {({
          handleChange,
          handleBlur,
          setFieldValue,
          handleSubmit,
          values,
          touched,
          errors,
        }) => {
          const {title, kilometers, askingPrice} = values;
          return (
            <>
              {/* <TakePictures selected={selectedImages as Array<object>}
                setSelectedImage={(arr: Array<object>) => {
                  setFieldValue('images', arr);
                  setSelectedImages(arr);
                }} /> */}
              <View style={[Layout.wrap]}>
                <CustomInput
                  headingText={t('common:title')}
                  headingTextStyle={[{color: Colors.dark_gray_676C6A}]}
                  inputProps={{
                    onChangeText: handleChange('title'),
                    onBlur: handleBlur('title'),
                    value: title,
                    placeholderTextColor: Colors.dark_gray_676C6A,
                  }}
                  backgroundStyle={[
                    {
                      width: sWidth(89),
                      backgroundColor: Colors.light_grayF4F4F4,
                    },
                  ]}
                  placeholder={t('common:email_phone')}
                  showPassword={false}
                />
                {touched.title && errors.title && (
                  <TextRegular
                    text={errors.title}
                    textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                  />
                )}
              </View>
              <View style={[Layout.wrap]}>
                <CustomInput
                  headingText={`${t('common:describe_the_vehicle')}`}
                  headingTextStyle={[{color: Colors.black_232C28}]}
                  inputProps={{
                    onChangeText: handleChange('email'),
                    onBlur: handleBlur('email'),
                    value: '',
                    multiline: true,
                    placeholderTextColor: Colors.black_232C28,
                  }}
                  backgroundStyle={[
                    {
                      width: sWidth(89),
                      height: 200,
                      backgroundColor: Colors.light_grayF4F4F4,
                    },
                  ]}
                  inputStyle={[{textAlignVertical: 'top'}]}
                  placeholder={t('common:email_phone')}
                  showPassword={false}
                />
              </View>
              <View style={[Layout.wrap]}>
                <CustomInput
                  headingText={t('common:kilometers')}
                  headingTextStyle={[{color: Colors.dark_gray_676C6A}]}
                  inputProps={{
                    onChangeText: handleChange('kilometers'),
                    onBlur: handleBlur('kilometers'),
                    value: kilometers,
                    placeholderTextColor: Colors.dark_gray_676C6A,
                  }}
                  backgroundStyle={[
                    {
                      width: sWidth(89),
                      backgroundColor: Colors.light_grayF4F4F4,
                    },
                  ]}
                  placeholder={t('common:email_phone')}
                  showPassword={false}
                />
                {touched.kilometers && errors.kilometers && (
                  <TextRegular
                    text={errors.kilometers}
                    textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                  />
                )}
              </View>
              <View style={[Layout.wrap]}>
                <CustomInput
                  headingText={`${t('common:registration_expiry')} `}
                  headingTextStyle={[{color: Colors.dark_gray_676C6A}]}
                  inputProps={{
                    onChangeText: handleChange('email'),
                    onBlur: handleBlur('email'),
                    value: '',
                    placeholderTextColor: Colors.dark_gray_676C6A,
                  }}
                  backgroundStyle={[
                    {
                      width: sWidth(89),
                      backgroundColor: Colors.light_grayF4F4F4,
                    },
                  ]}
                  placeholder={t('common:email_phone')}
                  showPassword={false}
                />
              </View>

              <View style={[Layout.wrap]}>
                <CustomInput
                  headingText={t('common:wof_expiry')}
                  headingTextStyle={[{color: Colors.dark_gray_676C6A}]}
                  inputProps={{
                    onChangeText: handleChange('email'),
                    onBlur: handleBlur('email'),
                    value: '',
                    placeholderTextColor: Colors.dark_gray_676C6A,
                  }}
                  backgroundStyle={[
                    {
                      width: sWidth(89),
                      backgroundColor: Colors.light_grayF4F4F4,
                    },
                  ]}
                  placeholder={t('common:email_phone')}
                  showPassword={false}
                />
              </View>
              <View style={[Gutters.smallVMargin]}>
                <TextSemiBold
                  text={t('common:are_on_road_costs_included')}
                  textStyle={[
                    Fonts.poppinSemiBold20,
                    {color: Colors.black_232C28},
                  ]}
                  textProps={[{ellipsizeMode: 'clip', numberOfLines: 2}]}
                />
                <View style={[Gutters.smallTMargin, Layout.overflow]}>
                  {[
                    t('common:yes_the_car_will_be_sold_with_a_current'),
                    t('common:no_the_buyer_may_need_to_pay_additional'),
                  ].map((item, index) => {
                    return (
                      <CustomRadioButton
                        selected={selected}
                        setSelected={setSelected}
                        text={item}
                        index={index}
                        customStyle={[Layout.alignItemsStart]}
                        customTextStyle={[
                          Fonts.poppinReg16,
                          Gutters.littleLMargin,
                          Gutters.tinyRPadding,
                        ]}
                      />
                    );
                  })}
                </View>
              </View>

              <MethodOfSaleSelection
                selected={auctionSelection}
                setSelected={setAuctionSelection}
              />
              {auctionSelection === 0 ? (
                <>
                  <View style={[Layout.wrap]}>
                    <CustomInput
                      headingText={t('common:whats_your_asking_price')}
                      headingTextStyle={[{color: Colors.dark_gray_676C6A}]}
                      inputProps={{
                        onChangeText: handleChange('askingPrice'),
                        onBlur: handleBlur('askingPrice'),
                        value: askingPrice,
                        placeholderTextColor: Colors.dark_gray_676C6A,
                      }}
                      backgroundStyle={[
                        {
                          width: sWidth(89),
                          backgroundColor: Colors.light_grayF4F4F4,
                        },
                      ]}
                      placeholder={t('common:email_phone')}
                      showPassword={false}
                    />
                    {touched.askingPrice && errors.askingPrice && (
                      <TextRegular
                        text={errors.askingPrice}
                        textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                      />
                    )}
                  </View>
                  <View
                    style={[
                      i18next.language === 'en'
                        ? Layout.row
                        : Layout.rowReverse,
                      Layout.alignItemsStart,
                      Gutters.xTinyTMargin,
                    ]}>
                    <CustomCheckBox
                      customStyle={[
                        {
                          borderColor: Colors.dark_gray_676C6A,
                          width: 28,
                          height: 28,
                        },
                      ]}
                      setSelected={setAllowBuyers}
                    />
                    <View style={[Gutters.tinyLMargin]}>
                      <TextRegular
                        text={t('common:allow_buyers_to_make_an_offer')}
                        textStyle={[
                          Fonts.poppinReg16,
                          {color: Colors.black_232C28},
                        ]}
                      />
                      <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
                        <TextRegular
                          text={t('common:What_make_an_offer')}
                          textStyle={[
                            Fonts.poppinReg16,
                            {color: Colors.primary},
                          ]}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <TextSemiBold
                    text={t('common:your_auction_details')}
                    textStyle={[
                      Fonts.poppinSemiBold20,
                      {color: Colors.black_232C28},
                    ]}
                  />
                  <View style={[Layout.wrap]}>
                    <View style={[Gutters.tinyTMargin]}>
                      <Text
                        style={[
                          Fonts.poppinReg16,
                          Gutters.littleBPadding,
                          {color: Colors.black_232C28},
                        ]}>
                        {t('common:reserve_price')}
                        <Text
                          style={[
                            Fonts.poppinReg14,
                            {color: Colors.black_232C28},
                          ]}>
                          {t('common:optional')}
                        </Text>
                      </Text>
                    </View>
                    <CustomInput
                      headingText={''}
                      headingTextStyle={[{color: Colors.black_232C28}]}
                      inputProps={{
                        onChangeText: handleChange('email'),
                        onBlur: handleBlur('email'),
                        value: '',
                        placeholderTextColor: Colors.black_232C28,
                      }}
                      backgroundStyle={[
                        {
                          width: sWidth(89),
                          backgroundColor: Colors.light_grayF4F4F4,
                        },
                      ]}
                      placeholder={t('common:email_phone')}
                      showPassword={false}
                    />
                  </View>
                  <TextRegular
                    text={t(
                      'common:The_lowest_price_youre_willing_to_sell_for',
                    )}
                    textStyle={[
                      Fonts.poppinReg14,
                      Gutters.littleTMargin,
                      {color: Colors.dark_gray_676C6A},
                    ]}
                  />
                  <View style={[Layout.wrap]}>
                    <View style={[Gutters.tinyTMargin]}>
                      <Text
                        style={[
                          Fonts.poppinReg16,
                          Gutters.littleBPadding,
                          {color: Colors.black_232C28},
                        ]}>
                        {t('common:start_price')}
                      </Text>
                    </View>
                    <CustomInput
                      headingText={''}
                      headingTextStyle={[{color: Colors.black_232C28}]}
                      inputProps={{
                        onChangeText: handleChange('email'),
                        onBlur: handleBlur('email'),
                        value: '',
                        placeholderTextColor: Colors.black_232C28,
                      }}
                      backgroundStyle={[
                        {
                          width: sWidth(89),
                          backgroundColor: Colors.light_grayF4F4F4,
                        },
                      ]}
                      placeholder={'$'}
                      showPassword={false}
                    />
                  </View>
                  <TextRegular
                    text={t(
                      'common:set_lower_than_reserve_to_attract_more_bids',
                    )}
                    textStyle={[
                      Fonts.poppinReg14,
                      Gutters.littleTMargin,
                      {color: Colors.dark_gray_676C6A},
                    ]}
                  />
                  <View style={[Layout.wrap]}>
                    <View style={[Gutters.tinyTMargin]}>
                      <Text
                        style={[
                          Fonts.poppinReg16,
                          Gutters.littleBPadding,
                          {color: Colors.black_232C28},
                        ]}>
                        {t('common:buy_now_price')}
                        <Text
                          style={[
                            Fonts.poppinReg14,
                            {color: Colors.dark_gray_676C6A},
                          ]}>
                          {' '}
                          {t('common:optional')}
                        </Text>
                      </Text>
                    </View>
                    <CustomInput
                      headingText={''}
                      headingTextStyle={[{color: Colors.black_232C28}]}
                      inputProps={{
                        onChangeText: handleChange('email'),
                        onBlur: handleBlur('email'),
                        value: '',
                        placeholderTextColor: Colors.black_232C28,
                      }}
                      backgroundStyle={[
                        {
                          width: sWidth(89),
                          backgroundColor: Colors.light_grayF4F4F4,
                        },
                      ]}
                      placeholder={'$'}
                      showPassword={false}
                    />
                  </View>
                  <TextRegular
                    text={t('common:the_price_youd_sell_your_vehicle_for_now')}
                    textStyle={[
                      Fonts.poppinReg14,
                      Gutters.littleTMargin,
                      {color: Colors.dark_gray_676C6A},
                    ]}
                  />
                </>
              )}

              <View style={[Gutters.tinyTMargin]}>
                <CustomDropDown
                  data={[
                    {key: 'item 1', value: 'value'},
                    {key: 'item 2', value: 'value'},
                    {key: 'item 3', value: 'value'},
                  ]}
                  leftIcon={true}
                  value=""
                  iconName={'wallet'}
                  selectedTextStyle={{color: Colors.dark_gray_676C6A}}
                  headingTextStyle={{color: Colors.dark_gray_676C6A}}
                  customStyle={[{backgroundColor: Colors.light_grayF4F4F4}]}
                  setSelected={t => {
                    setSelectedPurpose({catagory: t});
                  }}
                  placeholder={t('common:select_purpose')}
                  headingText={t('common:payment_option')}
                  itemStyle={[{backgroundColor: Colors.light_grayF4F4F4}]}
                />

                <TextRegular
                  text={errors.phone}
                  textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                />
              </View>
              <View style={[Gutters.tinyVMargin]}>
                <CustomDatePicker
                  setSelectedDate={date => {
                    const formateDate = moment(date).format('DD/MM/YYYY');
                    setFieldValue('startDate', formateDate);
                    setSelectedFromDate(date);
                  }}
                  selectDate={selectedFromDate}
                  headingText={t('common:start_date')}
                  customHeadingStyle={[
                    Fonts.poppinMed18,
                    {color: Colors.dark_gray_676C6A},
                  ]}
                  leftIcon={false}
                  rightIcon={true}
                  rightIconName="calendar"
                  customBackgroundStyle={[
                    {
                      backgroundColor: Colors.light_grayF4F4F4,
                    },
                  ]}
                />
              </View>
              <View style={[Gutters.tinyVMargin]}>
                <CustomDatePicker
                  setSelectedDate={date => {
                    const formateDate = moment(date).format('DD/MM/YYYY');
                    setFieldValue('endDate', formateDate);
                    setSelectedEndDate(date);
                  }}
                  selectDate={selectedEndDate}
                  headingText={t('common:closing_date')}
                  customHeadingStyle={[
                    Fonts.poppinMed18,
                    {color: Colors.dark_gray_676C6A},
                  ]}
                  leftIcon={false}
                  rightIcon={true}
                  rightIconName="calendar"
                  customBackgroundStyle={[
                    {
                      backgroundColor: Colors.light_grayF4F4F4,
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  Fonts.poppinMed18,
                  Gutters.tinyVMargin,
                  {color: Colors.black_232C28},
                ]}>
                {t('common:closing_time')}
                <Text
                  style={[Fonts.poppinMed16, {color: Colors.dark_gray_676C6A}]}>
                  {' '}
                  {t('common:optional')}
                </Text>
              </Text>
              <View
                style={[
                  i18next.language === 'en' ? Layout.row : Layout.rowReverse,
                  Layout.alignItemsCenter,
                  Layout.justifyContentBetween,
                ]}>
                <View
                  style={[
                    Layout.row,
                    Layout.alignItemsCenter,
                    {
                      borderWidth: 1,
                      borderRadius: 6,
                      borderColor: Colors.dark_gray_676C6A,
                    },
                  ]}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {}}
                    style={[
                      Layout.center,
                      Layout.row,
                      Layout.alignItemsCenter,
                      {
                        width: 80,
                        height: 60,
                      },
                    ]}>
                    <TextMedium
                      text={'00'}
                      textStyle={[
                        Fonts.poppinMed16,
                        Gutters.tinyRMargin,
                        {color: Colors.dark_gray_676C6A},
                      ]}
                    />
                    <Images.svg.arrowDown.default
                      fill={Colors.dark_gray_676C6A}
                    />
                  </TouchableOpacity>
                  <Text
                    style={[Fonts.poppinMed16, {color: Colors.black_232C28}]}>
                    :
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {}}
                    style={[
                      Layout.center,

                      Layout.row,
                      Layout.alignItemsCenter,
                      {
                        width: 80,
                        height: 60,
                      },
                    ]}>
                    <TextMedium
                      text={'00'}
                      textStyle={[
                        Fonts.poppinMed16,
                        Gutters.tinyRMargin,
                        {color: Colors.dark_gray_676C6A},
                      ]}
                    />
                    <Images.svg.arrowDown.default
                      fill={Colors.dark_gray_676C6A}
                    />
                  </TouchableOpacity>
                </View>
                <View style={[Layout.row, Layout.alignItemsCenter]}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setSelectedTime('am')}
                    style={[
                      Layout.center,
                      {
                        width: 80,
                        height: 60,
                        borderWidth: 1,
                        borderColor:
                          selectedTime === 'am'
                            ? Colors.primary
                            : Colors.dark_gray_676C6A,
                        borderTopLeftRadius: 6,
                        borderBottomLeftRadius: 6,
                        backgroundColor:
                          selectedTime === 'am'
                            ? Colors.lightGreen_DBF5EC
                            : Colors.light_grayF4F4F4,
                      },
                    ]}>
                    <TextMedium
                      text="AM"
                      textStyle={[
                        Fonts.poppinMed18,
                        {
                          textTransform: 'uppercase',
                          color:
                            selectedTime === 'am'
                              ? Colors.primary
                              : Colors.dark_gray_676C6A,
                        },
                      ]}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setSelectedTime('pm')}
                    style={[
                      Layout.center,
                      {
                        width: 80,
                        height: 60,
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderColor:
                          selectedTime === 'pm'
                            ? Colors.primary
                            : Colors.dark_gray_676C6A,
                        borderRightWidth: 1,
                        borderTopRightRadius: 6,
                        borderBottomRightRadius: 6,
                        backgroundColor:
                          selectedTime === 'pm'
                            ? Colors.lightGreen_DBF5EC
                            : Colors.light_grayF4F4F4,
                      },
                    ]}>
                    <TextMedium
                      text="PM"
                      textStyle={[
                        Fonts.poppinMed18,
                        {
                          textTransform: 'uppercase',
                          color:
                            selectedTime === 'pm'
                              ? Colors.primary
                              : Colors.dark_gray_676C6A,
                        },
                      ]}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={[
                  Gutters.smallTMargin,
                  i18next.language === 'en' ? Layout.row : Layout.rowReverse,
                ]}>
                <TextRegular
                  text={
                    'iSqroll busiest time is 7:00-10:00 pm, every day except Saturday'
                  }
                  textStyle={[Fonts.poppinReg16, {color: Colors.black_232C28}]}
                />
              </View>
              <View
                style={[
                  Gutters.smallVMargin,

                  i18next.language === 'en' ? Layout.row : Layout.rowReverse,
                  Layout.alignItemsCenter,
                  Layout.justifyContentBetween,
                ]}>
                <TextMedium
                  text={t('common:show_my_phone_number_in_the_listing')}
                  textStyle={[
                    Fonts.poppinMed16,
                    {textTransform: 'none', color: Colors.black_232C28},
                  ]}
                />
                <CustomSwitch selected={true} setSelected={() => {}} />
              </View>

              <View style={[Gutters.mediumVMargin, Layout.overflow]}>
                <CustomButton
                  onPress={handleSubmit}
                  btnStyle={[{backgroundColor: Colors.primary}]}
                  text={t('common:submit')}
                  textStyle={[{color: Colors.white}]}
                />
              </View>
            </>
          );
        }}
      </Formik>
    </View>
  );
};

export default memo(ItemForVehical);
