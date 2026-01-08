import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CustomBottomSheet,
  CustomButton,
  CustomHeader,
  CustomLoading,
  TextRegular,
  TextSemiBold,
} from '../../components';
import {useTheme} from '../../hooks';
import CustomProfile from './CustomProfile';
import CustomProfileBtn from './CustomProfileBtn';
import {useLogoutMutation} from '../../services/accountSettings/userProfileService';
import {useDispatch} from 'react-redux';
import {persistor, RootState} from '../../store/store';
import messaging from '@react-native-firebase/messaging';
import {logoutUser} from '../../store/auth/AuthSlice';
import {setlistData} from '../../store/Listings';
import {useIsFocused} from '@react-navigation/native';

type TProps = {
  navigation: any;
};

const ProfileContainer = ({navigation}: TProps) => {
  const {Colors, Layout, Gutters, Images, Fonts} = useTheme();
  const [logout, setLogout] = useState(false);
  const [logoutApi, {isLoading}] = useLogoutMutation();

  const dispatch = useDispatch();

  const logOutUserFunc = async () => {
    let fcmToken = await messaging().getToken();
    logoutApi({firebase_token: fcmToken}).then(res => {
      setLogout(false);
      setTimeout(async () => {
        dispatch(logoutUser());
        await persistor.purge();
        await persistor.flush();
      }, 2000);
    });
  };

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     // The screen is focused
  //     // Call any action
  //     dispatch(setlistData([]));
  //   });
  //   // Return the function to unsubscribe from the event so it gets removed on unmount
  //   return unsubscribe;
  // }, [navigation]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      // Call your function if the screen is focused and the condition is true
      dispatch(setlistData([]));
    }
  }, [isFocused]);

  return (
    <View style={[Layout.fill, {backgroundColor: Colors.white}]}>
      <CustomHeader
        title={t('common:profile')}
        navigation={navigation}
        rightIcon={false}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={[Layout.simpleScreen, Gutters.smallTPadding]}>
        <CustomProfile navigation={navigation} />

        <CustomProfileBtn navigation={navigation} />

        <TouchableOpacity
          style={styles.logoutContainer}
          onPress={() => setLogout(true)}>
          <Images.svg.logout_1.default marginRight={15} />
          <Text style={[Fonts.poppinSemiBold20, {color: Colors.primary}]}>
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <CustomBottomSheet visible={logout} height={'80%'} icon={false}>
        <View
          style={[Layout.fill, Layout.alignItemsCenter, Gutters.smallTPadding]}>
          <Images.svg.logout.default height={80} width={80} />
          <TextSemiBold
            text={t('common:are_you_sure_you_want_to_logout')}
            textStyle={[
              Layout.textAlign,
              Gutters.regularVMargin,
              Gutters.tinyHPadding,
              Fonts.poppinSemiBold24,
              {textTransform: 'none', color: Colors.black_232C28},
            ]}
          />
          {/* <TextRegular
            text="Neque porro quisquam est qui ipsum quia dolor sit amet consectetur adipisci velit.."
            textStyle={[
              Fonts.poppinReg16,
              Layout.textAlign,
              Gutters.smallHPadding,
              {color: Colors.black_232C28},
            ]}
          /> */}
          <View
            style={[
              Gutters.xRegularVPadding,
              Layout.column,
              Layout.screenWidth,
              Layout.justifyContentBetween,
            ]}>
            <CustomButton
              text={t('common:yes')}
              btnStyle={[{backgroundColor: Colors.primary}]}
              textStyle={[Fonts.poppinSemiBold24, {color: Colors.white}]}
              onPress={logOutUserFunc}
            />
            <CustomButton
              text={t('common:cancel')}
              btnStyle={[
                Gutters.xTinyTMargin,
                {backgroundColor: Colors.dark_gray_676C6A},
              ]}
              textStyle={[Fonts.poppinSemiBold24, {color: Colors.white}]}
              onPress={() => setLogout(false)}
            />
          </View>
        </View>
      </CustomBottomSheet>
      <CustomLoading isLoading={isLoading} />
    </View>
  );
};

export default ProfileContainer;

const styles = StyleSheet.create({
  logoutContainer: {
    marginHorizontal: '8%',
    marginTop: '3%',
    marginBottom: '10%',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

{
  /* <TouchableOpacity
activeOpacity={0.8}
style={[
  Layout.center,
  {
    backgroundColor: Colors.primary,
    paddingVertical: sHight(1.5),
    borderRadius: 8,
    marginHorizontal:'5%',
    marginVertical:'3%'
  },
]}>
<Text
  style={[
 
    Fonts.textUppercase,
    Fonts.poppinBold24,
    {color: Colors.white},
  ]}>
List an Item
</Text>
</TouchableOpacity> */
}
