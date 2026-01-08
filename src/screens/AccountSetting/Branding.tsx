import {Formik} from 'formik';
import i18next from 'i18next';
import React, {useEffect, useState} from 'react';
import {Platform, TouchableOpacity, View} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {useSelector} from 'react-redux';
import {
  CustomButton,
  CustomDropDown,
  CustomFastImage,
  CustomInput,
  CustomLoading,
  CustomToggleButton,
  TextRegular,
  TextSemiBold,
} from '../../components';
import {useTheme} from '../../hooks';
import {sHight} from '../../utils/ScreenDimentions';
import {AgentSchema, BrandingSchema} from '../../utils/Validation';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {getURLPhoto, toastDangerMessage} from '../../utils/helpers';
import {axiosUploadImagesMutation} from '../../services/submitForms/imageUploadFormAxios';
import {useUpdateBrandingMutation} from '../../services/accountSettings/brandingService';
import {RootState} from '../../store/store';
import {
  useCreateAgentMutation,
  useDeleteAgentMutation,
  useUpdateAgentMutation,
} from '../../services/accountSettings/agentsService';

const Branding = () => {
  const {Colors, Fonts, Gutters, Images, Layout} = useTheme();
  const [updateBranding] = useUpdateBrandingMutation();
  const [updateAgent] = useUpdateAgentMutation();
  const [createAgent] = useCreateAgentMutation();
  const [deleteAgent] = useDeleteAgentMutation();

  const user_data = useSelector((state: RootState) => state.auth?.user_data);
  const branding_data = useSelector(
    (state: RootState) => state.branding?.brandingData,
  );
  const agents_data = useSelector(
    (state: RootState) => state.agents?.agentsData,
  );
  const [photoImage, setPhotoImage] = useState(null);
  const [logoImage, setLogoImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [agentImage, setAgentImage] = useState(null);
  const [agentVisible, setAgentVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    license_info: '',
    visible: true,
    photo: null,
  });

  const [brandingCache, setBrandingCache] = useState({
    name: '',
    email: '',
    description: '',
    link: '',
    photo: null,
    logo: null,
    banner: null,
  });
  const [agentsCache, setAgentsCache] = useState([]);

  useEffect(() => {
    if (branding_data) {
      setBrandingCache(branding_data);
    }
  }, [branding_data]);

  useEffect(() => {
    if (agents_data) {
      setAgentsCache(agents_data);
    }
  }, [agents_data]);

  const uploadImage = async (temp: Object) => {
    if (temp?.type?.includes('image') || temp?.type?.includes('jpeg')) {
      const form_data = new FormData();
      form_data.append('files', temp);

      const res = await axiosUploadImagesMutation(form_data);

      if (res?.data?.document && res?.data?.document[0]) {
        return res?.data?.document[0];
      } else {
        toastDangerMessage('Something went wrong');
        setIsLoading(false);
      }
    } else {
      toastDangerMessage('Please select image type');
      setIsLoading(false);
    }
  };

  const imagePicker = async (type: 'photo' | 'logo' | 'banner' | 'agent') => {
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
          uri: result?.path,
        };
        switch (type) {
          case 'photo':
            setPhotoImage(photo);
            break;
          case 'logo':
            setLogoImage(photo);
            break;
          case 'banner':
            setBannerImage(photo);
            break;
          case 'agent':
            setAgentImage(photo);
            break;
          default:
            break;
        }

        setIsLoading(false);
      })
      .catch(error => {
        console.log('Image Picker Error :::::::::::::', error);

        if (error.code === 'E_PICKER_CANCELLED') {
          console.log('Image selection was cancelled');
        } else {
          console.log('Image Picker Error', error.message);
        }

        setIsLoading(false);
      });
  };

  const submitBrandingForm = async info => {
    console.log('edit branding req obj ::::: ', info);
    setIsLoading(true);

    if (photoImage) {
      const img = await uploadImage(photoImage);
      info.photo = img;
    }

    if (logoImage) {
      const img = await uploadImage(logoImage);
      info.logo = img;
    }

    if (bannerImage) {
      const img = await uploadImage(bannerImage);
      info.banner = img;
    }

    updateBranding({
      payload: info,
      _id: user_data?._id,
    }).finally(() => {
      setPhotoImage(null);
      setLogoImage(null);
      setBannerImage(null);
      setIsLoading(false);
    });
  };

  const submitAgentForm = async info => {
    console.log('edit agent req obj ::::: ', info);
    setIsLoading(true);

    if (agentImage) {
      const img = await uploadImage(agentImage);
      info.photo = img;
    }

    info.visible = agentVisible;

    console.log(agentVisible, 'agentVisible');

    if (selectedAgent?._id) {
      updateAgent({
        payload: info,
        _id: selectedAgent?._id,
      }).finally(() => {
        setAgentImage(null);
        setIsLoading(false);
      });
    } else {
      createAgent({
        payload: info,
      }).finally(() => {
        setAgentImage(null);
        setIsLoading(false);
      });
    }
  };

  const submitDeleteAgent = async () => {
    console.log('delete agent req obj ::::: ', selectedAgent?._id);
    setIsLoading(true);

    deleteAgent({
      _id: selectedAgent?._id,
    }).finally(() => {
      setSelectedAgent({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        license_info: '',
        visible: true,
        photo: {name: ''},
      });
      setAgentImage(null);
      setIsLoading(false);
    });
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
        <View style={{flex: 1}}>
          <TextSemiBold
            textProps={{
              numberOfLines: 1,
            }}
            text={t('common:profile_details')}
            textStyle={[
              Fonts.poppinSemiBold24,
              Gutters.smallTMargin,
              Gutters.smallLMargin,
              {color: Colors.black_232C28},
            ]}
          />
          <TextRegular
            textProps={{
              numberOfLines: 1,
            }}
            text={t('common:profile_details_update')}
            textStyle={[
              Fonts.poppinReg16,
              Gutters.smallLMargin,
              Gutters.mediumBMargin,
              {color: Colors.gray_606060},
            ]}
          />
        </View>

        <View
          style={[
            Layout.fill,
            Layout.selfCenter,
            Gutters.smallBMargin,
            {width: '94%'},
          ]}>
          <View
            style={[
              i18next.language === 'en' ? Layout.row : Layout.rowReverse,
              Layout.alignItemsCenter,
            ]}>
            <View style={[Layout.center]}>
              <CustomFastImage
                resizeMode="cover"
                customStyle={[
                  {
                    width: 72,
                    height: 72,
                    borderRadius: 10,
                  },
                ]}
                url={
                  branding_data?.photo?.name
                    ? getURLPhoto(branding_data?.photo?.name)
                    : require('../../theme/assets/images/user.png')
                }
              />
            </View>
            <View style={{flex: 1}}>
              <TextSemiBold
                textProps={{
                  numberOfLines: 1,
                }}
                text={branding_data?.name}
                textStyle={[
                  Fonts.poppinSemiBold24,
                  Gutters.smallLMargin,
                  {color: Colors.black_232C28},
                ]}
              />
              <TextRegular
                textProps={{
                  numberOfLines: 1,
                }}
                text={branding_data?.email}
                textStyle={[
                  Fonts.poppinReg16,
                  Gutters.smallLMargin,
                  {color: Colors.gray_606060},
                ]}
              />
            </View>
          </View>
          <View style={[Layout.fill, Gutters.smallTMargin]}>
            <Formik
              key={JSON.stringify(brandingCache)}
              initialValues={brandingCache}
              validationSchema={BrandingSchema}
              onSubmit={submitBrandingForm}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                touched,
                errors,
                setFieldValue,
              }) => {
                const {email, name, link, description, photo, logo, banner} =
                  values;

                return (
                  <>
                    <View style={[Gutters.smallTMargin]}>
                      <CustomInput
                        headingText={t('common:name')}
                        headingTextStyle={[
                          Fonts.poppinSemiBold18,
                          {color: Colors.black_232C28},
                        ]}
                        inputProps={{
                          onChangeText: handleChange('name'),
                          onBlur: handleBlur('name'),
                          value: name,
                        }}
                        lefticon={true}
                        lefticonName={'name'}
                        lefticonStyle={{height: 23, width: 23}}
                        placeholder={t('common:email_phone')}
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

                    <View style={[Gutters.smallTMargin]}>
                      <CustomInput
                        headingText={t('common:email_address')}
                        headingTextStyle={[
                          Fonts.poppinSemiBold18,
                          {color: Colors.black_232C28},
                        ]}
                        inputProps={{
                          onChangeText: handleChange('email'),
                          onBlur: handleBlur('email'),
                          value: email,
                          keyboardType: 'email',
                        }}
                        lefticon={true}
                        lefticonName={'email'}
                        lefticonStyle={{height: 23, width: 23}}
                        placeholder={t('common:email_phone')}
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
                        onPress={() => imagePicker('photo')}
                        style={[Layout.fill, Layout.center, {zIndex: 1}]}>
                        <CustomInput
                          editable={false}
                          headingText={'Profile Image'}
                          headingTextStyle={[
                            Fonts.poppinSemiBold18,
                            {color: Colors.black_232C28},
                          ]}
                          inputProps={{
                            value: photo?.name,
                          }}
                          lefticon={true}
                          lefticonName={'name'}
                          lefticonStyle={{height: 23, width: 23}}
                          placeholder={t('common:upload')}
                          showPassword={false}
                          inputStyle={[Gutters.tinyLPadding]}
                          backgroundStyle={[
                            {backgroundColor: Colors.light_grayF4F4F4},
                          ]}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => setFieldValue('photo', null)}
                        style={{marginTop: 30}}>
                        <Images.svg.dustbinRed.default height={30} width={30} />
                      </TouchableOpacity>
                    </View>

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
                        onPress={() => imagePicker('logo')}
                        style={[Layout.fill, Layout.center, {zIndex: 1}]}>
                        <CustomInput
                          editable={false}
                          headingText={t('common:brand_logo')}
                          headingTextStyle={[
                            Fonts.poppinSemiBold18,
                            {color: Colors.black_232C28},
                          ]}
                          inputProps={{
                            value: logo?.name,
                          }}
                          lefticon={true}
                          lefticonName={'name'}
                          lefticonStyle={{height: 23, width: 23}}
                          placeholder={t('common:upload')}
                          showPassword={false}
                          inputStyle={[Gutters.tinyLPadding]}
                          backgroundStyle={[
                            {backgroundColor: Colors.light_grayF4F4F4},
                          ]}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => setFieldValue('logo', null)}
                        style={{marginTop: 30}}>
                        <Images.svg.dustbinRed.default height={30} width={30} />
                      </TouchableOpacity>
                    </View>

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
                        onPress={() => imagePicker('banner')}
                        style={[Layout.fill, Layout.center, {zIndex: 1}]}>
                        <CustomInput
                          editable={false}
                          headingText={t('common:brand_banner')}
                          headingTextStyle={[
                            Fonts.poppinSemiBold18,
                            {color: Colors.black_232C28},
                          ]}
                          inputProps={{
                            value: banner?.name,
                          }}
                          lefticon={true}
                          lefticonName={'name'}
                          lefticonStyle={{height: 23, width: 23}}
                          placeholder={t('common:upload')}
                          showPassword={false}
                          inputStyle={[Gutters.tinyLPadding]}
                          backgroundStyle={[
                            {backgroundColor: Colors.light_grayF4F4F4},
                          ]}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => setFieldValue('banner', null)}
                        style={{marginTop: 30}}>
                        <Images.svg.dustbinRed.default height={30} width={30} />
                      </TouchableOpacity>
                    </View>

                    <View style={[Gutters.smallTMargin]}>
                      <CustomInput
                        headingText={t('common:website_link')}
                        headingTextStyle={[
                          Fonts.poppinSemiBold18,
                          {color: Colors.black_232C28},
                        ]}
                        inputProps={{
                          onChangeText: handleChange('link'),
                          onBlur: handleBlur('link'),
                          value: link,
                        }}
                        lefticon={true}
                        lefticonName={'name'}
                        lefticonStyle={{height: 23, width: 23}}
                        placeholder={t('common:email_phone')}
                        showPassword={false}
                        inputStyle={[Gutters.tinyLPadding]}
                        backgroundStyle={[
                          {backgroundColor: Colors.light_grayF4F4F4},
                        ]}
                      />
                    </View>

                    <View style={[Gutters.smallTMargin]}>
                      <CustomInput
                        headingText={t('common:brand_description')}
                        headingTextStyle={[
                          Fonts.poppinSemiBold18,
                          {color: Colors.black_232C28},
                        ]}
                        inputProps={{
                          onChangeText: handleChange('description'),
                          onBlur: handleBlur('description'),
                          value: description,
                        }}
                        lefticon={true}
                        lefticonName={'name'}
                        lefticonStyle={{height: 23, width: 23}}
                        placeholder={t('common:email_phone')}
                        showPassword={false}
                        inputStyle={[Gutters.tinyLPadding]}
                        backgroundStyle={[
                          {backgroundColor: Colors.light_grayF4F4F4},
                        ]}
                      />
                    </View>

                    <View style={[Gutters.mediumTMargin, Layout.overflow]}>
                      <CustomButton
                        onPress={() => {
                          if (errors.name || errors.email) {
                            // Show toast if data is missing or incorrect
                            toastDangerMessage(errors.name || errors.email);
                          }

                          handleSubmit();
                        }}
                        btnStyle={[
                          Gutters.tinyTMargin,
                          {backgroundColor: Colors.primary},
                        ]}
                        text={t('common:save')}
                        textStyle={[
                          Fonts.poppinSemiBold24,
                          {color: Colors.white},
                        ]}
                      />
                    </View>
                  </>
                );
              }}
            </Formik>
          </View>
        </View>

        <View style={{flex: 1}}>
          <TextSemiBold
            textProps={{
              numberOfLines: 1,
            }}
            text={t('common:agent_details')}
            textStyle={[
              Fonts.poppinSemiBold24,
              Gutters.mediumTMargin,
              Gutters.smallLMargin,
              {color: Colors.black_232C28},
            ]}
          />
          <TextRegular
            textProps={{
              numberOfLines: 1,
            }}
            text={t('common:agent_details_update')}
            textStyle={[
              Fonts.poppinReg16,
              Gutters.smallLMargin,
              Gutters.mediumBMargin,
              {color: Colors.gray_606060},
            ]}
          />
        </View>

        <View
          style={[
            Gutters.smallLMargin,
            Gutters.smallRMargin,
            Gutters.mediumBMargin,
          ]}>
          <CustomDropDown
            data={[
              {key: 'Create New', value: null},
              ...agentsCache?.flatMap(item => [
                {
                  key: `${item?.first_name} ${item?.last_name}`,
                  value: item?._id,
                },
              ]),
            ]}
            selectedTextStyle={{color: Colors.dark_gray_676C6A}}
            headingTextStyle={[
              Fonts.poppinSemiBold18,
              {color: Colors.black_232C28},
            ]}
            customStyle={[
              {
                backgroundColor: Colors.light_grayF4F4F4,
                borderWidth: 1,
                borderColor: Colors.black_232C28,
              },
            ]}
            setSelected={id => {
              const agent = agentsCache?.find(item => item?._id === id);

              if (agent) {
                setSelectedAgent(agent);
                setAgentVisible(agent?.visible);
                setAgentImage(null);
              } else {
                setSelectedAgent({
                  first_name: '',
                  last_name: '',
                  email: '',
                  phone_number: '',
                  license_info: '',
                  visible: true,
                  photo: {name: ''},
                });
                setAgentVisible(true);
              }
            }}
            placeholder={t('common:select')}
            headingText={t('common:select_agent')}
            itemStyle={[{backgroundColor: Colors.light_grayF4F4F4}]}
          />
        </View>

        <View
          style={[
            Layout.fill,
            Layout.selfCenter,
            Gutters.smallBMargin,
            {width: '94%'},
          ]}>
          <View
            style={[
              i18next.language === 'en' ? Layout.row : Layout.rowReverse,
              Layout.alignItemsCenter,
            ]}>
            <View style={[Layout.center]}>
              <CustomFastImage
                resizeMode="cover"
                customStyle={[
                  {
                    width: 72,
                    height: 72,
                    borderRadius: 100,
                  },
                ]}
                url={
                  selectedAgent?.photo?.name
                    ? getURLPhoto(selectedAgent?.photo?.name)
                    : require('../../theme/assets/images/user.png')
                }
              />
            </View>
            <View style={{flex: 1}}>
              <TextSemiBold
                textProps={{
                  numberOfLines: 1,
                }}
                text={`${selectedAgent?.first_name} ${selectedAgent?.last_name}`}
                textStyle={[
                  Fonts.poppinSemiBold24,
                  Gutters.smallLMargin,
                  {color: Colors.black_232C28},
                ]}
              />
              <TextRegular
                textProps={{
                  numberOfLines: 1,
                }}
                text={selectedAgent?.email}
                textStyle={[
                  Fonts.poppinReg16,
                  Gutters.smallLMargin,
                  {color: Colors.gray_606060},
                ]}
              />
            </View>
          </View>

          {selectedAgent._id && (
            <View style={[Gutters.mediumTMargin]}>
              <CustomButton
                onPress={submitDeleteAgent}
                btnStyle={[Gutters.tinyVMargin, {backgroundColor: Colors.red}]}
                text={t('common:delete_profile')}
                textStyle={[
                  Fonts.poppinSemiBold24,
                  {color: Colors.black_232C28},
                ]}
              />
            </View>
          )}

          <View style={[Layout.fill, Gutters.smallTMargin]}>
            <Formik
              key={JSON.stringify(selectedAgent)}
              initialValues={selectedAgent}
              validationSchema={AgentSchema}
              onSubmit={submitAgentForm}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                touched,
                errors,
              }) => {
                const {
                  first_name,
                  last_name,
                  email,
                  phone_number,
                  license_info,
                  visible,
                  photo,
                } = values;

                return (
                  <>
                    <View
                      style={[
                        Layout.row,
                        Layout.center,
                        Layout.justifyContentBetween,
                      ]}>
                      <TextSemiBold
                        textProps={{
                          numberOfLines: 1,
                        }}
                        text={'Display Agent on Listings'}
                        textStyle={[
                          Fonts.poppinSemiBold20,
                          Gutters.tinyLMargin,
                          {color: Colors.black_232C28},
                        ]}
                      />
                      <CustomToggleButton
                        flag="visible"
                        value={visible}
                        toggleHandler={v => setAgentVisible(v.value)}
                      />
                    </View>

                    <View style={[Gutters.mediumTMargin]}>
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => imagePicker('agent')}
                        style={[Layout.fill, Layout.center, {zIndex: 1}]}>
                        <CustomInput
                          editable={false}
                          headingText={'Profile Image'}
                          headingTextStyle={[
                            Fonts.poppinSemiBold18,
                            {color: Colors.black_232C28},
                          ]}
                          inputProps={{
                            value: photo?.name,
                          }}
                          lefticon={true}
                          lefticonName={'name'}
                          lefticonStyle={{height: 23, width: 23}}
                          placeholder={t('common:upload')}
                          showPassword={false}
                          inputStyle={[Gutters.tinyLPadding]}
                          backgroundStyle={[
                            {backgroundColor: Colors.light_grayF4F4F4},
                          ]}
                        />
                      </TouchableOpacity>
                    </View>

                    <View style={[Gutters.smallTMargin]}>
                      <CustomInput
                        headingText={t('common:first_name')}
                        headingTextStyle={[
                          Fonts.poppinSemiBold18,
                          {color: Colors.black_232C28},
                        ]}
                        inputProps={{
                          onChangeText: handleChange('first_name'),
                          onBlur: handleBlur('first_name'),
                          value: first_name,
                        }}
                        lefticon={true}
                        lefticonName={'name'}
                        lefticonStyle={{height: 23, width: 23}}
                        placeholder={t('common:email_phone')}
                        showPassword={false}
                        inputStyle={[Gutters.tinyLPadding]}
                        backgroundStyle={[
                          {backgroundColor: Colors.light_grayF4F4F4},
                        ]}
                      />
                    </View>
                    {touched.first_name && errors.first_name && (
                      <TextRegular
                        text={errors.first_name}
                        textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                      />
                    )}

                    <View style={[Gutters.smallTMargin]}>
                      <CustomInput
                        headingText={t('common:last_name')}
                        headingTextStyle={[
                          Fonts.poppinSemiBold18,
                          {color: Colors.black_232C28},
                        ]}
                        inputProps={{
                          onChangeText: handleChange('last_name'),
                          onBlur: handleBlur('last_name'),
                          value: last_name,
                        }}
                        lefticon={true}
                        lefticonName={'name'}
                        lefticonStyle={{height: 23, width: 23}}
                        placeholder={t('common:email_phone')}
                        showPassword={false}
                        inputStyle={[Gutters.tinyLPadding]}
                        backgroundStyle={[
                          {backgroundColor: Colors.light_grayF4F4F4},
                        ]}
                      />
                    </View>
                    {touched.last_name && errors.last_name && (
                      <TextRegular
                        text={errors.last_name}
                        textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                      />
                    )}

                    <View style={[Gutters.smallTMargin]}>
                      <CustomInput
                        headingText={t('common:email_address')}
                        headingTextStyle={[
                          Fonts.poppinSemiBold18,
                          {color: Colors.black_232C28},
                        ]}
                        inputProps={{
                          onChangeText: handleChange('email'),
                          onBlur: handleBlur('email'),
                          value: email,
                          keyboardType: 'email',
                        }}
                        lefticon={true}
                        lefticonName={'email'}
                        lefticonStyle={{height: 23, width: 23}}
                        placeholder={t('common:email_phone')}
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

                    <View style={[Gutters.smallTMargin]}>
                      <CustomInput
                        headingText={t('common:phone_number')}
                        headingTextStyle={[
                          Fonts.poppinSemiBold18,
                          {color: Colors.black_232C28},
                        ]}
                        inputProps={{
                          onChangeText: handleChange('phone_number'),
                          onBlur: handleBlur('phone_number'),
                          value: phone_number,
                        }}
                        lefticon={true}
                        lefticonName={'phone_green'}
                        lefticonStyle={{height: 23, width: 23}}
                        placeholder={t('common:email_phone')}
                        showPassword={false}
                        inputStyle={[Gutters.tinyLPadding]}
                        backgroundStyle={[
                          {backgroundColor: Colors.light_grayF4F4F4},
                        ]}
                      />
                    </View>

                    <View style={[Gutters.smallTMargin]}>
                      <CustomInput
                        headingText={t('common:license_info')}
                        headingTextStyle={[
                          Fonts.poppinSemiBold18,
                          {color: Colors.black_232C28},
                        ]}
                        inputProps={{
                          onChangeText: handleChange('license_info'),
                          onBlur: handleBlur('license_info'),
                          value: license_info,
                        }}
                        lefticon={true}
                        lefticonName={'name'}
                        lefticonStyle={{height: 23, width: 23}}
                        placeholder={t('common:email_phone')}
                        showPassword={false}
                        inputStyle={[Gutters.tinyLPadding]}
                        backgroundStyle={[
                          {backgroundColor: Colors.light_grayF4F4F4},
                        ]}
                      />
                    </View>

                    <View style={[Gutters.mediumTMargin, Layout.overflow]}>
                      <CustomButton
                        onPress={() => {
                          if (errors.name || errors.email) {
                            // Show toast if data is missing or incorrect
                            toastDangerMessage(errors.name || errors.email);
                          }

                          handleSubmit();
                        }}
                        btnStyle={[
                          Gutters.tinyTMargin,
                          {backgroundColor: Colors.primary},
                        ]}
                        text={t('common:save')}
                        textStyle={[
                          Fonts.poppinSemiBold24,
                          {color: Colors.white},
                        ]}
                      />
                    </View>
                  </>
                );
              }}
            </Formik>
          </View>
        </View>

        <CustomLoading isLoading={isLoading} />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Branding;
