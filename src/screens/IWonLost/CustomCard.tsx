import i18next from 'i18next';
import React, {ReactNode} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import {Image} from 'react-native';
import {useDispatch} from 'react-redux';
import {TextBold, TextMedium, TextSemiBold} from '../../components';
import {useTheme} from '../../hooks';
import {
  setAddNoteOfSelectedProduct,
  setSelectedProductData,
} from '../../store/Listings';
import {getPlaceHolderProduct, getURLPhoto} from '../../utils/helpers';
import {fixBottomTab} from '../../store/stack/StackSlice';
import {selectedProduct} from '../../store/productDetail/ProductDetailSlice';
import RegularText from '../../components/RegularText';
import moment from 'moment';
import {SvgUri} from 'react-native-svg';

type Props = {
  index?: number;
  children?: ReactNode;
  pickup_location: string;
  showTriangleImage?: boolean;
  productEnded?: boolean;
  closingDate?: string;
  image: string;
  title: string;
  column?: any;
  id: string;
  status: string;
  user: object;
  selected?: number;
  buy_now_price?: string;
  setPlaceFeedBack: CallableFunction;
  item?: any;
  navigation?: any;
};

const CustomCard = ({
  index,
  pickup_location,
  selected,
  id,
  status,
  user,
  setPlaceFeedBack,
  buy_now_price,
  productEnded,
  title,
  image,
  showTriangleImage,
  children,
  column,
  item,
  navigation,
}: Props) => {
  const {Layout, Colors, Fonts, Images, Gutters} = useTheme();
  const dispatch = useDispatch();

  return (
    <View
      key={index}
      style={[
        Layout.selfCenter,
        Gutters.darkShadow,
        Gutters.smallBMargin,
        index == 0 && Gutters.xTinyTMargin,
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
            height: 160,
          },
        ]}>
        <TouchableOpacity
          style={[{width: 150}]}
          onPress={() => {
            dispatch(fixBottomTab(false));
            dispatch(selectedProduct(item));
            dispatch(setSelectedProductData({}));
            navigation.navigate('ProductDetailContainer' as never);
          }}>
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
                  {borderTopRightRadius: 10, borderTopLeftRadius: 10},
                ]}
              />
              {showTriangleImage && column == 1 && (
                <View style={{position: 'absolute', top: -1, right: 0}}>
                  <Images.svg.rectangleGroup.default />
                </View>
              )}
            </View>
          ) : (
            <Image
              source={
                image !== undefined && image
                  ? {
                      uri: getURLPhoto(image),
                    }
                  : getPlaceHolderProduct()
              }
              resizeMode="cover"
              style={[Layout.fill, Gutters.tinyTLRadius]}>
              {showTriangleImage && column == 1 && (
                <View style={{position: 'absolute', top: -1, right: 0}}>
                  <Images.svg.rectangleGroup.default />
                </View>
              )}
            </Image>
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
            Gutters.xTinyPadding,
            Layout.justifyContentBetween,
          ]}>
          <View>
            <RegularText
              text={`${
                item?.status?.toLowerCase() === 'sold'
                  ? t('common:sold_on')
                  : t('common:expired_on')
              }: ${moment(
                item?.status_changed_at
                  ? item?.status_changed_at
                  : item?.updated_at,
              ).format('DD MMM YYYY')}`}
              textStyle={[
                Fonts.poppinMed12,
                {color: selected === 0 ? Colors.dark_gray_676C6A : Colors.red},
              ]}
            />
            <TextSemiBold
              text={title?.length > 20 ? title?.slice(0, 20) + '...' : title}
              textStyle={[
                Fonts.poppinSemiBold16,
                Gutters.littleTMargin,
                {color: Colors.black_232C28, width: '80%'},
              ]}
            />
          </View>
          <View
            style={[
              Layout.row,
              Layout.alignItemsCenter,
              Layout.justifyContentBetween,
            ]}>
            <View style={[{flex: 1}]}>
              {selected === 0 && (
                <>
                  <TextMedium
                    text={`${t('common:bought')}:`}
                    textStyle={[
                      Fonts.poppinMed12,
                      {color: Colors.dark_gray_676C6A},
                    ]}
                  />
                  <TextSemiBold
                    text={`${t('common:nz')} ${item?.sold_at_price_total}`}
                    textStyle={[
                      Fonts.poppinSemiBold20,
                      Layout.textUpperCase,
                      {color: Colors.black_232C28},
                    ]}
                  />
                </>
              )}
            </View>
            <View style={[{flex: 1, alignItems: 'flex-end'}]}>
              {pickup_location && (
                <View style={[Layout.row, Layout.alignItemsCenter]}>
                  <TextSemiBold
                    text={
                      pickup_location?.length > 10
                        ? pickup_location?.slice(0, 12) + '...'
                        : pickup_location
                    }
                    textStyle={[
                      Fonts.poppinSemiBold14,
                      {
                        color:
                          selected === 0
                            ? Colors.dark_gray_676C6A
                            : Colors.primary,
                      },
                    ]}
                  />
                </View>
              )}
            </View>
          </View>

          {/* <View style={[Layout.row, Layout.alignItemsCenter]}>
              <Images.svg.calendarTick.default />
              <TextMedium
                text={`${status}`}
                textStyle={[
                  Fonts.poppinSemiBold13,
                  Gutters.littleLMargin,
                  {color: Colors.red},
                ]}
              />
            </View> */}

          {/* {selected === 0 ? (
            <TextMedium
              text={`${status}`}
              // text={`Closes: ${closingDate}`}
              textStyle={[
                Fonts.poppinMed10,
                Gutters.tinyTMargin,
                {color: Colors.red},
              ]}
            />
          ) : (
            <TextMedium
              text={`Expired on: ${moment(productEnded).format('MMM DD YYYY')}`}
              textStyle={[
                Fonts.poppinMed10,
                Gutters.tinyTMargin,
                {color: productEnded ? Colors.red : Colors.dark_gray_676C6A},
              ]}
            />
          )} */}
          {/* <View
            style={[
              Layout.row,
              Layout.justifyContentBetween,
              Layout.alignItemsCenter,
            ]}>
        
          </View> */}
        </View>
      </View>
      <View
        style={[
          Gutters.smallHPadding,
          Gutters.tinyVPadding,
          Layout.alignItemsCenter,
          Layout.row,
          Layout.justifyContentBetween,
          {
            borderTopWidth: 1,
            borderColor: Colors.gray_C9C9C9,
          },
        ]}>
        <View></View>
        {/* {status == 'sold' ? (
          <View style={[Layout.row, Layout.alignItemsCenter]}>
            <Images.svg.dollarCircle.default />
            <View style={[Gutters.littleLMargin]}>
              <TextBold
                text={status}
                textStyle={[Fonts.poppinBold14, {color: Colors.black_232C28}]}
              />
            </View>
          </View>
        ) : (
          <View style={[Layout.row, Layout.alignItemsCenter]}>
            <Images.svg.dollarCircle.default />
            <View style={[Gutters.littleLMargin]}>
              <TextBold
                text={`${19}`}
                textStyle={[Fonts.poppinBold14, {color: Colors.black_232C28}]}
              />
              <TextMedium
                text="bids"
                textStyle={[Fonts.poppinReg14, {color: Colors.black_232C28}]}
              />
            </View>
          </View>
        )} */}
        {selected === 0 && (
          <TouchableOpacity
            onPress={() => {
              if (item?.is_buyer_feedback) {
              } else {
                setPlaceFeedBack(true);
                dispatch(
                  setAddNoteOfSelectedProduct({
                    id,
                    user,
                    title,
                  }),
                );
              }
            }}>
            <TextBold
              text={`${
                item?.is_buyer_feedback
                  ? t('common:feedback_sent')
                  : t('common:place_feedback')
              }`}
              textStyle={[
                Fonts.poppinBold14,
                {
                  textDecorationLine: 'underline',
                  color: item?.is_buyer_feedback
                    ? Colors.black_232C28
                    : Colors.primary,
                },
              ]}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CustomCard;
