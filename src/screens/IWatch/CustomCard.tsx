import i18next from 'i18next';
import React, {useCallback} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import {Image} from 'react-native';
import {useDispatch} from 'react-redux';
import {
  CustomLoading,
  TextMedium,
  TextRegular,
  TextSemiBold,
} from '../../components';
import {useTheme} from '../../hooks';
import {
  setAddNoteOfSelectedProduct,
  setSelectedProductData,
} from '../../store/Listings';
import {getPlaceHolderProduct, getURLPhoto} from '../../utils/helpers';

import {useRemoveFavouriteListingMutation} from '../../services/modules/home/favouriteListing';
import {fixBottomTab} from '../../store/stack/StackSlice';
import {selectedProduct} from '../../store/productDetail/ProductDetailSlice';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import {SvgUri} from 'react-native-svg';

type Props = {
  index?: number;
  addNotePress?: CallableFunction;
  updateNotePress?: CallableFunction;
  showTriangleImage?: boolean;
  closingDate?: string;
  image: string;
  status: string;
  start_price: string;
  title: string;
  pickup_location: string;
  buy_now_price: string;
  addNotes: boolean;
  column?: any;
  id?: string;
  note?: any;
  showButton?: boolean;
  sendOffer?: CallableFunction;
  item?: any;
  getIWatchDataAfterRemove?: CallableFunction;
  onPress?: CallableFunction;
};

