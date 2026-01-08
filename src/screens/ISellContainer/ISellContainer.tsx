import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  CustomHeader,
  CustomLoading,
  CustomMenu,
  CustomPageLoading,
  TextMedium,
  TextSemiBold,
} from '../../components';
import {useTheme} from '../../hooks';
import {useLazyGetListDataQuery} from '../../services/modules/Listings/getList';
import CustomCard from './CustomCard';
import {selectedProduct} from '../../store/productDetail/ProductDetailSlice';
import {sHight} from '../../utils/ScreenDimentions';
import {setSelectedProductData} from '../../store/Listings';
import {useIsFocused} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';

type Props = {
  navigation: any;
  route?: any;
};

const ISellContainer = ({navigation, route}: Props) => {
  const {Layout, Colors, Fonts, Images, Gutters} = useTheme();
  const [selected, setSelected] = useState(
    route?.params?.selectedTab ? route?.params?.selectedTab : 0,
  );
  const [getListData, {isLoading: isLoadingGetData}] =
    useLazyGetListDataQuery();
  const [isLoading, setIsLoading] = useState(false);
  const listData = useSelector((state: any) => state?.list?.listData);
  const [refreshing, setRefreshing] = useState(false);
  const [activeListing, setActiveListing] = useState([]);
  const [endedListing, setEndedListing] = useState([]);

  const getData = async () => {
    await getListData({
      pageName: 'isell',
    }).finally(() => {
      setRefreshing(false);
      setIsLoading(false);
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    getData();
  };

  const onDeleteSuccess = id => {
    setEndedListing(listData?.items?.filter(item => item?.id !== id));
  };

  useEffect(() => {
    setIsLoading(true);
    getData();
  }, []);
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      getData();
    }
  }, [isFocused]);
  useEffect(() => {
    setActiveListing(
      listData?.items?.filter(item => item?.status === 'active' && item) || [],
    );
    setEndedListing(
      listData?.items?.filter(
        item =>
          item?.status === 'sold' ||
          item?.status === 'withdrawn' ||
          (item?.status === 'expired' && item),
      ) || [],
    );
  }, [listData?.items]);

  const dispatch = useDispatch();

  return (
    <View style={[Layout.fill, {backgroundColor: Colors.white}]}>
      <CustomHeader
        title={`${t('common:isell')}`}
        navigation={navigation}
        rightIcon={true}>
        <View style={[Layout['fill']]}>
          <TextMedium
            text={`(${listData?.items?.length || 0})`}
            textStyle={[Fonts.poppinMed16, {color: Colors.black_232C28}]}
          />
        </View>
      </CustomHeader>
      <View style={[Layout.screenWidth, Layout.selfCenter]}>
        <CustomMenu
          data={[
            {key: t('common:active'), valaue: '0'},
            {key: t('common:ended'), valaue: '1'},
          ]}
          selected={selected}
          setSelected={setSelected}
        />
      </View>
      <View style={[Layout.fill, Gutters.smallTPadding]}>
        <FlashList
          extraData={activeListing || endedListing || []}
          showsVerticalScrollIndicator={false}
          data={
            selected === 0 ? activeListing : endedListing ? endedListing : []
          }
          renderItem={({item, index}) => {
            const {
              images,
              title,
              buy_now_price,
              start_price,
              offers_count,
              end_date,
              type,
              listing_type,
              status,
              is_favourite,
              _id,
            } = item;
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  dispatch(selectedProduct({...item, index: index}));
                  dispatch(setSelectedProductData({}));
                  navigation.navigate('ProductDetailContainer' as never);
                }}>
                <CustomCard
                  item={item}
                  key={index}
                  id={_id}
                  type={type}
                  is_favourite={is_favourite}
                  closingDate={moment(end_date).format('DD MMM YYYY')}
                  showTriangleImage={true}
                  image={images && images[0]?.name}
                  offerCount={offers_count}
                  listing_type={listing_type}
                  startingPrice={start_price == null ? '0' : start_price}
                  buyNowPrice={buy_now_price}
                  title={title}
                  selected={selected}
                  status={status}
                  index={item?.index}
                  getData={getData}
                  onDeleteSuccess={onDeleteSuccess}
                />
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={() =>
            !isLoading && (
              <View style={[Layout.fill, Layout.center, {height: sHight(55)}]}>
                <TextSemiBold
                  text="No data found"
                  textStyle={[
                    Fonts.poppinSemiBold20,
                    {color: Colors.black_232C28},
                  ]}
                />
              </View>
            )
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.primary]}
            />
          }
          estimatedItemSize={439}
          removeClippedSubviews
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0.3}
        />
      </View>
      <CustomLoading isLoading={isLoading || isLoadingGetData} />
    </View>
  );
};

export default ISellContainer;
