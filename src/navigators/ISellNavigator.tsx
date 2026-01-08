import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {View} from 'react-native';
import {useDispatch} from 'react-redux';
import {useTheme} from '../hooks';
import {
  AccountSetting,
  ISellContainer,
  ISellContainerCard,
  ProductDetailContainer,
  PropertyForSale,
  RecievedOfferDetail,
  RecievedOffers,
  VehicalForSale,
} from '../screens';
import {ItemForSale} from '../screens/ISell';

const ISellNavigator = ({route}: any) => {
  const {Layout, Colors, Images, Gutters} = useTheme();

  const dispatch = useDispatch();
  const Stack = createStackNavigator();

  return (
    <View style={[Layout.fullSize]}>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="ISellContainer">
        <Stack.Screen name="VehicalForSale" component={VehicalForSale} />
        <Stack.Screen name="ISellContainer" component={ISellContainer} />
        <Stack.Screen name="ItemForSale" component={ItemForSale} />
        <Stack.Screen name="PropertyForSale" component={PropertyForSale} />
        <Stack.Screen name="RecievedOffers" component={RecievedOffers} />
        <Stack.Screen name="AccountSetting" component={AccountSetting} />
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

export default ISellNavigator;
