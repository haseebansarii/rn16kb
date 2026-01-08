import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {useTheme} from '../../../hooks';
import {Colors} from '../../../theme/Variables';
import {useNavigation} from '@react-navigation/native';

const VehicleFeatures = () => {
  const {Layout, Colors, Fonts, Gutters, Images} = useTheme();
  const navigation = useNavigation();
  const selectedProductData = useSelector(
    (state: any) => state?.list?.selectedProductData,
  );

  const [dropdownTransmission, setDropdownTransmission] = useState([
    {key: 'Automatic', value: 'auto'},
    {key: 'Manual', value: 'manual'},
  ]);
  const [dropdownDriveType, setDropdownDriveType] = useState([
    {key: 'Right-Hand Drive', value: 'right-hand'},
    {key: 'Left-Hand Drive', value: 'left-hand'},
  ]);

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

              {backgroundColor: Colors.light_grayF4F4F4, marginTop: 2},
            ]}>
            <Text style={[styles.subheading]}>{value ?? '-'}</Text>
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
        Gutters.borderBWidth,
        Gutters.borderTWidth,
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
          Features
        </Text>
        <View>
          {
            !!selectedProductData?.vehicle?.engine_size &&
              renderItemDetails(
                'Engine size',
                selectedProductData?.vehicle?.engine_size,
              )
            // <View
            //   style={[
            //     Layout.row,
            //     Layout.justifyContentBetween,
            //     Gutters.xTinyVPadding,
            //     Gutters.tinyHPadding,
            //     Layout.alignItemsCenter,
            //     {backgroundColor: Colors.light_grayF4F4F4},
            //   ]}>
            //   <View style={[{width: '45%'}]}>
            //     <Text
            //       numberOfLines={2}
            //       style={[
            //         styles.subheading,
            //         {
            //           alignSelf: 'flex-start',
            //         },
            //       ]}>
            //       Engine size
            //     </Text>
            //   </View>
            //   <Text
            //     numberOfLines={2}
            //     style={[
            //       styles.subheading,
            //       {
            //         width: '45%',
            //         alignItems: 'center',
            //         justifyContent: 'center',
            //         textAlign: 'right',
            //       },
            //     ]}>
            //     {selectedProductData?.vehicle?.engine_size ?? '-'}
            //   </Text>
            // </View>
          }
          {renderItemDetails(
            'Transmission',
            selectedProductData?.vehicle?.transmission ==
              dropdownTransmission[0].value
              ? dropdownTransmission[0].key
              : dropdownTransmission[1].key,
          )}
          {/* <View
            style={[
              Layout.row,
              Layout.justifyContentBetween,
              Layout.alignItemsCenter,

              Gutters.xTinyVPadding,
              Gutters.tinyHPadding,
            ]}>
            <View style={[{width: '45%'}]}>
              <Text
                numberOfLines={2}
                style={[
                  styles.subheading,
                  {
                    alignSelf: 'flex-start',
                  },
                ]}>
                Transmission
              </Text>
            </View>
            <Text
              numberOfLines={2}
              style={[
                styles.subheading,
                {
                  width: '45%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'right',
                },
              ]}>
              {selectedProductData?.vehicle?.transmission
                ? selectedProductData?.vehicle?.transmission ==
                  dropdownTransmission[0].value
                  ? dropdownTransmission[0].key
                  : dropdownTransmission[1].key
                : '-'}
            </Text>
          </View> */}
        </View>
        <View>
          {
            !!selectedProductData?.vehicle?.fuel_type &&
              renderItemDetails(
                'Fuel type',
                selectedProductData?.vehicle?.fuel_type,
              )
            // <View
            //   style={[
            //     Layout.row,
            //     Layout.justifyContentBetween,
            //     Gutters.xTinyVPadding,
            //     Gutters.tinyHPadding,
            //     {backgroundColor: Colors.light_grayF4F4F4},
            //   ]}>
            //   <View style={[{width: '45%'}]}>
            //     <Text
            //       numberOfLines={2}
            //       style={[
            //         styles.subheading,
            //         {
            //           alignSelf: 'flex-start',
            //         },
            //       ]}>
            //       Fuel type
            //     </Text>
            //   </View>
            //   <Text
            //     numberOfLines={2}
            //     style={[
            //       styles.subheading,
            //       {
            //         width: '45%',
            //         alignItems: 'center',
            //         justifyContent: 'center',
            //         textAlign: 'right',
            //       },
            //     ]}>
            //     {selectedProductData?.vehicle?.fuel_type ?? '-'}
            //   </Text>
            // </View>
          }
          {
            !!selectedProductData?.vehicle?.cylinders &&
              renderItemDetails(
                'Cylinders',
                selectedProductData?.vehicle?.cylinders,
              )
            // <View
            //   style={[
            //     Layout.row,
            //     Layout.justifyContentBetween,
            //     Layout.alignItemsCenter,

            //     Gutters.xTinyVPadding,
            //     Gutters.tinyHPadding,
            //   ]}>
            //   <View style={[{width: '45%'}]}>
            //     <Text
            //       numberOfLines={2}
            //       style={[
            //         styles.subheading,
            //         {
            //           alignSelf: 'flex-start',
            //         },
            //       ]}>
            //       Cylinders
            //     </Text>
            //   </View>
            //   <Text
            //     numberOfLines={2}
            //     style={[
            //       styles.subheading,
            //       {
            //         width: '45%',
            //         alignItems: 'center',
            //         justifyContent: 'center',
            //         textAlign: 'right',
            //       },
            //     ]}>
            //     {selectedProductData?.vehicle?.cylinders ?? '-'}
            //   </Text>
            // </View>
          }
        </View>
        <View>
          {/* {renderItemDetails(
            'Drive type',
            selectedProductData?.vehicle?.drive_type ==
              dropdownDriveType[0].value
              ? dropdownDriveType[0].key
              : dropdownDriveType[1].key,
          )} */}
          {/* <View
            style={[
              Layout.row,
              Layout.justifyContentBetween,
              Gutters.xTinyVPadding,
              Gutters.tinyHPadding,
              {backgroundColor: Colors.light_grayF4F4F4},
            ]}>
            <View style={[{width: '45%'}]}>
              <Text
                numberOfLines={2}
                style={[
                  styles.subheading,
                  {
                    alignSelf: 'flex-start',
                  },
                ]}>
                Drive type
              </Text>
            </View>
            <Text
              numberOfLines={2}
              style={[
                styles.subheading,
                {
                  width: '45%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'right',
                },
              ]}>
              {selectedProductData?.vehicle?.drive_type
                ? selectedProductData?.vehicle?.drive_type ==
                  dropdownDriveType[0].value
                  ? dropdownDriveType[0].key
                  : dropdownDriveType[1].key
                : '-'}
            </Text>
          </View> */}
          {
            !!selectedProductData?.vehicle?.registration_expiry &&
              renderItemDetails(
                'Registration expiry',
                selectedProductData?.vehicle?.registration_expiry,
              )
            // <View
            //   style={[
            //     Layout.row,
            //     Layout.justifyContentBetween,
            //     Layout.alignItemsCenter,

            //     Gutters.xTinyVPadding,
            //     Gutters.tinyHPadding,
            //   ]}>
            //   <View style={[{width: '45%'}]}>
            //     <Text
            //       numberOfLines={2}
            //       style={[
            //         styles.subheading,
            //         {
            //           alignSelf: 'flex-start',
            //         },
            //       ]}>
            //       Registration expiry
            //     </Text>
            //   </View>
            //   <Text
            //     numberOfLines={2}
            //     style={[
            //       styles.subheading,
            //       {
            //         width: '45%',
            //         alignItems: 'center',
            //         justifyContent: 'center',
            //         textAlign: 'right',
            //       },
            //     ]}>
            //     {selectedProductData?.vehicle?.registration_expiry ?? '-'}
            //   </Text>
            // </View>
          }
          {
            !!selectedProductData?.vehicle?.wof_expiry &&
              renderItemDetails(
                'WoF expiry',
                selectedProductData?.vehicle?.wof_expiry,
              )
            // <View
            //   style={[
            //     Layout.row,
            //     Layout.justifyContentBetween,
            //     Gutters.xTinyVPadding,
            //     Gutters.tinyHPadding,
            //     {backgroundColor: Colors.light_grayF4F4F4},
            //   ]}>
            //   <View style={[{width: '45%'}]}>
            //     <Text
            //       numberOfLines={2}
            //       style={[
            //         styles.subheading,
            //         {
            //           alignSelf: 'flex-start',
            //         },
            //       ]}>
            //       WoF expiry
            //     </Text>
            //   </View>
            //   <Text
            //     numberOfLines={2}
            //     style={[
            //       styles.subheading,
            //       {
            //         width: '45%',
            //         alignItems: 'center',
            //         justifyContent: 'center',
            //         textAlign: 'right',
            //       },
            //     ]}>
            //     {selectedProductData?.vehicle?.wof_expiry ?? '-'}
            //   </Text>
            // </View>
          }
        </View>
      </View>
    </View>
  );
};

export default VehicleFeatures;

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
