import {View, Text} from 'react-native';
import React from 'react';
import {CustomHeader} from '../../components';
import {useTheme} from '../../hooks';
import {ItemDetail, UserList} from '.';

const BuyerOffersContainer = ({navigation}: any) => {
  const {Layout, Colors, Fonts, Images, Gutters} = useTheme();
  return (
    <View style={[Layout.fill, {backgroundColor: Colors.white}]}>
      <CustomHeader
        title={`${t('common:offers_on')}`}
        navigation={navigation}
        rightIcon={true}
      />
      {/* <ItemDetail item={params} />
          <UserList
            navigation={navigation}
            id={params?.item?.id}
            title={params?.item?.title}
          /> */}
    </View>
  );
};

export default BuyerOffersContainer;
