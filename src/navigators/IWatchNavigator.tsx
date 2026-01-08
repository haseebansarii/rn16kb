import {View, Text} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useTheme} from '../hooks';
import {
  ChatDetail,
  ISellContainer,
  ISellContainerCard,
  IWatchContainer,
  ProductDetailContainer,
  PropertyForSale,
  RecievedOfferDetail,
  RecievedOffers,
  VehicalForSale,
} from '../screens';
import ISellNavigator from './ISellNavigator';
import {
  getFocusedRouteNameFromRoute,
  useFocusEffect,
} from '@react-navigation/native';
import {tabBarRef} from './TabNavigator';
import {useDispatch} from 'react-redux';
import {fixBottomTab} from '../store/stack/StackSlice';
import {ItemForSale} from '../screens/ISell';

const IWatchNavigator = ({route}: any) => {
  const {Layout, Colors, Images, Gutters} = useTheme();

  const dispatch = useDispatch();
  const Stack = createStackNavigator();

  const routeName = getFocusedRouteNameFromRoute(route);

  useFocusEffect(() => {
    if (routeName != 'IWatchContainer' && routeName != undefined) {
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
    <View style={[Layout.fill]}>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="IWatchContainer">
        <Stack.Screen
          name="IWatchContainer"
          component={IWatchContainer}
          initialParams={{column: 1}}
        />
        <Stack.Screen
          name="ProductDetailContainer"
          component={ProductDetailContainer}
        />
        <Stack.Screen name="ISellNavigator" component={ISellNavigator} />

        <Stack.Screen name="VehicalForSale" component={VehicalForSale} />
        <Stack.Screen name="ISellContainer" component={ISellContainer} />
        <Stack.Screen name="ItemForSale" component={ItemForSale} />
        <Stack.Screen name="PropertyForSale" component={PropertyForSale} />
        <Stack.Screen name="RecievedOffers" component={RecievedOffers} />
        <Stack.Screen
          name="RecievedOfferDetail"
          component={RecievedOfferDetail}
        />
        <Stack.Screen
          name="ISellContainerCard"
          component={ISellContainerCard}
        />
        <Stack.Screen name="ChatDetail" component={ChatDetail} />
      </Stack.Navigator>
    </View>
  );
};

export default IWatchNavigator;
