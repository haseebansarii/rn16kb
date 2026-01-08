import React, {useEffect, useState} from 'react';
import {RefreshControl, ScrollView, StyleSheet, View} from 'react-native';
import {AreaLocation, Categories, Header, Listing} from '.';
import {CustomSearch} from '../../components';
import {CustomAdvertisement} from '../../components';
import {useMultipleApiCall, useTheme} from '../../hooks';
import {Colors} from '../../theme/Variables';

import {useSelector} from 'react-redux';
import {useLazyGetUnreadNotificationsCountQuery} from '../../services/modules/notifications/notification';
import {RootState} from '../../store/store';
import RecentListing from './RecentListing';
import {
  useAddFavouriteListingMutation,
  useRemoveFavouriteListingMutation,
} from '../../services/modules/home/favouriteListing';
import {useLazyGetUserDataByTokenQuery} from '../../services/accountSettings/userProfileService';
import {useLazyHomeListingQuery} from '../../services/modules/home/homeListing';
import {useLazyCategoryListQuery} from '../../services/modules/home/categoryList';
import {useLazyGetMobileSettingQuery} from '../../services/auth/signupApi';
import AppUpdatesModal from '../../components/AppUpdatesModal';

const HomeContainer = () => {
  const {Layout, Gutters, Colors, Fonts} = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const [getUnreadNotificationsCount] =
    useLazyGetUnreadNotificationsCountQuery();
  const [removeFavouriteListing] = useRemoveFavouriteListingMutation();
  const [addFavoriteListing] = useAddFavouriteListingMutation();
  const [homeListingData] = useLazyHomeListingQuery();
  const [categoryList] = useLazyCategoryListQuery();
  const [getMobileSettings] = useLazyGetMobileSettingQuery();

  const addRemoveFavourites = (id: string, is_favourite: boolean) => {
    if (!!is_favourite) {
      removeFavouriteListing(id);
    } else {
      addFavoriteListing({listing: id});
    }
  };
  const token = useSelector((state: RootState) => state?.auth?.token);
  const isAppUpdate = useSelector(
    (state: RootState) => state?.auth?.isAppUpdate,
  );
  // console.log('>>> isAppUpdate 11  ', isAppUpdate);
  // console.log('>>> mobileSettings 11  ', mobileSettings);

  const [getUserData] = useLazyGetUserDataByTokenQuery();

  const fetchDataOnRefresh = async () => {
    try {
      await useMultipleApiCall([
        homeListingData(`?&skip=0&limit=12&pageName=home`),
        categoryList('yes'),
        !!token && getUnreadNotificationsCount('unread-notification'),
        !!token && getUserData(''),
      ]).finally(() => setRefreshing(false));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleRefresh = () => {
    !isAppUpdate && setRefreshing(true);
    !isAppUpdate && fetchDataOnRefresh();
  };

  useEffect(() => {
    getMobileSettings('');
    !isAppUpdate && !!token && getUserData('');
  }, []);

  return (
    <View style={[Layout.fill, {backgroundColor: Colors.white}]}>
      <View style={[Layout.fullWidth, Layout.selfCenter, styles.header]}>
        <Header />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        style={[token ? Layout.simpleScreen : Layout.fill, {zIndex: -100}]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
          />
        }>
        <CustomSearch />
        <CustomAdvertisement />
        <View style={[Layout.screen, Gutters.xTinyTMargin]}>
          <Categories />
        </View>
        <View style={[Layout.fullWidth]}>
          <AreaLocation refreshing={refreshing} />
        </View>
        <RecentListing />
        <View style={[Layout.fill]}>
          <Listing screen="home" filter={true} />
        </View>
      </ScrollView>
      {isAppUpdate && <AppUpdatesModal />}
    </View>
  );
};

export default HomeContainer;

const styles = StyleSheet.create({
  header: {
    paddingRight: '3%',
    paddingLeft: '3%',
    backgroundColor: Colors.white,
  },
});
