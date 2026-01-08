import React, {useCallback, useState} from 'react';
import {ActivityIndicator, Platform, StyleSheet, View} from 'react-native';
import {CustomHeader} from '../../components';
import {useTheme} from '../../hooks';
import {WebView} from 'react-native-webview';
import {API_URL} from '../../config';
type Props = {
  navigation: any;
  route: any;
};

const TermsConditionContainer = ({navigation, route}: Props) => {
  const {Layout, Fonts, Gutters, Colors} = useTheme();
  const [visible, setVisible] = useState(false);
  const loadingComponent = useCallback(() => {
    return (
      <View style={styles.activityIndicator}>
        <ActivityIndicator size={'large'} color={Colors.primary} />
      </View>
    );
  }, []);
  const isSignUp = route?.params?.isSignUp;

  return (
    <View style={[Layout.fill, {backgroundColor: Colors.white}]}>
      <CustomHeader
        title={t('common:term_condition')}
        navigation={navigation}
        rightIcon={isSignUp ? false : true}
        rightIconName={'bell'}
      />
      <View style={[Layout.fill, {backgroundColor: Colors.red}]}>
        <WebView
          // source={{uri: 'https://www.google.com.pk/'}}
          source={{
            uri: `${API_URL}terms-and-conditions?platform=${Platform.OS}`,
          }}
          ignoreSslError={true}
          style={{flex: 1}}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onLoadStart={() => {
            setVisible(true);
          }}
          onLoad={data => {
            // console.log('>> data ', data);
            setVisible(false);
          }}
          onError={syntheticEvent => {
            const {nativeEvent} = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
            setVisible(false);
          }}
          onReceivedError={error => {
            console.log('>>>error 00 ', error);
          }}
        />
        {/* {visible && loadingComponent()} */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  activityIndicator: {
    flex: 1,
    position: 'absolute',
    marginRight: 'auto',
    marginBottom: 'auto',
    marginLeft: 'auto',
    marginTop: 'auto',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
  },
});
export default TermsConditionContainer;
