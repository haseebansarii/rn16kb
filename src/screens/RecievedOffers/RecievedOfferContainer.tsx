import {useRoute} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import {ItemDetail, UserList} from '.';
import {CustomHeader} from '../../components';
import {useTheme} from '../../hooks';

type Props = {
  navigation: any;
};

const RecievedOfferContainer = ({navigation}: Props) => {
  const {Layout, Colors, Fonts, Images, Gutters} = useTheme();
  const {params} = useRoute();

  return (
    <View style={[Layout.fill, {backgroundColor: Colors.white}]}>
      <CustomHeader title={'Offers'} navigation={navigation} rightIcon={true} />
      <ItemDetail item={params} />
      <UserList
        navigation={navigation}
        id={params?.item?.id}
        title={params?.item?.title}
      />
    </View>
  );
};

export default RecievedOfferContainer;
