import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {memo} from 'react';
import {useTheme} from '../../hooks';
import i18next from 'i18next';
import {CustomFastImage, TextRegular} from '../../components';
import humanizeDuration from 'humanize-duration';

import {getURLPhoto, toastSuccessMessage} from '../../utils/helpers';
import {API_URL} from '../../config';
import {useReadSingleNotificationMutation} from '../../services/modules/notifications/notification';
import moment from 'moment';
import {useLazyGetSingleListingQuery} from '../../services/modules/Listings/getList';
import {useDispatch} from 'react-redux';
import {fixBottomTab} from '../../store/stack/StackSlice';
import {selectedProduct} from '../../store/productDetail/ProductDetailSlice';
import {setSelectedProductData} from '../../store/Listings';

type Props = {
  text: string;
  index: number;
  image?: string;
  read: boolean;
  id: number;
  created_at?: string;
  getData?: CallableFunction;
  navigation: any;
  url: string;
  photo?: any;
};

const NotificationCard = ({
  text,
  index,
  read,
  getData,
  created_at,
  id,
  navigation,
  url,
  photo,
}: Props) => {
  const {Colors, Fonts, Gutters, Images, Layout} = useTheme();
  let time = new Date(created_at as any).getTime();

  const dispatch = useDispatch();

  const [readSingleNotification] = useReadSingleNotificationMutation();
  const [getSingleListing] = useLazyGetSingleListingQuery();

  const notificationReadFunc = async (id: any) => {
    readSingleNotification({
      payload: {
        id: id,
        seen: true,
      },
    });
  };

  return (
    <TouchableOpacity
      key={index}
      activeOpacity={0.8}
      onPress={() => {
        !read && notificationReadFunc(id);
        if (url == '/iwon-ilost') {
          navigation.navigate('IWon/ILost');
        } else if (url.includes('/offers/')) {
          getSingleListing(url.split('/')[2]).then((res: any) => {
            navigation.navigate('RecievedOffers', {
              item: {
                id: res?.data?._id,
                image: res?.data?.images && res?.data?.images[0]?.name,
                title: res?.data?.title,
                buyNowPrice: res?.data?.buy_now_price,
                productObj: res?.data,
              },
            });
          });
        } else if (url == '/isell') {
          navigation.navigate('ISellContainerCard', {selectedTab: 0});
        } else if (url == '/irate') {
          navigation.navigate('RatingReviews', {
            header_text: 'Rating & Reviews',
          });
        } else if (url == '/ichat') {
          dispatch(fixBottomTab(true));
          navigation.navigate('ICHAT');
        } else if (url == '/user-settings') {
          dispatch(fixBottomTab(true));
          navigation.navigate('AccountSetting');
        } else {
          getSingleListing(url.split('/')[2]).then((res: any) => {
            // console.log(res?.data);
            dispatch(fixBottomTab(false));
            dispatch(selectedProduct(res?.data));
            dispatch(setSelectedProductData({}));
            navigation.navigate('ProductDetailContainer' as never);
          });
        }
      }}
      style={[
        i18next.language === 'en' ? Layout.row : Layout.rowReverse,
        Layout.alignItemsCenter,
        Gutters.smallVPadding,
        Gutters.xTinyHPadding,
        Layout.selfCenter,
        Layout.overflow,
        Layout.row,
        // Layout.justifyContentBetween,
        {
          borderRadius: 8,
          width: '97%',
          backgroundColor: read
            ? Colors.light_grayF4F4F4
            : Colors.lightGreen_DBF5EC,
        },
      ]}>
      <CustomFastImage
        url={
          photo
            ? getURLPhoto(photo?.name)
            : require('../../theme/assets/images/user.png')
        }
        customStyle={[{width: 52, height: 52, borderRadius: 52 / 2}]}
      />
      <View
        style={[
          // Gutters.sRegularHPadding,
          Gutters.smallMargin,
          Layout.wrap,
          Layout.alignItemsStart,
          {width: '80%'},
        ]}>
        <View
          style={[
            // Layout.fullWidth,
            i18next.language === 'en' ? Layout.row : Layout.rowReverse,
          ]}>
          <TextRegular
            text={text}
            textStyle={[Fonts.poppinReg16, {color: Colors.black_232C28}]}
          />
        </View>
        <View
          style={[
            i18next.language === 'en' ? Layout.row : Layout.rowReverse,
            {width: '90%'},
          ]}>
          <TextRegular
            text={moment(created_at).format('DD-MM-YYYY hh:mm a')}
            textStyle={[
              Fonts.poppinReg14,
              Gutters.tinyTMargin,
              {textTransform: 'none', color: Colors.gray_dark_666C7E},
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationCard;
