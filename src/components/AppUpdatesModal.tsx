import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Platform,
  AppState,
  BackHandler,
} from 'react-native';
import {RootState} from '../store/store';
import {useSelector} from 'react-redux';
import {Gutters} from '../theme';
import {useTheme} from '../hooks';
import CustomButton from './CustomButton';
import {screenWidth} from '../utils/ScreenDimentions';

const AppUpdatesModal = () => {
  const [isVisible, setIsVisible] = useState(true);

  const mobileSettings = useSelector(
    (state: RootState) => state?.auth?.mobileSettings,
  );
  const {Layout, Gutters, Colors, Fonts} = useTheme();
  const getValue = value => {
    const appVersionObject =
      mobileSettings && mobileSettings.find(item => item?.meta_key === value);

    return appVersionObject?.meta_values;
  };

  const [appUpdateObj, setAppUpdateObj] = useState({
    appVersion: getValue('appVersion') || '',
    iosUrl: '',
    androidUrl: '',
    changesList: [],
    infoText: getValue('infoText') || '',
    isForceQuit: 'false',
    buttonTitle: 'Update',
  });

  useEffect(() => {
    setAppUpdateObj({
      appVersion: getValue('appVersion'),
      iosUrl: getValue('iosUrl'),
      androidUrl: getValue('androidUrl'),
      changesList: getValue('changesList'),
      infoText: getValue('infoText'),
      isForceQuit: getValue('isForceQuit'),
      buttonTitle: getValue('buttonTitle'),
    });
  }, []);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      presentationStyle="overFullScreen"
      // onRequestClose={() => setIsVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>App Updates</Text>
          <Text
            style={[
              Gutters.smallVMargin,
              styles.changeText,
              {color: Colors.black_232C28},
            ]}>
            {getValue('infoText') || ''}
          </Text>
          {/* <TouchableOpacity
            onPress={() => {
              if (appUpdateObj?.isForceQuit === 'true') {
                BackHandler.exitApp();
              } else {
                Linking.openURL(
                  Platform.OS === 'android'
                    ? appUpdateObj?.androidUrl
                    : appUpdateObj?.iosUrl,
                );
              }
            }}
            style={styles.closeButton}>
            <Text style={styles.closeButtonText}>
              {appUpdateObj?.buttonTitle ? appUpdateObj?.buttonTitle : 'Update'}
            </Text>
          </TouchableOpacity> */}
          <CustomButton
            text={getValue('buttonTitle') ? getValue('buttonTitle') : 'Update'}
            btnStyle={[{backgroundColor: Colors.primary}]}
            textStyle={[{color: Colors.white, width: screenWidth * 0.7}]}
            onPress={() => {
              if (getValue('isForceQuit') === 'true') {
                BackHandler.exitApp();
              } else {
                Linking.openURL(
                  Platform.OS === 'android'
                    ? getValue('androidUrl')
                    : getValue('iosUrl'),
                );
              }
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  version: {
    fontSize: 18,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  changeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  changeText: {
    fontSize: 16,
    marginLeft: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AppUpdatesModal;
