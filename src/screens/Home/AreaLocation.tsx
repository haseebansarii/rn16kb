import React, {useEffect, useState} from 'react';
import {
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import {useDispatch, useSelector} from 'react-redux';
import {
  CustomBottomSheet,
  CustomButton,
  CustomDropDown,
  CustomGooglePlaces,
  CustomInput,
  CustomModal,
  TextMedium,
  TextRegular,
} from '../../components';
import {useTheme} from '../../hooks';
import {
  useLazyGeoCodeApiQuery,
  useLazyGetNearByListingQuery,
  useLazyHomeListingQuery,
} from '../../services/modules/home/homeListing';
import {RootState} from '../../store/store';
import locationImg from '../../theme/assets/images/placeholder.png';
import {locationRadiusData} from '../../utils/dummyData';
import LocationListing from './LocationListing';
import {getURLPhoto, toastDangerMessage} from '../../utils/helpers';
import RadiusDropDown from './RadiusDropDown';
import {screenWidth, sHight, sWidth} from '../../utils/ScreenDimentions';
import RegularText from '../../components/RegularText';
import {setApiCallNearMe, setLocationData} from '../../store/home/ListingSlice';
import Geolocation from '@react-native-community/geolocation';
import {GOOGLE_MAP_API_KEY} from '../../config';
import {useLazyGetCountryNameQuery} from '../../services/auth/signupApi';
import ProductListing from './ProductListing';
import {selectedProduct} from '../../store/productDetail/ProductDetailSlice';
import {fixBottomTab} from '../../store/stack/StackSlice';
import {setSelectedProductData} from '../../store/Listings';
import {useNavigation} from '@react-navigation/native';
import {SvgUri} from 'react-native-svg';

const AreaLocation = ({refreshing}: any) => {
  const dispatch = useDispatch();
  const {Layout, Gutters, Colors, Fonts, Images} = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const locationData = useSelector(
    (state: RootState) => state.homeListing?.locationData,
  );
  const apiCallNearMeFlag = useSelector(
    (state: RootState) => state.homeListing?.apiCallNearMe,
  );

  const [homeListingDataAPI] = useLazyHomeListingQuery();
  const navigation = useNavigation();
  var watchID;
  const [getListing] = useLazyGetNearByListingQuery();
  const [selected, setSelected] = useState('');
  const [location, setLocation] = useState('');
  const [locationMatch, setLocationMatch] = useState({
    address: '',
    lat: '',
    lng: '',
    radius: '',
  });

  const [searchData, setSearchData] = useState([]);

  const [getCountryName] = useLazyGetCountryNameQuery();
  const [locationStatus, setLocationStatus] = useState('');

  const getInitialCallHome = () => {
    homeListingDataAPI(`?&skip=0&limit=12&pageName=home`);
  };
  const getList = (receiveLat, receiveLong) => {
    let lat = receiveLat
      ? receiveLat
      : locationMatch?.lat
      ? locationMatch?.lat
      : '';
    let lng = receiveLong
      ? receiveLong
      : locationMatch?.lng
      ? locationMatch?.lng
      : '';
    let url = `?&pageName=home&skip=0&limit=12&lat=${lat}&lng=${lng}&radius=${
      locationMatch?.radius ? Number(locationMatch?.radius) : ''
    }`;
    if (lat && lng && location === locationMatch.address) {
      setLocationData({
        address: location,
        lat: lat,
        lng: lng,
        radius: locationMatch?.radius,
      });
      getListing(url).then(res => {
        if (res?.data) {
          setSearchData(res?.data?.items);
        } else {
          toastDangerMessage('Something went wrong');
        }
      });
    } else {
      setSearchData([]);
    }
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action

      dispatch(setSelectedProductData({}));
      if (locationData?.lat && locationData?.lng) {
        getList(locationData?.lat, locationData?.lng);
        setLocation(locationData.address);
        setLocationMatch({
          ...locationMatch,
          address: locationData.address,
          lat: locationData.lat,
          lng: locationData.lng,
          radius: locationData.radius,
        });
      } else {
        requestLocationPermission();
      }
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation, locationData]);
  useEffect(() => {
    if (apiCallNearMeFlag) {
      getList(locationData?.lat, locationData?.lng);
      getInitialCallHome();
      dispatch(setApiCallNearMe(false));
    }
  }, [apiCallNearMeFlag]);

  useEffect(() => {
    requestLocationPermission();
    return () => {
      Geolocation.clearWatch(watchID);
    };
  }, []);
  const requestLocationPermission = async () => {
    if (locationData?.lat) {
    } else if (Platform.OS === 'ios') {
      getOneTimeLocation();
      subscribeLocationLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This App needs to Access your location',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //To Check, If Permission is granted
          getOneTimeLocation();
          subscribeLocationLocation();
        } else {
          setLocationStatus('Permission Denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const setSelectedRadius = v => {
    setLocationMatch({
      ...locationMatch,
      radius: v,
    });
  };

  // const RenderItemNearMe = ({item, index}: any) => {
  //   return (
  //     <TouchableOpacity
  //       key={index}
  //       style={[
  //         Gutters.darkShadow,
  //         {
  //           width: '48%',
  //           borderRadius: 10,
  //           marginBottom: 20,
  //           backgroundColor: Colors.white,
  //         },
  //       ]}
  //       onPress={() => {
  //         dispatch(fixBottomTab(false));
  //         dispatch(selectedProduct(item));
  //         dispatch(setSelectedProductData({}));
  //         navigation.navigate('ProductDetailContainer' as never);
  //       }}>
  //       <TouchableOpacity
  //         onPress={() => addRemoveFavourites(item?._id, item?.is_favourite)}
  //         style={{
  //           position: 'absolute',
  //           top: item?.is_favourite ? -1 : 0,
  //           right: 0,
  //           zIndex: 1,
  //         }}>
  //         {item?.is_favourite ? (
  //           <Images.svg.rectangleGroup.default />
  //         ) : (
  //           <Images.svg.EyeRectangle.default />
  //         )}
  //       </TouchableOpacity>
  //       <FastImage
  //         source={
  //           item?.images?.length > 0
  //             ? {
  //                 uri: getURLPhoto(item?.images[0]?.name),
  //               }
  //             : getStaticImage(false)
  //         }
  //         style={{
  //           width: '100%',
  //           height: 120,
  //           borderTopLeftRadius: 10,
  //           borderTopRightRadius: 10,
  //         }}
  //       />
  //       <View
  //         style={[
  //           Layout.selfCenter,
  //           Layout.screenWidth,
  //           Gutters.littleTMargin,
  //           Layout.fill,
  //           Layout.overflow,
  //           Layout.justifyContentAround,
  //           {height: '50%'},
  //         ]}>
  //         <View
  //           style={[
  //             Layout.alignItemsEnd,
  //             Gutters.littleTMargin,
  //             Layout.row,
  //             Layout.justifyContentBetween,
  //             Layout.alignItemsCenter,
  //             {height: 25, width: '100%'},
  //           ]}>
  //           {item?.pickup_location ? (
  //             <View style={[Layout.row, Layout.alignItemsCenter]}>
  //               <Images.svg.LocationTransparent.default width={15} />
  //               <Text
  //                 style={[
  //                   Fonts.poppinReg12,
  //                   Gutters.littleLMargin,
  //                   {color: Colors.black_232C28},
  //                 ]}>
  //                 {item?.pickup_location?.length > 8 &&
  //                   item?.pickup_location.slice(0, 8) + '...'}
  //               </Text>
  //             </View>
  //           ) : (
  //             <View></View>
  //           )}
  //           {item?.end_date && (
  //             <View
  //               style={{
  //                 width: '50%',
  //                 alignItems: 'flex-end',
  //               }}>
  //               <View style={[Layout.row, Layout.alignItemsCenter]}>
  //                 <Images.svg.calendar.default width={15} />
  //                 <Text
  //                   style={[
  //                     Fonts.poppinReg12,
  //                     Gutters.littleLMargin,
  //                     {color: Colors.black_232C28},
  //                   ]}>
  //                   {moment(item?.end_date).format('ddd, DD MMM')}
  //                 </Text>
  //               </View>
  //             </View>
  //           )}
  //         </View>
  //         <View
  //           style={[
  //             Layout.row,
  //             Layout.justifyContentBetween,
  //             Gutters.tinyVMargin,
  //           ]}>
  //           <View style={[Layout.row, Layout.alignItemsCenter]}>
  //             {item?.user?.photo?.name?.endsWith('.svg') ? (
  //               <View
  //                 style={[
  //                   Layout.alignItemsCenter,
  //                   Layout.justifyContentCenter,
  //                   {
  //                     height: 150,
  //                   },
  //                 ]}>
  //                 <SvgUri
  //                   width="100"
  //                   height="100"
  //                   uri={getURLPhoto(item?.user?.photo?.name)}
  //                   style={{
  //                     width: '100%',
  //                     height: 150,
  //                     borderTopLeftRadius: 10,
  //                     borderTopRightRadius: 10,
  //                   }}
  //                 />
  //               </View>
  //             ) : (
  //               <FastImage
  //                 source={
  //                   item?.user?.photo?.name
  //                     ? {
  //                         uri: `${API_URL}get-uploaded-image/${item?.user?.photo?.name}`,
  //                       }
  //                     : require('../../theme/assets/images/user.png')
  //                 }
  //                 style={{
  //                   width: 28,
  //                   height: 28,
  //                   borderRadius: 28 / 2,
  //                 }}
  //               />
  //             )}
  //             {item?.user?.avg_rating_as_seller && (
  //               <View style={[Gutters.littleLMargin]}>
  //                 <StarRating
  //                   disabled={true}
  //                   maxStars={5}
  //                   starSize={20}
  //                   rating={item?.user?.avg_rating_as_seller}
  //                   fullStarColor={Colors.primary}
  //                 />
  //               </View>
  //             )}
  //           </View>
  //         </View>
  //         <Text
  //           numberOfLines={1}
  //           style={[
  //             Fonts.poppinMed14,
  //             // Gutters.tinyTMargin,
  //             Gutters.littleBMargin,
  //             {
  //               fontWeight: '500',
  //               color: Colors.black_232C28,
  //             },
  //           ]}>
  //           {item?.title}
  //         </Text>
  //         <View
  //           style={[
  //             Layout.row,
  //             Layout.fullWidth,
  //             Layout.justifyContentBetween,
  //             Gutters.littleTMargin,
  //             Gutters.tinyBMargin,
  //             Layout.alignItemsCenter,
  //           ]}>
  //           {item?.make_an_offer && item?.type != 'auction' ? (
  //             <View style={[{width: '50%'}]}>
  //               <TouchableOpacity
  //                 onPress={() => {
  //                   dispatch(fixBottomTab(false));
  //                   dispatch(selectedProduct(item));
  //                   dispatch(setSelectedProductData({}));
  //                   navigation.navigate('ProductDetailContainer' as never);
  //                 }}
  //                 style={[
  //                   Gutters.tinyPadding,
  //                   {
  //                     backgroundColor: Colors.lightGreen_DBF5EC,
  //                     borderRadius: 6,
  //                   },
  //                 ]}>
  //                 <Text
  //                   style={[
  //                     Fonts.poppinReg9,
  //                     {color: Colors.black_232C28, textAlign: 'center'},
  //                   ]}>
  //                   Send an Offer
  //                 </Text>
  //               </TouchableOpacity>
  //             </View>
  //           ) : (
  //             <View style={[{width: '50%'}]}>
  //               <Text
  //                 style={[Fonts.poppinMed12, {color: Colors.dark_gray_676C6A}]}>
  //                 Starting:
  //               </Text>

  //               {/* {item?.fixed_price_offer > 4 ? (
  //                 <View>
  //                   <Text
  //                     numberOfLines={3}
  //                     style={[
  //                       Fonts.poppinSemiBold10,
  //                       Gutters.littleTMargin,
  //                       {color: Colors.black_232C28},
  //                     ]}>
  //                     NZ$
  //                   </Text>
  //                   <Text style={[Fonts.poppinSemiBold10]}>
  //                     {item?.type == 'auction'
  //                       ? item?.start_price
  //                       : item?.fixed_price_offer}
  //                   </Text>
  //                 </View>
  //               ) : ( */}
  //               <View style={[{width: '100%'}]}>
  //                 <Text
  //                   numberOfLines={3}
  //                   ellipsizeMode="tail"
  //                   style={[Fonts.poppinBold12]}>
  //                   {item?.type == 'auction'
  //                     ? t('common:nz') + ' ' + item?.start_price
  //                     : t('common:nz') + ' ' + item?.fixed_price_offer}
  //                 </Text>
  //               </View>
  //               {/* )} */}
  //             </View>
  //           )}

  //           {!!item?.buy_now_price && (
  //             <View style={[{width: '50%'}]}>
  //               <Text
  //                 style={[
  //                   Fonts.poppinMed12,
  //                   {color: Colors.primary, textAlign: 'right'},
  //                 ]}>
  //                 {item?.listing_type == 'property'
  //                   ? item?.property?.for_sale
  //                     ? 'Asking Price:'
  //                     : 'Rental Price:'
  //                   : 'Buy Now:'}
  //               </Text>

  //               {/* {`${item?.buy_now_price}`?.length >= 4 ? (
  //                 <View style={[Layout.alignItemsEnd]}>
  //                   <Text
  //                     style={[
  //                       Fonts.poppinSemiBold10,
  //                       Gutters.littleTMargin,
  //                       Layout.selfEnd,
  //                       {color: Colors.primary},
  //                     ]}>
  //                     NZ$
  //                   </Text>
  //                   <Text
  //                     style={[
  //                       Fonts.poppinSemiBold10,
  //                       Layout.selfEnd,
  //                       {color: Colors.primary, textAlign: 'right'},
  //                     ]}>
  //                     {item?.buy_now_price}
  //                   </Text>
  //                 </View>
  //               ) : ( */}
  //               <Text
  //                 style={[
  //                   Fonts.poppinBold12,
  //                   // Gutters.littleBMargin,
  //                   Layout.selfEnd,
  //                   {color: Colors.primary},
  //                 ]}>
  //                 {t('common:nz') + ' ' + item?.buy_now_price}
  //               </Text>
  //               {/* )} */}
  //             </View>
  //           )}
  //         </View>
  //       </View>
  //     </TouchableOpacity>
  //   );
  // };

  const getCurrentLocationName = (lat, lng) => {
    let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAP_API_KEY}`;
    getCountryName(url).then(async (res: any) => {
      let address = res?.data?.results[0]?.formatted_address ?? '';

      setLocation(address);
      setLocationMatch({
        ...locationMatch,
        address: address,
        lat: lat,
        lng: lng,
      });
      dispatch(
        setLocationData({
          ...locationData,
          address: address,
          lat: lat,
          lng: lng,
        }),
      );
    });
  };

  const getOneTimeLocation = () => {
    setLocationStatus('Getting Location ...');
    Geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        setLocationStatus('You are Here');
        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);
        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);

        dispatch(
          setLocationData({
            ...locationData,
            lat: currentLatitude,
            lng: currentLongitude,
          }),
        );
        setLocationMatch({
          ...locationMatch,
          lat: currentLatitude,
          lng: currentLongitude,
        });
        getCurrentLocationName(currentLatitude, currentLongitude);

        getList(currentLatitude, currentLongitude);
      },
      error => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  };

  const subscribeLocationLocation = () => {
    watchID = Geolocation.watchPosition(
      position => {
        //Will give you the location on location change

        setLocationStatus('You are Here');

        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);

        dispatch(
          setLocationData({
            ...locationData,
            lat: currentLatitude,
            lng: currentLongitude,
          }),
        );
        setLocationMatch({
          ...locationMatch,
          lat: currentLatitude,
          lng: currentLongitude,
        });
        getCurrentLocationName(currentLatitude, currentLongitude);

        getList(currentLatitude, currentLongitude);
      },
      error => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 1000,
      },
    );
  };

  useEffect(() => {
    if (!!refreshing) {
      if (locationData?.lat && locationData?.lng) {
        getList(locationData?.lat, locationData?.lng);
        setLocation(locationData.address);
        setLocationMatch({
          ...locationMatch,
          address: locationData.address,
          lat: locationData.lat,
          lng: locationData.lng,
          radius: locationData.radius,
        });
      } else {
        requestLocationPermission();
      }
    }
  }, [refreshing]);

  return (
    <View style={[Layout.fullWidth]}>
      <View
        style={[
          Layout.screen,
          Layout.row,
          Layout.alignItemsCenter,
          Layout.justifyContentBetween,
          Gutters.tinyVMargin,
        ]}>
        <CustomBottomSheet
          visible={modalVisible}
          setShowBottomSheet={setModalVisible}
          icon={false}
          height={sHight(85)}
          statusBarTranslucent={true}>
          <ModalUI
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            setLocation={setLocation}
            location={location}
            locationMatch={locationMatch}
            setLocationMatch={setLocationMatch}
            getList={getList}
            locationData={locationData}
            setSelected={setSelectedRadius}
            selected={locationData?.radius}
            setSearchData={setSearchData}
          />
        </CustomBottomSheet>
        <View style={[]}>
          {searchData?.length > 0 && (
            <Text style={[Fonts.poppinSemiBold20]}>
              {t('common:area_location')}
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => {
            setLocation(locationData.address);
            setLocationMatch({
              address: locationData.address,
              radius: locationData.radius,
              lat: locationData.lat,
              lng: locationData.lng,
            });
            setModalVisible(true);
          }}
          style={[
            Layout.row,
            Layout.alignItemsCenter,
            Gutters.tinyPadding,
            {
              borderColor: Colors.gray_C9C9C9,
              borderWidth: 1,
              borderRadius: 6,
              maxWidth:
                searchData?.length > 0 ? screenWidth * 0.4 : screenWidth * 0.5,
            },
          ]}>
          <Images.svg.LocationMarker.default fill={Colors.primary} />
          <Text
            numberOfLines={1}
            style={[
              Gutters.littleHMargin,
              Fonts.poppinMed15,
              {color: Colors.black_232C28},
            ]}>
            {locationData?.address}
          </Text>
        </TouchableOpacity>
      </View>
      {/* <LocationListing searchData={searchData} /> */}
      <ProductListing
        data={searchData}
        hideNoData={true}
        getInitialDataSeller={getList}
      />
    </View>
  );
};

export default AreaLocation;
type TModalUI = {
  modalVisible: boolean;
  setSelected: CallableFunction;
  selected: string;
  locationData: object;
  location: string;
  getList: CallableFunction;
  setLocation: CallableFunction;
  setModalVisible: CallableFunction;
  locationMatch: object;
  setLocationMatch: CallableFunction;
  setSearchData: any;
};
const ModalUI = ({
  modalVisible,
  setSelected,
  selected,
  locationData,
  getList,
  location,
  setLocation,
  setModalVisible,
  locationMatch,
  setLocationMatch,
  setSearchData,
}: TModalUI) => {
  const {Layout, Gutters, Colors, Fonts, Images} = useTheme();
  const dispatch = useDispatch();
  const [getGeoCod] = useLazyGeoCodeApiQuery();
  const mapRef = React.useRef<MapView | null>(null);
  const [coords, setCoords] = useState({
    lat: 0,
    lng: 0,
  });
  const [errorMessgas, setErrorMessgas] = useState('');
  const [isFocusedGooglePlaces, setIsFocusedGooglePlaces] = useState(false);

  const getGeoCodeLocation = t => {
    getGeoCod(t.trim()).then(res => {
      if (res?.data) {
        setCoords(res?.data?.results[0]?.geometry?.location);
      } else {
        // setErrorMessgas(res?.error?.data?.message || 'Something went wrong!');
        toastDangerMessage(
          res?.error?.data?.message || 'Something went wrong!',
        );
      }
    });
  };
  useEffect(() => {
    mapRef?.current?.animateToRegion({
      latitude: coords?.lat,
      longitude: coords.lng,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    });
  }, [coords]);
  return (
    <View
      style={[
        {
          backgroundColor: Colors.white,
          height: sHight(85),
          flex: 1,
        },
      ]}>
      <View style={[Layout.fullWidth, {borderColor: Colors.gray_C9C9C9}]}>
        <View
          style={[
            Layout.alignItemsCenter,
            Layout.justifyContentBetween,
            Layout.row,
            Gutters.smallVMargin,
          ]}>
          <View style={[Layout.row, Layout.alignItemsCenter]}>
            <Images.svg.location.default width={23} height={23} />
            <Text
              style={[
                Fonts.poppinSemiBold22,
                Gutters.tinyLMargin,
                Gutters.tinyTMargin,
              ]}>
              {t('common:change_location')}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
            <Images.svg.cross.default
              stroke={Colors.dark_gray_676C6A}
              width={23}
              height={23}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={[Layout.fill]}>
        {/* <View style={[Layout.fullWidth, Gutters.smallVMargin]}>
          <CustomInput
            value={location}
            placeholder={t('common:email_phone')}
            headingText={t('common:location')}
            headingTextStyle={[
              Fonts.poppinReg16,
              {color: Colors.black_232C28, fontWeight: '400'},
            ]}
            inputProps={{
              onChangeText: t => {
                setLocation(t);
                errorMessgas && setErrorMessgas('');
                // getGeoCodeLocation(t);
              },
              onSubmitEditing: ({nativeEvent: {text, eventCount, target}}) => {
                setLocation(text);
                // if (text) {
                getGeoCodeLocation(text);
                // } else {
                //   dispatch(setLocationData({lat: '', lng: ''}));
                // }
              },
              onBlur: () => {
                setLocation(location);
                getGeoCodeLocation(location);
              },
            }}
            righticon={true}
            righticonName="LocationTransparent"
            backgroundStyle={[
              Gutters.tinyLPadding,
              {
                borderWidth: 1,
                borderColor: Colors.dark_gray_676C6A,
                backgroundColor: 'transparent',
              },
            ]}
          />
          {errorMessgas && (
            <RegularText text={errorMessgas} textStyle={{color: Colors.red}} />
          )}
        </View> */}
        <TextMedium
          text={t('common:address')}
          textStyle={[
            Gutters.tinyBMargin,
            Gutters.littleLMargin,
            Fonts.poppinSemiBold18,
            {color: Colors.black_232C28},
          ]}
        />
        <View
          style={{
            height: isFocusedGooglePlaces ? 240 : errorMessgas ? 120 : 80,
          }}>
          <CustomGooglePlaces
            isCompleteAddres={true}
            value={location}
            editable={true}
            setFieldValue={(details: any) => {
              setErrorMessgas('');
              setLocationMatch({
                ...locationMatch,
                address: details?.formatted_address,
                ...details?.geometry?.location,
              });
              setCoords(details?.geometry?.location);

              // dispatch(
              //   setLocationData({
              //     ...locationData,
              //     ...details?.geometry?.location,
              //   }),
              // );
            }}
            setPickup={v => {
              setLocation(v ? v : '');
              // setScrollEnabled(true);
            }}
            customStyle={{height: isFocusedGooglePlaces ? 200 : 80}}
            textInputProps={{
              onFocus: () => {
                setIsFocusedGooglePlaces(true); // Set state to true when focused
              },
              onBlur: () => {
                setIsFocusedGooglePlaces(false); // Set state to false when blurred
              },
            }}
          />
          {/*  */}

          {location && errorMessgas && (
            <TextRegular
              text={errorMessgas}
              textStyle={[
                {color: Colors.red, marginLeft: sHight(1), height: 50},
              ]}
            />
          )}
        </View>

        <View style={[]}>
          <RadiusDropDown
            headingText={'Radius'}
            headingTextStyle={[
              Fonts.poppinReg16,
              {color: Colors.black_232C28, fontWeight: '400'},
            ]}
            customListStyle={[{backgroundColor: Colors.white}]}
            customStyle={[
              Gutters.borderWidth,
              {
                backgroundColor: Colors.transparent,
                borderColor: Colors.dark_gray_676C6A,
                color: Colors.primary,
              },
            ]}
            value={selected}
            selectedTextStyle={{color: Colors.black_232C28}}
            setSelected={v => {
              setSelected(v);
            }}
            data={locationRadiusData}
            placeholder={
              !!selected ? selected + ' kilometers' : t('common:select')
            }
          />
        </View>

        {locationMatch?.lat !== '' &&
        locationMatch?.lng !== '' &&
        location &&
        location == locationMatch.address ? (
          <View
            style={[
              Gutters.smallTMargin,
              {height: sHight(25), width: sWidth(100) - 20},
            ]}>
            <MapView
              ref={mapRef}
              style={{height: sHight(25), width: sWidth(100) - 20}}
              provider={
                Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
              }
              loadingEnabled={true}
              // showsUserLocation={true}
              // showsCompass={false}
              // zoomEnabled={true}
              // zoomTapEnabled={true}
              // zoomControlEnabled={true}
              // scrollEnabled={true}
              // cacheEnabled={true}
              // maxZoomLevel={12}
              // pitchEnabled={true}
              // paddingAdjustmentBehavior={'never'}
              // mapType={'none'}
              region={{
                latitude: parseFloat(locationMatch?.lat), //|| locationData?.lat,
                longitude: parseFloat(locationMatch?.lng), //|| locationData?.lng,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              initialRegion={{
                latitude: -36.8485,
                longitude: 174.7633,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}>
              <Marker
                coordinate={{
                  latitude: parseFloat(locationMatch?.lat),
                  longitude: parseFloat(locationMatch?.lng),
                }}
                // image={locationImg}
              />
            </MapView>
          </View>
        ) : (
          <View style={{height: sHight(30), width: sWidth(100) - 20}}></View>
        )}
      </View>
      <View style={[Gutters.smallVMargin]}>
        <CustomButton
          text={'Apply'}
          onPress={() => {
            if (location && location !== locationMatch.address) {
              setErrorMessgas('Please select address from dropdown');
            } else {
              setModalVisible(false);

              if (location) {
                dispatch(
                  setLocationData({
                    address: location,
                    lat: locationMatch?.lat,
                    lng: locationMatch?.lng,
                    radius: locationMatch?.radius,
                  }),
                );
                getList(locationMatch?.lat, locationMatch?.lng);
              } else {
                setSearchData([]);
                dispatch(
                  setLocationData({
                    address: location,
                    lat: '',
                    lng: '',
                    radius: locationMatch?.radius,
                  }),
                );
                setLocationMatch({
                  ...locationMatch,
                  lat: '',
                  lng: '',
                  address: '',
                });
              }
            }
          }}
          textStyle={[Fonts.poppinSemiBold18, {color: Colors.white}]}
          btnStyle={[{backgroundColor: Colors.primary}]}
        />
      </View>
    </View>
  );
};
