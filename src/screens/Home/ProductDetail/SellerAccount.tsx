import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {useTheme} from '../../../hooks';
import {navigate} from '../../../navigators/utils';
import {getStaticImage, getURLPhoto} from '../../../utils/helpers';
import {CustomFastImage, CustomStarRating} from '../../../components';
import {RootState} from '../../../store/store';
import {useNavigation} from '@react-navigation/native';

const SellerAccount = () => {
  const {Layout, Fonts, Gutters, Colors, Images} = useTheme();
  const navigation = useNavigation();
  const selectedProductData = useSelector(
    (state: any) => state?.list?.selectedProductData,
  );
  const user_data = useSelector((state: any) => state?.auth?.user_data);
  return (
    <TouchableOpacity
      onPress={() => {
        navigate('RatingReviews' as any, {
          header_text: 'Seller Detail',
          id: selectedProductData?.user?._id,
          img: selectedProductData?.user?.photo?.name,
          name: `${selectedProductData?.user?.first_name} ${selectedProductData?.user?.last_name}`,
        });
      }}
      activeOpacity={0.9}
      style={[
        Layout.fullWidth,
        Layout.row,
        Gutters.tinyVPadding,
        Gutters.tinyHPadding,
        {borderRadius: 5},
        {borderWidth: 1},
        {borderColor: Colors.dark_gray_676C6A},
        {height: 135},
      ]}>
      <View>
        <CustomFastImage
          url={
            selectedProductData?.user?.photo?.name
              ? getURLPhoto(selectedProductData?.user?.photo?.name) || ''
              : getStaticImage(true)
          }
          resizeMode="cover"
          customStyle={[{height: 80, width: 80, borderRadius: 80 / 2}]}
        />

        {/* <FastImage
          source={Images.png.Seller}
          style={{height: 80, width: 80, borderRadius: 80 / 2}}
        /> */}
      </View>
      <View
        style={[
          Layout.fill,
          Layout.justifyContentBetween,
          Gutters.tinyLMargin,
        ]}>
        <View
          style={[
            Layout.row,
            Layout.justifyContentBetween,
            Layout.alignItemsCenter,
          ]}>
          <View>
            <Text style={[Fonts.poppinSemiBold20]}>
              {selectedProductData?.user?.first_name}{' '}
              {selectedProductData?.user?.last_name}
            </Text>
          </View>

          {/* <TouchableOpacity
            style={[
              Layout.row,
              Gutters.tinyHPadding,
              Gutters.littleVPadding,
              Gutters.lightShadow,
              {backgroundColor: Colors.light_grayF4F4F4, borderRadius: 5},
            ]}>
            <Images.svg.LikeOutlined.default />
            <Text
              style={[
                Gutters.littleLMargin,
                {
                  color: Colors.dark_gray_676C6A,
                  fontSize: 14,
                  fontWeight: '400',
                },
              ]}>
              Save
            </Text>
          </TouchableOpacity> */}
        </View>
        {selectedProductData?.user?._id != user_data?._id &&
          selectedProductData?.show_phone &&
          selectedProductData?.status == 'sold' && (
            <Text
              numberOfLines={1}
              style={[
                Fonts.poppinMed12,
                Gutters.littleVMargin,
                {color: Colors.black_232C28},
              ]}>
              Phone: {selectedProductData?.user?.phone_number}
            </Text>
          )}
        <View
          style={[
            Layout.row,
            Layout.justifyContentBetween,
            Layout.alignItemsCenter,
          ]}>
          <View style={[]}>
            <CustomStarRating
              disabled={true}
              maxStars={5}
              starSize={15}
              rating={selectedProductData?.user?.avg_rating_as_seller || 5}
              fullStarColor={Colors.primary}
              emptyStarColor={Colors.gray_C9C9C9}
              halfStarEnabled={true}
              showRating={true}
            />
          </View>
          <View style={[Layout.alignItemsEnd, {width: '65%'}]}>
            <Text
              numberOfLines={1}
              style={[
                {color: Colors.black_232C28, fontSize: 14, fontWeight: '400'},
              ]}>
              {selectedProductData?.user?.address}
            </Text>
          </View>
        </View>
        <Text
          numberOfLines={1}
          style={[
            {
              color: Colors.green_06975E,
              fontSize: 14,
              fontWeight: '400',
              textDecorationLine: 'underline',
            },
          ]}>
          View seller's other listings
        </Text>
        {/* <View style={[Layout.row]}>
          <Text style={[Fonts.poppinReg13, {textDecorationLine: 'underline'}]}>
            {t('view_other_listing')}
          </Text>
          <View style={[Gutters.littleLMargin, Layout.rotate90Inverse]}>
            <Images.svg.DropDown.default />
          </View>
        </View> */}
      </View>
    </TouchableOpacity>
  );
};

export default SellerAccount;
