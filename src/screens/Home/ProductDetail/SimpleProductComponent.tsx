import {View, Text, ScrollView, TouchableOpacity, Linking} from 'react-native';
import React, {useEffect} from 'react';
import {useTheme} from '../../../hooks';
import {
  BidAndBuyDetail,
  BidHistory,
  Detail,
  MakeOffer,
  PaymentOption,
  SellerAccount,
  ShippingAndPickup,
} from '.';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../store/store';
import {useLazyGetSelectedProductDataQuery} from '../../../services/modules/Listings/getSelectedProductData';
import {useNavigation} from '@react-navigation/native';
import {showUserAlert} from '../../../utils/helpers';
import {allMessages, setAllUserMessages} from '../../../store/chats/chats';
import AuctionWinnerDialog from './AuctionWinnerDialog';
import {sWidth} from '../../../utils/ScreenDimentions';
import AgentCard from './AgentCard';
import BrandCard from './BrandCard';
import {formatExternalLink} from './formatLink';
import {useUpdateViewsMutation} from '../../../services/modules/Listings/getSingleListing';

const SimpleProductComponent = () => {
  const {Layout, Colors, Fonts, Gutters, Images} = useTheme();
  const [updateViews] = useUpdateViewsMutation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const selected_product = useSelector(
    (state: RootState) => state.product?.selected_product,
  );
  const user_data = useSelector((state: RootState) => state.auth?.user_data);
  const token = useSelector((state: RootState) => state.auth?.token);
  const [getSelectedProductData, {isLoading}] =
    useLazyGetSelectedProductDataQuery();
  const selectedProductData = useSelector(
    (state: any) => state?.list?.selectedProductData,
  );

  const getData = async () => {
    await getSelectedProductData({
      product_id: selected_product?._id,
    });
  };
  useEffect(() => {
    getData();
  }, [selected_product]);

  useEffect(() => {
    const update = async () => {
      updateViews(selected_product?._id);
    };

    update();
  }, []);

  return (
    <View style={[Layout.fill]}>
      <ScrollView style={[Layout.fill]}>
        <Text
          style={[
            Gutters.smallLMargin,
            Fonts.poppinSemiBold12,
            {color: Colors.dark_gray_676C6A, marginRight: 2},
          ]}>
          {selectedProductData.listing_views} views
        </Text>
        <BidAndBuyDetail />

        {
          // selectedProductData?.status !== 'sold' &&
          //   selectedProductData?.user?._id != user_data?._id &&
          selectedProductData?.make_an_offer &&
            selectedProductData?.status != 'sold' && <MakeOffer />
        }
        {selectedProductData?.type === 'auction' &&
          selectedProductData?.status == 'sold' &&
          selectedProductData?.buyer?._id === user_data?._id && (
            <AuctionWinnerDialog />
          )}
        {selectedProductData?.type === 'auction' && <BidHistory />}

        {selectedProductData?.user?.branding?.link && (
          <View
            style={[
              Layout.screenWidth,
              Layout.selfCenter,
              Layout.justifyContentBetween,
              Gutters.tinyVMargin,
            ]}>
            <Text style={[Fonts.poppinMed18, Gutters.tinyBMargin]}>
              Website
            </Text>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(
                  formatExternalLink(selectedProductData?.user?.branding?.link),
                );
              }}>
              <Text style={[Fonts.poppinMed16]}>
                {selectedProductData?.user?.branding?.link}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <Detail />
        <View style={[Layout.screenWidth, Layout.selfCenter, {gap: 20}]}>
          {selectedProductData?.defaultAgents?.map(v => (
            <AgentCard
              agent={v}
              logo={selectedProductData?.user?.branding?.logo}
            />
          ))}
          {selectedProductData?.agents?.map(v => (
            <AgentCard
              agent={v}
              logo={selectedProductData?.user?.branding?.logo}
            />
          ))}
          {selectedProductData?.user?.branding?.name && (
            <BrandCard branding={selectedProductData.user.branding} />
          )}
        </View>
        <ShippingAndPickup />
        <PaymentOption />
        <View
          style={[
            Layout.screenWidth,
            Layout.selfCenter,
            Gutters.tinyTMargin,
            Gutters.largeBMargin,
          ]}>
          <Text
            style={[
              Fonts.poppinSemiBold20,
              Gutters.tinyBMargin,
              {color: Colors.black_232C28},
            ]}>
            Seller
          </Text>
          <SellerAccount />
        </View>
      </ScrollView>
      {selectedProductData?.user?._id != user_data?._id ||
      selectedProductData?.status == 'sold' ? (
        <View
          style={[
            Layout.row,
            Layout.center,
            {height: 100, backgroundColor: Colors.black_232C28},
          ]}>
          <TouchableOpacity
            onPress={() => {
              if (token == null) {
                showUserAlert(navigation);
                return;
              }
              dispatch(setAllUserMessages([{}]));
              dispatch(allMessages([]));
              navigation.navigate('ChatDetail', {
                listing: selectedProductData,
                seller_id: selectedProductData?.user?._id,
                from_user:
                  selectedProductData?.user?._id != user_data?._id
                    ? selectedProductData?.user
                    : selectedProductData?.buyer,
              });
            }}
            style={[
              Gutters.smallHPadding,
              Layout.center,
              Gutters.tinyRadius,
              Gutters.xTinyRMargin,
              Layout.row,
              {
                height: 50,
                backgroundColor: Colors.white,
                width: sWidth(100) - 40,
              },
            ]}>
            <View style={[Gutters.littleRMargin, {opacity: 1}]}>
              <Images.svg.chatMessages.default
                // fill={Colors.black}
                height={25}
                width={25}
              />
            </View>
            <Text
              style={[Fonts.poppinSemiBold18, {color: Colors.black_232C28}]}>
              {selectedProductData?.user?._id != user_data?._id
                ? 'Message Seller'
                : 'Message Buyer'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};

export default SimpleProductComponent;
