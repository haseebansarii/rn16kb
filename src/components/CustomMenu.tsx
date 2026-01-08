import i18next from 'i18next';
import React, {memo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {TextSemiBold} from '.';
import {useTheme} from '../hooks';
import {white} from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

type Props = {
  data: Array<object>;
  selected: number;
  setSelected: CallableFunction;
  cutomStyle?: any;
  textStyle?: any;
  setSubscriptionTime: CallableFunction;
};

const CustomMenu = ({
  data,
  selected,
  cutomStyle,
  setSelected,
  textStyle,
  setSubscriptionTime,
}: Props) => {
  const {Colors, Fonts, Layout} = useTheme();
  return (
    <View
      style={[
        Layout.justifyContentBetween,
        i18next.language === 'en' ? Layout.row : Layout.rowReverse,
        Layout.selfCenter,
        {
          width: '105%',
          height: 56,
          borderRadius: 10,
          backgroundColor: Colors.gray_C9C9C9,
        },
        cutomStyle,
      ]}>
      {data?.map((item, index) => {
        const {key}: any = item;

        return (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            onPress={() => {
              setSelected(index);
              setSubscriptionTime && setSubscriptionTime(index);
            }}
            style={[
              Layout.center,
              Layout.fill,
              {
                borderRadius: 10,
                backgroundColor:
                  selected == index ? Colors.primary : 'transparent',
              },
            ]}>
            <TextSemiBold
              text={key}
              textStyle={[
                Fonts.poppinSemiBold20,
                {
                  color: Colors.white,
                },
                textStyle,
              ]}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomMenu;
