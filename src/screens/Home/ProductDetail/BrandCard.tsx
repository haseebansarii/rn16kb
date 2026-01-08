import React from 'react';
import {Linking, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../../../hooks';
import {getStaticImage, getURLPhoto} from '../../../utils/helpers';
import {CustomFastImage} from '../../../components';

type Props = {
  branding: any;
};

const BrandCard = ({branding}: Props) => {
  const {Layout, Fonts, Gutters, Colors} = useTheme();

  return (
    <View
      style={[
        Layout.fullWidth,
        Layout.alignItemsStart,
        Gutters.mediumVPadding,
        Gutters.mediumHPadding,
        Gutters.tinyRadius,
        Gutters.borderWidth,
        {borderColor: Colors.dark_gray_676C6A},
      ]}>
      <CustomFastImage
        url={
          branding?.photo?.name
            ? getURLPhoto(branding?.photo?.name)
            : getStaticImage(true)
        }
        resizeMode="cover"
        customStyle={[
          Gutters.mediumBMargin,
          {height: 100, width: 100, borderRadius: 10},
        ]}
      />

      <Text style={[Fonts.poppinSemiBold22, Gutters.mediumBMargin]}>
        {branding?.name}
      </Text>
      <Text style={[Fonts.poppinReg14, Gutters.mediumBMargin]}>
        {branding?.description}
      </Text>

      {branding?.link && (
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(branding.link);
          }}
          style={[
            Layout.center,
            Layout.fullWidth,
            Gutters.tinyRadius,
            Gutters.borderWidth,
            Gutters.tinyTMargin,
            {height: 52},
          ]}>
          <Text
            style={[
              Fonts.poppinSemiBold16,
              {fontWeight: '600', color: Colors.black},
            ]}>
            Visit Website
          </Text>
        </TouchableOpacity>
      )}

      {branding?.email && (
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(`mailto:${branding?.email}`);
          }}
          style={[
            Layout.center,
            Layout.fullWidth,
            Gutters.tinyRadius,
            Gutters.borderWidth,
            Gutters.tinyTMargin,
            {height: 52},
          ]}>
          <Text
            style={[
              Fonts.poppinSemiBold16,
              {fontWeight: '600', color: Colors.black},
            ]}>
            Email
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default BrandCard;
