import {Formik} from 'formik';
import React, {useState} from 'react';
import {Keyboard, Platform, View} from 'react-native';
import {
  CustomButton,
  CustomDropDown,
  CustomHeader,
  CustomInput,
  CustomLoading,
  ScreenWrapper,
  TextRegular,
} from '../../components';
import {useTheme} from '../../hooks';
import {ContactUs} from '../../utils/Interface';
import {sHight} from '../../utils/ScreenDimentions';
import {ContactUsSchema} from '../../utils/Validation';
import {useContactUsPostMutation} from '../../services/profileTab/reportsUser';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

type Props = {
  navigation: any;
};

const ContactUsContainer = ({navigation}: Props) => {
  const {Colors, Layout, Images, Gutters, Fonts} = useTheme();
  const [doContactUs, {isLoading}] = useContactUsPostMutation();
  const submitContactDetail = (v, resetForm) => {
    Keyboard.dismiss();
    let body = {
      first_name: v?.first_name,
      last_name: v?.last_name,
      email: v?.email,
      phone: v?.phone,
      message: v?.detail,
    };
    doContactUs(body).then(res => {
      if (res?.data?.message) {
        resetForm();
        navigation.goBack();
      }
    });
  };
  return (
    <View style={[Layout.fill, {backgroundColor: Colors.white}]}>
      <CustomHeader
        title={t('common:contact_us')}
        navigation={navigation}
        rightIcon={true}
      />
      <KeyboardAwareScrollView
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps={'always'}
        contentContainerStyle={[Layout.flexGrow, Gutters.littleHPadding]}
        style={[Layout.fill]}
        extraScrollHeight={Platform.OS === 'android' ? 70 : 100}
        // scrollEnabled={scrollEnabledDate}
        // enableAutomaticScroll={scrollEnabled}
        // keyboardDismissMode="on-drag"
        enableResetScrollToCoords={false}>
        <View style={[Layout.fill, Layout.screen]}>
          <Formik
            enableReinitialize
            initialValues={ContactUs}
            validationSchema={ContactUsSchema}
            onSubmit={(v, {resetForm}) => {
              submitContactDetail(v, resetForm);
            }}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              touched,
              errors,
            }) => {
              const {email, first_name, phone, detail, last_name} = values;
              return (
                <>
                  <CustomInput
                    headingText={t('common:first_name')}
                    inputProps={{
                      onChangeText: handleChange('first_name'),
                      onBlur: handleBlur('first_name'),
                      value: first_name,
                      placeholderTextColor: Colors.gray_A4A4A4,
                    }}
                    headingTextStyle={[
                      Gutters.tinyTMargin,

                      Fonts.poppinMed16,
                      {color: Colors.black_232C28},
                    ]}
                    inputStyle={[Fonts.poppinReg16]}
                    backgroundStyle={[
                      {
                        borderWidth: 1,
                        borderColor: Colors.dark_gray_676C6A,
                        backgroundColor: Colors.light_grayF4F4F4,
                      },
                    ]}
                    placeholder={t('common:enter_your_first_name')}
                    showPassword={false}
                  />
                  {touched.first_name && errors.first_name && (
                    <TextRegular
                      text={errors.first_name}
                      textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                    />
                  )}
                  <CustomInput
                    headingText={t('common:last_name')}
                    inputProps={{
                      onChangeText: handleChange('last_name'),
                      onBlur: handleBlur('last_name'),
                      value: last_name,
                      placeholderTextColor: Colors.gray_A4A4A4,
                    }}
                    headingTextStyle={[
                      Gutters.tinyTMargin,
                      Fonts.poppinMed16,
                      {color: Colors.black_232C28},
                    ]}
                    inputStyle={[Fonts.poppinReg16]}
                    backgroundStyle={[
                      {
                        borderWidth: 1,
                        borderColor: Colors.dark_gray_676C6A,
                        backgroundColor: Colors.light_grayF4F4F4,
                      },
                    ]}
                    placeholder={t('common:enter_your_last_name')}
                    showPassword={false}
                  />

                  {touched.last_name && errors.last_name && (
                    <TextRegular
                      text={errors.last_name}
                      textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                    />
                  )}
                  <View style={[Gutters.littleVMargin]}>
                    <CustomInput
                      headingText={t('common:email')}
                      inputProps={{
                        onChangeText: handleChange('email'),
                        onBlur: handleBlur('email'),
                        value: email,
                        keyboardType: 'email-address',
                        placeholderTextColor: Colors.gray_A4A4A4,
                      }}
                      headingTextStyle={[
                        Gutters.tinyTMargin,
                        Fonts.poppinMed16,
                        {color: Colors.black_232C28},
                      ]}
                      backgroundStyle={[
                        {
                          borderWidth: 1,
                          borderColor: Colors.dark_gray_676C6A,
                          backgroundColor: Colors.light_grayF4F4F4,
                        },
                      ]}
                      inputStyle={[Fonts.poppinReg16]}
                      placeholder={t('common:enter_email_address')}
                      showPassword={false}
                    />
                    {touched.email && errors.email && (
                      <TextRegular
                        text={errors.email}
                        textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                      />
                    )}
                  </View>
                  <View style={[Gutters.littleVMargin]}>
                    <CustomInput
                      headingText={t('common:contact_number')}
                      inputProps={{
                        onChangeText: handleChange('phone'),
                        onBlur: handleBlur('phone'),
                        value: phone,
                        keyboardType: 'number-pad',
                        placeholderTextColor: Colors.gray_A4A4A4,
                      }}
                      headingTextStyle={[
                        Gutters.tinyTMargin,
                        Fonts.poppinMed16,
                        {color: Colors.black_232C28},
                      ]}
                      inputStyle={[Fonts.poppinReg16]}
                      backgroundStyle={[
                        {
                          borderWidth: 1,
                          borderColor: Colors.dark_gray_676C6A,
                          backgroundColor: Colors.light_grayF4F4F4,
                        },
                      ]}
                      placeholder={t('common:enter_number')}
                      showPassword={false}
                    />
                    {touched.phone && errors.phone && (
                      <TextRegular
                        text={errors.phone}
                        textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                      />
                    )}
                  </View>
                  {/* <View style={[Gutters.littleTMargin]}>
                    <CustomDropDown
                      data={[
                        {key: 'item 1', value: 'value'},
                        {key: 'item 2', value: 'value'},
                        {key: 'item 3', value: 'value'},
                      ]}
                      selectedTextStyle={[
                        Fonts.poppinReg16,
                        {color: Colors.gray_A4A4A4},
                      ]}
                      headingTextStyle={[
                        Fonts.poppinReg16,
                        {color: Colors.black_232C28},
                      ]}
                      customStyle={[
                        {
                          borderWidth: 1,
                          borderColor: Colors.dark_gray_676C6A,
                          backgroundColor: Colors.light_grayF4F4F4,
                        },
                      ]}
                      setSelected={setSelectedPurpose}
                      placeholder={t('common:select_purpose')}
                      headingText={t('common:purpose')}
                      itemStyle={[{backgroundColor: Colors.light_grayF4F4F4}]}
                    />
                  </View> */}

                  <CustomInput
                    headingText={t('common:detail')}
                    inputProps={{
                      onChangeText: handleChange('detail'),
                      onBlur: handleBlur('detail'),
                      value: detail,
                      placeholderTextColor: Colors.gray_A4A4A4,
                      multiline: true,
                    }}
                    headingTextStyle={[
                      Gutters.tinyTMargin,
                      Fonts.poppinMed16,
                      {color: Colors.black_232C28},
                    ]}
                    backgroundStyle={[
                      {
                        borderWidth: 1,
                        borderColor: Colors.dark_gray_676C6A,
                        backgroundColor: Colors.light_grayF4F4F4,
                        height: 150,
                      },
                    ]}
                    inputStyle={[
                      Layout.alignItemsCenter,
                      Fonts.poppinReg16,
                      {
                        borderRadius: 6,
                        backgroundColor: Colors.light_grayF4F4F4,
                        textAlignVertical: 'top',
                      },
                    ]}
                    placeholder={t('common:add_detail')}
                    showPassword={false}
                  />
                  {touched.detail && errors.detail && (
                    <TextRegular
                      text={errors.detail}
                      textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                    />
                  )}
                  <View
                    style={[
                      Layout.overflow,
                      Gutters.largeBMargin,
                      Gutters.smallTMargin,
                    ]}>
                    <CustomButton
                      onPress={handleSubmit}
                      btnStyle={[
                        Gutters.tinyTMargin,
                        {backgroundColor: Colors.primary},
                      ]}
                      text={t('common:send')}
                      textStyle={[
                        Fonts.poppinSemiBold20,
                        {color: Colors.white},
                      ]}
                    />
                  </View>
                </>
              );
            }}
          </Formik>
          <CustomLoading isLoading={isLoading} />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default ContactUsContainer;
