import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CustomHeader,
  CustomList,
  CustomLoading,
  TextMedium,
  TextSemiBold,
} from '../../components';
import {useMultipleApiCall, useTheme} from '../../hooks';
import {Notification} from '../../utils/dummyData';
import NotificationCard from './NotificationCard';

import {useSelector} from 'react-redux';
import {t} from 'i18next';
import {
  useLazyGetNotificationsQuery,
  useLazyGetReadAllNotificationsQuery,
  useLazyGetUnreadNotificationsCountQuery,
} from '../../services/modules/notifications/notification';
import {sHight} from '../../utils/ScreenDimentions';

type Props = {
  navigation: any;
};

const NotificationContainer = ({navigation}: Props) => {
  const {Colors, Fonts, Gutters, Images, Layout} = useTheme();
  const [selectedTabNotification, setSelectedTabNotification] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum,
  ] = useState(false);
  const [isLoadingBottom, setIsLoadingBottom] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [getNotifications] = useLazyGetNotificationsQuery();
  const [getReadAllNotifications] = useLazyGetReadAllNotificationsQuery();
  const [getUnreadNotificationsCount] =
    useLazyGetUnreadNotificationsCountQuery();

  const allNotifications = useSelector(
    (state: any) => state?.notifications?.allNotifications,
  );
  const token = useSelector((state: any) => state?.auth?.token);

  const getData = async allTabPressed => {
    try {
      await useMultipleApiCall([
        getNotifications({
          skip: 0,
          unread: allTabPressed
            ? false
            : selectedTabNotification == 0
            ? false
            : true,
        }),
        getUnreadNotificationsCount('unread-notification'),
      ]).finally(() => {
        setRefreshing(false);
        setIsLoading(false);
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const getNotificationsFunc = () => {
    getNotifications({
      skip:
        allNotifications?.notification?.length > 0
          ? allNotifications.notification.length
          : 0,
      unread: selectedTabNotification == 0 ? false : true,
    }).finally(() => {
      setIsLoadingBottom(false);
    });
  };
  const getNotificationsUnRead = () => {
    getNotifications({
      skip: 0,
      unread: true,
    });
  };
  const handleRefresh = () => {
    setRefreshing(true);
    !!token && getData();
  };

  useEffect(() => {
    setIsLoading(true);
    token && getData();
  }, []);

  const markComplete = async () => {
    getReadAllNotifications({getData: getData});
  };

  const itemSeparatorComponent = () => {
    return <View style={[Gutters.tinyVMargin]} />;
  };
  const LoadMoreRandomData = () => {
    setIsLoadingBottom(true);
    getNotificationsFunc();
  };

  return (
    <View style={[Layout.fill, {backgroundColor: Colors.white}]}>
      <CustomHeader
        title={t('common:notification')}
        notification={0}
        navigation={navigation}
        onPressRight={() => {}}>
        <View
          style={[
            Layout['fill'],
            Layout.row,
            Layout.alignItemsCenter,
            Gutters.tinyLMargin,
          ]}>
          {['All', 'Unread']?.map((item, index) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedTabNotification(index);
                if (index == 1) {
                  getNotificationsUnRead();
                } else {
                  getData(true);
                }
              }}
              activeOpacity={0.8}
              style={[
                Layout.center,
                index === 1 && Gutters.tinyLMargin,
                Gutters.tinyHPadding,
                {
                  borderWidth: 1,
                  borderColor: Colors.primary,
                  borderRadius: 4,
                  padding: 5,
                  backgroundColor:
                    selectedTabNotification === index
                      ? Colors.primary
                      : Colors.lightGreen_DBF5EC,
                },
              ]}>
              <TextSemiBold
                text={item}
                textStyle={[
                  Fonts.poppinSemiBold14,
                  {
                    color:
                      selectedTabNotification === index
                        ? Colors.white
                        : Colors.primary,
                  },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </CustomHeader>
      <View
        style={[
          Gutters.smallHPadding,
          Gutters.littleVPadding,
          Layout.alignItemsEnd,
        ]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            Alert.alert(
              'Alert',
              'Are you sure you want to read all notification?',
              [
                {
                  text: 'Cancel',

                  onPress: () => console.log('User Press Cancel'),
                },
                {
                  text: 'Ok',

                  onPress: () => markComplete(),
                },
              ],
            );
          }}
          style={[Gutters.littlePadding]}>
          <TextMedium
            text={t('common:mark_read')}
            textStyle={[Fonts.poppinMed16, {color: Colors.primary}]}
          />
        </TouchableOpacity>
      </View>

      <View style={[Layout.screen, {marginBottom: '5%'}]}>
        <FlatList
          data={allNotifications.notification}
          showsVerticalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({item, index}: any) => {
            const {message, created_at, seen, _id, url, from_user} = item;
            return selectedTabNotification == 0 ? (
              <NotificationCard
                id={_id}
                url={url}
                text={message}
                read={seen}
                getData={getData}
                index={index}
                created_at={created_at}
                navigation={navigation}
                photo={from_user?.photo ? from_user?.photo : null}
              />
            ) : (
              !seen && (
                <NotificationCard
                  id={_id}
                  url={url}
                  text={message}
                  read={seen}
                  getData={getData}
                  index={index}
                  created_at={created_at}
                  navigation={navigation}
                  photo={from_user?.photo ? from_user?.photo : null}
                />
              )
            );
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.primary]}
            />
          }
          ItemSeparatorComponent={itemSeparatorComponent}
          ListFooterComponent={() => {
            return (
              <View>
                {isLoadingBottom ? (
                  <View
                    style={{
                      height: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                  </View>
                ) : null}
              </View>
            );
          }}
          onEndReached={({distanceFromEnd}) => {
            if (!onEndReachedCalledDuringMomentum) {
              if (
                allNotifications.notification &&
                allNotifications.notification.length <
                  allNotifications?.pagination?.total
              ) {
                LoadMoreRandomData();
              }
              setOnEndReachedCalledDuringMomentum(true);
            }
          }}
          onEndReachedThreshold={0.6}
          onMomentumScrollBegin={() => {
            setOnEndReachedCalledDuringMomentum(false);
          }}
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
      </View>
      <CustomLoading isLoading={isLoading} />
    </View>
  );
};

export default NotificationContainer;
