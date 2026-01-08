import React from 'react';
import {View} from 'react-native';
import {CustomHeader} from '../../components';
import {useTheme} from '../../hooks';
import CounterOfferView from './CounterOfferView';
import UserInfo from './UserInfo';
import {useRoute} from '@react-navigation/native';

type Props = {
  navigation: any;
};

const RecievedOfferDetail = ({navigation}: Props) => {
  const {Layout, Colors, Fonts, Images, Gutters} = useTheme();
  const {params} = useRoute();

  return (
    <View style={[Layout.fill, {backgroundColor: Colors.white}]}>
      <CustomHeader title={'Offers'} navigation={navigation} rightIcon={true} />

      <UserInfo params={params?.item} />
      <CounterOfferView
        params={params?.item}
        getProductOfferFunc={params?.getProductOfferFunc}
        productObj={params?.productObj}
      />
    </View>
  );
};

export default RecievedOfferDetail;
