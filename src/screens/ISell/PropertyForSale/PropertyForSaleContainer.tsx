import {t} from 'i18next';
import React, {useState} from 'react';
import {Platform, ScrollView, View} from 'react-native';

import {PropertyForm} from '.';
import {CustomHeader, ScreenWrapper} from '../../../components';
import {useTheme} from '../../../hooks';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

type Props = {
  navigation: any;
  route: any;
};

const PropertyForSaleContainer = ({navigation, route}: Props) => {
  const {Colors, Images, Fonts, Gutters, Layout} = useTheme();

  return (
    <View style={[Layout.fill, {backgroundColor: Colors.white}]}>
      <CustomHeader
        navigation={navigation}
        title={t('common:property_for_sale_rent')}
        rightIcon={true}
        notification={5}
      />

      <KeyboardAwareScrollView
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps={'always'}
        contentContainerStyle={[Layout.flexGrow, Gutters.tinyHPadding]}
        style={[Layout.fill]}
        extraScrollHeight={Platform.OS === 'android' ? 70 : 100}
        enableResetScrollToCoords={false}>
        <PropertyForm navigation={navigation} route={route} />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default PropertyForSaleContainer;
