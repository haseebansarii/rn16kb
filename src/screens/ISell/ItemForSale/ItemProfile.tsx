import i18next from 'i18next';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import {Modal} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {TakePictures} from '.';
import {listTypeConst} from './ListType';
import {
  CustomBottomSheet,
  CustomButton,
  CustomCheckBox,
  CustomDatePicker,
  CustomDropDown,
  CustomGooglePlaces,
  CustomInput,
  CustomLoading,
  CustomSwitch,
  TextBold,
  TextMedium,
  TextRegular,
  TextSemiBold,
} from '../../../components';
import {useTheme} from '../../../hooks';
import {useLazyGetCatagoriesQuery} from '../../../services/catagories/catagory';
import {
  useDeleteItemForSaleMutation,
  useItemForSaleMutation,
} from '../../../services/submitForms/forms';
import {setSubCatagory} from '../../../store/catagories/Catagories';
import {RootState} from '../../../store/store';
import {sHight, sWidth} from '../../../utils/ScreenDimentions';
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
import {toastDangerMessage} from '../../../utils/helpers';
import {currentStack} from '../../../store/stack/StackSlice';
import {
  useSingleListingQuery,
  useUpdateListingMutation,
  useMarkListingAsSoldMutation,
} from '../../../services/modules/Listings/getSingleListing';
import {StackActions, useIsFocused} from '@react-navigation/native';
import {useUploadImagesMutation} from '../../../services/submitForms/imageUploadForm';
import {
  dropdownCondition,
  dropdownPaymentOption,
  shipping_methods,
} from '../../../utils/dummyData';
import {axiosUploadImagesMutation} from '../../../services/submitForms/imageUploadFormAxios';
import {useLazyGetUserCheckPermissionsQuery} from '../../../services/accountSettings/userProfileService';
import {FE_URL} from '../../../config';
import {RequiredFields} from './ItemTypes';

type Props = {
  selected: string;
  navigation: any;
  isEdit?: boolean;
  setSelected: CallableFunction;
  id?: string;
  scrollEnabled?: boolean;
  setScrollEnabled?: CallableFunction;
  setScrollEnabledDate?: CallableFunction;
};

