import i18next, {t} from 'i18next';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {Keyboard, Platform, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  CustomBottomSheet,
  CustomButton,
  CustomCheckBox,
  CustomDatePicker,
  CustomDropDown,
  CustomInput,
  CustomLoading,
  CustomRadioButton,
  CustomSwitch,
  TextMedium,
  TextRegular,
  TextSemiBold,
} from '../../../components';
import {useTheme} from '../../../hooks';
import {useLazyGetCatagoriesQuery} from '../../../services/catagories/catagory';
import {
  useDeleteItemForSaleMutation,
  usePropertyForSaleMutation,
} from '../../../services/submitForms/forms';
import {
  setDeleteItemForSale,
  setShippingMethods,
  setUpdateItemForSale,
  setWithDrawItemForSale,
  setSellingItemForSale,
} from '../../../store/Forms/ItemForSale';
import {
  imageUploading,
  storeUserCheckPermissons,
} from '../../../store/auth/AuthSlice';
import {setSubCatagory} from '../../../store/catagories/Catagories';
import {RootState} from '../../../store/store';
import {screenWidth, sHight, sWidth} from '../../../utils/ScreenDimentions';
import {TakePictures} from '../ItemForSale';
import {getURLPhoto, toastDangerMessage} from '../../../utils/helpers';
import {StackActions, useIsFocused} from '@react-navigation/native';
import {useLazyGeoCodingQuery} from '../../../services/geocoding';
import {
  useUpdateListingMutation,
  useUpdateListingStatusMutation,
  useMarkListingAsSoldMutation,
} from '../../../services/modules/Listings/getSingleListing';
import {currentStack} from '../../../store/stack/StackSlice';
import {useUploadImagesMutation} from '../../../services/submitForms/imageUploadForm';
import {
  dropdownCondition,
  dropdownPaymentOption,
} from '../../../utils/dummyData';
import {axiosUploadImagesMutation} from '../../../services/submitForms/imageUploadFormAxios';
import {useLazyGetUserCheckPermissionsQuery} from '../../../services/accountSettings/userProfileService';

import Modal from 'react-native-modal';
import {FE_URL} from '../../../config';
import {Linking} from 'react-native';
import RegularText from '../../../components/RegularText';
type Props = {
  navigation: any;
  route: any;
};

const listGarage = [
  {key: 'Yes', value: 'Yes'},
  {key: 'No', value: 'No'},
];

