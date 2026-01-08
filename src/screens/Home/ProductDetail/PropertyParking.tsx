import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {useSelector} from 'react-redux';
import {useTheme} from '../../../hooks';
import {Colors} from '../../../theme/Variables';
import {useNavigation} from '@react-navigation/native';

const PropertyParking = () => {
  const {Layout, Colors, Fonts, Gutters, Images} = useTheme();

  const selectedProductData = useSelector(
    (state: any) => state?.list?.selectedProductData,
  );
  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const renderItemDetails = (title, value, long) => {
    if (long) {
      // previouColorRenderGray.current = false;
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
    <View
      style={[
        Layout.fullWidth,
        Gutters.mediumVPadding,
        {borderColor: Colors.gray_C9C9C9},
      ]}>
      <View style={[Layout.screenWidth, Layout.selfCenter]}>
        <Text
          style={[
            Fonts.poppinSemiBold22,
            Gutters.tinyBMargin,
            {color: Colors.black_232C28},
          ]}>
          Parking
        </Text>
        <View>
          {renderItemDetails(
            'Garage parking',
            selectedProductData?.property?.garage_parking == true
              ? 'YES'
              : 'NO',
          )}
          {/* <View
            style={[
              Layout.row,
              Layout.justifyContentBetween,
              Gutters.xTinyVPadding,
              Gutters.tinyHPadding,
              {backgroundColor: Colors.light_grayF4F4F4},
            ]}>
            <View style={[{width: '80%'}]}>
              <Text
                style={[
                  styles.subheading,
                  {fontWeight: '600'},
                  {
                    alignSelf: 'flex-start',
                  },
                ]}>
                Garage parking
              </Text>
            </View>
            <Text
              style={[
                styles.subheading,
                {
                  width: '20%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'right',
                },
              ]}>
              {selectedProductData?.property?.garage_parking == true
                ? 'YES'
                : 'NO'}
            </Text>
          </View> */}
          {renderItemDetails(
            'Off street parking',
            selectedProductData?.property?.off_street_parking == true
              ? 'YES'
              : 'NO',
          )}
          {/* <View
            style={[
              Layout.row,
              Layout.justifyContentBetween,
              Layout.alignItemsCenter,

              Gutters.xTinyVPadding,
              Gutters.tinyHPadding,
            ]}>
            <View style={[{width: '30%'}]}>
              <Text
                style={[
                  styles.subheading,
                  {
                    alignSelf: 'flex-start',
                  },
                  {fontWeight: '600'},
                ]}>
                Off street parking
              </Text>
            </View>
            <Text
              style={[
                styles.subheading,
                {
                  width: '60%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'right',
                },
              ]}>
              {selectedProductData?.property?.off_street_parking == true
                ? 'YES'
                : 'NO'}
            </Text>
          </View> */}
          {
            !!selectedProductData?.property?.parking_details &&
              renderItemDetails(
                'Additional details about parking or garaging',
                selectedProductData?.property?.parking_details,
                true,
              )
            // <View>
            //   <View
            //     style={[
            //       Layout.row,
            //       Layout.justifyContentBetween,
            //       Gutters.xTinyVPadding,
            //       Gutters.tinyHPadding,
            //       {backgroundColor: Colors.light_grayF4F4F4},
            //     ]}>
            //     <Text style={[styles.subheading, {fontWeight: '600'}]}>
            //       Additional details about parking or garaging
            //     </Text>
            //   </View>
            //   <View
            //     style={[
            //       Layout.row,
            //       Layout.justifyContentBetween,
            //       Gutters.xTinyVPadding,
            //       Gutters.tinyHPadding,
            //     ]}>
            //     <Text style={[styles.subheading]}>
            //       {selectedProductData?.property?.parking_details ?? '-'}
            //     </Text>
            //   </View>
            // </View>
          }
        </View>
      </View>
    </View>
  );
};

export default PropertyParking;

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
