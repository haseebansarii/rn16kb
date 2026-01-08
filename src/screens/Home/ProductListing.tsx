import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Dimensions,
} from 'react-native';
import {Image} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {CustomFastImage, CustomLoading} from '../../components';
import {useTheme} from '../../hooks';
import {
  useAddFavouriteListingMutation,
  useRemoveFavouriteListingMutation,
} from '../../services/modules/home/favouriteListing';
import {selectedProduct} from '../../store/productDetail/ProductDetailSlice';
import {fixBottomTab} from '../../store/stack/StackSlice';
import {RootState} from '../../store/store';
import {
  getPlaceHolderProduct,
  getURLPhoto,
  showUserAlert,
} from '../../utils/helpers';
import {
  setlistData,
  setlistDataUser,
  setSelectedProductData,
} from '../../store/Listings';
import {SvgUri} from 'react-native-svg';
import {setApiCallNearMe} from '../../store/home/ListingSlice';
import {FlashList} from '@shopify/flash-list';

const formatCurrency = (value: any, symbol = 'NZ$') => {
  if (!value) return 'NZ$ 0.00';
  const numericValue = parseFloat(value);
  if (isNaN(numericValue)) return 'NZ$ 0.00';
  const formattedValue = numericValue.toLocaleString('en-NZ', {
    maximumFractionDigits: 2,
  });
  return symbol + ' ' + formattedValue;
};

const SMALL_WIDTH_DEVICE = 400;
function isOneMillionOrMore(value?: number): boolean {
  if (typeof value !== 'number') return false;
  return value >= 1_000_000;
}
const ProductListing = ({
  scrollEnabled,
  data,
  hideNoData,
  loadMore,
  getInitialDataSeller,
  isSeller,
}: any) => {
  const screenWidth = Dimensions.get('window').width;
  const {Layout, Gutters, Colors, Fonts, Images} = useTheme();
  const home_listing = useSelector(
    (state: RootState) => state.homeListing?.home_listing,
  );
  data = data ?? home_listing;

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum,
  ] = useState(false);
  const [isLoadingBottom, setIsLoadingBottom] = useState(false);

  const [removeFavouriteListing, {isLoading: removeFavLoading}] =
    useRemoveFavouriteListingMutation();
  const [addFavoriteListing, {isLoading: addFavLoading}] =
    useAddFavouriteListingMutation();
  const guest = useSelector((state: RootState) => state?.auth?.guest);
  const token = useSelector((state: RootState) => state?.auth?.token);
  const listDataUser = useSelector((state: any) => state?.list?.listDataUser);
  const listData = useSelector((state: any) => state?.list?.listData);

  const getDataAfterAddtoFavUser = (index, is_favourite) => {
    let dataTemp = [...listDataUser.items];
    let item = {...dataTemp[index]};
    item.is_favourite = is_favourite;
    dataTemp[index] = item;
    dispatch(
      setlistDataUser({
        items: dataTemp,
        pagination: listDataUser?.pagination,
      }),
    );
  };
  const updateFavouriteStatusListing = (arr, id, newStatus) => {
    return arr.map(item => {
      if (item._id === id) {
        return {
          ...item,
          is_favourite: newStatus,
        };
      }
      return item;
    });
  };
  const addRemoveFavourites = (
    id: string,
    is_favourite: boolean,
    index: any,
  ) => {
    if (!!is_favourite) {
      removeFavouriteListing(id).then(() => {
        if (isSeller) {
          getDataAfterAddtoFavUser(index, false);
          let body = {
            items:
              updateFavouriteStatusListing(listData?.items, id, false) || [],
            pagination: listData?.pagination,
          };
          dispatch(setlistData(body));
        }
      });
    } else {
      addFavoriteListing({listing: id}).then(() => {
        if (isSeller) {
          getDataAfterAddtoFavUser(index, true);

          let body = {
            items:
              updateFavouriteStatusListing(listData?.items, id, true) || [],
            pagination: listData?.pagination,
          };

          dispatch(setlistData(body));
        }
      });
    }
    getInitialDataSeller && getInitialDataSeller();
    dispatch(setApiCallNearMe(true));
  };

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const RenderItemFlashList = ({item, index}: any) => {
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

    const isVehicle = item?.listing_type === 'vehicle';
    const kilometers = item?.vehicle?.kilometers;
    const fuelType = item?.vehicle?.fuel_type;
    const transmission = item?.vehicle?.transmission;
    const engineSize = item?.vehicle?.engine_size;

    const cardHeight = 280;
    const hasBanner = item.user.branding?.banner?.name;
    const user = item.user;
    const methodOfSale = item.type;
    const showPhone = item.show_phone;
    const imageHeight = hasBanner ? 130 : 150;

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
          dispatch(
            selectedProduct({...item, index: index, isSeller: isSeller}),
          );
          dispatch(setSelectedProductData({}));
          navigation.push('ProductDetailContainer' as never);
        }}>
        {item?.status !== 'sold' && (
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
        )}

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
          <View>
            <Text
              numberOfLines={1}
              style={[
                Fonts.poppinMed14,
                Gutters.tinyTMargin,
                {
                  fontWeight: '500',
                  color: Colors.black_232C28,
                },
              ]}>
              {item?.title}
            </Text>

            {item?.end_date ? (
              <View style={[Layout.row, Layout.alignItemsCenter]}>
                <Images.svg.calendar.default width={10} />
                <Text
                  style={[
                    Fonts.poppinReg10,
                    Gutters.littleLMargin,
                    {color: Colors.black_232C28},
                  ]}>
                  {moment(item?.end_date).format('ddd, DD MMM')}
                </Text>
              </View>
            ) : (
              <View style={[Gutters.tinyBMargin]} />
            )}
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

  return (
    <View style={[Layout.fill]}>
      {
        data?.length > 0 ? (
          <View style={[Layout.fullWidth, Gutters.tinyLMargin]}>
            <FlashList
              scrollEnabled={scrollEnabled ? scrollEnabled : false}
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
              extraData={data || []}
              data={data || []}
              renderItem={RenderItemFlashList}
              keyExtractor={(item, index) => index.toString()}
              onScrollEndDrag={() => {
                console.log('>>> onScrollEnd ');
              }}
              onEndReachedThreshold={0.6}
              onMomentumScrollBegin={() => {
                setOnEndReachedCalledDuringMomentum(false);
              }}
              onEndReached={() => {
                if (!onEndReachedCalledDuringMomentum) {
                  if (loadMore) {
                    setIsLoadingBottom(true);
                    loadMore();
                    setTimeout(() => {
                      setIsLoadingBottom(false);
                    }, 3000);
                  }
                  setOnEndReachedCalledDuringMomentum(true);
                }
              }}
              onRefresh={async () => {
                console.log('>> onRefresh');
              }}
              refreshing={false}
              ListFooterComponent={() => {
                return (
                  <View>
                    {isLoadingBottom ? (
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
        ) : hideNoData ? null : (
          <View style={[Layout.fill, Layout.center]}>
            <Text
              style={[
                Fonts.poppinMed16,
                Gutters.smallTMargin,
                {color: Colors.black_232C28},
              ]}>
              {t('common:no_data_found')}
            </Text>
          </View>
        )
        //  (
        //   <CustomPageLoading />
        // )
      }
      <CustomLoading isLoading={addFavLoading || removeFavLoading} />
    </View>
  );
};

export default ProductListing;
