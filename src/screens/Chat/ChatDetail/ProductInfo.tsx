import i18next from 'i18next';
import React from 'react';
import {View} from 'react-native';
import {CustomFastImage, TextSemiBold} from '../../../components';
import {API_URL} from '../../../config';
import {useTheme} from '../../../hooks';
import {getPlaceHolderProduct, getURLPhoto} from '../../../utils/helpers';
import {SvgUri} from 'react-native-svg';

type Props = {
  productInfo: any;
};

const ProductInfo = ({productInfo}: Props) => {
  const {Layout, Fonts, Gutters, Colors, Images} = useTheme();
  // console.log('productInfo=======', productInfo.images[0]?.name);

  return (
    <View
      style={[
        Gutters.xTinyPadding,
        Layout.fullWidth,
        i18next.language === 'en' ? Layout.row : Layout.rowReverse,
        Layout.alignItemsCenter,
        {
          borderBottomWidth: 0.5,
          borderColor: Colors.gray_C9C9C9,
        },
      ]}>
      {productInfo?.images && productInfo?.images[0]?.name?.endsWith('.svg') ? (
        <View
          style={[
            Layout.alignItemsCenter,
            Layout.justifyContentCenter,
            {height: 85, width: 106},
          ]}>
          <SvgUri
            width="100"
            height="100"
            uri={getURLPhoto(productInfo?.images[0]?.name)}
            style={[{width: 106, borderRadius: 10, height: 85}]}
          />
        </View>
      ) : (
        <CustomFastImage
          customStyle={[{width: 106, height: 85, borderRadius: 6}]}
          url={
            productInfo?.images && productInfo?.images[0]?.name
              ? `${API_URL}get-uploaded-image/${productInfo?.images[0]?.name}`
              : getPlaceHolderProduct()
          }
          cutomViewStyle={[{width: 106, borderRadius: 10, height: 85}]}
          resizeMode="cover"
        />
      )}
      <View
        style={[
          Gutters.tinyLMargin,
          Layout.justifyContentCenter,
          Layout.overflow,
          {
            width: '70%',
          },
        ]}>
        <TextSemiBold
          text={`${productInfo?.title}`}
          textStyle={[
            Fonts.poppinSemiBold18,
            {lineHeight: 26, color: Colors.black_232C28},
          ]}
          textProps={{
            numberOfLines: 4,
          }}
        />
      </View>
    </View>
  );
};

export default ProductInfo;
