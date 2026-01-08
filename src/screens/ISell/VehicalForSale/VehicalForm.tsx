import i18next, {t} from 'i18next';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {
  Keyboard,
  Platform,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Linking,
} from 'react-native';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {MethodOfSaleSelection, MethodOfSaleType} from '.';
import {
  CustomBottomSheet,
  CustomButton,
  CustomCheckBox,
  CustomDatePicker,
  CustomDropDown,
  CustomGooglePlaces,
  CustomInput,
  CustomLoading,
  CustomRadioButton,
  CustomSwitch,
  TextMedium,
  TextRegular,
  TextSemiBold,
} from '../../../components';
import {useTheme} from '../../../hooks';
import {
  useDeleteItemForSaleMutation,
  useVehicalForSaleMutation,
} from '../../../services/submitForms/forms';
import {useUploadImagesMutation} from '../../../services/submitForms/imageUploadForm';
import {
  setDeleteItemForSale,
  setShippingMethods,
  setUpdateItemForSale,
  setWithDrawItemForSale,
  setSellingItemForSale,
} from '../../../store/Forms/ItemForSale';
import {
  setVehicalData,
  setVehicalDataEpmty,
} from '../../../store/Forms/vehicalForms';
import {storeUserCheckPermissons} from '../../../store/auth/AuthSlice';
import {setSubCatagory} from '../../../store/catagories/Catagories';
import {RootState} from '../../../store/store';
import {sHight, sWidth} from '../../../utils/ScreenDimentions';
import {TakePictures} from '../ItemForSale';
import {toastDangerMessage} from '../../../utils/helpers';
import {StackActions, useIsFocused} from '@react-navigation/native';
import {setCarJam} from '../../../store/Forms/Forms';
import {
  useUpdateListingMutation,
  useUpdateListingStatusMutation,
  useMarkListingAsSoldMutation,
} from '../../../services/modules/Listings/getSingleListing';
import {currentStack} from '../../../store/stack/StackSlice';
import {
  dropdownCondition,
  dropdownPaymentOption,
  shipping_methods_vehicle,
} from '../../../utils/dummyData';
import {axiosUploadImagesMutation} from '../../../services/submitForms/imageUploadFormAxios';
import {useLazyGetUserCheckPermissionsQuery} from '../../../services/accountSettings/userProfileService';
import {useGetGoodLendingQuery} from '../../../services/accountSettings/financeService';
import {FE_URL} from '../../../config';
import {RequiredFields} from './VehicleTypes';
import {methodOfSaleConst} from './MethodOfSaleSelection';

type Props = {
  navigation: any;
  isEdit?: boolean;
  id?: string;
  edit_single_listing_data?: any;
  withdrawn?: boolean;
};

