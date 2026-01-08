import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {useTheme} from '../../../hooks';
import {dropdownCondition} from '../../../utils/dummyData';
import {Colors} from '../../../theme/Variables';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

const Detail = () => {
  const {Layout, Fonts, Gutters} = useTheme();

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
        Layout.screenWidth,
        Layout.selfCenter,
        Gutters.tinyVMargin,
        Gutters.mediumTPadding,
        {borderColor: Colors.gray_C9C9C9},
      ]}>
      <Text style={[Fonts.poppinSemiBold22, Gutters.tinyBMargin]}>Details</Text>
      {!!selectedProductData.make &&
        renderItemDetails('Make', selectedProductData.make)}
      {!!selectedProductData?.model &&
        renderItemDetails('Model', selectedProductData?.model)}
      {selectedProductData?.condition &&
        renderItemDetails(
          'Condition',
          selectedProductData?.condition == dropdownCondition[0].value
            ? dropdownCondition[0].key
            : dropdownCondition[1].key,
        )}

      {renderItemDetails('Description', selectedProductData.description, true)}
    </View>
  );
};

export default Detail;

const styles = StyleSheet.create({
  subheading: {
    color: Colors.black_232C28,
    fontSize: 16,
    fontWeight: '500',
  },
  description: {
    color: Colors.black_232C28,
    fontSize: 14,
    fontWeight: '400',
  },
});
