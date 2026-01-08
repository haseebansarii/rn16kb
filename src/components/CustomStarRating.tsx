import React, {memo} from 'react';
import {View} from 'react-native';
import StarRating from 'react-native-star-rating';
import {useTheme} from '../hooks';
type Props = {
  starProps?: any;
  customStyle?: any;
  rating?: number;
  starSize: number;
};

const CustomStarRating = ({
  starProps,
  rating = 3,
  starSize,
  customStyle,
}: Props) => {
  const {Colors, Fonts, Gutters, Images, Layout} = useTheme();
  return (
    <View style={[customStyle]}>
      <StarRating
        maxStars={5}
        starSize={starSize}
        rating={rating}
        // fullStar={<Images.svg.fillStar.default />}
        // emptyStar={<Images.svg.unfillStar.default />}
        fullStarColor={Colors.primary}
        emptyStarColor={Colors.white}
        {...starProps}
      />
    </View>
  );
};

export default CustomStarRating;