const VehicalForm = ({
  navigation,
  isEdit,
  id,
  edit_single_listing_data,
  withdrawn,
}: Props) => {
  const {Colors, Images, Fonts, Gutters, Layout} = useTheme();
  const categories = useSelector(
    (state): RootState => state.catagories?.categories,
  );
  const subCategories = useSelector(
    (state): RootState => state.catagories?.subCategories,
  );

  const vehicalData = useSelector(
    (state): RootState => state.vehicalForms?.vehicalData,
  );
  const isUploading = useRef(false);
  const [reLaod, setReload] = useState(0);
  const [deleteProduct, {isLoading: deleteLoading}] =
    useDeleteItemForSaleMutation();
  const isValidTimeFormat = time => {
    // Regular expression for HH:mm format (24-hour clock)
    const timeRegex = /^[0-2][0-9]:[0-5][0-9]$/;

    // Check if the time string matches the regex
    return typeof time === 'string' && timeRegex.test(time);
  };
  const [updateProduct] = useUpdateListingMutation();
  const [updateListingSold] = useMarkListingAsSoldMutation();
  const [getUserPermissions] = useLazyGetUserCheckPermissionsQuery();

  const user_data = useSelector((state: RootState) => state.auth?.user_data);

  const {data: goodLendingData} = useGetGoodLendingQuery(undefined);

  const minimumDeposit = goodLendingData?.finance?.minimum_deposit;

  const allowFinanceFixedPrice =
    minimumDeposit != null &&
    vehicalData?.fixed_price_offer != null &&
    Number(vehicalData.fixed_price_offer) > Number(minimumDeposit ?? 0);

  const allowFinanceAuction =
    minimumDeposit != null &&
    vehicalData?.buy_now_price != null &&
    Number(vehicalData.buy_now_price) > Number(minimumDeposit ?? 0);

  const showFinanceOption = user_data?.subscription?.category === 'free';

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const [selectedDate, setSelectedDate] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: '',
    endDate: '',
  });

  const [addressMatch, setAddressMatch] = useState('');
  const [selectedOnRoadCost, setSelectedOnRoadCost] = useState(0);
  const [formattedAddress, setFormattedAddress] = useState('');

  const [timeFormate, setTimeFormate] = useState('');
  const [methodOfSale, setMethodOfSale] = useState<MethodOfSaleType>(
    vehicalData?.type,
  );
  const [dropdownYesNoData, setDropdownYesNoData] = useState([
    {key: 'YES', value: true},
    {key: 'NO', value: false},
  ]);
  const [dropdownTransmission, setDropdownTransmission] = useState([
    {key: 'Automatic', value: 'auto'},
    {key: 'Manual', value: 'manual'},
  ]);

  const [selectedShippingDetail, setSelectedShippingDetail] = useState([]);
  const [allShippingDetail, setAllSelectedShippingDetail] = useState(
    shipping_methods_vehicle,
  );

  const [selectedCheckBox, setSelectedCheckBox] = useState(false);

  const user_permissions = useSelector(
    (state): RootState => state.auth?.user_permissions,
  );
  const [isShowUserPermissionDialog, setIsShowUserPermissionDialog] = useState(
    user_permissions?.is_allowed == false ? true : false,
  );
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
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showBottomSheetText, setShowBottomSheetText] = useState('');
  const [uploadImg, {isLoading: uploadImageLoading}] =
    useUploadImagesMutation();
  const [submitVehicalForm, {isLoading}] = useVehicalForSaleMutation();
  const [error, setError] = useState({
    field: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<RequiredFields>>({});

  const [updateListingStatus, {isLoading: statusLoading}] =
    useUpdateListingStatusMutation();

  useEffect(() => {
    setIsShowUserPermissionDialog(
      user_permissions?.is_allowed == false ? true : false,
    );
  }, [user_permissions]);
  useEffect(() => {
    // getCatagories('&vehicle');
    getUserPermissions('?feature=isell&key=vehicle');
    return () => {
      dispatch(setVehicalData({}));
    };
  }, []);

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      getUserPermissions('?feature=isell&key=vehicle');
    }
  }, [isFocused]);

  useEffect(() => {
    if (isEdit) {
      let v = edit_single_listing_data;

      // let catTemp = findByIdFunc(
      //   categories?.flatMap(item => [{key: item?.name, value: item?._id}]),
      //   v?.category,
      // );

      // let subCatTemp = setSubCategoryFunc(catTemp?.value);
      // subCatTemp = subCatTemp?.flatMap(item => [
      //   {key: item?.name, value: item?._id},
      // ]);
      // subCatTemp = findByIdFunc(subCatTemp, v?.sub_category);

      setSelectedDate({startDate: v?.start_date, endDate: v?.end_date});
      setFormattedAddress(v?.pickup_location);
      setTimeFormate(handleEndTime(v?.end_time));
      setSelectedCheckBox(v?.make_an_offer);
      setSelectedOnRoadCost(v?.vehicle?.on_road_cost_included ? true : false);
      setMethodOfSale(v?.type);
      let data = {
        ...v,
        title: v?.title,
        category: v?.category,
        sub_category: v?.sub_category,
        make: v?.make,
        model: v?.model,
        type: v?.type,
        images: v?.images ? v?.images : [],
        condition: v?.condition,
        start_price: v?.start_price,
        reserve_price: v?.reserve_price,
        buy_now_price: v?.buy_now_price,
        description: v?.description,
        pickup_available: v?.pickup_available,
        pickup_location: v?.pickup_location,
        pickup_location_coordinates: v?.pickup_location_coordinates,
        payment_option: v?.payment_option,
        start_date: v?.start_date
          ? moment(v?.start_date).format('YYYY-MM-DD')
          : null,
        end_date: v?.end_date,
        end_time: handleEndTime(v?.end_time),
        show_phone: v?.show_phone,
        listing_type: 'vehicle',
        year: v?.vehicle?.year,
        model_detail: v?.vehicle?.model_detail,
        import_history: v?.vehicle?.import_history,
        body: v?.vehicle?.body,
        no_of_seats: v?.vehicle?.no_of_seats,
        no_of_doors: v?.vehicle?.no_of_doors,
        previous_owners: v?.vehicle?.previous_owners,
        kilometers: v?.vehicle?.kilometers,
        color: v?.vehicle?.color,
        vin: v?.vehicle?.vin,
        engine_size: v?.vehicle?.engine_size,
        transmission: v?.vehicle?.transmission,
        fuel_type: v?.vehicle?.fuel_type,
        cylinders: v?.vehicle?.cylinders,
        // drive_type: v?.vehicle?.drive_type,
        registration_expiry: v?.vehicle?.registration_expiry,
        reported_stolen: v?.vehicle?.reported_stolen,
        imported_damaged: v?.vehicle?.imported_damaged,
        wof_expiry: v?.vehicle?.wof_expiry,
        fixed_price_offer: v?.fixed_price_offer,
        on_road_cost_included: v?.vehicle?.on_road_cost_included ? 0 : 1,
        make_an_offer: v?.make_an_offer,
        shipping: null,
        enable_good_lending_finance: !!v?.finance_id,
      };

      setSelectedShippingDetail(isEdit ? v?.shipping_methods : []);
      setAllSelectedShippingDetail(shipping_methods_vehicle);
      setAddressMatch(v?.pickup_location ? v?.pickup_location : '');
      dispatch(setVehicalData(data));
    }
  }, [isEdit]);
  useEffect(() => {
    if (categories?.length > 0 && isEdit && edit_single_listing_data) {
      setSubCategoryFunc(edit_single_listing_data?.category);
    }
  }, [categories]);

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
    }

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

  function getNameById(id: string) {
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

  const DeleteProductFunc = () => {
    try {
      deleteProduct(id).then(res => {
        if (res?.data?.message) {
          dispatch(setVehicalDataEpmty({}));
          dispatch(setCarJam({}));

          dispatch(currentStack(null));
          navigation.goBack();
          // const popAction = StackActions.pop();
          // navigation.dispatch(popAction);
          // navigation.navigate('HomeContainer' as never);
        } else {
          toastDangerMessage(res?.data?.message || 'Something went wrong!');
        }
      });
    } catch (error) {
      toastDangerMessage(error?.data?.message || 'Something went wrong!');
    }
  };

  const setSubCategoryFunc = id => {
    const sub_categories = categories.find(
      c => c?._id === id && c,
    )?.sub_categories;

    dispatch(setSubCatagory(sub_categories));
    return sub_categories;
  };

  const updateProductFunc = () => {
    let formdata = new FormData();
    if (vehicalData?.images?.length !== undefined) {
      const filteredArrtoUpload = vehicalData?.images?.filter(item =>
        item.hasOwnProperty('uri'),
      );
      const filteredArrtoUploadAlreadID = vehicalData?.images?.filter(
        item => !item.hasOwnProperty('uri'),
      );
      if (filteredArrtoUpload?.length > 0) {
        filteredArrtoUpload?.forEach(item => formdata.append('files', item));
        axiosUploadImagesMutation(formdata)
          .then(res => {
            if (res?.data?.document) {
              let time24Hour = timeFormate
                ? moment(timeFormate).format('HH:mm')
                : '';
              time24Hour = isValidTimeFormat(time24Hour)
                ? time24Hour
                : vehicalData?.end_time;
              let tempVehicalData = {
                id: id,
                body: {
                  ...vehicalData,
                  enable_good_lending_finance:
                    allowFinanceAuction || allowFinanceFixedPrice,
                  images: [
                    ...filteredArrtoUploadAlreadID,
                    ...res?.data?.document,
                  ],
                  end_time: time24Hour,

                  end_date: concatenateDateTime(
                    selectedDate.endDate,
                    time24Hour,
                  ),
                  pickup_location: formattedAddress,
                  _id: id,
                  status: edit_single_listing_data?.status,
                  shipping_methods: selectedShippingDetail,
                },
              };
              console.log(
                '>>>updateProductFunc 22 updateProductFunc ',
                tempVehicalData,
              );

              updateProduct(tempVehicalData)
                .then((res: any) => {
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
                    // toastDangerMessage(
                    //   res?.error?.message || 'Something went wrong!',
                    // );
                  }
                })
                .catch(() => {
                  isUploading.current = false;
                  setReload(reLaod + 1);
                });
            } else {
              isUploading.current = false;
              setReload(reLaod + 1);
              toastDangerMessage(
                res?.error?.message || 'Something went wrong!',
              );
            }
          })
          .catch(err => {
            isUploading.current = false;
            setReload(reLaod + 1);
            toastDangerMessage(err.data.message);
          });
      } else {
        let time24Hour = timeFormate ? moment(timeFormate).format('HH:mm') : '';
        time24Hour = isValidTimeFormat(time24Hour)
          ? time24Hour
          : vehicalData?.end_time;
        let tempVehicalData = {
          id: id,
          body: {
            ...vehicalData,
            status: edit_single_listing_data?.status,
            end_time: time24Hour,

            end_date: concatenateDateTime(selectedDate.endDate, time24Hour),
            pickup_location: formattedAddress,
            shipping_methods: selectedShippingDetail,
          },
        };

        console.log(
          '>>>updateProductFunc 33 updateProductFunc ',
          tempVehicalData,
        );

        updateProduct(tempVehicalData)
          .then((res: any) => {
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
      }
    }
  };

  const withdrawListFunc = () => {
    setLoading(true);
    if (withdrawn == true) {
      let body = {
        status: 'withdrawn',
      };
      updateListingStatus({id: id, body: body}).then((res: any) => {
        if (res?.data?.message) {
          dispatch(currentStack(null));
          const popAction = StackActions.pop(4);
          navigation.dispatch(popAction);
          navigation.navigate('HomeContainer' as never);
        }
      });
    } else {
      const filteredArrtoUpload = vehicalData?.images?.filter(item =>
        item.hasOwnProperty('uri'),
      );

      const formdata = new FormData();

      if (filteredArrtoUpload?.length > 0) {
        vehicalData?.images?.forEach(item => formdata.append('files', item));
        axiosUploadImagesMutation(formdata)
          .then(res => {
            if (res?.data?.document) {
              let time24Hour = timeFormate
                ? moment(timeFormate).format('HH:mm')
                : '';
              time24Hour = isValidTimeFormat(time24Hour)
                ? time24Hour
                : vehicalData?.end_time;
              let tempVehicalData = {
                id: id,
                body: {
                  ...vehicalData,
                  images: res?.data?.document,
                  end_time: time24Hour,

                  end_date: concatenateDateTime(
                    selectedDate.endDate,
                    time24Hour,
                  ),
                  pickup_location: formattedAddress,
                  _id: id,
                  status: 'active',

                  shipping_methods: selectedShippingDetail,
                },
              };
              updateProduct(tempVehicalData).then((res: any) => {
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
                }
              });
            } else {
              toastDangerMessage(
                res?.error?.message || 'Something went wrong!',
              );
            }
          })
          .catch(err => toastDangerMessage(err.data.message));
      } else {
        let time24Hour = timeFormate ? moment(timeFormate).format('HH:mm') : '';
        time24Hour = isValidTimeFormat(time24Hour)
          ? time24Hour
          : vehicalData?.end_time;
        let body = {
          id: id,
          body: {
            ...vehicalData,
            status: 'active',
            _id: id,
            pickup_location: formattedAddress,
            end_time: time24Hour,

            end_date: concatenateDateTime(selectedDate.endDate, time24Hour),
            shipping_methods: selectedShippingDetail,
          },
        };
        console.log('>>>>body body re List 00 ', body);

        updateProduct(body).then((res: any) => {
          setLoading(false);

          if (res?.data?.message) {
            setLoading(false);
            setShowBottomSheetText(res?.data?.message);
            if (Platform.OS == 'ios') {
              setTimeout(() => {
                setShowBottomSheet(true);
              }, 700);
            } else {
              setShowBottomSheet(true);
            }
          } else {
            setLoading(false);
          }
        });
      }
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

  const validationsMessages = () => {
    let hasError = false;
    const newErrors: Partial<Record<string, string>> = {};

    const basicValidations = [
      {key: 'make', value: vehicalData?.make, message: 'Please provide make'},
      {
        key: 'model',
        value: vehicalData?.model,
        message: 'Please provide model',
      },
      {
        key: 'body',
        value: vehicalData?.body,
        message: 'Please provide body type',
      },
      {key: 'year', value: vehicalData?.year, message: 'Please provide year'},
      {
        key: 'images',
        value: vehicalData?.images?.length,
        message: 'Select up to 20 photos',
      },
      {
        key: 'title',
        value: vehicalData?.title,
        message: 'Please provide title',
      },
      {
        key: 'category',
        value: vehicalData?.category,
        message: 'Please select category',
      },
      {
        key: 'subCategory',
        value: vehicalData?.sub_category,
        message: 'Please select subcategory',
      },
      {
        key: 'condition',
        value: vehicalData?.condition,
        message: 'Please select condition',
      },
      {
        key: 'description',
        value: vehicalData?.description,
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
    if (
      methodOfSale === methodOfSaleConst.auction &&
      (!vehicalData?.start_price || vehicalData.start_price < 1)
    ) {
      newErrors.startPrice = 'Start price is required';
      hasError = true;
    }

    if (
      methodOfSale === methodOfSaleConst.fixed_price &&
      (!vehicalData?.fixed_price_offer || vehicalData.fixed_price_offer === 0)
    ) {
      newErrors.askingPrice = 'Price is required';
      hasError = true;
    }

    if (
      (vehicalData?.pickup_available ||
        selectedShippingDetail?.some(option => option.value === 'pickup')) &&
      !formattedAddress
    ) {
      newErrors.location = 'Please provide location';
      hasError = true;
    }

    if (methodOfSale === methodOfSaleConst.auction) {
      if (!vehicalData?.start_date) {
        newErrors.startDate = 'Start Date is required';
        hasError = true;
      }
      if (!vehicalData?.end_date || vehicalData.end_date === 'Invalid date') {
        newErrors.endDate = 'End Date is required';
        hasError = true;
      }
      if (!vehicalData?.end_time) {
        newErrors.closingTime = 'Closing time is required';
        hasError = true;
      }
    }

    if (selectedShippingDetail.length < 1) {
      newErrors.shipping = 'Please select a shipping method';
      hasError = true;
    }

    setErrors(prev => ({...prev, ...newErrors}));

    if (hasError) {
      toastDangerMessage('Please fill all mandatory fields');
    }

    return hasError;
  };

  const SubmitVehicalForm = async () => {
    isUploading.current = true;
    const formdata = new FormData();
    if (validationsMessages() == true) {
      isUploading.current = false;
      setReload(reLaod + 1);
    } else {
      setError({
        field: '',
        message: '',
      });

      if (isEdit) {
        dispatch(setUpdateItemForSale(true));
      } else {
        if (vehicalData?.images?.length !== undefined) {
          vehicalData?.images?.forEach(item => formdata.append('files', item));
          axiosUploadImagesMutation(formdata)
            .then(res => {
              if (res?.data?.document) {
                // dispatch(setVehicalData({images: res?.data?.document}));
                // console.log('>>>res?.data?.document ', res?.data?.document);
                let time24Hour = timeFormate
                  ? moment(timeFormate).format('HH:mm')
                  : '';
                time24Hour = isValidTimeFormat(time24Hour)
                  ? time24Hour
                  : vehicalData?.end_time;
                let tempVehicalData = {
                  ...vehicalData,
                  enable_good_lending_finance:
                    vehicalData?.enable_good_lending_finance &&
                    (allowFinanceAuction || allowFinanceFixedPrice),
                  images: res?.data?.document,
                  end_time: time24Hour,

                  end_date: concatenateDateTime(
                    selectedDate.endDate,
                    time24Hour,
                  ),
                  pickup_location: formattedAddress,
                  shipping_methods: selectedShippingDetail,
                };

                submitVehicalForm(tempVehicalData)
                  .then((res: any) => {
                    console.log(
                      'res in vehical added======= 00 ===',
                      JSON.stringify(res),
                    );
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
                      toastDangerMessage(
                        res?.error?.message ||
                          res?.error?.data?.errors?.[0] ||
                          res?.error?.data?.message ||
                          'Something went wrong!',
                      );
                    }
                  })
                  .catch(() => {
                    isUploading.current = false;
                    setReload(reLaod + 1);
                  });
              } else {
                isUploading.current = false;
                setReload(reLaod + 1);
              }
            })
            .catch(err => {
              toastDangerMessage(err.data.message);
              isUploading.current = false;
              setReload(reLaod + 1);
            });
        }
      }
    }
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
              DeleteProductFunc();
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
          {edit_single_listing_data?.status == 'active'
            ? t('common:are_you_sure_you_want_to_withdraw')
            : t('common:are_you_sure_you_want_to_re_list')}
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
              dispatch(setWithDrawItemForSale(false));
              withdrawListFunc();
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
              updateProductFunc();
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

  return (
    <View>
      <TouchableOpacity
        onPress={Keyboard.dismiss}
        accessible={false}
        activeOpacity={1}>
        <View style={[Layout.wrap, Gutters.tinyVMargin]}>
          <CustomInput
            headingText={t('common:make')}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            inputProps={{
              onChangeText: t => {
                dispatch(setVehicalData({make: t}));
                t &&
                  setErrors(prev => {
                    const updated = {...prev};
                    delete updated.make;
                    return updated;
                  });
              },
              value: vehicalData?.make,
              keyboardType: 'default',
              placeholderTextColor: Colors.dark_gray_676C6A,
            }}
            backgroundStyle={[
              {
                backgroundColor: Colors.light_grayF4F4F4,
                borderWidth: 2,
                borderColor: errors.make ? Colors.red : Colors.gray_C9C9C9,
              },
            ]}
            inputStyle={[{color: Colors.dark_gray_676C6A}]}
            placeholder={t('common:email_phone')}
            showPassword={false}>
            <TextMedium text="*" textStyle={[{color: Colors.red_E34040}]} />
          </CustomInput>

          {errors.make && (
            <TextRegular
              text={errors.make}
              textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
            />
          )}
        </View>
        <View style={[Layout.wrap]}>
          <CustomInput
            headingText={t('common:model')}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            inputProps={{
              onChangeText: t => {
                dispatch(setVehicalData({model: t}));
                t &&
                  setErrors(prev => {
                    const updated = {...prev};
                    delete updated.model;
                    return updated;
                  });
              },

              value: vehicalData?.model,
              keyboardType: 'default',
              placeholderTextColor: Colors.dark_gray_676C6A,
            }}
            inputStyle={[{color: Colors.dark_gray_676C6A}]}
            backgroundStyle={[
              {
                backgroundColor: Colors.light_grayF4F4F4,
                borderWidth: 2,
                borderColor: errors.model ? Colors.red : Colors.gray_C9C9C9,
              },
            ]}
            placeholder={t('common:email_phone')}
            showPassword={false}>
            <TextMedium text="*" textStyle={[{color: Colors.red_E34040}]} />
          </CustomInput>
          {errors.model && (
            <TextRegular
              text={errors.model}
              textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
            />
          )}
        </View>
        <View style={[Layout.wrap, Gutters.tinyTMargin]}>
          <CustomInput
            headingText={t('common:model_detail')}
            headingTextStyle={[
              Fonts.poppinMed18,
              {textTransform: 'none', color: Colors.black_232C28},
            ]}
            inputProps={{
              onChangeText: t => dispatch(setVehicalData({model_detail: t})),
              value: vehicalData?.model_detail,
              placeholderTextColor: Colors.dark_gray_676C6A,
              multiline: true,
            }}
            inputStyle={[
              {
                textAlignVertical: 'top',
                color: Colors.dark_gray_676C6A,
              },
            ]}
            backgroundStyle={[
              {
                height: 120,
                backgroundColor: Colors.light_grayF4F4F4,
                paddingLeft: 0,
                borderWidth: 2,
                borderColor: Colors.gray_C9C9C9,
              },
            ]}
            placeholder={t('common:email_phone')}
            childrenstyle={[Layout.alignItemsCenter]}
            showPassword={false}>
            <TextRegular
              text={t('common:optional')}
              textStyle={[
                Fonts.poppinReg14,
                Gutters.littleLMargin,
                {color: Colors.green_06975E},
              ]}
            />
          </CustomInput>
        </View>
        <View style={[Layout.wrap, Gutters.tinyVMargin]}>
          <CustomInput
            headingText={t('common:import_history')}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            inputProps={{
              onChangeText: t => dispatch(setVehicalData({import_history: t})),
              value: vehicalData?.import_history,
              placeholderTextColor: Colors.dark_gray_676C6A,
            }}
            inputStyle={[{color: Colors.dark_gray_676C6A}]}
            backgroundStyle={[
              {
                backgroundColor: Colors.light_grayF4F4F4,
                borderWidth: 2,
                borderColor: Colors.gray_C9C9C9,
              },
            ]}
            placeholder={t('common:email_phone')}
            showPassword={false}
            childrenstyle={[Layout.alignItemsCenter]}>
            <TextRegular
              text={t('common:optional')}
              textStyle={[
                Fonts.poppinReg14,
                Gutters.littleLMargin,
                {color: Colors.green_06975E},
              ]}
            />
          </CustomInput>
        </View>
        <View style={[Layout.wrap]}>
          <CustomInput
            headingText={t('common:body')}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            inputProps={{
              onChangeText: t => {
                dispatch(setVehicalData({body: t}));
                t &&
                  setErrors(prev => {
                    const updated = {...prev};
                    delete updated.body;
                    return updated;
                  });
              },

              value: vehicalData?.body,
              placeholderTextColor: Colors.dark_gray_676C6A,
            }}
            inputStyle={{color: Colors.dark_gray_676C6A}}
            backgroundStyle={[
              {
                borderColor: errors.body ? Colors.red : Colors.gray_C9C9C9,
                borderWidth: 2,
                backgroundColor: Colors.light_grayF4F4F4,
              },
            ]}
            placeholder={t('common:email_phone')}
            showPassword={false}>
            <TextMedium text="*" textStyle={[{color: Colors.red_E34040}]} />
          </CustomInput>
          {errors.body && (
            <TextRegular
              text={errors.body}
              textStyle={[
                // Layout.textTransform,
                {color: Colors.red, marginLeft: sHight(1)},
              ]}
            />
          )}
        </View>
        <View
          style={[
            Layout.row,
            Gutters.tinyVMargin,
            Layout.justifyContentBetween,
            Layout.alignItemsCenter,
          ]}>
          <View style={[{width: '45%'}]}>
            <CustomInput
              headingText={t('common:seat')}
              headingTextStyle={[
                Fonts.poppinMed18,
                {color: Colors.black_232C28},
              ]}
              inputStyle={{color: Colors.dark_gray_676C6A}}
              inputProps={{
                onChangeText: t =>
                  dispatch(setVehicalData({no_of_seats: Number(t)})),

                value: vehicalData?.no_of_seats
                  ? vehicalData?.no_of_seats?.toString()
                  : '',
                placeholderTextColor: Colors.dark_gray_676C6A,
                keyboardType: 'number-pad',
              }}
              backgroundStyle={[
                {
                  width: '100%',
                  backgroundColor: Colors.light_grayF4F4F4,
                  borderWidth: 2,
                  borderColor: Colors.gray_C9C9C9,
                },
              ]}
              placeholder={t('common:email_phone')}
              showPassword={false}
              childrenstyle={[Layout.alignItemsCenter]}>
              <TextRegular
                text={t('common:optional')}
                textStyle={[
                  Fonts.poppinReg14,
                  Gutters.littleLMargin,
                  {color: Colors.green_06975E},
                ]}
              />
            </CustomInput>
          </View>

          <View style={[{width: '10%', height: 50}]}></View>
          <View
            style={[
              {
                width: '45%',
              },
            ]}>
            <CustomInput
              headingText={t('common:door')}
              headingTextStyle={[
                Fonts.poppinMed18,
                {color: Colors.black_232C28},
              ]}
              inputStyle={{color: Colors.dark_gray_676C6A}}
              inputProps={{
                onChangeText: t =>
                  dispatch(setVehicalData({no_of_doors: Number(t)})),

                value: vehicalData?.no_of_doors
                  ? vehicalData?.no_of_doors?.toString()
                  : '',
                placeholderTextColor: Colors.dark_gray_676C6A,
                keyboardType: 'number-pad',
              }}
              backgroundStyle={[
                {
                  width: '100%',
                  backgroundColor: Colors.light_grayF4F4F4,
                  borderWidth: 2,
                  borderColor: Colors.gray_C9C9C9,
                },
              ]}
              placeholder={t('common:email_phone')}
              showPassword={false}
              childrenstyle={[Layout.alignItemsCenter]}>
              <TextRegular
                text={t('common:optional')}
                textStyle={[
                  Fonts.poppinReg14,
                  Gutters.littleLMargin,
                  {color: Colors.green_06975E},
                ]}
              />
            </CustomInput>
          </View>
        </View>

        <View style={[Layout.wrap]}>
          <CustomInput
            headingText={t('common:previous_owners')}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            inputProps={{
              onChangeText: t => dispatch(setVehicalData({previous_owners: t})),

              value: vehicalData?.previous_owners,
              placeholderTextColor: Colors.dark_gray_676C6A,
            }}
            inputStyle={{color: Colors.dark_gray_676C6A}}
            backgroundStyle={[
              {
                borderWidth: 2,
                borderColor: Colors.gray_C9C9C9,
                backgroundColor: Colors.light_grayF4F4F4,
              },
            ]}
            placeholder={t('common:email_phone')}
            showPassword={false}
            childrenstyle={[Layout.alignItemsCenter]}>
            <TextRegular
              text={t('common:optional')}
              textStyle={[
                Fonts.poppinReg14,
                Gutters.littleLMargin,
                {color: Colors.green_06975E},
              ]}
            />
          </CustomInput>
        </View>
        <View style={[Layout.wrap, Gutters.tinyVMargin]}>
          <CustomInput
            headingText={t('common:year')}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            inputProps={{
              onChangeText: t => {
                dispatch(setVehicalData({year: Number(t)}));
                t &&
                  setErrors(prev => {
                    const updated = {...prev};
                    delete updated.year;
                    return updated;
                  });
              },

              value: vehicalData?.year ? vehicalData?.year?.toString() : '',
              placeholderTextColor: Colors.dark_gray_676C6A,
              keyboardType: 'number-pad',
            }}
            backgroundStyle={[
              {
                borderWidth: 2,
                borderColor: errors.year ? Colors.red : Colors.gray_C9C9C9,
                backgroundColor: Colors.light_grayF4F4F4,
              },
            ]}
            inputStyle={{color: Colors.dark_gray_676C6A}}
            placeholder={t('common:email_phone')}
            showPassword={false}>
            <TextMedium
              text={t('*')}
              textStyle={[Fonts.poppinMed18, {color: Colors.red_E34040}]}
            />
          </CustomInput>
          {errors.year && (
            <TextRegular
              text={errors.year}
              textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
            />
          )}
        </View>

        <View style={[Layout.wrap, Gutters.tinyVMargin]}>
          <CustomInput
            headingText={t('common:kilometers')}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            inputProps={{
              onChangeText: t => {
                dispatch(setVehicalData({kilometers: Number(t)}));
              },

              value: `${vehicalData?.kilometers}`,
              placeholderTextColor: Colors.dark_gray_676C6A,
              keyboardType: 'number-pad',
            }}
            inputStyle={{color: Colors.dark_gray_676C6A}}
            backgroundStyle={[
              {
                borderWidth: 2,
                borderColor: Colors.gray_C9C9C9,
                backgroundColor: Colors.light_grayF4F4F4,
              },
            ]}
            placeholder={t('common:email_phone')}
            showPassword={false}
            childrenstyle={[Layout.alignItemsCenter]}>
            <TextRegular
              text={t('common:optional')}
              textStyle={[
                Fonts.poppinReg14,
                Gutters.littleLMargin,
                {color: Colors.green_06975E},
              ]}
            />
          </CustomInput>
        </View>

        <View style={[Layout.wrap, Gutters.tinyVMargin]}>
          <CustomInput
            headingText={t('common:colour')}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            inputStyle={{color: Colors.dark_gray_676C6A}}
            inputProps={{
              onChangeText: t => dispatch(setVehicalData({color: t})),

              value: vehicalData?.color,
              placeholderTextColor: Colors.dark_gray_676C6A,
            }}
            backgroundStyle={[
              {
                borderWidth: 2,
                borderColor: Colors.gray_C9C9C9,
                backgroundColor: Colors.light_grayF4F4F4,
              },
            ]}
            placeholder={t('common:email_phone')}
            showPassword={false}
            childrenstyle={[Layout.alignItemsCenter]}>
            <TextRegular
              text={t('common:optional')}
              textStyle={[
                Fonts.poppinReg14,
                Gutters.littleLMargin,
                {color: Colors.green_06975E},
              ]}
            />
          </CustomInput>
        </View>

        <View style={[Layout.wrap]}>
          <CustomInput
            headingText={t('common:number_plate_or_vin')}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            inputProps={{
              onChangeText: t => dispatch(setVehicalData({vin: t})),
              value: vehicalData?.vin,
              placeholderTextColor: Colors.dark_gray_676C6A,
            }}
            backgroundStyle={[
              {
                borderWidth: 2,
                borderColor: Colors.gray_C9C9C9,
                backgroundColor: Colors.light_grayF4F4F4,
              },
            ]}
            inputStyle={{color: Colors.dark_gray_676C6A}}
            placeholder={t('common:email_phone')}
            showPassword={false}
            childrenstyle={[Layout.alignItemsCenter]}>
            <TextRegular
              text={t('common:optional')}
              textStyle={[
                Fonts.poppinReg14,
                Gutters.littleLMargin,
                {color: Colors.green_06975E},
              ]}
            />
          </CustomInput>
        </View>

        <View style={[Gutters.smallVMargin]}>
          <Text
            style={[
              Fonts.poppinSemiBold24,
              Gutters.smallTMargin,
              {color: Colors.black_232C28},
            ]}>
            {t('common:photos')}
            <Text style={[Fonts.poppinMed18, {color: Colors.dark_gray_676C6A}]}>
              {'    '} {vehicalData?.images?.length}/20
            </Text>
          </Text>
          <TextRegular
            text="You can add up to 20 photos."
            textStyle={[
              Fonts.poppinReg18,
              Gutters.tinyBMargin,
              {color: Colors.black_232C28},
            ]}
          />
          <TakePictures
            selected={vehicalData?.images}
            setSelectedImage={arr => {
              if (arr || arr?.length > 0) {
                setErrors(prev => {
                  const updated = {...prev};
                  delete updated.images;
                  return updated;
                });
              }
              dispatch(setVehicalData({images: arr}));
            }}
            style={[
              {
                borderWidth: 2,
                borderColor: errors.images ? Colors.red : Colors.gray_C9C9C9,
              },
            ]}
          />
          {errors.images && (
            <TextRegular
              text={errors.images}
              textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
            />
          )}
        </View>

        <View
          style={[
            Gutters.largeBPadding,
            {borderBottomWidth: 1, borderColor: Colors.gray_C9C9C9},
          ]}>
          <View style={[Layout.wrap, Gutters.tinyBMargin]}>
            <CustomInput
              headingText={t('common:title')}
              headingTextStyle={[
                Fonts.poppinMed18,
                {color: Colors.black_232C28},
              ]}
              inputProps={{
                onChangeText: t => {
                  dispatch(setVehicalData({title: t}));
                  t &&
                    setErrors(prev => {
                      const updated = {...prev};
                      delete updated.title;
                      return updated;
                    });
                },
                value: vehicalData?.title,
                placeholderTextColor: Colors.dark_gray_676C6A,
              }}
              inputStyle={{color: Colors.dark_gray_676C6A}}
              backgroundStyle={[
                {
                  borderWidth: 2,
                  borderColor: errors.title ? Colors.red : Colors.gray_C9C9C9,
                  backgroundColor: Colors.light_grayF4F4F4,
                },
              ]}
              placeholder={t('common:email_phone')}
              showPassword={false}>
              <TextMedium
                text={t('*')}
                textStyle={[Fonts.poppinMed18, {color: Colors.red_E34040}]}
              />
            </CustomInput>
            {errors.title && (
              <TextRegular
                text={errors.title}
                textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
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
                  borderWidth: 2,
                  borderColor: errors.category
                    ? Colors.red
                    : Colors.gray_C9C9C9,
                },
              ]}
              value={
                isEdit
                  ? getNameById(vehicalData?.category)
                  : vehicalData?.catagory
              }
              setSelected={t => {
                dispatch(setVehicalData({category: t}));
                setSubCategoryFunc(t);
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
                textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
              />
            )}
          </View>
          <View style={[Gutters.tinyTMargin]}>
            <CustomDropDown
              data={subCategories?.flatMap(item => [
                {key: item?.name, value: item?._id},
              ])}
              selectedTextStyle={{color: Colors.dark_gray_676C6A}}
              headingTextStyle={[
                Fonts.poppinMed18,
                {color: Colors.black_232C28},
              ]}
              customStyle={[
                {
                  backgroundColor: Colors.light_grayF4F4F4,
                  borderWidth: 2,
                  borderColor: errors.subCategory
                    ? Colors.red
                    : Colors.gray_C9C9C9,
                },
              ]}
              value={getSubCategoryName(
                vehicalData?.category,
                vehicalData?.sub_category,
              )}
              setSelected={t => {
                dispatch(setVehicalData({sub_category: t}));
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
                textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
              />
            )}
          </View>
          <View style={[Gutters.tinyVMargin]}>
            <CustomDropDown
              data={dropdownCondition}
              selectedTextStyle={{color: Colors.dark_gray_676C6A}}
              headingTextStyle={[
                Fonts.poppinMed18,
                {color: Colors.black_232C28},
              ]}
              customStyle={[
                {
                  backgroundColor: Colors.light_grayF4F4F4,
                  borderWidth: 2,
                  borderColor: errors.condition
                    ? Colors.red
                    : Colors.gray_C9C9C9,
                },
              ]}
              value={
                vehicalData?.condition === dropdownCondition[0].value
                  ? dropdownCondition[0].key
                  : vehicalData?.condition === dropdownCondition[1].value
                  ? dropdownCondition[1].key
                  : ''
              }
              setSelected={t => {
                dispatch(setVehicalData({condition: t}));
                t &&
                  setErrors(prev => {
                    const updated = {...prev};
                    delete updated.condition;
                    return updated;
                  });
              }}
              placeholder={t('common:select')}
              headingText={t('common:condition')}
              itemStyle={[{backgroundColor: Colors.light_grayF4F4F4}]}>
              <TextMedium text="*" textStyle={[{color: Colors.red_E34040}]} />
            </CustomDropDown>
            {errors.condition && (
              <TextRegular
                text={errors.condition}
                textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
              />
            )}
          </View>
          <View style={[Layout.wrap, Gutters.tinyVMargin]}>
            <CustomInput
              headingText={`${t('common:describe_the_vehicle')}`}
              headingTextStyle={[
                Fonts.poppinMed18,
                {color: Colors.black_232C28},
              ]}
              inputProps={{
                onChangeText: t => {
                  dispatch(setVehicalData({description: t}));
                  t &&
                    setErrors(prev => {
                      const updated = {...prev};
                      delete updated.description;
                      return updated;
                    });
                },
                value: vehicalData?.description,
                multiline: true,
                placeholderTextColor: Colors.dark_gray_676C6A,
              }}
              backgroundStyle={[
                {
                  borderWidth: 2,
                  borderColor: errors.description
                    ? Colors.red
                    : Colors.gray_C9C9C9,
                  height: 200,
                  paddingLeft: 0,
                  backgroundColor: Colors.light_grayF4F4F4,
                },
              ]}
              inputStyle={[
                {
                  color: Colors.dark_gray_676C6A,
                  textAlignVertical: 'top',
                },
              ]}
              placeholder={t('common:email_phone')}
              showPassword={false}
              childrenstyle={[Layout.alignItemsStart]}>
              <TextRegular
                text={'*'}
                textStyle={[Fonts.poppinMed18, {color: Colors.red_E34040}]}
              />
            </CustomInput>
            {errors.description && (
              <TextRegular
                text={errors.description}
                textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
              />
            )}
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
              Fonts.poppinMed18,
              {textTransform: 'none', color: Colors.black_232C28},
            ]}
            inputProps={{
              onChangeText: t => dispatch(setVehicalData({engine_size: t})),

              value: vehicalData?.engine_size,
              placeholderTextColor: Colors.dark_gray_676C6A,
            }}
            inputStyle={{color: Colors.dark_gray_676C6A}}
            backgroundStyle={[
              {
                borderColor: Colors.gray_C9C9C9,
                borderWidth: 2,
                backgroundColor: Colors.light_grayF4F4F4,
              },
            ]}
            placeholder={t('common:email_phone')}
            showPassword={false}
            childrenstyle={[Layout.alignItemsCenter]}>
            <TextRegular
              text={t('common:optional')}
              textStyle={[Fonts.poppinReg14, {color: Colors.green_06975E}]}
            />
          </CustomInput>
        </View>
        <View style={[Layout.wrap, Gutters.tinyVMargin, Layout.overflow]}>
          <CustomDropDown
            data={dropdownTransmission}
            selectedTextStyle={{color: Colors.dark_gray_676C6A}}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            customStyle={[
              {
                backgroundColor: Colors.light_grayF4F4F4,
                borderWidth: 2,
                borderColor: Colors.gray_C9C9C9,
              },
            ]}
            value={
              vehicalData?.transmission == dropdownTransmission[0].value
                ? dropdownTransmission[0].key
                : vehicalData?.transmission == dropdownTransmission[1].value
                ? dropdownTransmission[1].key
                : ''
            }
            setSelected={t => {
              dispatch(setVehicalData({transmission: t}));
            }}
            placeholder={t('common:select')}
            headingText={t('common:transmission')}
            itemStyle={[{backgroundColor: Colors.light_grayF4F4F4}]}>
            <TextRegular
              text={t('common:optional')}
              textStyle={[Fonts.poppinReg14, {color: Colors.green_06975E}]}
            />
          </CustomDropDown>
        </View>
        <View style={[Layout.wrap]}>
          <CustomInput
            headingText={t('common:fuel_type')}
            headingTextStyle={[
              Fonts.poppinMed18,
              {textTransform: 'none', color: Colors.black_232C28},
            ]}
            inputProps={{
              onChangeText: t => dispatch(setVehicalData({fuel_type: t})),

              value: vehicalData?.fuel_type,
              placeholderTextColor: Colors.dark_gray_676C6A,
            }}
            inputStyle={{color: Colors.dark_gray_676C6A}}
            backgroundStyle={[
              {
                borderColor: Colors.gray_C9C9C9,
                borderWidth: 2,
                backgroundColor: Colors.light_grayF4F4F4,
              },
            ]}
            placeholder={t('common:email_phone')}
            showPassword={false}
            childrenstyle={[Layout.alignItemsCenter]}>
            <TextRegular
              text={t('common:optional')}
              textStyle={[Fonts.poppinReg14, {color: Colors.green_06975E}]}
            />
          </CustomInput>
        </View>
        <View style={[Layout.wrap, Gutters.tinyVMargin]}>
          <CustomInput
            headingText={t('common:cylinders')}
            headingTextStyle={[
              Fonts.poppinMed18,
              {textTransform: 'none', color: Colors.black_232C28},
            ]}
            inputProps={{
              onChangeText: t =>
                dispatch(setVehicalData({cylinders: Number(t)})),

              value: vehicalData?.cylinders
                ? vehicalData?.cylinders?.toString()
                : '',
              placeholderTextColor: Colors.dark_gray_676C6A,
            }}
            inputStyle={{color: Colors.dark_gray_676C6A}}
            backgroundStyle={[
              {
                borderWidth: 2,
                borderColor: Colors.gray_C9C9C9,
                backgroundColor: Colors.light_grayF4F4F4,
              },
            ]}
            placeholder={t('common:email_phone')}
            showPassword={false}
            childrenstyle={[Layout.alignItemsCenter]}>
            <TextRegular
              text={t('common:optional')}
              textStyle={[Fonts.poppinReg14, {color: Colors.green_06975E}]}
            />
          </CustomInput>
        </View>
        {/* <View style={[Layout.wrap, Layout.overflow]}>
          <CustomDropDown
            data={dropdownDriveType}
            selectedTextStyle={{color: Colors.dark_gray_676C6A}}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            customStyle={[
              {
                backgroundColor: Colors.light_grayF4F4F4,
                borderWidth: 2,
                borderColor: Colors.gray_C9C9C9,
              },
            ]}
            value={
              vehicalData?.drive_type === dropdownDriveType[1]?.value
                ? dropdownDriveType[1]?.key
                : dropdownDriveType[0]?.key
            }
            setSelected={t => {
              dispatch(setVehicalData({drive_type: t}));
            }}
            placeholder={t('common:select')}
            headingText={t('common:drive_type')}
            itemStyle={[{backgroundColor: Colors.light_grayF4F4F4}]}>
            <TextRegular
              text={t('common:optional')}
              textStyle={[
                Fonts.poppinReg14,
                Gutters.littleLMargin,
                {color: Colors.green_06975E},
              ]}
            />
          </CustomDropDown>
        </View> */}
        <View style={[Layout.wrap, Gutters.tinyVMargin]}>
          <CustomInput
            headingText={t('common:registration_expiry')}
            headingTextStyle={[
              Fonts.poppinMed18,
              {textTransform: 'none', color: Colors.black_232C28},
            ]}
            inputProps={{
              onChangeText: t =>
                dispatch(setVehicalData({registration_expiry: t})),

              value: vehicalData?.registration_expiry,
              placeholderTextColor: Colors.dark_gray_676C6A,
            }}
            inputStyle={{color: Colors.dark_gray_676C6A}}
            backgroundStyle={[
              {
                borderWidth: 2,
                borderColor: Colors.gray_C9C9C9,
                backgroundColor: Colors.light_grayF4F4F4,
              },
            ]}
            placeholder={t('common:email_phone')}
            showPassword={false}
            childrenstyle={[Layout.alignItemsCenter]}>
            <TextRegular
              text={t('common:optional')}
              textStyle={[
                Fonts.poppinReg14,
                Gutters.littleLMargin,
                {color: Colors.green_06975E},
              ]}
            />
          </CustomInput>
        </View>
        <View style={[Layout.wrap]}>
          <CustomInput
            headingText={t('common:wof_expiry')}
            headingTextStyle={[
              Fonts.poppinMed18,
              {textTransform: 'none', color: Colors.black_232C28},
            ]}
            inputProps={{
              onChangeText: t => dispatch(setVehicalData({wof_expiry: t})),

              value: vehicalData?.wof_expiry,
              placeholderTextColor: Colors.dark_gray_676C6A,
            }}
            inputStyle={{color: Colors.dark_gray_676C6A}}
            backgroundStyle={[
              {
                borderWidth: 2,
                borderColor: Colors.gray_C9C9C9,
                backgroundColor: Colors.light_grayF4F4F4,
              },
            ]}
            placeholder={t('common:email_phone')}
            showPassword={false}
            childrenstyle={[Layout.alignItemsCenter]}>
            <TextRegular
              text={t('common:optional')}
              textStyle={[
                Fonts.poppinReg14,
                Gutters.littleLMargin,
                {color: Colors.green_06975E},
              ]}
            />
          </CustomInput>
        </View>
        <View style={[Gutters.tinyVMargin]}>
          <CustomDropDown
            data={dropdownYesNoData}
            selectedTextStyle={{color: Colors.dark_gray_676C6A}}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            customStyle={[
              {
                backgroundColor: Colors.light_grayF4F4F4,
                borderWidth: 2,
                borderColor: Colors.gray_C9C9C9,
              },
            ]}
            value={
              vehicalData?.reported_stolen
                ? dropdownYesNoData[0].key
                : dropdownYesNoData[1].key
            }
            setSelected={t => {
              dispatch(setVehicalData({reported_stolen: t}));
            }}
            placeholder={t('common:select')}
            headingText={t('common:reported_stolen')}
            itemStyle={[
              {backgroundColor: Colors.light_grayF4F4F4},
            ]}></CustomDropDown>
        </View>
        <View style={[Gutters.tinyVMargin]}>
          <CustomDropDown
            data={dropdownYesNoData}
            selectedTextStyle={{color: Colors.dark_gray_676C6A}}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            customStyle={[
              {
                backgroundColor: Colors.light_grayF4F4F4,
                borderWidth: 2,
                borderColor: Colors.gray_C9C9C9,
              },
            ]}
            value={
              vehicalData?.imported_damaged
                ? dropdownYesNoData[0].key
                : dropdownYesNoData[1].key
            }
            setSelected={t => {
              dispatch(setVehicalData({imported_damaged: t}));
            }}
            placeholder={t('common:select')}
            headingText={t('common:imported_damaged')}
            itemStyle={[
              {backgroundColor: Colors.light_grayF4F4F4},
            ]}></CustomDropDown>
        </View>

        <View style={[Gutters.smallVMargin]}>
          <TextSemiBold
            text={t('common:are_on_road_costs_included')}
            textStyle={[Fonts.poppinSemiBold20, {color: Colors.black_232C28}]}
            textProps={[{ellipsizeMode: 'clip', numberOfLines: 2}]}
          />
          <View style={[Gutters.smallTMargin, Layout.overflow]}>
            {/* {[
              t('common:yes_the_car_will_be_sold_with_a_current'),
              t('common:no_the_buyer_may_need_to_pay_additional'),
            ].map((item, index) => {
              return (
                <CustomRadioButton
                  selected={selectedOnRoadCost ? 0 : 1}
                  setSelected={v => {
                    dispatch(
                      setVehicalData({
                        on_road_cost_included: v === 0 ? true : false,
                      }),
                    );
                    setSelectedOnRoadCost(v);
                    console.log('>>> 111 ', v);
                  }}
                  text={item}
                  index={index}
                  customStyle={[Layout.alignItemsCenter]}
                  customTextStyle={[
                    Fonts.poppinReg16,
                    Gutters.littleLMargin,
                    Gutters.tinyRPadding,
                  ]}
                />
              );
            })} */}
            <CustomRadioButton
              selected={selectedOnRoadCost ? 0 : 1}
              setSelected={v => {
                dispatch(
                  setVehicalData({
                    on_road_cost_included: true,
                  }),
                );
                setSelectedOnRoadCost(1);
                console.log('>>> 111 ', v);
              }}
              text={t('common:yes_the_car_will_be_sold_with_a_current')}
              index={0}
              customStyle={[Layout.alignItemsCenter]}
              customTextStyle={[
                Fonts.poppinReg16,
                Gutters.littleLMargin,
                Gutters.tinyRPadding,
              ]}
            />
            <CustomRadioButton
              selected={selectedOnRoadCost ? 0 : 1}
              setSelected={v => {
                dispatch(
                  setVehicalData({
                    on_road_cost_included: false,
                  }),
                );
                setSelectedOnRoadCost(0);
                console.log('>>> 111 ', v);
              }}
              text={t('common:no_the_buyer_may_need_to_pay_additional')}
              index={1}
              customStyle={[Layout.alignItemsCenter]}
              customTextStyle={[
                Fonts.poppinReg16,
                Gutters.littleLMargin,
                Gutters.tinyRPadding,
              ]}
            />
          </View>
        </View>

        <MethodOfSaleSelection
          selected={methodOfSale}
          setSelected={v => {
            if (
              !(
                (edit_single_listing_data?.offers_count > 0 &&
                  edit_single_listing_data?.status != 'expired') ||
                (edit_single_listing_data?.type === methodOfSaleConst.auction &&
                  edit_single_listing_data?.auction_data.bids_count > 0 &&
                  edit_single_listing_data?.reserve_price <=
                    edit_single_listing_data?.auction_data.current_bid)
              )
            ) {
              dispatch(setVehicalData({type: v}));
              setMethodOfSale(v);
            }

            if (v === methodOfSaleConst.enquire) {
              setErrors(prev => {
                const updated = {...prev};
                delete updated.askingPrice;
                delete updated.startPrice;
                delete updated.startDate;
                delete updated.endDate;
                delete updated.closingTime;
                return updated;
              });
            }

            if (v === methodOfSaleConst.fixed_price) {
              setErrors(prev => ({
                ...prev,
                askingPrice: 'Price is required',
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

            if (v === methodOfSaleConst.auction) {
              setErrors(prev => ({
                ...prev,
                startPrice: 'Start price is required',
                startDate: 'Start Date is required',
                endDate: 'End Date is required',
                closingTime: 'Closing time is required',
              }));
            }
          }}
        />

        {methodOfSale === methodOfSaleConst.fixed_price ? (
          <View>
            <View style={[Layout.wrap, Gutters.tinyTMargin]}>
              <CustomInput
                editable={
                  !(
                    (edit_single_listing_data?.offers_count > 0 &&
                      edit_single_listing_data?.status != 'expired') ||
                    (edit_single_listing_data?.type ===
                      methodOfSaleConst.auction &&
                      edit_single_listing_data?.auction_data.bids_count > 0 &&
                      edit_single_listing_data?.reserve_price <=
                        edit_single_listing_data?.auction_data.current_bid)
                  )
                }
                headingText={`${t('common:whats_your_asking_price')}`}
                headingTextStyle={[
                  Fonts.poppinMed18,
                  {color: Colors.black_232C28},
                ]}
                inputProps={{
                  onChangeText: t => {
                    dispatch(setVehicalData({fixed_price_offer: Number(t)}));
                    t &&
                      setErrors(prev => {
                        const updated = {...prev};
                        delete updated.askingPrice;
                        return updated;
                      });
                  },

                  value: vehicalData?.fixed_price_offer
                    ? vehicalData?.fixed_price_offer?.toString()
                    : '',
                  keyboardType: 'number-pad',
                  placeholderTextColor: Colors.dark_gray_676C6A,
                }}
                inputStyle={{color: Colors.dark_gray_676C6A}}
                backgroundStyle={[
                  {
                    borderColor: errors.askingPrice
                      ? Colors.red
                      : Colors.gray_C9C9C9,
                    borderWidth: 2,
                    backgroundColor: Colors.light_grayF4F4F4,
                  },
                ]}
                placeholder={t('common:nz')}
                showPassword={false}
                childrenstyle={[Layout.alignItemsCenter]}>
                <TextMedium
                  text={'*'}
                  textStyle={[{color: Colors.red_E34040}]}
                />
              </CustomInput>
              {errors.askingPrice && (
                <TextRegular
                  text={errors.askingPrice}
                  textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                />
              )}
            </View>

            {showFinanceOption && allowFinanceFixedPrice && (
              <View>
                <View
                  style={[
                    Gutters.smallVMargin,
                    i18next.language === 'en' ? Layout.row : Layout.rowReverse,
                    Layout.alignItemsCenter,
                    Layout.justifyContentBetween,
                  ]}>
                  <View style={[Layout.row, Layout.alignItemsCenter]}>
                    <CustomCheckBox
                      setSelected={v => {
                        dispatch(
                          setVehicalData({enable_good_lending_finance: v}),
                        );
                      }}
                      index={0}
                      isCard={false}
                      selected={vehicalData?.enable_good_lending_finance}
                      customStyle={[
                        {
                          width: 28,
                          height: 28,
                          borderWidth: 1.5,
                          borderRadius: 2,
                          borderColor: Colors.dark_gray_676C6A,
                        },
                      ]}
                    />
                    <View
                      style={[Gutters.xTinyLPadding, {maxWidth: sWidth(70)}]}>
                      <TextRegular
                        text={'Allow Good Lending finance'}
                        textStyle={[
                          Fonts.poppinReg16,
                          {textTransform: 'none', color: Colors.black_232C28},
                        ]}
                      />
                    </View>
                  </View>
                </View>
                {/* <View style={[Gutters.xTinyLPadding, {maxWidth: sWidth(70)}]}>
                  <TextRegular
                    text={`Finance is available if the asking price is above the minimum finance amount of $${minimumDeposit}.`}
                    textStyle={[
                      Fonts.poppinReg16,
                      {textTransform: 'none', color: Colors.black_232C28},
                    ]}
                  />
                </View> */}
              </View>
            )}
          </View>
        ) : (
          <>
            <TextSemiBold
              text={t('common:your_auction_details')}
              textStyle={[Fonts.poppinSemiBold20, {color: Colors.black_232C28}]}
            />
            {methodOfSale === methodOfSaleConst.auction && (
              <View style={[Layout.wrap, Gutters.tinyTMargin]}>
                <CustomInput
                  editable={
                    !(
                      (edit_single_listing_data?.offers_count > 0 &&
                        edit_single_listing_data?.status != 'expired') ||
                      (edit_single_listing_data?.type ===
                        methodOfSaleConst.auction &&
                        edit_single_listing_data?.auction_data.bids_count > 0 &&
                        edit_single_listing_data?.reserve_price <=
                          edit_single_listing_data?.auction_data.current_bid)
                    )
                  }
                  headingText={t('common:reserve_price')}
                  headingTextStyle={[
                    Fonts.poppinMed18,
                    {color: Colors.black_232C28},
                  ]}
                  inputProps={{
                    onChangeText: t =>
                      dispatch(setVehicalData({reserve_price: Number(t)})),

                    value: vehicalData?.reserve_price
                      ? vehicalData?.reserve_price?.toString()
                      : '',
                    keyboardType: 'number-pad',
                    placeholderTextColor: Colors.dark_gray_676C6A,
                  }}
                  inputStyle={{color: Colors.dark_gray_676C6A}}
                  backgroundStyle={[
                    {
                      borderColor: Colors.gray_C9C9C9,
                      borderWidth: 2,
                      backgroundColor: Colors.light_grayF4F4F4,
                    },
                  ]}
                  placeholder={t('common:nz')}
                  showPassword={false}
                  childrenstyle={[Layout.alignItemsCenter]}>
                  <TextRegular
                    text={t('common:optional')}
                    textStyle={[
                      Fonts.poppinReg14,
                      Gutters.littleLMargin,
                      {color: Colors.dark_gray_676C6A},
                    ]}
                  />
                </CustomInput>
                <TextRegular
                  text={t('common:The_lowest_price_youre_willing_to_sell_for')}
                  textStyle={[
                    Fonts.poppinReg14,
                    {color: Colors.dark_gray_676C6A},
                  ]}
                />
              </View>
            )}

            {methodOfSale === methodOfSaleConst.auction && (
              <View style={[Layout.wrap, Gutters.tinyTMargin]}>
                <CustomInput
                  editable={
                    !(
                      (edit_single_listing_data?.offers_count > 0 &&
                        edit_single_listing_data?.status != 'expired') ||
                      (edit_single_listing_data?.type ===
                        methodOfSaleConst.auction &&
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
                      dispatch(setVehicalData({start_price: Number(t)}));
                      t &&
                        setError({
                          field: '',
                          message: '',
                        });
                    },
                    value: vehicalData?.start_price
                      ? vehicalData?.start_price?.toString()
                      : '',
                    keyboardType: 'number-pad',
                    placeholderTextColor: Colors.dark_gray_676C6A,
                  }}
                  inputStyle={{color: Colors.dark_gray_676C6A}}
                  backgroundStyle={[
                    {
                      borderColor: errors.startPrice
                        ? Colors.red
                        : Colors.gray_C9C9C9,
                      borderWidth: 2,
                      backgroundColor: Colors.light_grayF4F4F4,
                    },
                  ]}
                  placeholder={t('common:nz')}
                  showPassword={false}
                />

                {errors.startPrice && (
                  <TextRegular
                    text={errors.startPrice}
                    textStyle={[{color: Colors.red, marginLeft: sHight(1)}]}
                  />
                )}
                <TextRegular
                  text={t('common:set_lower_than_reserve_to_attract_more_bids')}
                  textStyle={[
                    Fonts.poppinReg14,
                    {color: Colors.dark_gray_676C6A},
                  ]}
                />
              </View>
            )}

            {methodOfSale === methodOfSaleConst.auction && (
              <View>
                <View style={[Layout.wrap, Gutters.tinyTMargin]}>
                  <CustomInput
                    editable={
                      !(
                        (edit_single_listing_data?.offers_count > 0 &&
                          edit_single_listing_data?.status != 'expired') ||
                        (edit_single_listing_data?.type ===
                          methodOfSaleConst.auction &&
                          edit_single_listing_data?.auction_data.bids_count >
                            0 &&
                          edit_single_listing_data?.reserve_price <=
                            edit_single_listing_data?.auction_data.current_bid)
                      )
                    }
                    headingText={t('common:buy_now_price')}
                    headingTextStyle={[
                      Fonts.poppinMed18,
                      {color: Colors.black_232C28},
                    ]}
                    inputProps={{
                      onChangeText: t =>
                        dispatch(
                          setVehicalData({
                            buy_now_price: Number(t),
                          }),
                        ),

                      value: vehicalData?.buy_now_price
                        ? vehicalData?.buy_now_price?.toString()
                        : '',
                      keyboardType: 'number-pad',
                      placeholderTextColor: Colors.dark_gray_676C6A,
                    }}
                    inputStyle={{color: Colors.dark_gray_676C6A}}
                    backgroundStyle={[
                      {
                        borderWidth: 2,
                        borderColor:
                          error.field === 'vehical.buy_now_price'
                            ? Colors.red
                            : Colors.gray_C9C9C9,
                        backgroundColor: Colors.light_grayF4F4F4,
                      },
                    ]}
                    placeholder={t('common:nz')}
                    showPassword={false}
                    childrenstyle={[Layout.alignItemsCenter]}>
                    <TextRegular
                      text={t('common:optional')}
                      textStyle={[
                        Fonts.poppinReg14,
                        Gutters.littleLMargin,
                        {color: Colors.dark_gray_676C6A},
                      ]}
                    />
                  </CustomInput>
                  <TextRegular
                    text={t('common:the_price_youd_sell_your_vehicle_for_now')}
                    textStyle={[
                      Fonts.poppinReg14,
                      Gutters.littleTMargin,
                      {color: Colors.dark_gray_676C6A},
                    ]}
                  />
                </View>

                {showFinanceOption && allowFinanceAuction && (
                  <View>
                    <View
                      style={[
                        Gutters.smallVMargin,
                        i18next.language === 'en'
                          ? Layout.row
                          : Layout.rowReverse,
                        Layout.alignItemsCenter,
                        Layout.justifyContentBetween,
                      ]}>
                      <View style={[Layout.row, Layout.alignItemsCenter]}>
                        <CustomCheckBox
                          setSelected={v => {
                            dispatch(
                              setVehicalData({enable_good_lending_finance: v}),
                            );
                          }}
                          index={0}
                          isCard={false}
                          selected={vehicalData?.enable_good_lending_finance}
                          customStyle={[
                            {
                              width: 28,
                              height: 28,
                              borderWidth: 1.5,
                              borderRadius: 2,
                              borderColor: Colors.dark_gray_676C6A,
                            },
                          ]}
                        />
                        <View
                          style={[
                            Gutters.xTinyLPadding,
                            {maxWidth: sWidth(70)},
                          ]}>
                          <TextRegular
                            text={'Allow Good Lending finance'}
                            textStyle={[
                              Fonts.poppinReg16,
                              {
                                textTransform: 'none',
                                color: Colors.black_232C28,
                              },
                            ]}
                          />
                        </View>
                      </View>
                    </View>

                    {/* <View
                      style={[Gutters.xTinyLPadding, {maxWidth: sWidth(70)}]}>
                      <TextRegular
                        text={`Finance is available if the buy now price is above the minimum finance amount of $${minimumDeposit}.`}
                        textStyle={[
                          Fonts.poppinReg16,
                          {textTransform: 'none', color: Colors.black_232C28},
                        ]}
                      />
                    </View> */}
                  </View>
                )}
              </View>
            )}
          </>
        )}

        <View
          style={[
            Gutters.smallVMargin,
            i18next.language === 'en' ? Layout.row : Layout.rowReverse,
            Layout.alignItemsStart,
          ]}>
          <CustomCheckBox
            setSelected={v => {
              dispatch(setVehicalData({make_an_offer: v}));
              setSelectedCheckBox(v);
            }}
            index={0}
            isCard={false}
            selected={selectedCheckBox}
            customStyle={[
              {
                width: 28,
                height: 28,
                borderWidth: 1.5,
                borderRadius: 2,
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

        <View
          style={[
            i18next.language === 'en' ? Layout.row : Layout.rowReverse,
            Layout.alignItemsCenter,
            Layout.justifyContentBetween,
            Layout.selfCenter,
            Layout.fullWidth,
          ]}>
          <TextMedium
            text="Location of listing"
            textStyle={[
              Fonts.poppinMed18,
              Gutters.tinyBPadding,
              {textTransform: 'none', color: Colors.black_232C28},
            ]}
          />
          <CustomSwitch
            selected={vehicalData?.pickup_available}
            setSelected={v => {
              if (v == false) {
                dispatch(
                  setVehicalData({
                    pickup_available: v,
                    pickup_location_coordinates: {
                      lat: null,
                      lng: null,
                    },
                  }),
                );
                setFormattedAddress('');
              } else {
                dispatch(setVehicalData({pickup_available: v}));
              }
            }}
          />
        </View>

        <>
          <CustomGooglePlaces
            // value={vehicalData?.pickup_location}
            value={formattedAddress}
            editable={vehicalData?.pickup_available}
            setFieldValue={(details: any) => {
              dispatch(
                setVehicalData({
                  pickup_location_coordinates: details?.geometry.location,
                }),
              );
              setAddressMatch(details?.shortLocation);
            }}
            setPickup={v => {
              setFormattedAddress(v ? v : '');
              v &&
                setError({
                  message: '',
                  field: '',
                });

              // dispatch(setVehicalData({pickup_location: v}));
            }}
          />
          {error.field === 'vehical.pickup_location' && (
            <TextRegular
              text={error.message}
              textStyle={[
                Layout.textTransfromNone,
                {
                  color: Colors.red,
                  marginLeft: sHight(1),
                },
              ]}
            />
          )}
        </>
        <View style={[Gutters.tinyTMargin]}>
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
              vehicalData?.payment_option === dropdownPaymentOption[0].value
                ? dropdownPaymentOption[0].key
                : vehicalData?.payment_option === dropdownPaymentOption[1].value
                ? dropdownPaymentOption[1].key
                : vehicalData?.payment_option === dropdownPaymentOption[2].value
                ? dropdownPaymentOption[2].key
                : ''
            }
            setSelected={t => {
              dispatch(setVehicalData({payment_option: t}));
            }}
            placeholder={t('common:select')}
            headingText={t('common:payment_option')}
            itemStyle={[
              {backgroundColor: Colors.light_grayF4F4F4},
            ]}></CustomDropDown>
        </View>
        <View style={[Gutters.tinyTMargin]}>
          <CustomDatePicker
            isShowCross={true}
            setSelectedDate={date => {
              const dt = moment(date).format('DD/MM/YYYY');

              setSelectedDate({...selectedDate, startDate: date});
              dispatch(
                setVehicalData({
                  start_date: date ? moment(date).format('YYYY-MM-DD') : '',
                }),
              );
              date &&
                setErrors(prev => {
                  const updated = {...prev};
                  delete updated.startDate;
                  return updated;
                });
            }}
            dateProps={{
              minimumDate: new Date(),
              ...(selectedDate.endDate && {
                maximumDate: new Date(selectedDate.endDate),
              }),
            }}
            selectDate={selectedDate.startDate}
            headingText={t('common:start_date')}
            customHeadingStyle={[
              Fonts.poppinMed18,
              {color: Colors.black_232C28},
            ]}
            leftIcon={false}
            rightIcon={true}
            rightIconName="calendar"
            childrenStyle={[Layout.alignItemsCenter]}
            customBackgroundStyle={[
              {
                borderWidth: 1,
                borderColor:
                  methodOfSale === methodOfSaleConst.auction && errors.startDate
                    ? Colors.red
                    : Colors.gray_C9C9C9,
                backgroundColor: Colors.light_grayF4F4F4,
              },
            ]}>
            {methodOfSale !== methodOfSaleConst.auction && (
              <TextRegular
                text={t('common:optional')}
                textStyle={[
                  Fonts.poppinReg14,
                  Gutters.littleLMargin,
                  {color: Colors.green_06975E},
                ]}
              />
            )}
          </CustomDatePicker>
          {errors.startDate && (
            <TextRegular
              text={errors.startDate}
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
          <CustomDatePicker
            isShowCross={true}
            setSelectedDate={date => {
              const dt = moment(date).format('DD/MM/YYYY');
              setSelectedDate({...selectedDate, endDate: date});
              dispatch(
                setVehicalData({
                  end_date: date ? moment(date).format('YYYY-MM-DD') : '',
                }),
              );
              date &&
                setErrors(prev => {
                  const updated = {...prev};
                  delete updated.endDate;
                  return updated;
                });
            }}
            dateProps={{
              minimumDate: selectedDate.startDate
                ? new Date(selectedDate.startDate)
                : new Date(),
            }}
            selectDate={selectedDate.endDate}
            headingText={t('common:end_date')}
            customHeadingStyle={[
              Fonts.poppinMed18,
              {color: Colors.black_232C28, textTransform: 'capitalize'},
            ]}
            leftIcon={false}
            rightIcon={true}
            rightIconName="calendar"
            childrenStyle={[Layout.alignItemsCenter]}
            customBackgroundStyle={[
              {
                borderWidth: 1,
                borderColor:
                  methodOfSale === methodOfSaleConst.auction && errors.endDate
                    ? Colors.red
                    : Colors.gray_C9C9C9,
                backgroundColor: Colors.light_grayF4F4F4,
              },
            ]}>
            {methodOfSale !== methodOfSaleConst.auction && (
              <TextRegular
                text={t('common:optional')}
                textStyle={[
                  Fonts.poppinReg14,
                  Gutters.littleLMargin,
                  {color: Colors.green_06975E},
                ]}
              />
            )}
          </CustomDatePicker>
          {errors.endDate && (
            <TextRegular
              text={errors.endDate}
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
          <CustomDatePicker
            isShowCross={true}
            mode="time"
            placeholderText="--:--,--"
            setSelectedDate={time => {
              let formattedEndTime = time ? moment(time).format('HH:mm') : '';
              dispatch(setVehicalData({end_time: formattedEndTime}));
              // if (vehicalData?.end_date) {
              //   if (formattedEndTime) {
              //     const combinedDateTime = moment(
              //       `${vehicalData?.end_date} ${formattedEndTime}`,
              //       'YYYY-MM-DD h:mm A',
              //     ).toISOString();
              //     dispatch(
              //       setVehicalData({
              //         end_date: combinedDateTime,
              //         end_time: formattedEndTime,
              //       }),
              //     );
              //   } else {
              //     const combinedDateTime = moment(
              //       `${vehicalData?.end_date} 00:00`,
              //       'YYYY-MM-DD HH:mm',
              //     ).toISOString();
              //     dispatch(
              //       setVehicalData({
              //         end_date: combinedDateTime,
              //         end_time: formattedEndTime,
              //       }),
              //     );
              //   }
              // }
              setTimeFormate(time);
              time &&
                setErrors(prev => {
                  const updated = {...prev};
                  delete updated.closingTime;
                  return updated;
                });
            }}
            selectDate={
              isEdit
                ? timeFormate
                  ? moment(timeFormate, 'hh:mm A').format()
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
            childrenStyle={[Layout.alignItemsCenter]}
            customBackgroundStyle={[
              {
                borderWidth: 1,
                borderColor:
                  methodOfSale === methodOfSaleConst.auction &&
                  errors.closingTime
                    ? Colors.red
                    : Colors.gray_C9C9C9,
                backgroundColor: Colors.light_grayF4F4F4,
              },
            ]}>
            {methodOfSale !== methodOfSaleConst.auction && (
              <TextRegular
                text={t('common:optional')}
                textStyle={[
                  Fonts.poppinReg14,
                  Gutters.littleLMargin,
                  {color: Colors.green_06975E},
                ]}
              />
            )}
          </CustomDatePicker>
          {errors.closingTime && (
            <TextRegular
              text={errors.closingTime}
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
          {/* <CustomDropDown
            returnFullObj={true}
            data={user_data?.shipping_methods?.flatMap(item => [
              {
                key: item?.option_name,
                value: item?.value,
                amount: item?.amount,
              },
            ])}
            leftIcon={false}
            iconName={'wallet'}
            selectedTextStyle={{color: Colors.dark_gray_676C6A}}
            headingTextStyle={[Fonts.poppinMed18, {color: Colors.black_232C28}]}
            customStyle={[
              {
                backgroundColor: Colors.light_grayF4F4F4,
                borderWidth: 2,
                borderColor:
                  error.field === 'vehical.shipping'
                    ? Colors.red
                    : Colors.gray_C9C9C9,
              },
            ]}
            value={vehicalData?.shipping?.option_name}
            setSelected={t => {
              dispatch(
                setVehicalData({
                  shipping: {
                    amount: t?.amount,
                    description: null,
                    option_name: t?.key,
                    url: null,
                    value: t?.value,
                  },
                }),
              );
              t && setError({field: '', message: ''});
            }}
            placeholder={t('common:select')}
            headingText={t('common:shipping')}
            itemStyle={[{backgroundColor: Colors.light_grayF4F4F4}]}
          /> */}
          <TextMedium
            text={t('common:shipping')}
            textStyle={[
              Fonts.poppinMed18,
              Gutters.littleBMargin,
              Gutters.littleLMargin,
              {color: Colors.black_232C28},
            ]}
          />
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
                            error.field == 'vehical.shippingCost'
                          ) {
                            error.field = '';
                            error.message = '';
                            setError(error);
                          }
                        } else {
                          setSelectedShippingDetail(
                            addItem(selectedShippingDetail, item),
                          );
                          setErrors(prev => {
                            const updated = {...prev};
                            delete updated.shipping;
                            return updated;
                          });
                          if (
                            item.value === 'specify_costs' &&
                            (item.amount == null || item.amount == '')
                          ) {
                            error.field = 'vehical.shippingCost';
                            error.message = 'Please specify shipping cost';
                            setError(error);
                          } else if (error.field == 'vehical.shipping') {
                            error.field = '';
                            error.message = '';
                            setError(error);
                          }
                        }

                        // setSelectedShippingDetail
                      }}
                    />
                    <TextRegular
                      text={item?.option_name}
                      textStyle={[
                        Fonts.poppinReg18,
                        Gutters.tinyLMargin,
                        // Gutters.tinyTMargin,
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
                                error.field == 'vehical.shippingCost'
                              ) {
                                error.field = '';
                                error.message = '';
                                setError(error);
                              } else if (!t) {
                                error.field = 'vehical.shippingCost';
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
                    </View>
                  )}
                </>
              );
            }}
          />
          <View>
            {errors.shipping && (
              <TextRegular
                text={errors.shipping}
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

          {/* <View style={[Layout.row, Gutters.smallTMargin]}>
            <TextRegular
              text={'Find a price:'}
              textStyle={[
                Fonts.poppinReg18,
                // Gutters.tinyLMargin,
                // Gutters.tinyTMargin,
                {
                  color: Colors.black_232C28,
                  // width: sWidth(20),
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
          </View> */}

          {error.field === 'vehical.shipping' && (
            <TextRegular
              text={error.message}
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
          <CustomSwitch
            selected={vehicalData?.show_phone}
            setSelected={v => {
              dispatch(setVehicalData({show_phone: v}));
            }}
          />
        </View>

        <View style={[Gutters.mediumVMargin, Layout.overflow]}>
          {user_permissions?.is_allowed == true || isEdit ? (
            <CustomButton
              onPress={
                isUploading.current
                  ? () => {
                      toastDangerMessage('Please Wait!');
                      setTimeout(() => {
                        isUploading.current = false;
                        setReload(reLaod + 1);
                      }, 10000);
                    }
                  : SubmitVehicalForm
              }
              btnStyle={[{backgroundColor: Colors.primary}]}
              text={isEdit ? 'Update' : 'Submit'}
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
                  (edit_single_listing_data?.type ===
                    methodOfSaleConst.auction &&
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
                      (edit_single_listing_data?.type ===
                        methodOfSaleConst.auction &&
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
                  (edit_single_listing_data?.type ===
                    methodOfSaleConst.auction &&
                    edit_single_listing_data?.auction_data.bids_count > 0 &&
                    edit_single_listing_data?.reserve_price <=
                      edit_single_listing_data?.auction_data.current_bid)
                }
                onPress={() => {
                  //todo
                  if (validationsMessages() == true) {
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
                      (edit_single_listing_data?.type ===
                        methodOfSaleConst.auction &&
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
          isUploading.current = false;
          setReload(reLaod + 1);
          setShowBottomSheet(false);
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
                setShowBottomSheet(false);
                dispatch(setVehicalDataEpmty({}));
                dispatch(setCarJam({}));
                dispatch(currentStack(null));
                const popAction = StackActions.pop(4);
                navigation.dispatch(popAction);
                navigation.navigate('HomeContainer' as never);
              }}
            />
          </View>
        </View>
      </CustomBottomSheet>

      <CustomLoading isLoading={uploadImageLoading || isLoading} />
    </View>
  );
};

export default VehicalForm;
