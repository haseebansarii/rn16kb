import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {CustomHeader} from '../../components';
import {API_URL} from '../../config';
import {useTheme} from '../../hooks';

type Props = {
  navigation: any;
};

const AboutUsContainer = ({navigation}: Props) => {
  const {Colors, Fonts, Gutters, Layout, Images} = useTheme();
  const [visible, setVisible] = useState(false);

  const loadingComponent = useCallback(() => {
    return (
      <View style={styles.activityIndicator}>
        <ActivityIndicator size={'large'} color={Colors.primary} />
      </View>
    );
  }, []);

  const RenderWebView = () => {
    return (
      <WebView
        // incognito
        // source={{uri: 'https://www.google.com.pk/'}}
        source={{uri: `${API_URL}about-us?platform=${Platform.OS}`}}
        ignoreSslError={true}
        style={{flex: 1}}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onLoadStart={() => {
          setVisible(true);
        }}
        onError={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          // console.warn('WebView error: ', nativeEvent);
          setVisible(false);
        }}
      />
    );
  };
  return (
    <View style={[Layout.fill, {backgroundColor: Colors.white}]}>
      <CustomHeader
        title={t('common:about_us')}
        navigation={navigation}
        rightIcon={true}
      />

      <View style={[Layout.fill, {backgroundColor: Colors.white}]}>
        <RenderWebView />
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

export default AboutUsContainer;
