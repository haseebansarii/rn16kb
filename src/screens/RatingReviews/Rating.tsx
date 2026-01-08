import i18next from 'i18next';
import React, {memo} from 'react';
import {View} from 'react-native';
import {TextMedium, TextRegular} from '../../components';
import {useTheme} from '../../hooks';

type Props = {};

const Rating = (props: Props) => {
  const {Colors, Fonts, Gutters, Images, Layout} = useTheme();
  return (
    <View
      style={[
        i18next.language === 'en' ? Layout.row : Layout.rowReverse,
        {flexWrap: 'wrap'},
      ]}>
      {[0, 1, 2, 3, 4]?.map((item, index) => {
        return (
          <View
            style={[
              Layout.row,
              Layout.justifyContentBetween,
              Gutters.littleHPadding,
              Layout.alignItemsCenter,
              Gutters.tinyRMargin,
              Gutters.tinyTMargin,
              {
                backgroundColor: Colors.white,
                borderRadius: 4,
              },
            ]}>
            <Images.svg.fillStar.default width={14} height={14} />
            <View style={[Layout.row, Layout.alignItemsCenter]}>
              <TextMedium
                text={`${index + 1}`}
                textStyle={[Fonts.poppinMed18, {color: Colors.black}]}
              />
              <TextRegular
                text={`(${
                  item === 0
                    ? props?.item?.onesCount || '0'
                    : item === 1
                    ? props?.item?.twosCount || '0'
                    : item === 2
                    ? props?.item?.threesCount || '0'
                    : item === 3
                    ? props?.item?.foursCount || '0'
                    : props?.item?.fivesCount || '0'
                })`}
                textStyle={[Fonts.poppinReg14, {color: Colors.gray_767676}]}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default memo(Rating);
