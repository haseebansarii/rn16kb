import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import React, {useEffect} from 'react';
import {useTheme} from '../../../hooks';
import {BidHistory, MakeOffer, SellerAccount, ShippingAndPickup} from '.';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../store/store';
import {useLazyGetSelectedProductDataQuery} from '../../../services/modules/Listings/getSelectedProductData';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import BuyingDetailProperty from './BuyingDetailProperty';
import PropertyFeatures from './PropertyFeatures';
import PropertyParking from './PropertyParking';
import {Colors} from '../../../theme/Variables';
import {showUserAlert} from '../../../utils/helpers';
import {allMessages, setAllUserMessages} from '../../../store/chats/chats';
import {sWidth} from '../../../utils/ScreenDimentions';
import AgentCard from './AgentCard';
import BrandCard from './BrandCard';
import {formatExternalLink} from './formatLink';
import {useUpdateViewsMutation} from '../../../services/modules/Listings/getSingleListing';

const PropertyProductComponent = () => {
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
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const update = async () => {
      updateViews(selected_product?._id);
    };

    update();
  }, []);

  const renderItemDetails = (title, value, long) => {
    if (long) {
      return (
        <View>
          <View
            style={[
              Layout.row,
              Layout.justifyContentBetween,
              Gutters.xTinyVPadding,
            ]}>
            <Text style={[styles.subheading]}>{title}</Text>
          </View>
          <View
            style={[
              Layout.row,
              Layout.justifyContentBetween,
              Gutters.xTinyVPadding,
            ]}>
            <Text style={[styles.description]}>{value ?? '-'}</Text>
          </View>
        </View>
      );
    } else {
      return (
        <View
          style={[
            Layout.row,
            Layout.justifyContentBetween,
            Gutters.xTinyVPadding,
          ]}>
          <Text style={[styles.subheading, {textTransform: 'none'}]}>
            {title}
          </Text>
          <Text style={[styles.subheading, {maxWidth: '50%'}]}>
            {value ?? '-'}
          </Text>
        </View>
      );
    }
  };

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
        <BuyingDetailProperty />

        {
          // selectedProductData?.status == 'sold' &&
          // selectedProductData?.buyer?._id == user_data?._id
          //   ? null
          //   :
          selectedProductData?.make_an_offer && <MakeOffer />
        }

        {selectedProductData?.type === 'auction' ? <BidHistory /> : null}

        {selectedProductData?.listing_type != 'property' &&
          selectedProductData?.fixed_price_offer &&
          selectedProductData?.end_date && (
            <View
              style={[
                Layout.row,
                Layout.screenWidth,
                Layout.selfCenter,
                Layout.alignItemsCenter,
                Gutters.xTinyVMargin,
                Layout.justifyContentBetween,
              ]}>
              <View style={[Layout.row]}>
                <Images.svg.Clock.default />
                <Text
                  style={[
                    Gutters.littleLMargin,
                    Fonts.poppinMed14,
                    {color: Colors.black_232C28},
                  ]}>
                  Close Time:
                </Text>
              </View>
              <View
                style={[
                  Gutters.tinyLMargin,
                  Gutters.littleTMargin,

                  {marginTop: -1},
                ]}>
                <Text style={[Fonts.poppinMed14, {color: Colors.black_232C28}]}>
                  {!!selectedProductData?.end_date
                    ? ` ${moment(selectedProductData?.end_date).format(
                        'ddd, DD MMM hh:mm a',
                      )}`
                    : '-'}
                </Text>
              </View>
            </View>
          )}

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

        <PropertyFeatures />

        <PropertyParking />

        <View
          style={[
            Layout.fullWidth,
            Gutters.borderTWidth,
            Gutters.mediumVPadding,
            Gutters.xTinyTMargin,
            {borderColor: Colors.gray_C9C9C9},
          ]}>
          <View style={[Layout.screenWidth, Layout.selfCenter]}>
            <Text
              style={[
                Fonts.poppinSemiBold22,
                Gutters.tinyBMargin,
                {color: Colors.black_232C28},
              ]}>
              Property description
            </Text>
            <View>
              {renderItemDetails(
                'Pets Ok',
                selectedProductData?.property?.pets_ok,
              )}
              {renderItemDetails(
                'Smokers Ok',
                selectedProductData?.property?.smokers_ok,
              )}
              {!!selectedProductData?.property?.furnishings_n_whiteware &&
                renderItemDetails(
                  'Furnishings & whiteware',
                  selectedProductData?.property?.furnishings_n_whiteware,
                  true,
                )}
              {!!selectedProductData?.property?.amenities_in_area &&
                renderItemDetails(
                  'Amenities in this area',
                  selectedProductData?.property?.amenities_in_area,
                  true,
                )}
              {!!selectedProductData?.property?.ideal_tenants &&
                renderItemDetails(
                  'Your ideal tenants',
                  selectedProductData?.property?.ideal_tenants,
                  true,
                )}
            </View>
          </View>
        </View>

        <View
          style={[
            Layout.fullWidth,
            Gutters.borderTWidth,
            Gutters.mediumVPadding,
            Gutters.xTinyTMargin,
            {borderColor: Colors.gray_C9C9C9},
          ]}>
          <View style={[Layout.screenWidth, Layout.selfCenter]}>
            <Text
              style={[
                Fonts.poppinSemiBold22,
                Gutters.tinyBMargin,
                {color: Colors.black_232C28},
              ]}>
              Property Information
            </Text>
            <View>
              {!!selectedProductData?.property?.youtube_video_url &&
                renderItemDetails(
                  'Youtube Video',
                  selectedProductData?.property?.youtube_video_url,
                )}
              {!!selectedProductData?.property?.three_d_tour_url &&
                renderItemDetails(
                  '3D tour URL',
                  selectedProductData?.property?.three_d_tour_url,
                )}
              {!!selectedProductData?.description &&
                renderItemDetails(
                  'About this property',
                  selectedProductData?.description,
                  true,
                )}
            </View>
          </View>
        </View>

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

        <View
          style={[
            Layout.screenWidth,
            Layout.selfCenter,
            Gutters.tinyBMargin,
            Gutters.mediumTMargin,
          ]}>
          <Text style={[Fonts.poppinSemiBold22, Gutters.tinyBMargin]}>
            Details
          </Text>
          {!!selectedProductData?.property?.mobile_number &&
            renderItemDetails(
              'Mobile',
              selectedProductData?.property?.mobile_number,
            )}
          {!!selectedProductData?.property?.home &&
            renderItemDetails('Home', selectedProductData?.property?.home)}
          {!!selectedProductData?.property?.best_contact_time &&
            renderItemDetails(
              'Best contact time',
              selectedProductData?.property?.best_contact_time,
            )}
        </View>

        <ShippingAndPickup />

        {/* <View
          style={[
            Layout.screenWidth,
            Layout.selfCenter,
            Gutters.tinyBMargin,
            Gutters.smallTMargin,
          ]}>
          <Text style={[Fonts.poppinSemiBold16, Gutters.tinyBMargin]}>
            Are you a registered property agent?
          </Text>
          <View
            style={[Layout.row, Gutters.xTinyBMargin, Gutters.littleTMargin]}>
            <View
              style={{
                height: 25,
                width: 25,
                borderRadius: 25 / 2,
                borderWidth: 2,
                borderColor: !!selectedProductData?.property
                  ?.registered_property_agent
                  ? Colors.primary
                  : Colors.black_232C28,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  height: 15,
                  width: 15,
                  borderRadius: 15 / 2,
                  backgroundColor: !!selectedProductData?.property
                    ?.registered_property_agent
                    ? Colors.primary
                    : 'transparent',
                }}></View>
            </View>
            <Text
              style={[
                Fonts.poppinMed16,
                Gutters.tinyLMargin,
                Gutters.smallRMargin,
              ]}>
              Yes
            </Text>
            <View
              style={{
                height: 25,
                width: 25,
                borderRadius: 25 / 2,
                borderWidth: 2,
                borderColor: !selectedProductData?.property
                  ?.registered_property_agent
                  ? Colors.primary
                  : Colors.black_232C28,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  height: 15,
                  width: 15,
                  borderRadius: 15 / 2,
                  backgroundColor: !selectedProductData?.property
                    ?.registered_property_agent
                    ? Colors.primary
                    : 'transparent',
                }}></View>
            </View>
            <Text
              style={[
                Fonts.poppinMed16,
                Gutters.tinyLMargin,
                Gutters.smallRMargin,
              ]}>
              No
            </Text>
          </View>
          {!!selectedProductData?.property?.agent_name &&
            renderItemDetails(
              'Agent name',
              selectedProductData?.property?.agent_name,
            )}
          {!!selectedProductData?.property?.agency_name &&
            renderItemDetails(
              'Agency name',
              selectedProductData?.property?.agency_name,
            )}
        </View> */}

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
      {selectedProductData?.user?._id != user_data?._id && (
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
                  selectedProductData?.buyer ?? selectedProductData?.user,
              });
            }}
            style={[
              Gutters.smallHPadding,
              Layout.center,
              Gutters.tinyRadius,
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
              Message Seller
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default PropertyProductComponent;

const styles = StyleSheet.create({
  subheading: {
    color: Colors.black_232C28,
    fontSize: 16,
    fontWeight: '500',
    // textTransform: 'capitalize',
  },
  description: {
    color: Colors.black_232C28,
    fontSize: 14,
    fontWeight: '400',
  },
});
