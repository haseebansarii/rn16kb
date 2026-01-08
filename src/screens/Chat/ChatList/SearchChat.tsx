import i18next from 'i18next';
import React, {memo, useCallback, useState} from 'react';
import {TextInput, View} from 'react-native';
import {useTheme} from '../../../hooks';

type Props = {
  setSearchUser?: CallableFunction;
  filter: CallableFunction;
};

const SearchChat = ({setSearchUser, filter}: Props) => {
  const {Layout, Fonts, Gutters, Colors, Images} = useTheme();

  return (
    <View
      style={[
        Layout.fullWidth,
        Layout.alignItemsCenter,
        Layout.justifyContentBetween,
        Gutters.smallHPadding,
        Layout.overflow,
        i18next.language === 'en' ? Layout.row : Layout.rowReverse,
        {
          borderWidth: 1,
          height: 60,
          borderColor: Colors.black_232C28,
          borderRadius: 10,
        },
      ]}>
      <Images.svg.searchChat.default />
      <TextInput
        placeholder={t('common:search_keywords')}
        placeholderTextColor={Colors.dark_gray_676C6A}
        autoCapitalize="none"
        autoComplete="off"
        onChangeText={t => {
          filter(t);
        }}
        autoCorrect={false}
        style={[
          Layout.fullWidth,
          Fonts.poppinMed16,
          Gutters.littleLPadding,
          {},
        ]}
      />
    </View>
  );
};

export default SearchChat;
