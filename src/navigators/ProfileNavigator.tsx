import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {View} from 'react-native';
import {useTheme} from '../hooks';
import {
  AboutUs,
  AccountSetting,
  ChatDetail,
  ContactUs,
  FaqsContainer,
  IBuyContainer,
  ISellContainer,
  ISellContainerCard,
  IWatchContainer,
  IWonLostContainer,
  Notification,
  PrivacyPolicy,
  ProductDetailContainer,
  ProfileContainer,
  PropertyForSale,
  RatingReviews,
  RecievedOfferDetail,
  RecievedOffers,
  ReportContainer,
  TermsCondition,
  VehicalForSale,
} from '../screens';
import ISellNavigator from './ISellNavigator';
import {ChatNavigator, IWatchNavigator} from '.';
import {
  getFocusedRouteNameFromRoute,
  useFocusEffect,
} from '@react-navigation/native';
import {tabBarRef} from './TabNavigator';
import {useDispatch} from 'react-redux';
import {fixBottomTab} from '../store/stack/StackSlice';
import {ItemForSale} from '../screens/ISell';
import ChangePassword from '../screens/AccountSetting/ChangePassword';
import InAppPurchaseContainer from '../screens/AccountSetting/InAppPurchaseContainer';

type TProps = {
  navigation: any;
  route: any;
};
const ProfileNavigator = ({navigation, route}: TProps) => {
  const {Layout} = useTheme();
  const Stack = createStackNavigator();

  const dispatch = useDispatch();
  const routeName = getFocusedRouteNameFromRoute(route);

  useFocusEffect(() => {
    if (routeName != 'ProfileContainer' && routeName != undefined) {
      if (routeName !== 'ISellContainer') {
        tabBarRef?.current?.setVisible(false);
        dispatch(fixBottomTab(false));
      }
    } else if (routeName == undefined) {
      tabBarRef?.current?.setVisible(true);
    } else {
      tabBarRef?.current?.setVisible(true);
      dispatch(fixBottomTab(true));
    }
  });

  return (
    <View style={[Layout.fullSize]}>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="ProfileContainer">
        <Stack.Screen name="ProfileContainer" component={ProfileContainer} />
        <Stack.Screen name="RatingReviews" component={RatingReviews} />
        <Stack.Screen name="AccountSetting" component={AccountSetting} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="AboutUs" component={AboutUs} />
        <Stack.Screen name="FaqsContainer" component={FaqsContainer} />
        <Stack.Screen name="ContactUs" component={ContactUs} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        <Stack.Screen name="ReportContainer" component={ReportContainer} />
        <Stack.Screen name="TermsCondition" component={TermsCondition} />
        <Stack.Screen
          name="ISellContainerCard"
          component={ISellContainerCard}
        />
        <Stack.Screen
          name="IWon/ILost"
          component={IWonLostContainer}
          initialParams={{column: 2}}
        />
        <Stack.Screen name="IChat" component={ChatNavigator} />
        <Stack.Screen name="IWatch" component={IWatchNavigator} />
        <Stack.Screen name="IBuy" component={IBuyContainer} />
        <Stack.Screen name="RecievedOffers" component={RecievedOffers} />
        <Stack.Screen
          name="RecievedOfferDetail"
          component={RecievedOfferDetail}
        />
        <Stack.Screen
          name="ProductDetailContainer"
          component={ProductDetailContainer}
        />
        <Stack.Screen name="ChatDetail" component={ChatDetail} />
        <Stack.Screen name="VehicalForSale" component={VehicalForSale} />
        <Stack.Screen name="ISellContainer" component={ISellContainer} />
        <Stack.Screen name="ItemForSale" component={ItemForSale} />
        <Stack.Screen name="PropertyForSale" component={PropertyForSale} />
        <Stack.Screen
          name="InAppPurchaseContainer"
          component={InAppPurchaseContainer}
        />
      </Stack.Navigator>
    </View>
  );
};

export default ProfileNavigator;
