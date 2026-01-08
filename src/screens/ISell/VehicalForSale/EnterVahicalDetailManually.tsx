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
import {VehicalManually} from '../../../utils/Interface';
import {sHight, sWidth} from '../../../utils/ScreenDimentions';
import {VehicalManuallySchema} from '../../../utils/Validation';
import {TakePictures} from '../ItemForSale';
import moment from 'moment';

type Props = {
  setManuallySelected: CallableFunction;
};

// This component doesn't seem to be used
const EnterVahicalDetailManually = ({setManuallySelected}: Props) => {
  const {Colors, Images, Fonts, Gutters, Layout} = useTheme();
  const [selected, setSelected] = useState(0);
  const [auctionSelection, setAuctionSelection] = useState(0);
  const [allowBuyers, setAllowBuyers] = useState(false);
  const [selectedFromDate, setSelectedFromDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');

  const [selectedTime, setSelectedTime] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState({
    catagory: '',
    subCatagory: '',
    condition: '',
    payment: '',
    shipping: '',
  });

  const [selectedCheckBox, setSelectedCheckBox] = useState(false);
  return (
    <View>
      <Formik
        initialValues={VehicalManually}
        validationSchema={VehicalManuallySchema}
        onSubmit={(v, {resetForm}) => {
          // loginEmail(v);
        }}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          touched,
          errors,
        }) => {
          const {make, model, body, year, kilometers, title, drive_type} =
            values;
          return (
            <>
              <TextSemiBold
                text={t('common:add_details_to_appear_in_more_search_results')}
                textStyle={[
                  Fonts.poppinSemiBold20,
                  Gutters.smallTMargin,
                  {color: Colors.black_232C28},
                ]}
              />
              <View style={[Layout.wrap]}>
                <CustomInput
                  headingText={t('common:make')}
                  headingTextStyle={[{color: Colors.dark_gray_676C6A}]}
                  inputProps={{
                    onChangeText: handleChange('make'),
                    onBlur: handleBlur('make'),
                    value: make,
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
                {touched.make && errors.make && (
                  <TextRegular
                    text={errors.make}
                    textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                  />
                )}
              </View>
              <View style={[Layout.wrap]}>
                <CustomInput
                  headingText={t('common:model')}
                  headingTextStyle={[{color: Colors.dark_gray_676C6A}]}
                  inputProps={{
                    onChangeText: handleChange('model'),
                    onBlur: handleBlur('model'),
                    value: model,
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
                {touched.model && errors.model && (
                  <TextRegular
                    text={errors.model}
                    textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                  />
                )}
              </View>
              <View style={[Layout.wrap]}>
                <CustomInput
                  headingText={t('common:model_detail')}
                  headingTextStyle={[
                    {textTransform: 'none', color: Colors.dark_gray_676C6A},
                  ]}
                  inputProps={{
                    onChangeText: handleChange('email'),
                    onBlur: handleBlur('email'),
                    value: '',
                    placeholderTextColor: Colors.dark_gray_676C6A,
                    multiline: true,
                  }}
                  inputStyle={[
                    {
                      textAlignVertical: 'top',
                    },
                  ]}
                  backgroundStyle={[
                    {
                      width: sWidth(89),
                      height: 120,
                      backgroundColor: Colors.light_grayF4F4F4,
                    },
                  ]}
                  placeholder={t('common:email_phone')}
                  showPassword={false}
                />
              </View>
              <View style={[Layout.wrap]}>
                <CustomInput
                  headingText={t('common:import_history')}
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
                  headingText={t('common:body')}
                  headingTextStyle={[{color: Colors.dark_gray_676C6A}]}
                  inputProps={{
                    onChangeText: handleChange('body'),
                    onBlur: handleBlur('body'),
                    value: body,
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
                {touched.body && errors.body && (
                  <TextRegular
                    text={errors.body}
                    textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                  />
                )}
              </View>
              <View
                style={[
                  Layout.wrap,
                  Layout.row,
                  Layout.justifyContentBetween,
                  Layout.alignItemsCenter,
                ]}>
                <View>
                  <CustomInput
                    headingText={t('common:seat')}
                    headingTextStyle={[{color: Colors.dark_gray_676C6A}]}
                    inputProps={{
                      onChangeText: handleChange('email'),
                      onBlur: handleBlur('email'),
                      value: '',
                      placeholderTextColor: Colors.dark_gray_676C6A,
                      keyboardType: 'number-pad',
                    }}
                    backgroundStyle={[
                      {
                        width: sWidth(40),
                        backgroundColor: Colors.light_grayF4F4F4,
                      },
                    ]}
                    placeholder={t('common:email_phone')}
                    showPassword={false}
                  />
                </View>
                <View>
                  <CustomInput
                    headingText={t('common:door')}
                    headingTextStyle={[{color: Colors.dark_gray_676C6A}]}
                    inputProps={{
                      onChangeText: handleChange('email'),
                      onBlur: handleBlur('email'),
                      value: '',
                      placeholderTextColor: Colors.dark_gray_676C6A,
                      keyboardType: 'number-pad',
                    }}
                    backgroundStyle={[
                      {
                        width: sWidth(40),
                        backgroundColor: Colors.light_grayF4F4F4,
                      },
                    ]}
                    placeholder={t('common:email_phone')}
                    showPassword={false}
                  />
                </View>
              </View>
              <View style={[Layout.wrap]}>
                <CustomInput
                  headingText={t('common:previous_owners')}
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
                  headingText={t('common:year')}
                  headingTextStyle={[{color: Colors.dark_gray_676C6A}]}
                  inputProps={{
                    onChangeText: handleChange('year'),
                    onBlur: handleBlur('year'),
                    value: year,
                    placeholderTextColor: Colors.dark_gray_676C6A,
                    keyboardType: 'number-pad',
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
                {touched.year && errors.year && (
                  <TextRegular
                    text={errors.year}
                    textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                  />
                )}
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
                    keyboardType: 'number-pad',
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
                  headingText={t('common:colour')}
                  headingTextStyle={[{color: Colors.dark_gray_676C6A}]}
                  inputProps={{
                    onChangeText: handleChange('email'),
                    onBlur: handleBlur('email'),
                    value: '',
                    placeholderTextColor: Colors.dark_gray_676C6A,
                    keyboardType: 'number-pad',
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
                  headingText={t('common:number_plate_or_vin')}
                  headingTextStyle={[{color: Colors.dark_gray_676C6A}]}
                  inputProps={{
                    onChangeText: handleChange('email'),
                    onBlur: handleBlur('email'),
                    value: '',
                    placeholderTextColor: Colors.dark_gray_676C6A,
                    keyboardType: 'number-pad',
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
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={setManuallySelected}
                style={[Gutters.smallTMargin]}>
                <TextSemiBold
                  text={t('common:enter_your_vehicle_detail_automatically')}
                  textStyle={[
                    Fonts.poppinSemiBold18,
                    {
                      textDecorationLine: 'underline',
                      textTransform: 'none',
                      color: Colors.green_06975E,
                    },
                  ]}
                />
              </TouchableOpacity>

              <View style={[Gutters.smallVMargin]}>
                <Text
                  style={[
                    Fonts.poppinSemiBold24,
                    Gutters.smallTMargin,
                    {color: Colors.black_232C28},
                  ]}>
                  {t('common:photos')}
                  <Text
                    style={[
                      Fonts.poppinMed18,
                      {color: Colors.dark_gray_676C6A},
                    ]}>
                    {'    '} 0/20
                  </Text>
                </Text>
                <TextRegular
                  text="You can add up to 20 photos."
                  textStyle={[Fonts.poppinReg18, {color: Colors.black_232C28}]}
                />
              </View>
              <TakePictures />

              <View
                style={[
                  Gutters.smallBPadding,
                  {borderBottomWidth: 1, borderColor: Colors.dark_gray_676C6A},
                ]}>
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
                    headingTextStyle={[{color: Colors.dark_gray_676C6A}]}
                    inputProps={{
                      onChangeText: handleChange('email'),
                      onBlur: handleBlur('email'),
                      value: '',
                      multiline: true,
                      placeholderTextColor: Colors.dark_gray_676C6A,
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
              </View>

              <TextSemiBold
                text={t(
                  'common:used_to_look_up_fuel_efficiency_and_safety_rating_for_this_car',
                )}
                textStyle={[
                  Fonts.poppinSemiBold20,
                  Gutters.smallVMargin,
                  {color: Colors.black_232C28},
                ]}
              />

              <View style={[Layout.wrap]}>
                <CustomInput
                  headingText={t('common:engine_size')}
                  headingTextStyle={[
                    {textTransform: 'none', color: Colors.dark_gray_676C6A},
                  ]}
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
                  headingText={t('common:transmission')}
                  headingTextStyle={[
                    {textTransform: 'none', color: Colors.dark_gray_676C6A},
                  ]}
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
                  headingText={t('common:fuel_type')}
                  headingTextStyle={[
                    {textTransform: 'none', color: Colors.dark_gray_676C6A},
                  ]}
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
                  headingText={t('common:cylinders')}
                  headingTextStyle={[
                    {textTransform: 'none', color: Colors.dark_gray_676C6A},
                  ]}
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
                  headingText={t('common:drive_type')}
                  headingTextStyle={[
                    {textTransform: 'none', color: Colors.dark_gray_676C6A},
                  ]}
                  inputProps={{
                    onChangeText: handleChange('drive_type'),
                    onBlur: handleBlur('drive_type'),
                    value: drive_type,
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
                {touched.drive_type && errors.drive_type && (
                  <TextRegular
                    text={errors.drive_type}
                    textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                  />
                )}
              </View>
              <View style={[Layout.wrap]}>
                <CustomInput
                  headingText={t('common:registration_expiry')}
                  headingTextStyle={[
                    {textTransform: 'none', color: Colors.dark_gray_676C6A},
                  ]}
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
                  headingTextStyle={[
                    {textTransform: 'none', color: Colors.dark_gray_676C6A},
                  ]}
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
                  headingText={t('common:kilometers')}
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
                <TextRegular
                  text={t('common:The_lowest_price_youre_willing_to_sell_for')}
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
                    placeholder={'$'}
                    showPassword={false}
                  />
                </View>
                <TextRegular
                  text={t('common:set_lower_than_reserve_to_attract_more_bids')}
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

                <View
                  style={[
                    Gutters.smallVMargin,
                    i18next.language === 'en' ? Layout.row : Layout.rowReverse,
                    Layout.alignItemsStart,
                  ]}>
                  <CustomCheckBox
                    setSelected={setSelectedCheckBox}
                    customStyle={[
                      {
                        width: 28,
                        height: 28,
                        borderWidth: 1.5,
                        borderRadius: 4,
                        borderColor: Colors.dark_gray_676C6A,
                      },
                    ]}
                  />
                  <View style={[Gutters.xTinyLPadding]}>
                    <TextRegular
                      text={t('common:allow_buyers_to_make_an_offer')}
                      textStyle={[
                        Fonts.poppinReg16,
                        {textTransform: 'none', color: Colors.black_232C28},
                      ]}
                    />
                    <TextRegular
                      text={t(
                        'common:offers_can_be_made_until_the_reserve_price_is_met',
                      )}
                      textStyle={[
                        Fonts.poppinReg14,
                        {textTransform: 'none', color: Colors.dark_gray_676C6A},
                      ]}
                    />
                    <TouchableOpacity>
                      <TextRegular
                        text={t('common:whats_make_an_offer')}
                        textStyle={[
                          Fonts.poppinReg14,
                          {
                            textTransform: 'none',
                            color: Colors.green_06975E,
                          },
                        ]}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </>

              <View style={[Gutters.tinyTMargin]}>
                <CustomDropDown
                  data={[
                    {key: 'item 1', value: 'value'},
                    {key: 'item 2', value: 'value'},
                    {key: 'item 3', value: 'value'},
                  ]}
                  leftIcon={true}
                  iconName={'wallet'}
                  selectedTextStyle={{color: Colors.dark_gray_676C6A}}
                  headingTextStyle={{color: Colors.dark_gray_676C6A}}
                  customStyle={[{backgroundColor: Colors.white}]}
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
                  {color: Colors.dark_gray_676C6A},
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
                      backgroundColor: Colors.light_grayF4F4F4,
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
                          textTransform: 'Uppercase',
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
                          textTransform: 'Uppercase',
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

              <View style={[Gutters.mediumTMargin, Layout.overflow]}>
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

export default memo(EnterVahicalDetailManually);
