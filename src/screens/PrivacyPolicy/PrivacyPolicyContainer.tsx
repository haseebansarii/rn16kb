import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {CustomHeader, TextRegular, TextSemiBold} from '../../components';
import {useTheme} from '../../hooks';
import {Privacy_Policy} from '../../utils/dummyData';
import {WebView} from 'react-native-webview';
import {API_URL} from '../../config';
type Props = {
  navigation: any;
};

const PrivacyPolicyContainer = ({navigation}: Props) => {
  const {Layout, Fonts, Gutters, Colors} = useTheme();
  const [visible, setVisible] = useState(false);
  const loadingComponent = useCallback(() => {
    return (
      <View style={styles.activityIndicator}>
        <ActivityIndicator size={'large'} color={Colors.primary} />
      </View>
    );
  }, []);
  return (
    <View style={[Layout.fill, {backgroundColor: Colors.white}]}>
      <CustomHeader
        title={t('common:privacy_policy')}
        navigation={navigation}
        rightIcon={true}
      />
      <View style={[Layout.fill, {backgroundColor: Colors.red}]}>
        <WebView
          // source={{uri: 'https://www.google.com.pk/'}}
          source={{uri: `${API_URL}privacy-policy?platform=${Platform.OS}`}}
          style={{flex: 1}}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onLoadStart={() => {
            setVisible(true);
          }}
          onLoad={() => {
            setVisible(false);
          }}
          onError={syntheticEvent => {
            const {nativeEvent} = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
            setVisible(false);
          }}
        />
        {visible && loadingComponent()}
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
export default PrivacyPolicyContainer;
