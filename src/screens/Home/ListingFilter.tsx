import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useTheme} from '../../hooks';
import {listing_filter_list} from '../../utils/dummyData';

const ListingFilter = () => {
  const {Layout, Gutters, Colors, Fonts} = useTheme();
  const [selected, setSelected] = useState(0);
  const memoizedCallback = useCallback(
    (item: any) => {
      return <RenderItem {...item} />;
    },
    [selected],
  );

  const RenderItem = ({item, index}: any) => {
    return (
      <TouchableOpacity
        onPress={() => setSelected(index)}
        style={[
          Layout.alignItemsCenter,
          Gutters.littleTMargin,
          Gutters.tinyRMargin,
          Gutters.tinyVPadding,
          Gutters.smallHPadding,
          Gutters.borderWidth,
          Gutters.littleRadius,
          {
            backgroundColor:
              selected == index ? Colors.lightGreen_DBF5EC : Colors.transparent,
            borderColor:
              selected == index ? Colors.primary : Colors.dark_gray_676C6A,
          },
        ]}>
        <Text
          numberOfLines={2}
          style={[
            Fonts.poppinMed12,
            Layout.alignSelf,
            {
              textAlign: 'center',
              color: selected == index ? Colors.primary : Colors.black_232C28,
            },
          ]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={listing_filter_list}
        renderItem={memoizedCallback as any}
        estimatedItemSize={10}
      />
    </View>
  );
};

export default ListingFilter;
