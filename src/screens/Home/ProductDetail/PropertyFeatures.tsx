import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useTheme} from '../../../hooks';
import {Colors} from '../../../theme/Variables';
import {useNavigation} from '@react-navigation/native';

const PropertyFeatures = () => {
  const {Layout, Colors, Fonts, Gutters} = useTheme();

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
            !!selectedProductData?.property?.no_of_bedrooms &&
              renderItemDetails(
                'Bedrooms',
                selectedProductData?.property?.no_of_bedrooms,
              )
            // <View
            //   style={[
            //     Layout.row,
            //     Layout.justifyContentBetween,
            //     Gutters.xTinyVPadding,
            //     Gutters.tinyHPadding,
            //     {backgroundColor: Colors.light_grayF4F4F4},
            //   ]}>
            //   <View style={[{width: '80%'}]}>
            //     <Text
            //       style={[
            //         styles.subheading,
            //         {
            //           alignSelf: 'flex-start',
            //         },
            //         {fontWeight: '600'},
            //       ]}>
            //       Bedrooms
            //     </Text>
            //   </View>
            //   <Text
            //     style={[
            //       styles.subheading,
            //       {
            //         width: '20%',
            //         alignItems: 'center',
            //         justifyContent: 'center',
            //         textAlign: 'right',
            //       },
            //     ]}>
            //     {selectedProductData?.property?.no_of_bedrooms ?? '-'}
            //   </Text>
            // </View>
          }
          {selectedProductData?.property?.no_of_bathrooms &&
            renderItemDetails(
              'Bathrooms',
              selectedProductData?.property?.no_of_bathrooms,
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
                Bathrooms
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
              {selectedProductData?.property?.no_of_bathrooms ?? '-'}
            </Text>
          </View> */}
        </View>
        <View>
          {
            !!selectedProductData?.property?.no_of_separate_toilets &&
              renderItemDetails(
                'Separate Toilets',
                selectedProductData?.property?.no_of_separate_toilets,
              )
            // <View
            //   style={[
            //     Layout.row,
            //     Layout.justifyContentBetween,
            //     Gutters.xTinyVPadding,
            //     Gutters.tinyHPadding,
            //     {backgroundColor: Colors.light_grayF4F4F4},
            //   ]}>
            //   <View style={[{width: '80%'}]}>
            //     <Text
            //       style={[
            //         styles.subheading,
            //         {
            //           alignSelf: 'flex-start',
            //         },
            //         {fontWeight: '600'},
            //       ]}>
            //       Separate Toilets
            //     </Text>
            //   </View>
            //   <Text
            //     style={[
            //       styles.subheading,
            //       {
            //         width: '20%',
            //         alignItems: 'center',
            //         justifyContent: 'center',
            //         textAlign: 'right',
            //       },
            //     ]}>
            //     {selectedProductData?.property?.no_of_separate_toilets ?? '-'}
            //   </Text>
            // </View>
          }
          {
            !!selectedProductData?.property?.no_of_ensuite_bathrooms &&
              renderItemDetails(
                'Ensuite bathrooms',
                selectedProductData?.property?.no_of_ensuite_bathrooms,
              )
            // <View
            //   style={[
            //     Layout.row,
            //     Layout.justifyContentBetween,
            //     Layout.alignItemsCenter,

            //     Gutters.xTinyVPadding,
            //     Gutters.tinyHPadding,
            //   ]}>
            //   <View style={[{width: '30%'}]}>
            //     <Text
            //       style={[
            //         styles.subheading,
            //         {
            //           alignSelf: 'flex-start',
            //         },
            //         {fontWeight: '600'},
            //       ]}>
            //       Ensuite bathrooms
            //     </Text>
            //   </View>
            //   <Text
            //     style={[
            //       styles.subheading,
            //       {
            //         width: '60%',
            //         alignItems: 'center',
            //         justifyContent: 'center',
            //         textAlign: 'right',
            //       },
            //     ]}>
            //     {selectedProductData?.property?.no_of_ensuite_bathrooms ?? '-'}
            //   </Text>
            // </View>
          }
        </View>
        <View>
          {selectedProductData?.property?.no_of_living_areas &&
            renderItemDetails(
              'Living areas / Lounges',
              selectedProductData?.property?.no_of_living_areas,
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
                  {
                    alignSelf: 'flex-start',
                  },
                  {fontWeight: '600'},
                ]}>
                Living areas / Lounges
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
              {selectedProductData?.property?.no_of_living_areas ?? '-'}
            </Text>
          </View> */}
          {selectedProductData?.property?.no_of_studies &&
            renderItemDetails(
              'Studies',
              selectedProductData?.property?.no_of_studies,
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
                Studies
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
              {selectedProductData?.property?.no_of_studies ?? '-'}
            </Text>
          </View> */}
        </View>
      </View>
    </View>
  );
};

export default PropertyFeatures;

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
