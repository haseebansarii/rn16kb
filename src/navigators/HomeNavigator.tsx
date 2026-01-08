import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  AccountSetting,
  Catagories,
  IBuyContainer,
  HomeContainer,
  ReportContainer,
  ProductDetailContainer,
  RatingReviews,
  IWatchContainer,
  Notification,
  VehicalForSale,
  ISellContainer,
  PropertyForSale,
  IWonLostContainer,
  BuyerOffersContainer,
  RecievedOffers,
  RecievedOfferDetail,
  ISellContainerCard,
  ChatDetail,
} from '../screens';
import {View} from 'react-native';
import {useTheme} from '../hooks';
import {
  getFocusedRouteNameFromRoute,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {tabBarRef} from './TabNavigator';
import ISellNavigator from './ISellNavigator';
import {useDispatch} from 'react-redux';
import {fixBottomTab} from '../store/stack/StackSlice';
import {ItemForSale} from '../screens/ISell';
import {RootState} from '../store/store';

const Stack = createStackNavigator();

const HomeNavigator = ({route}: any) => {
  const {Layout} = useTheme();

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const route2 = getFocusedRouteNameFromRoute(route);

  useFocusEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);

    if (routeName != 'HomeContainer' && routeName != undefined) {
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
        initialRouteName="HomeContainer">
        <Stack.Screen name="AccountSetting" component={AccountSetting} />
        <Stack.Screen name="IBuy" component={IBuyContainer} />
        <Stack.Screen name="Catagories" component={Catagories} />
        <Stack.Screen name="HomeContainer" component={HomeContainer} />
        <Stack.Screen
          name="ProductDetailContainer"
          component={ProductDetailContainer}
        />

        <Stack.Screen name="ISellNavigator" component={ISellNavigator} />
        <Stack.Screen name="RatingReviews" component={RatingReviews} />
        <Stack.Screen name="IWatchContainer" component={IWatchContainer} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="VehicalForSale" component={VehicalForSale} />
        <Stack.Screen name="ISellContainer" component={ISellContainer} />
        <Stack.Screen name="ItemForSale" component={ItemForSale} />
        <Stack.Screen name="PropertyForSale" component={PropertyForSale} />
        <Stack.Screen name="ChatDetail" component={ChatDetail} />
        <Stack.Screen
          name="IWon/ILost"
          component={IWonLostContainer}
          initialParams={{column: 2}}
        />
        <Stack.Screen
          name="BuyerOffersContainer"
          component={BuyerOffersContainer}
        />
        <Stack.Screen name="RecievedOffers" component={RecievedOffers} />
        <Stack.Screen
          name="RecievedOfferDetail"
          component={RecievedOfferDetail}
        />
        <Stack.Screen
          name="ISellContainerCard"
          component={ISellContainerCard}
        />
      </Stack.Navigator>
    </View>
  );
};

export default HomeNavigator;
