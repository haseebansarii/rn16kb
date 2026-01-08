import i18next, {t} from 'i18next';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Linking,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Dimensions,
} from 'react-native';
import {Filters, SortBy} from '.';
import {
  CustomBottomSheet,
  CustomButton,
  CustomDatePicker,
  CustomDropDown,
  CustomFastImage,
  CustomHeader,
  CustomInput,
  CustomLoading,
  CustomRadioButton,
  TextMedium,
  TextRegular,
  TextSemiBold,
} from '../../components';
import {useTheme} from '../../hooks';
import {
  SortByFixedPrice,
  itemTypeData,
  newUsedItem,
  shippingData,
  vehicleBodyStyles,
  vehicleFuelTypes,
  transmissionTypes,
  priceOptions,
  generateYearOptions,
  doorOptions,
  seatOptions,
} from '../../utils/dummyData';

import dayjs from 'dayjs';
import {useDispatch, useSelector} from 'react-redux';
import {
  useLazyGetListDataQuery,
  useLazyGetListingFiltersQuery,
} from '../../services/modules/Listings/getList';
import {selectedProduct} from '../../store/productDetail/ProductDetailSlice';
import {fixBottomTab} from '../../store/stack/StackSlice';
import {
  getPlaceHolderProduct,
  getURLPhoto,
  showUserAlert,
} from '../../utils/helpers';
import {
  useAddFavouriteListingMutation,
  useRemoveFavouriteListingMutation,
} from '../../services/modules/home/favouriteListing';
import {Image} from 'react-native';
import moment from 'moment';
import {
  setSearchCatagories,
  setSearchFilter,
  setSearchSubCatagory,
} from '../../store/home/ListingSlice';
import {useDebouncedEffect} from '../../hooks/useDebounced';
import {setlistData, setSelectedProductData} from '../../store/Listings';
import {sHight} from '../../utils/ScreenDimentions';
import {SvgUri} from 'react-native-svg';
import {useIsFocused} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import {RootState} from '@reduxjs/toolkit/query';
import makesAndModels from './makesAndModels.json';

// Location data for New Zealand regions
const locationOptions = [
  'New Zealand',
  'Whangarei',
  'Auckland',
  'Hamilton',
  'Tauranga',
  'Rotorua',
  'Gisborne',
  'Taupo',
  'Napier',
  'Hastings',
  'New Plymouth',
  'Hāwera',
  'Whanganui',
  'Palmerston North',
  'Masterton',
  'Levin',
  'Paraparaumu',
  'Wellington',
  'Nelson',
  'Blenheim',
  'Kaikoura',
  'Greymouth',
  'Christchurch',
  'Ashburton',
  'Timaru',
  'Dunedin',
  'Queenstown',
  'Invercargill',
];

const formatCurrency = (value: any, symbol = 'NZ$') => {
  if (!value) return 'NZ$ 0.00';
  const numericValue = parseFloat(value);
  if (isNaN(numericValue)) return 'NZ$ 0.00';
  const formattedValue = numericValue.toLocaleString('en-NZ', {
    maximumFractionDigits: 2,
  });
  return symbol + ' ' + formattedValue;
};

function isOneMillionOrMore(value?: number): boolean {
  if (typeof value !== 'number') return false;
  return value >= 1_000_000;
}

const SMALL_WIDTH_DEVICE = 400;
type Props = {navigation: any};

