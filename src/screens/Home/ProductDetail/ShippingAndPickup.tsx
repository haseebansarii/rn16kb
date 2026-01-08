import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {useSelector} from 'react-redux';
import {useTheme} from '../../../hooks';
import {Colors} from '../../../theme/Variables';
import locationImg from '../../../theme/assets/images/placeholder.png';

const ShippingAndPickup = () => {
  const {Layout, Colors, Fonts, Gutters, Images} = useTheme();

  const selectedProductData = useSelector(
    (state: any) => state?.list?.selectedProductData,
  );
  return (
    <View
      style={[
        Layout.fullWidth,
        selectedProductData?.pickup_location_coordinates?.lat !== null &&
          selectedProductData?.pickup_location_coordinates?.lng &&
          Gutters.borderTWidth,
        selectedProductData?.pickup_location_coordinates?.lat !== null &&
          selectedProductData?.pickup_location_coordinates?.lng &&
          Gutters.borderBWidth,
        Gutters.mediumVPadding,
        {borderColor: Colors.gray_C9C9C9},
      ]}>
      {selectedProductData?.pickup_location_coordinates?.lat !== null &&
        selectedProductData?.pickup_location_coordinates?.lng && (
          <View style={[Layout.screenWidth, Layout.selfCenter]}>
            <Text
              style={[
                Fonts.poppinSemiBold20,
                Gutters.smallBMargin,
                {color: Colors.black_232C28},
              ]}>
              {selectedProductData?.listing_type == 'property'
                ? 'Location'
                : selectedProductData?.listing_type == 'vehicle'
                ? "Seller's Location"
                : t('shiping_and_pickup')}
            </Text>
            {selectedProductData?.pickup_location_coordinates?.lat !== null &&
              selectedProductData?.pickup_location_coordinates?.lng && (
                <View style={[{height: 150}]}>
                  <MapView
                    // ref={mapRef}
                    style={{...StyleSheet.absoluteFillObject}}
                    // provider={PROVIDER_GOOGLE}
                    loadingEnabled={true}
                    showsUserLocation={true}
                    showsCompass={true}
                    zoomEnabled={false}
                    zoomTapEnabled={true}
                    zoomControlEnabled={true}
                    scrollEnabled={true}
                    cacheEnabled={false}
                    initialRegion={{
                      latitude: parseFloat(
                        selectedProductData?.pickup_location_coordinates?.lat,
                      ),
                      longitude: parseFloat(
                        selectedProductData?.pickup_location_coordinates?.lng,
                      ),
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}>
                    <Marker
                      coordinate={{
                        latitude: parseFloat(
                          selectedProductData?.pickup_location_coordinates?.lat,
                        ),
                        longitude: parseFloat(
                          selectedProductData?.pickup_location_coordinates?.lng,
                        ),
                      }}
                      image={locationImg}
                    />
                  </MapView>
                </View>
              )}
            <View style={[Layout.fill]}>
              <Text
                style={[
                  {color: Colors.black_232C28, fontSize: 14, fontWeight: '500'},
                ]}>
                {selectedProductData?.pickup_location ?? '-'}
              </Text>
              <Text style={[{color: Colors.dark_gray_676C6A, fontSize: 14}]}>
                {t('location_is_approximate')}
              </Text>
            </View>
          </View>
        )}
      {selectedProductData?.listing_type != 'property' && (
        <View
          style={[
            Layout.fullWidth,
            Gutters.borderTWidth,
            Gutters.xTinyTMargin,
            Gutters.smallTPadding,
            {borderColor: Colors.gray_C9C9C9},
          ]}>
          <View style={[Layout.screenWidth, Layout.selfCenter]}>
            <Text style={[Fonts.poppinSemiBold22]}>{t('shipping')}</Text>
            <FlatList
              data={selectedProductData?.shipping_methods || []}
              renderItem={({item, index}) => {
                return (
                  <View
                    style={[
                      Layout.row,
                      Layout.justifyContentBetween,
                      Gutters.xTinyVPadding,
                    ]}>
                    <Text style={[styles.subheading]}>{item?.option_name}</Text>
                    {item?.amount ? (
                      <Text style={[styles.subheading]}>
                        {item?.amount
                          ? t('common:nz') + ' ' + item?.amount
                          : '-'}
                      </Text>
                    ) : (
                      <Images.svg.TickRound.default
                        fill={Colors.primary}
                        width={24}
                        height={24}
                      />
                    )}
                  </View>
                );
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default ShippingAndPickup;

const styles = StyleSheet.create({
  locationText: {
    color: Colors.black_232C28,
    fontSize: 14,
    fontWeight: '400',
  },
  subheading: {color: Colors.black_232C28, fontSize: 16, fontWeight: '500'},
  description: {
    color: Colors.black_232C28,
    fontSize: 14,
    fontWeight: '400',
  },
});
