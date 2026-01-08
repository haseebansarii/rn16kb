import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {ProductListing} from '.';
import {useTheme} from '../../hooks';
import {
  useHomeListingQuery,
  useLazyHomeListingQuery,
} from '../../services/modules/home/homeListing';
import {RootState} from '../../store/store';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {
  useGetMobileSettingQuery,
  useLazyGetMobileSettingQuery,
} from '../../services/auth/signupApi';
import {setSelectedProductData} from '../../store/Listings';
import {useDispatch} from 'react-redux';

const Listing = ({filter, screen, id}: {filter: boolean; screen?: string}) => {
  const navigation = useNavigation();
  const {Layout, Gutters, Colors, Fonts} = useTheme();

  const homeListingData = useHomeListingQuery(
    `?&skip=0&limit=12&pageName=${screen}`,
  );
  const [homeListingDataAPI] = useLazyHomeListingQuery();
  const homegetMobile = useGetMobileSettingQuery('');
  const [getMobileSettings] = useLazyGetMobileSettingQuery();

  useEffect(() => {
    getMobileSettings('');
  }, []);
  const getInitialDataSeller = () => {
    homeListingDataAPI(`?&skip=0&limit=12&pageName=${screen}`);
  };

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     getInitialDataSeller();
  //   });
  //   return unsubscribe;
  // }, [navigation]);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isFocused) {
      // Call your function if the screen is focused and the condition is true
      getInitialDataSeller();

      dispatch(setSelectedProductData({}));
    }
  }, [isFocused]);

  return (
    <View style={[Layout.fill]}>
      <View style={[Gutters.tinyVMargin, Layout.fill]}>
        <ProductListing getInitialDataSeller={getInitialDataSeller} />
      </View>
    </View>
  );
};

export default Listing;
