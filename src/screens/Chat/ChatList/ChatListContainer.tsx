import React, {useEffect, useState} from 'react';
import {Linking, Platform, Text, TouchableOpacity, View} from 'react-native';
import {CustomHeader, CustomInput} from '../../../components';
import {useTheme} from '../../../hooks';
import {ChatList} from '../../../utils/dummyData';
import SwipeableList from './SwipeableList';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../store/store';
import {useLazyGetUserCheckPermissionsQuery} from '../../../services/accountSettings/userProfileService';

import Modal from 'react-native-modal';
import {storeUserCheckPermissons} from '../../../store/auth/AuthSlice';
import {useLazyGetAllUsersChatQuery} from '../../../services/chat';
import {useIsFocused} from '@react-navigation/native';
import {FE_URL} from '../../../config';
type Props = {
  navigation: any;
};

const ChatListContainer = ({navigation}: Props) => {
  const {Layout, Fonts, Gutters, Colors, Images} = useTheme();

  const allUserChats = useSelector(
    (state: RootState) => state.chats?.allUserChats,
  );
  const user_permissions = useSelector(
    (state): RootState => state.auth?.user_permissions,
  );
  const [getAllUserChat] = useLazyGetAllUsersChatQuery();
  const [isShowUserPermissionDialog, setIsShowUserPermissionDialog] = useState(
    user_permissions?.is_allowed == false ? true : false,
  );
  const [getUserPermissions] = useLazyGetUserCheckPermissionsQuery();
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();
  const handleSearch = text => {
    setSearch(text);
  };
  const token = useSelector((state: RootState) => state.auth?.token);

  const isFocused = useIsFocused();
  const filteredData =
    search === ''
      ? allUserChats
      : allUserChats.filter(
          (item: any) =>
            item?.from_user?.first_name
              ?.toLowerCase()
              .includes(search.toLowerCase()) ||
            item?.from_user?.last_name
              ?.toLowerCase()
              .includes(search.toLowerCase()),
        );
  useEffect(() => {
    getUserPermissions('?feature=ichat');
  }, []);
  useEffect(() => {
    setIsShowUserPermissionDialog(
      user_permissions?.is_allowed == false ? true : false,
    );
  }, [user_permissions]);

  useEffect(() => {
    if (isFocused) {
      getAllChatsOnFocus();
    }
  }, [isFocused]);
  const getAllChatsOnFocus = () => {
    !!token && getAllUserChat('all-chats').finally(() => {});
  };

  const userCheckPermissions = () => {
    return (
      <View
        style={[
          Layout.fullWidth,
          Layout.alignItemsCenter,
          Gutters.smallPadding,
          {
            borderRadius: 6,
            backgroundColor: Colors.white,
          },
        ]}>
        <Text style={[Fonts.poppinSemiBold25, {color: Colors.black_232C28}]}>
          {'Subscription Alert!'}
        </Text>
        <Text
          style={[
            Fonts.poppinMed16,
            Gutters.tinyTMargin,
            {color: Colors.dark_gray_676C6A, textAlign: 'center'},
          ]}>
          {user_permissions?.message}
        </Text>
        <View
          style={[
            Gutters.smallTMargin,
            Layout.selfCenter,
            Layout.row,
            Layout.alignItemsCenter,
          ]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setIsShowUserPermissionDialog(false);
              Platform.OS == 'android'
                ? navigation.navigate('AccountSetting')
                : Linking.openURL(FE_URL);
              dispatch(storeUserCheckPermissons({}));
            }}
            style={[
              Gutters.tinyPadding,
              Gutters.xTinyPadding,
              Layout.center,
              {
                backgroundColor: Colors.primary,
                borderRadius: 6,
                width: 150,
              },
            ]}>
            <Text style={[Fonts.poppinSemiBold14, {color: Colors.white}]}>
              {Platform.OS == 'android'
                ? t('common:go_to_setting')
                : 'Go to Web App'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setIsShowUserPermissionDialog(false);
              navigation.goBack();
              dispatch(storeUserCheckPermissons({}));
            }}
            style={[
              Gutters.tinyPadding,
              Layout.center,
              Gutters.xTinyPadding,
              Gutters.tinyLMargin,
              {
                backgroundColor: Colors.dark_gray_676C6A,
                borderRadius: 6,
                width: 150,
              },
            ]}>
            <Text style={[Fonts.poppinSemiBold14, {color: Colors.white}]}>
              {t('common:cancel')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={[Layout.fill, {backgroundColor: Colors.white}]}>
      <CustomHeader
        title={t('common:i_chat')}
        navigation={navigation}
        rightIcon={true}
      />
      <View style={[Layout.screen, {backgroundColor: Colors.white}]}>
        <View style={[Gutters.smallBMargin]}>
          <CustomInput
            headingText=""
            righticon={true}
            righticonSearch={true}
            righticonName="searchChat"
            placeholder={t('common:search_keywords')}
            inputProps={{
              onChangeText: t => handleSearch(t),
              placeholderTextColor: Colors.dark_gray_676C6A,
            }}
            inputStyle={[Layout.fullWidth, Fonts.poppinMed16]}
            backgroundStyle={{
              backgroundColor: Colors.white,
              borderWidth: 1,
              height: 60,
              borderColor: Colors.black_232C28,
            }}
          />
        </View>
        <View style={[Layout.fill, Layout.simpleScreen]}>
          <SwipeableList navigation={navigation} data={filteredData} />
        </View>
      </View>
      <Modal isVisible={isShowUserPermissionDialog}>
        <View style={[Layout.fill, Layout.center]}>
          {isShowUserPermissionDialog && userCheckPermissions()}
        </View>
      </Modal>
    </View>
  );
};

export default ChatListContainer;
