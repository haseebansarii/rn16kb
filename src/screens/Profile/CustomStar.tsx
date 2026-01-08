import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Rating, AirbnbRating} from 'react-native-ratings';
import { Colors } from '../../theme/Variables';

const CustomStar = () => {
  return (
    <Rating
      type="custom"
      style={{paddingVertical: 5, marginLeft: -40}}
      imageSize={30}
      ratingColor={Colors.primary}
      ratingBackgroundColor='white'
     
    />
  );
};

export default CustomStar;

const styles = StyleSheet.create({});
