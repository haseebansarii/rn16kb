import {useNavigation} from '@react-navigation/native';
import React, {createRef, useEffect, useState} from 'react';
import {
  Animated,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {CurvedBottomBar} from 'react-native-curved-bottom-bar';
import {useDispatch, useSelector} from 'react-redux';
import {
  ChatNavigator,
  HomeNavigator,
  IWatchNavigator,
  ProfileNavigator,
} from '.';
import {useTheme} from '../hooks';
import {currentStack} from '../store/stack/StackSlice';
import {RootState} from '../store/store';
import {showUserAlert} from '../utils/helpers';
import {setGuest} from '../store/auth/AuthSlice';

export const tabBarRef = createRef();

const TabNavigator = () => {
  const {Layout, Colors, Images, Gutters, Fonts} = useTheme();

  const dispacth = useDispatch();
  const navigation = useNavigation();
  const current_stack = useSelector(
    (state: RootState) => state?.stack?.current_stack,
  );
  const fix_bottom_tab = useSelector(
    (state: RootState) => state?.stack?.fix_bottom_tab,
  );

  const renderTabBar = ({routeName, selectedTab, navigate}: any) => {
    const TabImages = () => {
      switch (routeName) {
        case 'HOME':
          return (
            <Images.svg.HomeTab.default
              stroke={routeName == selectedTab ? Colors.primary : Colors.white}
              height={!!current_stack ? 24 : routeName == selectedTab ? 22 : 20}
              width={!!current_stack ? 21 : routeName == selectedTab ? 20 : 18}
            />
          );
        case 'ICHAT':
          return (
            <Images.svg.ChatTab.default
              stroke={routeName == selectedTab ? Colors.primary : Colors.white}
              height={!!current_stack ? 24 : routeName == selectedTab ? 26 : 24}
              width={!!current_stack ? 25 : routeName == selectedTab ? 26 : 24}
            />
          );
        case 'PROFILE':
          return (
            <Images.svg.ProfileTab.default
              stroke={routeName == selectedTab ? Colors.primary : Colors.white}
              height={!!current_stack ? 24 : routeName == selectedTab ? 20 : 19}
              width={!!current_stack ? 21 : routeName == selectedTab ? 17 : 15}
            />
          );
        case 'ISELL':
          return (
            <Images.svg.ISellTab.default
              stroke={routeName == selectedTab ? Colors.primary : Colors.white}
              height={routeName == selectedTab ? 24 : 22}
              width={routeName == selectedTab ? 24 : 21}
            />
          );
        case 'IWATCH':
          return (
            <Images.svg.IWatchTab.default
              stroke={routeName == selectedTab ? Colors.primary : Colors.white}
              height={!!current_stack ? 24 : routeName == selectedTab ? 19 : 17}
              width={!!current_stack ? 23 : routeName == selectedTab ? 26 : 23}
            />
          );
        default:
          return;
      }
    };

    return (
      <TouchableOpacity
        onPress={() => {
          if (current_stack == routeName) {
            navigation.reset({
              index: 0,
              routes: [{name: routeName} as any],
            });
            dispacth(currentStack(null as any));
            return;
          }
          if (!!current_stack && current_stack !== routeName) {
            navigation.reset({
              index: 0,
              routes: [{name: routeName} as any],
            });
            dispacth(currentStack(null as any));
          } else {
            navigate(routeName);
            dispacth(currentStack(null as any));
          }
        }}
        style={{
          ...styles.tabbarItem,
          alignSelf:
            routeName == 'PROFILE'
              ? 'flex-end'
              : routeName == 'IWATCH'
              ? 'flex-end'
              : 'flex-start',
          borderTopRightRadius: routeName === 'ICHAT' ? 35 : 0,
          borderTopLeftRadius: routeName === 'IWATCH' ? 35 : 0,
          justifyContent: 'flex-end',
          // backgroundColor: routeName == 'HOME' ? 'green' : 'transparent',
        }}>
        {TabImages()}
        <Text
          style={[
            Fonts.poppinReg12,
            Gutters.tinyTMargin,
            {
              color: routeName == selectedTab ? Colors.primary : Colors.white,
            },
          ]}>
          {routeName == 'IWATCH'
            ? 'iWATCH'
            : routeName == 'ICHAT'
            ? 'iCHAT'
            : routeName}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[Layout.fullSize]}>
      {!!fix_bottom_tab && (
        <View
          style={{
            width: '100%',
            height: 20,
            backgroundColor: Colors.black_232C28,
            position: 'absolute',
            zIndex: 1,
            bottom: 0,
          }}
        />
      )}
      <CurvedBottomBar.Navigator
        initialRouteName="HOME"
        type="DOWN"
        screenOptions={{
          headerShown: false,
          //tabBarStyle: {display: tabBarVisible ? 'flex' : 'none'},
        }}
        ref={tabBarRef as any}
        defaultScreenOptions={navigation}
        shadowStyle={styles.shawdow}
        bgColor={Colors.black_232C28}
        style={{
          backgroundColor: Colors.transparent,
          paddingBottom: 20,
        }}
        renderCircle={({selectedTab, routeName, navigate}) => {
          return (
            <Animated.View
              style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                alignItems: 'center',
                justifyContent: 'center',
                bottom: 25,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.2,
                shadowRadius: 1.41,
                elevation: 1,
              }}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  dispacth(currentStack(selectedTab));
                  navigation.navigate('ISellContainer', {
                    screen: 'ISellContainer',
                  });
                  // if (current_stack == null) {
                  // }
                }}>
                <Images.svg.ISellTab.default height={100} width={100} />
              </TouchableOpacity>
            </Animated.View>
          );
        }}
        tabBar={renderTabBar}>
        <CurvedBottomBar.Screen
          name="HOME"
          position="LEFT"
          component={HomeNavigator}
        />
        <CurvedBottomBar.Screen
          name="ICHAT"
          position="LEFT"
          component={ChatNavigator}
        />
        <CurvedBottomBar.Screen
          name="IWATCH"
          component={IWatchNavigator}
          position="RIGHT"
        />
        <CurvedBottomBar.Screen
          name="PROFILE"
          component={ProfileNavigator}
          position="RIGHT"
        />
      </CurvedBottomBar.Navigator>
    </View>
  );
};

export default TabNavigator;

const styles = StyleSheet.create({
  tabBarStyle: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  shawdow: {
    shadowColor: '#DDDDDD',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
  },
  bottomBar: {},
  btnCircleUp: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    bottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 1,
  },
  imgCircle: {
    width: 30,
    height: 30,
    tintColor: 'gray',
  },
  tabbarItem: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'yellow',
    // width: windowWidth / 6,
  },
  img: {
    width: 30,
    height: 30,
  },
  screen1: {
    flex: 1,
    backgroundColor: '#BFEFFF',
  },
  screen2: {
    flex: 1,
    backgroundColor: '#FFEBCD',
  },
});
