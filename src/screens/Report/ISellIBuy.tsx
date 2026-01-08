import i18next from 'i18next';
import React, {memo} from 'react';
import {View} from 'react-native';
import {TextBold, TextMedium, TextRegular} from '../../components';
import {useTheme} from '../../hooks';

type Props = {
  isell: string;
  ibuy: string;
};

const ISellIBuy = ({isell, ibuy}: Props) => {
  const {Colors, Fonts, Gutters, Images, Layout} = useTheme();
  return (
    <View
      style={[
        i18next.language === 'en' ? Layout.row : Layout.rowReverse,
        Layout.justifyContentBetween,
        Layout.alignItemsCenter,
        Gutters.smallPadding,
        Gutters.smallBMargin,
        {backgroundColor: Colors.lightGreen_DBF5EC},
      ]}>
      <View
        style={[
          Gutters.smallPadding,
          Layout.alignItemsStart,
          Layout.justifyContentBetween,
          Layout.column,
          {backgroundColor: Colors.white, width: '48%', borderRadius: 10},
        ]}>
        <TextMedium
          text={t('common:isell')}
          textStyle={[{textTransform: 'none', color: Colors.black_232C28}]}
        />
        <TextBold
          text={isell}
          textStyle={[
            Fonts.poppinBold32,
            Gutters.littlePadding,
            Gutters.littleTMargin,
            {color: Colors.primary, marginLeft: -6},
          ]}
        />
        <TextRegular
          text={''}
          textStyle={[Fonts.poppinReg14, {color: Colors.dark_gray_676C6A}]}
        />
      </View>
      <View
        style={[
          Gutters.smallPadding,
          Layout.alignItemsStart,
          Layout.justifyContentBetween,
          Layout.column,
          {backgroundColor: Colors.white, width: '48%', borderRadius: 10},
        ]}>
        <TextMedium
          text={t('common:ibuy')}
          textStyle={[{textTransform: 'none', color: Colors.black_232C28}]}
        />
        <TextBold
          text={ibuy}
          textStyle={[
            Fonts.poppinBold32,
            Gutters.littlePadding,
            Gutters.littleTMargin,
            {color: Colors.primary, marginLeft: -6},
          ]}
        />
        <TextRegular
          text={t('common:item_buying')}
          textStyle={[Fonts.poppinReg14, {color: Colors.dark_gray_676C6A}]}
        />
      </View>
    </View>
  );
};

export default memo(ISellIBuy);
