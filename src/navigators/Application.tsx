import React, {useEffect} from 'react';
import {View, StatusBar, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {useTheme} from '../hooks';
import {AuthNavigator, TabNavigator} from '.';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {RootState} from '@/store/store';
import messaging from '@react-native-firebase/messaging';
import {navigationRef} from './utils';
import {tabBarRef} from './TabNavigator';
import notifee, {EventType} from '@notifee/react-native';
import {requestUserPermission} from '../utils/NotificationService';
import {SafeAreaView} from 'react-native-safe-area-context';

import SplashScreen from 'react-native-splash-screen';

const ApplicationNavigator = () => {
  const {Layout, NavigationTheme, Gutters, Colors} = useTheme();
  const {t} = useTranslation();
  global.t = t;

  const token = useSelector((state: RootState) => state?.auth?.token);
  const guest = useSelector((state: RootState) => state?.auth?.guest);

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 500);
  }, []);
  const congratulation = useSelector(
    (state: RootState) => state.signup?.congratulation,
  );

  async function onDisplayNotification(props: any) {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: props?.notification?.title,
      body: props?.notification?.body,
      android: {
        channelId,
        // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
    // navigationRef.navigate('Profile')
  }

  useEffect(() => {
    requestUserPermission();

    messaging().onNotificationOpenedApp(async (remoteMessage: any) => {
      // console.log(
      //   'Notification caused app to open from background state:',
      //   remoteMessage,
      // );
      navigationRef.navigate('Notification');
    });

    // Foreground message
    messaging().onMessage(async remoteMessage => {
      // console.log('====================================');
      // console.log('message received in foreground');
      // console.log('====================================');

      onDisplayNotification(remoteMessage);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          // console.log(
          //   'Notification caused app to open from quit state:',
          //   remoteMessage.notification,
          // );
          navigationRef.navigate('Notification');
        }
      });

    // ...
    notifee.onBackgroundEvent(async ({type, detail}) => {
      if (type === EventType.PRESS) {
        global.toNotifications = true;
        // console.log('notifee background');
      }
    });

    notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          // console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          forgroundLinking(detail);
          break;
      }
    });
  }, []);

  const forgroundLinking = (detail: any) => {
    if (detail?.notification?.title == 'New Message') {
      navigationRef.navigate('Messages');
    } else {
      navigationRef.navigate('Notification');
    }
  };
  const isAuthenticated = !!token; // Convert token to a boolean
  const isGuest = !!guest; // Convert guest to a boolean
  const shouldShowTabNavigator =
    (isAuthenticated && !congratulation) || isGuest;

  console.log(
    shouldShowTabNavigator,
    isAuthenticated,
    !congratulation,
    'checking shouldshow',
  );

  return (
    <SafeAreaView style={[Layout.fullSize]} edges={['top']}>
      <NavigationContainer theme={NavigationTheme} ref={navigationRef}>
        <StatusBar
          translucent={false}
          backgroundColor={Colors.white}
          barStyle={'dark-content'}
        />
        <View style={[Layout.fill, {backgroundColor: Colors.white}]}>
          {shouldShowTabNavigator ? <TabNavigator /> : <AuthNavigator />}
          {/* <TabNavigator /> */}
          {/* <AuthNavigator /> */}
        </View>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default ApplicationNavigator;
