import React from 'react';
import {Text, View} from 'react-native';
import {
  CustomFastImage,
  CustomStarRating,
  TextRegular,
  TextSemiBold,
} from '../../components';
import {useTheme} from '../../hooks';
import {API_URL} from '../../config';
import {getStaticImage} from '../../utils/helpers';

type Props = {
  params: object;
};

const UserInfo = ({params}: Props) => {
  const {Layout, Colors, Fonts, Images, Gutters} = useTheme();

  console.log(params);

  return (
    <View
      style={[
        Layout.row,
        Layout.fullWidth,
        Layout.justifyContentBetween,
        Layout.alignItemsCenter,
        Gutters.smallHPadding,
        Layout.overflow,

        {
          borderTopWidth: 1,
          borderBottomWidth: 1,
          height: 100,
          borderColor: Colors.gray_C9C9C9,
          backgroundColor: Colors.light_grayF4F4F4,
        },
      ]}>
      <CustomFastImage
        url={
          params?.buyer?.photo == null
            ? getStaticImage(true)
            : `${API_URL}get-uploaded-image/${params?.buyer?.photo?.name}`
        }
        cutomViewStyle={[
          {
            width: 65,
            height: 65,
            borderWidth: 4,
            borderRadius: 100,
            borderColor: Colors.primary,
          },
        ]}
        resizeMode="cover"
      />
      <View
        style={[
          Layout.fullWidth,
          Layout.column,
          Layout.justifyContentEvenly,
          Gutters.xTinyPadding,
        ]}>
        <TextSemiBold
          text={params?.buyer?.first_name + ' ' + params?.buyer?.last_name}
          textStyle={[Fonts.poppinSemiBold16, {color: Colors.black_232C28}]}
        />
        <View
          style={[
            Layout.row,
            Layout.alignItemsCenter,
            Gutters.littleVMargin,
            Layout.screenWidth,
            Layout.justifyContentBetween,
          ]}>
          <CustomStarRating
            starSize={12}
            rating={params?.buyer?.avg_rating_as_buyer}
            starProps={{
              emptyStarColor: Colors.gray_707070,
            }}
          />
          <View style={[{width: '60%', alignItems: 'flex-end'}]}>
            <Text
              numberOfLines={2}
              style={[
                Fonts.poppinReg12,
                Gutters.tinyRMargin,
                {color: Colors.black_232C28, width: '95%', textAlign: 'right'},
              ]}>
              {params?.buyer?.address}
            </Text>
          </View>
        </View>
        <View style={[Gutters.tinyTMargin]}>
          <TextRegular
            text={`${
              params?.buyer?.first_name +
              ' ' +
              params?.buyer?.last_name +
              ' ' +
              'has' +
              ' ' +
              params?.remaining_offers +
              ' ' +
              'offers remaining'
            }`}
            textStyle={[Fonts.poppinReg12, {color: Colors.black_232C28}]}
          />
        </View>
      </View>
    </View>
  );
};

export default UserInfo;
