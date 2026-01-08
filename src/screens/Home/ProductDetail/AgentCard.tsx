import React from 'react';
import {Linking, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../../../hooks';
import {getStaticImage, getURLPhoto} from '../../../utils/helpers';
import {CustomFastImage} from '../../../components';

type Props = {
  agent: any;
  logo: any;
};

const AgentCard = ({agent, logo}: Props) => {
  const {Layout, Fonts, Gutters, Colors} = useTheme();

  return (
    <View
      style={[
        Layout.fullWidth,
        Gutters.smallVPadding,
        Gutters.smallHPadding,
        Gutters.tinyRadius,
        Gutters.borderWidth,
        {borderColor: Colors.dark_gray_676C6A},
      ]}>
      {logo?.name && (
        <CustomFastImage
          resizeMode="cover"
          customStyle={[
            Gutters.smallBMargin,
            {
              width: '100%',
              height: 'auto',
              aspectRatio: '7/1',
            },
          ]}
          url={getURLPhoto(logo?.name)}
        />
      )}

      <View style={[Layout.row, Layout.alignItemsCenter]}>
        <CustomFastImage
          url={
            agent?.photo?.name
              ? getURLPhoto(agent?.photo?.name)
              : getStaticImage(true)
          }
          resizeMode="cover"
          customStyle={[
            Gutters.mediumRMargin,
            {height: 62, width: 62, borderRadius: 62 / 2},
          ]}
        />

        <View>
          <Text style={[Fonts.poppinSemiBold22]}>
            {agent?.first_name} {agent?.last_name}
          </Text>
          <Text style={[Fonts.poppinReg14]}>{agent?.license_info}</Text>
        </View>
      </View>

      {agent?.phone_number && (
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(`tel:${agent?.phone_number}`);
          }}
          style={[
            Layout.center,
            Layout.fullWidth,
            Gutters.tinyRadius,
            Gutters.tinyTMargin,
            {height: 52, backgroundColor: Colors.primary},
          ]}>
          <Text
            style={[
              Fonts.poppinSemiBold16,
              {fontWeight: '600', color: Colors.white},
            ]}>
            Call
          </Text>
        </TouchableOpacity>
      )}

      {agent?.email && (
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(`mailto:${agent?.email}`);
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

export default AgentCard;
