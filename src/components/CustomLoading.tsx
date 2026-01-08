import React from 'react';
import {StyleSheet, View} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {useTheme} from '../hooks';
import {RootState} from '../store/store';

type Props = {
  isLoading: boolean;
};

const CustomLoading = ({isLoading}: Props) => {
  const {Layout, Fonts, Colors, Gutters} = useTheme();
  return isLoading ? (
    <View style={styles.container}>
      <Spinner
        visible={isLoading}
        textContent={'Loading...'}
        overlayColor={'rgba(0, 0, 0, 0.25)'}
        animation="slide"
        textStyle={styles.spinnerTextStyle}
      />
    </View>
  ) : null;
  // return (
  //   <View
  //     style={[
  //       Layout.fill,
  //       Layout.center,
  //       {backgroundColor: 'transparent', opacity: 0.8},
  //     ]}>
  //     {/* <Modal
  //     isVisible={true}
  //     animationIn={'slideInUp'}
  //     animationInTiming={300}
  //     animationOut={'slideInDown'}
  //     animationOutTiming={300}
  //     style={[
  //       Layout.fill,
  //       Layout.center,
  //       {
  //         ...StyleSheet.absoluteFillObject,
  //         // backgroundColor: '#000',
  //         // opacity: 0.8,
  //       },
  //     ]}> */}
  //     {/* <View
  //       style={[Layout.fill, Layout.center, {backgroundColor: 'transparent'}]}> */}
  //     {/* <View
  //       style={[
  //         Layout.screenWidth,
  //         Gutters.smallVPadding,
  //         Gutters.regularHPadding,
  //         Layout.alignItemsCenter,
  //         Layout.row,
  //         Layout.justifyContentStart,
  //         {height: 80, borderRadius: 10, backgroundColor: Colors.white},
  //       ]}> */}
  //     <ActivityIndicator size={'large'} color={Colors.primary} />
  //     {/* <TextSemiBold
  //         text={t('common:loading')}
  //         textStyle={[
  //           Fonts.poppinSemiBold18,
  //           Gutters.smallLMargin,
  //           {color: Colors.primary},
  //         ]}
  //       /> */}
  //     {/* </View> */}
  //     {/* </View> */}
  //     {/* // </Modal> */}
  //   </View>
  // );
};

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF',
  },
  container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#F5FCFF',
    opacity: 0.8,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
export default CustomLoading;
