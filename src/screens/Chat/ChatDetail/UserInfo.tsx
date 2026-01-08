import i18next from 'i18next';
import React from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {
  CustomFastImage,
  CustomStarRating,
  TextMedium,
  TextSemiBold,
} from '../../../components';
import {API_URL} from '../../../config';
import {useTheme} from '../../../hooks';
import {RootState} from '../../../store/store';
import {getStaticImage} from '../../../utils/helpers';
type Props = {
  userInfor: object;
};

const UserInfo = ({userInfor, listing}: Props) => {
  const {Layout, Fonts, Gutters, Colors, Images} = useTheme();
  const user_data = useSelector((state: RootState) => state?.auth?.user_data);

  const calculateRating = (avgRating: any) => {
    let maxRating = 5;
    const percentage = (avgRating / maxRating) * 100;
    // Return either the exact value or an integer if it's a whole number
    return percentage % 1 === 0
      ? Math.round(percentage)
      : percentage.toFixed(2);
  };
  return (
    <View
      style={[
        i18next.language === 'en' ? Layout.row : Layout.rowReverse,
        Layout.alignItemsCenter,
        // Gutters.xTinyHPadding,
        {
          height: 105,
          borderBottomWidth: 0.5,
          borderColor: Colors.gray_C9C9C9,
          backgroundColor: Colors.lightGreen_DBF5EC,
          justifyContent: 'space-around',
        },
      ]}>
      <View
        style={[
          Layout.row,
          // Layout.fill,
          Layout.overflow,
          Layout.alignItemsCenter,
          {width: '50%'},
        ]}>
        <View
          style={[
            Layout.justifyContentBetween,
            Layout.alignItemsCenter,
            Layout.overflow,
            {
              width: 60,
              height: 60,
              borderRadius: 30,
              borderWidth: 2,
              borderColor: Colors.primary,
            },
          ]}>
          <CustomFastImage
            url={
              userInfor?.photo?.name
                ? `${API_URL}get-uploaded-image/${userInfor?.photo?.name}`
                : getStaticImage(true)
            }
            resizeMode="cover"
            customStyle={[{width: 60, height: 60, borderRadius: 30}]}
          />
        </View>
        <View style={[Gutters.littleLMargin, Layout.fill]}>
          <TextSemiBold
            numberOfLines={2}
            text={
              `${userInfor?.first_name} ${userInfor?.last_name}`?.length > 20
                ? `${userInfor?.first_name} ${userInfor?.last_name}`?.slice(
                    0,
                    20,
                  ) + '...'
                : `${userInfor?.first_name} ${userInfor?.last_name}`
              // 'Chris Javierto'.length > 10
              //   ? 'Chris'.slice(0, 10) + '...'
              //   : 'chris Jav'
            }
            textStyle={[
              Fonts.poppinSemiBold20,
              {textTransform: 'capitalize', color: Colors.black_232C28},
            ]}
          />
        </View>
      </View>
      <View
        style={[
          // Layout.fill,
          Layout.alignItemsEnd,
          Layout.justifyContentEnd,
          {width: '45%'},
        ]}>
        <TextMedium
          text={`${calculateRating(
            user_data?._id === listing?.user?._id
              ? userInfor?.avg_rating_as_buyer
              : listing?.user?.avg_rating_as_seller,
          )}% ${t('common:feed_back')}`}
          textStyle={[Fonts.poppinMed14, {color: Colors.black_232C28}]}
        />
        <CustomStarRating
          starProps={{
            emptyStarColor: Colors.gray_C9C9C9,
          }}
          starSize={20}
          rating={
            user_data?._id === listing?.user?._id
              ? userInfor?.avg_rating_as_buyer
              : listing?.user?.avg_rating_as_seller
          }
        />
        {userInfor?.address && (
          <TextMedium
            numberOfLines={2}
            text={`${userInfor?.address}`}
            textStyle={[Fonts.poppinMed14, {color: Colors.black_232C28}]}
          />
        )}
      </View>
    </View>
  );
};

export default UserInfo;