const ItemProfile = ({
  selected,
  setSelected,
  id,
  isEdit,
  edit_single_listing_data,
  withdrawn,
  navigation,
  scrollEnabled,
  setScrollEnabled,
  setScrollEnabledDate,
}: any) => {
  const {Colors, Images, Fonts, Gutters, Layout} = useTheme();
  const categories = useSelector(
    (state): RootState => state.catagories?.categories,
  );
  const subCategories = useSelector(
    (state): RootState => state.catagories?.subCategories,
  );

  const user_permissions = useSelector(
    (state): RootState => state.auth?.user_permissions,
  );

  const dispatch = useDispatch();

  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showBottomSheetText, setShowBottomSheetText] = useState('');
  const [loading, setLoading] = useState(false);
  const isUploading = useRef(false);
  const [reLaod, setReload] = useState(0);
  const [location, setLocation] = useState<any>(null);
  const [selectedShippingDetail, setSelectedShippingDetail] = useState([]);
  const [allShippingDetail, setAllSelectedShippingDetail] =
    useState(shipping_methods);

  const isValidTimeFormat = time => {
    // Regular expression for HH:mm format (24-hour clock)
    const timeRegex = /^[0-2][0-9]:[0-5][0-9]$/;

    // Check if the time string matches the regex
    return typeof time === 'string' && timeRegex.test(time);
  };
  const findFlagById = (array, value) => {
    return array.find(item => item.value === value);
  };
  const findIndexByValue = (array, value) => {
    return array.findIndex(item => item.value === value);
  };
  const addItem = (array, newItem) => {
    return [...array, newItem];
  };
  const filterItemByValue = (array, value) => {
    return array.filter(item => item.value !== value);
  };
  function getCategoryNameById(id: string) {
    const item = categories.find((element: any) => element._id === id);
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

  const concatenateDateTime = (date, time) => {
    let r = null;
    console.log('>>>date 99 ', date);
    console.log('>>>time 99 ', time);

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

  const [data, setData] = useState({
    title: isEdit ? edit_single_listing_data?.title : null,
    user: isEdit ? edit_single_listing_data?.user : null,
    category: isEdit ? edit_single_listing_data?.category : null,
    sub_category: isEdit ? edit_single_listing_data?.sub_category : null,
    make: isEdit ? edit_single_listing_data?.make : null,
    model: isEdit ? edit_single_listing_data?.model : null,
    type: selected,
    images: isEdit ? edit_single_listing_data?.images : null,
    condition: isEdit ? edit_single_listing_data?.condition : null,
    fixed_price_offer: isEdit
      ? Number(edit_single_listing_data?.fixed_price_offer)
      : null,
    start_price: isEdit ? edit_single_listing_data?.start_price : null,
    reserve_price: isEdit ? edit_single_listing_data?.reserve_price : null,
    buy_now_price: isEdit ? edit_single_listing_data?.buy_now_price : null,
    description: isEdit ? edit_single_listing_data?.description : null,
    pickup_available: isEdit
      ? edit_single_listing_data?.pickup_available
      : false,
    pickup_location: isEdit ? edit_single_listing_data?.pickup_location : null,
    pickup_location_coordinates: isEdit
      ? edit_single_listing_data?.pickup_location_coordinates
      : {
          lat: null,
          lng: null,
        },
    payment_option: isEdit ? edit_single_listing_data?.payment_option : 'other',
    start_date: isEdit ? edit_single_listing_data?.start_date : null,
    end_date: isEdit ? edit_single_listing_data?.end_date : null,
    end_time: isEdit ? handleEndTime(edit_single_listing_data?.end_time) : null, //Invalid date
    shipping: null,
    show_phone: isEdit ? edit_single_listing_data?.show_phone : false,
    make_an_offer: isEdit ? edit_single_listing_data?.make_an_offer : false,
    listing_type: 'general',
  });
  const [addressMatch, setAddressMatch] = useState(
    isEdit ? edit_single_listing_data?.pickup_location : null,
  );

  const [selectedStartDate, setSelectedStartDate] = useState(
    isEdit ? edit_single_listing_data?.start_date : '',
  );
  const [selectedEndDate, setSelectedEndDate] = useState(
    isEdit ? edit_single_listing_data?.end_date : '',
  );
  const [isShowUserPermissionDialog, setIsShowUserPermissionDialog] = useState(
    user_permissions?.is_allowed == false ? true : false,
  );

  const [timeFormate, setTimeFormate] = useState('');

  const [error, setError] = useState({
    field: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<RequiredFields>>({});

  const [getCatagories] = useLazyGetCatagoriesQuery();
  const [getUserPermissions] = useLazyGetUserCheckPermissionsQuery();

  const [uploadImg, {isLoading: uploadImageLoading}] =
    useUploadImagesMutation();

  const [ItemForSaleApi, {isLoading}] = useItemForSaleMutation();
  const [deleteProduct, {isLoading: deleteLoading}] =
    useDeleteItemForSaleMutation();
  const getSingleListing = useSingleListingQuery(id, {skip: !isEdit});
  const [updateProduct] = useUpdateListingMutation();
  const [updateListingSold] = useMarkListingAsSoldMutation();
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

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      getUserPermissions('?feature=isell&key=other');
    }
  }, [isFocused]);

  useEffect(() => {
    setIsShowUserPermissionDialog(
      user_permissions?.is_allowed == false ? true : false,
    );
  }, [user_permissions]);
  useEffect(() => {
    // if (user_data?.shipping_methods.length > 0) {
    getCatagories('&type=general').then((res: any) => {
      if (res?.data?.categories) {
        res?.data?.categories?.map(item => {
          if (data?.category) {
            if (item._id === data?.category) {
              dispatch(setSubCatagory(item.sub_categories));
            }
          }
        });
      }
    });
    return () => {};
  }, [data?.category]);

  useEffect(() => {
    if (edit_single_listing_data) {
      setData({
        title: isEdit ? edit_single_listing_data?.title : null,
        user: isEdit ? edit_single_listing_data?.user : null,
        category: isEdit ? edit_single_listing_data?.category : null,
        sub_category: isEdit ? edit_single_listing_data?.sub_category : null,
        make: isEdit ? edit_single_listing_data?.make : null,
        model: isEdit ? edit_single_listing_data?.model : null,
        type: selected,
        images: isEdit ? edit_single_listing_data?.images : null,
        condition: isEdit ? edit_single_listing_data?.condition : null,
        fixed_price_offer: isEdit
          ? edit_single_listing_data?.fixed_price_offer
          : null,
        start_price: isEdit ? edit_single_listing_data?.start_price : null,
        reserve_price: isEdit ? edit_single_listing_data?.reserve_price : null,
        buy_now_price: isEdit ? edit_single_listing_data?.buy_now_price : null,
        description: isEdit ? edit_single_listing_data?.description : null,
        pickup_available: isEdit
          ? edit_single_listing_data?.pickup_available
          : false,
        pickup_location: isEdit
          ? edit_single_listing_data?.pickup_location
          : null,
        pickup_location_coordinates: isEdit
          ? edit_single_listing_data?.pickup_location_coordinates
          : {
              lat: null,
              lng: null,
            },
        payment_option: isEdit
          ? edit_single_listing_data?.payment_option
          : null,
        start_date: isEdit ? edit_single_listing_data?.start_date : null,
        end_date: isEdit ? edit_single_listing_data?.end_date : null,
        end_time: isEdit
          ? handleEndTime(edit_single_listing_data?.end_time)
          : null,
        shipping: null,
        show_phone: isEdit ? edit_single_listing_data?.show_phone : false,
        make_an_offer: isEdit ? edit_single_listing_data?.make_an_offer : false,
        listing_type: 'general',
      });
      setSelectedShippingDetail(
        isEdit ? edit_single_listing_data?.shipping_methods : [],
      );
      setAllSelectedShippingDetail(shipping_methods);
      setSelectedStartDate(isEdit ? edit_single_listing_data?.start_date : '');
      setSelectedEndDate(isEdit ? edit_single_listing_data?.end_date : '');
      setTimeFormate(
        isEdit ? handleEndTime(edit_single_listing_data?.end_time) : '',
      );
    }
    return () => {};
  }, [edit_single_listing_data, selected]);

  // set and reset errors when changing method of sale (enquire | auction | fixed_price)
  useEffect(() => {
    if (Object.keys(errors).length) {
      if (selected === listTypeConst.enquire) {
        setErrors(prev => {
          const updated = {...prev};
          delete updated.fixedPriceOffer;
          delete updated.startPrice;
          delete updated.startDate;
          delete updated.endDate;
          delete updated.closingTime;
          return updated;
        });
      }

      if (selected === listTypeConst.fixed_price) {
        setErrors(prev => ({
          ...prev,
          fixedPriceOffer: 'Price is required',
        }));
        setErrors(prev => {
          const updated = {...prev};
          delete updated.startPrice;
          delete updated.startDate;
          delete updated.endDate;
          delete updated.closingTime;
          return updated;
        });
      }

      if (selected === listTypeConst.auction) {
        setErrors(prev => ({
          ...prev,
          startPrice: 'Start price is required',
          startDate: 'Start Date is required',
          endDate: 'End Date is required',
          closingTime: 'End time is required',
        }));

        setErrors(prev => {
          const updated = {...prev};
          return updated;
        });
      }
    }
  }, [selected, setSelected]);

  const validationsMessages = () => {
    let hasError = false;
    const newErrors: Partial<Record<string, string>> = {};

    const basicValidations = [
      {
        key: 'images',
        value: data?.images?.length,
        message: 'Select up to 20 photos.',
      },
      {
        key: 'title',
        value: data?.title,
        message: 'Please provide title',
      },
      {
        key: 'category',
        value: data?.category,
        message: 'Please select category',
      },
      {
        key: 'subCategory',
        value: data?.sub_category,
        message: 'Please select sub-category',
      },
      {
        key: 'description',
        value: data?.description,
        message: 'Description is required',
      },
    ];

    basicValidations.forEach(({key, value, message}) => {
      if (!value) {
        newErrors[key] = message;
        hasError = true;
      }
    });

    // Complex validations
    // fixed price offers required fields
    if (
      selected === listTypeConst.fixed_price &&
      data?.fixed_price_offer == null
    ) {
      newErrors.fixedPriceOffer = 'Price is required';
      hasError = true;
    }

    // auction required fields
    if (selected === listTypeConst.auction) {
      if (data?.start_price == null) {
        newErrors.startPrice = 'Start Price is required';
        hasError = true;
      }

      if (data?.start_date == null) {
        newErrors.startDate = 'Start Date is required';
        hasError = true;
      }

      if (data?.end_date == null) {
        newErrors.endDate = 'End Date is required';
        hasError = true;
      }

      if (data?.end_time == null) {
        newErrors.closingTime = 'End Time is required';
        hasError = true;
      }
    }

    // pick up location validation
    if (
      (data?.pickup_available ||
        selectedShippingDetail?.some(option => option.value === 'pickup')) &&
      !data?.pickup_location
    ) {
      newErrors.pickUpLocation = 'Pickup location is required';
      hasError = true;
    }

    if (
      (data?.pickup_available ||
        selectedShippingDetail?.some(option => option.value === 'pickup')) &&
      data?.pickup_location &&
      data?.pickup_location !== addressMatch
    ) {
      newErrors.pickUpLocation = 'Please select address from dropdown';
      hasError = true;
    }

    setErrors(prev => ({...prev, ...newErrors}));

    if (hasError) {
      toastDangerMessage('Please fill all mandatory fields');
      setLoading(false);
      isUploading.current = false;

      setReload(reLaod + 1);
    }

    return hasError;
  };

  const submitItemForSaleProduct = async () => {
    isUploading.current = true;
    setLoading(true);

    const formdata = new FormData();
    if (validationsMessages()) {
      setLoading(false);
      isUploading.current = false;
      setReload(reLaod + 1);
    } else {
      setError({
        field: '',
        message: '',
      });
      if (!!isEdit) {
        const filteredArrtoUpload = data?.images?.filter(item =>
          item.hasOwnProperty('uri'),
        );
        if (filteredArrtoUpload?.length > 0) {
          const filteredArrtoUploadAlreadID = data?.images?.filter(
            item => !item.hasOwnProperty('uri'),
          );
          filteredArrtoUpload?.forEach(item => formdata.append('files', item));
          // return console.log('started image upload in updating');
          // dispatch(imageUploading(true));
          axiosUploadImagesMutation(formdata)
            .then((res: any) => {
              console.log('image is uploading 66 ', res);

              if (res?.data?.document) {
                console.log('images uploaded successfully', res?.data);
                let time24Hour = timeFormate
                  ? moment(timeFormate).format('HH:mm')
                  : '';
                time24Hour = isValidTimeFormat(time24Hour)
                  ? time24Hour
                  : data?.end_time;
                let body = {
                  ...data,
                  type: selected,
                  images: [
                    ...filteredArrtoUploadAlreadID,
                    ...res?.data?.document,
                  ],
                  pickup_location_coordinates: !data?.pickup_available
                    ? data?.pickup_location_coordinates
                    : location
                    ? location
                    : data?.pickup_location_coordinates,
                  end_time: time24Hour,
                  end_date: concatenateDateTime(selectedEndDate, time24Hour),
                  // status: 'active',
                  status: edit_single_listing_data?.status,
                  shipping_methods: selectedShippingDetail,
                };

                console.log('test alpha 44 body ', body);
                updateProduct({id: id, body: body})
                  .then((res: any) => {
                    console.log('res updateProduct 66 ', res);
                    setLoading(false);
                    // if (res?.data?.message == 'Item updated successfully') {
                    if (res?.data?.message) {
                      setLoading(false);
                      setShowBottomSheetText(res?.data?.message);
                      if (Platform.OS == 'ios') {
                        setTimeout(() => {
                          setShowBottomSheet(true);
                        }, 700);
                      } else {
                        console.log('>>> test 11 ');

                        setShowBottomSheet(true);
                      }
                      // setTimeout(() => {
                      //   setShowBottomSheet(false);
                      //   dispatch(currentStack(null));
                      //   navigation.reset({
                      //     index: 0,
                      //     routes: [{name: 'HomeContainer'}],
                      //   });
                      // }, 5000);
                    } else {
                      console.log('something went wrong');

                      isUploading.current = false;
                      setLoading(false);
                      setReload(reLaod + 1);
                    }
                  })
                  .catch(() => {
                    setLoading(false);
                    isUploading.current = false;
                    setReload(reLaod + 1);
                  });
              } else {
                setLoading(false);
                isUploading.current = false;
                setReload(reLaod + 1);
              }
            })
            .catch(() => {
              setLoading(false);
              isUploading.current = false;
              setReload(reLaod + 1);
            });
        } else {
          let time24Hour = timeFormate
            ? moment(timeFormate).format('HH:mm')
            : '';

          time24Hour = isValidTimeFormat(time24Hour)
            ? time24Hour
            : data?.end_time;
          let body = {
            ...data,
            type: selected,
            pickup_location_coordinates: !data?.pickup_available
              ? data?.pickup_location_coordinates
              : location
              ? location
              : data?.pickup_location_coordinates,

            end_time: time24Hour,
            end_date: concatenateDateTime(selectedEndDate, time24Hour),
            // status: 'active',
            status: edit_single_listing_data?.status,

            shipping_methods: selectedShippingDetail,
          };

          console.log('test alpha 55 body ', body);
          updateProduct({id: id, body: body})
            .then((res: any) => {
              console.log('test alpha 55   11 ');
              console.log(res);
              setLoading(false);
              // if (res?.data?.message == 'Item updated successfully') {
              if (res?.data?.message) {
                console.log('>>> test 22 a ');

                console.log('test alpha 55   33 ');
                setLoading(false);
                setShowBottomSheetText(res?.data?.message);
                if (Platform.OS == 'ios') {
                  setTimeout(() => {
                    setShowBottomSheet(true);
                  }, 700);
                } else {
                  console.log('>>> test 22 ');
                  setShowBottomSheet(true);
                }
                // setTimeout(() => {
                //   setShowBottomSheet(false);
                //   dispatch(currentStack(null));
                //   navigation.reset({
                //     index: 0,
                //     routes: [{name: 'HomeContainer'}],
                //   });
                // }, 5000);
              } else {
                console.log('test alpha 55   22 ');
                console.log('something went wrong 234 ');
                isUploading.current = false;
                setLoading(false);
                setReload(reLaod + 1);
              }
            })
            .catch(() => {
              console.log('test alpha 55   55 ');
              console.log('something went wrong 235 ');
              isUploading.current = false;
              setLoading(false);
              setReload(reLaod + 1);
            });
        }
      } else {
        // return console.log('second side');
        setLoading(true);
        data?.images?.forEach(item => formdata.append('files', item));
        console.log('started image upload');
        // dispatch(imageUploading(true));
        axiosUploadImagesMutation(formdata)
          .then((res: any) => {
            console.log('image is uploading 88 ', res);
            // setTimeout(() => {
            //   setLoading(false);
            //   isUploading.current = false;
            //   setReload(reLaod + 1);
            // }, 2000);
            if (res?.data?.document) {
              console.log('images uploaded successfully', res?.data?.document);
              let time24Hour = timeFormate
                ? moment(timeFormate).format('HH:mm')
                : '';

              time24Hour = isValidTimeFormat(time24Hour)
                ? time24Hour
                : data?.end_time;

              let body = {
                ...data,
                type: selected,
                images: res?.data?.document,
                pickup_location_coordinates: !data?.pickup_available
                  ? data?.pickup_location_coordinates
                  : location
                  ? location
                  : data?.pickup_location_coordinates,

                end_time: time24Hour,
                end_date: concatenateDateTime(selectedEndDate, time24Hour),
                shipping_methods: selectedShippingDetail,
              };

              console.log('test alpha 11');
              ItemForSaleApi(body).then((res: any) => {
                // if (res?.data?.message == 'Listing created successfully') {
                if (res?.data?.message) {
                  setLoading(false);
                  setShowBottomSheetText(res?.data?.message);
                  if (Platform.OS == 'ios') {
                    setTimeout(() => {
                      setShowBottomSheet(true);
                    }, 700);
                  } else {
                    console.log('>>> test 33 ');
                    setShowBottomSheet(true);
                  }
                  // setTimeout(() => {
                  //   dispatch(currentStack(null));
                  //   navigation.reset({
                  //     index: 0,
                  //     routes: [{name: 'HomeContainer'}],
                  //   });
                  //   setShowBottomSheet(false);
                  // }, 2000);
                } else {
                  isUploading.current = false;
                  console.log('something went wrong');
                  setLoading(false);
                  setReload(reLaod + 1);
                }
              });
            } else {
              isUploading.current = false;
              setLoading(false);
              setReload(reLaod + 1);
            }
          })
          .catch(() => {
            isUploading.current = false;
            setLoading(false);
            setReload(reLaod + 1);
          });
      }
    }
  };

  const DeleteProduct = () => {
    try {
      deleteProduct(id).then(res => {
        if (res.data.message) {
          navigation.goBack();
        }
      });
    } catch (error) {}
  };

  const withdrawList = () => {
    setLoading(true);

    if (withdrawn == true) {
      let time24Hour = timeFormate ? moment(timeFormate).format('HH:mm') : '';

      time24Hour = isValidTimeFormat(time24Hour) ? time24Hour : data?.end_time;

      let tempBody = {
        id: id,
        body: {
          ...data,
          type: selected,
          pickup_location_coordinates: !data?.pickup_available
            ? data?.pickup_location_coordinates
            : location
            ? location
            : data?.pickup_location_coordinates,
          status: 'withdrawn',

          end_time: time24Hour,
          end_date: concatenateDateTime(selectedEndDate, time24Hour),

          shipping_methods: selectedShippingDetail,
        },
      };

      console.log('test alpha 22');
      updateProduct(tempBody).then((res: any) => {
        setLoading(false);
        // if (res?.data?.message == 'Item updated successfully') {
        if (res?.data?.message) {
          setLoading(false);
          setShowBottomSheetText(res?.data?.message);
          if (Platform.OS == 'ios') {
            setTimeout(() => {
              setShowBottomSheet(true);
            }, 700);
          } else {
            console.log('>>> test 44 ');
            setShowBottomSheet(true);
          }
          // setTimeout(() => {
          //   setShowBottomSheet(false);
          //   navigation?.goBack();
          // }, 5000);
        } else {
          console.log('something went wrong');

          isUploading.current = false;
          setLoading(false);
          setReload(reLaod + 1);
        }
      });
    } else {
      let time24Hour = timeFormate ? moment(timeFormate).format('HH:mm') : '';

      time24Hour = isValidTimeFormat(time24Hour) ? time24Hour : data?.end_time;
      let tempBody = {
        id: id,
        body: {
          ...data,
          type: selected,
          pickup_location_coordinates: !data?.pickup_available
            ? data?.pickup_location_coordinates
            : location
            ? location
            : data?.pickup_location_coordinates,

          end_time: time24Hour,
          end_date: concatenateDateTime(selectedEndDate, time24Hour),
          status: 'active',
          shipping_methods: selectedShippingDetail,
        },
      };

      console.log('test alpha 33');
      updateProduct(tempBody).then((res: any) => {
        setLoading(false);
        // setShowBottomSheet(true);
        // if (res?.data?.message == 'Item updated successfully') {
        if (res?.data?.message) {
          setLoading(false);
          setShowBottomSheetText(res?.data?.message);
          if (Platform.OS == 'ios') {
            setTimeout(() => {
              setShowBottomSheet(true);
            }, 700);
          } else {
            console.log('>>> test 55 ');
            setShowBottomSheet(true);
          }
          // setTimeout(() => {
          //   setShowBottomSheet(false);
          //   navigation?.goBack();
          // }, 5000);
        } else {
          console.log('something went wrong');

          isUploading.current = false;
          setLoading(false);
          setReload(reLaod + 1);
        }
      });
    }
  };

  const markItemAsSold = () => {
    setLoading(true);
    updateListingSold({id}).then((res: any) => {
      setLoading(false);

      if (res?.data) {
        setLoading(false);
        dispatch(currentStack(null));
        const popAction = StackActions.pop(4);
        navigation.dispatch(popAction);
        navigation.navigate('HomeContainer' as never);
      } else {
        setLoading(false);
      }
    });
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
              DeleteProduct();
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
          {withdrawn
            ? 'Are you sure you want to Withdraw List'
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
            onPress={() => {
              console.log('found');
              withdrawList();
              dispatch(setWithDrawItemForSale(false));
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
              dispatch(setUpdateItemForSale(false)), submitUpdateItemForSale();
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

  const handleSettingData = (field: any, value: any) => {
    if (
      field == 'pickup_location_coordinates' &&
      !!value?.lng &&
      !!value?.lat
    ) {
      setLocation(value);
    } else {
      field != 'pickup_location_coordinates' &&
        setData({...data, [field]: value});
      console.log('>>> CAlled', field, value);
    }

    if (!!error?.field || !!error?.message) {
      setError({
        field: '',
        message: '',
      });
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={Keyboard.dismiss}
        accessible={false}
        activeOpacity={1}>
        <View>
          <View style={[Layout.row]}>
            <Text
              style={[Fonts.poppinSemiBold24, {color: Colors.black_232C28}]}>
              {t('common:photos')}
            </Text>
            <Text
              style={[
                Fonts.poppinMed18,
                Gutters.smallLMargin,
                {color: Colors.black_232C28},
              ]}>
              {data?.images?.length || '0'}/20
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
        <TakePictures
          selected={data?.images}
          setSelectedImage={(arr: any) => {
            handleSettingData('images', arr);
            setErrors(prev => {
              const updated = {...prev};
              delete updated.images;
              return updated;
            });
          }}
          style={{
            borderColor: errors.images ? Colors.red : Colors.gray_C9C9C9,
          }}
        />

        {errors.images && (
          <TextRegular
            text={errors.images}
            textStyle={[
              Layout.textTransfromNone,
              {color: Colors.red, marginLeft: sHight(1)},
            ]}
          />
        )}

        <TextSemiBold
          text={t('common:required')}
          textStyle={[
            Fonts.poppinSemiBold24,
            Gutters.smallTMargin,
            {color: Colors.black_232C28},
          ]}
        />

        <TextRegular
          text={t('common:be_as_descriptive_as_possible')}
          textStyle={[
            Fonts.poppinReg18,
            Gutters.tinyBMargin,
            {textTransform: 'none', color: Colors.black_232C28},
          ]}
        />
        <View style={[Layout.wrap, Gutters.tinyTMargin]}>
          <CustomInput
            headingText={t('common:title')}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            inputProps={{
              onChangeText: t => {
                handleSettingData('title', t);
                t &&
                  setErrors(prev => {
                    const updated = {...prev};
                    delete updated.title;
                    return updated;
                  });
              },
              value: data?.title,
              placeholderTextColor: Colors.light_grayF4F4F4,
            }}
            inputStyle={{
              color: Colors.dark_gray_676C6A,
            }}
            backgroundStyle={[
              {
                borderWidth: 1,
                borderColor: errors.title ? Colors.red : Colors.gray_C9C9C9,
                backgroundColor: Colors.light_grayF4F4F4,
              },
            ]}
            placeholder={t('common:email_phone')}
            showPassword={false}>
            <TextMedium text="*" textStyle={[{color: Colors.red_E34040}]} />
          </CustomInput>
          {errors.title && (
            <TextRegular
              text={errors.title}
              textStyle={[
                Layout.textTransfromNone,
                {
                  color: Colors.red,
                  marginLeft: sHight(1),
                },
              ]}
            />
          )}
        </View>
        <View style={[Gutters.tinyTMargin]}>
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
                borderWidth: 1,
                borderColor: errors.category ? Colors.red : Colors.gray_C9C9C9,
              },
            ]}
            value={getCategoryNameById(data?.category)}
            setSelected={t => {
              handleSettingData('category', t);
              t &&
                setErrors(prev => {
                  const updated = {...prev};
                  delete updated.category;
                  return updated;
                });
            }}
            placeholder={t('common:select')}
            headingText={t('common:catagory')}
            itemStyle={[{backgroundColor: Colors.light_grayF4F4F4}]}>
            <TextMedium text="*" textStyle={[{color: Colors.red_E34040}]} />
          </CustomDropDown>

          {errors.category && (
            <TextRegular
              text={errors.category}
              textStyle={[
                Layout.textTransfromNone,
                {
                  color: Colors.red,
                  marginLeft: sHight(1),
                },
              ]}
            />
          )}
        </View>
        <View style={[Gutters.tinyTMargin]}>
          <CustomDropDown
            data={subCategories?.flatMap(item => [
              {key: item?.name, value: item?._id},
            ])}
            selectedTextStyle={{color: Colors.dark_gray_676C6A}}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            customStyle={[
              {
                backgroundColor: Colors.light_grayF4F4F4,
                borderWidth: 1,
                borderColor: errors.subCategory
                  ? Colors.red
                  : Colors.gray_C9C9C9,
              },
            ]}
            value={
              isEdit
                ? getSubCategoryName(data?.category, data?.sub_category)
                : getSubCategoryName(data?.category, data?.sub_category)
            }
            setSelected={t => {
              handleSettingData('sub_category', t);
              t &&
                setErrors(prev => {
                  const updated = {...prev};
                  delete updated.subCategory;
                  return updated;
                });
            }}
            placeholder={t('common:select')}
            headingText={t('common:sub_catagory')}
            itemStyle={[{backgroundColor: Colors.light_grayF4F4F4}]}>
            <TextMedium text="*" textStyle={[{color: Colors.red_E34040}]} />
          </CustomDropDown>
          {errors.subCategory && (
            <TextRegular
              text={errors.subCategory}
              textStyle={[
                Layout.textTransfromNone,
                {
                  color: Colors.red,
                  marginLeft: sHight(1),
                },
              ]}
            />
          )}
        </View>

        <View style={[Layout.wrap, Gutters.tinyTMargin]}>
          <CustomInput
            headingText={t('common:make')}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            inputProps={{
              onChangeText: t => {
                handleSettingData('make', t);
              },
              keyboardType: 'default',
              value: data?.make,
              placeholderTextColor: Colors.light_grayF4F4F4,
            }}
            inputStyle={{
              color: Colors.dark_gray_676C6A,
            }}
            backgroundStyle={[
              {
                borderWidth: 1,
                borderColor: Colors.gray_C9C9C9,
                backgroundColor: Colors.light_grayF4F4F4,
              },
            ]}
            placeholder={t('common:email_phone')}
            showPassword={false}>
            <TextMedium
              text="(optional)"
              textStyle={[
                Fonts.poppinMed16,
                Gutters.littleLMargin,
                {color: Colors.black_232C28},
              ]}
            />
          </CustomInput>
        </View>
        <View style={[Layout.wrap, Gutters.tinyTMargin]}>
          <CustomInput
            headingText={t('common:model')}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            inputProps={{
              onChangeText: t => handleSettingData('model', t),

              value: data?.model,
              placeholderTextColor: Colors.light_grayF4F4F4,
              keyboardType: 'default',
            }}
            inputStyle={{
              color: Colors.dark_gray_676C6A,
            }}
            backgroundStyle={[
              {
                borderWidth: 1,
                borderColor: Colors.gray_C9C9C9,
                backgroundColor: Colors.light_grayF4F4F4,
              },
            ]}
            placeholder={t('common:email_phone')}
            showPassword={false}>
            <TextMedium
              text="(optional)"
              textStyle={[
                Fonts.poppinMed16,
                Gutters.littleLMargin,
                {color: Colors.black_232C28},
              ]}
            />
          </CustomInput>
        </View>
        <View style={[Gutters.tinyTMargin]}>
          <CustomDropDown
            data={dropdownCondition}
            selectedTextStyle={{color: Colors.dark_gray_676C6A}}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            customStyle={[
              {
                backgroundColor: Colors.light_grayF4F4F4,
                borderWidth: 1,
                borderColor: Colors.gray_C9C9C9,
              },
            ]}
            value={
              data?.condition === dropdownCondition[0]?.value
                ? dropdownCondition[0]?.key
                : data?.condition === dropdownCondition[1]?.value
                ? dropdownCondition[1]?.key
                : ''
            }
            setSelected={t => {
              handleSettingData('condition', t);
            }}
            placeholder={t('common:select')}
            headingText={t('common:condition')}
            itemStyle={[{backgroundColor: Colors.light_grayF4F4F4}]}>
            <TextMedium
              text="(optional)"
              textStyle={[
                Fonts.poppinMed16,
                Gutters.littleLMargin,
                {color: Colors.black_232C28},
              ]}
            />
          </CustomDropDown>
        </View>

        {selected === listTypeConst.fixed_price && (
          <View style={[Layout.wrap, Gutters.tinyTMargin]}>
            <CustomInput
              editable={
                !(
                  (edit_single_listing_data?.offers_count > 0 &&
                    edit_single_listing_data?.status != 'expired') ||
                  (edit_single_listing_data?.type === 'auction' &&
                    edit_single_listing_data?.auction_data.bids_count > 0 &&
                    edit_single_listing_data?.reserve_price <=
                      edit_single_listing_data?.auction_data.current_bid)
                )
              }
              headingText={t('common:fixed_price_offer')}
              headingTextStyle={[
                Fonts.poppinMed18,
                {color: Colors.black_232C28},
              ]}
              inputProps={{
                onChangeText: t => {
                  handleSettingData(
                    'fixed_price_offer',
                    selected === listTypeConst.fixed_price && t
                      ? Number(t)
                      : null,
                  );
                  t &&
                    setErrors(prev => {
                      const updated = {...prev};
                      delete updated.fixedPriceOffer;
                      return updated;
                    });
                },

                value: data?.fixed_price_offer
                  ? data?.fixed_price_offer?.toString()
                  : '',
                placeholderTextColor: Colors.light_grayF4F4F4,
                keyboardType: 'number-pad',
              }}
              inputStyle={{
                color: Colors.dark_gray_676C6A,
              }}
              backgroundStyle={[
                {
                  borderWidth: 1,
                  borderColor: errors.fixedPriceOffer
                    ? Colors.red
                    : Colors.gray_C9C9C9,
                  backgroundColor: Colors.light_grayF4F4F4,
                },
              ]}
              placeholder={t('common:email_phone')}
              showPassword={false}>
              <TextMedium text="*" textStyle={[{color: Colors.red_E34040}]} />
            </CustomInput>
            {errors.fixedPriceOffer && (
              <TextRegular
                text={errors.fixedPriceOffer}
                textStyle={[
                  {
                    color: Colors.red,
                    marginLeft: sHight(1),
                    textTransform: 'none',
                  },
                ]}
              />
            )}
          </View>
        )}

        {selected === listTypeConst.auction && (
          <>
            <View style={[Layout.wrap, Gutters.tinyTMargin]}>
              <CustomInput
                editable={
                  !(
                    (edit_single_listing_data?.offers_count > 0 &&
                      edit_single_listing_data?.status != 'expired') ||
                    (edit_single_listing_data?.type === 'auction' &&
                      edit_single_listing_data?.auction_data.bids_count > 0 &&
                      edit_single_listing_data?.reserve_price <=
                        edit_single_listing_data?.auction_data.current_bid)
                  )
                }
                headingText={t('common:start_price')}
                headingTextStyle={[
                  Fonts.poppinMed18,
                  {color: Colors.black_232C28},
                ]}
                inputProps={{
                  onChangeText: t => {
                    handleSettingData('start_price', Number(t));
                    t &&
                      setErrors(prev => {
                        const updated = {...prev};
                        delete updated.startPrice;
                        return updated;
                      });
                  },
                  value: data?.start_price ? data?.start_price?.toString() : '',
                  keyboardType: 'number-pad',
                  placeholderTextColor: Colors.light_grayF4F4F4,
                }}
                inputStyle={{
                  color: Colors.dark_gray_676C6A,
                }}
                backgroundStyle={[
                  {
                    borderWidth: 1,
                    borderColor: errors.startPrice
                      ? Colors.red
                      : Colors.gray_C9C9C9,
                    backgroundColor: Colors.light_grayF4F4F4,
                  },
                ]}
                placeholder={t('common:email_phone')}
                showPassword={false}>
                <TextMedium text="*" textStyle={[{color: Colors.red_E34040}]} />
              </CustomInput>
              {errors.startPrice && (
                <TextRegular
                  text={errors.startPrice}
                  textStyle={[
                    {
                      color: Colors.red,
                      marginLeft: sHight(1),
                      textTransform: 'none',
                    },
                  ]}
                />
              )}
            </View>
            <View style={[Layout.wrap, Gutters.tinyTMargin]}>
              <CustomInput
                editable={
                  !(
                    (edit_single_listing_data?.offers_count > 0 &&
                      edit_single_listing_data?.status != 'expired') ||
                    (edit_single_listing_data?.type === 'auction' &&
                      edit_single_listing_data?.auction_data.bids_count > 0 &&
                      edit_single_listing_data?.reserve_price <=
                        edit_single_listing_data?.auction_data.current_bid)
                  )
                }
                headingText={`${t('common:reserve_price')}`}
                headingTextStyle={[
                  Fonts.poppinMed18,
                  {color: Colors.black_232C28},
                ]}
                inputProps={{
                  onChangeText: t =>
                    handleSettingData('reserve_price', t ? Number(t) : null),
                  value: data?.reserve_price
                    ? data?.reserve_price?.toString()
                    : '',
                  keyboardType: 'number-pad',
                  placeholderTextColor: Colors.light_grayF4F4F4,
                }}
                inputStyle={{
                  color: Colors.dark_gray_676C6A,
                }}
                backgroundStyle={[
                  {
                    borderWidth: 1,
                    borderColor: Colors.gray_C9C9C9,
                    backgroundColor: Colors.light_grayF4F4F4,
                  },
                ]}
                placeholder={t('common:email_phone')}
                showPassword={false}>
                <TextMedium
                  text="(optional)"
                  textStyle={[
                    Fonts.poppinMed16,
                    Gutters.littleLMargin,
                    {color: Colors.black_232C28},
                  ]}
                />
              </CustomInput>
            </View>
            <View style={[Layout.wrap, Gutters.tinyTMargin]}>
              <CustomInput
                editable={
                  !(
                    (edit_single_listing_data?.offers_count > 0 &&
                      edit_single_listing_data?.status != 'expired') ||
                    (edit_single_listing_data?.type === 'auction' &&
                      edit_single_listing_data?.auction_data.bids_count > 0 &&
                      edit_single_listing_data?.reserve_price <=
                        edit_single_listing_data?.auction_data.current_bid)
                  )
                }
                headingText={`${t('common:buy_now_price')}`}
                headingTextStyle={[
                  Fonts.poppinMed18,
                  {color: Colors.black_232C28},
                ]}
                inputProps={{
                  onChangeText: t => {
                    handleSettingData('buy_now_price', Number(t));
                  },
                  value: data?.buy_now_price
                    ? data?.buy_now_price?.toString()
                    : '',
                  keyboardType: 'number-pad',
                  placeholderTextColor: Colors.light_grayF4F4F4,
                }}
                inputStyle={{
                  color: Colors.dark_gray_676C6A,
                }}
                backgroundStyle={[
                  {
                    borderWidth: 1,
                    borderColor: Colors.gray_C9C9C9,
                    backgroundColor: Colors.light_grayF4F4F4,
                  },
                ]}
                placeholder={t('common:email_phone')}
                showPassword={false}>
                <TextMedium
                  text="(optional)"
                  textStyle={[
                    Fonts.poppinMed16,
                    Gutters.littleLMargin,
                    {color: Colors.black_232C28},
                  ]}
                />
              </CustomInput>
            </View>
          </>
        )}

        <View style={[Layout.wrap, Gutters.tinyTMargin]}>
          <CustomInput
            headingText={`${t('common:description')}`}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            inputProps={{
              onChangeText: t => {
                handleSettingData('description', t);
                t &&
                  setErrors(prev => {
                    const updated = {...prev};
                    delete updated.description;
                    return updated;
                  });
              },

              value: data?.description,
              multiline: true,
              placeholderTextColor: Colors.light_grayF4F4F4,
            }}
            backgroundStyle={[
              {
                height: 200,
                borderWidth: 1,
                borderColor: errors.description
                  ? Colors.red
                  : Colors.gray_C9C9C9,
                backgroundColor: Colors.light_grayF4F4F4,
              },
            ]}
            inputStyle={[
              {
                paddingLeft: 0,
                color: Colors.dark_gray_676C6A,
                textAlignVertical: 'top',
              },
            ]}
            placeholder={t('common:email_phone')}
            showPassword={false}>
            <TextMedium text="*" textStyle={[{color: Colors.red_E34040}]} />
          </CustomInput>
          {errors.description && (
            <TextRegular
              text={errors.description}
              textStyle={[
                {
                  color: Colors.red,
                  marginLeft: sHight(1),
                  textTransform: 'none',
                },
              ]}
            />
          )}
        </View>
        <View
          style={[
            i18next.language === 'en' ? Layout.row : Layout.rowReverse,
            Layout.alignItemsCenter,
            Gutters.tinyVMargin,
            Layout.justifyContentBetween,
          ]}>
          <TextMedium
            text="Location of listing"
            textStyle={[
              Fonts.poppinMed18,
              Gutters.tinyBPadding,
              {color: Colors.black_232C28},
            ]}
          />
          <CustomSwitch
            selected={data?.pickup_available}
            setSelected={v => {
              if (v == false) {
                setData({
                  ...data,
                  pickup_location_coordinates: {
                    lat: null,
                    lng: null,
                  },
                  pickup_location: '',
                  pickup_available: v,
                });
                setLocation(null);
              } else {
                handleSettingData('pickup_available', v);
              }
            }}
          />
        </View>

        <CustomGooglePlaces
          value={data?.pickup_location}
          editable={data?.pickup_available}
          setFieldValue={(details: any) => {
            handleSettingData(
              'pickup_location_coordinates',
              details?.geometry?.location,
            );
            setAddressMatch(details?.shortLocation);
          }}
          setPickup={v => {
            handleSettingData('pickup_location', v ? v : '');
          }}
        />
        {errors.pickUpLocation && (
          <TextRegular
            text={errors.pickUpLocation}
            textStyle={[
              {
                color: Colors.red,
                marginLeft: sHight(1),
                textTransform: 'none',
              },
            ]}
          />
        )}

        <View style={[Gutters.tinyVMargin]}>
          <CustomDropDown
            data={dropdownPaymentOption}
            leftIcon={true}
            iconName={'wallet'}
            selectedTextStyle={{color: Colors.dark_gray_676C6A}}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            customStyle={[
              {
                backgroundColor: Colors.light_grayF4F4F4,
                borderWidth: 1,
                borderColor: Colors.gray_C9C9C9,
              },
            ]}
            value={
              data?.payment_option == dropdownPaymentOption[0]?.value
                ? dropdownPaymentOption[0]?.key
                : data?.payment_option == dropdownPaymentOption[1]?.value
                ? dropdownPaymentOption[1]?.key
                : data?.payment_option == dropdownPaymentOption[2]?.value
                ? dropdownPaymentOption[2]?.key
                : ''
            }
            setSelected={t => {
              handleSettingData('payment_option', t);
            }}
            placeholder={t('common:select')}
            headingText={t('common:payment_option')}
            itemStyle={[{backgroundColor: Colors.light_grayF4F4F4}]}
          />
        </View>

        <View>
          <CustomDatePicker
            isShowCross={true}
            setSelectedDate={t => {
              handleSettingData(
                'start_date',
                t ? moment(t).format('YYYY-MM-DD') : '',
              );
              t &&
                setErrors(prev => {
                  const updated = {...prev};
                  delete updated.startDate;
                  return updated;
                });
              setSelectedStartDate(t);
            }}
            dateProps={{
              minimumDate: new Date(),
              ...(selectedEndDate && {
                maximumDate: new Date(selectedEndDate),
              }),
            }}
            selectDate={selectedStartDate}
            headingText={
              selected === listTypeConst.auction
                ? t('common:auction_start_date')
                : t('common:start_date')
            }
            customHeadingStyle={[
              Fonts.poppinMed18,
              {color: Colors.black_232C28},
            ]}
            leftIcon={false}
            rightIcon={true}
            rightIconName="calendar"
            customBackgroundStyle={[
              {
                borderWidth: 1,
                borderColor: errors.startDate ? Colors.red : Colors.gray_C9C9C9,
                backgroundColor: Colors.light_grayF4F4F4,
              },
            ]}>
            {selected !== listTypeConst.auction && (
              <TextMedium
                text="(optional)"
                textStyle={[
                  Fonts.poppinMed16,
                  Gutters.littleLMargin,
                  {color: Colors.black_232C28},
                ]}
              />
            )}
          </CustomDatePicker>
          {errors.startDate && (
            <TextRegular
              text={errors.startDate}
              textStyle={[
                {
                  color: Colors.red,
                  marginLeft: sHight(1),
                  textTransform: 'none',
                },
              ]}
            />
          )}
        </View>
        <View style={[Gutters.tinyTMargin]}>
          <CustomDatePicker
            isShowCross={true}
            setSelectedDate={t => {
              handleSettingData(
                'end_date',
                t ? moment(t).format('YYYY-MM-DD') : '',
              );
              t &&
                setErrors(prev => {
                  const updated = {...prev};
                  delete updated.endDate;
                  return updated;
                });
              setSelectedEndDate(t);
            }}
            dateProps={{
              minimumDate: selectedStartDate
                ? new Date(selectedStartDate)
                : new Date(),
            }}
            selectDate={selectedEndDate}
            headingText={
              selected === listTypeConst.auction
                ? t('common:auction_end_date')
                : t('common:end_date')
            }
            customHeadingStyle={[
              Fonts.poppinMed18,
              {color: Colors.black_232C28},
            ]}
            leftIcon={false}
            rightIcon={true}
            rightIconName="calendar"
            customBackgroundStyle={[
              {
                borderWidth: 1,
                borderColor: errors.endDate ? Colors.red : Colors.gray_C9C9C9,
                backgroundColor: Colors.light_grayF4F4F4,
              },
            ]}>
            {selected !== listTypeConst.auction && (
              <TextMedium
                text="(optional)"
                textStyle={[
                  Fonts.poppinMed16,
                  Gutters.littleLMargin,
                  {color: Colors.black_232C28},
                ]}
              />
            )}
          </CustomDatePicker>
          {errors.endDate && (
            <TextRegular
              text={errors.endDate}
              textStyle={[
                {
                  color: Colors.red,
                  marginLeft: sHight(1),
                  textTransform: 'none',
                },
              ]}
            />
          )}
        </View>
        <View style={[Gutters.tinyTMargin]}>
          <CustomDatePicker
            isShowCross={true}
            mode="time"
            placeholderText={'--:--,--'}
            setSelectedDate={time => {
              let formattedEndTime = time ? moment(time).format('HH:mm') : '';
              handleSettingData('end_time', formattedEndTime);
              time &&
                setErrors(prev => {
                  const updated = {...prev};
                  delete updated.closingTime;
                  return updated;
                });
              setTimeFormate(time);
            }}
            selectDate={
              isEdit
                ? timeFormate
                  ? moment(timeFormate, 'HH:mm').format()
                  : ''
                : timeFormate
            }
            placeHolderStyle={[{textTransform: 'uppercase'}]}
            headingText={`${t('common:closing_time')}`}
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
                borderColor: errors.closingTime
                  ? Colors.red
                  : Colors.gray_C9C9C9,
                backgroundColor: Colors.light_grayF4F4F4,
              },
            ]}>
            {selected !== listTypeConst.auction && (
              <TextMedium
                text="(optional)"
                textStyle={[
                  Fonts.poppinMed16,
                  Gutters.littleLMargin,
                  {color: Colors.black_232C28},
                ]}
              />
            )}
          </CustomDatePicker>
          {errors.closingTime && (
            <TextRegular
              text={errors.closingTime}
              textStyle={[
                {
                  color: Colors.red,
                  marginLeft: sHight(1),
                  textTransform: 'none',
                },
              ]}
            />
          )}
        </View>

        <View
          style={[
            Layout.screenWidth,
            Layout.row,
            Layout.alignItemsCenter,
            Layout.justifyContentBetween,
          ]}></View>
        <View style={[Gutters.mediumTMargin]}>
          <View style={[Layout.row, Layout.alignItemsCenter]}>
            <TextMedium
              text={t('common:shipping')}
              textStyle={[
                Fonts.poppinMed18,
                Gutters.littleBMargin,
                Gutters.littleLMargin,
                {color: Colors.black_232C28},
              ]}
            />
            <TextMedium
              text="(optional)"
              textStyle={[
                Fonts.poppinMed16,
                Gutters.littleLMargin,
                {color: Colors.black_232C28},
              ]}
            />
          </View>

          <FlatList
            keyboardShouldPersistTaps={'always'}
            extraData={selectedShippingDetail}
            data={allShippingDetail}
            renderItem={({item, index}) => {
              let foundObjFlag = findFlagById(
                selectedShippingDetail,
                item.value,
              );
              return (
                <>
                  <View
                    style={[
                      Gutters.tinyTMargin,
                      i18next.language === 'en'
                        ? Layout.row
                        : Layout.rowReverse,
                      Layout.alignItemsCenter,
                    ]}>
                    <CustomCheckBox
                      index={index}
                      customStyle={[{borderColor: Colors.primary}]}
                      selected={foundObjFlag?.value ? true : false}
                      setSelected={value => {
                        if (foundObjFlag?.value) {
                          setSelectedShippingDetail(
                            filterItemByValue(
                              selectedShippingDetail,
                              item.value,
                            ),
                          );

                          if (
                            item.value === 'specify_costs' &&
                            error.field == 'itemForSaleProduct.shippingCost'
                          ) {
                            error.field = '';
                            error.message = '';
                            setError(error);
                          }
                        } else {
                          setSelectedShippingDetail(
                            addItem(selectedShippingDetail, item),
                          );
                          if (
                            item.value === 'specify_costs' &&
                            (item.amount == null || item.amount == '')
                          ) {
                            error.field = 'itemForSaleProduct.shippingCost';
                            error.message = 'Please specify shipping cost';
                            setError(error);
                          } else if (
                            error.field == 'itemForSaleProduct.shipping'
                          ) {
                            error.field = '';
                            error.message = '';
                            setError(error);
                          }
                        }
                      }}
                    />
                    <TextRegular
                      text={item?.option_name}
                      textStyle={[
                        Fonts.poppinReg18,
                        Gutters.tinyLMargin,
                        {
                          color: Colors.black_232C28,
                          width: sWidth(80),
                          marginTop: 3,
                        },
                      ]}
                    />
                  </View>
                  {item.value === 'specify_costs' && (
                    <View style={[Gutters.regularLMargin, Gutters.tinyTMargin]}>
                      <CustomInput
                        headingText={''}
                        headingTextStyle={[
                          Fonts.poppinMed16,
                          {color: Colors.dark_gray_676C6A},
                        ]}
                        placeholder={t('common:enter_shipping_cost_amount')}
                        backgroundStyle={[
                          {
                            borderWidth: 1,
                            // width: '105%',
                            backgroundColor: Colors.light_grayF4F4F4,
                          },
                        ]}
                        inputProps={{
                          keyboardType: 'numeric',
                          placeholderText: Colors.black_232C28,
                          value: foundObjFlag?.amount
                            ? foundObjFlag?.amount?.toString()
                            : item?.amount
                            ? item?.amount
                            : '',
                          onChangeText: t => {
                            let index = findIndexByValue(
                              selectedShippingDetail,
                              item.value,
                            );
                            if (index > -1) {
                              let tempArray = JSON.parse(
                                JSON.stringify(selectedShippingDetail),
                              );
                              tempArray[index].amount = Number(t);

                              if (
                                t &&
                                item.value === 'specify_costs' &&
                                error.field == 'itemForSaleProduct.shippingCost'
                              ) {
                                error.field = '';
                                error.message = '';
                                setError(error);
                              } else if (!t) {
                                error.field = 'itemForSaleProduct.shippingCost';
                                error.message = 'Please specify shipping cost';
                                setError(error);
                              }

                              setSelectedShippingDetail(tempArray);
                            } else {
                              let index = findIndexByValue(
                                allShippingDetail,
                                item.value,
                              );

                              let tempArray = JSON.parse(
                                JSON.stringify(allShippingDetail),
                              );
                              tempArray[index].amount = Number(t);
                              setAllSelectedShippingDetail(tempArray);
                            }
                          },
                        }}
                      />
                      {error.field === 'itemForSaleProduct.shippingCost' && (
                        <TextRegular
                          text={error.message}
                          textStyle={[
                            {
                              color: Colors.red,
                              marginLeft: sHight(1),
                              textTransform: 'none',
                            },
                          ]}
                        />
                      )}
                    </View>
                  )}
                </>
              );
            }}
          />
          <View style={[Layout.row, Gutters.smallTMargin]}>
            <TextRegular
              text={'Find a price:'}
              textStyle={[
                Fonts.poppinReg18,
                {
                  color: Colors.black_232C28,
                  marginTop: 3,
                },
              ]}
            />
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(
                  'https://www.nzpost.co.nz/tools/rate-finder/sending-nz/parcels',
                );
              }}>
              <TextBold
                text={'www.nzpost.co.nz'}
                textStyle={[
                  Fonts.poppinBold18,
                  Gutters.tinyLMargin,
                  // Gutters.tinyTMargin,

                  {
                    color: Colors.black_232C28,
                    // width: sWidth(20),
                    marginTop: 3,
                    textTransform: 'lowercase',
                  },
                ]}
              />
            </TouchableOpacity>
          </View>
          {error.field === 'itemForSaleProduct.shipping' && (
            <TextRegular
              text={error.message}
              textStyle={[
                {
                  color: Colors.red,
                  marginLeft: sHight(1),
                  textTransform: 'none',
                },
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
          <View style={{width: '70%'}}>
            <TextMedium
              text={t('common:show_my_phone_number_in_the_listing')}
              textStyle={[
                Fonts.poppinMed18,
                Layout.textTransfromNone,
                {
                  color: Colors.black_232C28,
                },
              ]}
            />
          </View>
          <CustomSwitch
            selected={data?.show_phone}
            setSelected={v => {
              handleSettingData('show_phone', v);
            }}
          />
        </View>
        <View
          style={[
            i18next.language === 'en' ? Layout.row : Layout.rowReverse,
            Layout.alignItemsCenter,
            Layout.justifyContentBetween,
          ]}>
          <TextMedium
            text={t('common:make_an_offer')}
            textStyle={[
              Fonts.poppinMed18,
              {textTransform: 'none', color: Colors.black_232C28},
            ]}
          />
          <CustomSwitch
            selected={data?.make_an_offer}
            setSelected={v => {
              handleSettingData('make_an_offer', v);
            }}
          />
        </View>
        <View style={[Gutters.mediumVMargin, Layout.overflow]}>
          {user_permissions?.is_allowed == true || isEdit ? (
            <CustomButton
              disabled={isUploading.current}
              onPress={
                isUploading.current === true
                  ? () => {
                      // setTimeout(() => {
                      //   isUploading.current = false;
                      //   setReload(reLaod + 1);
                      // }, 2000);
                    }
                  : submitItemForSaleProduct
              }
              btnStyle={[{backgroundColor: Colors.primary}]}
              text={isEdit ? t('common:update') : t('common:submit')}
              textStyle={[Fonts.poppinBold22, {color: Colors.white}]}
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
                disabled={
                  (edit_single_listing_data?.offers_count > 0 &&
                    edit_single_listing_data?.status != 'expired') ||
                  (edit_single_listing_data?.type === 'auction' &&
                    edit_single_listing_data?.auction_data.bids_count > 0 &&
                    edit_single_listing_data?.reserve_price <=
                      edit_single_listing_data?.auction_data.current_bid)
                }
                onPress={() => dispatch(setDeleteItemForSale(true))}
                btnStyle={[
                  Gutters.xTinyTMargin,
                  {
                    backgroundColor: !(
                      (edit_single_listing_data?.offers_count > 0 &&
                        edit_single_listing_data?.status != 'expired') ||
                      (edit_single_listing_data?.type === 'auction' &&
                        edit_single_listing_data?.auction_data.bids_count > 0 &&
                        edit_single_listing_data?.reserve_price <=
                          edit_single_listing_data?.auction_data.current_bid)
                    )
                      ? Colors.dark_gray_676C6A
                      : Colors.gray_d3d3d3,
                  },
                ]}
                text={t('common:delete')}
                textStyle={[Fonts.poppinSemiBold24, {color: Colors.white}]}
              />
              <CustomButton
                disabled={
                  (edit_single_listing_data?.offers_count > 0 &&
                    edit_single_listing_data?.status != 'expired') ||
                  (edit_single_listing_data?.type === 'auction' &&
                    edit_single_listing_data?.auction_data.bids_count > 0 &&
                    edit_single_listing_data?.reserve_price <=
                      edit_single_listing_data?.auction_data.current_bid)
                }
                onPress={() => {
                  if (validationsMessages()) {
                    setLoading(false);
                    isUploading.current = false;
                    setReload(reLaod + 1);
                  } else {
                    dispatch(setWithDrawItemForSale(true));
                  }
                }}
                btnStyle={[
                  Gutters.xTinyTMargin,
                  {
                    backgroundColor: !(
                      (edit_single_listing_data?.offers_count > 0 &&
                        edit_single_listing_data?.status != 'expired') ||
                      (edit_single_listing_data?.type === 'auction' &&
                        edit_single_listing_data?.auction_data.bids_count > 0 &&
                        edit_single_listing_data?.reserve_price <=
                          edit_single_listing_data?.auction_data.current_bid)
                    )
                      ? Colors.dark_gray_676C6A
                      : Colors.gray_d3d3d3,
                  },
                ]}
                text={withdrawn ? 'Withdraw Listing' : t('common:re_list_item')}
                textStyle={[Fonts.poppinSemiBold24, {color: Colors.white}]}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>

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
                isUploading.current = false;
                setReload(reLaod + 1);
                if (isEdit) {
                  setShowBottomSheet(false);
                  navigation.goBack();
                } else {
                }
                const popAction = StackActions.pop(4);
                navigation.dispatch(popAction);
                navigation.navigate('HomeContainer' as never);

                // dispatch(currentStack(null));
                // navigation.reset({
                //   index: 0,
                //   routes: [{name: 'HomeContainer'}],
                // });
                setShowBottomSheet(false);
              }}
            />
          </View>
        </View>
      </CustomBottomSheet>

      <Modal
        visible={
          // shippingMethods ||
          deleteItemForSale ||
          updateItemForSale ||
          withDrawItemForSale ||
          sellingItemForSale ||
          (isShowUserPermissionDialog && !isEdit)
        }
        backdropColor="rgba(0, 0, 0, 0.5)"
        presentationStyle="overFullScreen">
        <View style={[Layout.fill, Layout.center, Gutters.smallHPadding]}>
          {isShowUserPermissionDialog && !isEdit && userCheckPermissions()}
          {deleteItemForSale && deleteItemForSaleProductPopUp()}
          {withDrawItemForSale && withDrawItemForSalePopUp()}
          {updateItemForSale && updateItemForSalePopUp()}
          {sellingItemForSale && sellItemForSalePopUp()}
        </View>
      </Modal>

      <CustomLoading isLoading={loading} />
    </View>
  );
};

export default ItemProfile;
