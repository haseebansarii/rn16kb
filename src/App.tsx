// import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/lib/integration/react';
import {store, persistor} from './store/store';
import ApplicationNavigator from './navigators/Application';
import './translations';
import {
  LogBox,
  PermissionsAndroid,
  Platform,
  Text,
  TextInput,
  View,
} from 'react-native';
import Toast from 'react-native-toast-notifications';
import messaging from '@react-native-firebase/messaging';
import notifee, {EventType, AndroidImportance} from '@notifee/react-native';
import {StripeProvider} from '@stripe/stripe-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ClickOutsideProvider} from 'react-native-click-outside';
import {navigationRef} from './navigators/utils';
import {publishable_key} from './config';
import CryptoJS from 'crypto-js';
import {withIAPContext} from 'react-native-iap';
import {SafeAreaProvider} from 'react-native-safe-area-context';

LogBox.ignoreAllLogs(true);

const App = () => {
  async function registerAppWithFCM() {
    if (Platform.OS === 'android') {
      try {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
      } catch (error) {
        // console.log('permission error on ', error);
      }
    }
    await messaging().registerDeviceForRemoteMessages();
  }

  const requestUserPermission = async () => {
    registerAppWithFCM();
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      if (messaging().isDeviceRegisteredForRemoteMessages) {
        getFcmToken();
      }
    }
  };

  // const getFcmToken = async () => {
  //   let fcmToken = await AsyncStorage.getItem('fcmToken');

  //   if (!fcmToken) {
  //     try {
  //       const fcmToken = await messaging().getToken();
  //       if (fcmToken) {
  //         // console.log(fcmToken, 'the new generated token');
  //         await AsyncStorage.setItem('fcmToken', fcmToken);
  //       }
  //     } catch (error) {
  //       // console.log(error, 'while getting fcm token');
  //     }
  //   }
  // };
  const encryptionKey = 'com.isqroll-256-bit-hex-key-outsource';

  // Function to encrypt a value
  const encryptToken = (token: string) => {
    return CryptoJS.AES.encrypt(token, encryptionKey).toString();
  };

  // Function to decrypt a value
  const decryptToken = (encryptedToken: string) => {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const getFcmToken = async () => {
    let encryptedFcmToken = await AsyncStorage.getItem('fcmToken');

    if (!encryptedFcmToken) {
      try {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
          // Encrypt the token before storing
          const encryptedToken = encryptToken(fcmToken);
          await AsyncStorage.setItem('fcmToken', encryptedToken);
        }
      } catch (error) {
        console.log(error, 'while getting fcm token');
      }
    } else {
      // Decrypt the token if it exists
      const fcmToken = decryptToken(encryptedFcmToken);
      console.log('Decrypted FCM Token:', fcmToken);
    }
  };

  // async function onDisplayNotification(props: any) {
  //   // Request permissions (required for iOS)
  //   await notifee.requestPermission();

  //   // Create a channel (required for Android)
  //   const channelId = await notifee.createChannel({
  //     id: 'default',
  //     name: 'Default Channel',
  //   });

  //   // Display a notification
  //   await notifee.displayNotification({
  //     title: props?.notification?.title,
  //     body: props?.notification?.body,
  //     android: {
  //       channelId,
  //       // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
  //       // pressAction is needed if you want the notification to open the app when pressed
  //       pressAction: {
  //         id: 'default',
  //       },
  //     },
  //   });
  //   // navigationRef.navigate('Profile')
  // }

  useEffect(() => {
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
    TextInput.defaultProps = TextInput.defaultProps || {};
    TextInput.defaultProps.allowFontScaling = false;
    View.defaultProps = View.defaultProps || {};
    View.defaultProps.allowFontScaling = false;
  }, []);

  return (
    <SafeAreaProvider style={{backgroundColor: 'white'}}>
      <StripeProvider
        publishableKey={publishable_key}
        merchantIdentifier="merchant.identifier" // required for Apple Pay
        urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
      >
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ClickOutsideProvider>
              <ApplicationNavigator />
            </ClickOutsideProvider>

            <Toast ref={ref => (global.toast = ref)} />
          </PersistGate>
        </Provider>
      </StripeProvider>
    </SafeAreaProvider>
  );
};

export default withIAPContext(App);
