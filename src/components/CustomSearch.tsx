import i18next from 'i18next';
import React, {useState} from 'react';
import {TextInput, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../hooks';
import {useDispatch} from 'react-redux';
import {setSearchFilter} from '../store/home/ListingSlice';
import {fixBottomTab} from '../store/stack/StackSlice';
import {navigationRef} from '../navigators/utils';

export const CustomSearch = props => {
  const {Layout, Gutters, Colors, Fonts, Images} = useTheme();
  const [search, setSearch] = useState<any>(null);
  const dispatch = useDispatch();
  return (
    <View
      style={[
        Gutters.tinyVPadding,
        Gutters.smallHPadding,
        Layout.fullWidth,
        {zIndex: -100},
      ]}>
      <View
        style={[
          Layout.fullWidth,
          Layout.alignItemsCenter,
          Layout.justifyContentBetween,
          Gutters.tinyHPadding,
          Layout.overflow,
          i18next.language === 'en' ? Layout.row : Layout.rowReverse,
          {
            borderWidth: 1,
            height: 60,
            borderColor: Colors.black_232C28,
            borderRadius: 10,
            backgroundColor: Colors.white,
          },
        ]}>
        <TextInput
          placeholder={'Search keywords...'}
          placeholderTextColor={Colors.dark_gray_676C6A}
          autoCapitalize="none"
          autoComplete="off"
          onFocus={() => dispatch(fixBottomTab(false))}
          onChangeText={t => {
            dispatch(setSearchFilter(t));
            setSearch(t);
          }}
          keyboardType="default"
          autoCorrect={false}
          value={search}
          style={[
            Fonts.poppinMed16,
            Gutters.littleLPadding,
            Layout.fill,
            Gutters.tinyRMargin,
          ]}
        />
        <TouchableOpacity
          onPress={() => {
            navigationRef?.navigate('IBuy', {search: search});
            setSearch('');
          }}>
          <Images.svg.PlayButton.default />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomSearch;
