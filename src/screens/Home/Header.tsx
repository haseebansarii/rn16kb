import React, {useEffect, useState} from 'react';
import {Platform, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {CustomFastImage} from '../../components';
import {useTheme} from '../../hooks';
import {navigationRef} from '../../navigators/utils';
import {useLazyCountryListQuery} from '../../services/modules/home/homeListing';
import {RootState} from '../../store/store';
import {getStaticImage, getURLPhoto} from '../../utils/helpers';
import CountryMenu from './CountryMenu';
import {useClickOutside} from 'react-native-click-outside';
import {useGetUnreadNotificationsCountQuery} from '../../services/modules/notifications/notification';
import {skipToken} from '@reduxjs/toolkit/query';
import FastImage from 'react-native-fast-image';
const Header = () => {
  const {Images, Layout, Colors, Gutters, Fonts} = useTheme();
  const token = useSelector((state: RootState) => state?.auth?.token);
  const user_data = useSelector((state: RootState) => state?.auth?.user_data);
  const selectedCountry = useSelector(
    (state: RootState) => state?.homeListing?.selectedCountry,
  );

  const [showCountryMenu, setShowCountryMenu] = useState<boolean>(false);
  const [countryListing] = useLazyCountryListQuery();
  const [countryList, setCountryList] = useState([
    {name: 'New Zealand', value: 'New Zealand'},
    {name: 'international', value: 'international'},
  ]);
  const unreadNotificationsCount = useSelector(
    (state: RootState) => state.notifications?.unreadNotificationsCount,
  );
  const getUnreadNotificationsCount = useGetUnreadNotificationsCountQuery(
    {},
    {skip: !token, pollingInterval: 5000},
  );

  const ctxMenuRef = useClickOutside<View>(() => setShowCountryMenu(false));
  return (
    <View
      style={[
        Layout.fullWidth,
        Layout.row,
        Layout.justifyContentBetween,
        Layout.alignItemsCenter,
        Layout.height80,
        {
          zIndex: 99,
        },
      ]}>
      <View
        style={[
          Layout.fullHeight,
          {
            paddingTop: token ? 5 : 10,
            paddingBottom: token ? 15 : 10,
          },
        ]}>
        <Text
          style={[
            Fonts.poppinSemiBold20,
            Gutters.littleBMargin,
            {color: Colors.black_232C28},
          ]}>
          {t('common:welcom_back')}
        </Text>
        {token && user_data?.first_name ? (
          <Text style={[Fonts.poppinSemiBold18, {color: Colors.black_232C28}]}>
            {`${user_data?.first_name} ${user_data?.last_name}`}
          </Text>
        ) : (
          <Text style={[Fonts.poppinSemiBold18, {color: Colors.black_232C28}]}>
            Guest
          </Text>
        )}
      </View>
      <View style={[Layout.fill, Layout.justifyContentCenter]}>
        <TouchableOpacity
          activeOpacity={0.8}
          // onPress={() => setShowCountryMenu(!showCountryMenu)}
          style={[
            Layout.row,
            Gutters.littleBMargin,
            Layout.relative,
            Layout.justifyContentEnd,
          ]}>
          <View
            style={[
              Layout.alignItemsCenter,
              Layout.row,
              Layout.justifyContentBetween,
            ]}>
            <Images.svg.LocationTransparent.default />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[
                Fonts.poppinMed13,
                Gutters.tinyHPadding,
                Layout.textTransform,
                {color: Colors.black_232C28},
              ]}>
              {
                selectedCountry ? selectedCountry : 'Choose Country'
                //user_data?.country
              }
            </Text>
          </View>
          {/* <View
            style={[
              Layout.justifyContentCenter,
              Gutters.littleLMargin,
              {marginRight: 3},
            ]}>
            <Images.svg.DropDown.default />
          </View> */}
        </TouchableOpacity>
        {showCountryMenu && (
          <View ref={ctxMenuRef} style={[{elevation: 5, zIndex: 999}]}>
            <CountryMenu data={countryList} setShowMenu={setShowCountryMenu} />
          </View>
        )}

        {!token ? (
          <TouchableOpacity
            style={[Layout.row, Layout.selfEnd]}
            activeOpacity={0.8}
            onPress={() => navigationRef.navigate('EmailContainer')}>
            <Text style={[Fonts.poppinMed13, {color: Colors.primary}]}>
              Login/SignUp
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={[Layout.center]}>
            <View style={[Layout.row, Layout.center, Layout.selfEnd]}>
              <TouchableOpacity
                disabled={token ? false : true}
                onPress={() => {
                  if (token) {
                    navigationRef.navigate('RatingReviews', {
                      header_text: 'Rating & Reviews',
                    });
                  }
                }}>
                <CustomFastImage
                  url={
                    user_data?.photo?.name
                      ? getURLPhoto(user_data?.photo?.name)
                      : getStaticImage(true)
                  }
                  resizeMode="cover"
                  customStyle={[
                    {
                      height: 30,
                      width: 30,
                      borderRadius: 30 / 2,
                      borderWidth: 3,
                      borderColor: Colors.primary,
                    },
                  ]}
                />
              </TouchableOpacity>
              <View style={[Layout.row, Layout.center, Gutters.littleRMargin]}>
                <Images.svg.star.default
                  width={30}
                  height={30}
                  fill={Colors.primary}
                />
                <Text
                  style={[
                    Gutters.littleLMargin,
                    Gutters.littleRMargin,
                    {color: Colors.primary},
                  ]}>
                  {user_data?.avg_rating_as_seller}
                </Text>
              </View>
              <TouchableOpacity
                disabled={token ? false : true}
                onPress={() => {
                  if (token) {
                    navigationRef.navigate('Notification');
                  }
                }}
                style={[Gutters.tinyRMargin]}>
                <Images.svg.bell.default />
                <View
                  style={[
                    Layout.center,
                    Layout.absolute,
                    {
                      top: -10,
                      left: 10,
                      bottom: -10,
                      width: 23,
                      height: 23,
                      borderRadius: 15,
                      backgroundColor: Colors.red,
                    },
                  ]}>
                  <Text style={[Fonts.poppinMed12, {color: Colors.white}]}>
                    {unreadNotificationsCount ?? 0}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default Header;
