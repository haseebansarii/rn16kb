import {StyleSheet, Text, View} from 'react-native';
import React, {memo} from 'react';
import {useTheme} from '../../hooks';
import {CustomFastImage, TextRegular, TextSemiBold} from '../../components';
import i18next from 'i18next';
import {useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';
import {RootState} from '../../store/store';
import {getStaticImage, getURLPhoto} from '../../utils/helpers';
import {SvgUri} from 'react-native-svg';

type Props = {};

const UserProfile = ({seller}: any) => {
  const {Colors, Fonts, Gutters, Images, Layout} = useTheme();
  const user_data = useSelector((state: RootState) => state.auth?.user_data);
  const selectedProductData = useSelector(
    (state: any) => state?.list?.selectedProductData,
  );
  return (
    <View
      style={[
        Layout.alignItemsCenter,
        i18next.language === 'en' ? Layout.row : Layout.rowReverse,
      ]}>
      <CustomFastImage
        url={
          seller
            ? selectedProductData?.user?.photo?.name
              ? getURLPhoto(selectedProductData?.user?.photo?.name)
              : require('../../theme/assets/images/user.png')
            : user_data?.photo?.name
            ? getURLPhoto(user_data?.photo?.name)
            : require('../../theme/assets/images/user.png')
        }
        resizeMode="cover"
        customStyle={[
          {
            backgroundColor: Colors.primary,
            width: 60,
            height: 60,
            borderRadius: 60 / 2,
          },
        ]}
      />

      <View style={[Gutters.smallLPadding]}>
        <TextSemiBold
          text={`${
            seller
              ? selectedProductData?.user?.first_name
              : user_data?.first_name
          } ${
            seller ? selectedProductData?.user?.last_name : user_data?.last_name
          }`}
          textStyle={[Fonts.poppinSemiBold24, {color: Colors.white}]}
        />
        {/* <TextRegular
          text={`${95}% ${t('common:feedback')} - ${200}`}
          textStyle={[{textTransform: 'none'}]}
        /> */}
      </View>
    </View>
  );
};

export default UserProfile;
