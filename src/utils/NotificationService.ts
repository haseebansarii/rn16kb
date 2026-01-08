import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import notifee, {EventType} from '@notifee/react-native';
import {useDispatch} from 'react-redux';

async function registerAppWithFCM() {
  await messaging().registerDeviceForRemoteMessages();
}

export async function requestUserPermission() {
  registerAppWithFCM();
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    // console.log('Authorization status:', authStatus);
    if (messaging().isDeviceRegisteredForRemoteMessages) {
      getFcmToken();
    }
  }
}

export const getFcmToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcm_token');
  // console.log('Old Fcm token:', fcmToken);
  if (!fcmToken) {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        // console.log(fcmToken, 'the new generated token');
        await AsyncStorage.setItem('fcm_token', fcmToken);
      }
    } catch (error) {
      // console.log(error, 'while getting fcm token');
    }
  }
};

export const notificationListener = async () => {
  // Assume a message-notification contains a "type" property in the data payload of the screen to open
  messaging().onNotificationOpenedApp(async (remoteMessage: any) => {
    // console.log(
    //   'Notification caused app to open from background state:',
    //   remoteMessage,
    // );
    // navigationRef.navigate('Notifications')
  });

  // Foreground message
  messaging().onMessage(async remoteMessage => {
    // console.log('message received in foreground test', remoteMessage);
    onDisplayNotification(remoteMessage);
    // console.log('====================================');
    // // console.log(JSON.parse(remoteMessage?.data?.payload))
    // console.log('====================================');
    const dispatch = useDispatch();
    // dispatch(inprogressTrips(JSON.parse(remoteMessage?.data?.payload)))
  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
        // navigationRef.navigate('Notifications')
        // notifee.incrementBadgeCount()
        //   setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
      }
      // setLoading(false);
    });
};

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

// const incrementBadge = () => {
//   notifee
//     .incrementBadgeCount()
//     .then(() => notifee.getBadgeCount())
//     .then(count => console.log('Badge count incremented by 1 to: ', count))
// }

// const decrementBadge = () => {
//   notifee
//     .decrementBadgeCount()
//     .then(() => notifee.getBadgeCount())
//     .then(count => console.log('Badge count decremented by 1 to: ', count))
// }
