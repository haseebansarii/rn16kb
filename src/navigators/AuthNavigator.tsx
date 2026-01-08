import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {
  Catagories,
  EmailContainer,
  ForgotPassword,
  HomeContainer,
  IBuyContainer,
  OTPContainer,
  PasswordContainer,
  ProductDetailContainer,
  RatingReviews,
  ResetPassword,
  SignUpContainer,
  SplashContainer,
  TermsCondition,
  VerifyCode,
} from '../screens';

const Stack = createStackNavigator();

const Auth = ({route}: any) => {
  // console.log('it is in auth nav');
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="HomeContainer">
      <Stack.Screen name="EmailContainer" component={EmailContainer} />
      <Stack.Screen name="IBuy" component={IBuyContainer} />
      <Stack.Screen name="Catagories" component={Catagories} />
      <Stack.Screen
        name="ProductDetailContainer"
        component={ProductDetailContainer}
      />
      <Stack.Screen name="HomeContainer" component={HomeContainer} />
      <Stack.Screen name="OTPContainer" component={OTPContainer} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="VerifyCode" component={VerifyCode} />
      <Stack.Screen name="PasswordContainer" component={PasswordContainer} />
      <Stack.Screen name="SplashContainer" component={SplashContainer} />
      <Stack.Screen name="SignUpContainer" component={SignUpContainer} />
      <Stack.Screen name="TermsCondition" component={TermsCondition} />
      <Stack.Screen name="RatingReviews" component={RatingReviews} />
    </Stack.Navigator>
  );
};

export default Auth;
