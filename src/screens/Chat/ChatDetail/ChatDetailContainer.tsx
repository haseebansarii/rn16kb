import React from 'react';
import {TextInput, View} from 'react-native';

import {CustomHeader} from '../../../components';
import {useTheme} from '../../../hooks';
import {UserInfo, ProductInfo, ChatList} from '../ChatDetail';
import {useRoute} from '@react-navigation/native';
type Props = {
  navigation: any;
};

const ChatDetail = ({navigation}: Props) => {
  const {Layout, Fonts, Gutters, Colors, Images} = useTheme();
  const {params} = useRoute();

  return (
    <View style={[Layout.fill, {backgroundColor: Colors.white}]}>
      <CustomHeader
        title={t('common:i_chat')}
        navigation={navigation}
        rightIcon={true}
      />

      <UserInfo userInfor={params?.from_user} listing={params?.listing} />
      <ProductInfo productInfo={params?.listing} />
      <View style={[Layout.fill, {backgroundColor: Colors.white}]}>
        <ChatList navigation={navigation} params={params} />
      </View>
    </View>
  );
};
export default ChatDetail;
