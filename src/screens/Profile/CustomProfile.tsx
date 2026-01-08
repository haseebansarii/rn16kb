import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {useTheme} from '../../hooks';
import CustomStar from './CustomStar';
import {
  CustomFastImage,
  CustomStarRating,
  TextMedium,
  TextSemiBold,
} from '../../components';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import {getStaticImage, getURLPhoto, showUserAlert} from '../../utils/helpers';
import {SvgUri} from 'react-native-svg';

type TProps = {
  navigation: any;
};

const CustomProfile = ({navigation}: TProps) => {
  const {Colors, Gutters, Layout, Images, Fonts} = useTheme();
  const token = useSelector((state: RootState) => state?.auth?.token);
  const user_data = useSelector((state: RootState) => state?.auth?.user_data);

  return (
    <View
      style={[
        Layout.row,
        Layout.alignItemsCenter,
        Gutters.smallBMargin,
        Gutters.smallHPadding,
      ]}>
      {user_data?.photo?.name?.endsWith('.svg') ? (
        <View
          style={[
            Layout.alignItemsCenter,
            Layout.justifyContentCenter,
            {
              width: 80,
              height: 80,
              borderRadius: 55,
              borderWidth: 3,
              borderColor: Colors.primary,
            },
          ]}>
          <SvgUri
            width="68"
            height="68"
            uri={getURLPhoto(
              user_data?.photo?.name,
              // user_data?.photo?.name.endsWith('.svg'),
            )}
            style={{
              width: 80,
              height: 80,
              borderRadius: 55,
              borderWidth: 3,
              borderColor: Colors.primary,
            }}
          />
        </View>
      ) : (
        <CustomFastImage
          url={
            user_data?.photo?.name
              ? getURLPhoto(user_data?.photo?.name)
              : getStaticImage(true)
          }
          resizeMode="cover"
          cutomViewStyle={[
            {
              width: 80,
              height: 80,
              borderRadius: 55,
              borderWidth: 3,
              borderColor: Colors.primary,
            },
          ]}
          customStyle={[{width: 98, height: 98, borderRadius: 45}]}
        />
      )}

      <View style={[Gutters.smallLMargin, Layout.alignItemsStart]}>
        <TextSemiBold
          text={`${user_data?.first_name} ${user_data?.last_name}`}
          textStyle={[Fonts.poppinSemiBold24, {color: Colors.black_232C28}]}
        />

        <CustomStarRating
          rating={user_data?.avg_rating_as_seller}
          starSize={25}
          customStyle={[Gutters.littleVMargin]}
          starProps={{emptyStarColor: Colors.gray_707070}}
        />

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (token == null) {
              showUserAlert(navigation);
              return;
            }
            navigation.navigate('AccountSetting');
          }}>
          <TextMedium
            text={t('common:setting')}
            textStyle={[
              Fonts.poppinMed16,
              {textDecorationLine: 'underline', color: Colors.dark_gray_676C6A},
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomProfile;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginVertical: '8%',
    // marginHorizontal: '2%',
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#0BC37B',
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
});
