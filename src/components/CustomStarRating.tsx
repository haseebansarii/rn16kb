import React, {memo, useState, useCallback} from 'react';
import {View, Text, TouchableOpacity, Animated} from 'react-native';
import {useTheme} from '../hooks';

type Props = {
  starProps?: any;
  customStyle?: any;
  rating?: number;
  starSize?: number;
  maxStars?: number;
  disabled?: boolean;
  fullStarColor?: string;
  emptyStarColor?: string;
  onStarPress?: (rating: number) => void;
  showRating?: boolean;
  ratingTextStyle?: any;
  halfStarEnabled?: boolean;
  selectedStar?: (position: number) => void;
};

const CustomStarRating = ({
  starProps,
  rating = 0,
  starSize = 20,
  maxStars = 5,
  disabled = false,
  fullStarColor,
  emptyStarColor,
  onStarPress,
  showRating = false,
  ratingTextStyle,
  customStyle,
  halfStarEnabled = true,
  selectedStar,
}: Props) => {
  const {Colors, Fonts, Gutters, Images, Layout} = useTheme();
  const [currentRating, setCurrentRating] = useState(rating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarPress = useCallback(
    (starIndex: number, isLeftHalf: boolean = false) => {
      if (disabled) return;

      let newRating = starIndex + 1;

      // If half stars are enabled and we're pressing the left half of a star
      if (halfStarEnabled && isLeftHalf) {
        newRating = starIndex + 0.5;
      }

      setCurrentRating(newRating);

      if (onStarPress) {
        onStarPress(newRating);
      }
      if (selectedStar) {
        selectedStar(newRating);
      }
    },
    [disabled, onStarPress, selectedStar, halfStarEnabled],
  );

  const handleStarHover = useCallback(
    (starIndex: number) => {
      if (disabled) return;
      setHoverRating(starIndex + 1);
    },
    [disabled],
  );

  const handleStarLeave = useCallback(() => {
    if (disabled) return;
    setHoverRating(0);
  }, [disabled]);

  const renderStar = (index: number) => {
    const fullColor = fullStarColor ?? Colors.primary;
    const emptyColor = emptyStarColor ?? Colors.gray_C9C9C9;

    // Use hover rating if available, otherwise use current rating
    const displayRating = hoverRating || currentRating;
    const starPosition = index + 1;

    // Determine if star should be full, half, or empty
    const isFullStar = starPosition <= Math.floor(displayRating);
    const isHalfStar =
      halfStarEnabled &&
      starPosition === Math.ceil(displayRating) &&
      displayRating % 1 !== 0;
    const isEmptyStar = !isFullStar && !isHalfStar;

    return (
      <TouchableOpacity
        disabled={disabled}
        onPress={() => handleStarPress(index)}
        onPressIn={() => handleStarHover(index)}
        onPressOut={handleStarLeave}
        activeOpacity={disabled ? 1 : 0.7}
        style={[
          {
            minWidth: starSize, // Ensure adequate touch area
            minHeight: starSize,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        {isHalfStar ? (
          <View
            style={{position: 'relative', width: starSize, height: starSize}}>
            {/* Half star - empty part */}
            <Text
              style={[
                {
                  fontSize: starSize,
                  color: emptyColor,
                  textAlign: 'center',
                  position: 'absolute',
                },
              ]}>
              ★
            </Text>
            {/* Half star - filled part */}
            <View
              style={{
                position: 'absolute',
                width: starSize / 2,
                height: starSize,
                overflow: 'hidden',
              }}>
              <Text
                style={[
                  {
                    fontSize: starSize,
                    color: fullColor,
                    textAlign: 'center',
                  },
                ]}>
                ★
              </Text>
            </View>
            {/* Touch areas for half star selection */}
            {halfStarEnabled && !disabled && (
              <>
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: starSize / 2,
                    height: starSize,
                    zIndex: 1,
                  }}
                  onPress={() => handleStarPress(index, true)}
                  activeOpacity={0.7}
                />
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    width: starSize / 2,
                    height: starSize,
                    zIndex: 1,
                  }}
                  onPress={() => handleStarPress(index, false)}
                  activeOpacity={0.7}
                />
              </>
            )}
          </View>
        ) : (
          <Text
            style={[
              {
                fontSize: starSize,
                color: isFullStar ? fullColor : emptyColor,
                textAlign: 'center',
              },
            ]}>
            ★
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[Layout.row, Layout.alignItemsCenter, customStyle]}>
      {Array.from({length: maxStars}).map((_, index) => renderStar(index))}
    </View>
  );
};

export default memo(CustomStarRating);
