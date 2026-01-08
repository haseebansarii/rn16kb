import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {View} from 'react-native';
import {useTheme} from '../hooks';
import {
  ChatDetail,
  ChatListContainer,
  ISellContainer,
  ISellContainerCard,
  Notification,
  ProductDetailContainer,
  ProfileContainer,
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
const ChatNavigator = ({route}: any) => {
  const {Layout, Colors, Images, Gutters} = useTheme();

  const dispatch = useDispatch();
  const Stack = createStackNavigator();

  useFocusEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);

    if (routeName != 'IChat' && routeName != undefined) {
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
        initialRouteName="IChat">
        <Stack.Screen name="IChat" component={ChatListContainer} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="ProfileContainer" component={ProfileContainer} />
        <Stack.Screen name="ChatDetail" component={ChatDetail} />
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
        <Stack.Screen
          name="ProductDetailContainer"
          component={ProductDetailContainer}
        />
      </Stack.Navigator>
    </View>
  );
};

export default ChatNavigator;