const CustomCard = ({
  index,
  updateNotePress,
  addNotePress,
  showButton = true,
  note,
  addNotes,
  status,
  id,
  sendOffer,
  pickup_location,
  start_price,
  buy_now_price,
  title,
  image,
  showTriangleImage,
  item,
  getIWatchDataAfterRemove,
  onPress,
}: Props) => {
  const {Layout, Colors, Fonts, Images, Gutters} = useTheme();

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [removeFavouriteListing, {isLoading}] =
    useRemoveFavouriteListingMutation();
  const deleteItem = async (id: string) => {
    removeFavouriteListing(id).then(() => {
      getIWatchDataAfterRemove && getIWatchDataAfterRemove();
    });
  };

  return (
    <View
      key={index}
      style={[
        Layout.selfCenter,
        Gutters.darkShadow,
        Gutters.smallBMargin,
        {
          marginRight: '3%',
          marginLeft: '3%',
          borderRadius: 10,
          backgroundColor: Colors.white,
        },
      ]}>
      <View
        style={[
          i18next.language === 'en' ? Layout.row : Layout.rowReverse,
          Layout.justifyContentBetween,

          Layout.overflow,
          Layout.fullWidth,
          {
            height: 200,
          },
        ]}>
        <TouchableOpacity
          activeOpacity={onPress ? 1 : 0.7}
          style={[{width: 150}]}
          onPress={
            onPress
              ? onPress
              : () => {
                  dispatch(fixBottomTab(false));
                  dispatch(selectedProduct(item));
                  dispatch(setSelectedProductData({}));
                  navigation.navigate('ProductDetailContainer' as never);
                }
          }>
          {image?.endsWith('.svg') ? (
            <View
              style={[
                Layout.alignItemsCenter,
                Layout.justifyContentCenter,
                {
                  height: '100%',
                },
              ]}>
              <SvgUri
                width="100"
                height="100"
                uri={getURLPhoto(image)}
                style={[
                  Layout.fill,
                  Gutters.tinyTLRadius,
                  Gutters.tinyBLRadius,
                ]}
              />
              {showTriangleImage && (
                <TouchableOpacity
                  activeOpacity={onPress ? 1 : 0.7}
                  onPress={
                    onPress
                      ? onPress
                      : () => {
                          if (typeof id === 'string') {
                            deleteItem(id);
                          }
                        }
                  }
                  style={{position: 'absolute', top: -1, right: 0}}>
                  <Images.svg.rectangleGroup.default />
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View
              style={[Layout.fill, Gutters.tinyTLRadius, Gutters.tinyBLRadius]}>
              <Image
                source={
                  image
                    ? {
                        uri: getURLPhoto(image),
                      }
                    : getPlaceHolderProduct()
                }
                resizeMode="cover"
                style={[
                  Layout.fill,
                  Gutters.tinyTLRadius,
                  Gutters.tinyBLRadius,
                ]}
              />
              {showTriangleImage && (
                <TouchableOpacity
                  activeOpacity={onPress ? 1 : 0.7}
                  onPress={
                    onPress
                      ? onPress
                      : () => {
                          if (typeof id === 'string') {
                            deleteItem(id);
                          }
                        }
                  }
                  style={{position: 'absolute', top: -1, right: 0}}>
                  <Images.svg.rectangleGroup.default />
                </TouchableOpacity>
              )}
            </View>
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
        </TouchableOpacity>
        <View
          style={[
            Layout.fill,
            Layout.column,
            Layout.justifyContentBetween,
            Gutters.xTinyHPadding,
          ]}>
          <View style={[Layout.row, Gutters.xTinyTMargin]}>
            <Images.svg.calendarTick.default />
            <Text
              style={[
                Fonts.poppinSemiBold12,
                Gutters.tinyLMargin,
                {
                  color: Colors.dark_gray_676C6A,
                  width: '90%',
                },
              ]}>
              {moment(
                item?.end_date ? item?.end_date : item?.updated_at,
              ).format('DD MMM YYYY')}
            </Text>
          </View>
          <Text
            style={[
              Fonts.poppinSemiBold16,
              Gutters.xTinyBMargin,

              {
                color: Colors.black_232C28,
                width: '90%',
              },
            ]}>
            {title?.length > 10 ? title?.slice(0, 10) + '...' : title}
          </Text>
          <View
            style={[
              Layout.fullWidth,
              Layout.row,
              Layout.justifyContentBetween,
              Layout.alignItemsCenter,
            ]}>
            {item?.make_an_offer && item?.type != 'auction' ? (
              <View style={[{width: '50%'}]}>
                <TouchableOpacity
                  onPress={() => {
                    sendOffer();
                  }}
                  style={[
                    Gutters.tinyPadding,
                    {
                      backgroundColor: Colors.lightGreen_DBF5EC,
                      borderRadius: 6,
                    },
                  ]}>
                  <Text
                    style={[
                      Fonts.poppinReg9,
                      {color: Colors.black_232C28, textAlign: 'center'},
                    ]}>
                    Send an Offer
                  </Text>
                </TouchableOpacity>
              </View>
            ) : item?.type == 'auction' ? (
              <View style={[Layout.alignItemsStart, {width: '50%'}]}>
                <Text style={[Fonts.poppinMed12, {color: Colors.black_232C28}]}>
                  {`${t('common:starting_from')}:`}
                </Text>
                <Text
                  style={[
                    Fonts.poppinSemiBold14,
                    {color: Colors.black_232C28},
                  ]}>
                  {`${t('common:nz')} ${start_price}`}
                </Text>
              </View>
            ) : (
              <View></View>
            )}

            {!!buy_now_price ? (
              <View style={[Layout.alignItemsEnd, {width: '45%'}]}>
                <Text style={[Fonts.poppinMed12, {color: Colors.primary}]}>
                  {item?.listing_type == 'property'
                    ? item?.property?.for_sale
                      ? 'Asking Price:'
                      : 'Rental Price:'
                    : 'Buy Now:'}
                </Text>
                <Text
                  numberOfLines={3}
                  style={[
                    Fonts.poppinSemiBold14,
                    {
                      color: Colors.primary,
                      alignSelf: 'flex-end',
                      textAlign: 'right',
                    },
                  ]}>{`${t('common:nz')} ${buy_now_price}`}</Text>
              </View>
            ) : (
              item?.make_an_offer &&
              item?.type != 'auction' && (
                <View style={[{width: '50%'}]}>
                  <Text
                    style={[
                      Fonts.poppinMed12,
                      Layout.selfEnd,
                      {color: Colors.black_232C28},
                    ]}>
                    {`${t('common:starting_from')}:`}
                  </Text>

                  <View style={[{width: '100%'}]}>
                    <Text
                      numberOfLines={3}
                      ellipsizeMode="tail"
                      style={[
                        Fonts.poppinSemiBold14,
                        Layout.selfEnd,
                        {color: Colors.black_232C28},
                      ]}>
                      {item?.type == 'auction'
                        ? `${t('common:nz')} ${item?.start_price}`
                        : `${t('common:nz')} ${item?.fixed_price_offer}`}
                    </Text>
                  </View>
                </View>
              )
            )}
          </View>
          {showButton ? (
            <View style={[Gutters.littleVMargin]}>
              {note !== null && note !== '' ? (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    if (typeof updateNotePress == 'function') {
                      updateNotePress(note);
                      dispatch(
                        setAddNoteOfSelectedProduct({
                          image,
                          title,
                          id,
                          buy_now_price,
                          start_price,
                          addNotes,
                          pickup_location,
                        }),
                      );
                    }
                  }}
                  style={[Layout.row, Layout.alignItemsCenter]}>
                  <View
                    style={[
                      Layout.rowCenter,
                      Gutters.tinyRMargin,
                      {
                        width: 84,
                        height: 31,
                        borderRadius: 6,
                        backgroundColor: Colors.primary,
                      },
                    ]}>
                    <TextMedium
                      text={`${t('common:added')}`}
                      textStyle={[
                        Fonts.poppinMed15,
                        Gutters.littleRMargin,
                        {color: Colors.white},
                      ]}
                    />
                    <Images.svg.TickIcon.default fill={Colors.white} />
                  </View>
                  <View
                    style={[
                      Layout.alignItemsCenter,
                      Layout.justifyContentBetween,
                    ]}>
                    <Images.svg.EditIcon.default />
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    if (typeof addNotePress === 'function') {
                      addNotePress();
                      dispatch(
                        setAddNoteOfSelectedProduct({
                          image,
                          title,
                          id,
                          note,
                          buy_now_price,
                          start_price,
                          addNotes,
                          pickup_location,
                        }),
                      );
                    }
                  }}
                  style={[
                    Layout.rowCenter,
                    Gutters.littleVMargin,
                    {
                      width: 109,
                      height: 31,
                      borderRadius: 6,
                      backgroundColor: Colors.light_grayF4F4F4,
                    },
                  ]}>
                  <Text
                    style={[Fonts.poppinMed15, {color: Colors.black}]}>{`${t(
                    'common:add_note',
                  )}`}</Text>
                  <Images.svg.addnotes.default style={[Gutters.tinyLMargin]} />
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={[Gutters.littleVMargin]} />
          )}
        </View>
      </View>
      <View
        style={[
          Gutters.smallHPadding,
          Gutters.xTinyVPadding,
          Layout.row,
          Layout.alignItemsCenter,
          Layout.justifyContentBetween,
          {
            borderTopWidth: 1,
            borderColor: Colors.gray_C9C9C9,
          },
        ]}>
        {status?.toLowerCase() == 'sold' ||
        status?.toLowerCase() == 'withdrawn' ||
        status?.toLowerCase() == 'inactive' ||
        status?.toLowerCase() == 'expired' ? (
          <View style={[Layout.row]}>
            <Images.svg.calendarTick.default />
            <Text
              style={[
                Fonts.poppinReg14,
                Layout.textTransform,
                Gutters.littleLMargin,
                {color: Colors.red},
              ]}>
              {status}
            </Text>
          </View>
        ) : (
          <View />
        )}

        <Text
          style={[
            Fonts.poppinReg14,
            {color: Colors.black_232C28, width: '60%', textAlign: 'right'},
          ]}>
          {pickup_location?.length > 25
            ? pickup_location?.slice(0, 25) + '...'
            : pickup_location}
        </Text>
      </View>
      <CustomLoading isLoading={isLoading} />
    </View>
  );
};

export default CustomCard;
