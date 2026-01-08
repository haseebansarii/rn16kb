import React, {useState, useEffect, useRef} from 'react';
import {Platform, TouchableOpacity, View} from 'react-native';
import {Formik} from 'formik';
import {useTheme} from '../../hooks';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import {API_URL} from '../../config';

import {
  CustomInput,
  CustomButton,
  CustomLoading,
  TextRegular,
  TextSemiBold,
} from '../../components';
import {FinanceSchema} from '../../utils/Validation';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import {axiosUploadImagesMutation} from '../../services/submitForms/imageUploadFormAxios';
import {
  useUpdateFinanceMutation,
  useLazyGetFinanceQuery,
  useLazyGetGoodLendingQuery,
} from '../../services/accountSettings/financeService';
import {sHight} from '../../utils/ScreenDimentions';
import {toastDangerMessage} from '../../utils/helpers';
import {useUpdateUserFinanceMutation} from '../../services/accountSettings/userProfileService';
import CustomSwitch from '../../components/CustomSwitch';
import {FinanceListing} from '../../components';

const Finance = () => {
  const {Colors, Fonts, Gutters, Layout, Images} = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const user_data = useSelector((state: RootState) => state.auth?.user_data);
  const [updateFinance] = useUpdateFinanceMutation();
  const [triggerGetFinance, {data: rawFinanceData}] = useLazyGetFinanceQuery();
  const [triggerGetGoodLending, {data: goodLendingRaw}] =
    useLazyGetGoodLendingQuery();
  const hasFetchedRef = useRef(false);
  const [updateUserFinance] = useUpdateUserFinanceMutation();

  const [allowGoodLending, setAllowGoodLending] = useState(false);
  const [allowOwnFinance, setAllowOwnFinance] = useState(false);
  const [currentImagePreview, setCurrentImagePreview] = useState<any>(null);

  useEffect(() => {
    // Trigger both finance fetches once when user_data becomes available
    if (user_data?._id && !hasFetchedRef.current) {
      try {
        triggerGetFinance('');
        triggerGetGoodLending('');
        hasFetchedRef.current = true;
      } catch (e) {
        console.log('Finance fetch triggers error', e);
      }
    }
  }, [user_data?._id, triggerGetFinance, triggerGetGoodLending]);

  // initialize toggles when data arrives
  useEffect(() => {
    if (user_data) {
      const userFinanceId = user_data.finance_id;
      const goodId =
        goodLendingRaw?.finance?._id || goodLendingRaw?.data?.finance?._id;
      const ownId =
        rawFinanceData?.finance?._id || rawFinanceData?.data?.finance?._id;

      setAllowGoodLending(
        !!(goodId && userFinanceId && goodId === userFinanceId),
      );
      setAllowOwnFinance(!!(ownId && userFinanceId && ownId === userFinanceId));
    }
  }, [user_data, goodLendingRaw, rawFinanceData]);

  // initialize current image preview when fetched finance initial data changes
  // (moved below to run after `financeInitial` is computed)

  const getImageDisplayName = (image: any) => {
    if (!image) return '';
    // uploaded object may have 'name' or 'filename' or 'url'/'uri'
    if (typeof image === 'string') {
      // string could be URL
      try {
        const parts = image.split('/');
        return parts[parts.length - 1] || image;
      } catch (e) {
        return image;
      }
    }
    if (image.name) return image.name;
    if (image.filename) return image.filename;
    if (image.uri) {
      const parts = image.uri.split('/');
      return parts[parts.length - 1] || image.uri;
    }
    if (image.url) {
      const parts = image.url.split('/');
      return parts[parts.length - 1] || image.url;
    }
    return '';
  };

  const handleToggle = async (
    type: 'good_lending_finance' | 'own_finance',
    value: boolean,
  ) => {
    // value = the new state user wants
    if (!user_data?._id) {
      return;
    }

    // If turning on, set status true and include finance_id
    let payload: any = {id: user_data._id, status: value};

    if (type === 'good_lending_finance') {
      payload.finance_id = goodLendingRaw?.finance?._id;
    } else {
      payload.finance_id = rawFinanceData?.finance?._id;
    }

    if (!payload.finance_id) {
      toastDangerMessage('Finance does not exist, please create one first.');
      return;
    }

    try {
      await updateUserFinance({payload, _id: user_data._id}).unwrap();

      // Enforce only-one-toggle-on rule
      if (value && type === 'good_lending_finance') {
        setAllowGoodLending(true);
        setAllowOwnFinance(false);
      } else if (value && type === 'own_finance') {
        setAllowOwnFinance(true);
        setAllowGoodLending(false);
      } else if (!value) {
        // turning off
        setAllowGoodLending(false);
        setAllowOwnFinance(false);
      }
    } catch (err) {
      console.log('update user finance error', err);
    }
  };

  const initialValues = {
    name: '',
    email: '',
    estimated_interest_rate: '',
    maximum_yearly_terms: '',
    minimum_deposit: '',
    website_link: '',
    description: '',
    image: null,
  };

  const imagePicker = async (
    setFieldValue: (field: string, value: any) => void,
  ) => {
    setIsLoading(true);
    ImagePicker.openPicker({
      width: 200,
      height: 200,
      compressImageQuality: Platform.OS === 'android' ? 0.5 : 0.4,
      compressImageFormat: 'jpeg',
    })
      .then(result => {
        const photo: any = {
          name: result?.path?.split('/').pop(),
          type: result?.mime,
          uri:
            result?.path && String(result.path).startsWith('file://')
              ? result.path
              : `file://${result?.path}`,
        };
        setFieldValue('image', photo);
        setCurrentImagePreview(photo);
        setIsLoading(false);
      })
      .catch(error => {
        console.log('Image Picker Error :::::::::::::', error);
        if (error.code === 'E_PICKER_CANCELLED') {
          // user cancelled
        } else if (error.message) {
          toastDangerMessage(error.message);
        }
        setIsLoading(false);
      });
  };

  const submitFinanceForm = async info => {
    setIsLoading(true);

    try {
      // upload image if present
      if (info.image) {
        const form_data = new FormData();
        form_data.append('files', info.image);

        const res = await axiosUploadImagesMutation(form_data);
        if (
          res?.data?.names &&
          res?.data?.names[0] &&
          res?.data?.names[0].name
        ) {
          info.image = res.data.names[0].name;
        }
      }

      // call API
      const payload = {
        _id: financeInitial?._id,
        name: info.name,
        email: info.email,
        estimated_interest_rate: Number(info.estimated_interest_rate),
        maximum_yearly_terms: Number(info.maximum_yearly_terms),
        minimum_deposit: Number(info.minimum_deposit),
        website_link: info.website_link,
        description: info.description,
        image: info.image,
        user_id: user_data?._id,
      };

      await updateFinance({_id: user_data?._id, payload}).unwrap();
      // Re-fetch latest finance data so preview & form reinitialize with updated values
      try {
        triggerGetFinance('');
      } catch (refetchErr) {
        console.log('Refetch finance error', refetchErr);
      }
    } catch (err) {
      console.log('Finance update error', err);
    } finally {
      setIsLoading(false);
    }
  };

  const mapFinance = (raw: any) => {
    const data = raw?.data || raw?.finance || raw?.finance_data || raw;
    const financeObj = data?.finance || data;
    if (!financeObj) {
      return null;
    }

    return {
      _id: financeObj._id || '',
      name: financeObj.name || '',
      email: financeObj.email || '',
      estimated_interest_rate:
        financeObj.estimated_interest_rate != null
          ? String(financeObj.estimated_interest_rate)
          : '',
      maximum_yearly_terms:
        financeObj.maximum_yearly_terms != null
          ? String(financeObj.maximum_yearly_terms)
          : '',
      minimum_deposit:
        financeObj.minimum_deposit != null
          ? String(financeObj.minimum_deposit)
          : '',
      website_link: financeObj.website_link || '',
      description: financeObj.description || '',
      image: financeObj.image || null,
    };
  };

  // Only use OWN finance for the editable form (users must not edit good lending data)
  const financeInitial = mapFinance(rawFinanceData);

  // initialize current image preview from mapped finance initial (runs when financeInitial changes)
  useEffect(() => {
    setCurrentImagePreview(financeInitial?.image || null);
  }, [financeInitial?.image]);

  // Dynamically pick which finance data to preview based on toggles
  const selectedRawFinance = (() => {
    if (allowGoodLending) {
      return mapFinance(goodLendingRaw);
    }
    if (allowOwnFinance) {
      return mapFinance(rawFinanceData);
    }
    // Fallback: prefer good lending if available, else own
    return mapFinance(goodLendingRaw) || mapFinance(rawFinanceData);
  })();

  // When the selected finance changes, try to immediately set a usable preview
  useEffect(() => {
    // clear previous preview so we attempt to resolve the new one
    setCurrentImagePreview(null);
    const img = selectedRawFinance?.image || financeInitial?.image;
    if (!img) return;

    // If the image is already a URL, file:// uri, or a filename (contains dot), show immediately
    if (typeof img === 'string') {
      if (
        img.startsWith('http') ||
        img.startsWith('file://') ||
        img.startsWith('content://')
      ) {
        setCurrentImagePreview({uri: img});
        return;
      }
      if (img.includes('.')) {
        setCurrentImagePreview({uri: `${API_URL}get-uploaded-image/${img}`});
        return;
      }
      // otherwise it's likely an id-only string; let the candidate resolver effect try fetches
      return;
    }

    // If object shape contains a usable url/uri or a name/filename, set immediately
    if (img.url) {
      setCurrentImagePreview({uri: img.url});
      return;
    }
    if (img.uri) {
      setCurrentImagePreview({uri: img.uri});
      return;
    }
    if (img.name) {
      setCurrentImagePreview({uri: `${API_URL}get-uploaded-image/${img.name}`});
      return;
    }
    if (img.filename) {
      setCurrentImagePreview({
        uri: `${API_URL}get-uploaded-image/${img.filename}`,
      });
      return;
    }
    // otherwise, leave null and the serverCandidates effect will attempt to resolve
  }, [
    selectedRawFinance?.image,
    selectedRawFinance?._id,
    financeInitial?.image,
  ]);

  const previewFinance = {
    name: selectedRawFinance?.name || 'Sample Finance Co',
    email: selectedRawFinance?.email || 'info@finance.co',
    image: currentImagePreview || selectedRawFinance?.image || null,
    website_link: selectedRawFinance?.website_link || 'https://example.com',
    description: selectedRawFinance?.description || '',
    estimated_interest_rate: selectedRawFinance?.estimated_interest_rate || '8',
    maximum_yearly_terms: selectedRawFinance?.maximum_yearly_terms || '5',
    minimum_deposit: selectedRawFinance?.minimum_deposit || '1000',
  };

  return (
    <KeyboardAwareScrollView
      nestedScrollEnabled={true}
      keyboardShouldPersistTaps={'always'}
      contentContainerStyle={[Layout.flexGrow, Gutters.littleHPadding]}
      style={[Layout.fill]}
      extraScrollHeight={Platform.OS === 'android' ? 70 : 100}
      enableResetScrollToCoords={false}>
      <View>
        <TextSemiBold
          text={'Finance Details'}
          textStyle={[
            Fonts.poppinSemiBold24,
            Gutters.smallTMargin,
            Gutters.smallLMargin,
            {color: Colors.black_232C28},
          ]}
        />

        <View style={[Gutters.smallMargin]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TextRegular
              text={'Allow good lending finance'}
              textStyle={[Fonts.poppinReg16]}
            />
            <CustomSwitch
              selected={allowGoodLending}
              setSelected={(val: boolean) =>
                handleToggle('good_lending_finance', val)
              }
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 12,
            }}>
            <TextRegular
              text={'Allow your own finance'}
              textStyle={[Fonts.poppinReg16]}
            />
            <CustomSwitch
              selected={allowOwnFinance}
              setSelected={(val: boolean) => handleToggle('own_finance', val)}
            />
          </View>
        </View>

        {/* Finance Preview Component */}
        <View style={[Gutters.smallMargin]}>
          <FinanceListing
            finance={previewFinance}
            buyNowPrice={10000}
            uploadingImage={currentImagePreview?.uri || null}
            style={{marginTop: 10}}
            defaultExpanded={true}
          />
          <TextRegular
            text={'This is a preview of what users would see on your listings.'}
            textStyle={[
              Fonts.poppinReg14,
              Gutters.smallTMargin,
              {color: Colors.gray_606060},
            ]}
          />
        </View>

        <View style={[Layout.fill, Layout.selfCenter, {width: '94%'}]}>
          <Formik
            key={JSON.stringify(financeInitial || initialValues)}
            initialValues={financeInitial || initialValues}
            validationSchema={FinanceSchema}
            onSubmit={submitFinanceForm}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              touched,
              errors,
              setFieldValue,
            }) => (
              <>
                {/* Name */}
                <View style={[Gutters.smallTMargin]}>
                  <CustomInput
                    headingText={'Name'}
                    headingTextStyle={[
                      Fonts.poppinSemiBold18,
                      {color: Colors.black_232C28},
                    ]}
                    inputProps={{
                      onChangeText: handleChange('name'),
                      onBlur: handleBlur('name'),
                      value: values.name,
                    }}
                    lefticon={true}
                    lefticonName={'name'}
                    lefticonStyle={{height: 23, width: 23}}
                    placeholder={'Enter name'}
                    showPassword={false}
                    inputStyle={[Gutters.tinyLPadding]}
                    backgroundStyle={[
                      {backgroundColor: Colors.light_grayF4F4F4},
                    ]}
                  />
                </View>
                {touched.name && errors.name && (
                  <TextRegular
                    text={errors.name}
                    textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                  />
                )}

                {/* Email */}
                <View style={[Gutters.smallTMargin]}>
                  <CustomInput
                    headingText={'Email'}
                    headingTextStyle={[
                      Fonts.poppinSemiBold18,
                      {color: Colors.black_232C28},
                    ]}
                    inputProps={{
                      onChangeText: handleChange('email'),
                      onBlur: handleBlur('email'),
                      value: values.email,
                      keyboardType: 'email-address',
                    }}
                    lefticon={true}
                    lefticonName={'email'}
                    lefticonStyle={{height: 23, width: 23}}
                    placeholder={'Enter email'}
                    showPassword={false}
                    inputStyle={[Gutters.tinyLPadding]}
                    backgroundStyle={[
                      {backgroundColor: Colors.light_grayF4F4F4},
                    ]}
                  />
                </View>
                {touched.email && errors.email && (
                  <TextRegular
                    text={errors.email}
                    textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                  />
                )}

                {/* Image */}
                <View
                  style={[
                    Gutters.smallTMargin,
                    {
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    },
                  ]}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => imagePicker(setFieldValue)}
                    style={[Layout.fill, Layout.center, {zIndex: 1}]}>
                    <CustomInput
                      editable={false}
                      headingText={'Image'}
                      headingTextStyle={[
                        Fonts.poppinSemiBold18,
                        {color: Colors.black_232C28},
                      ]}
                      inputProps={{value: getImageDisplayName(values.image)}}
                      lefticon={true}
                      lefticonName={'name'}
                      lefticonStyle={{height: 23, width: 23}}
                      placeholder={'Upload image'}
                      showPassword={false}
                      inputStyle={[Gutters.tinyLPadding]}
                      backgroundStyle={[
                        {backgroundColor: Colors.light_grayF4F4F4},
                      ]}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                      setFieldValue('image', null);
                      setCurrentImagePreview(null);
                    }}
                    style={{marginTop: 30}}>
                    <Images.svg.dustbinRed.default height={30} width={30} />
                  </TouchableOpacity>
                </View>

                {/* Website Link */}
                <View style={[Gutters.smallTMargin]}>
                  <CustomInput
                    headingText={'Website Link'}
                    headingTextStyle={[
                      Fonts.poppinSemiBold18,
                      {color: Colors.black_232C28},
                    ]}
                    inputProps={{
                      onChangeText: handleChange('website_link'),
                      onBlur: handleBlur('website_link'),
                      value: values.website_link,
                    }}
                    lefticon={true}
                    lefticonName={'name'}
                    lefticonStyle={{height: 23, width: 23}}
                    placeholder={'Enter website link'}
                    showPassword={false}
                    inputStyle={[Gutters.tinyLPadding]}
                    backgroundStyle={[
                      {backgroundColor: Colors.light_grayF4F4F4},
                    ]}
                  />
                </View>
                {touched.website_link && errors.website_link && (
                  <TextRegular
                    text={errors.website_link}
                    textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                  />
                )}

                {/* Description */}
                <View style={[Gutters.smallTMargin]}>
                  <CustomInput
                    headingText={'Description'}
                    headingTextStyle={[
                      Fonts.poppinSemiBold18,
                      {color: Colors.black_232C28},
                    ]}
                    inputProps={{
                      onChangeText: handleChange('description'),
                      onBlur: handleBlur('description'),
                      value: values.description,
                    }}
                    lefticon={true}
                    lefticonName={'name'}
                    lefticonStyle={{height: 23, width: 23}}
                    placeholder={'Enter description'}
                    showPassword={false}
                    inputStyle={[Gutters.tinyLPadding]}
                    backgroundStyle={[
                      {backgroundColor: Colors.light_grayF4F4F4},
                    ]}
                  />
                </View>

                {/* Estimated Interest Rate (%) */}
                <View style={[Gutters.smallTMargin]}>
                  <CustomInput
                    headingText={'Estimated Interest Rate (%)'}
                    headingTextStyle={[
                      Fonts.poppinSemiBold18,
                      {color: Colors.black_232C28},
                    ]}
                    inputProps={{
                      onChangeText: handleChange('estimated_interest_rate'),
                      onBlur: handleBlur('estimated_interest_rate'),
                      value: values.estimated_interest_rate,
                      keyboardType: 'numeric',
                    }}
                    lefticon={true}
                    lefticonName={'name'}
                    lefticonStyle={{height: 23, width: 23}}
                    placeholder={'0 - 100'}
                    showPassword={false}
                    inputStyle={[Gutters.tinyLPadding]}
                    backgroundStyle={[
                      {backgroundColor: Colors.light_grayF4F4F4},
                    ]}
                  />
                </View>
                {touched.estimated_interest_rate &&
                  errors.estimated_interest_rate && (
                    <TextRegular
                      text={errors.estimated_interest_rate}
                      textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                    />
                  )}

                {/* Allow yearly terms up to */}
                <View style={[Gutters.smallTMargin]}>
                  <CustomInput
                    headingText={'Allow yearly terms up to'}
                    headingTextStyle={[
                      Fonts.poppinSemiBold18,
                      {color: Colors.black_232C28},
                    ]}
                    inputProps={{
                      onChangeText: handleChange('maximum_yearly_terms'),
                      onBlur: handleBlur('maximum_yearly_terms'),
                      value: values.maximum_yearly_terms,
                      keyboardType: 'numeric',
                    }}
                    lefticon={true}
                    lefticonName={'name'}
                    lefticonStyle={{height: 23, width: 23}}
                    placeholder={'Enter maximum yearly terms'}
                    showPassword={false}
                    inputStyle={[Gutters.tinyLPadding]}
                    backgroundStyle={[
                      {backgroundColor: Colors.light_grayF4F4F4},
                    ]}
                  />
                </View>
                {touched.maximum_yearly_terms &&
                  errors.maximum_yearly_terms && (
                    <TextRegular
                      text={errors.maximum_yearly_terms}
                      textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                    />
                  )}

                {/* Allow finance from */}
                <View style={[Gutters.smallTMargin]}>
                  <CustomInput
                    headingText={'Allow finance from'}
                    headingTextStyle={[
                      Fonts.poppinSemiBold18,
                      {color: Colors.black_232C28},
                    ]}
                    inputProps={{
                      onChangeText: handleChange('minimum_deposit'),
                      onBlur: handleBlur('minimum_deposit'),
                      value: values.minimum_deposit,
                      keyboardType: 'numeric',
                    }}
                    lefticon={true}
                    lefticonName={'name'}
                    lefticonStyle={{height: 23, width: 23}}
                    placeholder={'Enter minimum deposit'}
                    showPassword={false}
                    inputStyle={[Gutters.tinyLPadding]}
                    backgroundStyle={[
                      {backgroundColor: Colors.light_grayF4F4F4},
                    ]}
                  />
                </View>
                {touched.minimum_deposit && errors.minimum_deposit && (
                  <TextRegular
                    text={errors.minimum_deposit}
                    textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                  />
                )}

                <View
                  style={[
                    Gutters.mediumTMargin,
                    Layout.overflow,
                    Gutters.largeBMargin,
                  ]}>
                  <CustomButton
                    onPress={() => {
                      if (
                        errors.name ||
                        errors.email ||
                        errors.estimated_interest_rate
                      ) {
                        toastDangerMessage(
                          errors.name ||
                            errors.email ||
                            errors.estimated_interest_rate,
                        );
                      }
                      handleSubmit();
                    }}
                    btnStyle={[
                      Gutters.tinyTMargin,
                      {backgroundColor: Colors.primary},
                    ]}
                    text={'Save'}
                    textStyle={[Fonts.poppinSemiBold24, {color: Colors.white}]}
                  />
                </View>
              </>
            )}
          </Formik>
        </View>
        <CustomLoading isLoading={isLoading} />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Finance;