const IBuyContainer = ({navigation, route}: any) => {
  const screenWidth = Dimensions.get('window').width;
  const {Colors, Fonts, Gutters, Images, Layout} = useTheme();
  const scrollViewRef = useRef();
  const selectedCountry = useSelector(
    (state: RootState) => state.homeListing?.selectedCountry,
  );
  const searchCatagories = useSelector(
    (state: RootState) => state.homeListing?.searchCatagories,
  );
  const searchSubCategory = useSelector(
    (state: RootState) => state.homeListing?.searchSubCategory,
  );
  const searchFilter = useSelector(
    (state: RootState) => state.homeListing?.searchFilter,
  );

  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState('');
  const [sortByCatagory, setsortByCatagory] = useState(0);

  const [filterSearch, setFilterSearch] = useState(0);
  const [filterSearchParam, setFilterSearchParam] = useState('');

  const [sortBy, setSortBy] = useState(false);

  const [newAndUsedItem, setNewAndUsedItem] = useState(0);
  const [newusedItemParam, setnewUsedItemParam] = useState('');

  const [shippingItem, setShippingItem] = useState(null);
  const [freeShippingParam, setFreeShippingParam] = useState('');
  const [pickupAvailableParam, setPickupAvailableParam] = useState('');

  const [selectedFromDate, setSelectedFromDate] = useState('');
  const [selectedFromDateParam, setSelectedFromDateParam] = useState('');

  const [selectedToDate, setSelectedToDate] = useState('');
  const [selectedToDateParam, setSelectedToDateParam] = useState('');

  const [selectedArea, setselectedArea] = useState({
    region: '',
    district: '',
    subrub: '',
  });
  const [selectedAreaParam, setSelectedAreaParam] = useState('');

  const [priceValue, setPriceValue] = useState({
    fromPrice: null,
    toPrice: null,
  });
  const [fromPriceValueParam, setFromPriceValueParam] = useState('');
  const [toPriceValueParam, setToPriceValueParam] = useState('');

  // Automotive filter states
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYearFrom, setSelectedYearFrom] = useState('');
  const [selectedYearTo, setSelectedYearTo] = useState('');
  const [selectedPriceFrom, setSelectedPriceFrom] = useState('');
  const [selectedPriceTo, setSelectedPriceTo] = useState('');
  const [selectedBodyStyles, setSelectedBodyStyles] = useState<string[]>([]);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);
  const [selectedOdometerFrom, setSelectedOdometerFrom] = useState('');
  const [selectedOdometerTo, setSelectedOdometerTo] = useState('');
  const [selectedTransmission, setSelectedTransmission] = useState('');
  const [selectedDoors, setSelectedDoors] = useState('');
  const [selectedSeats, setSelectedSeats] = useState('');

  // Location filter state
  const [selectedLocation, setSelectedLocation] = useState('');

  const [ShowBottomSheet, setShowBottomSheet] = useState(false);

  const [categoryFilterParam, setCategoryFilterParam] = useState('');
  const [subCategoryFilterParam, setSubCategoryFilterParam] = useState('');
  const loadMoreInProcess = useRef(false);
  const showFilter = key => {
    let v = listFilters?.some(item => item.key === key);
    return v;
  };

  const [searchText, setSearchText] = useState(
    route?.params?.search ? route?.params?.search : '',
  );

  const dispatch = useDispatch();

  const [getListDataIbuy] = useLazyGetListDataQuery();

  const [getListFilters] = useLazyGetListingFiltersQuery();

  const [removeFavouriteListing, {isLoading: isLoadingRemoveFav}] =
    useRemoveFavouriteListingMutation();
  const [addFavoriteListing, {isLoading: isLoadingAddFav}] =
    useAddFavouriteListingMutation();

  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum,
  ] = useState(false);
  const [isLoadingBottom, setIsLoadingBottom] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const listData = useSelector((state: any) => state?.list?.listData);

  const guest = useSelector((state: RootState) => state.auth?.guest);
  const token = useSelector((state: RootState) => state.auth?.token);
  const listFilters = useSelector((state: any) => state?.list?.listFilters);
  const categories = useSelector((state: any) => state?.catagories?.categories);

  // Function to check if current category is Automotive
  const isAutomotiveCategory = () => {
    if (!searchCatagories) return false;

    return (
      searchCatagories === '66bebc0f8a6cf6006e47b63a' ||
      searchCatagories === '66bec2088a6cf6006e47ba14'
    );
  };

  // Function to get available models for selected make
  const getAvailableModels = (make: string) => {
    if (!make || !(makesAndModels as any)[make]) return [];
    return (makesAndModels as any)[make];
  };

  const getData = async ({skip = 0, clear = false, limit = 30}) => {
    // ${
    //   searchFilterParam && searchFilterParam
    // } // conflict in title from typing search
    // Build automotive filter parameters
    const automotiveFilters = isAutomotiveCategory()
      ? [
          selectedMake ? `&make=${selectedMake}` : '',
          selectedModel ? `&model=${selectedModel}` : '',
          selectedYearFrom ? `&from_year=${selectedYearFrom}` : '',
          selectedYearTo ? `&to_year=${selectedYearTo}` : '',
          selectedPriceFrom ? `&from_price=${selectedPriceFrom}` : '',
          selectedPriceTo ? `&to_price=${selectedPriceTo}` : '',
          selectedBodyStyles.length > 0
            ? `&body_style=${encodeURIComponent(
                JSON.stringify(selectedBodyStyles),
              )}`
            : '',
          selectedFuelTypes.length > 0
            ? `&fuel_type=${encodeURIComponent(
                JSON.stringify(selectedFuelTypes),
              )}`
            : '',
          selectedOdometerFrom ? `&from_odometer=${selectedOdometerFrom}` : '',
          selectedOdometerTo ? `&to_odometer=${selectedOdometerTo}` : '',
          selectedTransmission && selectedTransmission !== 'All'
            ? `&transmission=${
                selectedTransmission === 'Automatic' ? 'auto' : 'manual'
              }`
            : '',
          selectedDoors && selectedDoors !== 'Any'
            ? `&number_of_doors=${selectedDoors}`
            : '',
          selectedSeats && selectedSeats !== 'Any'
            ? `&number_of_seats=${selectedSeats}`
            : '',
        ].join('')
      : '';

    // Debug log to verify body styles and fuel types are being sent correctly
    if (selectedBodyStyles.length > 0) {
      console.log('>>> Body Styles being sent:', selectedBodyStyles);
      console.log(
        '>>> Body Styles as query param:',
        `&body_style=${encodeURIComponent(JSON.stringify(selectedBodyStyles))}`,
      );
    }

    if (selectedFuelTypes.length > 0) {
      console.log('>>> Fuel Types being sent:', selectedFuelTypes);
      console.log(
        '>>> Fuel Types as query param:',
        `&fuel_type=${encodeURIComponent(JSON.stringify(selectedFuelTypes))}`,
      );
    }

    if (selectedTransmission && selectedTransmission !== 'All') {
      console.log('>>> Transmission being sent:', selectedTransmission);
      console.log(
        '>>> Transmission as query param:',
        `&transmission=${
          selectedTransmission === 'Automatic' ? 'auto' : 'manual'
        }`,
      );
    }

    let search = `${filterSearchParam && filterSearchParam}${
      categoryFilterParam && categoryFilterParam
    }${subCategoryFilterParam && subCategoryFilterParam}${
      newusedItemParam && newusedItemParam
    }${selectedLocation ? `&pickup_location=${selectedLocation}` : ''}${
      fromPriceValueParam && fromPriceValueParam
    }${toPriceValueParam && toPriceValueParam}${
      selectedFromDateParam && selectedFromDateParam
    }${selectedToDateParam && selectedToDateParam}${
      freeShippingParam && freeShippingParam
    }${pickupAvailableParam && pickupAvailableParam}${
      searchCatagories ? `&category=${searchCatagories}` : ''
    }${searchSubCategory ? `&sub_category=${searchSubCategory}` : ''}${
      searchText ? `&title=${searchText}` : ''
    }${selectedCountry && `&country=${selectedCountry}`}${automotiveFilters}`;

    search = clear
      ? `${selectedCountry && `&country=${selectedCountry}`}`
      : search;

    let param = {
      filters: true,
      pageName: 'ibuy',
      searchFilters: search,
      skip: skip ? skip : 0,
      limit: limit,
    };

    console.log('>>> API call params:', param);
    console.log('>>> Full search string:', search);

    try {
      await getListDataIbuy(param).finally(() => {
        loadMoreInProcess.current = false;
        setRefreshing(false);
        setIsLoading(false);
        setIsLoadingBottom(false);
        setIsFilterLoading(false); // Make sure filter loading is reset
        if (
          listData?.pagination?.skip + listData?.pagination?.limit >=
          listData?.pagination?.total
        ) {
          setIsLoadingBottom(false);
        }
      });
    } catch (error) {
      console.error('>>> API call error:', error);
      setIsLoading(false);
      setIsFilterLoading(false);
      setRefreshing(false);
      setIsLoadingBottom(false);
    }
  };

  useEffect(() => {
    getListFilters('');
  }, []);

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = sHight(60);

    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };
  const itemType = () => {
    return (
      <View
        style={[
          Layout.fill,
          Gutters.littlePadding,
          Layout.column,
          Layout.justifyContentBetween,
        ]}>
        <View>
          <View
            style={[
              i18next.language === 'en' ? Layout.row : Layout.rowReverse,
              Layout.alignItemsCenter,
              Layout.justifyContentBetween,
            ]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={closeBottomSheet}
              style={[Layout.row, Layout.alignItemsCenter]}>
              <Images.svg.cross.default
                stroke={'black'}
                width={20}
                height={20}
              />
              <TextSemiBold
                text={t('common:item_type')}
                textStyle={[
                  Fonts.poppinSemiBold24,
                  Gutters.littleTMargin,
                  Gutters.tinyLMargin,
                  {color: Colors.black_232C28},
                ]}
              />
            </TouchableOpacity>
            {/* <TextSemiBold
              text={`2,582 ${t('common:results')}`}
              textStyle={[
                Fonts.poppinSemiBold14,
                {textTransform: 'none', color: Colors.black_232C28},
              ]}
            /> */}
          </View>
          <View style={[Layout.fill, Gutters.smallTMargin]}>
            {itemTypeData?.map((item, index) => {
              const {title, id} = item;
              return (
                <View
                  style={[
                    i18next.language === 'en' ? Layout.row : Layout.rowReverse,
                    Layout.alignItemsCenter,
                    Layout.justifyContentBetween,
                    Gutters.tinyVPadding,
                    Gutters.littleHPadding,
                    {
                      borderTopWidth: 1,
                      borderColor: Colors.gray_C9C9C9,
                    },
                  ]}>
                  <TextMedium
                    text={title}
                    textStyle={[{color: Colors.black_232C28}]}
                  />
                  <View
                    style={[
                      i18next.language === 'en'
                        ? Layout.row
                        : Layout.rowReverse,
                      Layout.alignItemsCenter,
                    ]}>
                    <CustomRadioButton
                      selected={filterSearch}
                      index={index}
                      setSelected={index => {
                        setFilterSearch(index);
                        makeFilterPerameterFunc();
                      }}
                      customStyle={[Layout.selfEnd, {marginBottom: 0}]}
                      customRadioStyle={[
                        {
                          width: 24,
                          height: 24,
                          borderWidth: 2,
                          borderColor:
                            filterSearch === index
                              ? Colors.primary
                              : Colors.dark_gray_676C6A,
                        },
                      ]}
                      innerCircle={[{width: 12, height: 12}]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>
        <View style={[Gutters.smallBMargin]}>
          <CustomButton
            text={t('common:view_results')}
            onPress={makeFilterPerameterFunc}
            btnStyle={[{backgroundColor: Colors.primary}]}
            textStyle={[Fonts.poppinSemiBold24, {color: Colors.white}]}
          />
        </View>
      </View>
    );
  };

  const new_And_Used = () => {
    return (
      <View
        style={[
          Layout.fill,
          Gutters.littlePadding,
          Layout.column,
          Layout.justifyContentBetween,
        ]}>
        <View>
          <View
            style={[
              i18next.language === 'en' ? Layout.row : Layout.rowReverse,
              Layout.alignItemsCenter,
              Layout.justifyContentBetween,
            ]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowBottomSheet(false)}
              style={[Layout.row, Layout.alignItemsCenter]}>
              <Images.svg.cross.default
                stroke={'black'}
                width={20}
                height={20}
              />
              <TextSemiBold
                text={t('common:new_and_used')}
                textStyle={[
                  Fonts.poppinSemiBold24,
                  Gutters.littleTMargin,
                  Gutters.tinyLMargin,
                  {color: Colors.black_232C28},
                ]}
              />
            </TouchableOpacity>
            {/* <TextSemiBold
              text={`2,582 ${t('common:results')}`}
              textStyle={[
                Fonts.poppinSemiBold14,
                {textTransform: 'none', color: Colors.black_232C28},
              ]}
            /> */}
          </View>
          <View style={[Layout.fill, Gutters.smallTMargin]}>
            {newUsedItem?.map((item, index) => {
              const {title, id} = item;
              return (
                <View
                  style={[
                    i18next.language === 'en' ? Layout.row : Layout.rowReverse,
                    Layout.alignItemsCenter,
                    Layout.justifyContentBetween,
                    Gutters.tinyVPadding,
                    Gutters.littleHPadding,
                    {
                      borderTopWidth: 1,
                      borderColor: Colors.gray_C9C9C9,
                    },
                  ]}>
                  <TextMedium
                    text={title}
                    textStyle={[{color: Colors.black_232C28}]}
                  />
                  <View
                    style={[
                      i18next.language === 'en'
                        ? Layout.row
                        : Layout.rowReverse,
                      Layout.alignItemsCenter,
                    ]}>
                    {/* <TextMedium
                      text={`(2,582)`}
                      textStyle={[
                        Fonts.poppinMed12,
                        Gutters.tinyRMargin,
                        {color: Colors.dark_gray_676C6A},
                      ]}
                    /> */}

                    <CustomRadioButton
                      selected={newAndUsedItem}
                      index={index}
                      setSelected={index => {
                        setNewAndUsedItem(index);
                        makeFilterPerameterFunc();
                      }}
                      customStyle={[Layout.selfEnd, {marginBottom: 0}]}
                      customRadioStyle={[
                        {
                          width: 24,
                          height: 24,
                          borderWidth: 2,
                          borderColor:
                            newAndUsedItem === index
                              ? Colors.primary
                              : Colors.dark_gray_676C6A,
                        },
                      ]}
                      innerCircle={[{width: 12, height: 12}]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>
        <View style={[Gutters.smallBMargin]}>
          <CustomButton
            text={t('common:view_results')}
            onPress={makeFilterPerameterFunc}
            btnStyle={[{backgroundColor: Colors.primary}]}
            textStyle={[Fonts.poppinSemiBold24, {color: Colors.white}]}
          />
        </View>
      </View>
    );
  };
  const shipping = () => {
    return (
      <View
        style={[
          Layout.fill,
          Gutters.littlePadding,
          Layout.column,
          Layout.justifyContentBetween,
        ]}>
        <View>
          <View
            style={[
              i18next.language === 'en' ? Layout.row : Layout.rowReverse,
              Layout.alignItemsCenter,
              Layout.justifyContentBetween,
            ]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setShippingItem(null);
                setShowBottomSheet(false);
              }}
              style={[Layout.row, Layout.alignItemsCenter]}>
              <Images.svg.cross.default
                stroke={'black'}
                width={20}
                height={20}
              />
              <TextSemiBold
                text={t('common:shipping')}
                textStyle={[
                  Fonts.poppinSemiBold24,
                  Gutters.littleTMargin,
                  Gutters.tinyLMargin,
                  {color: Colors.black_232C28},
                ]}
              />
            </TouchableOpacity>
          </View>
          <View style={[Layout.fill, Gutters.smallTMargin]}>
            {shippingData?.map((item, index) => {
              const {title, id} = item;
              return (
                <View
                  style={[
                    i18next.language === 'en' ? Layout.row : Layout.rowReverse,
                    Layout.alignItemsCenter,
                    Layout.justifyContentBetween,
                    Gutters.tinyVPadding,
                    Gutters.littleHPadding,
                    {
                      borderTopWidth: 1,
                      borderColor: Colors.gray_C9C9C9,
                    },
                  ]}>
                  <TextMedium
                    text={title}
                    textStyle={[{color: Colors.black_232C28}]}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setShippingItem(id);
                      makeFilterPerameterFunc();
                    }}
                    style={[
                      i18next.language === 'en'
                        ? Layout.row
                        : Layout.rowReverse,
                      Layout.alignItemsCenter,
                      Layout.center,
                      {
                        height: 20,
                        width: 20,
                        borderWidth: 1,
                        borderColor: Colors.black_232C28,
                      },
                    ]}>
                    {shippingItem == id && (
                      <View
                        style={{
                          height: 13,
                          width: 13,
                          borderWidth: 1,
                          backgroundColor: Colors.primary,
                        }}></View>
                    )}
                    {/* <CustomCheckBox
                      customStyle={[
                        {
                          borderColor: Colors.dark_gray_676C6A,
                        },
                      ]}
                      // selected={true}
                      index={index}
                      setSelected={v => {
                        setShippingItem(v);
                      }}
                    /> */}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>

        <View style={[Gutters.smallBMargin]}>
          <CustomButton
            text={t('common:view_results')}
            onPress={makeFilterPerameterFunc}
            btnStyle={[{backgroundColor: Colors.primary}]}
            textStyle={[Fonts.poppinSemiBold24, {color: Colors.white}]}
          />
        </View>
      </View>
    );
  };
  const PriceRange = () => {
    return (
      <View
        style={[
          Layout.fill,
          Gutters.littlePadding,
          Layout.column,
          Layout.justifyContentBetween,
        ]}>
        <View>
          <View
            style={[
              i18next.language === 'en' ? Layout.row : Layout.rowReverse,
              Layout.alignItemsCenter,
              Layout.justifyContentBetween,
              Gutters.smallBPadding,
              {
                borderBottomWidth: 1,
                borderColor: Colors.gray_C9C9C9,
              },
            ]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowBottomSheet(false)}
              style={[Layout.row, Layout.alignItemsCenter]}>
              <Images.svg.cross.default
                stroke={'black'}
                width={20}
                height={20}
              />
              <TextSemiBold
                text={t('common:price_range')}
                textStyle={[
                  Fonts.poppinSemiBold24,
                  Gutters.littleTMargin,
                  Gutters.tinyLMargin,
                  {color: Colors.black_232C28},
                ]}
              />
            </TouchableOpacity>
          </View>

          <View style={[Gutters.smallTMargin]}>
            <CustomInput
              placeholder={t('common:From')}
              headingText={t('common:From')}
              headingTextStyle={[
                Fonts.poppinSemiBold16,
                {color: Colors.black_232C28},
              ]}
              inputProps={{
                onChangeText: (t: any) =>
                  setPriceValue(prevState => ({
                    ...prevState,
                    fromPrice: t,
                  })),
              }}
              backgroundStyle={[
                {
                  borderWidth: 1,
                  width: '100%',
                  backgroundColor: 'transparent',
                },
              ]}
            />
          </View>
          <View style={[Gutters.smallTMargin]}>
            <CustomInput
              placeholder={t('common:To')}
              headingText={t('common:To')}
              headingTextStyle={[
                Fonts.poppinSemiBold16,
                {color: Colors.black_232C28},
              ]}
              inputProps={{
                onChangeText: (t: any) =>
                  setPriceValue(prevState => ({
                    ...prevState,
                    toPrice: t,
                  })),
              }}
              backgroundStyle={[
                {
                  borderWidth: 1,
                  width: '100%',
                  backgroundColor: 'transparent',
                },
              ]}
            />
          </View>
        </View>

        <View style={[Gutters.smallBMargin]}>
          <CustomButton
            text={t('common:view_results')}
            onPress={makeFilterPerameterFunc}
            btnStyle={[{backgroundColor: Colors.primary}]}
            textStyle={[Fonts.poppinSemiBold24, {color: Colors.white}]}
          />
        </View>
      </View>
    );
  };
  const AuctionDate = () => {
    return (
      <View
        style={[
          Layout.fill,
          Gutters.littlePadding,
          Layout.column,
          Layout.justifyContentBetween,
        ]}>
        <View>
          <View
            style={[
              i18next.language === 'en' ? Layout.row : Layout.rowReverse,
              Layout.alignItemsCenter,
              Layout.justifyContentBetween,
              Gutters.smallBPadding,
              {
                borderBottomWidth: 1,
                borderColor: Colors.gray_C9C9C9,
              },
            ]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowBottomSheet(false)}
              style={[Layout.row, Layout.alignItemsCenter]}>
              <Images.svg.cross.default
                stroke={'black'}
                width={20}
                height={20}
              />
              <TextSemiBold
                text={t('common:auction_date')}
                textStyle={[
                  Fonts.poppinSemiBold24,
                  Gutters.littleTMargin,
                  Gutters.tinyLMargin,
                  {color: Colors.black_232C28},
                ]}
              />
            </TouchableOpacity>
          </View>
          <View style={[Gutters.tinyHPadding, Gutters.smallTMargin]}>
            <CustomDatePicker
              selectDate={selectedFromDate}
              setSelectedDate={date => {
                //  const formatedDate = moment(date).format('YYYY-MM-DD');
                setSelectedFromDate(date);
              }}
              maximumDate={new Date()}
              headingText={t('common:From')}
              customHeadingStyle={[{color: Colors.black_232C28}]}
              rightIcon={true}
              rightIconName="calendar"
              customBackgroundStyle={[
                Layout.row,
                Layout.alignItemsCenter,
                Layout.justifyContentBetween,
                {
                  backgroundColor: Colors.light_grayF4F4F4,
                  borderWidth: 1,
                  borderColor: Colors.black_232C28,
                },
              ]}
            />
          </View>
          <View style={[Gutters.tinyHPadding, Gutters.smallTMargin]}>
            <CustomDatePicker
              selectDate={selectedToDate}
              setSelectedDate={date => {
                // const formatedDate = dayjs(`${date}`).format('YYYY-MM-DD');
                setSelectedToDate(date);
              }}
              maximumDate={new Date()}
              headingText={'To'}
              customHeadingStyle={[{color: Colors.black_232C28}]}
              rightIcon={true}
              rightIconName="calendar"
              customBackgroundStyle={[
                Layout.row,
                Layout.alignItemsCenter,
                Layout.justifyContentBetween,
                {
                  backgroundColor: Colors.light_grayF4F4F4,
                  borderWidth: 1,
                  borderColor: Colors.black_232C28,
                },
              ]}
            />
          </View>
        </View>
        <View style={[Gutters.smallBMargin]}>
          <CustomButton
            text={t('common:view_results')}
            onPress={makeFilterPerameterFunc}
            btnStyle={[{backgroundColor: Colors.primary}]}
            textStyle={[Fonts.poppinSemiBold24, {color: Colors.white}]}
          />
        </View>
      </View>
    );
  };
  const Location = () => {
    return (
      <View
        style={[
          Layout.fill,
          Gutters.littlePadding,
          Layout.column,
          Layout.justifyContentBetween,
        ]}>
        <View>
          <View
            style={[
              i18next.language === 'en' ? Layout.row : Layout.rowReverse,
              Layout.alignItemsCenter,
              Layout.justifyContentBetween,
            ]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowBottomSheet(false)}
              style={[Layout.row, Layout.alignItemsCenter]}>
              <Images.svg.cross.default
                stroke={'black'}
                width={20}
                height={20}
              />
              <TextSemiBold
                text={t('common:location')}
                textStyle={[
                  Fonts.poppinSemiBold24,
                  Gutters.littleTMargin,
                  Gutters.tinyLMargin,
                  {color: Colors.black_232C28},
                ]}
              />
            </TouchableOpacity>
          </View>
          <View style={[Layout.fill, Gutters.smallTMargin]}>
            {locationOptions.map((location, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedLocation(location);
                  makeFilterPerameterFunc();
                }}
                style={[
                  i18next.language === 'en' ? Layout.row : Layout.rowReverse,
                  Layout.alignItemsCenter,
                  Layout.justifyContentBetween,
                  Gutters.tinyVPadding,
                  Gutters.littleHPadding,
                  {
                    borderTopWidth: 1,
                    borderColor: Colors.gray_C9C9C9,
                    backgroundColor:
                      selectedLocation === location
                        ? Colors.light_grayF4F4F4
                        : 'transparent',
                  },
                ]}>
                <TextMedium
                  text={location}
                  textStyle={[{color: Colors.black_232C28}]}
                />
                {selectedLocation === location && (
                  <Images.svg.tick.default
                    width={20}
                    height={20}
                    stroke={Colors.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const closeBottomSheet = () => {
    setSelected(20);
    setShowBottomSheet(false);
  };

  // Automotive filter components
  const MakeFilter = () => {
    return (
      <View
        style={[
          Layout.fill,
          Gutters.littlePadding,
          Layout.column,
          Layout.justifyContentBetween,
        ]}>
        <View>
          <View
            style={[
              i18next.language === 'en' ? Layout.row : Layout.rowReverse,
              Layout.alignItemsCenter,
              Layout.justifyContentBetween,
            ]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowBottomSheet(false)}
              style={[Layout.row, Layout.alignItemsCenter]}>
              <Images.svg.cross.default
                stroke={'black'}
                width={20}
                height={20}
              />
              <TextSemiBold
                text="Make"
                textStyle={[
                  Fonts.poppinSemiBold24,
                  Gutters.littleTMargin,
                  Gutters.tinyLMargin,
                  {color: Colors.black_232C28},
                ]}
              />
            </TouchableOpacity>
          </View>
          <View style={[Layout.fill, Gutters.smallTMargin]}>
            {Object.keys(makesAndModels).map((make, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedMake(make);
                  setSelectedModel(''); // Reset model when make changes
                  makeFilterPerameterFunc();
                }}
                style={[
                  i18next.language === 'en' ? Layout.row : Layout.rowReverse,
                  Layout.alignItemsCenter,
                  Layout.justifyContentBetween,
                  Gutters.tinyVPadding,
                  Gutters.littleHPadding,
                  {
                    borderTopWidth: 1,
                    borderColor: Colors.gray_C9C9C9,
                    backgroundColor:
                      selectedMake === make
                        ? Colors.light_grayF4F4F4
                        : 'transparent',
                  },
                ]}>
                <TextMedium
                  text={make}
                  textStyle={[{color: Colors.black_232C28}]}
                />
                {selectedMake === make && (
                  <Images.svg.tick.default
                    width={20}
                    height={20}
                    stroke={Colors.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const ModelFilter = () => {
    const availableModels = getAvailableModels(selectedMake);

    return (
      <View
        style={[
          Layout.fill,
          Gutters.littlePadding,
          Layout.column,
          Layout.justifyContentBetween,
        ]}>
        <View>
          <View
            style={[
              i18next.language === 'en' ? Layout.row : Layout.rowReverse,
              Layout.alignItemsCenter,
              Layout.justifyContentBetween,
            ]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowBottomSheet(false)}
              style={[Layout.row, Layout.alignItemsCenter]}>
              <Images.svg.cross.default
                stroke={'black'}
                width={20}
                height={20}
              />
              <TextSemiBold
                text="Model"
                textStyle={[
                  Fonts.poppinSemiBold24,
                  Gutters.littleTMargin,
                  Gutters.tinyLMargin,
                  {color: Colors.black_232C28},
                ]}
              />
            </TouchableOpacity>
          </View>
          {!selectedMake ? (
            <View style={[Layout.center, Gutters.smallTMargin]}>
              <TextMedium
                text="Please select a make first"
                textStyle={[{color: Colors.dark_gray_676C6A}]}
              />
            </View>
          ) : (
            <View style={[Layout.fill, Gutters.smallTMargin]}>
              {availableModels.map((model, index) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedModel(model);
                    makeFilterPerameterFunc();
                  }}
                  style={[
                    i18next.language === 'en' ? Layout.row : Layout.rowReverse,
                    Layout.alignItemsCenter,
                    Layout.justifyContentBetween,
                    Gutters.tinyVPadding,
                    Gutters.littleHPadding,
                    {
                      borderTopWidth: 1,
                      borderColor: Colors.gray_C9C9C9,
                      backgroundColor:
                        selectedModel === model
                          ? Colors.light_grayF4F4F4
                          : 'transparent',
                    },
                  ]}>
                  <TextMedium
                    text={model}
                    textStyle={[{color: Colors.black_232C28}]}
                  />
                  {selectedModel === model && (
                    <Images.svg.tick.default
                      width={20}
                      height={20}
                      stroke={Colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        <View style={[Gutters.smallBMargin]}>
          <CustomButton
            text={t('common:view_results')}
            onPress={makeFilterPerameterFunc}
            btnStyle={[{backgroundColor: Colors.primary}]}
            textStyle={[Fonts.poppinSemiBold24, {color: Colors.white}]}
          />
        </View>
      </View>
    );
  };

  const YearFilter = () => {
    // Generate year options from 1920 to 2025 in reverse order
    const yearOptions = Array.from(
      {length: 2025 - 1920 + 1},
      (_, i) => 1920 + i,
    ).reverse();

    return (
      <View
        style={[
          Layout.fill,
          Gutters.littlePadding,
          Layout.column,
          Layout.justifyContentBetween,
        ]}>
        <View>
          <View
            style={[
              i18next.language === 'en' ? Layout.row : Layout.rowReverse,
              Layout.alignItemsCenter,
              Layout.justifyContentBetween,
            ]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowBottomSheet(false)}
              style={[Layout.row, Layout.alignItemsCenter]}>
              <Images.svg.cross.default
                stroke={'black'}
                width={20}
                height={20}
              />
              <TextSemiBold
                text="Year"
                textStyle={[
                  Fonts.poppinSemiBold24,
                  Gutters.littleTMargin,
                  Gutters.tinyLMargin,
                  {color: Colors.black_232C28},
                ]}
              />
            </TouchableOpacity>
          </View>
          <View style={[Gutters.smallTMargin]}>
            <CustomDropDown
              headingText="From Year"
              setSelected={setSelectedYearFrom}
              data={yearOptions.map(year => ({
                key: year.toString(),
                value: year.toString(),
              }))}
              placeholder="Select"
              value={selectedYearFrom}
              headingTextStyle={[{color: Colors.black_232C28}]}
              customStyle={[
                {
                  backgroundColor: Colors.light_grayF4F4F4,
                  borderWidth: 1,
                  borderColor: Colors.black_232C28,
                },
              ]}
              customListStyle={[{backgroundColor: Colors.light_grayF4F4F4}]}
            />
          </View>
          <View style={[Gutters.smallTMargin]}>
            <CustomDropDown
              headingText="To Year"
              setSelected={setSelectedYearTo}
              data={yearOptions.map(year => ({
                key: year.toString(),
                value: year.toString(),
              }))}
              placeholder="Select"
              value={selectedYearTo}
              headingTextStyle={[{color: Colors.black_232C28}]}
              customStyle={[
                {
                  backgroundColor: Colors.light_grayF4F4F4,
                  borderWidth: 1,
                  borderColor: Colors.black_232C28,
                },
              ]}
              customListStyle={[{backgroundColor: Colors.light_grayF4F4F4}]}
            />
          </View>
        </View>
        <View style={[Gutters.smallBMargin]}>
          <CustomButton
            text={t('common:view_results')}
            onPress={makeFilterPerameterFunc}
            btnStyle={[{backgroundColor: Colors.primary}]}
            textStyle={[Fonts.poppinSemiBold24, {color: Colors.white}]}
          />
        </View>
      </View>
    );
  };

  const AutomotivePriceFilter = () => {
    return (
      <View
        style={[
          Layout.fill,
          Gutters.littlePadding,
          Layout.column,
          Layout.justifyContentBetween,
        ]}>
        <View>
          <View
            style={[
              i18next.language === 'en' ? Layout.row : Layout.rowReverse,
              Layout.alignItemsCenter,
              Layout.justifyContentBetween,
            ]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowBottomSheet(false)}
              style={[Layout.row, Layout.alignItemsCenter]}>
              <Images.svg.cross.default
                stroke={'black'}
                width={20}
                height={20}
              />
              <TextSemiBold
                text="Price"
                textStyle={[
                  Fonts.poppinSemiBold24,
                  Gutters.littleTMargin,
                  Gutters.tinyLMargin,
                  {color: Colors.black_232C28},
                ]}
              />
            </TouchableOpacity>
          </View>
          <View style={[Gutters.smallTMargin]}>
            <CustomDropDown
              headingText="From Price"
              setSelected={setSelectedPriceFrom}
              data={priceOptions.map(price => ({
                key:
                  price === 'Any'
                    ? 'Any'
                    : `${price >= 1000 ? price / 1000 + 'k' : price}`,
                value: price,
              }))}
              placeholder="Select"
              value={
                selectedPriceFrom === 'Any'
                  ? 'Any'
                  : selectedPriceFrom >= 1000
                  ? `${selectedPriceFrom / 1000}k`
                  : selectedPriceFrom
              }
              headingTextStyle={[{color: Colors.black_232C28}]}
              customStyle={[
                {
                  backgroundColor: Colors.light_grayF4F4F4,
                  borderWidth: 1,
                  borderColor: Colors.black_232C28,
                },
              ]}
              customListStyle={[{backgroundColor: Colors.light_grayF4F4F4}]}
            />
          </View>
          <View style={[Gutters.smallTMargin]}>
            <CustomDropDown
              headingText="To Price"
              setSelected={setSelectedPriceTo}
              data={priceOptions.map(price => ({
                key:
                  price === 'Any'
                    ? 'Any'
                    : `${price >= 1000 ? price / 1000 + 'k' : price}`,
                value: price,
              }))}
              placeholder="Select"
              value={
                selectedPriceTo === 'Any'
                  ? 'Any'
                  : selectedPriceTo >= 1000
                  ? `${selectedPriceTo / 1000}k`
                  : selectedPriceTo
              }
              headingTextStyle={[{color: Colors.black_232C28}]}
              customStyle={[
                {
                  backgroundColor: Colors.light_grayF4F4F4,
                  borderWidth: 1,
                  borderColor: Colors.black_232C28,
                },
              ]}
              customListStyle={[{backgroundColor: Colors.light_grayF4F4F4}]}
            />
          </View>
        </View>
        <View style={[Gutters.smallBMargin]}>
          <CustomButton
            text={t('common:view_results')}
            onPress={makeFilterPerameterFunc}
            btnStyle={[{backgroundColor: Colors.primary}]}
            textStyle={[Fonts.poppinSemiBold24, {color: Colors.white}]}
          />
        </View>
      </View>
    );
  };

  const BodyStyleFilter = () => {
    return (
      <View
        style={[
          Layout.fill,
          Gutters.littlePadding,
          Layout.column,
          Layout.justifyContentBetween,
        ]}>
        <View>
          <View
            style={[
              i18next.language === 'en' ? Layout.row : Layout.rowReverse,
              Layout.alignItemsCenter,
              Layout.justifyContentBetween,
            ]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowBottomSheet(false)}
              style={[Layout.row, Layout.alignItemsCenter]}>
              <Images.svg.cross.default
                stroke={'black'}
                width={20}
                height={20}
              />
              <TextSemiBold
                text="Body Style"
                textStyle={[
                  Fonts.poppinSemiBold24,
                  Gutters.littleTMargin,
                  Gutters.tinyLMargin,
                  {color: Colors.black_232C28},
                ]}
              />
            </TouchableOpacity>
          </View>
          <View style={[Layout.fill, Gutters.smallTMargin]}>
            {vehicleBodyStyles.map((style, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() => {
                  if (selectedBodyStyles.includes(style)) {
                    setSelectedBodyStyles(
                      selectedBodyStyles.filter(s => s !== style),
                    );
                  } else {
                    setSelectedBodyStyles([...selectedBodyStyles, style]);
                  }
                }}
                style={[
                  i18next.language === 'en' ? Layout.row : Layout.rowReverse,
                  Layout.alignItemsCenter,
                  Layout.justifyContentBetween,
                  Gutters.tinyVPadding,
                  Gutters.littleHPadding,
                  {
                    borderTopWidth: 1,
                    borderColor: Colors.gray_C9C9C9,
                    backgroundColor: selectedBodyStyles.includes(style)
                      ? Colors.light_grayF4F4F4
                      : 'transparent',
                  },
                ]}>
                <TextMedium
                  text={style}
                  textStyle={[{color: Colors.black_232C28}]}
                />
                <View
                  style={[
                    {
                      height: 20,
                      width: 20,
                      borderWidth: 1,
                      borderColor: Colors.black_232C28,
                      backgroundColor: selectedBodyStyles.includes(style)
                        ? Colors.primary
                        : 'transparent',
                    },
                  ]}>
                  {selectedBodyStyles.includes(style) && (
                    <View
                      style={{
                        height: 13,
                        width: 13,
                        borderWidth: 1,
                        backgroundColor: Colors.white,
                        margin: 2,
                      }}></View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={[Gutters.smallBMargin]}>
          <CustomButton
            text={t('common:view_results')}
            onPress={makeFilterPerameterFunc}
            btnStyle={[{backgroundColor: Colors.primary}]}
            textStyle={[Fonts.poppinSemiBold24, {color: Colors.white}]}
          />
        </View>
      </View>
    );
  };

  const FuelTypeFilter = () => {
    return (
      <View
        style={[
          Layout.fill,
          Gutters.littlePadding,
          Layout.column,
          Layout.justifyContentBetween,
        ]}>
        <View>
          <View
            style={[
              i18next.language === 'en' ? Layout.row : Layout.rowReverse,
              Layout.alignItemsCenter,
              Layout.justifyContentBetween,
            ]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowBottomSheet(false)}
              style={[Layout.row, Layout.alignItemsCenter]}>
              <Images.svg.cross.default
                stroke={'black'}
                width={20}
                height={20}
              />
              <TextSemiBold
                text="Fuel Type"
                textStyle={[
                  Fonts.poppinSemiBold24,
                  Gutters.littleTMargin,
                  Gutters.tinyLMargin,
                  {color: Colors.black_232C28},
                ]}
              />
            </TouchableOpacity>
          </View>
          <View style={[Layout.fill, Gutters.smallTMargin]}>
            {vehicleFuelTypes.map((fuelType, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() => {
                  if (selectedFuelTypes.includes(fuelType)) {
                    setSelectedFuelTypes(
                      selectedFuelTypes.filter(f => f !== fuelType),
                    );
                  } else {
                    setSelectedFuelTypes([...selectedFuelTypes, fuelType]);
                  }
                }}
                style={[
                  i18next.language === 'en' ? Layout.row : Layout.rowReverse,
                  Layout.alignItemsCenter,
                  Layout.justifyContentBetween,
                  Gutters.tinyVPadding,
                  Gutters.littleHPadding,
                  {
                    borderTopWidth: 1,
                    borderColor: Colors.gray_C9C9C9,
                    backgroundColor: selectedFuelTypes.includes(fuelType)
                      ? Colors.light_grayF4F4F4
                      : 'transparent',
                  },
                ]}>
                <TextMedium
                  text={fuelType}
                  textStyle={[{color: Colors.black_232C28}]}
                />
                <View
                  style={[
                    {
                      height: 20,
                      width: 20,
                      borderWidth: 1,
                      borderColor: Colors.black_232C28,
                      backgroundColor: selectedFuelTypes.includes(fuelType)
                        ? Colors.primary
                        : 'transparent',
                    },
                  ]}>
                  {selectedFuelTypes.includes(fuelType) && (
                    <View
                      style={{
                        height: 13,
                        width: 13,
                        borderWidth: 1,
                        backgroundColor: Colors.white,
                        margin: 2,
                      }}></View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={[Gutters.smallBMargin]}>
          <CustomButton
            text={t('common:view_results')}
            onPress={makeFilterPerameterFunc}
            btnStyle={[{backgroundColor: Colors.primary}]}
            textStyle={[Fonts.poppinSemiBold24, {color: Colors.white}]}
          />
        </View>
      </View>
    );
  };

  const OdometerFilter = () => {
    // Odometer options with nice formatting
    const odometerOptions = [
      100, 1000, 5000, 10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000,
      90000, 100000, 120000, 140000, 160000, 180000, 200000, 250000, 300000,
    ];

    return (
      <View
        style={[
          Layout.fill,
          Gutters.littlePadding,
          Layout.column,
          Layout.justifyContentBetween,
        ]}>
        <View>
          <View
            style={[
              i18next.language === 'en' ? Layout.row : Layout.rowReverse,
              Layout.alignItemsCenter,
              Layout.justifyContentBetween,
            ]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowBottomSheet(false)}
              style={[Layout.row, Layout.alignItemsCenter]}>
              <Images.svg.cross.default
                stroke={'black'}
                width={20}
                height={20}
              />
              <TextSemiBold
                text="Odometer"
                textStyle={[
                  Fonts.poppinSemiBold24,
                  Gutters.littleTMargin,
                  Gutters.tinyLMargin,
                  {color: Colors.black_232C28},
                ]}
              />
            </TouchableOpacity>
          </View>
          <View style={[Gutters.smallTMargin]}>
            <CustomDropDown
              headingText="From Odometer"
              setSelected={setSelectedOdometerFrom}
              data={odometerOptions.map(odometer => ({
                key: odometer.toLocaleString() + ' km',
                value: odometer.toString(),
              }))}
              placeholder="Select"
              value={
                selectedOdometerFrom
                  ? Number(selectedOdometerFrom).toLocaleString() + ' km'
                  : ''
              }
              headingTextStyle={[{color: Colors.black_232C28}]}
              customStyle={[
                {
                  backgroundColor: Colors.light_grayF4F4F4,
                  borderWidth: 1,
                  borderColor: Colors.black_232C28,
                },
              ]}
              customListStyle={[{backgroundColor: Colors.light_grayF4F4F4}]}
            />
          </View>
          <View style={[Gutters.smallTMargin]}>
            <CustomDropDown
              headingText="To Odometer"
              setSelected={setSelectedOdometerTo}
              data={odometerOptions.map(odometer => ({
                key: odometer.toLocaleString() + ' km',
                value: odometer.toString(),
              }))}
              placeholder="Select"
              value={
                selectedOdometerTo
                  ? Number(selectedOdometerTo).toLocaleString() + ' km'
                  : ''
              }
              headingTextStyle={[{color: Colors.black_232C28}]}
              customStyle={[
                {
                  backgroundColor: Colors.light_grayF4F4F4,
                  borderWidth: 1,
                  borderColor: Colors.black_232C28,
                },
              ]}
              customListStyle={[{backgroundColor: Colors.light_grayF4F4F4}]}
            />
          </View>
        </View>
        <View style={[Gutters.smallBMargin]}>
          <CustomButton
            text={t('common:view_results')}
            onPress={makeFilterPerameterFunc}
            btnStyle={[{backgroundColor: Colors.primary}]}
            textStyle={[Fonts.poppinSemiBold24, {color: Colors.white}]}
          />
        </View>
      </View>
    );
  };

  const TransmissionFilter = () => {
    return (
      <View
        style={[
          Layout.fill,
          Gutters.littlePadding,
          Layout.column,
          Layout.justifyContentBetween,
        ]}>
        <View>
          <View
            style={[
              i18next.language === 'en' ? Layout.row : Layout.rowReverse,
              Layout.alignItemsCenter,
              Layout.justifyContentBetween,
            ]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowBottomSheet(false)}
              style={[Layout.row, Layout.alignItemsCenter]}>
              <Images.svg.cross.default
                stroke={'black'}
                width={20}
                height={20}
              />
              <TextSemiBold
                text="Transmission"
                textStyle={[
                  Fonts.poppinSemiBold24,
                  Gutters.littleTMargin,
                  Gutters.tinyLMargin,
                  {color: Colors.black_232C28},
                ]}
              />
            </TouchableOpacity>
          </View>
          <View style={[Layout.fill, Gutters.smallTMargin]}>
            {transmissionTypes.map((transmission, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedTransmission(transmission);
                  setShowBottomSheet(false);
                  setSelected(20);
                }}
                style={[
                  i18next.language === 'en' ? Layout.row : Layout.rowReverse,
                  Layout.alignItemsCenter,
                  Layout.justifyContentBetween,
                  Gutters.tinyVPadding,
                  Gutters.littleHPadding,
                  {
                    borderTopWidth: 1,
                    borderColor: Colors.gray_C9C9C9,
                    backgroundColor:
                      selectedTransmission === transmission
                        ? Colors.light_grayF4F4F4
                        : 'transparent',
                  },
                ]}>
                <TextMedium
                  text={transmission}
                  textStyle={[{color: Colors.black_232C28}]}
                />
                {selectedTransmission === transmission && (
                  <Images.svg.tick.default
                    width={20}
                    height={20}
                    stroke={Colors.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const DoorsFilter = () => {
    return (
      <View
        style={[
          Layout.fill,
          Gutters.littlePadding,
          Layout.column,
          Layout.justifyContentBetween,
        ]}>
        <View>
          <View
            style={[
              i18next.language === 'en' ? Layout.row : Layout.rowReverse,
              Layout.alignItemsCenter,
              Layout.justifyContentBetween,
            ]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowBottomSheet(false)}
              style={[Layout.row, Layout.alignItemsCenter]}>
              <Images.svg.cross.default
                stroke={'black'}
                width={20}
                height={20}
              />
              <TextSemiBold
                text="Number of Doors"
                textStyle={[
                  Fonts.poppinSemiBold24,
                  Gutters.littleTMargin,
                  Gutters.tinyLMargin,
                  {color: Colors.black_232C28},
                ]}
              />
            </TouchableOpacity>
          </View>
          <View style={[Layout.fill, Gutters.smallTMargin]}>
            {doorOptions.map((doors, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedDoors(doors);
                  setShowBottomSheet(false);
                  setSelected(20);
                }}
                style={[
                  i18next.language === 'en' ? Layout.row : Layout.rowReverse,
                  Layout.alignItemsCenter,
                  Layout.justifyContentBetween,
                  Gutters.tinyVPadding,
                  Gutters.littleHPadding,
                  {
                    borderTopWidth: 1,
                    borderColor: Colors.gray_C9C9C9,
                    backgroundColor:
                      selectedDoors === doors
                        ? Colors.light_grayF4F4F4
                        : 'transparent',
                  },
                ]}>
                <TextMedium
                  text={
                    doors === 'Any'
                      ? 'Any'
                      : `${doors} ${doors === '1' ? 'door' : 'doors'}`
                  }
                  textStyle={[{color: Colors.black_232C28}]}
                />
                {selectedDoors === doors && (
                  <Images.svg.tick.default
                    width={20}
                    height={20}
                    stroke={Colors.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const SeatsFilter = () => {
    return (
      <View
        style={[
          Layout.fill,
          Gutters.littlePadding,
          Layout.column,
          Layout.justifyContentBetween,
        ]}>
        <View>
          <View
            style={[
              i18next.language === 'en' ? Layout.row : Layout.rowReverse,
              Layout.alignItemsCenter,
              Layout.justifyContentBetween,
            ]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowBottomSheet(false)}
              style={[Layout.row, Layout.alignItemsCenter]}>
              <Images.svg.cross.default
                stroke={'black'}
                width={20}
                height={20}
              />
              <TextSemiBold
                text="Number of Seats"
                textStyle={[
                  Fonts.poppinSemiBold24,
                  Gutters.littleTMargin,
                  Gutters.tinyLMargin,
                  {color: Colors.black_232C28},
                ]}
              />
            </TouchableOpacity>
          </View>
          <View style={[Layout.fill, Gutters.smallTMargin]}>
            {seatOptions.map((seats, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedSeats(seats);
                  setShowBottomSheet(false);
                  setSelected(20);
                }}
                style={[
                  i18next.language === 'en' ? Layout.row : Layout.rowReverse,
                  Layout.alignItemsCenter,
                  Layout.justifyContentBetween,
                  Gutters.tinyVPadding,
                  Gutters.littleHPadding,
                  {
                    borderTopWidth: 1,
                    borderColor: Colors.gray_C9C9C9,
                    backgroundColor:
                      selectedSeats === seats
                        ? Colors.light_grayF4F4F4
                        : 'transparent',
                  },
                ]}>
                <TextMedium
                  text={
                    seats === 'Any'
                      ? 'Any'
                      : `${seats} ${seats === '1' ? 'seat' : 'seats'}`
                  }
                  textStyle={[{color: Colors.black_232C28}]}
                />
                {selectedSeats === seats && (
                  <Images.svg.tick.default
                    width={20}
                    height={20}
                    stroke={Colors.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const makeFilterPerameterFunc = async () => {
    setIsFilterLoading(true);
    const selectedKey = selected;
    // Keep the bottom sheet open briefly to show loading state
    setTimeout(async () => {
      setShowBottomSheet(false);
      setSelected(20);
      // For filters with useEffect parameter updates, let the useEffect handle data fetching
      // For other filters, we need to call getData manually
      if (
        selectedKey !== 'make' &&
        selectedKey !== 'model' &&
        selectedKey !== 'body_style' &&
        selectedKey !== 'fuel_type' &&
        selectedKey !== 'transmission' &&
        selectedKey !== 'location' &&
        selectedKey !== 'number_of_doors' &&
        selectedKey !== 'number_of_seats' &&
        selectedKey !== 'filter_search' &&
        selectedKey !== 'new_used' &&
        selectedKey !== 'shipping' &&
        selectedKey !== 'end_date'
      ) {
        setTimeout(async () => {
          await getData({skip: 0});
          setIsFilterLoading(false);
        }, 100);
      } else if (selectedKey === 'price') {
        // For price filter, manually trigger getData since the price values might already be set
        setTimeout(async () => {
          await getData({skip: 0});
          setIsFilterLoading(false);
        }, 100);
      } else {
        // For other automotive filters, just set loading to false since useEffect will handle data fetching
        setIsFilterLoading(false);
      }
    }, 300); // Show loading for 300ms before closing
  };

  const clearAllFilter = () => {
    setNewAndUsedItem(0);
    setCategoryFilterParam('');
    setSubCategoryFilterParam('');
    setSelectedAreaParam('');
    setFilterSearchParam('');
    dispatch(setSearchFilter(''));
    setSearchText('');
    setFilterSearch(0);
    setnewUsedItemParam('');
    setShippingItem(null);
    setFromPriceValueParam('');
    setToPriceValueParam('');
    setSelectedFromDateParam('');
    setSelectedToDateParam('');
    setFreeShippingParam('');
    setPickupAvailableParam('');
    setselectedArea({
      region: '',
      district: '',
      subrub: '',
    });

    setPriceValue({
      fromPrice: null,
      toPrice: null,
    });
    setSelectedFromDate('');
    setSelectedToDate('');
    setSelected(20);

    // Clear automotive filter states
    setSelectedMake('');
    setSelectedModel('');
    setSelectedYearFrom('');
    setSelectedYearTo('');
    setSelectedPriceFrom('');
    setSelectedPriceTo('');
    setSelectedBodyStyles([]);
    setSelectedFuelTypes([]);
    setSelectedOdometerFrom('');
    setSelectedOdometerTo('');
    setSelectedTransmission('');
    setSelectedDoors('');
    setSelectedSeats('');

    // Clear location filter
    setSelectedLocation('');

    setIsLoading(true);
    console.log('getData 00 ');

    getData({skip: 0, clear: true});
  };

  useEffect(() => {
    if (filterSearch === 0) {
      setFilterSearchParam('');
    } else if (filterSearch === 1) {
      setFilterSearchParam('&type=fixed_price');
    } else if (filterSearch === 2) {
      setFilterSearchParam('&type=auction');
    }
  }, [filterSearch]);

  // Trigger data fetch when filterSearchParam changes
  useEffect(() => {
    if (filterSearchParam !== undefined) {
      getData({skip: 0}).finally(() => setIsFilterLoading(false));
    }
  }, [filterSearchParam]);

  // Trigger data fetch when newUsedItemParam changes
  useEffect(() => {
    if (newusedItemParam !== undefined) {
      getData({skip: 0}).finally(() => setIsFilterLoading(false));
    }
  }, [newusedItemParam]);

  // Trigger data fetch when shipping parameters change
  useEffect(() => {
    if (freeShippingParam !== undefined || pickupAvailableParam !== undefined) {
      getData({skip: 0}).finally(() => setIsFilterLoading(false));
    }
  }, [freeShippingParam, pickupAvailableParam]);

  // Trigger data fetch when price parameters change
  useEffect(() => {
    if (fromPriceValueParam !== undefined || toPriceValueParam !== undefined) {
      getData({skip: 0}).finally(() => setIsFilterLoading(false));
    }
  }, [fromPriceValueParam, toPriceValueParam]);

  // Trigger data fetch when date parameters change
  useEffect(() => {
    if (
      selectedFromDateParam !== undefined ||
      selectedToDateParam !== undefined
    ) {
      getData({skip: 0}).finally(() => setIsFilterLoading(false));
    }
  }, [selectedFromDateParam, selectedToDateParam]);

  // Trigger data fetch when location changes to avoid race with manual fetch
  useEffect(() => {
    if (selectedLocation) {
      getData({skip: 0}).finally(() => setIsFilterLoading(false));
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (searchCatagories) {
      setCategoryFilterParam(`&category=${searchCatagories}`);
    }

    if (searchSubCategory) {
      setSubCategoryFilterParam(`&sub_category=${searchSubCategory}`);
    }
  }, [searchCatagories, searchSubCategory]);

  useEffect(() => {
    if (searchCatagories) {
      getData({skip: 0});
    }
    if (searchSubCategory) {
      getData({skip: 0});
    }
    return () => {
      dispatch(setSearchCatagories(null));
      dispatch(setSearchSubCatagory(null));
      dispatch(setSearchFilter(null));
      setSearchText('');
    };
  }, [searchCatagories, searchSubCategory]);

  useEffect(() => {
    if (newAndUsedItem === 0) {
      setnewUsedItemParam('');
    } else if (newAndUsedItem === 1) {
      setnewUsedItemParam('&condition=new');
    } else if (newAndUsedItem === 2) {
      setnewUsedItemParam('&condition=used');
    }
  }, [newAndUsedItem]);

  useEffect(() => {
    if (
      selectedArea?.region === '' &&
      selectedArea?.district === '' &&
      selectedArea?.subrub === ''
    ) {
      setSelectedAreaParam(``);
    } else {
      setSelectedAreaParam(
        `&pickup_location=${selectedArea?.region}${selectedArea?.district}${selectedArea?.subrub}`,
      );
    }
  }, [selectedArea]);

  useEffect(() => {
    if (priceValue?.fromPrice != null) {
      setFromPriceValueParam(`&from_price=${priceValue?.fromPrice}`);
    }
  }, [priceValue?.fromPrice]);

  useEffect(() => {
    if (priceValue?.toPrice != null) {
      setToPriceValueParam(`&to_price=${priceValue?.toPrice}`);
    }
  }, [priceValue?.toPrice]);

  useEffect(() => {
    if (selectedFromDate === '') {
      setSelectedFromDateParam(``);
    } else {
      const fromDateFormat = dayjs(`${selectedFromDate}`).format('YYYY-MM-DD');
      setSelectedFromDateParam(`&from_end_date=${fromDateFormat}`);
    }
  }, [selectedFromDate]);

  useEffect(() => {
    if (selectedToDate === '') {
      setSelectedToDateParam(``);
    } else {
      const toDateFormat = dayjs(`${selectedToDate}`).format('YYYY-MM-DD');
      setSelectedToDateParam(`&to_end_date=${toDateFormat}`);
    }
  }, [selectedToDate]);

  useEffect(() => {
    if (shippingItem == 0) {
      setFreeShippingParam(`&shipping=free_shipping`);
    } else if (shippingItem == 1) {
      setPickupAvailableParam(`&pickup_available=true`);
    }
  }, [shippingItem]);

  useDebouncedEffect(
    () => {
      getData({skip: 0}); // conflict in title
    },
    1500,
    [searchText],
  );

  // Automotive filter useEffect hooks - for single-selection and multi-selection filters
  useEffect(() => {
    if (
      isAutomotiveCategory() &&
      (selectedMake ||
        selectedModel ||
        selectedBodyStyles.length > 0 ||
        selectedFuelTypes.length > 0 ||
        selectedTransmission ||
        selectedDoors ||
        selectedSeats)
    ) {
      setIsFilterLoading(true);
      getData({skip: 0}).finally(() => {
        setIsFilterLoading(false);
      });
    }
  }, [
    selectedMake,
    selectedModel,
    selectedBodyStyles,
    selectedFuelTypes,
    selectedTransmission,
    selectedDoors,
    selectedSeats,
  ]);

  useEffect(() => {
    setIsLoading(true);
    console.log('getData 11 ');
    getData({skip: 0});
  }, []);

  const getDataAfterAddtoFav = (index, is_favourite) => {
    let dataTemp = [...listData.items];
    let item = {...dataTemp[index]};
    item.is_favourite = is_favourite;
    dataTemp[index] = item;
    dispatch(
      setlistData({
        items: dataTemp,
        pagination: listData?.pagination,
      }),
    );
  };

  const addRemoveFavourites = (
    id: string,
    is_favourite: boolean,
    index: any,
  ) => {
    if (!!is_favourite) {
      removeFavouriteListing(id).then(() => {
        getDataAfterAddtoFav(index, false);
      });
    } else {
      addFavoriteListing({listing: id}).then(() => {
        getDataAfterAddtoFav(index, true);
      });
    }
  };

  const RenderItemFlash = ({item, index}: any) => {
    const formatKilometers = (value: string | number) => {
      if (!value) return '--';
      const num = typeof value === 'number' ? value : parseFloat(value);
      if (isNaN(num)) return '--';
      return num.toLocaleString();
    };

    const formatTransmission = (value: string | null | undefined) => {
      if (!value) return '--';
      if (value.toLowerCase() === 'auto') return 'Auto';
      if (value.toLowerCase() === 'manual') return 'Manual';
      return value;
    };

    const formatFuelType = (value: string | null | undefined) => {
      if (!value) return '--';
      if (value.toLowerCase().includes('hybrid')) return 'Hybrid';
      return value;
    };
    const hasBanner = item.user.branding?.banner?.name;
    const imageHeight = hasBanner ? 130 : 150;
    const methodOfSale = item.type;

    const user = item.user;
    const showPhone = item.show_phone;

    const isVehicle = item?.listing_type === 'vehicle';
    const kilometers = item?.vehicle?.kilometers;
    const fuelType = item?.vehicle?.fuel_type;
    const transmission = item?.vehicle?.transmission;
    const engineSize = item?.vehicle?.engine_size;

    const cardHeight = 280;
    return (
      <TouchableOpacity
        key={index}
        style={[
          Gutters.darkShadow,
          {
            width: '90%',
            borderRadius: 10,
            marginBottom: 20,
            backgroundColor: Colors.white,
            height: cardHeight,
          },
        ]}
        onPress={() => {
          dispatch(fixBottomTab(false));
          dispatch(selectedProduct({...item, index: index}));
          dispatch(setSelectedProductData({}));
          navigation.navigate('ProductDetailContainer' as never);
        }}>
        <TouchableOpacity
          onPress={() => {
            if (guest || !token) {
              showUserAlert(navigation);
            } else {
              addRemoveFavourites(item?._id, item?.is_favourite, index);
            }
          }}
          style={{
            position: 'absolute',
            top: item?.is_favourite ? -1 : 0,
            right: 0,
            zIndex: 1,
          }}>
          {item?.is_favourite ? (
            <Images.svg.rectangleGroup.default />
          ) : (
            <Images.svg.EyeRectangle.default />
          )}
        </TouchableOpacity>

        <View>
          {item?.images && item?.images[0]?.name?.endsWith('.svg') ? (
            <View
              style={[
                Layout.alignItemsCenter,
                Layout.justifyContentCenter,
                {
                  height: imageHeight,
                },
              ]}>
              <SvgUri
                width="100"
                height="100"
                uri={getURLPhoto(item?.images[0]?.name)}
                style={{
                  width: '100%',
                  height: imageHeight,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                }}
              />
            </View>
          ) : (
            <Image
              source={
                item?.images?.length > 0
                  ? {
                      uri: getURLPhoto(item?.images[0]?.name),
                    }
                  : getPlaceHolderProduct()
              }
              style={{
                width: '100%',
                height: imageHeight,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
            />
          )}
          {item?.type === 'auction' && (
            <View
              style={[
                Layout.row,
                Layout.alignItemsCenter,
                Gutters.littleVPadding,
                Gutters.tinyHPadding,
                {
                  position: 'absolute',
                  bottom: 5,
                  left: 5,
                  zIndex: 1,
                  backgroundColor: item?.reserve_price
                    ? item?.reserve_met
                      ? Colors.primary
                      : Colors.gray_868e96
                    : Colors.gray_adb5bd,
                  borderRadius: 20,
                },
              ]}>
              {item?.reserve_price ? (
                item?.reserve_met ? (
                  <Images.svg.TickIwtach.default height={11} width={11} />
                ) : (
                  <Images.svg.SimpleCrossIcon.default height={11} width={11} />
                )
              ) : null}
              <Text
                numberOfLines={1}
                style={[
                  Fonts.poppinMed10,
                  // Gutters.tinyBMargin,
                  {
                    color: Colors.white,
                  },
                ]}>
                {item?.reserve_price
                  ? item?.reserve_met
                    ? ' Reserve Met'
                    : ' Reserve Met'
                  : 'No Reserve'}
              </Text>
            </View>
          )}
        </View>

        {hasBanner && (
          <View style={[Layout.fullWidth]}>
            <CustomFastImage
              resizeMode="cover"
              customStyle={[
                {
                  width: '100%',
                  height: 'auto',
                  aspectRatio: '125/20',
                },
              ]}
              url={getURLPhoto(item.user.branding?.banner?.name)}
            />
          </View>
        )}

        <View
          style={[
            Layout.selfCenter,
            Layout.screenWidth,
            Layout.overflow,
            Layout.justifyContentBetween,
          ]}>
          <View style={[Gutters.tinyBMargin]}>
            <Text
              numberOfLines={1}
              style={[
                Fonts.poppinMed14,
                Gutters.tinyTMargin,
                // Gutters.littleBMargin,
                {
                  fontWeight: '500',
                  color: Colors.black_232C28,
                },
              ]}>
              {item?.title}
            </Text>
          </View>
          {isVehicle && (
            <View style={[{width: '100%'}]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                    marginRight: 16,
                  }}>
                  <Images.svg.odometer.default
                    width={12}
                    height={12}
                    style={{marginRight: 4}}
                  />
                  <Text
                    style={[
                      Fonts.poppinReg10,
                      {color: Colors.dark_gray_676C6A},
                    ]}>
                    {kilometers ? `${formatKilometers(kilometers)} km` : '--'}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                  }}>
                  <Images.svg.fuel.default
                    width={12}
                    height={12}
                    style={{marginRight: 4}}
                  />
                  <Text
                    style={[
                      Fonts.poppinReg10,
                      {color: Colors.dark_gray_676C6A},
                    ]}>
                    {fuelType ? formatFuelType(fuelType) : '--'}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  marginTop: 2,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                    marginRight: 16,
                  }}>
                  <Images.svg.transmission.default
                    width={12}
                    height={12}
                    style={{marginRight: 4}}
                  />
                  <Text
                    style={[
                      Fonts.poppinReg10,
                      {color: Colors.dark_gray_676C6A},
                    ]}>
                    {transmission ? formatTransmission(transmission) : '--'}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                  }}>
                  <Images.svg.engine.default
                    width={12}
                    height={12}
                    style={{marginRight: 4}}
                  />
                  <Text
                    style={[
                      Fonts.poppinReg10,
                      {color: Colors.dark_gray_676C6A},
                    ]}>
                    {engineSize
                      ? engineSize.toString().toLowerCase().endsWith('cc')
                        ? engineSize
                        : `${engineSize}cc`
                      : '--'}
                  </Text>
                </View>
              </View>
            </View>
          )}
          <View
            style={[
              Layout.row,
              Layout.fullWidth,
              Layout.justifyContentBetween,
              Gutters.littleTMargin,
              Gutters.tinyBMargin,
              Layout.alignItemsCenter,
            ]}>
            {item?.status === 'sold' ? (
              <View style={{width: '100%'}}>
                <Text
                  numberOfLines={1}
                  style={[
                    Fonts.poppinMed20,
                    {color: Colors.red, textAlign: 'right'},
                  ]}>
                  SOLD
                </Text>
              </View>
            ) : (
              <>
                {methodOfSale === 'enquire' &&
                  showPhone &&
                  user.phone_number && (
                    <TouchableOpacity
                      onPress={() => {
                        Linking.openURL(`tel:${user.phone_number}`);
                      }}
                      style={[
                        Layout.row,
                        Layout.center,
                        Layout.fullWidth,
                        Gutters.tinyRadius,
                        {height: 30, backgroundColor: Colors.primary},
                      ]}>
                      <View style={[Gutters.littleRMargin]}>
                        <Images.svg.phone.default
                          fill={Colors.white}
                          height={23}
                          width={23}
                        />
                      </View>
                      <Text
                        style={[
                          Fonts.poppinSemiBold16,
                          {fontWeight: '600', color: Colors.white},
                        ]}>
                        Contact
                      </Text>
                    </TouchableOpacity>
                  )}

                {methodOfSale === 'enquire' && !showPhone && (
                  <TouchableOpacity
                    onPress={() => {
                      dispatch(fixBottomTab(false));
                      dispatch(
                        selectedProduct({
                          ...item,
                          index: index,
                          isSeller: isSeller,
                        }),
                      );
                      dispatch(setSelectedProductData({}));
                      navigation.push('ProductDetailContainer' as never);
                    }}
                    style={[
                      Layout.row,
                      Layout.center,
                      Layout.fullWidth,
                      Gutters.tinyRadius,
                      {height: 30, backgroundColor: Colors.primary},
                    ]}>
                    <Text
                      style={[
                        Fonts.poppinSemiBold16,
                        {fontWeight: '600', color: Colors.white},
                      ]}>
                      Enquire
                    </Text>
                  </TouchableOpacity>
                )}

                {item?.make_an_offer && item?.type != 'auction' ? (
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        dispatch(fixBottomTab(false));
                        dispatch(
                          selectedProduct({
                            ...item,
                            index: index,
                            isSeller: isSeller,
                          }),
                        );
                        dispatch(setSelectedProductData({}));
                        navigation.push('ProductDetailContainer' as never);
                      }}
                      style={[
                        Gutters.tinyVPadding,
                        {
                          backgroundColor: Colors.lightGreen_DBF5EC,
                          borderRadius: 6,
                          paddingHorizontal: 5,
                        },
                      ]}>
                      <Text
                        style={[
                          Fonts.poppinReg9,
                          {color: Colors.green_06975E, textAlign: 'center'},
                        ]}>
                        Send an Offer
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : item?.type == 'auction' ? (
                  <View style={{width: '50%'}}>
                    <Text
                      style={[
                        Fonts.poppinMed12,
                        {color: Colors.dark_gray_676C6A},
                      ]}>
                      Starting:
                    </Text>
                    <View style={{width: '100%'}}>
                      <Text
                        numberOfLines={3}
                        ellipsizeMode="tail"
                        style={[Fonts.poppinBold14]}>
                        {item?.type == 'auction'
                          ? `${t('common:nz')} ${item?.start_price}`
                          : `${t('common:nz')} ${item?.fixed_price_offer}`}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View style={{width: '40%'}} />
                )}

                {!!item?.buy_now_price && methodOfSale !== 'auction' ? (
                  <View style={{width: '55%'}}>
                    <Text
                      numberOfLines={1}
                      style={[
                        Fonts.poppinMed12,
                        {color: Colors.primary, textAlign: 'right'},
                      ]}>
                      {item?.listing_type == 'property'
                        ? item?.property?.for_sale
                          ? 'Asking Price:'
                          : 'Rental Price:'
                        : 'Buy Now:'}
                    </Text>
                    {screenWidth < SMALL_WIDTH_DEVICE ? (
                      <Text
                        style={[
                          isOneMillionOrMore(item?.buy_now_price)
                            ? Fonts.poppinBold11
                            : Fonts.poppinBold12,
                          Layout.selfEnd,
                          {color: Colors.primary},
                        ]}>
                        {formatCurrency(item?.buy_now_price)}
                      </Text>
                    ) : (
                      <Text
                        style={[
                          isOneMillionOrMore(item?.buy_now_price)
                            ? Fonts.poppinBold12
                            : Fonts.poppinBold14,
                          Layout.selfEnd,
                          {color: Colors.primary},
                        ]}>
                        {formatCurrency(item?.buy_now_price)}
                      </Text>
                    )}
                  </View>
                ) : (
                  item?.make_an_offer &&
                  item?.type != 'auction' && (
                    <View style={{width: '50%'}}>
                      <Text
                        style={[
                          Fonts.poppinMed12,
                          {color: Colors.dark_gray_676C6A, textAlign: 'right'},
                        ]}>
                        Starting:
                      </Text>
                      <View style={{width: '100%'}}>
                        <Text
                          numberOfLines={3}
                          ellipsizeMode="tail"
                          style={[Fonts.poppinBold14, Layout.selfEnd]}>
                          {item?.type == 'auction'
                            ? `${t('common:nz')} ${item?.start_price}`
                            : `${t('common:nz')} ${item?.fixed_price_offer}`}
                        </Text>
                      </View>
                    </View>
                  )
                )}
              </>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const fetchDataOnRefresh = async () => {
    getData({skip: 0});
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDataOnRefresh();
  };
  const LoadMoreRandomData = () => {
    let skip = listData?.pagination?.skip + listData?.pagination?.limit;
    console.log('getData 33 ');
    getData({skip: skip});
  };

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <View style={[Layout.fill, {backgroundColor: Colors.white}]}>
      <CustomHeader title={'iBuy'} rightIcon={true} navigation={navigation} />
      <View
        style={[
          Layout.alignItemsCenter,
          {marginLeft: '3%', marginRight: '3%'},
        ]}>
        <CustomInput
          backgroundStyle={[
            {backgroundColor: Colors.white, borderRadius: 10, borderWidth: 1},
          ]}
          value={searchText}
          // dispatch(setSearchFilter(t));
          inputProps={{
            onChangeText: t => {
              setSearchText(t);
            },
          }}
          headingText=""
          righticon={true}
          righticonName="PlayButton"
          placeholder={'Search keywords...'}
        />
      </View>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[Layout.flexGrow]}
        style={[Layout.fill]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
          />
        }
        onMomentumScrollBegin={() => {
          setOnEndReachedCalledDuringMomentum(false);
        }}
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            if (
              !onEndReachedCalledDuringMomentum &&
              loadMoreInProcess.current == false &&
              listData?.items &&
              listData?.pagination?.skip + listData?.pagination?.limit <
                listData?.pagination?.total
            ) {
              console.log(
                '>>> load more',
                listData?.items?.length,
                listData?.pagination?.total,
              );
              loadMoreInProcess.current = true;
              setOnEndReachedCalledDuringMomentum(true);
              setIsLoadingBottom(true);
              LoadMoreRandomData();
            }
          }
        }}
        scrollEventThrottle={6}>
        <View style={[]}>
          <Filters
            selected={selected}
            setShowBottomSheet={setShowBottomSheet}
            setSelected={setSelected}
            isAutomotiveCategory={isAutomotiveCategory()}
            selectedMake={selectedMake}
            selectedModel={selectedModel}
            selectedYearFrom={selectedYearFrom}
            selectedYearTo={selectedYearTo}
            selectedPriceFrom={selectedPriceFrom}
            selectedPriceTo={selectedPriceTo}
            selectedBodyStyles={selectedBodyStyles}
            selectedFuelTypes={selectedFuelTypes}
            selectedOdometerFrom={selectedOdometerFrom}
            selectedOdometerTo={selectedOdometerTo}
            selectedTransmission={selectedTransmission}
            selectedDoors={selectedDoors}
            selectedSeats={selectedSeats}
            selectedLocation={selectedLocation}
            filterSearch={filterSearch}
            itemTypeData={itemTypeData}
          />
          <View style={[Gutters.tinyBMargin, {marginRight: '3%'}]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                clearAllFilter();
              }}
              style={[
                Layout.center,
                Gutters.tinyLMargin,
                Gutters.xxtinyHPadding,
                {
                  borderRadius: 4,
                  paddingVertical: 4,
                  borderWidth: 1,
                  borderColor: Colors.green_06975E,
                  backgroundColor: Colors.lightGreen_DBF5EC,
                },
              ]}>
              <TextSemiBold
                text="Clear"
                textStyle={[
                  Fonts.poppinSemiBold16,
                  {
                    color: Colors.green_06975E,
                  },
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>

        <SortBy sort_by={() => setSortBy(true)} />
        <View style={[Layout.fill, Gutters.smallTMargin, Layout.fill]}>
          <View style={[Layout.fullWidth, Gutters.tinyLMargin]}>
            <FlashList
              numColumns={2}
              // getItemType={ItemType}
              estimatedItemSize={439}
              // onViewableItemsChanged={() => {
              //   console.log('>> onViewableItemsChanged ');
              // }}
              viewabilityConfig={viewabilityConfig}
              removeClippedSubviews
              // ref={scrollRef}
              // ItemSeparatorComponent={Separator}
              // ListHeaderComponent={FeedHeader}
              extraData={listData?.items || []}
              data={listData?.items || []}
              ListEmptyComponent={() => (
                <View
                  style={[Layout.fill, Layout.center, {height: sHight(55)}]}>
                  <TextSemiBold
                    text="No data found "
                    textStyle={[
                      Fonts.poppinSemiBold20,
                      {color: Colors.black_232C28},
                    ]}
                  />
                </View>
              )}
              renderItem={RenderItemFlash}
              keyExtractor={(item, index) => index.toString()}
              onScrollEndDrag={() => {
                console.log('>>> onScrollEnd ');
              }}
              onEndReachedThreshold={0.3}
              onEndReached={async () => {
                console.log('>> onEndReached');
              }}
              onRefresh={async () => {
                console.log('>> onRefresh');
              }}
              refreshing={false}
              ListFooterComponent={() => {
                return (
                  <View>
                    {isLoadingBottom &&
                    !isLoading &&
                    listData?.items?.length > 0 ? (
                      <View
                        style={{
                          height: 50,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <ActivityIndicator
                          size="large"
                          color={Colors.primary}
                        />
                      </View>
                    ) : null}
                  </View>
                );
              }}
            />
          </View>
        </View>
        <CustomBottomSheet
          height={'60%'}
          visible={sortBy}
          setShowBottomSheet={() => setSortBy(false)}>
          <View style={[Layout.fill, Gutters.littlePadding]}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[Layout.flexGrow, Gutters.smallBMargin]}
              style={[Layout.fill]}>
              {SortByFixedPrice?.map((item, index) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setsortByCatagory(index), setSortBy(false);
                  }}
                  style={[
                    Gutters.smallHPadding,
                    Gutters.tinyVPadding,
                    Gutters.tinyBMargin,
                    {
                      backgroundColor:
                        sortByCatagory === index
                          ? Colors.light_grayF4F4F4
                          : 'transparent',
                      borderRadius: 4,
                    },
                  ]}>
                  <View
                    style={[
                      i18next.language === 'en'
                        ? Layout.row
                        : Layout.rowReverse,
                      Layout.alignItemsCenter,
                    ]}>
                    <View
                      style={[
                        {
                          width: 5,
                          height: 5,
                          borderRadius: 100,
                          backgroundColor: Colors.dark_gray_676C6A,
                        },
                      ]}
                    />
                    <TextRegular
                      text={
                        item?.title?.length > 20
                          ? item?.title?.slice(0, 20) + '...'
                          : item?.title
                      }
                      textStyle={[
                        Fonts.poppinReg20,
                        Gutters.tinyLMargin,
                        {color: Colors.black_232C28},
                      ]}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </CustomBottomSheet>
        <CustomBottomSheet
          height={'70%'}
          visible={ShowBottomSheet}
          setShowBottomSheet={setShowBottomSheet}
          icon={false}>
          <TouchableWithoutFeedback style={[Layout.fill]}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[Layout.flexGrow]}
              nestedScrollEnabled={true}
              style={[Layout.fill]}>
              {isAutomotiveCategory()
                ? // Automotive filters
                  selected === 'make' && showFilter('make')
                  ? MakeFilter()
                  : selected === 'model' && showFilter('model')
                  ? ModelFilter()
                  : selected === 'location' && showFilter('location')
                  ? Location()
                  : selected === 'year' && showFilter('year')
                  ? YearFilter()
                  : selected === 'price' && showFilter('price')
                  ? AutomotivePriceFilter()
                  : selected === 'body_style' && showFilter('body_style')
                  ? BodyStyleFilter()
                  : selected === 'fuel_type' && showFilter('fuel_type')
                  ? FuelTypeFilter()
                  : selected === 'odometer' && showFilter('odometer')
                  ? OdometerFilter()
                  : selected === 'transmission' && showFilter('transmission')
                  ? TransmissionFilter()
                  : selected === 'number_of_doors' &&
                    showFilter('number_of_doors')
                  ? DoorsFilter()
                  : selected === 'number_of_seats' &&
                    showFilter('number_of_seats')
                  ? SeatsFilter()
                  : selected === 'filter_search' && showFilter('filter_search')
                  ? itemType()
                  : null
                : // Regular filters
                selected === 'filter_search' && showFilter('filter_search')
                ? itemType()
                : selected === 'new_used' && showFilter('new_used')
                ? new_And_Used()
                : selected === 'location' && showFilter('location')
                ? Location()
                : selected === 'shipping' && showFilter('shipping')
                ? shipping()
                : selected === 'price' && showFilter('price')
                ? PriceRange()
                : selected === 'end_date' &&
                  showFilter('end_date') &&
                  AuctionDate()}
            </ScrollView>
          </TouchableWithoutFeedback>
        </CustomBottomSheet>
        <CustomLoading
          isLoading={
            isLoading ||
            isLoadingRemoveFav ||
            isLoadingAddFav ||
            isFilterLoading
          }
        />
      </ScrollView>
    </View>
  );
};

export default IBuyContainer;
