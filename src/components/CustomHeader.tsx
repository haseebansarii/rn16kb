import React, {ReactNode, memo, useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../hooks';

import i18next from 'i18next';
import {TextRegular, TextSemiBold} from '.';
import {useDispatch, useSelector} from 'react-redux';
import {currentStack} from '../store/stack/StackSlice';
import {RootState} from '../store/store';
import {clearCategoryList} from '../store/catagories/Catagories';
import {useGetUnreadNotificationsCountQuery} from '../services/modules/notifications/notification';
import {showUserAlert} from '../utils/helpers';

type Props = {
  navigation: any;
  children?: ReactNode;
  rightIcon?: boolean;
  rightIconName?: string;
  onPressRight?: CallableFunction;
  title: string;
  notification?: number;
  screen?: string;
};

const CustomHeader = ({
  navigation,
  rightIcon,
  rightIconName = 'bell',
  children,
  title,
  notification = 10,
  screen,
  onPressRight,
}: Props) => {
  const {Layout, Gutters, Images, Fonts, Colors} = useTheme();
  const RIcon = rightIconName ? Images.svg[rightIconName].default : null;

  const token = useSelector((state: RootState) => state?.auth?.token);
  const guest = useSelector((state: RootState) => state?.auth?.guest);

  const unreadNotificationsCount = useSelector(
    (state: RootState) => state.notifications?.unreadNotificationsCount,
  );

  const dispatch = useDispatch();

  const getUnreadNotificationsCount = useGetUnreadNotificationsCountQuery(
    {},
    {skip: !token, pollingInterval: 10000},
  );

  const backButton = () => {
    if (screen == 'ISellContainer') {
      // navigation.goBack();
      dispatch(currentStack(null));
    }
    if (screen == 'Categories') {
      dispatch(clearCategoryList([]));
    }
    navigation.goBack();
  };
  return (
    <View
      style={[
        i18next.language === 'en' ? Layout.row : Layout.rowReverse,
        Layout.justifyContentBetween,
        Layout.alignItemsCenter,
        // Gutters.xTinyVPadding,
        Layout.selfCenter,
        {
          width: '94%',
        },
      ]}>
      <View style={[Layout.row, Layout.center]}>
        <TouchableOpacity
          style={[
            Layout.center,
            Gutters.mediumVPadding,
            Gutters.tinyLPadding,
            Gutters.smallRPadding,
          ]}
          activeOpacity={0.8}
          onPress={() => backButton()}>
          <View>
            <Images.svg.GoBack.default stroke={Colors.black_232C28} />
          </View>
        </TouchableOpacity>
        <TextSemiBold
          text={title}
          textStyle={[
            Fonts.poppinSemiBold20,
            // Gutters.littleLMargin,
            {color: Colors.black_232C28, textTransform: 'none'},
          ]}
        />
      </View>
      {children && <>{children}</>}

      <View>
        {rightIcon &&
          (guest || !token ? null : (
            <View
              style={[
                Layout.center,
                Layout.absolute,
                {
                  backgroundColor: Colors.red,
                  top: -5,
                  zIndex: 1,
                  left: 20,
                  height: 20,
                  width: 20,
                  borderRadius: 20 / 2,
                },
              ]}>
              <TextRegular
                text={unreadNotificationsCount ?? 0}
                textStyle={[Fonts.poppinReg10, {color: Colors.white}]}
              />
            </View>
          ))}

        {rightIcon &&
          (guest || !token ? null : (
            <TouchableOpacity
              style={[Gutters.littlePadding]}
              activeOpacity={0.8}
              onPress={() => {
                // if (guest || !token) {
                //   showUserAlert();
                // } else {
                navigation.navigate('Notification');
                // }
              }}>
              <RIcon />
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
};

export default CustomHeader;
