import i18next from 'i18next';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CustomFastImage,
  CustomNoDataFound,
  CustomPageLoading,
  CustomStarRating,
  TextMedium,
  TextRegular,
  TextSemiBold,
} from '../../../components';
import {useTheme} from '../../../hooks';

import {useDispatch, useSelector} from 'react-redux';
import {API_URL} from '../../../config';
import {
  useDeleteChatMutation,
  useGetAllUsersChatQuery,
  useLazyGetAllUsersChatQuery,
} from '../../../services/chat';
import {RootState} from '../../../store/store';
import {SwipeListView} from 'react-native-swipe-list-view';
import {getStaticImage, getURLPhoto} from '../../../utils/helpers';
import {allMessages, setAllUserMessages} from '../../../store/chats/chats';
import {sHight} from '../../../utils/ScreenDimentions';
import {useIsFocused} from '@react-navigation/native';
import {useGetUnreadNotificationsCountQuery} from '../../../services/modules/notifications/notification';

type Props = {
  data: Array<Object>;
  navigation: any;
};

const ITEM_HEIGHT = Dimensions.get('screen').height;

const SwipeableList = ({data, navigation}: Props) => {
  const dispatch = useDispatch();
  const {Layout, Gutters, Images, Colors, Fonts} = useTheme();
  const [List, setList] = useState(data);
  const [refreshing, setRefreshing] = useState(false);

  const isFocused = useIsFocused(); // Tracks if the screen is focused
  const [pollingEnabled, setPollingEnabled] = useState(false);

  const {isLoading} = useGetAllUsersChatQuery('all-chats', {
    skip: !pollingEnabled,
    pollingInterval: 5000,
  });
  const getUnreadNotificationsCount = useGetUnreadNotificationsCountQuery(
    {},
    {skip: !pollingEnabled, pollingInterval: 5000},
  );

  const [getAllUserChat] = useLazyGetAllUsersChatQuery();
  const [deleteChat] = useDeleteChatMutation();

  const user_data = useSelector((state: RootState) => state.auth?.user_data);
  const token = useSelector((state: RootState) => state.auth?.token);

  const closeRow = useCallback((rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  }, []);
  useEffect(() => {
    if (isFocused) {
      setPollingEnabled(true);
    } else {
      setPollingEnabled(false);
    }
  }, [isFocused]);

  const handleRefresh = () => {
    setRefreshing(true);
    !!token && getAllUserChat('all-chats').finally(() => setRefreshing(false));
  };

  const calculateRating = (avgRating: any) => {
    let maxRating = 5;
    const percentage = (avgRating / maxRating) * 100;
    // Return either the exact value or an integer if it's a whole number
    return percentage % 1 === 0
      ? Math.round(percentage)
      : percentage.toFixed(2);
  };

  const deleteItem = useCallback((rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
    const newData = [...List];
    const prevIndex = List.findIndex(item => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setList(newData);
  }, []);
  let numberOfLines = 1;
  // Function to render each list item
  const renderItem = ({item, index}: any) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        key={index}
        onPress={() => {
          dispatch(setAllUserMessages([{}]));
          dispatch(allMessages([]));
          navigation.navigate('ChatDetail', {
            listing: item?.listing,
            seller_id: item?.seller?._id,
            from_user: item?.from_user,
          });
        }}
        style={[
          data?.length == index + 1 && Gutters.largeBMargin,
          {
            borderBottomWidth: 0.5,
            borderColor: Colors.gray_C9C9C9,
            backgroundColor: 'green',
          },
        ]}>
        <View
          style={[
            i18next.language === 'en' ? Layout.row : Layout.rowReverse,
            Layout.justifyContentBetween,
            Layout.alignItemsCenter,
            {
              height: 95,
              backgroundColor: Colors.white,
            },
          ]}>
          <View style={[Layout.row, Layout.alignItemsCenter, {width: '40%'}]}>
            <View
              style={[
                Layout.justifyContentBetween,
                Layout.alignItemsCenter,
                Layout.overflow,
                {
                  borderWidth: 3,
                  borderColor: Colors.primary,
                  // item?.unseenCount > 0 ? Colors.primary : '#3572EF',
                  borderRadius: 100,
                },
              ]}>
              <CustomFastImage
                url={
                  item?.from_user?.photo?.name
                    ? `${API_URL}get-uploaded-image/${item?.from_user?.photo?.name}`
                    : getStaticImage(true)
                }
                resizeMode="contain"
                customStyle={[{width: 60, height: 60, borderRadius: 30}]}
              />
            </View>
            <View style={[Gutters.xTinyLMargin]}>
              <TextSemiBold
                textProps={(numberOfLines = numberOfLines)}
                text={`${item?.from_user?.first_name} ${item?.from_user?.last_name}`}
                textStyle={[
                  Fonts.poppinSemiBold20,
                  {textTransform: 'capitalize', color: Colors.black_232C28},
                ]}
              />
              {item?.unseenCount > 0 && (
                <TextRegular
                  text={`${item?.unseenCount} ${
                    item?.unseenCount > 1
                      ? t('common:new_message')
                      : 'New Message'
                  }`}
                  textStyle={[
                    Fonts.poppinMed12,
                    {margin: 0, color: Colors.primary},
                  ]}
                />
              )}
            </View>
          </View>
          <View
            style={[
              // Layout.fill,
              Layout.alignItemsEnd,
              Layout.justifyContentEnd,
              {width: '45%'},
            ]}>
            <TextMedium
              text={`${calculateRating(
                user_data?._id === item?.listing?.user?._id
                  ? item?.buyer?.avg_rating_as_buyer
                  : item?.listing?.user?.avg_rating_as_seller,
              )}% ${t('common:feed_back')}`}
              textStyle={[Fonts.poppinMed14, {color: Colors.black_232C28}]}
            />
            {/* currentUserId === listing.user._id ? buyer.avg_rating_as_buyer
             : listing.user.avg_rating_as_seller */}
            <CustomStarRating
              starProps={{
                emptyStarColor: Colors.gray_C9C9C9,
              }}
              starSize={20}
              rating={
                user_data?._id === item?.listing?.user?._id
                  ? item?.buyer?.avg_rating_as_buyer
                  : item?.listing?.user?.avg_rating_as_seller
              }
            />
            {!!item?.from_user?.address && (
              <TextMedium
                text={`${
                  item?.from_user?.address?.length > 16
                    ? item?.from_user?.address.slice(0, 16) + '...'
                    : item?.from_user?.address
                }`}
                textStyle={[Fonts.poppinMed14, {color: Colors.black_232C28}]}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Function to render hidden swipe actions
  const renderHiddenItem = ({item}) => {
    return (
      <View
        style={[
          Layout.row,
          Layout.justifyContentEnd,
          Layout.alignItemsCenter,
          Layout.fill,
          Gutters.smallLPadding,
        ]}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[]}
          onPress={() => deleteChat(item?._id)}>
          <Images.svg.dustbinChat.default />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      {isLoading ? (
        <CustomPageLoading />
      ) : (
        <SwipeListView
          data={data}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          stopLeftSwipe={0}
          extraData={data}
          rightOpenValue={-50}
          removeClippedSubviews={true}
          keyExtractor={item => item?.key}
          maxToRenderPerBatch={10}
          // windowSize={5}
          initialNumToRender={1} // Render only the 20 most recent messages initially
          // inverted // Invert the list so the most recent messages appear at the bottom
          // getItemLayout={(data, index) => ({
          //   length: ITEM_HEIGHT,
          //   offset: ITEM_HEIGHT * index,
          //   index,
          // })}
          previewRowKey={'0'}
          previewOpenValue={-40}
          previewOpenDelay={3000}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.primary]}
            />
          }
          ListEmptyComponent={() => (
            <View style={[Layout.fill, Layout.center, {height: sHight(55)}]}>
              <TextSemiBold
                text="No data found "
                textStyle={[
                  Fonts.poppinSemiBold20,
                  {color: Colors.black_232C28},
                ]}
              />
            </View>
          )}
        />
      )}
    </>
  );
};

export default SwipeableList;
