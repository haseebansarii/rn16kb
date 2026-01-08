import React from 'react';
import {Text, View} from 'react-native';
import {CustomFastImage, TextSemiBold} from '../../components';
import {useTheme} from '../../hooks';
import {
  formatNumberFloat,
  getPlaceHolderProduct,
  getURLPhoto,
} from '../../utils/helpers';
import {SvgUri} from 'react-native-svg';

type Props = {
  item?: any;
};

const itemDetail = ({item}: Props) => {
  const {image, title, buyNowPrice} = item?.item;
  const {fixed_price_offer, start_price} = item?.item?.productObj;
  console.log(start_price, fixed_price_offer);

  const {Layout, Colors, Fonts, Images, Gutters} = useTheme();
  return (
    <View
      style={[
        Layout.row,
        Layout.justifyContentBetween,
        Layout.alignItemsCenter,
        {
          borderTopWidth: 1,
          borderBottomWidth: 1,
          height: 117,
          borderColor: Colors.gray_C9C9C9,
          backgroundColor: Colors.light_grayF4F4F4,
        },
      ]}>
      {image?.endsWith('.svg') ? (
        <View
          style={[
            Layout.alignItemsCenter,
            Layout.justifyContentCenter,
            {
              height: '100%',
              // width: '30%',
            },
          ]}>
          <SvgUri
            width="100"
            height="100"
            uri={getURLPhoto(image)}
            style={[Layout.fullHeight, Layout.fullWidth, {borderRadius: 0}]}
          />
        </View>
      ) : (
        <CustomFastImage
          url={image ? getURLPhoto(image) : getPlaceHolderProduct()}
          resizeMode="cover"
          cutomViewStyle={[Layout.fullHeight, {width: '30%', borderRadius: 0}]}
          customStyle={[Layout.fullHeight, Layout.fullWidth, {borderRadius: 0}]}
        />
      )}
      <View style={[Layout.fullWidth, Gutters.smallPadding, {flex: 1}]}>
        <Text
          numberOfLines={3}
          style={[
            Fonts.poppinSemiBold22,
            Gutters?.littleTMargin,
            {color: Colors.black_232C28},
          ]}>
          {title}
        </Text>

        <Text
          style={[
            Fonts.poppinMed15,
            Gutters.tinyTMargin,
            {color: Colors.black_232C28},
          ]}>
          {item?.item?.productObj?.type == 'auction'
            ? item?.item?.productObj?.buy_now_price
              ? 'Buy for: '
              : 'Starting from: '
            : 'Buy for: '}
          <Text style={[Fonts.poppinSemiBold20, {color: Colors.primary}]}>
            {`${t('common:nz')} ${formatNumberFloat(
              item?.item?.productObj?.type == 'auction'
                ? item?.item?.productObj?.buy_now_price
                  ? item?.item?.productObj?.buy_now_price
                  : item?.item?.productObj?.start_price || 0
                : item?.item?.productObj?.fixed_price_offer || 0,
            )}`}
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default itemDetail;
