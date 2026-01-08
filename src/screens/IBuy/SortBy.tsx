import i18next from 'i18next';
import React, {memo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {TextMedium, TextRegular, TextSemiBold} from '../../components';
import {useTheme} from '../../hooks';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';

type Props = {
  sort_by: CallableFunction;
};

const SortBy = ({sort_by}: Props) => {
  const {Colors, Fonts, Gutters, Images, Layout} = useTheme();
  const listData = useSelector((state: any) => state?.list?.listData);
  return (
    <View
      style={[
        i18next.language === 'en' ? Layout.row : Layout.rowReverse,
        Layout.alignItemsCenter,
        Layout.justifyContentBetween,
        Gutters.smallHPadding,
      ]}>
      <View style={[Layout.row, Layout.alignItemsCenter]}>
        {/* <TextRegular
          text={`${t('common:showing')}: `}
          textStyle={[Fonts.poppinReg14, {color: Colors.dark_gray_676C6A}]}
        />
        <TextSemiBold
          text={`${listData?.pagination?.total || 0} `}
          textStyle={[Fonts.poppinSemiBold14, {color: Colors.black_232C28}]}
        />
        <TextSemiBold
          text={`${t('common:results_for')} `}
          textStyle={[
            Fonts.poppinSemiBold14,
            {textTransform: 'none', color: Colors.black_232C28},
          ]}
        /> */}
        {/* <TextSemiBold
          text={'`Laptop`'}
          textStyle={[
            Fonts.poppinSemiBold14,
            {textTransform: 'none', color: Colors.black_232C28},
          ]}
        /> */}
      </View>
      {/* <TouchableOpacity
        activeOpacity={0.8}
        onPress={sort_by}
        style={[Layout.row, Layout.alignItemsCenter, {padding: 3}]}>
        <TextMedium
          text={`${t('common:sort_by')}: `}
          textStyle={[Fonts.poppinMed13, {color: Colors.dark_gray_676C6A}]}
        />
        <Images.svg.sort.default />
      </TouchableOpacity> */}
    </View>
  );
};

export default SortBy;
