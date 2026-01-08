import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {CustomFastImage, CustomPageLoading} from '../../components';
import {useTheme} from '../../hooks';
import {useLazyProductOffersQuery} from '../../services/iSell/Offers';
import {setClearProductOffer} from '../../store/iSell';
import {API_URL} from '../../config';
import {getURLPhoto} from '../../utils/helpers';
import {useFocusEffect, useRoute} from '@react-navigation/native';

type Props = {
  navigation: any;
  id: string;
  title: string;
};

const UserList = ({navigation, title, id}: Props) => {
  const {Layout, Colors, Fonts, Images, Gutters} = useTheme();

  const [getProductOffers, {isLoading}] = useLazyProductOffersQuery();
  const dispatch = useDispatch();
  const productOffers = useSelector(state => state.productOffer?.productOffers);
  const [refreshing, setRefreshing] = useState(false);
  const {params} = useRoute();

  const getProductOfferFunc = async () => {
    // console.log('============ product function called ==========', id);
    await getProductOffers(id);
  };
  useEffect(() => {
    getData();
    return () => {
      dispatch(setClearProductOffer([]));
    };
  }, []);
  useFocusEffect(
    useCallback(() => {
      getData();
      // If needed, return a cleanup function
      return () => {};
    }, []),
  );

  const getData = async () => {
    await getProductOfferFunc().finally(() => setRefreshing(false));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    getData();
  };
  const renderItemOffer = ({item, index}: any) => {
    const {buyer, offers} = item;

    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.8}
        onPress={() => {
          let productObj = params?.item;
          navigation.navigate('RecievedOfferDetail', {
            item,
            title,
            productObj,
            getProductOfferFunc,
          });
        }}
        style={[
          Layout.overflow,
          Layout.row,
          Layout.justifyContentBetween,
          Layout.alignItemsCenter,

          {
            borderTopWidth: 1,
            borderColor: Colors.gray_C9C9C9,
          },
        ]}>
        <View
          style={[
            Layout.justifyContentBetween,
            Layout.alignItemsCenter,
            Layout.overflow,
            {
              borderWidth: 2,
              borderColor: Colors.primary,
              borderRadius: 100,
            },
          ]}>
          <CustomFastImage
            url={
              buyer?.photo == null
                ? require('../../theme/assets/images/user.png')
                : getURLPhoto(buyer?.photo?.name)
            }
            resizeMode="cover"
            customStyle={[
              {
                width: 57,
                height: 57,
                borderRadius: 57 / 2,
              },
            ]}
          />
        </View>
        <View style={[Layout.fullWidth, Gutters.xTinyPadding]}>
          <Text style={[Fonts.poppinMed18, {color: Colors.black_232C28}]}>
            {buyer?.first_name} {buyer?.last_name} ({' '}
            <Text style={[{color: Colors.primary}]}>
              {offers.length}
              <Text style={[{color: Colors.red_E34040}]}>*</Text>
            </Text>
            )
          </Text>
          <Text
            style={[
              Fonts.poppinReg14,
              Gutters.littleTMargin,
              {color: Colors.primary},
            ]}>
            {t('common:made_an_offer_of')}{' '}
            <Text style={[Fonts.poppinMed16, {color: Colors.black_232C28}]}>
              {`${t('common:nz')} ${offers[offers.length - 1]?.amount}.00`}
            </Text>
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[Layout.fill, Gutters.tinyVMargin]}>
      {isLoading ? (
        <CustomPageLoading />
      ) : (
        <FlatList
          extraData={productOffers?.offers}
          data={productOffers?.offers}
          showsVerticalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={[Layout.fullWidth, Gutters.smallPadding]}
          ItemSeparatorComponent={() => <View style={[Gutters.tinyBMargin]} />}
          renderItem={renderItemOffer as CallableFunction}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.primary]}
            />
          }
        />
      )}
    </View>
  );
};

export default UserList;
