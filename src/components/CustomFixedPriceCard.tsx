import React, {ReactNode} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import i18next from 'i18next';

import moment from 'moment';
import FastImage from 'react-native-fast-image';
import {useDispatch} from 'react-redux';
import {TextMedium} from '.';
import {useTheme} from '../hooks';
import {selectedProduct} from '../store/productDetail/ProductDetailSlice';
import {fixBottomTab} from '../store/stack/StackSlice';
import {
  getPlaceHolderProduct,
  getStaticImage,
  getURLPhoto,
} from '../utils/helpers';
type Props = {
  index: number;
  children: ReactNode;
  btnProps?: any;
  dataList?: any;
  navigation: any;
  addRemoveFavourites?: CallableFunction;
};

const FixedPriceCard = ({
  index,
  navigation,
  btnProps,
  addRemoveFavourites,
  children,
  dataList,
}: Props) => {
  const {Colors, Fonts, Gutters, Images, Layout} = useTheme();

  const dispatch = useDispatch();

  return (
    <TouchableOpacity
      {...btnProps}
      key={index}
      onPress={() => {
        dispatch(fixBottomTab(false));
        dispatch(selectedProduct(dataList));
        navigation.navigate('ProductDetailContainer' as never);
      }}
      style={[
        Gutters.smallBMargin,
        Gutters.darkShadow,
        Layout.overflow,
        {
          width: '49%',
          height: 250,
          borderRadius: 10,
          backgroundColor: Colors.white,
        },
      ]}>
      <View style={[{height: '50%'}]}>
        <FastImage
          source={
            dataList?.images && dataList?.images[0]?.name
              ? {
                  uri: getURLPhoto(dataList?.images[0]?.name),
                }
              : getPlaceHolderProduct()
          }
          resizeMode="cover"
          style={[Layout.alignItemsEnd, Layout.fill, Gutters.tinyTLRadius]}>
          <TouchableOpacity
            style={[Layout.absolute, {top: 0, right: 0}]}
            activeOpacity={0.8}
            onPress={() =>
              typeof addRemoveFavourites === 'function' &&
              addRemoveFavourites(dataList?._id, dataList?.is_favourite)
            }>
            {dataList?.is_favourite ? (
              <Images.svg.rectangleGroup.default />
            ) : (
              <Images.svg.eyeBack.default />
            )}
          </TouchableOpacity>
        </FastImage>
      </View>
      <View
        style={[Layout['fill'], Gutters.tinyHPadding, Gutters.tinyVPadding]}>
        <View
          style={[
            i18next.language === 'en' ? Layout.row : Layout.rowReverse,
            Layout.alignItemsCenter,
            Layout.justifyContentBetween,
          ]}>
          <View style={[Layout.row, Layout.alignItemsCenter]}>
            <Images.svg.LocationTransparent.default />
            <Text
              style={[
                Gutters.tinyLMargin,
                Fonts.poppinReg14,
                {color: Colors.black_232C28},
              ]}>
              {dataList?.pickup_location !== null
                ? dataList?.pickup_location?.length > 10
                  ? dataList?.pickup_location.slice(0, 10) + '...'
                  : dataList?.pickup_location
                : 'N/A'}
            </Text>
          </View>
          <View style={[Layout.row, Layout.alignItemsCenter]}>
            <Images.svg.calendar.default />
            <Text
              style={[
                Gutters.tinyLMargin,
                Fonts.poppinReg14,
                {color: Colors.black_232C28},
              ]}>
              {dataList?.end_date !== null
                ? moment(dataList?.end_date).format('MMM DD YYYY')
                : 'N/A'}
            </Text>
          </View>
          {/* <View
            style={[Layout.row, Layout.alignItemsCenter, {marginBottom: 6}]}>
            <CustomFastImage
              url="https://cdn.pixabay.com/photo/2024/01/19/16/54/flower-8519409_1280.jpg"
              cutomViewStyle={[
                {
                  width: 26,
                  height: 26,
                  borderWidth: 2,
                  borderColor: Colors.primary,
                },
              ]}
              resizeMode="cover"
            />
            <CustomStarRating
              customStyle={[Gutters.littleLMargin]}
              starSize={12}
              rating={dataList?.user?.avg_rating_as_seller}
              starProps={{
                emptyStarColor: Colors.gray_707070,
              }}
            />
          </View> */}
          {/* <TextMedium
            text={`${humanizeDuration(3600000)}`}
            textStyle={[
              Fonts.poppinMed10,
              Gutters.smallBMargin,
              {color: Colors.black_232C28},
            ]}
          /> */}
        </View>
        <TextMedium
          text={
            dataList?.title?.length > 10
              ? dataList?.title.slice(0, 20) + '...'
              : dataList?.title
          }
          textStyle={[
            Fonts.poppinMed12,
            Gutters.tinyVMargin,
            {color: Colors.black_232C28},
          ]}
        />
      </View>
      {children}
    </TouchableOpacity>
  );
};

export default FixedPriceCard;