const PropertyForm = ({navigation, route}: Props) => {
  const [uploadImg, {isLoading: imageUpload}] = useUploadImagesMutation();
  const [submitPropertyForSale, {isLoading}] = usePropertyForSaleMutation();
  const [deleteProduct, {isLoading: deleteLoading}] =
    useDeleteItemForSaleMutation();
  const [getGeoCode] = useLazyGeoCodingQuery();
  const [getCatagories] = useLazyGetCatagoriesQuery();
  const [updateProduct, {isLoading: updateLoading}] =
    useUpdateListingMutation();
  const [updateListingSold, {isLoading: soldLoading}] =
    useMarkListingAsSoldMutation();
  const [updateListingStatus, {isLoading: statusLoading}] =
    useUpdateListingStatusMutation();
  const {Colors, Images, Fonts, Gutters, Layout} = useTheme();
  const dispatch = useDispatch();
  // console.log('params==>>', route?.params);
  const isEdit = route?.params?.isEdit;
  const paramData = route?.params?.edit_single_listing_data;
  const categories = useSelector(
    (state): RootState => state.catagories?.categories,
  );
  const subCategories = useSelector(
    (state): RootState => state.catagories?.subCategories,
  );

  const [getUserPermissions] = useLazyGetUserCheckPermissionsQuery();
  const user_permissions = useSelector(
    (state): RootState => state.auth?.user_permissions,
  );
  const [property, setProperty] = useState({
    images: {
      imgArr: isEdit
        ? paramData?.images
        : // ?.map((v: any) => v._id)
          [],
      error: '',
    },
    youtubeVideo: isEdit ? paramData?.property?.youtube_video_url : '',
    _3dUrl: isEdit ? paramData?.property?.three_d_tour_url : '',
    title: {
      text: isEdit ? paramData?.title : '',
      error: '',
    },
    catagory: {
      id: isEdit ? paramData?.category : '',
      error: '',
    },
    subCatagory: {
      id: isEdit ? paramData?.sub_category : '',
      error: '',
    },
    enquireAboutPrice: isEdit && paramData?.type === 'enquire' ? true : false,
    // condition: {
    //   id: isEdit ? paramData?.condition : '',
    //   error: '',
    // },
    aboutProperty: {
      text: isEdit ? paramData?.description : '',
      error: '',
    },
    street: {
      text: isEdit ? paramData?.property?.street_number : '',
      error: '',
    },
    unitFlat: {
      text: isEdit ? paramData?.property?.unit_number : '',
      error: '',
    },
    streetName: {
      text: isEdit ? paramData?.property?.street_name : '',
      error: '',
    },
    region: {
      text: isEdit ? paramData?.property?.region : '',
      error: '',
    },
    district: {
      text: isEdit ? paramData?.property?.district : '',
      error: '',
    },
    suburb: {
      text: isEdit ? paramData?.property?.suburb : '',
      error: '',
    },
    bedrooms: {
      text: isEdit ? String(paramData?.property?.no_of_bedrooms || '') : '',
      error: '',
    },
    bathroom: {
      text: isEdit ? String(paramData?.property?.no_of_bathrooms || '') : '',
      error: '',
    },
    separateToilet: isEdit
      ? String(paramData?.property?.no_of_separate_toilets || '')
      : '',
    ensuiteBathroom: isEdit
      ? String(paramData?.property?.no_of_ensuite_bathrooms || '')
      : '',
    livingAreas: {
      text: isEdit ? String(paramData?.property?.no_of_living_areas || '') : '',
      error: '',
    },
    studies: {
      text: isEdit ? String(paramData?.property?.no_of_studies || '') : '',
      error: '',
    },
    garageParking:
      isEdit && paramData?.property?.garage_parking
        ? 'Yes'
        : isEdit
        ? 'No'
        : '',
    offStreetParking:
      isEdit && paramData?.property?.off_street_parking
        ? 'Yes'
        : isEdit
        ? 'No'
        : '',
    additionalInfoParking: isEdit ? paramData?.property?.parking_details : '',
    asking_price: {
      text: isEdit ? String(paramData?.property?.rent_per_week || '') : '',
      error: '',
    },
    rent_per_week: {
      text: isEdit ? String(paramData?.property?.rent_per_week || '') : '',
      error: '',
    },
    // date_available: {
    //   text: isEdit ? paramData?.property?.date_available : '',
    //   error: '',
    // },
    // listingDuration: isEdit ? paramData?.property?.listing_duration : '',
    mobile: isEdit ? paramData?.property?.mobile_number : '',
    home: isEdit ? paramData?.property?.home : '',
    contactTime: isEdit ? paramData?.property?.best_contact_time : '',
    // isRegisterPropertyAgent: isEdit
    //   ? paramData?.property?.registered_property_agent
    //   : '',
    agent_name: {
      text: isEdit ? paramData?.property?.agent_name : '',
      error: '',
    },
    agency_name: {
      text: isEdit ? paramData?.property?.agency_name : '',
      error: '',
    },
    petsOk: isEdit ? paramData?.property?.pets_ok : '',
    smookingOk: isEdit ? paramData?.property?.smokers_ok : '',
    furnishingWhiteware: isEdit
      ? paramData?.property?.furnishings_n_whiteware
      : '',
    amenities: isEdit ? paramData?.property?.amenities_in_area : '',
    idealTenents: isEdit ? paramData?.property?.ideal_tenants : '',
    paymentOption: {
      text: isEdit ? paramData?.payment_option : 'other',
      error: '',
    },
    startDate: {
      text: isEdit ? paramData?.start_date : '',
      error: '',
    },
    closingDate: {
      text: isEdit ? paramData?.end_date : '',
      error: '',
    },
    closingTime: {
      text:
        isEdit && paramData?.end_time?.length == 5
          ? moment()
              .set({
                hour: parseInt(paramData?.end_time?.split(':')[0]),
                minute: parseInt(paramData?.end_time?.split(':')[1]),
                second: 0,
                millisecond: 0,
              })
              .toISOString()
          : '',
      error: '',
    },
    showPhone: isEdit ? paramData?.show_phone : false,
  });
  // console.log('state==>>', JSON.stringify(property));
  // console.log('dd', paramData?.end_time);
  const [checked, setChecked] = React.useState(1);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showBottomSheetText, setShowBottomSheetText] = useState('');
  const [selected, setSelected] = useState(() => {
    if (isEdit && paramData?.property?.for_sale) {
      return 0;
    } else if (isEdit && !paramData?.property?.for_sale) {
      return 1;
    }

    return 0;
  });

  const [isShowUserPermissionDialog, setIsShowUserPermissionDialog] = useState(
    user_permissions?.is_allowed == false ? true : false,
  );
  const [selectedStartDate, setSelectedStartDate] = useState(
    isEdit ? route?.params?.edit_single_listing_data?.start_date : '',
  );
  const [selectedEndDate, setSelectedEndDate] = useState(
    isEdit ? route?.params?.edit_single_listing_data?.end_date : '',
  );
  const [timeFormate, setTimeFormate] = useState('');

  const isUploading = useRef(false);
  const [reLaod, setReload] = useState(0);

  const [coordinates, setCoordinates] = useState<{
    lat: number | null;
    lng: number | null;
  }>({lat: null, lng: null});

  const updateItemForSale: any = useSelector(
    (state: RootState) => state.itemForSaleProduct?.updateItemForSale,
  );
  const deleteItemForSale: any = useSelector(
    (state: RootState) => state.itemForSaleProduct?.deleteItemForSale,
  );
  const withDrawItemForSale: any = useSelector(
    (state: RootState) => state.itemForSaleProduct?.withDrawItemForSale,
  );
  const sellingItemForSale: any = useSelector(
    (state: RootState) => state.itemForSaleProduct?.sellingItemForSale,
  );
  useEffect(() => {
    setIsShowUserPermissionDialog(
      user_permissions?.is_allowed == false ? true : false,
    );
  }, [user_permissions]);
  useEffect(() => {
    getCatagories('&type=property');
    getUserPermissions('?feature=isell&key=property');
  }, []);
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      getUserPermissions('?feature=isell&key=property');
    }
  }, [isFocused]);

  const setSubCategoryFunc = id => {
    const {sub_categories} = categories.find(c => c?._id === id && c);

    dispatch(setSubCatagory(sub_categories));
  };
  useEffect(() => {
    if (categories?.length > 0 && route?.params?.edit_single_listing_data) {
      setSubCategoryFunc(route?.params?.edit_single_listing_data?.category);
    }
  }, [categories]);

  const uploadImages = async images => {
    const formdata = new FormData();
    images?.forEach(item => formdata.append('files', item));
    // dispatch(imageUploading(true));
    return await axiosUploadImagesMutation(formdata);
  };

  const validations = () => {
    let isFormValid = true;
    if (property?.images?.imgArr?.length == 0) {
      isFormValid = false;
      setProperty(prevState => ({
        ...prevState,
        images: {
          ...prevState.images,
          error: 'Select up to 20 photos.',
        },
      }));
    }
    if (!property?.title?.text) {
      isFormValid = false;
      setProperty(prevState => ({
        ...prevState,
        title: {
          ...prevState.title,
          error: 'Please provide title',
        },
      }));
    }
    if (!property?.catagory?.id) {
      isFormValid = false;
      setProperty(prevState => ({
        ...prevState,
        catagory: {
          ...prevState.catagory,
          error: 'Please select category',
        },
      }));
    }
    if (!property?.subCatagory?.id) {
      isFormValid = false;
      setProperty(prevState => ({
        ...prevState,
        subCatagory: {
          ...prevState.subCatagory,
          error: 'Please select subcategory',
        },
      }));
    }
    // if (!property?.condition?.id) {
    //   isFormValid = false;
    //   setProperty(prevState => ({
    //     ...prevState,
    //     condition: {
    //       ...prevState.condition,
    //       error: 'Please select condition',
    //     },
    //   }));
    // }
    if (!property?.aboutProperty?.text) {
      isFormValid = false;
      setProperty(prevState => ({
        ...prevState,
        aboutProperty: {
          ...prevState.aboutProperty,
          error: 'Description is required',
        },
      }));
    }

    if (!property?.street?.text && !property?.unitFlat?.text) {
      isFormValid = false;
      setProperty(prevState => ({
        ...prevState,
        street: {
          ...prevState.street,
          error: 'This field is required',
        },
        unitFlat: {
          ...prevState.unitFlat,
          error: 'This field is required',
        },
      }));
    }
    // if (!property?.unitFlat?.text) {
    //   isFormValid = false;
    //   setProperty(prevState => ({
    //     ...prevState,
    //     unitFlat: {
    //       ...prevState.unitFlat,
    //       error: 'This field is required',
    //     },
    //   }));
    // }
    if (!property?.streetName?.text) {
      isFormValid = false;
      setProperty(prevState => ({
        ...prevState,
        streetName: {
          ...prevState.streetName,
          error: 'Please provide street name',
        },
      }));
    }
    if (!property?.region?.text) {
      isFormValid = false;
      setProperty(prevState => ({
        ...prevState,
        region: {
          ...prevState.region,
          error: 'Please provide region',
        },
      }));
    }
    if (!property?.district?.text) {
      isFormValid = false;
      setProperty(prevState => ({
        ...prevState,
        district: {
          ...prevState.district,
          error: 'Please provide district',
        },
      }));
    }
    if (!property?.suburb?.text) {
      isFormValid = false;
      setProperty(prevState => ({
        ...prevState,
        suburb: {
          ...prevState.suburb,
          error: 'Please provide suburb',
        },
      }));
    }
    if (
      !property.enquireAboutPrice &&
      !property?.asking_price?.text &&
      selected == 0
    ) {
      isFormValid = false;
      setProperty(prevState => ({
        ...prevState,
        asking_price: {
          ...prevState.asking_price,
          error: 'This field is required',
        },
      }));
    }

    if (
      !property.enquireAboutPrice &&
      property?.asking_price?.text &&
      selected == 0 &&
      parseInt(property?.asking_price?.text) == 0
    ) {
      isFormValid = false;
      setProperty(prevState => ({
        ...prevState,
        asking_price: {
          ...prevState.asking_price,
          error: `This price should be greater than ${t('common:nz')} 0`,
        },
      }));
    }
    if (
      !property.enquireAboutPrice &&
      !property?.rent_per_week?.text &&
      selected != 0
    ) {
      isFormValid = false;
      setProperty(prevState => ({
        ...prevState,
        rent_per_week: {
          ...prevState.rent_per_week,
          error: 'This field is required',
        },
      }));
    }
    if (
      !property.enquireAboutPrice &&
      property?.rent_per_week?.text &&
      selected != 0 &&
      parseInt(property?.rent_per_week?.text) == 0
    ) {
      isFormValid = false;
      setProperty(prevState => ({
        ...prevState,
        rent_per_week: {
          ...prevState.rent_per_week,
          error: `This price should be greater than ${t('common:nz')} 0`,
        },
      }));
    }

    if (!property?.paymentOption?.text) {
      isFormValid = false;
      setProperty(prevState => ({
        ...prevState,
        paymentOption: {
          ...prevState.paymentOption,
          error: 'Payment option is required',
        },
      }));
    }

    return isFormValid;
  };

  const getGeoCodeMethod = ({region, district, suburb}) => {
    let body = `${region}, ${district}, ${suburb}`;
    getGeoCode(body).then(res => {
      console.log('>>> res 00 ', res);

      if (res?.data?.results[0]?.geometry?.location) {
        setCoordinates(res?.data?.results[0]?.geometry?.location);
      } else {
        setCoordinates({lat: null, lng: null});
      }
    });
  };

  const isValidTimeFormat = time => {
    // Regular expression for HH:mm format (24-hour clock)
    const timeRegex = /^[0-2][0-9]:[0-5][0-9]$/;

    // Check if the time string matches the regex
    return typeof time === 'string' && timeRegex.test(time);
  };
  const concatenateDateTime = (date, time) => {
    let r = null;

    if (date && date !== 'Invalid date') {
      let dateOnly = null;
      if (typeof date === 'string') {
        dateOnly = date?.includes('T')
          ? moment(date).format('YYYY-MM-DD')
          : date;
      } else {
        dateOnly = moment(date).format('YYYY-MM-DD');
      }
      if (time && time !== 'Invalid date') {
        r = new Date(dateOnly + ' ' + time);
      } else {
        r = new Date(dateOnly);
      }

      console.log('>>>dateOnly 99 ', dateOnly);
    }

    console.log('>>>r 99 ', r);
    return r;
  };
  const handleEndTime = end_time => {
    if (end_time) {
      if (!end_time || end_time === 'Invalid date') {
        return null;
      }
      if (isValidTimeFormat(end_time)) {
        return end_time; // Return the time as is if it's valid
      } else {
        return null; // Return null if it's not valid
      }
    }
    return null;
  };

  const submitPropertyForm = async () => {
    isUploading.current = true;
    // setTimeout(() => {
    //   isUploading.current = false;
    //   setReload(reLaod + 1);
    // }, 2000);
    if (validations()) {
      let body = {
        title: property.title.text,
        user: null,
        category: property.catagory?.id,
        sub_category: property?.subCatagory?.id,
        make: '',
        model: '',
        type: property.enquireAboutPrice ? 'enquire' : 'fixed_price',
        images: [],
        // condition: property.condition.id,
        fixed_price_offer:
          selected == 0
            ? parseFloat(property.asking_price?.text)
            : parseFloat(property?.rent_per_week.text),
        start_price: null,
        reserve_price: null,
        buy_now_price: null,
        description: property.aboutProperty.text,
        pickup_available: false,
        pickup_location: `${property?.suburb.text} ${property?.district.text} ${property?.region.text}`,
        pickup_location_coordinates: coordinates,
        payment_option: property.paymentOption.text,
        start_date: property.startDate.text,
        end_date: property.closingDate.text,
        end_time: moment(property.closingTime.text).format('HH:mm'),
        shipping: {
          option_name: 'To be arranged',
          value: 'dont_know',
          amount: null,
          description: null,
          url: null,
        },
        show_phone: property?.showPhone,
        make_an_offer: false,
        listing_type: 'property',
        for_sale: selected == 0 ? true : false,
        youtube_video_url: property.youtubeVideo,
        three_d_tour_url: property._3dUrl,
        street_number: property.street.text,
        unit_number: property.unitFlat.text,
        street_name: property?.streetName?.text,
        region: property?.region?.text,
        district: property.district?.text,
        suburb: property?.suburb?.text,
        no_of_bedrooms: parseFloat(property?.bedrooms.text),
        no_of_bathrooms: parseFloat(property.bathroom.text),
        no_of_separate_toilets: parseFloat(property.separateToilet),
        no_of_ensuite_bathrooms: parseFloat(property.ensuiteBathroom),
        no_of_living_areas: parseFloat(property.livingAreas.text),
        no_of_studies: parseFloat(property.studies.text),
        garage_parking: property.garageParking == 'Yes' ? true : false,
        off_street_parking: property.offStreetParking == 'Yes' ? true : false,
        parking_details: property.additionalInfoParking,
        rent_per_week:
          selected == 0
            ? property.asking_price?.text
            : property?.rent_per_week.text,
        // date_available: property.date_available.text,
        // listing_duration: property.listingDuration,
        mobile_number: property.mobile,
        home: property.home,
        best_contact_time: property.contactTime,
        // registered_property_agent: property.isRegisterPropertyAgent,
        agent_name: property.agent_name.text,
        agency_name: property.agency_name.text,
        receive_application_forms: false,
        pets_ok: property?.petsOk,
        smokers_ok: property?.smookingOk,
        furnishings_n_whiteware: property.furnishingWhiteware,
        amenities_in_area: property.amenities,
        ideal_tenants: property.idealTenents,
      };
      let time24Hour = timeFormate ? moment(timeFormate).format('HH:mm') : '';

      time24Hour = isValidTimeFormat(time24Hour)
        ? time24Hour
        : moment(property.closingTime.text).format('HH:mm');

      body.end_time = time24Hour;
      body.end_date = concatenateDateTime(selectedEndDate, time24Hour);

      const filteredArrtoUpload = property?.images?.imgArr?.filter(item =>
        item.hasOwnProperty('uri'),
      );

      if (filteredArrtoUpload?.length > 0) {
        const filteredArrtoUploadAlreadID = property?.images?.imgArr?.filter(
          item => !item.hasOwnProperty('uri'),
        );
        // filteredArrtoUpload?.forEach(item => formdata.append('files', item));
        let imgRes: any = await uploadImages(filteredArrtoUpload);
        if (imgRes?.data?.document) {
          body.images = [
            ...filteredArrtoUploadAlreadID,
            ...imgRes?.data?.document,
          ];
        }
      } else {
        body.images = property?.images.imgArr;
      }

      if (isEdit) {
        body._id = route?.params?.id;
        body.status = route?.params?.edit_single_listing_data?.status;
        console.log('>>>body 77 ', body);

        updateProduct({id: route?.params?.id, body: body})
          .then(res => {
            console.log('res 00 ', res);
            // if (res?.data?.message == 'Item updated successfully') {
            if (res?.data?.message) {
              setShowBottomSheetText(res?.data?.message);
              if (Platform.OS == 'ios') {
                setTimeout(() => {
                  setShowBottomSheet(true);
                }, 700);
              } else {
                setShowBottomSheet(true);
              }
            } else {
              isUploading.current = false;
              setReload(reLaod + 1);
            }
          })
          .catch(() => {
            isUploading.current = false;
            setReload(reLaod + 1);
          });
      } else {
        const filteredArrtoUpload = property?.images?.imgArr?.filter(item =>
          item.hasOwnProperty('uri'),
        );
        if (filteredArrtoUpload?.length > 0) {
          const filteredArrtoUploadAlreadID = property?.images?.imgArr?.filter(
            item => !item.hasOwnProperty('uri'),
          );
          // filteredArrtoUpload?.forEach(item => formdata.append('files', item));
          let imgRes: any = await uploadImages(filteredArrtoUpload);
          if (imgRes?.data?.document) {
            body.images = [
              ...filteredArrtoUploadAlreadID,
              ...imgRes?.data?.document,
            ];
          }
        } else {
          body.images = property?.images.imgArr;
        }
        submitPropertyForSale(body)
          .then(res => {
            console.log('resssss===...', res?.error?.data);
            if (res?.data?.message) {
              setShowBottomSheetText(res?.data?.message);
              if (Platform.OS == 'ios') {
                setTimeout(() => {
                  setShowBottomSheet(true);
                }, 700);
              } else {
                setShowBottomSheet(true);
              }
              // const popAction = StackActions.pop(4);
              // navigation.dispatch(popAction);
              // navigation.navigate('HomeContainer' as never);
            } else {
              isUploading.current = false;
              setReload(reLaod + 1);
            }
          })
          .catch(() => {
            isUploading.current = false;
            setReload(reLaod + 1);
          });
      }
    } else {
      toastDangerMessage('Please fill all mandatory fields');
      isUploading.current = false;
      setReload(reLaod + 1);
    }
  };

  function getNameByValue(value: string, list: any[]) {
    // console.log('val', value);
    const item = list.find(element => element?.value == value);
    return item ? item.key : null;
  }

  function getNameById(id: string) {
    const item = categories.find(element => element._id === id);
    return item ? item.name : null;
  }

  function getSubCategoryName(categoryId: string, subCategoryId: string) {
    const category = categories.find(cat => cat._id === categoryId);
    if (!category) {
      return null;
    }

    const subCategory = category.sub_categories.find(
      sub => sub._id === subCategoryId,
    );
    return subCategory ? subCategory.name : null;
  }

  const shippingMethodsCheck = () => {
    return (
      <View
        style={[
          Layout.fullWidth,
          Layout.alignItemsCenter,
          Gutters.smallPadding,
          {
            borderRadius: 6,
            backgroundColor: Colors.white,
          },
        ]}>
        <Text style={[Fonts.poppinSemiBold25, {color: Colors.black_232C28}]}>
          {t('common:shipping_options_missing')}
        </Text>
        <Text
          style={[
            Fonts.poppinMed16,
            Gutters.tinyTMargin,
            {color: Colors.dark_gray_676C6A, textAlign: 'center'},
          ]}>
          {t(
            'common:please_navigate_to_the_payment_options_tab_in_your_settings_to_select_your_shipping_options',
          )}
        </Text>
        <View
          style={[
            Gutters.smallTMargin,
            Layout.selfCenter,
            Layout.row,
            Layout.alignItemsCenter,
          ]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              dispatch(setShippingMethods(false));
              navigation.navigate('AccountSetting');
            }}
            style={[
              Gutters.tinyPadding,
              Gutters.xTinyPadding,
              Layout.center,
              {
                backgroundColor: Colors.primary,
                borderRadius: 6,
                width: 150,
              },
            ]}>
            <Text style={[Fonts.poppinSemiBold14, {color: Colors.white}]}>
              {t('common:go_to_setting')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              dispatch(setShippingMethods(false));
            }}
            style={[
              Gutters.tinyPadding,
              Layout.center,
              Gutters.xTinyPadding,
              Gutters.tinyLMargin,
              {
                backgroundColor: Colors.dark_gray_676C6A,
                borderRadius: 6,
                width: 150,
              },
            ]}>
            <Text style={[Fonts.poppinSemiBold14, {color: Colors.white}]}>
              {t('common:cancel')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const deleteItemForSaleProductPopUp = () => {
    return (
      <View
        style={[
          Layout.fullWidth,
          Layout.alignItemsCenter,
          Gutters.smallPadding,
          {
            borderRadius: 6,
            backgroundColor: Colors.white,
          },
        ]}>
        <Images.svg.dustbinRed.default />
        <Text
          style={[
            Fonts.poppinSemiBold25,
            Gutters.tinyVMargin,
            {color: Colors.black_232C28},
          ]}>
          {t('common:delete_item')}
        </Text>
        <Text
          style={[
            Fonts.poppinMed16,
            Gutters.tinyTMargin,
            {color: Colors.dark_gray_676C6A, textAlign: 'center'},
          ]}>
          {t('common:are_you_sure_you_want_to_delete')}
        </Text>
        <View
          style={[
            Gutters.smallTMargin,
            Layout.selfCenter,
            Layout.row,
            Layout.alignItemsCenter,
          ]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              dispatch(setDeleteItemForSale(false));
            }}
            style={[
              Gutters.xTinyPadding,
              Layout.center,
              {
                backgroundColor: 'transparent',
                borderRadius: 6,
                borderWidth: 1,
                borderColor: Colors.black_232C28,
                width: 150,
              },
            ]}>
            <Text
              style={[Fonts.poppinSemiBold14, {color: Colors.black_232C28}]}>
              {t('common:cancel')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              dispatch(setDeleteItemForSale(false));
              deleteProduct(route?.params?.id).then(res => {
                if (res.data.message) {
                  navigation.goBack();
                }
              });
            }}
            style={[
              Gutters.tinyPadding,
              Layout.center,
              Gutters.xTinyPadding,
              Gutters.tinyLMargin,
              {
                backgroundColor: Colors.red,
                borderRadius: 6,

                width: 150,
              },
            ]}>
            <Text
              style={[
                Fonts.poppinSemiBold14,
                {textTransform: 'capitalize', color: Colors.white},
              ]}>
              {t('common:delete')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const withDrawItemForSalePopUp = () => {
    return (
      <View
        style={[
          Layout.fullWidth,
          Layout.alignItemsCenter,
          Gutters.smallPadding,
          {
            borderRadius: 6,
            backgroundColor: Colors.white,
          },
        ]}>
        <Images.svg.questionMarkCircle.default
          fill={Colors.primary}
          width={80}
        />
        <Text
          style={[
            Fonts.poppinSemiBold20,
            Gutters.tinyVMargin,
            {color: Colors.black_232C28, textAlign: 'center'},
          ]}>
          {route?.params?.edit_single_listing_data?.status == 'active'
            ? 'Are you sure you want to withdraw this item?'
            : 'Are you sure you want to Re List'}
        </Text>
        {/* <Text
          style={[
            Fonts.poppinMed16,
            Gutters.tinyTMargin,
            {color: Colors.dark_gray_676C6A, textAlign: 'center'},
          ]}>
          {t('common:are_you_sure_you_want_to_delete')}
        </Text> */}
        <View
          style={[
            Gutters.smallTMargin,
            Layout.selfCenter,
            Layout.row,
            Layout.alignItemsCenter,
          ]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              dispatch(setWithDrawItemForSale(false));
            }}
            style={[
              Gutters.xTinyPadding,
              Layout.center,
              {
                backgroundColor: 'transparent',
                borderRadius: 6,
                borderWidth: 1,
                borderColor: Colors.black_232C28,
                width: 150,
              },
            ]}>
            <Text
              style={[Fonts.poppinSemiBold14, {color: Colors.black_232C28}]}>
              {t('common:cancel')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={async () => {
              dispatch(setWithDrawItemForSale(false));
              if (route?.params?.edit_single_listing_data?.status == 'active') {
                let body = {
                  status:
                    route?.params?.edit_single_listing_data?.status == 'active'
                      ? 'withdrawn'
                      : 'active',
                };
                updateListingStatus({id: route?.params?.id, body: body}).then(
                  (res: any) => {
                    // if (res?.data?.message == 'Item updated successfully') {
                    if (res?.data?.message) {
                      setShowBottomSheetText(res?.data?.message);
                      if (Platform.OS == 'ios') {
                        setTimeout(() => {
                          setShowBottomSheet(true);
                        }, 700);
                      } else {
                        setShowBottomSheet(true);
                      }
                    }
                  },
                );
              } else {
                if (validations()) {
                  let body = {
                    title: property.title.text,
                    user: null,
                    category: property.catagory?.id,
                    sub_category: property?.subCatagory?.id,
                    make: '',
                    model: '',
                    type: property.enquireAboutPrice
                      ? 'enquire'
                      : 'fixed_price',
                    images: [],
                    // condition: property.condition.id,
                    fixed_price_offer:
                      selected == 0
                        ? parseFloat(property.asking_price?.text)
                        : parseFloat(property?.rent_per_week.text),
                    start_price: null,
                    reserve_price: null,
                    buy_now_price: null,
                    description: property.aboutProperty.text,
                    pickup_available: false,
                    pickup_location: `${property?.suburb.text} ${property?.district.text} ${property?.region.text}`,
                    pickup_location_coordinates: coordinates,
                    payment_option: property.paymentOption.text,
                    start_date: property.startDate.text,
                    end_date: property.closingDate.text,
                    end_time: moment(property.closingTime.text).format('HH:mm'),
                    shipping: {
                      option_name: 'To be arranged',
                      value: 'dont_know',
                      amount: null,
                      description: null,
                      url: null,
                    },
                    show_phone: property?.showPhone,
                    make_an_offer: false,
                    listing_type: 'property',
                    for_sale: selected == 0 ? true : false,
                    youtube_video_url: property.youtubeVideo,
                    three_d_tour_url: property._3dUrl,
                    street_number: property.street.text,
                    unit_number: property.unitFlat.text,
                    street_name: property?.streetName?.text,
                    region: property?.region?.text,
                    district: property.district?.text,
                    suburb: property?.suburb?.text,
                    no_of_bedrooms: parseFloat(property?.bedrooms.text),
                    no_of_bathrooms: parseFloat(property.bathroom.text),
                    no_of_separate_toilets: parseFloat(property.separateToilet),
                    no_of_ensuite_bathrooms: parseFloat(
                      property.ensuiteBathroom,
                    ),
                    no_of_living_areas: parseFloat(property.livingAreas.text),
                    no_of_studies: parseFloat(property.studies.text),
                    garage_parking:
                      property.garageParking == 'Yes' ? true : false,
                    off_street_parking:
                      property.offStreetParking == 'Yes' ? true : false,
                    parking_details: property.additionalInfoParking,
                    rent_per_week:
                      selected == 0
                        ? property.asking_price?.text
                        : property?.rent_per_week.text,
                    // date_available: property.date_available.text,
                    // listing_duration: property.listingDuration,
                    mobile_number: property.mobile,
                    home: property.home,
                    best_contact_time: property.contactTime,
                    // registered_property_agent: property.isRegisterPropertyAgent,
                    agent_name: property.agent_name.text,
                    agency_name: property.agency_name.text,
                    receive_application_forms: false,
                    pets_ok: property?.petsOk,
                    smokers_ok: property.smookingOk,
                    furnishings_n_whiteware: property.furnishingWhiteware,
                    amenities_in_area: property.amenities,
                    ideal_tenants: property.idealTenents,
                    status: 'active',
                  };
                  let time24Hour = timeFormate
                    ? moment(timeFormate).format('HH:mm')
                    : '';
                  time24Hour = isValidTimeFormat(time24Hour)
                    ? time24Hour
                    : property.closingTime.text;
                  body.end_time = time24Hour;
                  body.end_date = concatenateDateTime(
                    selectedEndDate,
                    time24Hour,
                  );
                  const filteredArrtoUpload = property?.images?.imgArr?.filter(
                    item => item.hasOwnProperty('uri'),
                  );

                  if (filteredArrtoUpload?.length > 0) {
                    const filteredArrtoUploadAlreadID =
                      property?.images?.imgArr?.filter(
                        item => !item.hasOwnProperty('uri'),
                      );
                    // filteredArrtoUpload?.forEach(item => formdata.append('files', item));
                    let imgRes: any = await uploadImages(filteredArrtoUpload);
                    if (imgRes?.data?.document) {
                      body.images = [
                        ...filteredArrtoUploadAlreadID,
                        ...imgRes?.data?.document,
                      ];
                    }
                  } else {
                    body.images = property?.images.imgArr;
                  }
                  body._id = route?.params?.id;
                  updateProduct({id: route?.params?.id, body: body}).then(
                    res => {
                      console.log('res', res);

                      // if (res?.data?.message == 'Item updated successfully') {
                      if (res?.data?.message) {
                        setShowBottomSheetText(res?.data?.message);
                        if (Platform.OS == 'ios') {
                          setTimeout(() => {
                            setShowBottomSheet(true);
                          }, 700);
                        } else {
                          setShowBottomSheet(true);
                        }
                      }
                    },
                  );
                } else {
                  toastDangerMessage('Please fill all mandatory fields');
                }
              }
            }}
            style={[
              Gutters.tinyPadding,
              Layout.center,
              Gutters.xTinyPadding,
              Gutters.tinyLMargin,
              {
                backgroundColor: Colors.primary,
                borderRadius: 6,

                width: 150,
              },
            ]}>
            <Text
              style={[
                Fonts.poppinSemiBold14,
                {textTransform: 'capitalize', color: Colors.white},
              ]}>
              {t('common:yes')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const markItemAsSold = () => {
    updateListingSold({id: route?.params?.id}).then((res: any) => {
      if (res?.data) {
        dispatch(currentStack(null));
        const popAction = StackActions.pop(4);
        navigation.dispatch(popAction);
        navigation.navigate('HomeContainer' as never);
      }
    });
  };
  const sellItemForSalePopUp = () => {
    return (
      <View
        style={[
          Layout.fullWidth,
          Layout.alignItemsCenter,
          Gutters.smallPadding,
          {
            borderRadius: 6,
            backgroundColor: Colors.white,
          },
        ]}>
        <Images.svg.questionMarkCircle.default
          fill={Colors.primary}
          width={80}
        />
        <Text
          style={[
            Fonts.poppinSemiBold20,
            Gutters.tinyVMargin,
            {color: Colors.black_232C28, textAlign: 'center'},
          ]}>
          Are you sure you want to mark as sold?
        </Text>

        <View
          style={[
            Gutters.smallTMargin,
            Layout.selfCenter,
            Layout.row,
            Layout.alignItemsCenter,
          ]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              dispatch(setSellingItemForSale(false));
            }}
            style={[
              Gutters.xTinyPadding,
              Layout.center,
              {
                backgroundColor: 'transparent',
                borderRadius: 6,
                borderWidth: 1,
                borderColor: Colors.black_232C28,
                width: 150,
              },
            ]}>
            <Text
              style={[Fonts.poppinSemiBold14, {color: Colors.black_232C28}]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              dispatch(setSellingItemForSale(false));
              markItemAsSold();
            }}
            style={[
              Gutters.tinyPadding,
              Layout.center,
              Gutters.xTinyPadding,
              Gutters.tinyLMargin,
              {
                backgroundColor: Colors.primary,
                borderRadius: 6,

                width: 150,
              },
            ]}>
            <Text
              style={[
                Fonts.poppinSemiBold14,
                {textTransform: 'capitalize', color: Colors.white},
              ]}>
              Yes
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const updateItemForSalePopUp = () => {
    return (
      <View
        style={[
          Layout.fullWidth,
          Layout.alignItemsCenter,
          Gutters.smallPadding,
          {
            borderRadius: 6,
            backgroundColor: Colors.white,
          },
        ]}>
        <Images.svg.questionMarkCircle.default
          fill={Colors.primary}
          width={80}
        />
        <Text
          style={[
            Fonts.poppinSemiBold20,
            Gutters.tinyVMargin,
            {color: Colors.black_232C28, textAlign: 'center'},
          ]}>
          {t('common:are_you_sure_you_want_to_update_this_edit')}
        </Text>
        {/* <Text
          style={[
            Fonts.poppinMed16,
            Gutters.tinyTMargin,
            {color: Colors.dark_gray_676C6A, textAlign: 'center'},
          ]}>
          {t('common:are_you_sure_you_want_to_delete')}
        </Text> */}
        <View
          style={[
            Gutters.smallTMargin,
            Layout.selfCenter,
            Layout.row,
            Layout.alignItemsCenter,
          ]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              dispatch(setUpdateItemForSale(false));
            }}
            style={[
              Gutters.xTinyPadding,
              Layout.center,
              {
                backgroundColor: 'transparent',
                borderRadius: 6,
                borderWidth: 1,
                borderColor: Colors.black_232C28,
                width: 150,
              },
            ]}>
            <Text
              style={[Fonts.poppinSemiBold14, {color: Colors.black_232C28}]}>
              {t('common:cancel')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              dispatch(setUpdateItemForSale(false));
              //  submitUpdateItemForSale();
            }}
            style={[
              Gutters.tinyPadding,
              Layout.center,
              Gutters.xTinyPadding,
              Gutters.tinyLMargin,
              {
                backgroundColor: Colors.primary,
                borderRadius: 6,

                width: 150,
              },
            ]}>
            <Text
              style={[
                Fonts.poppinSemiBold14,
                {textTransform: 'capitalize', color: Colors.white},
              ]}>
              {t('common:yes')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const userCheckPermissions = () => {
    return (
      <View
        style={[
          Layout.fullWidth,
          Layout.alignItemsCenter,
          Gutters.smallPadding,
          {
            borderRadius: 6,
            backgroundColor: Colors.white,
          },
        ]}>
        <Text style={[Fonts.poppinSemiBold25, {color: Colors.black_232C28}]}>
          {'Subscription Alert!'}
        </Text>
        <Text
          style={[
            Fonts.poppinMed16,
            Gutters.tinyTMargin,
            {color: Colors.dark_gray_676C6A, textAlign: 'center'},
          ]}>
          {user_permissions?.message}
        </Text>
        <View
          style={[
            Gutters.smallTMargin,
            Layout.selfCenter,
            Layout.row,
            Layout.alignItemsCenter,
          ]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setIsShowUserPermissionDialog(false);
              Platform.OS == 'android'
                ? navigation.navigate('AccountSetting')
                : Linking.openURL(FE_URL);
              dispatch(storeUserCheckPermissons({}));
            }}
            style={[
              Gutters.tinyPadding,
              Gutters.xTinyPadding,
              Layout.center,
              {
                backgroundColor: Colors.primary,
                borderRadius: 6,
                width: 150,
              },
            ]}>
            <Text style={[Fonts.poppinSemiBold14, {color: Colors.white}]}>
              {Platform.OS == 'android'
                ? t('common:go_to_setting')
                : 'Go to Web App'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setIsShowUserPermissionDialog(false);
              navigation.pop();
              dispatch(storeUserCheckPermissons({}));
            }}
            style={[
              Gutters.tinyPadding,
              Layout.center,
              Gutters.xTinyPadding,
              Gutters.tinyLMargin,
              {
                backgroundColor: Colors.dark_gray_676C6A,
                borderRadius: 6,
                width: 150,
              },
            ]}>
            <Text style={[Fonts.poppinSemiBold14, {color: Colors.white}]}>
              {t('common:cancel')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // useEffect(() => {
  //   if (
  //     property?.region?.text &&
  //     property?.district?.text &&
  //     property?.suburb?.text
  //   ) {
  //     getGeoCodeMethod();
  //   }
  // }, [property.region, property.district, property.suburb]);
  const handleBlurForLocation = ({region, district, suburb}) => {
    if (region && district && suburb) {
      console.log('>>> region ', region);
      console.log('>>> district ', district);
      console.log('>>> suburb ', suburb);

      getGeoCodeMethod({region: region, district: district, suburb: suburb});
    }
  };

  // console.log('cate==', JSON.stringify(categories, null, 2));

  return (
    <View style={[Layout.fill, Gutters.xLargeBMargin]}>
      <View>
        <View style={[Layout.row]}>
          <Text style={[Fonts.poppinSemiBold24, {color: Colors.black_232C28}]}>
            {t('common:photos')}
          </Text>
          <Text
            style={[
              Fonts.poppinMed18,
              Gutters.smallLMargin,
              {color: Colors.black_232C28},
            ]}>
            {property?.images?.imgArr?.length || '0'}/20
          </Text>
        </View>
        <TextRegular
          text="You can add up to 20 photos."
          textStyle={[
            Fonts.poppinReg18,
            Gutters.tinyTMargin,
            {color: Colors.black_232C28},
          ]}
        />
      </View>

      <TouchableOpacity
        onPress={Keyboard.dismiss}
        accessible={false}
        activeOpacity={1}>
        {/* =========== upload images ============= */}
        <View style={[Gutters.smallBMargin, Gutters.tinyTMargin]}>
          <TakePictures
            selected={
              // isEdit
              // ? paramData?.images
              // :
              // ?.map((v: any) => ({
              //     uri: getURLPhoto(v.name),
              //   }))
              property?.images?.imgArr as any
            }
            setSelectedImage={(arr: any) => {
              setProperty({...property, images: {imgArr: arr, error: ''}});
            }}
            style={[
              {
                borderWidth: 2,
                borderColor: property?.images?.error
                  ? Colors.red
                  : Colors.gray_C9C9C9,
              },
            ]}
          />
          {property.images.error && (
            <TextRegular
              text={property.images.error}
              textStyle={[
                Layout.textTransfromNone,
                {color: Colors.red, marginLeft: sHight(1)},
              ]}
            />
          )}
        </View>
        {/* =========== Youtube video code ============= */}
        <View style={[Gutters.tinyVMargin]}>
          <View style={[Layout.row, Layout.alignItemsCenter]}>
            <TextSemiBold
              text={t('common:youtube_Video')}
              textStyle={[Fonts.poppinSemiBold20, {color: Colors.black_232C28}]}
            />
            <TextSemiBold
              text={t('common:optional')}
              textStyle={[
                Fonts.poppinReg16,
                Layout.textTransfromNone,
                {color: Colors.black_232C28},
              ]}
            />
          </View>
          <View
            style={[
              i18next.language === 'en' ? Layout.row : Layout.rowReverse,
              Layout.alignItemsCenter,
              Layout.justifyContentBetween,
              Gutters.littlePadding,
              Layout.overflow,
              {
                borderWidth: 1,
                borderColor: Colors.dark_gray_676C6A,
                borderRadius: 6,
              },
            ]}>
            <View style={{width: sWidth(60)}}>
              <CustomInput
                headingText=""
                placeholder={`${t('common:copy_and_paste_your_link')}`}
                inputProps={{
                  value: property?.youtubeVideo,
                  onChangeText: (t: string) =>
                    setProperty({...property, youtubeVideo: t}),
                }}
                inputStyle={[
                  Layout.justifyContentCenter,
                  Layout.fullWidth,
                  Fonts.poppinReg16,
                  Layout.fullHeight,
                  Gutters.tinyLPadding,
                  {width: '50%'},
                ]}
              />
            </View>
            {/* <CustomButton
              onPress={() => {}}
              text={t('common:add_video')}
              textStyle={[Fonts.poppinSemiBold18, {color: Colors.white}]}
              btnStyle={[
                {
                  backgroundColor: Colors.gray_C9C9C9,
                  width: 120,
                  height: 42,
                  borderRadius: 6,
                },
              ]}
            /> */}
          </View>

          <View style={[Gutters.tinyVMargin]}>
            <Text style={[Fonts.poppinReg14, {color: Colors.black_232C28}]}>
              {t('common:youtube_video_below_text')}
              <Text style={[Fonts.poppinReg14, {color: Colors.primary}]}>
                {t('common:terms_for_adding_a_video')}
              </Text>
            </Text>
          </View>
        </View>
        {/* =========== 3D tour video code ============= */}
        <View>
          <View style={[Layout.row, Layout.alignItemsCenter]}>
            <TextSemiBold
              text={t('common:3D_tour_url')}
              textStyle={[Fonts.poppinSemiBold20, {color: Colors.black_232C28}]}
            />
            <TextSemiBold
              text={t('common:optional')}
              textStyle={[
                Fonts.poppinReg16,
                Gutters.littleLMargin,
                Layout.textTransfromNone,
                {color: Colors.black_232C28},
              ]}
            />
          </View>
          <View
            style={[
              i18next.language === 'en' ? Layout.row : Layout.rowReverse,
              Layout.alignItemsCenter,
              Layout.justifyContentBetween,
              Gutters.littlePadding,
              Layout.overflow,
              {
                borderWidth: 1,
                borderColor: Colors.dark_gray_676C6A,
                borderRadius: 6,
              },
            ]}>
            <View style={{width: sWidth(60)}}>
              <CustomInput
                headingText=""
                placeholder={t('common:copy_and_paste_your_link')}
                value={property?._3dUrl}
                inputProps={{
                  value: property?._3dUrl,
                  onChangeText: (t: string) =>
                    setProperty({...property, _3dUrl: t}),
                }}
                inputStyle={[
                  Layout.justifyContentCenter,
                  Fonts.poppinReg16,
                  Gutters.tinyLPadding,
                  Layout.fullHeight,
                  {width: '60%'},
                ]}
              />
            </View>
            {/* <CustomButton
              onPress={() => {}}
              text={t('common:add_3D_tour')}
              textStyle={[
                Fonts.poppinSemiBold18,
                Layout.textTransfromNone,

                {color: Colors.white},
              ]}
              btnStyle={[
                {
                  backgroundColor: Colors.gray_C9C9C9,
                  width: 120,
                  height: 42,
                  borderRadius: 6,
                },
              ]}
            /> */}
          </View>

          <View style={[Gutters.tinyVMargin]}>
            <Text style={[Fonts.poppinReg14, {color: Colors.primary}]}>
              {t('common:Checkout_our_handy_guide')}
              <Text
                style={[Fonts.poppinReg14, {color: Colors.dark_gray_676C6A}]}>
                {t('common:to_adding_3D_tour')}
              </Text>
            </Text>
          </View>
        </View>

        {/* ======== title =============== */}
        <View style={[Layout.wrap, Gutters.tinyBMargin]}>
          <CustomInput
            headingText={t('common:title')}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            inputProps={{
              onChangeText: (t: string) =>
                setProperty({...property, title: {text: t, error: ''}}),
              value: property?.title?.text,
              placeholderTextColor: Colors.dark_gray_676C6A,
            }}
            backgroundStyle={[
              {
                backgroundColor: Colors.light_grayF4F4F4,
                borderWidth: 2,
                borderColor: property?.title?.error
                  ? Colors.red
                  : Colors.gray_C9C9C9,
                borderRadius: 6,
              },
            ]}
            inputStyle={[{color: Colors.dark_gray_676C6A}]}
            placeholder={''}
            showPassword={false}
            childrenstyle={[Layout.alignItemsStart]}>
            <TextMedium text="*" textStyle={[{color: Colors.red_E34040}]} />
          </CustomInput>
          {property?.title?.error && (
            <TextRegular
              text={property?.title?.error}
              textStyle={[
                Layout.textTransfromNone,
                {color: Colors.red, marginLeft: sHight(1)},
              ]}
            />
          )}
        </View>

        {/* ======== category =============== */}
        <View style={[Gutters.tinyVMargin]}>
          <CustomDropDown
            data={categories?.flatMap(item => [
              {key: item?.name, value: item?._id},
            ])}
            selectedTextStyle={{color: Colors.dark_gray_676C6A}}
            headingTextStyle={[
              Fonts.poppinMed18,
              {color: Colors.black_232C28, textTransform: 'capitalize'},
            ]}
            customStyle={[
              {
                backgroundColor: Colors.light_grayF4F4F4,
                borderWidth: 2,
                borderColor: property?.catagory?.error
                  ? Colors.red
                  : Colors.gray_C9C9C9,
              },
            ]}
            customListStyle={[{zIndex: 99}]}
            value={
              isEdit
                ? getNameById(paramData?.category)
                : getNameById(property?.category)
            }
            setSelected={(ctg: string) => {
              setProperty({
                ...property,
                catagory: {id: ctg, error: ''},
                subCatagory: {id: '', error: ''},
              });
              // dispatch(setPropertyData({category: t}));
              setSubCategoryFunc(ctg);
            }}
            placeholder={t('common:select')}
            headingText={t('common:catagory')}
            itemStyle={[{backgroundColor: Colors.light_grayF4F4F4}]}>
            <TextMedium text="*" textStyle={[{color: Colors.red_E34040}]} />
          </CustomDropDown>
          {property?.catagory?.error && (
            <TextRegular
              text={property?.catagory?.error}
              textStyle={[
                Layout.textTransfromNone,
                {color: Colors.red, marginLeft: sHight(1)},
              ]}
            />
          )}
        </View>
        {/* ======== sub category =============== */}
        <View>
          <CustomDropDown
            data={
              property?.catagory?.id
                ? subCategories?.flatMap(item => [
                    {key: item?.name, value: item?._id},
                  ])
                : [{key: '', value: ''}]
            }
            selectedTextStyle={{color: Colors.dark_gray_676C6A}}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            customStyle={[
              {
                backgroundColor: Colors.light_grayF4F4F4,
                borderWidth: 2,
                borderColor: property?.subCatagory?.error
                  ? Colors.red
                  : Colors.gray_C9C9C9,
              },
            ]}
            value={
              isEdit
                ? getSubCategoryName(
                    paramData?.category,
                    paramData?.sub_category,
                  )
                : getSubCategoryName(
                    property?.category?.id,
                    property?.subCatagory?.id,
                  )
            }
            setSelected={(subCtg: string) => {
              setProperty({
                ...property,
                subCatagory: {id: subCtg, error: ''},
              });
            }}
            placeholder={t('common:select')}
            headingText={t('common:sub_catagory')}
            itemStyle={[{backgroundColor: Colors.light_grayF4F4F4}]}>
            <TextMedium text="*" textStyle={[{color: Colors.red_E34040}]} />
          </CustomDropDown>
          {property?.subCatagory?.error && (
            <TextRegular
              text={property?.subCatagory?.error}
              textStyle={[
                Layout.textTransfromNone,
                {color: Colors.red, marginLeft: sHight(1)},
              ]}
            />
          )}
        </View>
        {/* ======== condition =============== */}
        {/* <View style={[Gutters.tinyVMargin]}>
          <CustomDropDown
            data={dropdownCondition}
            selectedTextStyle={{color: Colors.dark_gray_676C6A}}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            customStyle={[
              {
                backgroundColor: Colors.light_grayF4F4F4,
                borderWidth: 2,
                borderColor: property?.condition?.error
                  ? Colors.red
                  : Colors.gray_C9C9C9,
              },
            ]}
            value={
              // isEdit
              //   ?
              getNameByValue(
                paramData?.condition
                  ? paramData?.condition
                  : property?.condition?.id,
                dropdownCondition,
              )
              // : property?.condition?.id
            }
            setSelected={(cnd: string) => {
              setProperty({
                ...property,
                condition: {id: cnd, error: ''},
              });
            }}
            placeholder={t('common:select')}
            headingText={t('common:condition')}
            itemStyle={[{backgroundColor: Colors.light_grayF4F4F4}]}>
            <TextMedium text="*" textStyle={[{color: Colors.red_E34040}]} />
          </CustomDropDown>
          {property?.condition?.error && (
            <TextRegular
              text={property?.condition?.error}
              textStyle={[
                Layout.textTransfromNone,
                {color: Colors.red, marginLeft: sHight(1)},
              ]}
            />
          )}
        </View> */}

        {/* ========= describe the property =============== */}
        <View style={[Layout.wrap]}>
          <CustomInput
            headingText={`${t('common:about_this_property')}`}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            inputProps={{
              onChangeText: (t: string) =>
                setProperty({
                  ...property,
                  aboutProperty: {text: t, error: ''},
                }),
              value: property?.aboutProperty?.text,
              multiline: true,
              placeholderTextColor: Colors.black_232C28,
            }}
            backgroundStyle={[
              {
                borderColor: property?.aboutProperty?.error
                  ? Colors.red
                  : Colors.gray_C9C9C9,
                height: 200,
                backgroundColor: Colors.light_grayF4F4F4,
                borderWidth: 2,
              },
            ]}
            inputStyle={[
              {
                color: Colors.dark_gray_676C6A,
                textAlignVertical: 'top',
              },
            ]}
            placeholder={''}
            showPassword={false}
            childrenstyle={[Layout.alignItemsStart]}>
            <TextMedium text="*" textStyle={[{color: Colors.red_E34040}]} />
          </CustomInput>
          {property?.aboutProperty?.error && (
            <TextRegular
              text={property?.aboutProperty?.error}
              textStyle={[
                Layout.textTransfromNone,
                {color: Colors.red, marginLeft: sHight(1)},
              ]}
            />
          )}
        </View>

        {/* ========== Property Information ================= */}
        <View style={[Gutters.smallTMargin]}>
          <TextSemiBold
            text={t('common:property_information')}
            textStyle={[{color: Colors.black_232C28}]}
          />
        </View>

        <View
          style={[Layout.row, Layout.alignItemsCenter, Gutters.tinyTMargin]}>
          {/* ========== Property Information ================= */}
          {/* ========== street ================= */}
          <View style={[{width: '45%', flexWrap: 'wrap'}]}>
            <CustomInput
              headingText={t('common:street')}
              headingTextStyle={[
                Fonts.poppinMed18,
                {color: Colors.black_232C28},
              ]}
              inputProps={{
                onChangeText: (t: string) =>
                  setProperty({
                    ...property,
                    street: {text: t, error: ''},
                    unitFlat: {text: property.unitFlat.text, error: ''},
                  }),
                value: property?.street?.text,
                keyboardType: 'number-pad',
                placeholderTextColor: Colors.dark_gray_676C6A,
              }}
              inputStyle={{
                paddingLeft: 0,
                color: Colors.dark_gray_676C6A,
              }}
              backgroundStyle={[
                {
                  width: '100%',
                  backgroundColor: Colors.light_grayF4F4F4,
                  borderWidth: 2,
                  borderColor: property?.street?.error
                    ? Colors.red
                    : Colors.gray_C9C9C9,
                  borderRadius: 6,
                },
              ]}
              placeholder={''}
              showPassword={false}
              childrenstyle={[Layout.alignItemsStart]}>
              <TextMedium text="*" textStyle={[{color: Colors.red_E34040}]} />
            </CustomInput>
            <View style={{height: 25}}>
              {property?.street?.error && (
                <TextRegular
                  text={property?.street?.error}
                  textStyle={[
                    Layout.textTransfromNone,
                    {color: Colors.red, marginLeft: sHight(1)},
                  ]}
                />
              )}
            </View>
          </View>
          <View style={[{width: '10%'}]}></View>
          {/* ========== Unit flat ================= */}
          <View style={[{width: '45%', flexWrap: 'wrap'}]}>
            <CustomInput
              headingText={t('common:unit/flat')}
              headingTextStyle={[
                Fonts.poppinMed18,
                {color: Colors.black_232C28},
              ]}
              inputProps={{
                onChangeText: (t: string) =>
                  setProperty({
                    ...property,
                    unitFlat: {text: t, error: ''},
                    street: {text: property.street.text, error: ''},
                  }),
                value: property?.unitFlat?.text,
                keyboardType: 'number-pad',
                placeholderTextColor: Colors.dark_gray_676C6A,
              }}
              inputStyle={{
                paddingLeft: 0,
                color: Colors.dark_gray_676C6A,
              }}
              backgroundStyle={[
                {
                  width: '100%',
                  backgroundColor: Colors.light_grayF4F4F4,
                  borderWidth: 2,
                  borderColor: property?.unitFlat?.error
                    ? Colors.red
                    : Colors.gray_C9C9C9,
                  borderRadius: 6,
                },
              ]}
              placeholder={''}
              // placeholder={t('common:email_phone')}
              showPassword={false}
              childrenstyle={[Layout.alignItemsStart]}>
              <TextMedium text="*" textStyle={[{color: Colors.red_E34040}]} />
            </CustomInput>
            <View style={{height: 25}}>
              {property?.unitFlat?.error && (
                <TextRegular
                  text={property?.unitFlat?.error}
                  textStyle={[
                    Layout.textTransfromNone,
                    {color: Colors.red, marginLeft: sHight(1)},
                  ]}
                />
              )}
            </View>
          </View>
        </View>

        {/* ========== street Name ================= */}
        <View style={[Gutters.tinyBMargin]}>
          <CustomInput
            headingText={`${t('common:street_name')}`}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            inputProps={{
              onChangeText: (t: string) =>
                setProperty({
                  ...property,
                  streetName: {text: t, error: ''},
                }),
              value: property?.streetName?.text,
              placeholderTextColor: Colors.dark_gray_676C6A,
            }}
            inputStyle={{color: Colors.dark_gray_676C6A}}
            backgroundStyle={[
              {
                backgroundColor: Colors.light_grayF4F4F4,
                borderWidth: 2,
                borderColor: property?.streetName?.error
                  ? Colors.red
                  : Colors.gray_C9C9C9,
                borderRadius: 6,
              },
            ]}
            placeholder={''}
            showPassword={false}
            childrenstyle={[Layout.alignItemsStart]}>
            <TextMedium text="*" textStyle={[{color: Colors.red_E34040}]} />
          </CustomInput>
          {property?.streetName?.error && (
            <TextRegular
              text={property?.streetName?.error}
              textStyle={[
                Layout.textTransfromNone,
                {color: Colors.red, marginLeft: sHight(1)},
              ]}
            />
          )}
        </View>
        <Text
          style={[
            Fonts.poppinReg16,
            {
              lineHeight: 25,
              color: Colors.black_232C28,
            },
          ]}>
          {t('common:enter_the_full_address')}
        </Text>

        {/* ========== region ================= */}
        <View style={[Layout.wrap, Gutters.tinyTMargin]}>
          <CustomInput
            headingText={`${t('common:region')}`}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            inputProps={{
              onChangeText: (t: string) =>
                setProperty({
                  ...property,
                  region: {text: t, error: ''},
                }),
              onBlur: () => {
                handleBlurForLocation({
                  region: property?.region?.text,
                  district: property?.district?.text,
                  suburb: property?.suburb?.text,
                });
              },
              value: property?.region?.text,
              placeholderTextColor: Colors.dark_gray_676C6A,
            }}
            inputStyle={{color: Colors.dark_gray_676C6A}}
            backgroundStyle={[
              {
                backgroundColor: Colors.light_grayF4F4F4,
                borderWidth: 2,
                borderColor: property?.region?.error
                  ? Colors.red
                  : Colors.gray_C9C9C9,
                borderRadius: 6,
              },
            ]}
            placeholder={''}
            showPassword={false}
            childrenstyle={[Layout.alignItemsStart]}>
            <TextMedium text="*" textStyle={[{color: Colors.red_E34040}]} />
          </CustomInput>
          {property?.region?.error && (
            <TextRegular
              text={property?.region?.error}
              textStyle={[
                Layout.textTransfromNone,
                {color: Colors.red, marginLeft: sHight(1)},
              ]}
            />
          )}
        </View>
        {/* ========== district ================= */}
        <View style={[Layout.wrap, Gutters.tinyVMargin]}>
          <CustomInput
            headingText={`${t('common:district')}`}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            inputProps={{
              onChangeText: (t: string) =>
                setProperty({
                  ...property,
                  district: {text: t, error: ''},
                }),
              onBlur: () => {
                handleBlurForLocation({
                  region: property?.region?.text,
                  district: property?.district?.text,
                  suburb: property?.suburb?.text,
                });
              },
              value: property?.district?.text,
              placeholderTextColor: Colors.dark_gray_676C6A,
            }}
            inputStyle={{color: Colors.dark_gray_676C6A}}
            backgroundStyle={[
              {
                backgroundColor: Colors.light_grayF4F4F4,
                borderWidth: 2,
                borderColor: property?.district?.error
                  ? Colors.red
                  : Colors.gray_C9C9C9,
                borderRadius: 6,
              },
            ]}
            placeholder={''}
            showPassword={false}
            childrenstyle={[Layout.alignItemsStart]}>
            <TextMedium text="*" textStyle={[{color: Colors.red_E34040}]} />
          </CustomInput>
          {property?.district?.error && (
            <TextRegular
              text={property?.district?.error}
              textStyle={[
                Layout.textTransfromNone,
                {color: Colors.red, marginLeft: sHight(1)},
              ]}
            />
          )}
        </View>

        {/* ========== suburb ================= */}
        <View style={[Layout.wrap, Gutters.tinyBMargin]}>
          <CustomInput
            headingText={`${t('common:suburb')}`}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            inputProps={{
              onChangeText: (t: string) =>
                setProperty({
                  ...property,
                  suburb: {text: t, error: ''},
                }),
              onBlur: () => {
                handleBlurForLocation({
                  region: property?.region?.text,
                  district: property?.district?.text,
                  suburb: property?.suburb?.text,
                });
              },
              value: property?.suburb?.text,
              placeholderTextColor: Colors.dark_gray_676C6A,
            }}
            inputStyle={{color: Colors.dark_gray_676C6A}}
            backgroundStyle={[
              {
                borderColor: property?.suburb?.error
                  ? Colors.red
                  : Colors.gray_C9C9C9,
                backgroundColor: Colors.light_grayF4F4F4,
                borderWidth: 2,
                borderRadius: 6,
              },
            ]}
            placeholder={''}
            showPassword={false}
            childrenstyle={[Layout.alignItemsStart]}>
            <TextMedium text="*" textStyle={[{color: Colors.red_E34040}]} />
          </CustomInput>
          {property?.suburb?.error && (
            <TextRegular
              text={property?.suburb?.error}
              textStyle={[
                Layout.textTransfromNone,
                {color: Colors.red, marginLeft: sHight(1)},
              ]}
            />
          )}
        </View>

        {/* =========== Features ========== */}
        <View style={[Gutters.smallTMargin]}>
          <TextSemiBold
            text={t('common:features')}
            textStyle={[Fonts.poppinSemiBold24, {color: Colors.black_232C28}]}
          />
          <Text
            style={[
              Gutters.littleTMargin,
              Fonts.poppinReg16,
              {
                lineHeight: 25,
                color: Colors.black_232C28,
              },
            ]}>
            {t('common:provide_some_further_details')}
          </Text>
        </View>

        <View style={[Layout.row, Gutters.tinyTMargin]}>
          {/* ========== bedRooms ================= */}
          <View style={[{width: '45%', flexWrap: 'wrap'}]}>
            <CustomInput
              headingText={`${t('common:bedrooms')}`}
              headingTextStyle={[
                Fonts.poppinMed18,
                {color: Colors.black_232C28},
              ]}
              inputStyle={{color: Colors.dark_gray_676C6A}}
              inputProps={{
                onChangeText: (t: string) =>
                  setProperty({
                    ...property,
                    bedrooms: {text: t, error: ''},
                  }),
                value: property?.bedrooms?.text,
                placeholderTextColor: Colors.dark_gray_676C6A,
                keyboardType: 'number-pad',
              }}
              backgroundStyle={[
                {
                  width: '100%',
                  backgroundColor: Colors.light_grayF4F4F4,
                  borderWidth: 2,
                  borderColor: property?.bedrooms?.error
                    ? Colors.red
                    : Colors.gray_C9C9C9,
                  borderRadius: 6,
                },
              ]}
              placeholder={''}
              showPassword={false}
              childrenstyle={[Layout.alignItemsStart]}>
              <TextMedium
                text={t('common:optional')}
                textStyle={[
                  Fonts.poppinReg16,
                  {color: Colors.dark_gray_676C6A, width: screenWidth * 0.3},
                ]}
              />
            </CustomInput>
            <View style={{height: 20}}>
              {property?.bedrooms?.error && (
                <TextRegular
                  text={property?.bedrooms?.error}
                  textStyle={[
                    Layout.textTransfromNone,
                    {color: Colors.red, marginLeft: sHight(1)},
                  ]}
                />
              )}
            </View>
          </View>
          <View style={[{width: '10%'}]}></View>
          {/* ========== bath rooms ================= */}
          <View style={[Layout.wrap, {width: '45%'}]}>
            <CustomInput
              headingText={`${t('common:bathrooms')}`}
              headingTextStyle={[
                Fonts.poppinMed18,
                {color: Colors.black_232C28},
              ]}
              inputProps={{
                onChangeText: (t: string) =>
                  setProperty({
                    ...property,
                    bathroom: {text: t, error: ''},
                  }),
                value: property?.bathroom?.text,
                placeholderTextColor: Colors.dark_gray_676C6A,
                keyboardType: 'number-pad',
              }}
              backgroundStyle={[
                {
                  width: '100%',
                  backgroundColor: Colors.light_grayF4F4F4,
                  borderWidth: 2,
                  borderColor: property?.bathroom?.error
                    ? Colors.red
                    : Colors.gray_C9C9C9,
                  borderRadius: 6,
                },
              ]}
              placeholder={''}
              showPassword={false}
              childrenstyle={[Layout.alignItemsStart]}>
              <TextMedium
                text={t('common:optional')}
                textStyle={[
                  Fonts.poppinReg16,
                  {color: Colors.dark_gray_676C6A, width: screenWidth * 0.3},
                ]}
              />
            </CustomInput>
            <View style={{height: 20}}>
              {property?.bathroom?.error && (
                <TextRegular
                  text={property?.bathroom?.error}
                  textStyle={[
                    Layout.textTransfromNone,
                    {color: Colors.red, marginLeft: sHight(1)},
                  ]}
                />
              )}
            </View>
          </View>
        </View>

        <View style={[Layout.row, Layout.alignItemsEnd]}>
          {/* ========== seprate toilet ================= */}
          <View style={[Layout.wrap, {width: '45%'}]}>
            <CustomInput
              headingText={`${t('common:separate_toilets')}`}
              headingTextStyle={[
                Fonts.poppinMed18,
                {color: Colors.black_232C28},
              ]}
              inputProps={{
                onChangeText: (t: string) =>
                  setProperty({...property, separateToilet: t}),
                value: property?.separateToilet,
                placeholderTextColor: Colors.dark_gray_676C6A,
                keyboardType: 'number-pad',
              }}
              inputStyle={{color: Colors.dark_gray_676C6A}}
              backgroundStyle={[
                {
                  width: '100%',
                  backgroundColor: Colors.light_grayF4F4F4,
                  borderWidth: 2,
                  borderColor: Colors.gray_C9C9C9,
                  borderRadius: 6,
                },
              ]}
              placeholder={''}
              showPassword={false}
              childrenstyle={[Layout.alignItemsCenter]}>
              <TextMedium
                text={t('common:optional')}
                textStyle={[
                  Fonts.poppinReg16,
                  {color: Colors.dark_gray_676C6A, width: screenWidth * 0.3},
                ]}
              />
            </CustomInput>
          </View>
          <View style={[{width: '10%'}]}></View>
          {/* ========== ensuite bathrooms ================= */}
          <View style={[Layout.wrap, {width: '45%'}]}>
            <CustomInput
              headingText={`${t('common:ensuite_bathrooms')}`}
              headingTextStyle={[
                Fonts.poppinMed18,
                {color: Colors.black_232C28},
              ]}
              inputProps={{
                onChangeText: (t: string) =>
                  setProperty({...property, ensuiteBathroom: t}),
                value: property?.ensuiteBathroom,
                placeholderTextColor: Colors.dark_gray_676C6A,
                keyboardType: 'number-pad',
              }}
              inputStyle={{
                color: Colors.dark_gray_676C6A,
              }}
              backgroundStyle={[
                {
                  width: '100%',
                  backgroundColor: Colors.light_grayF4F4F4,
                  borderRadius: 6,
                  borderWidth: 2,
                  borderColor: Colors.gray_C9C9C9,
                },
              ]}
              placeholder={''}
              showPassword={false}
              childrenstyle={[Layout.alignItemsCenter]}>
              <TextMedium
                text={t('common:optional')}
                textStyle={[
                  Fonts.poppinReg16,
                  {color: Colors.dark_gray_676C6A, width: screenWidth * 0.3},
                ]}
              />
            </CustomInput>
          </View>
        </View>

        <View style={[Layout.row, {marginTop: 20}, Layout.alignItemsEnd]}>
          {/* ========== living area ================= */}
          <View style={[Layout.wrap, {width: '45%'}]}>
            <CustomInput
              headingText={`${t('common:living_area_lounges')}`}
              headingTextStyle={[
                Fonts.poppinMed18,
                {color: Colors.black_232C28},
              ]}
              inputProps={{
                onChangeText: (t: string) =>
                  setProperty({
                    ...property,
                    livingAreas: {text: t, error: ''},
                  }),
                value: property?.livingAreas?.text,
                placeholderTextColor: Colors.dark_gray_676C6A,
                keyboardType: 'number-pad',
              }}
              inputStyle={{color: Colors.dark_gray_676C6A}}
              backgroundStyle={[
                {
                  width: '100%',
                  backgroundColor: Colors.light_grayF4F4F4,
                  borderWidth: 2,
                  borderColor: property?.livingAreas?.error
                    ? Colors.red
                    : Colors.gray_C9C9C9,
                  borderRadius: 6,
                },
              ]}
              placeholder={''}
              showPassword={false}
              childrenstyle={[Layout.alignItemsStart]}>
              <TextMedium
                text={t('common:optional')}
                textStyle={[
                  Fonts.poppinReg16,
                  {color: Colors.dark_gray_676C6A, width: screenWidth * 0.3},
                ]}
              />
            </CustomInput>
            <View style={{height: 20}}>
              {property?.livingAreas?.error && (
                <TextRegular
                  text={property?.livingAreas?.error}
                  textStyle={[
                    Layout.textTransfromNone,
                    {color: Colors.red, marginLeft: sHight(1)},
                  ]}
                />
              )}
            </View>
          </View>
          <View style={[{width: '10%'}]}></View>
          {/* ========== studies ================= */}
          <View
            style={[
              Layout.wrap,
              Platform.OS === 'ios'
                ? Gutters.regularTMargin
                : Gutters.smallTMargin,
              {width: '45%', flexWrap: 'wrap'},
            ]}>
            <CustomInput
              headingText={`${t('common:studies')}`}
              headingTextStyle={[
                Fonts.poppinMed18,
                {color: Colors.black_232C28},
              ]}
              inputProps={{
                onChangeText: (t: string) =>
                  setProperty({
                    ...property,
                    studies: {text: t, error: ''},
                  }),
                value: property?.studies?.text,
                placeholderTextColor: Colors.dark_gray_676C6A,
                keyboardType: 'number-pad',
              }}
              inputStyle={{color: Colors.dark_gray_676C6A}}
              backgroundStyle={[
                {
                  width: '100%',
                  backgroundColor: Colors.light_grayF4F4F4,
                  borderWidth: 2,
                  borderColor: property?.studies?.error
                    ? Colors.red
                    : Colors.gray_C9C9C9,
                  borderRadius: 6,
                },
              ]}
              placeholder={''}
              showPassword={false}
              childrenstyle={[Layout.alignItemsStart]}>
              <TextMedium
                text={`${t('common:optional')}`}
                textStyle={[
                  Fonts.poppinReg16,
                  {color: Colors.dark_gray_676C6A, width: screenWidth * 0.3},
                ]}
              />
            </CustomInput>
            <View style={{height: 20}}>
              {property?.studies?.error && (
                <TextRegular
                  text={property?.studies?.error}
                  textStyle={[
                    Layout.textTransfromNone,
                    {color: Colors.red, marginLeft: sHight(1)},
                  ]}
                />
              )}
            </View>
          </View>
        </View>
        <View
          style={[
            Layout.fullWidth,
            {height: 1, backgroundColor: Colors.gray_C9C9C9},
          ]}
        />

        {/* =========== Parking ========== */}
        <View style={[Gutters.smallTMargin]}>
          <TextSemiBold
            text={t('common:parking')}
            textStyle={[Fonts.poppinSemiBold24, {color: Colors.black_232C28}]}
          />
          <Text
            style={[
              Gutters.littleTMargin,
              Fonts.poppinReg16,
              {
                lineHeight: 25,
                color: Colors.black_232C28,
              },
            ]}>
            {t('common:provide_some_details_about_parking')}
          </Text>
        </View>

        <View style={[Layout.row, Gutters.smallVMargin, Layout.overflow]}>
          {/* ========== garage parking ================= */}
          <View style={[Layout.wrap, {width: '45%'}]}>
            <CustomDropDown
              data={listGarage}
              leftIcon={false}
              iconName={''}
              selectedTextStyle={[
                Fonts.poppinMed18,
                {color: Colors.dark_gray_676C6A},
              ]}
              headingTextStyle={[
                Fonts.poppinMed18,
                {color: Colors.black_232C28},
              ]}
              value={
                isEdit
                  ? getNameByValue(
                      paramData?.property?.garage_parking ? 'Yes' : 'No',
                      listGarage,
                    )
                  : property?.garageParking
              }
              customStyle={[
                {
                  width: '100%',
                  backgroundColor: Colors.light_grayF4F4F4,
                  borderWidth: 2,
                  borderColor: Colors.gray_C9C9C9,
                },
              ]}
              setSelected={(t: string) =>
                setProperty({...property, garageParking: t})
              }
              placeholder={''}
              headingText={t('common:garage_parking')}
              itemStyle={[
                {
                  backgroundColor: Colors.light_grayF4F4F4,
                  width: '100%',
                },
              ]}
            />
          </View>
          <View style={[{width: '10%'}]}></View>
          {/* ========== off street parking ================= */}
          <View style={[Layout.wrap, {width: '45%'}]}>
            <CustomDropDown
              data={listGarage}
              value={
                isEdit
                  ? getNameByValue(
                      paramData?.property?.garage_parking ? 'Yes' : 'No',
                      listGarage,
                    )
                  : property?.offStreetParking
              }
              leftIcon={false}
              iconName={''}
              selectedTextStyle={[
                Fonts.poppinMed18,
                {color: Colors.dark_gray_676C6A},
              ]}
              headingTextStyle={[
                Fonts.poppinMed18,
                {color: Colors.black_232C28},
              ]}
              customStyle={[
                {
                  width: '100%',
                  backgroundColor: Colors.light_grayF4F4F4,
                  borderWidth: 2,
                  borderColor: Colors.gray_C9C9C9,
                },
              ]}
              setSelected={(t: string) =>
                setProperty({...property, offStreetParking: t})
              }
              placeholder={''}
              headingText={t('common:offStreet_Parking')}
              itemStyle={[
                {
                  backgroundColor: Colors.light_grayF4F4F4,
                  width: '100%',
                },
              ]}
            />
          </View>
        </View>
        {/* ========== additional details about parking ================= */}
        <View style={[Layout.wrap, Gutters.tinyBMargin]}>
          <CustomInput
            headingText={`${t('common:additional_detail_about_parking')}`}
            headingTextStyle={[
              Fonts.poppinMed18,
              Layout.textTransfromNone,
              {color: Colors.black_232C28},
            ]}
            inputProps={{
              onChangeText: (t: string) =>
                setProperty({...property, additionalInfoParking: t}),
              value: property?.additionalInfoParking,
              multiline: true,
              placeholderTextColor: Colors.black_232C28,
            }}
            backgroundStyle={[
              {
                width: '100%',
                height: 120,
                backgroundColor: Colors.light_grayF4F4F4,
                borderWidth: 2,
                borderColor: Colors.gray_C9C9C9,
              },
            ]}
            inputStyle={[
              {color: Colors.dark_gray_676C6A, textAlignVertical: 'top'},
            ]}
            placeholder={''}
            showPassword={false}
            childrenstyle={[Layout.alignItemsCenter]}>
            <TextMedium
              text={t('common:optional')}
              textStyle={[Fonts.poppinReg16, {color: Colors.dark_gray_676C6A}]}
            />
          </CustomInput>
        </View>

        {/* =========== availability of rental ========== */}
        <View style={[Gutters.smallTMargin]}>
          <TextSemiBold
            text={t('common:choose_the_price_and_availability_of_your_rental')}
            textStyle={[Fonts.poppinSemiBold24, {color: Colors.black_232C28}]}
          />
        </View>
        <View
          style={[Layout.row, Layout.alignItemsCenter, Gutters.smallTMargin]}>
          {['For Sale', 'For Rent']?.map((item, index) => (
            <CustomRadioButton
              selected={selected}
              text={item}
              index={index}
              setSelected={v => setSelected(v)}
              customTextStyle={[
                Fonts.poppinMed20,
                {color: Colors.black_232C28},
              ]}
            />
          ))}
        </View>

        <View style={[Layout.rowHCenter]}>
          <CustomCheckBox
            selected={property.enquireAboutPrice}
            setSelected={() =>
              // setEnquireAboutPrice(currentState => !currentState)
              setProperty(currentState => ({
                ...currentState,
                enquireAboutPrice: !currentState.enquireAboutPrice,
              }))
            }
          />
          <RegularText
            text="Or allow buyers to enquire for a price or negotiation."
            textStyle={[
              Fonts.poppinReg14,
              Gutters.tinyLMargin,
              Gutters.littleHPadding,
              {color: Colors.black_232C28},
            ]}
          />
        </View>

        <View style={[Layout.row, Layout.alignItemsStart]}>
          {/* ========== rent / price ================= */}
          {!property.enquireAboutPrice && (
            <View style={[{width: '100%'}]}>
              <CustomInput
                headingText={`${
                  selected == 0
                    ? t('common:asking_price')
                    : t('common:rent_per_week')
                }`}
                headingTextStyle={[
                  Fonts.poppinMed18,
                  {color: Colors.black_232C28},
                ]}
                inputProps={{
                  onChangeText: (t: string) => {
                    selected == 0
                      ? setProperty({
                          ...property,
                          asking_price: {text: t, error: ''},
                        })
                      : setProperty({
                          ...property,
                          rent_per_week: {text: t, error: ''},
                        });
                  },
                  value:
                    selected == 0
                      ? property?.asking_price?.text
                      : property?.rent_per_week?.text,
                  keyboardType: 'number-pad',
                  placeholderTextColor: Colors.dark_gray_676C6A,
                }}
                inputStyle={{color: Colors.dark_gray_676C6A}}
                backgroundStyle={[
                  {
                    width: '100%',
                    backgroundColor: Colors.light_grayF4F4F4,
                    borderWidth: 2,
                    borderColor:
                      (property?.rent_per_week.error && selected == 1) ||
                      (property?.asking_price.error && selected == 0)
                        ? Colors.red
                        : Colors.gray_C9C9C9,
                    borderRadius: 6,
                  },
                ]}
                placeholder={''}
                showPassword={false}
                childrenstyle={[Layout.alignItemsStart]}></CustomInput>
              <View style={{minHeight: 20}}>
                {((property?.rent_per_week.error && selected == 1) ||
                  (property?.asking_price.error && selected == 0)) && (
                  <TextRegular
                    numberOfLines={2}
                    text={
                      selected == 0
                        ? property?.asking_price?.error
                        : property?.rent_per_week.error
                    }
                    textStyle={[
                      Layout.textTransfromNone,
                      {color: Colors.red, marginLeft: sHight(1)},
                    ]}
                  />
                )}
              </View>
            </View>
          )}

          {/* <View style={[{width: '8%'}]}></View> */}
          {/* ========== date available ================= */}
          {/* <View style={[Gutters.littleTMargin, {width: '46%'}]}>
            <CustomDatePicker
              setSelectedDate={date => {
                const formateDate = moment(date).format('YYYY-MM-DD');
                setProperty({
                  ...property,
                  date_available: {text: formateDate, error: ''},
                });
              }}
              headingText={t('common:date_available')}
              dateProps={{minimumDate: new Date()}}
              customHeadingStyle={[
                Fonts.poppinMed18,
                {color: Colors.black_232C28},
              ]}
              selectDate={property?.date_available?.text}
              leftIcon={false}
              rightIcon={true}
              rightIconName="calendar"
              customBackgroundStyle={[
                {
                  backgroundColor: Colors.light_grayF4F4F4,
                  borderWidth: 2,
                  borderColor: property?.date_available?.error
                    ? Colors.red
                    : Colors.gray_C9C9C9,
                },
              ]}
            />
            <View style={{height: 20}}>
              {property?.date_available?.error && (
                <TextRegular
                  numberOfLines={1}
                  text={property?.date_available?.error}
                  textStyle={[
                    Layout.textTransfromNone,
                    {color: Colors.red, marginLeft: sHight(1)},
                  ]}
                />
              )}
            </View>
          </View> */}
        </View>
        {/* ========== listing duration ================= */}
        {/* <View style={[Layout.wrap, Gutters.tinyVMargin]}>
          <CustomInput
            headingText={`${t('common:listing_duration')}`}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            inputProps={{
              onChangeText: (t: string) =>
                setProperty({
                  ...property,
                  listingDuration: t,
                }),
              value: property?.listingDuration,
              placeholderTextColor: Colors.dark_gray_676C6A,
            }}
            inputStyle={{color: Colors.dark_gray_676C6A}}
            backgroundStyle={[
              {
                backgroundColor: Colors.light_grayF4F4F4,
                borderWidth: 2,
                borderColor: Colors.gray_C9C9C9,
                borderRadius: 6,
              },
            ]}
            placeholder={''}
            showPassword={false}
          />
        </View> */}
        <View>
          {/* <Text
            style={[
              Gutters.smallVMargin,
              Fonts.poppinReg16,
              {
                lineHeight: 25,
                color: Colors.black_232C28,
              },
            ]}>
            {t('common:listing_ends_line')}
          </Text> */}
          {/* <Text
            style={[
              Gutters.smallBMargin,
              Fonts.poppinReg14,
              {
                lineHeight: 25,
                color: Colors.black_232C28,
              },
            ]}>
            {t('common:relist_for_free_within_line')}
          </Text> */}
        </View>

        {/* =========== Your detail ========== */}
        <View style={[Gutters.smallVMargin]}>
          <TextSemiBold
            text={t('common:your_details')}
            textStyle={[Fonts.poppinSemiBold24, {color: Colors.black_232C28}]}
          />
        </View>

        {/* ========== mobile ================= */}
        <View style={[Layout.wrap]}>
          <CustomInput
            headingText={`${t('common:mobile')}`}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            inputProps={{
              onChangeText: (t: string) =>
                setProperty({
                  ...property,
                  mobile: t,
                }),
              value: property?.mobile,
              placeholderTextColor: Colors.dark_gray_676C6A,
              keyboardType: 'number-pad',
            }}
            inputStyle={{color: Colors.dark_gray_676C6A}}
            backgroundStyle={[
              {
                backgroundColor: Colors.light_grayF4F4F4,
                borderWidth: 2,
                borderRadius: 6,
                borderColor: Colors.gray_C9C9C9,
              },
            ]}
            placeholder={''}
            showPassword={false}
            childrenstyle={[Layout.alignItemsCenter]}>
            <TextMedium
              text={t('common:optional')}
              textStyle={[
                Fonts.poppinReg16,
                Layout.textTransfromNone,
                Gutters.littleLMargin,
                {color: Colors.dark_gray_676C6A},
              ]}
            />
          </CustomInput>
        </View>

        {/* ========== home ================= */}
        <View style={[Layout.wrap, Gutters.tinyTMargin]}>
          <CustomInput
            headingText={`${t('common:home')}`}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            inputProps={{
              onChangeText: (t: string) =>
                setProperty({
                  ...property,
                  home: t,
                }),

              value: property?.home,
              placeholderTextColor: Colors.dark_gray_676C6A,
            }}
            inputStyle={{color: Colors.dark_gray_676C6A}}
            backgroundStyle={[
              {
                backgroundColor: Colors.light_grayF4F4F4,
                borderRadius: 6,
                borderColor: Colors.gray_C9C9C9,
                borderWidth: 2,
              },
            ]}
            placeholder={''}
            showPassword={false}
            childrenstyle={[Layout.alignItemsCenter]}>
            <TextMedium
              text={t('common:optional')}
              textStyle={[
                Fonts.poppinReg16,
                Layout.textTransfromNone,
                Gutters.littleLMargin,
                {color: Colors.dark_gray_676C6A},
              ]}
            />
          </CustomInput>
        </View>

        {/* ========== contact time ================= */}
        <View style={[Layout.wrap, Gutters.tinyTMargin]}>
          <CustomInput
            headingText={`${t('common:best_contact_time')}`}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            inputProps={{
              onChangeText: (t: string) =>
                setProperty({
                  ...property,
                  contactTime: t,
                }),
              value: property?.contactTime,
              placeholderTextColor: Colors.dark_gray_676C6A,
            }}
            inputStyle={{color: Colors.dark_gray_676C6A}}
            backgroundStyle={[
              {
                backgroundColor: Colors.light_grayF4F4F4,
                borderWidth: 2,
                borderRadius: 6,
                borderColor: Colors.gray_C9C9C9,
              },
            ]}
            placeholder={''}
            showPassword={false}
            childrenstyle={[Layout.alignItemsCenter]}>
            <TextMedium
              text={t('common:optional')}
              textStyle={[
                Fonts.poppinReg16,
                Layout.textTransfromNone,
                Gutters.littleLMargin,
                {color: Colors.dark_gray_676C6A},
              ]}
            />
          </CustomInput>
        </View>

        {/* =========== Register property agent ========== */}
        {/* <View style={[Gutters.smallVMargin]}>
          <TextRegular
            text={t('common:are_you_registered_property_agent')}
            textStyle={[
              Fonts.poppinSemiBold20,
              {color: Colors.black_232C28, textTransform: 'none'},
            ]}
          />
        </View> */}

        {/* ========== register property agent ================= */}
        {/* <View style={[Layout.row]}>
          {['Yes', 'No'].map((item, index) => {
            return (
              <CustomRadioButton
                text={item}
                index={index}
                selected={property?.isRegisterPropertyAgent ? 0 : 1}
                customStyle={[index === 1 && Gutters.largeLMargin]}
                setSelected={v => {
                  console.log('vvvv', v);
                  setProperty({
                    ...property,
                    isRegisterPropertyAgent: !v,
                  });
                }}
                customRadioStyle={[{borderColor: Colors.primary}]}
                customTextStyle={[Fonts.poppinMed18]}
              />
            );
          })}
        </View> */}
        {/* ========== your name ================= */}
        {/* <View style={[Layout.wrap, Gutters.tinyBMargin]}>
          <CustomInput
            headingText={`${t('common:your_name')}`}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            inputProps={{
              onChangeText: (t: string) =>
                setProperty({
                  ...property,
                  agent_name: {text: t, error: ''},
                }),
              value: property?.agent_name?.text,
              placeholderTextColor: Colors.dark_gray_676C6A,
            }}
            inputStyle={{color: Colors.dark_gray_676C6A}}
            backgroundStyle={[
              {
                backgroundColor: Colors.light_grayF4F4F4,
                borderWidth: 2,
                borderRadius: 6,
                borderColor: property?.agent_name?.error
                  ? Colors.red
                  : Colors.gray_C9C9C9,
              },
            ]}
            placeholder={''}
            showPassword={false}
            childrenstyle={[Layout.alignItemsStart]}></CustomInput>
          {property?.agent_name?.error && (
            <TextRegular
              text={property?.agent_name?.error}
              textStyle={[
                Layout.textTransfromNone,
                {color: Colors.red, marginLeft: sHight(1)},
              ]}
            />
          )}
        </View> */}

        {/* ========== agency name ================= */}
        {/* <View style={[Layout.wrap]}>
          <CustomInput
            headingText={`${t('common:agency_name')}`}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            inputProps={{
              onChangeText: (t: string) =>
                setProperty({
                  ...property,
                  agency_name: {text: t, error: ''},
                }),
              value: property?.agency_name?.text,
              placeholderTextColor: Colors.dark_gray_676C6A,
            }}
            inputStyle={{color: Colors.dark_gray_676C6A}}
            backgroundStyle={[
              {
                borderWidth: 2,
                borderColor: property?.agency_name?.error
                  ? Colors.red
                  : Colors.gray_C9C9C9,
                backgroundColor: Colors.light_grayF4F4F4,
                borderRadius: 6,
              },
            ]}
            placeholder={''}
            showPassword={false}
            childrenstyle={[Layout.alignItemsStart]}></CustomInput>
          {property?.agency_name?.error && (
            <TextRegular
              text={property?.agency_name?.error}
              textStyle={[
                Layout.textTransfromNone,
                {color: Colors.red, marginLeft: sHight(1)},
              ]}
            />
          )}
        </View> */}
        {/* <View
          style={[
            Layout.fullWidth,
            Gutters.smallVPadding,
            Gutters.tinyBMargin,
            {borderBottomWidth: 1, borderColor: Colors.gray_C9C9C9},
          ]}>
          <TextRegular
            text="Licensed agents are required to disclose their status under the Real Estate Agents Act 2008."
            textStyle={[Fonts.poppinReg14, {color: Colors.dark_gray_676C6A}]}
          />
        </View> */}

        {/* =========== Property description ========== */}
        <View style={[Gutters.smallTMargin]}>
          <TextSemiBold
            text={t('common:property_description')}
            textStyle={[
              Fonts.poppinSemiBold20,
              Layout.textTransfromNone,
              {color: Colors.black_232C28},
            ]}
          />
        </View>
        {/* ========== pets ok ================= */}
        <View style={[Layout.wrap, Gutters.tinyTMargin]}>
          <CustomInput
            headingText={`${t('common:pets_oky')} `}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            inputProps={{
              onChangeText: (t: string) =>
                setProperty({
                  ...property,
                  petsOk: t,
                }),
              value: property?.petsOk,
              placeholderTextColor: Colors.dark_gray_676C6A,
            }}
            inputStyle={{color: Colors.dark_gray_676C6A}}
            backgroundStyle={[
              {
                backgroundColor: Colors.light_grayF4F4F4,
                borderWidth: 2,
                borderColor: Colors.gray_C9C9C9,
                borderRadius: 6,
              },
            ]}
            placeholder={''}
            showPassword={false}
            childrenstyle={[Layout.alignItemsCenter]}>
            <TextMedium
              text={t('common:optional')}
              textStyle={[
                Fonts.poppinReg16,
                Layout.textTransfromNone,
                Layout.tinyLMargin,
                {color: Colors.dark_gray_676C6A},
              ]}
            />
          </CustomInput>
        </View>
        {/* ========== smokers ok ================= */}
        <View style={[Layout.wrap, Gutters.tinyVMargin]}>
          <CustomInput
            headingText={`${t('common:smokers_ok')} `}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            inputProps={{
              onChangeText: (t: string) =>
                setProperty({
                  ...property,
                  smookingOk: t,
                }),
              value: property?.smookingOk,
              placeholderTextColor: Colors.dark_gray_676C6A,
            }}
            inputStyle={{color: Colors.dark_gray_676C6A}}
            backgroundStyle={[
              {
                backgroundColor: Colors.light_grayF4F4F4,
                borderWidth: 2,
                borderRadius: 6,
                borderColor: Colors.gray_C9C9C9,
              },
            ]}
            placeholder={''}
            showPassword={false}
            childrenstyle={[Layout.alignItemsCenter]}>
            <TextMedium
              text={t('common:optional')}
              textStyle={[
                Fonts.poppinReg16,
                Layout.textTransfromNone,
                Layout.tinyLMargin,
                {color: Colors.dark_gray_676C6A},
              ]}
            />
          </CustomInput>
        </View>
        {/* ========== furnishing white areas ================= */}
        <View style={[Layout.wrap, Gutters.tinyTMargin]}>
          <CustomInput
            headingText={`${t('common:furnishing_and_whiteware')} `}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            inputProps={{
              onChangeText: (t: string) =>
                setProperty({
                  ...property,
                  furnishingWhiteware: t,
                }),
              value: property?.furnishingWhiteware,
              multiline: true,
              placeholderTextColor: Colors.dark_gray_676C6A,
            }}
            backgroundStyle={[
              {
                height: 120,
                backgroundColor: Colors.light_grayF4F4F4,
                borderWidth: 2,
                borderColor: Colors.gray_C9C9C9,
              },
            ]}
            inputStyle={[
              {color: Colors.dark_gray_676C6A, textAlignVertical: 'top'},
            ]}
            placeholder={''}
            showPassword={false}
            childrenstyle={[Layout.alignItemsCenter]}>
            <TextMedium
              text={t('common:optional')}
              textStyle={[
                Fonts.poppinReg16,
                Layout.textTransfromNone,
                Layout.tinyLMargin,
                {color: Colors.dark_gray_676C6A},
              ]}
            />
          </CustomInput>
        </View>

        {/* ========== amenities ================= */}
        <View style={[Layout.wrap, Gutters.tinyTMargin]}>
          <CustomInput
            headingText={`${t('common:amenities')} `}
            headingTextStyle={[
              Layout.textTransfromNone,
              Fonts.poppinMed18,
              {color: Colors.black_232C28},
            ]}
            inputProps={{
              onChangeText: (t: string) =>
                setProperty({
                  ...property,
                  amenities: t,
                }),
              value: property?.amenities,
              multiline: true,
              placeholderTextColor: Colors.dark_gray_676C6A,
            }}
            backgroundStyle={[
              {
                height: 120,
                backgroundColor: Colors.light_grayF4F4F4,
                borderWidth: 2,
                borderColor: Colors.gray_C9C9C9,
              },
            ]}
            inputStyle={[
              {color: Colors.dark_gray_676C6A, textAlignVertical: 'top'},
            ]}
            placeholder={''}
            showPassword={false}
            childrenstyle={[Layout.alignItemsCenter]}>
            <TextMedium
              text={t('common:optional')}
              textStyle={[
                Fonts.poppinReg16,
                Layout.textTransfromNone,
                Layout.tinyLMargin,
                {color: Colors.dark_gray_676C6A},
              ]}
            />
          </CustomInput>
          <View
            style={[
              Gutters.tinyTMargin,
              Layout.row,
              Layout.alignItemsCenter,
              Layout.justifyContentCenter,
            ]}>
            <Text
              style={[
                Fonts.poppinReg14,
                Gutters.tinyPadding,
                {
                  lineHeight: 18,
                  color: Colors.black_232C28,
                  height: 60,
                },
              ]}>
              {t('common:note')}
              <Text
                style={[
                  Fonts.poppinReg14,
                  {
                    lineHeight: 22,
                    color: Colors.gray_C9C9C9,
                  },
                ]}>
                {t('common:nearby_school_text_line')}
              </Text>
            </Text>
          </View>
        </View>
        {/* ========== your_ideal_tenants ================= */}
        <View style={[Layout.wrap, Gutters.tinyBMargin]}>
          <CustomInput
            headingText={`${t('common:your_ideal_tenants')} `}
            headingTextStyle={[
              Fonts.poppinMed18,
              Layout.textTransfromNone,
              {color: Colors.black},
            ]}
            inputProps={{
              onChangeText: (t: string) =>
                setProperty({
                  ...property,
                  idealTenents: t,
                }),
              value: property?.idealTenents,
              multiline: true,
              placeholderTextColor: Colors.dark,
            }}
            backgroundStyle={[
              {
                height: 120,
                backgroundColor: Colors.light_grayF4F4F4,
                borderWidth: 2,
                borderColor: Colors.gray_C9C9C9,
              },
            ]}
            inputStyle={[
              {color: Colors.dark_gray_676C6A, textAlignVertical: 'top'},
            ]}
            placeholder={''}
            showPassword={false}
            childrenstyle={[Layout.alignItemsCenter]}>
            <TextMedium
              text={t('common:optional')}
              textStyle={[
                Fonts.poppinReg16,
                Layout.textTransfromNone,
                Layout.tinyLMargin,
                {color: Colors.dark_gray_676C6A},
              ]}
            />
          </CustomInput>
        </View>

        {/* ========== payment options ================= */}
        {/* <View style={[Gutters.tinyTMargin]}>
          <CustomDropDown
            data={dropdownPaymentOption}
            value={
              // isEdit
              //   ?
              getNameByValue(
                paramData?.payment_option
                  ? paramData?.payment_option
                  : property?.paymentOption?.text,
                dropdownPaymentOption,
              )
              // : property?.paymentOption?.text
            }
            leftIcon={true}
            iconName={'wallet'}
            selectedTextStyle={{color: Colors.dark_gray_676C6A}}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            customStyle={[
              {
                backgroundColor: Colors.light_grayF4F4F4,
                borderWidth: 2,
                borderColor: property?.paymentOption?.error
                  ? Colors.red
                  : Colors.gray_C9C9C9,
              },
            ]}
            setSelected={(t: string) =>
              setProperty({
                ...property,
                paymentOption: {text: t, error: ''},
              })
            }
            placeholder={''}
            headingText={t('common:payment_option')}
            itemStyle={[{backgroundColor: Colors.light_grayF4F4F4}]}>
            <TextMedium
              text={'*'}
              textStyle={[Fonts.poppinMed18, {color: Colors.red_E34040}]}
            />
          </CustomDropDown>
          {property?.paymentOption?.error && (
            <TextRegular
              text={property?.paymentOption?.error}
              textStyle={[
                Layout.textTransfromNone,
                {color: Colors.red, marginLeft: sHight(1)},
              ]}
            />
          )}
        </View> */}
        {/* ========== start date ================= */}
        <View style={[Gutters.tinyVMargin]}>
          <CustomDatePicker
            isShowCross={true}
            setSelectedDate={date => {
              const formateDate = date ? moment(date).format('YYYY-MM-DD') : '';
              setSelectedStartDate(date);
              setProperty({
                ...property,
                startDate: {
                  text: formateDate,
                  error: formateDate ? '' : property?.startDate?.error,
                },
              });
            }}
            dateProps={{
              minimumDate: new Date(),
              ...(property.closingDate.text && {
                maximumDate: new Date(property.closingDate.text),
              }),
            }}
            headingText={t('common:start_date')}
            customHeadingStyle={[
              Fonts.poppinMed18,
              {color: Colors.black_232C28},
            ]}
            selectDate={property?.startDate?.text}
            leftIcon={false}
            rightIcon={true}
            rightIconName="calendar"
            customBackgroundStyle={[
              {
                backgroundColor: Colors.light_grayF4F4F4,
                borderWidth: 2,
                borderColor: property?.startDate?.error
                  ? Colors.red
                  : Colors.gray_C9C9C9,
              },
            ]}>
            <TextMedium
              text={t('common:optional')}
              textStyle={[
                Fonts.poppinReg16,
                Layout.textTransfromNone,
                Layout.tinyLMargin,
                {color: Colors.dark_gray_676C6A},
              ]}
            />
          </CustomDatePicker>
          {property?.startDate?.error && (
            <TextRegular
              text={property?.startDate?.error}
              textStyle={[
                Layout.textTransfromNone,
                {color: Colors.red, marginLeft: sHight(1)},
              ]}
            />
          )}
        </View>
        {/* ========== closing date ================= */}
        <View style={[Gutters.tinyVMargin]}>
          <CustomDatePicker
            isShowCross={true}
            setSelectedDate={date => {
              const formateDate = date ? moment(date).format('YYYY-MM-DD') : '';
              setSelectedEndDate(date);
              setProperty({
                ...property,
                closingDate: {
                  text: formateDate,
                  error: formateDate ? '' : property?.startDate?.error,
                },
              });
            }}
            dateProps={{
              minimumDate: property?.startDate?.text
                ? new Date(property?.startDate?.text)
                : new Date(),
            }}
            headingText={t('common:closing_date')}
            customHeadingStyle={[
              Fonts.poppinMed18,
              {color: Colors.black_232C28, textTransform: 'capitalize'},
            ]}
            selectDate={property?.closingDate?.text}
            leftIcon={false}
            rightIcon={true}
            rightIconName="calendar"
            customBackgroundStyle={[
              {
                backgroundColor: Colors.light_grayF4F4F4,
                borderWidth: 2,
                borderColor: property?.closingDate?.error
                  ? Colors.red
                  : Colors.gray_C9C9C9,
              },
            ]}>
            <TextMedium
              text={t('common:optional')}
              textStyle={[
                Fonts.poppinReg16,
                Layout.textTransfromNone,
                Layout.tinyLMargin,
                {color: Colors.dark_gray_676C6A},
              ]}
            />
          </CustomDatePicker>

          {property?.closingDate?.error && (
            <TextRegular
              text={property?.closingDate?.error}
              textStyle={[
                Layout.textTransfromNone,
                {color: Colors.red, marginLeft: sHight(1)},
              ]}
            />
          )}
        </View>
        {/* ========== closing time ================= */}
        <View style={[Gutters.tinyTMargin]}>
          <CustomDatePicker
            isShowCross={true}
            mode="time"
            placeholderText="--:--,--"
            setSelectedDate={time => {
              setTimeFormate(time);
              setProperty({
                ...property,
                closingTime: {
                  text: time,
                  error: time ? '' : property.closingTime.error,
                },
              });
            }}
            selectDate={
              property?.closingTime?.text ? property?.closingTime?.text : ''
            }
            placeHolderStyle={[{textTransform: 'uppercase'}]}
            headingText={t('common:closing_time')}
            customHeadingStyle={[
              Fonts.poppinMed18,
              {color: Colors.black_232C28, textTransform: 'capitalize'},
            ]}
            leftIcon={false}
            rightIcon={true}
            rightIconName="clock_"
            customBackgroundStyle={[
              {
                borderWidth: 1,
                borderColor: property?.closingTime?.error
                  ? Colors.red
                  : Colors.gray_C9C9C9,

                backgroundColor: Colors.gray_F0F0F0,
              },
            ]}>
            <TextMedium
              text={t('common:optional')}
              textStyle={[
                Fonts.poppinReg16,
                Layout.textTransfromNone,
                Layout.tinyLMargin,
                {color: Colors.dark_gray_676C6A},
              ]}
            />
          </CustomDatePicker>

          {property?.closingTime?.error && (
            <TextRegular
              text={property?.closingTime?.error}
              textStyle={[
                Layout.textTransfromNone,
                {color: Colors.red, marginLeft: sHight(1)},
              ]}
            />
          )}
        </View>

        <View
          style={[
            Gutters.smallVMargin,
            i18next.language === 'en' ? Layout.row : Layout.rowReverse,
            Layout.alignItemsCenter,
            Layout.justifyContentBetween,
          ]}>
          <TextMedium
            text={t('common:show_my_phone_number_in_the_ads')}
            textStyle={[
              Fonts.poppinMed16,
              Layout.textTransfromNone,
              {color: Colors.black_232C28},
            ]}
          />
          <CustomSwitch
            selected={property?.showPhone}
            setSelected={(v: boolean) =>
              setProperty({...property, showPhone: v})
            }
          />
        </View>
        <View style={[Gutters.smallVMargin, Layout.overflow]}>
          {user_permissions?.is_allowed == true || isEdit ? (
            <CustomButton
              onPress={
                isUploading.current
                  ? () => {
                      // setTimeout(() => {
                      //   isUploading.current = false;
                      //   setReload(reLaod + 1);
                      // }, 2000);
                    }
                  : submitPropertyForm
              }
              btnStyle={[
                Gutters.tinyPadding,
                {backgroundColor: Colors.primary},
              ]}
              text={isEdit ? t('common:update') : t('common:submit')}
              textStyle={[Fonts.poppinSemiBold24, {color: Colors.white}]}
            />
          ) : null}
          {isEdit && (
            <View
              style={[
                Gutters.xTinyVMargin,
                Layout.justifyContentBetween,
                {
                  flexDirection: 'column',
                },
              ]}>
              <CustomButton
                onPress={() => dispatch(setSellingItemForSale(true))}
                btnStyle={[{backgroundColor: Colors.red_C31E1E}]}
                text="Mark as Sold"
                textStyle={[Fonts.poppinSemiBold24, {color: Colors.white}]}
              />
              <CustomButton
                onPress={() => dispatch(setDeleteItemForSale(true))}
                btnStyle={[
                  Gutters.xTinyTMargin,
                  {backgroundColor: Colors.dark_gray_676C6A},
                ]}
                text={t('common:delete')}
                textStyle={[Fonts.poppinSemiBold24, {color: Colors.white}]}
              />
              <CustomButton
                onPress={() => dispatch(setWithDrawItemForSale(true))}
                btnStyle={[
                  Gutters.xTinyTMargin,
                  {backgroundColor: Colors.dark_gray_676C6A},
                ]}
                text={
                  route?.params?.edit_single_listing_data?.status == 'active'
                    ? 'Withdraw Listing'
                    : 'Re List Item'
                }
                textStyle={[Fonts.poppinSemiBold24, {color: Colors.white}]}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
      <Modal
        isVisible={
          // shippingMethods ||
          deleteItemForSale ||
          updateItemForSale ||
          withDrawItemForSale ||
          sellingItemForSale ||
          (isShowUserPermissionDialog && !isEdit)
        }>
        <View style={[Layout.fill, Layout.center]}>
          {/* {shippingMethods && shippingMethodsCheck()} */}

          {isShowUserPermissionDialog && !isEdit && userCheckPermissions()}
          {deleteItemForSale && deleteItemForSaleProductPopUp()}
          {withDrawItemForSale && withDrawItemForSalePopUp()}
          {sellingItemForSale && sellItemForSalePopUp()}
          {updateItemForSale && updateItemForSalePopUp()}
        </View>
      </Modal>
      <CustomBottomSheet
        visible={showBottomSheet}
        setShowBottomSheet={() => {
          setShowBottomSheet(false);
          isUploading.current = false;
          setReload(reLaod + 1);
        }}
        height={'60%'}
        icon={false}>
        <View
          style={[
            Layout.alignItemsCenter,
            Gutters.largeTPadding,
            Layout.selfCenter,
            {backgroundColor: Colors.white},
          ]}>
          <Images.svg.markRight.default />
          <TextSemiBold
            text={
              showBottomSheetText
                ? showBottomSheetText
                : t('common:your_ad_has_been_uploaded_successfully')
            }
            textStyle={[
              Fonts.poppinSemiBold24,
              Gutters.smallVMargin,
              Layout.textAlign,
              {color: Colors.black_232C28},
            ]}
          />
          <View style={[Gutters.smallTMargin, {width: sWidth(100) - 40}]}>
            <CustomButton
              text={t('common:ok')}
              btnStyle={[{backgroundColor: Colors.primary}]}
              textStyle={[{color: Colors.white}]}
              onPress={() => {
                setShowBottomSheet(false);

                isUploading.current = false;
                setReload(reLaod + 1);
                dispatch(currentStack(null));
                const popAction = StackActions.pop(5);
                navigation.dispatch(popAction);
                navigation.navigate('HOME' as never);
              }}
            />
          </View>
        </View>
      </CustomBottomSheet>
      <CustomLoading
        isLoading={
          isLoading ||
          imageUpload ||
          updateLoading ||
          statusLoading ||
          deleteLoading ||
          soldLoading
        }
      />
    </View>
  );
};

export default PropertyForm;
