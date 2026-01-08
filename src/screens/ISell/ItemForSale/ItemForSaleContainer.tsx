import React, {useEffect, useState} from 'react';
import {Platform, ScrollView, View} from 'react-native';
import {ItemProfile, ListType, TakePictures} from '.';
import {CustomHeader, ScreenWrapper} from '../../../components';
import {useTheme} from '../../../hooks';
import {useRoute} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ListTypeType} from './ListType';

type Props = {
  navigation: any;
};

const ItemForSaleContainer = ({navigation, route}: Props) => {
  const {Colors, Gutters, Layout} = useTheme();
  const {isEdit, id, edit_single_listing_data, withdrawn} = route?.params;
  const [selected, setSelected] = useState<ListTypeType>(
    edit_single_listing_data?.type || 'fixed_price',
  );

  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [scrollEnabledDate, setScrollEnabledDate] = useState(true);

  return (
    <View style={[Layout.fill, {backgroundColor: Colors.white}]}>
      <CustomHeader
        title={t('common:item_for_sale')}
        navigation={navigation}
        rightIcon={true}
      />
      <KeyboardAwareScrollView
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps={'always'}
        contentContainerStyle={[Layout.flexGrow, Gutters.littleHPadding]}
        style={[Layout.fill]}
        extraScrollHeight={Platform.OS === 'android' ? 70 : 100}
        // scrollEnabled={scrollEnabledDate}
        // enableAutomaticScroll={scrollEnabled}
        // keyboardDismissMode="on-drag"
        enableResetScrollToCoords={false}>
        <View style={[Layout.screen]}>
          <ListType
            selected={selected}
            setSelected={v => {
              if (
                !(
                  (edit_single_listing_data?.offers_count > 0 &&
                    edit_single_listing_data?.status != 'expired') ||
                  (edit_single_listing_data?.type === 'auction' &&
                    edit_single_listing_data?.auction_data.bids_count > 0 &&
                    edit_single_listing_data?.reserve_price <=
                      edit_single_listing_data?.auction_data.current_bid)
                )
              ) {
                setSelected(v);
              }
            }}
          />
          <ItemProfile
            selected={selected}
            navigation={navigation}
            isEdit={isEdit}
            id={id}
            setSelected={setSelected}
            edit_single_listing_data={edit_single_listing_data}
            withdrawn={withdrawn}
            // scrollEnabled={scrollEnabled}
            setScrollEnabled={setScrollEnabled}
            setScrollEnabledDate={setScrollEnabledDate}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default ItemForSaleContainer;
