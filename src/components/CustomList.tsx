import {ReactNode, memo} from 'react';
import {Dimensions, FlatList, View} from 'react-native';
import {useTheme} from '../hooks';

type Props = {
  data: Array<object>;
  renderItem: ReactNode;
  listProps?: any;
};

const ITEM_HEIGHT = Dimensions.get('window').height;
const CustomList = ({data, listProps, renderItem}: Props) => {
  const {Layout, Fonts, Gutters, Colors, Images} = useTheme();
  return (
    <View style={[Layout.fill]}>
      <FlatList
        scrollEnabled={true}
        extraData={data}
        data={data}
        {...listProps}
        // inverted
        showsHorizontalScrollIndicator={false}
        // automaticallyAdjustContentInsets={true}
        // removeClippedSubviews={true}
        //  enableEmptySections={true}
        // getItemLayout={(data, index) => ({
        //   length: ITEM_HEIGHT,
        //   offset: ITEM_HEIGHT * index,
        //   index,
        // })}
        // maxToRenderPerBatch={10}
        // windowSize={5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          // Layout.fill,
          Layout.flexGrow,
          // Layout.justifyContentEnd,
          Gutters.smallBPadding,
        ]}
        style={[Layout.fill]}
        keyExtractor={item => item?.id?.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default CustomList;
